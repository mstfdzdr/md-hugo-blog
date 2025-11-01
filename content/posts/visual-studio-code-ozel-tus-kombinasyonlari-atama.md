---
title: "Visual Studio Code'a Özel Tuş Kombinasyonları Atama"
subtitle: ""
date: 2023-05-29T11:01:51+03:00
lastmod: 2023-05-29T11:01:51+03:00
tags: ["visual studio code"]
categories: ["Nasıl Yapılır"]
featuredImage: ""
featuredImagePreview: ""
draft: false
toc:
    enable: false
    auto: false
code:
    copy: true
    maxShownLines: 50
---

Jetbrains IDE'lerine alışkın olanların çok sık kullandığı tuş kombinaslarından biri SHIFT tuşuna iki kere basmaktır. Bu alışkanlığımıza Visual Studio Code'da da devam edebiliriz.

<!--more-->

Bunun için Visual Studio Code'da tuş atamalarının bulunduğu menüden özel atamalar yapmak için keybindings.json'u düzenlemek. Aşağıdaki eklemeleri yaparak isteğiniz özelleştirmeleri sağlayabilirsiniz.

SHIFT + SHIFT: VS Code Quick Open Menüsü

```json
{
    "key": "shift shift",
    "command": "workbench.action.quickOpen"
}
```

ALT + ALT: VS Code Command Menüsü

```json
{
    "key": "alt alt",
    "command": "workbench.action.showCommands"
}
```

CTRL + CTRL: VS Code Sidebar Gizle/Göster

```json
{
    "key": "ctrl ctrl",
    "command": "workbench.action.toggleSidebarVisibility"
}
```