---
layout: post
title: 'Identify User Connections to an SQL Server'
date: '2025-04-07'
excerpt: >-
  Discovering who is connected to an SQL Instance
comments: true
---

Before rebooting a server for system administration purposes, it's generally a good idea to make sure users arent actively connected and in the middle of important work. 

IF there are users connected, it could be useful to identify them so they can be properly notified. 

I'm just gonna quickly go over my solution for this problem using PowerShell -- but I'm sure there are many other ways to do the same thing. 

This script works in my environment, where I have administrative privileges in an Active Directory domain and all users and computers are domain-joined. It may need to be modified for other environments.

## The One-Liner

This one-liner will return the users on the host with the IPaddress with an established TCP connection with the sqlservr process running on server SERVER01.

NOTE: `sqlservr` with only one `e` is the correct process name for Microsoft SQL Server. It only looks like a typo.

```powershell
Invoke-Command "SERVER01" {(Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID | Where-Object State -eq "Established" | Select-Object RemoteAddress -Unique).RemoteAddress} | Foreach-Object {quser /server:$_}
```

Again, here's the full one-liner in its full glory

> Invoke-Command "SERVER01" {(Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID | Where-Object State -eq "Established" | Select-Object RemoteAddress -Unique).RemoteAddress} | Foreach-Object {quser /server:$_}

## Breakdown

The one-liner is a combination of several commands and its kind of long. 

Let's break it down to its components to understand the pipeline of commands that will eventually output the desired actionable information, in this case, the name of the user. 

### 1. Get sqlserver process ID

> (Get-Process "sqlservr").ID

### 2. Get TCP connections which belong to the sqlserver instance/s

> Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID


### 3. Filter for `Established` connections and return only unique remote IP address

> Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID | Where-Object State -eq "Established" | Select-Object RemoteAddress -Unique


### 4. Output only the remote IPaddresses

> (Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID | Where-Object State -eq "Established" | Select-Object RemoteAddress -Unique).RemoteAddress


### 5. Execute on remote server using `Invoke-Command`

> Invoke-Command "SERVER01" {(Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID | Where-Object State -eq "Established" | Select-Object RemoteAddress -Unique).RemoteAddress}


### 6. Process returned connection IP addresses and use with `quser` to identify users

> Invoke-Command "SERVER01" {(Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID | Where-Object State -eq "Established" | Select-Object RemoteAddress -Unique).RemoteAddress} | Foreach-Object {quser /server:$_}


## Example Output / Summary

```powershell

 USERNAME              SESSIONNAME        ID  STATE   IDLE TIME  LOGON TIME
>mark.go               console             1  Active      none   4/7/2025 6:34 AM

```
While the output is the familiar output of `quser`, the difference is that we indirectly derived the target machine from just knowing the SQL Server hostname.

-Mark
