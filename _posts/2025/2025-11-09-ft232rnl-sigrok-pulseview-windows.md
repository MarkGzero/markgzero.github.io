---
layout: post
title: Using FT232RNL with Sigrok/Pulseview on Windows
subtitle: Getting FTDI logic analyzer working with proper drivers
date: 2025-11-09
tags: [FTDI, Logic Analyzer, Sigrok, Pulseview, Windows, Hardware, USB]
---

# Using FT232RNL with Sigrok/Pulseview on Windows

## Features at a Glance

https://www.waveshare.com/wiki/USB-TO-TTL-FT232

- Onboard FT232RNL chip - Fast communication, stable and reliable, better compatibility
- Castellated holes design - Compact size, easy to integrate into devices by soldering
- UART communication - Baudrate: 300bps~3Mbps
- Protection features - Onboard self-recovery fuse and ESD diode for over-current/over-voltage protection
- Status indicators - TXD and RXD indicators for monitoring transceiver status
- Voltage switching - Reserved VCC switching pads on the back (default 3.3V TTL, switchable to 5V)
- All pins accessible - Adapting all function pins of the chip for secondary development and integration
- USB Type-C port - Smooth plug & pull, solid and reliable

<div style="text-align: center;">
  <img src="/images/ft232rnl/image-7.png" alt="FT232RNL USB to TTL Module" style="max-width: 600px; margin: 20px auto; display: block;">
</div>

<div style="text-align: center;">
  <img src="/images/ft232rnl/image-8.png" alt="FT232RNL Top View" style="max-width: 600px; margin: 20px auto; display: block;">
</div>

*IC chip closeup, taken with iPhone macro lens*

<div style="text-align: center;">
  <img src="/images/ft232rnl/image-9.png" alt="FT232RNL IC Chip Closeup" style="max-width: 600px; margin: 20px auto; display: block;">
</div>

## The Challenge: Driver Issues on Windows

Getting FTDI chips working as logic analyzers with sigrok/Pulseview on Windows requires the correct driver setup. The default Windows Update driver often doesn't work properly with libsigrok.

### The Problem

When trying to use the FT232RNL with Pulseview, you might encounter this error:

```
sr: ftdi-la: Failed to get the FTDI strings: -4
```

This indicates that Pulseview can't properly communicate with the FTDI device using the current driver.

<div style="text-align: center;">
  <img src="/images/ft232rnl/image-2.png" alt="Pulseview Error Log" style="max-width: 600px; margin: 20px auto; display: block;">
</div>

<div style="text-align: center;">
  <img src="/images/ft232rnl/image.png" alt="Pulseview Device Not Recognized" style="max-width: 600px; margin: 20px auto; display: block;">
</div>

### The Solution: Installing WinUSB Driver

According to the [Sigrok Windows Driver Documentation](https://sigrok.org/wiki/Windows#Drivers), the proper approach is to install the WinUSB driver instead of the default FTDI driver.

**Steps to fix:**

1. Open Zadig - Zadig is included with Pulseview, no separate installation needed. You can find it in your Pulseview installation directory or download it from the [Sigrok Windows setup page](https://sigrok.org/wiki/Windows#Drivers)

2. Install WinUSB driver - Run Zadig and select the FTDI device, then install the WinUSB driver

3. Reconnect device - Disconnect and reconnect the FT232RNL board

4. Restart Pulseview - Close and reopen Pulseview

## Updating the Driver

> &#128276; Each FT232 device operates independently, so its possible to have multiple FTDI devices connected, each requiring its own driver configuration.

Initially, Zadig might show `FTDIBUS (vx.xx)` as the currently installed driver for the FTDI device.

<div style="text-align: center;">
  <img src="/images/ft232rnl/ft232r_ftdibus_driver.png" alt="Original FTDIBUS driver" style="max-width: 600px; margin: 20px auto; display: block;">
</div>

After replacing the original FTDIBUS driver with WinUSB using Zadig, Zadig should show that WinUSB is now the installed driver for the FTDI device.

<div style="text-align: center;">
  <img src="/images/ft232rnl/image-1.png" alt="Installing WinUSB Driver with Zadig" style="max-width: 600px; margin: 20px auto; display: block;">
</div>

## FT232RNL Successfully Recognized as Logic Analyzer device

> &#128276; Only one application can use the FTDI device at a time. Make sure to close Pulseview if using sigrok-cli or vice versa.

After updating the driver to WinUSB and restarting Pulseview, the FTDI device is now recognized properly and ready for logic analysis.

<div style="text-align: center;">
  <img src="/images/ft232rnl/image-4.png" alt="FTDI Device Recognized Successfully" style="max-width: 600px; margin: 20px auto; display: block;">
</div>

Also verified via sigrok-cli, specifying driver `ftdi-la`.

{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
& 'C:\Program Files\sigrok\sigrok-cli\sigrok-cli.exe' --driver ftdi-la --scan
```

or for more verbose logging

{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
& 'C:\Program Files\sigrok\sigrok-cli\sigrok-cli.exe' --driver ftdi-la --scan --loglevel 5
```

<div style="text-align: center;">
  <img src="/images/ft232rnl/sigrok_cli.png" alt="FTDI Device Recognized Successfully" style="max-width: 600px; margin: 20px auto; display: block;">
</div>



For more information about using FTDI chips as logic analyzers, check out the official [Sigrok FTDI-LA documentation](https://sigrok.org/wiki/FTDI-LA).
