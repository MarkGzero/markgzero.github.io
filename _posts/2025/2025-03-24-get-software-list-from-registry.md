---
layout: post
title: 'Get Installed Software List From Windows Registry'
date: '2025-03-24 12:00:00'
comments: true
---

[Marc Carter wrote a script in 2013](https://devblogs.microsoft.com/scripting/use-powershell-to-find-installed-software/) that I still reference and use today. It's one of the key blog posts that convinced me to learn PowerShell. 

{% include codeHeader.html %}
```powershell
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* | Select-Object DisplayName, DisplayVersion, InstallDate, Publisher
```

Here's how I generally use it.

{% include codeHeader.html %}
```powershell
$apps = Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* | Select-Object DisplayName, DisplayVersion, InstallDate, Publisher
$apps | sort installdate -Descending
```

Read Marc's blog. 
Learn from the critical thinking thought process -- and appreciate PowerShell's consistency even after more than a decade later. 

There's more at [https://devblogs.microsoft.com/scripting/](https://devblogs.microsoft.com/scripting/)
