---
layout: post
title: 'First Steps'
date: '2025-03-23 09:00:00'
excerpt: >-
  Let's get this started.
comments: true
---

<div class="alert alert-info">
<strong>UPDATE: 2025-03-25T11:32: </strong>
still trying to add copy buttons to code blocks.
</div>


# My First Post

Hello, world! This is my first post on my new blog. 

## Setting Up My Blog

How I built this blog:

While I'd like to say that I built this blog from scratch, the truth is that... I didnt. 

I just forked it from [kratzert kratzert.github.io](https://github.com/kratzert/kratzert.github.io) then I just changed some files and added my own content.

Thanks, Kratzert! :)

## Testing codeblock

### PowerShell script

using standard `markdown` formatting for PowerShell code blocks, with a header include for the copy button.

{% include codeHeader.html %}
```powershell
Write-Host "Hello, World!"

$isAdmin = [bool]([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
    Write-Host "Running as Administrator"
} else {
    Write-Host "Not running as Administrator"
}
```

using `kramdown` formatting for PowerShell code blocks. 

~~~
Write-Host "Hello, World!"
$isAdmin = [bool]([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
    Write-Host "Running as Administrator"
} else {
    Write-Host "Not running as Administrator"
}
~~~
{: .language-powershell}

testing `kramdown` formatting for PowerShell code blocks using four spaces or 1 tab, instead of backticks or tildes.

    Write-Host "Hello, World!"
    $isAdmin = [bool]([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if ($isAdmin) {
        Write-Host "Running as Administrator"
    } else {
        Write-Host "Not running as Administrator"
    }
{: .language-powershell}

### Bash script

```bash
echo "Hello, World!"
```

### Python script

```python
print("Hello, World!")
```

### C# 

```csharp
using System;
class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
    }
}
```

## Images

<div class="fig figcenter fighighlight">
  <div class="figcaption"><br> Example of PSGadget serial stream in a PowerShell console<br>
  <img src="/images/psgadgets/psgadget_serial.png" alt="PSGadget Serial example" />
  </div>
</div>


## Summary

That's it for now. Just a quick hello and a test of the blogging platform. 

