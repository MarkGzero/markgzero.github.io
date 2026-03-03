---
layout: post
title: "usbipd-win + WSL2"
date: 2026-03-03
subtitle: "Binding and attaching usb devices from Windows to WSL2"
comments: true
---

**Repo:** [https://github.com/dorssel/usbipd-win](https://github.com/dorssel/usbipd-win)

If you develop on Windows but build, flash, or test inside WSL2, `usbipd-win` is essential. It allows physical USB devices connected to Windows to be attached directly into your WSL2 Linux environment.

This enables:

* FTDI serial adapters
* ESP32 / STM32 flashing
* OpenOCD / JTAG
* USB sensors
* Robotics peripherals

No dual boot. No full VM.

---

## The Problem

WSL2 runs in a lightweight VM. By default:

* Windows sees the USB device
* Linux inside WSL does not

`usbipd-win` bridges Windows USB → WSL2 via USB/IP.

---

# Install

{% include codeHeader.html %}
```powershell
winget install usbipd
```

Verify:

{% include codeHeader.html %}
```powershell
usbipd --version
```

---

# Required WSL Configuration

⚠️ **Bridged networking is NOT supported.**

If you have this in `.wslconfig`:

{% include codeHeader.html %}
```ini
[wsl2]
networkingMode=bridged
```

You will get:

```
usbipd: error: Networking mode 'bridged' is not supported.
```

### Use mirrored mode instead:

{% include codeHeader.html %}
```ini
[wsl2]
networkingMode=mirrored
```

Or remove custom networking entirely.

Restart WSL:

{% include codeHeader.html %}
```powershell
wsl --shutdown
```

---

# Basic Workflow

### 1️⃣ List devices

{% include codeHeader.html %}
```powershell
usbipd list
```

Example:

```
10-1  0403:6001  USB Serial Converter  Not shared
```

---

### 2️⃣ Bind the device

If you see a USBPcap warning, use `--force`:

{% include codeHeader.html %}
```powershell
usbipd bind --busid=10-1 --force
```

---

### 3️⃣ Attach to WSL

{% include codeHeader.html %}
```powershell
usbipd attach --wsl --busid=10-1
```

Expected output:

```
Using WSL distribution 'Ubuntu-24.04'
Detected networking mode 'mirrored'
Using IP address 127.0.0.1
```

---

### 4️⃣ Verify inside WSL

{% include codeHeader.html %}
```bash
lsusb
ls /dev/ttyUSB*
```

Example:

```
/dev/ttyUSB0
```

Now the device behaves like native Linux hardware.

---

# FTDI Example

For:

```
0403:6001  (FT232R)
0403:6014  (FT232H)
```

Inside WSL:

{% include codeHeader.html %}
```bash
dmesg | grep FTDI
```

You should see:

```
ftdi_sio ... attached to ttyUSB0
```

You can now:

* Flash firmware
* Use `screen` or `minicom`
* Run ESP-IDF
* Use OpenOCD

---

# Cleanup

Detach:

{% include codeHeader.html %}
```powershell
usbipd detach --busid=10-1
```

Remove persistent rule if created:

{% include codeHeader.html %}
```powershell
usbipd unbind --busid=10-1
```

---

# Key Rules

* Use **mirrored** networking
* Bridged mode is unsupported
* Re-run `attach` after `wsl --shutdown`
* Do not attach keyboards or critical system devices

---

# Why This Matters

`usbipd-win` removes WSL2’s biggest limitation: lack of USB access.

For embedded development, FTDI workflows, and robotics, it turns WSL2 into a fully capable Linux hardware environment — while keeping Windows as your primary OS.
