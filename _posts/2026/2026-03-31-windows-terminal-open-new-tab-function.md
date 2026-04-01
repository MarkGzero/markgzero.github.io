---
layout: post
title: "Generating Random RGB Colors in PowerShell"
date: 2026-03-31
subtitle: "more complex and interesting that I initially thought"
tags: [powershell, windows-terminal]
comments: true
---

Windows Terminal is one of the best things Microsoft has shipped in years. Tabs, profiles, custom colors, pane splitting, GPU-accelerated text rendering. 

Here's a simple powershell function that 

{% include codeHeader.html %}
```powershell
function nt {
    [cmdletbinding()]
    param(
        [string]$Directory = $env:USERPROFILE,
        [string]$RGB
    )
    # get RGB
    if([string]::isnullorempty($RGB)) {
        $rgb = "#{0:X6}" -f (Get-Random -Minimum 0 -Maximum 0x1000000)
    }
    # wt command    
    wt -w 0 nt -p 'Windows PowerShell' -d $Directory --title 'WinPowerShell' --tabColor $rgb
}
```

The `wt` command is the Windows Terminal CLI. 

`-w 0` targets the current window, 
`nt` opens a new tab, 
`-p` picks the profile, 
`-d` sets the starting directory,
`--title` sets the title, obviously
`--tabColor` helps to visually differentiate the tab from the others. This parameter accepts #RGB value in hex format #000000 to #FFFFFF. 

This line is interesting: 

`$rgb = "#{0:X6}" -f (Get-Random -Minimum 0 -Maximum 16777216)`

We're using the format operator `-f` to format string `"#{0:X6}"` 

`X6` means hexadecimal value padded to 6 places using a random integer value from `(Get-Random -Minimum 0 -Maximum 16777216)`

Other ways to formulate this line:

Formatting three separate string:

`'#{0:X2}{1:X2}{2:X2}' -f (Get-Random -Max 256),(Get-Random -Max 256),(Get-Random -Max 256)`

Or shifting binary 1 to the left 24 places:

`'#{0:X6}' -f (Get-Random (1 -shl 24))`

Essentially, these are different ways to say: "give me random number which could be one of the possible 16,777,216 color values in a 24-bit RGB color space standard then format it as #RRGGBB"

I dont know... just something I personally found interesting. 

Computers are amazing. 