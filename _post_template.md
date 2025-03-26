---
layout: post
title: ''
date: ''
excerpt: >-
  Sentence that serves as preview for the post
comments: true
---

## 🧠 Intro – Why This Matters (Casey + Tony)

> One to three sentences max. Hook the reader with real-world relevance or a relatable situation.

Ever tried to run a PowerShell command on a remote machine and got hit with a weird error about “public networks”? Let’s break down what’s going on and how to fix it.

## ⚠️ The Problem

> Briefly state the issue in plain language.

When you run `Enable-PSRemoting`, it might fail if your network is set to Public. This is a security feature, but it can block legit use cases.


## 🛠️ The Fix (Rachel + Tony)

> Straightforward steps with brief commentary. Keep it friendly, not robotic.

```powershell
# Check your current network profile
Get-NetConnectionProfile

# If it's Public, change it to Private
Set-NetConnectionProfile -InterfaceIndex 12 -NetworkCategory Private

# Enable PowerShell Remoting
Enable-PSRemoting -Force
```

*Explain each step briefly in comments or beneath code blocks.*

## 🔍 What’s Actually Happening? (Casey + Tony + Morgan)

> Optional deep dive section for the curious or experienced.*

Windows firewall rules treat Public networks as hostile by default. That’s great at a coffee shop—bad in your home lab. By switching to Private, you let WinRM through the firewall so PSRemoting can work.

## 🧰 Pro Tips / Gotchas (Tony + Morgan)

> - Use `-Force` to skip prompts, but only if you know what it does.  
> - Double-check firewall exceptions under `Windows Defender Firewall with Advanced Security`.  
> - In enterprise environments, Group Policy might reset your network type or block WinRM.



## 🔐 Security Note (Morgan)

> Reassure pros that you’re not recommending risky behavior blindly.

 Never mark a network as Private unless it’s trusted. If you’re in a corporate environment, coordinate with your security team and follow policy.



## 🎉 Wrap-Up

 PSRemoting is one of the most powerful tools in your sysadmin toolkit. Getting it working reliably means faster troubleshooting, better automation, and fewer walks to the server room.


### Tags: `PowerShell`, `Sysadmin Basics`, `Networking`, `Beginner Friendly`, `Remote Management`

