---
layout: post
title: "Getting USB Devices Working in WSL2"
date: 2026-03-03
subtitle: "When you need that FTDI adapter to show up in Linux"
comments: true
---

I've been running into this issue more and more lately – I'm developing on Windows, but I need to flash firmware or talk to hardware inside WSL2. By default, WSL2 can't see any USB devices connected to Windows, which is... problematic when you're trying to work with FTDI adapters, ESP32s, or pretty much any hardware.

Turns out there's a tool called `usbipd-win` that bridges this gap. It's from [dorssel/usbipd-win](https://github.com/dorssel/usbipd-win) on GitHub and basically lets you share USB devices from Windows into your WSL2 environment.

## The WSL2 USB Problem

WSL2 runs in a lightweight VM, so by default Windows sees your USB device but Linux inside WSL doesn't. This is super annoying if you're doing embedded work, Arduino programming, or anything that needs hardware access.

## Quick Install

{% include codeHeader.html %}
```powershell
winget install usbipd
```

You can verify it worked with:

{% include codeHeader.html %}
```powershell
usbipd --version
```

## The Networking Gotcha

Here's something that caught me off guard – if you're using bridged networking in WSL2, this won't work. I had this in my `.wslconfig`:

{% include codeHeader.html %}
```ini
[wsl2]
networkingMode=bridged
```

And I kept getting this error:

```
usbipd: error: Networking mode 'bridged' is not supported.
```

The fix is to either switch to mirrored mode:

{% include codeHeader.html %}
```ini
[wsl2]
networkingMode=mirrored
```

Or just remove the custom networking entirely. Don't forget to restart WSL after making changes:

{% include codeHeader.html %}
```powershell
wsl --shutdown
```

## Basic Usage

Once you have it set up, the workflow is pretty straightforward. First, see what devices are available:

{% include codeHeader.html %}
```powershell
usbipd list
```

You'll get something like:

```
10-1  0403:6001  USB Serial Converter  Not shared
```

Next, bind the device. Sometimes you need to force it if there are driver conflicts:

{% include codeHeader.html %}
```powershell
usbipd bind --busid=10-1 --force
```

Then attach it to WSL:

{% include codeHeader.html %}
```powershell
usbipd attach --wsl --busid=10-1
```

If everything works, you should see something like:

```
Using WSL distribution 'Ubuntu-24.04'
Detected networking mode 'mirrored'
Using IP address 127.0.0.1
```

Now hop into WSL and check if the device is there:

{% include codeHeader.html %}
```bash
lsusb
ls /dev/ttyUSB*
```

If you see `/dev/ttyUSB0` (or similar), you're good to go.

## FTDI Devices

For FTDI chips like the FT232R or FT232H, you can verify everything is working by checking the kernel messages:

{% include codeHeader.html %}
```bash
dmesg | grep FTDI
```

You should see something about `ftdi_sio` being attached to `ttyUSB0`.

At this point, the device behaves just like it would on a native Linux system. You can flash firmware, use `screen` or `minicom` for serial communication, run ESP-IDF, OpenOCD, or whatever tools you need.

## Cleanup

When you're done, detach the device:

{% include codeHeader.html %}
```powershell
usbipd detach --busid=10-1
```

If you want to remove the persistent binding rule:

{% include codeHeader.html %}
```powershell
usbipd unbind --busid=10-1
```

## Things to Remember

A few things I've learned the hard way: stick with mirrored networking mode if you're customizing WSL networking. Bridged mode just doesn't work with usbipd. Also, after any `wsl --shutdown` you'll need to re-attach your devices. 

Oh, and obviously don't try to share critical system devices like keyboards or mice – that's just asking for trouble.

This has been a game-changer for my workflow. No more dual booting just to flash firmware or debug hardware issues.
