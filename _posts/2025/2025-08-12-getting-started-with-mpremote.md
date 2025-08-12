---
layout: post
title: 'Getting Started with mpremote for MicroPython'
date: '2025-08-12'
excerpt: >-
   Learn what mpremote is, why it’s useful for MicroPython development, and how to install it on your system.
comments: true
---

## Introduction to mpremote

If you’re working with MicroPython on microcontrollers, you’ll often need a convenient way to interact with your device from your computer. This is where `mpremote` comes in. `mpremote` is a command-line tool that allows you to remotely control and interact with MicroPython boards over USB or serial connections.

### What is mpremote?

`mpremote` is an official tool provided by the MicroPython project. It enables you to:

- Run Python code directly on your MicroPython device from your computer.
- Upload and download files to and from the device.
- Access the REPL (interactive prompt) easily.
- Automate tasks such as flashing scripts, managing files, and more.

### Why use mpremote?

- **Convenience:** No need to manually copy files or use less user-friendly serial tools.
- **Automation:** Easily script repetitive tasks for development or deployment.
- **Cross-platform:** Works on Linux, Windows, and macOS.
- **Official support:** Maintained by the MicroPython team, ensuring compatibility and updates.

## Installing mpremote

On Ubuntu and Debian-based systems, you can install `mpremote` using the package manager. Here’s how you can search for and install it:

{% include codeHeader.html %}
```bash
# Search for mpremote package in apt
sudo apt search mpremote

# Example output:
# micropython-mpremote/noble,now 0.4.0-0ubuntu1 all [installed]
#   Tool for interacting remotely with MicroPython on a microcontroller

# Install mpremote
sudo apt install micropython-mpremote

# Example output:
# Reading package lists... Done
# Building dependency tree... Done
# Reading state information... Done
# micropython-mpremote is already the newest version (0.4.0-0ubuntu1).
# 0 upgraded, 0 newly installed, 0 to remove and 7 not upgraded.
```

If you’re using another operating system, you can also install `mpremote` via `pip`:

{% include codeHeader.html %}
```bash
pip install mpremote
```

## mpremote Command Overview

Once installed, you can use the `mpremote` command to interact with your MicroPython device. Here’s how to get help and list available devices:

{% include codeHeader.html %}
```bash
# Show help and available commands
mpremote help
```

Example output:

{% include codeHeader.html %}
```
mpremote -- MicroPython remote control
See https://docs.micropython.org/en/latest/reference/mpremote.html

List of commands:
  connect     connect to given device
  disconnect  disconnect current device
  edit        edit files on the device
  eval        evaluate and print the string
  exec        execute the string
  fs          execute filesystem commands on the device
  help        print help and exit
  mip         install packages from micropython-lib or third-party sources
  mount       mount local directory on device
  repl        connect to given device
  resume      resume a previous mpremote session (will not auto soft-reset)
  run         run the given local script
  soft-reset  perform a soft-reset of the device
  umount      unmount the local directory
  version     print version and exit

```
<a href="https://docs.micropython.org/en/latest/reference/mpremote.html" target="_blank" rel="noopener">See the full official documentation here.</a>
```

To list available USB devices and MicroPython boards:

> **Note:** `lsusb` is a built-in Ubuntu/Linux command for listing all USB devices. It is not part of mpremote, but is useful for confirming your board is connected.

{% include codeHeader.html %}
```bash
lsusb
mpremote connect list
```

Example `lsusb` output:

{% include codeHeader.html %}
```
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 2109:3431 VIA Labs, Inc. Hub
Bus 001 Device 003: ID 2e8a:0005 MicroPython Board in FS mode
Bus 001 Device 004: ID 03e7:2485 Intel Movidius MyriadX
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

Example `mpremote connect list` output:

{% include codeHeader.html %}
```
/dev/ttyACM0 e66164084361382d 2e8a:0005 MicroPython Board in FS mode
/dev/ttyS0 None 0000:0000 None None
```

## Connecting to Your Board and Checking MicroPython Version

To connect to your MicroPython board, use the appropriate shortcut or device path. For example, to connect to `/dev/ttyACM0` (often the default for many boards):

{% include codeHeader.html %}
```bash
mpremote a0
```

Example output:

{% include codeHeader.html %}
```
Connected to MicroPython at /dev/ttyACM0
Use Ctrl-] to exit this shell

>>> import machine
>>> 
```

Once connected, you can run Python commands directly in the REPL. To check your MicroPython version, enter:

{% include codeHeader.html %}
```python
import sys
print(sys.implementation)
(name='micropython', version=(1, 25, 0, ''), _machine='Raspberry Pi Pico W with RP2040', _mpy=4870, _build='RPI_PICO_W')
>>>
```

This will display the MicroPython version and build info for your board.

## Managing Files and Resetting the Board

You can use `mpremote` to manage files on your MicroPython board. For example, to rename a file on the device:

{% include codeHeader.html %}
```bash
mpremote fs mv oldname.py newname.py
```

This renames `oldname.py` to `newname.py` on the board's filesystem.

To reset the board (soft reset):

{% include codeHeader.html %}
```bash
mpremote soft-reset
```

This will perform a soft reset, restarting your MicroPython board without disconnecting it from your computer.

---

Let me know if you want to see example usage for specific commands!

---

### mpremote Full Help (Addendum)

<details>
<summary>Click to expand full mpremote help output</summary>

```
mpremote -- MicroPython remote control
See https://docs.micropython.org/en/latest/reference/mpremote.html

List of commands:
  connect     connect to given device
  disconnect  disconnect current device
  edit        edit files on the device
  eval        evaluate and print the string
  exec        execute the string
  fs          execute filesystem commands on the device
  help        print help and exit
  mip         install packages from micropython-lib or third-party sources
  mount       mount local directory on device
  repl        connect to given device
  resume      resume a previous mpremote session (will not auto soft-reset)
  run         run the given local script
  soft-reset  perform a soft-reset of the device
  umount      unmount the local directory
  version     print version and exit

List of shortcuts:
  --help
  --version
  a0          connect to serial port "/dev/ttyACM0"
  a1          connect to serial port "/dev/ttyACM1"
  a2          connect to serial port "/dev/ttyACM2"
  a3          connect to serial port "/dev/ttyACM3"
  bootloader  make the device enter its bootloader
  c0          connect to serial port "COM0"
  c1          connect to serial port "COM1"
  c2          connect to serial port "COM2"
  c3          connect to serial port "COM3"
  cat
  cp
  devs        list available serial ports
  df
  ls
  mkdir
  reset       reset the device after delay
  rm
  rmdir
  setrtc
  touch
  u0          connect to serial port "/dev/ttyUSB0"
  u1          connect to serial port "/dev/ttyUSB1"
  u2          connect to serial port "/dev/ttyUSB2"
  u3          connect to serial port "/dev/ttyUSB3"
```

</details>
