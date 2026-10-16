---
title: "Git Works in GitHub Desktop, So Why Does the Terminal Say \"Authentication failed\"?"
slug: "git-authentication-failed-on-azure-devops-server"
subtitle: "Basic authentication with a PAT on an on-prem Azure DevOps Server"
description: "Why did git fetch fail with Authentication failed on Azure DevOps Server while GitHub Desktop worked fine? The wrong diagnoses and the one-line fix."
date: 2026-10-16T14:14:52+03:00
lastmod: 2026-10-16T14:14:52+03:00
postType: article
tags: [git, azure devops, windows, terminal]
categories: ["How-to"]
featuredImage: ""
draft: false
hiddenFromHomePage: false
toc: true
code:
  maxShownLines: 50
---

I needed to create a new branch in a mobile project. A routine job: `git fetch`, `git branch`, move on. But the very first command gave me this:

```text
fatal: Authentication failed for 'https://azuredevops.company.local/Collection/Project/_git/Project/'
```

Another repo on the same server failed the same way. And on top of that, GitHub Desktop was connecting to the same server without any trouble. This post walks through the road to the fix, the wrong diagnoses I made along the way, and the one-line setting that finally solved it.

If you use an on-prem **Azure DevOps Server** (formerly TFS) and get this error in the terminal, the fix is most likely at the end.

<!--more-->

## Environment

- Windows 11, Git for Windows 2.52
- On-prem Azure DevOps Server, sign-in with domain accounts
- Git Credential Manager (GCM) 2.6.1, i.e. `credential.helper = manager`
- A Personal Access Token (PAT) for authentication

## First finding: the server is up, the credentials are rejected

First I ruled out the network. I sent the server a simple request:

```text
curl -I https://azuredevops.company.local/Collection/Project/_git/Project
→ HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer
WWW-Authenticate: Basic realm="https://azuredevops.company.local/"
WWW-Authenticate: Negotiate
WWW-Authenticate: NTLM
```

That told me two things:

1. **It's not a VPN/network problem.** The server responds.
2. **The server offers four authentication methods:** `Bearer`, `Basic`, `Negotiate` and `NTLM`. Keep this list in mind, it's the key to the whole story.

## Wrong diagnosis #1: "You're not on the team"

I noticed my name wasn't on the project's team, so I added myself as both a member and an administrator. It seemed logical, but the error stayed exactly the same.

I only understood the lesson later: in Azure DevOps, **401** means "you could not be authenticated". If it were a permissions problem I would have seen a **403** or a message like `TF401019`. Besides, team membership doesn't grant repo access by itself, that's a separate security setting.

I also confirmed through the REST API that the PAT itself was valid and had the right permissions:

```text
curl -u ":PAT" https://azuredevops.company.local/Collection/Project/_apis/git/repositories/Project/refs?filter=heads/dev
→ HTTP 200
```

So the repo was readable. Permissions weren't the problem.

## Wrong diagnosis #2: "Delete the old entry"

In Windows Credential Manager I saw an entry named `GitHub - https://azuredevops.company.local/...` and assumed it had gone stale. I deleted it, GitHub Desktop asked me to sign in on the next fetch, I entered my details and it worked. But the terminal still gave the same error.

That's where I learned the second lesson: **GitHub Desktop and Git in the terminal talk to the same server, but they store credentials in different places.**

| | Credential entry name | Used by |
|---|---|---|
| GitHub Desktop | `GitHub - https://server/...` | Its own Git and its own credential handling |
| Git in the terminal | `git:https://server` | Git Credential Manager (GCM) |

The entry I deleted actually belonged to GitHub Desktop. Git in the terminal never used it. Deleting it didn't affect the terminal at all, and it needlessly broke Desktop's own entry.

## A clue: turning on GCM tracing

GCM can produce a trace:

```powershell
$env:GCM_TRACE = "1"
git fetch origin
```

The important part of the output was this:

```text
[GetCredentialAsync] No existing credentials found.
[GenerateCredentialAsync] Checking host for Windows Integrated Authentication...
[GetIsSupportedAsync] Found WWW-Authenticate header for Negotiate
[GetIsSupportedAsync] Found WWW-Authenticate header for NTLM
[GenerateCredentialAsync] Host supports WIA - generating empty credential...
...
[EraseCredentialAsync] No credential was erased.
```

The trace shows two things:

- GCM can't find a stored credential.
- Because the server supports Windows Integrated Authentication (automatic sign-in with your Windows account), GCM generates an **empty username/password**, hands it to Git and **never asks me anything**. On my machine (which isn't joined to the domain) that automatic sign-in fails, and so does the fetch.

### Fix 1: turning off Windows automatic sign-in

```sh
git config --global credential.https://azuredevops.company.local.allowWindowsAuth false
```

This helped, but only halfway: now GCM opened a window and asked for a username and password. I entered them and… `Authentication failed` again.

## Are the credentials right? Testing without Git

I took Git out of the picture and used `curl` to check whether the same username and PAT were really valid:

```powershell
curl.exe -s -o NUL -w "http=%{http_code}`n" -u "DOMAIN\user" "https://azuredevops.company.local/Collection/Project/_git/Project/info/refs?service=git-upload-pack"
```

I typed the PAT at the password prompt. Result: **`http=200`**.

The credentials were correct. With the same details `curl` worked and `git` didn't. So the problem was in **how Git's HTTP client behaved**, not in the credentials. When I disabled GCM completely (`-c credential.helper=`) and let Git prompt by itself, I got the same error, so GCM wasn't the culprit either. Switching the SSL backend to `openssl` didn't change anything.

Something in the prompt caught my eye along the way:

```text
Password for 'https://DOMAIN%5Cuser@azuredevops.company.local':
```

The `\` character showed up as `%5C`, and I thought "maybe this is it". It wasn't. That's just Git displaying the username in URL form. The value sent to the server is the decoded `DOMAIN\user`.

## The real cause: Git picks the "strongest" method

`curl -u` sends **Basic** authentication directly. Git works differently: it first sends the request without credentials, looks at the list of methods in the server's 401 response and, following libcurl's default behavior, picks **the strongest method it sees**. Since the list contains `Negotiate` and `NTLM`, one of those gets chosen instead of Basic. A PAT isn't an NTLM password, so the server rejects it.

That's exactly what the four-line `WWW-Authenticate` list I saw at the start was telling me.

## The fix: forcing Basic up front

The `http.proactiveAuth` setting, added in Git 2.46, makes Git send the given authentication right away on the first request, without negotiating the method:

```sh
git -c credential.helper= -c http.proactiveAuth=basic fetch origin
```

I entered the username and the PAT. This time there was no `fatal`, the command finished quietly. It worked.

To make it permanent, only for that server:

```sh
git config --global http.https://azuredevops.company.local.proactiveAuth basic
git fetch origin
```

On the second command the GCM window opened once, asked for the username and PAT, and saved them. After that, the other repos on the same server worked too, without asking again.

## Summary: the settings that are enough on their own

These were the two settings I needed. `proactiveAuth` is the one that actually solved the problem:

```sh
git config --global http.https://azuredevops.company.local.proactiveAuth basic
git config --global credential.https://azuredevops.company.local.allowWindowsAuth false
```

`allowWindowsAuth false` stops GCM from generating an empty (WIA) credential without asking anything. `proactiveAuth basic` keeps Git from getting stuck on Negotiate/NTLM instead of Basic. Your setup may not need `allowWindowsAuth`, but if you see "Host supports WIA" in the trace output, setting both is the safe choice.

## Lessons learned

1. **401 and 403 aren't the same thing.** 401 is an authentication problem, 403 is a permissions problem. Adding myself to the team was a pointless detour.
2. **Figure out which layer the error is in.** The difference between `curl` (200) and `git` (error) moved the problem from the "credentials" layer to the "Git's HTTP behavior" layer. That single comparison was worth more than a hundred guesses.
3. **GitHub Desktop working doesn't mean the terminal will.** They store credentials in different places and may use different Git binaries. Before deleting an entry, make sure you know which tool it belongs to.
4. **Turn on tracing.** Seeing the "generating empty credential" line with `GCM_TRACE=1` explained why GCM never asked me anything.
5. **Look at the server's `WWW-Authenticate` list.** If you use Git with a PAT against an on-prem server that offers both `Basic` and `Negotiate/NTLM`, you may run into this error again.

## Quick checklist

If you get the same error, go through these in order:

1. Use `curl -I <repo-url>` to see the 401 and the `WWW-Authenticate` headers.
2. Verify the credentials without Git: `curl.exe -u "DOMAIN\user" <repo-url>/info/refs?service=git-upload-pack`. You're looking for `200`.
3. Run `GCM_TRACE=1 git fetch` to see what GCM is doing. If you see "generating empty credential", add `allowWindowsAuth false`.
4. If it still fails, try `git -c credential.helper= -c http.proactiveAuth=basic fetch`.
5. If that works, make `proactiveAuth basic` permanent for that server only.

I hope the next person fighting this error saves a few hours thanks to this post.

> [!NOTE] Note
> The server and domain names in this post are anonymized. Never type your PAT in plain text on the command line or in a URL, use an interactive prompt or a credential manager instead.
