---
layout: post
title: 'Identify User Connections to an SQL Server'
date: '2025-04-07'
excerpt: >-
  Discovering who is connected to an SQL Instance
comments: true
---

## Why?

Before modifying or rebooting a server, its a good idea to make sure users arent actively connected and may be in the middle of some important work. 

If there are users connected, it would be useful to identify who they are so they can be notified. 

I'm sure there are various ways to do accomplish this but I'm just gonna go over the way I've found using PowerShell. 

## The One-Liner

This one-liner will return the user on the host with the IPaddress with an established TCP connection with the sqlservr process running on server SERVER01.

```powershell
Invoke-Command "SERVER01" {(Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID | Where-Object State -eq "Established" | Select-Object RemoteAddress -Unique).RemoteAddress} | Foreach-Object {quser /server:$_}
```
## Breakdown

The one-liner is a combination of several commands and its kind of long. Let's break it down to its components to understand the sequence of commands that will eventually output the desired actionable information, in this case, the name of the user. 

```powershell
# get sqlserver process id
(Get-Process "sqlservr").ID
```
NOTE: Process name is actually `sqlservr` with only one `e`

```powershell
# get tcp connections which belong to the sqlserver instance/s
Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID
```

```powershell
# filter for Established connections and return only unique remote IP address
Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID | Where-Object State -eq "Established" | Select-Object RemoteAddress -Unique
```

```powershell
# output only the remote IPaddresses
(Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID | Where-Object State -eq "Established" | Select-Object RemoteAddress -Unique).RemoteAddress
```

```powershell
# execute on remote server using invoke-command
Invoke-Command "SERVER01" {(Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID | Where-Object State -eq "Established" | Select-Object RemoteAddress -Unique).RemoteAddress}
```

```powershell
# process returned connection IPaddresses and use with quser
Invoke-Command "SERVER01" {(Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID | Where-Object State -eq "Established" | Select-Object RemoteAddress -Unique).RemoteAddress} | Foreach-Object {quser /server:$_}
```

## Example Output / Summary

```powershell
 USERNAME              SESSIONNAME        ID  STATE   IDLE TIME  LOGON TIME
>mark.go               console             1  Active      none   4/7/2025 6:34 AM
```
While the output is the familiar output of `quser`, the difference is that we indirectly derived the target machine from just knowing the SQL Server hostname.

-Mark
