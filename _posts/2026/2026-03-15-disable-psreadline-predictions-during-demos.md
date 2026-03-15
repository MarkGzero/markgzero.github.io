---
layout: post
title: "Disable PSReadLine Predictions During Demos"
date: 2026-03-15
subtitle: "When you dont want people to see your shell history"
tags: [powershell, psreadline]
comments: true
---

I love me some PSReadLine. It's honestly one of those things that once you have it you cant imagine life without. The inline prediction feature in particular is great - it reads your command history and ghost-texts suggestions as you type. Feels like magic.

The problem is when I'm doing a demo or a screen recording. As I start typing, it'll eagerly suggest commands from my history that I really dont want people to see. Internal hostnames, paths, old commands with sensitive-looking parameters, whatever. At best its distracting. At worst its a bit of an "uh oh."

Quick fix; run this in the current session:

{% include codeHeader.html %}
```powershell
Set-PSReadLineOption -PredictionSource None
```

Done. The ghost text goes away. Clean terminal, no awkward suggestions mid-demo.

When I want it back, I just flip it on again:

{% include codeHeader.html %}
```powershell
Set-PSReadLineOption -PredictionSource History
```

Or just open a new session. The defaults from `Get-PSReadLineOption` will apply automatically, so predictions come back on their own. Nothing to clean up.

More info here:  

[learn.microsoft.com --> PSReadLine Module](https://learn.microsoft.com/en-us/powershell/module/psreadline/?view=powershell-5.1)

[learn.microsoft.com --> Set-PSReadLineOption](https://learn.microsoft.com/en-us/powershell/module/psreadline/set-psreadlineoption?view=powershell-7.5&viewFallbackFrom=powershell-7.2&WT.mc_id=ps-gethelp)

[learn.microsoft.com --> Get-PSReadLineOption](https://learn.microsoft.com/en-us/powershell/module/psreadline/get-psreadlineoption?view=powershell-5.1)