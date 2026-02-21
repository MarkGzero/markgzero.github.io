---
layout: post
title: "mpremote example: run code from device memory, install missing module"
date: 2026-02-11
subtitle: "demo example how to run code on device memory and install missing module if needed; great for rapid prototyping"
excerpt: >-
  this is a mpremote demo/example: how to run code on device memory and install missing module if needed; great for rapid prototyping
tags: [micropython, mpremote]
comments: true
---

I've installed `mpremote` on my Windows11 host computer. 

mpremote found a microcontroller (mcu) board running micropython at serial port COM5 and automatically connected to it: 

{% include codeHeader.html %}
```python
> mpremote
Connected to MicroPython at COM5
Use Ctrl-] or Ctrl-x to exit this shell

>>>
```

Now, I want to take a script from a local folder and run it on the mcu memory. This eliminates the need for copy/paste/upload operations, enabling rapid testing and prototyping. 

The script file is located in a WSL folder. `"\\wsl.localhost\Ubuntu-
24.04\home\pathto\localscript.py"` and its supposed to scan for an ssd1306 OLED module connected to the mcu via I2C. 

`mpremote` supports this using the `run <path>` command. 

{% include codeHeader.html %}
```error
> mpremote run "\\wsl.localhost\Ubuntu-24.04\home\pathto\micropython_flag.py"
Traceback (most recent call last):
  File "<stdin>", line 9, in <module>
ImportError: no module named 'ssd1306'
```

However, the script failed to run and we're seeing an error because I've neglected to install the `ssd1306` module that the script needs to import. 

Luckily, mpremote makes installation of modules super-simple by using the `mip install <modulename>` command

{% include codeHeader.html %}
```python
> mpremote mip install ssd1306
Install ssd1306
Installing ssd1306 (latest) from https://micropython.org/pi/v2 to /lib
Installing: /lib/ssd1306.mpy
Done
```

After installing the missing module, the script is able to run. 

{% include codeHeader.html %}
```python
mpremote run "\\wsl.localhost\Ubuntu-24.04\home\botmanager\summitpiserver\mcu\micropython_flag.py"
I2C devices found: ['0x3c']
SSD1306 initialized successfully
```

`mpremote` is such an amazing little command-line utility. 