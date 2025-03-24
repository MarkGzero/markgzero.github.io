---
layout: post
title: 'Get Install Software List From Windows Registry'
date: '2025-03-24 12:00:00'
comments: true
---

Posting here so I know where to look, next time I need this handy code snippet. 

{% include codeHeader.html %}
```powershell
$regUninstall = Get-ChildItem "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall" 
$InstalledSoftware = @()
foreach($obj in $regUninstall){
    $InstalledSoftware += [pscustomobject]@{
	DisplayName = $obj.GetValue('DisplayName')
	DisplayVersion = $obj.GetValue('DisplayVersion')
	Parent = $obj.GetValue('ParentDisplayName')
	ParentKeyName = $obj.GetValue('ParentKeyName')
	Name = $obj.Name
    }
} 
$InstalledSoftware | ? DisplayName | Sort DisplayName | ft
```

And here's with proper syntax and comments, thanks to AI assistance:

{% include codeHeader.html %}
```
# Define the base registry key for installed software
$UninstallKey = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"

# Create an empty array to store software information
$InstalledSoftware = @()

# Get all subkeys (representing installed applications) under the Uninstall key
Get-ChildItem -Path $UninstallKey | ForEach-Object {
    # Create a custom object for each installed application
    $SoftwareInfo = [PSCustomObject]@{
        DisplayName     = $_.GetValue('DisplayName')
        DisplayVersion  = $_.GetValue('DisplayVersion')
        Parent          = $_.GetValue('ParentDisplayName')
        ParentKeyName   = $_.GetValue('ParentKeyName')
        Name            = $_.Name 
    }

    # Add the software information object to the array
    $InstalledSoftware += $SoftwareInfo
}

# Filter for entries with a DisplayName, sort by DisplayName, and format as a table
$InstalledSoftware | 
    Where-Object { $_.DisplayName } | 
    Sort-Object -Property DisplayName | 
    Format-Table -AutoSize
```
