---
layout: post
title: 'Using WinEvent to list Windows Update installs'
date: '2025-03-24 09:00:00'
comments: true
---

# Using WinEvent to list Windows Update installs

There are many reasons to review when/if Windows Update installs occur; if successful or not, etc...

One of the quickest and reliable ways I've encountered so far is by using WinEvent provider `Microsoft-Windows-WindowsUpdateClient`

Below is an example script, using `Get-WinEvent`. I prefer using a hashtable for filtering. More info about that here: ![link](https://learn.microsoft.com/en-us/powershell/scripting/samples/creating-get-winevent-queries-with-filterhashtable?view=powershell-5.1)

I'm going back 30 days, and im opting to filter in only events with "installation" in the message, and filter out any events for KB2267602 in this case. 

{% include codeHeader.html %}
```powershell
get-winevent -FilterHashtable @{
Providername="Microsoft-Windows-WindowsUpdateClient"
starttime=(get-date).AddDays(-30)} | 
? message -match installation | 
? message -notmatch KB2267602 | 
ft -AutoSize -Wrap
```

Example output

![image](https://github.com/user-attachments/assets/efca5b54-9daa-4625-aea4-819ab0c85654)
