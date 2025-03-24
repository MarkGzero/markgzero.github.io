---
layout: post
title: 'Using WinEvent to review Windows Update installs'
date: '2025-03-24 09:00:00'
comments: true
---

There are many reasons to review when/if Windows Update installs occur; if successful or not, etc...

One of the quickest and reliable ways I've encountered so far is by using WinEvent provider `Microsoft-Windows-WindowsUpdateClient`

Below is an example script, using `Get-WinEvent`. I prefer using a hashtable for filtering. More info about that here: [Creating Get-WinEvent queries with FilterHashtable](https://learn.microsoft.com/en-us/powershell/scripting/samples/creating-get-winevent-queries-with-filterhashtable?view=powershell-5.1)

I'm going back 30 days and filtering for events with "installation" in the event message while filtering out any events for KB2267602 in this case, which are usually just security definition updates and add unnecessary noise to the results. 

{% include codeHeader.html %}
```powershell
get-winevent -FilterHashtable @{
Providername="Microsoft-Windows-WindowsUpdateClient"
starttime=(get-date).AddDays(-30)} | 
? message -match installation | 
? message -notmatch KB2267602 | 
ft -auto -wrap
```

## Example output

![image](https://github.com/user-attachments/assets/efca5b54-9daa-4625-aea4-819ab0c85654)

## Proper syntax

I asked an AI assistant to rewrite my code according to recommended syntax/formatting: 

{% include codeHeader.html %}
```powershell
# Define the start time for event log retrieval (30 days ago)
$StartTime = (Get-Date).AddDays(-30)

# Get events from Windows Update Client log within the specified time frame
Get-WinEvent -FilterHashtable @{
    ProviderName = "Microsoft-Windows-WindowsUpdateClient"
    StartTime     = $StartTime
} | Where-Object { 
    $_.Message -match "installation" -and $_.Message -notmatch "KB2267602"
} | Format-Table -AutoSize -Wrap 

```
