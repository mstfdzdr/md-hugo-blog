---
title: "Why Did Shottr Keep Quitting on macOS 27? The Culprit Was an App I Never Expected"
slug: "why-shottr-kept-quitting-on-macos-27"
subtitle: ""
date: 2026-10-08T23:54:21+03:00
lastmod: 2026-10-08T23:54:21+03:00
postType: article
tags: [macos]
categories: []
featuredImage: ""
draft: false
hiddenFromHomePage: false
toc: true
code:
  maxShownLines: 50
---

For a while now I've been using **Shottr** to take screenshots on my Mac. It's light, fast, and does almost everything I need. It's especially handy for quickly adding arrows, boxes or blur on top of a screenshot.

But after upgrading to macOS 27, I started running into a strange problem.

Normally Shottr keeps running quietly in the macOS menu bar. When I take a screenshot, the Shottr window opens, I do what I need to do and close the window. The app itself keeps running in the background.

At least, that's how it's supposed to work.

On my Mac, though, **Shottr quit completely the moment I closed the window.**

At first I assumed it was a compatibility issue with macOS 27.

I was wrong.

The real culprit was a completely different app I would never have thought of.

## Why does Shottr quit?

The problem was pretty simple:

> I close the screenshot window → Shottr disappears from the menu bar → Shottr quits completely.

On top of that, when I opened the app again, everything worked normally.

I'd take another screenshot, close the window, and Shottr would quit again.

Since this started right after I upgraded to macOS 27, my first suspect was naturally macOS.

### First suspect: macOS 27

This suspicion wasn't entirely unfounded.

Recent Shottr releases included compatibility fixes for macOS 27, and I was already on Shottr **1.9.3**.

There were also reports of various compatibility problems with some menu bar and background apps on macOS 27.

So my first theory was:

> "macOS 27 probably changed how menu bar apps work, and Shottr was affected by it."

But I needed to confirm one thing first:

**Was Shottr really quitting, or was only its menu bar icon disappearing?**

## The first Terminal test

The easiest way to find out was to look at the running processes.

I opened Terminal and ran:

```
pgrep -alf Shottr
```

If Shottr is running, this should return a result.

But after Shottr closed, the command returned nothing.

That mattered.

Because Shottr wasn't just disappearing from the menu bar.

**The process had really exited.**

## No crash report either

The next step was to check macOS's Crash Reports.

But there was no crash report for Shottr there either.

So I was looking at an interesting picture:

- Shottr is running.
- I take a screenshot.
- I close the Shottr window.
- Shottr quits completely.
- `pgrep -alf Shottr` returns nothing.
- No crash report is created.

So why was Shottr quitting?

At this point, instead of guessing, I decided to look at macOS's own logs.

## Watching macOS logs from Terminal

I ran this command in Terminal:

```
log stream --style compact --level info --predicate 'process == "Shottr" OR eventMessage CONTAINS[c] "Shottr"'
```

This command lets you watch the macOS logs live.

I left Terminal open.

Then I opened Shottr again.

Took a screenshot.

Closed the window.

Shottr quit again.

And I looked at the logs in Terminal.

This is where things started to get interesting.

## Shottr wasn't crashing

I saw this line in the logs:

```
[com.apple.AppKit:Application] Attempting sudden termination (2nd attempt)
```

Right after it:

```
[com.apple.AppKit:Application] Termination complete. Exiting without sudden termination.
```

Then:

```
LSExitStatus=0
```

and:

```
Process exited: <RBSProcessExitContext| voluntary>.
```

The word **voluntary** here stood out in particular.

Shottr hadn't crashed.

It didn't look like macOS had force-killed Shottr either.

The process had exited normally.

So the question now was:

> **Why is Shottr quitting itself?**

## An unexpected name in the logs

Looking at the logs a bit more carefully, another app's name caught my eye:

**Vorssaint.**

And it was one of the apps running on my Mac.

Vorssaint's purpose is to help automatically quit apps you aren't using on your Mac.

That's when the pieces started falling into place.

Could Vorssaint be treating Shottr as "no longer in use" and quitting it automatically?

There was an easy way to find out.

## The simplest test: quit Vorssaint

I quit Vorssaint completely.

Then I launched Shottr again.

Took a screenshot.

Closed the Shottr window.

And...

**Shottr didn't quit.**

It stayed in the menu bar.

I took another screenshot.

Closed the window.

It still didn't quit.

Problem solved.

## The real cause

The scenario I had in mind at the start was this:

```
macOS 27
   ↓
Shottr compatibility problem
   ↓
Shottr quits
```

But what was actually happening was this:

```
Shottr is running
   ↓
The screenshot window closes
   ↓
Vorssaint treats Shottr as an unused app
   ↓
Shottr quits
```

So the problem was **neither macOS 27 itself nor Shottr crashing.**

Shottr was being terminated automatically by another app.

## Why were the Terminal logs so useful?

The nice thing about this whole episode is that, instead of solving it by guesswork, macOS was actually giving us the answer in its logs.

For example:

```
LSExitStatus=0
```

was one of the key clues that Shottr was not quitting because of a classic crash.

This line was even more telling:

```
Process exited: <RBSProcessExitContext| voluntary>.
```

And the `pgrep` test confirmed that the Shottr process was really gone.

Finally, seeing Vorssaint in the logs gave us something concrete to suspect.

Quitting Vorssaint and trying again confirmed the diagnosis.

## If Shottr keeps quitting on your macOS 27 too

If you've also noticed that Shottr quits completely when you close its screenshot window after upgrading to macOS 27, it's worth checking for **automatic app-quitting tools** running in the background before you delete and reinstall Shottr.

Apps like Vorssaint in particular can cause this behaviour.

First, to check whether Shottr is really running, you can use:

```
pgrep -alf Shottr
```

Then, to watch Shottr's macOS logs live, this command is very handy:

```
log stream --style compact --level info --predicate 'process == "Shottr" OR eventMessage CONTAINS[c] "Shottr"'
```

When Shottr quits, look especially for lines like these:

```
Termination complete
```

```
LSExitStatus=0
```

```
Process exited: ... voluntary
```

They can help you tell that the app did not quit because of a classic crash.

## Conclusion

This small problem reminded me once again that:

**An app quitting doesn't always mean the app crashed.**

Especially with apps running in the background on macOS, Login Items, LaunchServices, RunningBoard and other helper apps can all be part of the picture.

At first I blamed macOS 27, too.

I researched Shottr's compatibility with the new macOS release.

Checked the crash reports.

Checked the process.

Finally, I followed the macOS logs in Terminal.

And thanks to a few lines of logs, I found that the problem was actually **Vorssaint automatically quitting Shottr**.

In short:

> **Shottr wasn't broken. macOS wasn't killing Shottr either. Vorssaint was just doing its job a little too well.** 😄
