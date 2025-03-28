---
layout: post
title: 'Enable-PSRemoting: public network connection type?'
date: '2025-03-25 13:46'
excerpt: >-
  Enable-PSRemoting fails. What's this about a public network connection type? 
comments: true
---

## When Enable-PSRemoting fails

The ability to remotely execute commands is crucial for system admins. 

This blog post is just a superficial review of this particular issue that I encounter occasionally whenever I try to run [Enable-PSRemoting](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/enable-psremoting?view=powershell-7.5) -- but it fails. 

![image](https://github.com/user-attachments/assets/a77b2e5d-719b-4e1b-bb8d-7acffabe8096)

In the command output, there's a single white line that states 
> WinRM is already set up to receive requests on this computer.

Followed by an error message block. Which is somewhat confusing, because it looks like it did something and worked... but also didnt? 

As a young system admin, I used to just look at the wall of red text as a singular "ERROR" wall, refuse to read it, and keep trying other things -- figuratively and literally throwing various google-fu crap at the system until something sticks.

These days, I know better. (...usually)

If we actually look closely at the red text, it clearly states that: 

> WinRM firewall exception will not work since one of the network connection types on this machine is set to Public. Change the network connection type to either Domain or Private and try again. 

So... seems PSremoting can't be enabled because of a network connection type. But, how do I fix that? 

## Get-NetAdapter

First thing I checked was `Get-NetAdapter`

![image](https://github.com/user-attachments/assets/27c4bf85-0a19-404c-ade2-500294c09cbd)

But not a lot there.

## Get-NetConnectionProfile 

Then I tried `Get-NetConnectionProfile` 

![image](https://github.com/user-attachments/assets/c9f7966e-86be-4792-9a26-1dee26eab281)

From the output, I can see network interface index `16` is set to `NetworkCategory: Public`. That seems to be what's causing the error.

But now what? 

Peeking at the [Related Links](https://learn.microsoft.com/en-us/powershell/module/netconnection/get-netconnectionprofile?view=windowsserver2025-ps#related-links) section of the online help page for `Get-NetConnectionProfile`, we see a link to `Set-NetConnectionProfile`. That should be a clue. 

## Set-NetConnectionProfile

With `Set-NetConnectionProfile` it's possible to programatically modify the connection type/category. 

After setting the network category to "Private", I'm able to successfully run `Enable-PSRemoting -Force` this time. 

![image](https://github.com/user-attachments/assets/6e711a24-5b98-4ce7-a9e3-edce84695787)

## Summary

From a [Microsoft web page about network settings](https://support.microsoft.com/en-us/windows/essential-network-settings-and-tasks-in-windows-f21a9bbc-c582-55cd-35e0-73431160a1b9)

> Public network (Recommended). Use this for networks you connect to at home, work, or in a public place. You should use this in most cases. Your PC will be hidden from other devices on the network. Therefore, you can’t use your PC for file and printer sharing.

> Private network. Your PC is discoverable to other devices on the network, and you can use your PC for file and printer sharing. You should know and trust the people and devices on the network.

There's more to it than just these two definitions, but that's good enough for this post. 

## References: 

[Enable-PSRemoting](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/enable-psremoting?view=powershell-5.1)  
[Get-NetAdapter](https://learn.microsoft.com/en-us/powershell/module/netadapter/get-netadapter?view=windowsserver2025-ps)  
[Get-NetConnectionProfile](https://learn.microsoft.com/en-us/powershell/module/netconnection/get-netconnectionprofile?view=windowsserver2025-ps)  
[Set-NetConnectionProfile](https://learn.microsoft.com/en-us/powershell/module/netconnection/set-netconnectionprofile?view=windowsserver2025-ps)  
[about_PSSessions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pssessions?view=powershell-5.1)  
[about_PSSession_Details](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pssession_details?view=powershell-5.1)  
[about_Remote_Troubleshooting](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_troubleshooting?view=powershell-5.1)   
[Chapter 8 - PowerShell remoting](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/08-powershell-remoting?view=powershell-5.1)   




