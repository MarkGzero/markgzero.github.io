---
layout: post
title: FTDI Devices on Ubuntu
subtitle: How to check for FTDI USB-to-Serial adapters on Ubuntu using command line tools
date: 2025-12-14
categories: 
tags: [ubuntu, ftdi, usb, linux]
author: Mark Go
---

FTDI devices are commonly used USB-to-Serial adapters, common enough that many operating systems have built-in support for them.

I'm using Ubuntu and these are a few commands I found useful for checking FTDI device connections.

## Checking FTDI driver modules

`lsmod` = list loaded kernel modules. 

Ubuntu should already have the `ftdi_sio` and `usbserial` modules available.

{% include codeHeader.html %}
```bash
lsmod | grep ftdi
```

Example output: 
{% include codeHeader.html %}
```bash
ftdi_sio               69632  0
usbserial              69632  1 ftdi_sio
```

## Using dmesg to Monitor FTDI Device Connections

monitor system messages to see how the kernel recognizes device connections and disconnections. 

`dmesg` = Display Message Buffer (Kernel Logs)

the `-w` flag allows you to watch the log in real-time.

{% include codeHeader.html %}
```bash
sudo dmesg -w
```

Example log output when plugging in an FTDI USB-to-Serial adapter:

{% include codeHeader.html %}
```bash
[ 4632.035366] usb 1-3: New USB device found, idVendor=0403, idProduct=6001, bcdDevice= 6.00
[ 4632.035394] usb 1-3: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[ 4632.035406] usb 1-3: Product: FT232R USB UART
[ 4632.035415] usb 1-3: Manufacturer: FTDI
[ 4632.035424] usb 1-3: SerialNumber: BG01B7VJ
[ 4632.042017] ftdi_sio 1-3:1.0: FTDI USB Serial Device converter detected
[ 4632.042165] usb 1-3: Detected FT232R
[ 4632.044922] usb 1-3: FTDI USB Serial Device converter now attached to ttyUSB0
```

## Verifying FTDI Device recognition

Once the FTDI device is connected, you can verify that it has been recognized. 

`lsusb` = List USB devices

{% include codeHeader.html %}
```bash
lsusb
```

If successfully detected, you should see a new device like `/dev/ttyUSB0` created.

{% include codeHeader.html %}
```bash
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 04ca:7070 Lite-On Technology Corp. Integrated Camera
Bus 001 Device 003: ID 8087:0025 Intel Corp. Wireless-AC 9260 Bluetooth Adapter
Bus 001 Device 004: ID 0403:6001 Future Technology Devices International, Ltd FT232 Serial (UART) IC
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
```

## Driver vs D2XX API

The above methods use the built-in FTDI drivers included with Ubuntu. However, these drivers does not support all features of FTDI devices, such as bit-bang mode or advanced MPSSE configuration options.

Additionally, these default drivers prevent the use of D2XX API. To fully utilize FTDI devices with the D2XX API, it's necessary to remove or blacklist the default drivers first then switch to the D2XX API.

