---
layout: post
title: "Parse PowerShell Errors Without IDE/Linter"
date: 2026-02-24
subtitle: "Had no idea, but of course PowerShell includes a error parser."
tags: [powershell]
comments: true
---

Got it — trimmed down, minimal, direct.

---

## Quick Find: Parse Errors Without Running the Script

Was messing around with an LLM. Found something useful.

Instead of running a script to see if it breaks, just ask PowerShell to parse it.

{% include codeHeader.html %}
```powershell
$files = '\\path\to\script1.ps1','\\path\to\script2.ps1'

foreach ($f in $files) {

    $pe = [System.Management.Automation.Language.ParseError[]]@()
    $null = [System.Management.Automation.Language.Parser]::ParseFile($f, [ref]$null, [ref]$pe)

    if ($pe.Count) {
        Write-Host "FAIL $f ($($pe.Count) errors)"
        $pe | ForEach-Object {
            Write-Host "  L$($_.Extent.StartLineNumber): $($_.Message)"
        }
        $errs++
    }
    else {
        Write-Host "OK $f"
    }
}

Write-Host "$errs file(s) with parse errors"
```

Uses the built-in parser. No execution. No side effects. Just syntax.

Good for:

* Pre-commit checks
* CI lint pass
* Bulk script validation

Fast. Native. Works in 5.1 and 7+.

Keeping this one.
