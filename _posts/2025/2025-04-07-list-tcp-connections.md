---
layout: post
title: 'Identify Computer and User Connections to an SQL Server'
date: '2025-04-07'
excerpt: >-
  Discovering who is connected to an SQL Instance
comments: true
---

Before rebooting an SQL server for system administration purposes, it's generally a good idea to make sure users arent actively connected and in the middle of important work. 

IF there are users connected, it could be useful to identify them so they can be properly notified. 

I'm just gonna quickly go over my solution for this problem using PowerShell -- but I'm sure there are many other ways to do the same thing. 

This script works in my environment, where I have administrative privileges in an Active Directory domain and all users and computers are domain-joined. It may need to be modified for other environments.

## Script

Run this from an elevated PowerShell console:

```powershell 
Invoke-Command -ComputerName "SERVER01" {
  (Get-NetTCPConnection -OwningProcess (Get-Process "sqlservr").ID |
  Where-Object State -eq "Established" |
  Select-Object RemoteAddress -Unique).RemoteAddress
  } | 
Foreach-Object {
  if($_){
    # output quser of remote address machine
    $_;quser /server:$_
  } else {
    # output message to host
    "no sqlservr connections"
  }
}
```
## Breakdown 

- **Invoke remote command on SERVER01** using `Invoke-Command`.
  
- **Retrieve the process ID for `sqlservr`** (SQL Server) on SERVER01 using `Get-Process`.

- **Get all TCP connections owned by the SQL Server process** using `Get-NetTCPConnection -OwningProcess`.

- **Filter for connections that are in the "Established" state** using `Where-Object State -eq "Established"`.

- **Select only the unique remote addresses** from the established connections using `Select-Object RemoteAddress -Unique`.

- **Return just the IP addresses** (`RemoteAddress` property) to the local session.

- **Iterate over each remote IP address** using `ForEach-Object`.

  - **If the IP address exists (`$_` is not null)**:
    - Output the IP address.
    - Run `quser /server:$_` to query active user sessions on the remote machine.

  - **If no connections are found (`$_` is null)**:
    - Output the message `"no sqlservr connections"` to the host.
