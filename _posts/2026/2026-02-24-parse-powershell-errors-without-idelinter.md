---
layout: post
title: "Parse PowerShell Errors Without IDE/Linter"
date: 2026-02-24
subtitle: "But of course PowerShell has a built-in error parser."
tags: [powershell]
comments: true
---

I've heard about AST in the PowerShell context before, particularly during this episode of PowerShell Podcast: [Holiday Special with Andrew Pla and Gilbert Sanchez: PSScriptAnalyzer, AST, and PowerShell Gifts: PS Podcast E150](https://www.pdq.com/resources/the-powershell-podcast/ep-150-holiday-special-gilbert-sanchez-psscript-analyzer-ast-powershell-gifts/)

But I admit, I was mostly just jamming along with the episode, vibing with the conversation, and not really absorbing or understanding the details. 

Today, I was messing around with an LLM and I noticed that it would self-check its own code for syntax errors, and I was like, "Wait, how does it do that?" Thankfully, the LLM shows its work, and I was able to see that it was using the built-in PowerShell parser to check for syntax errors without needing an IDE or linter.

It looked something like this:

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

So, it seems that PowerShell has a built-in way to parse scripts and check for syntax errors without needing an IDE or linter. This is pretty cool, and it means that we can quickly check our scripts for syntax errors without needing to open them in an editor or finding out about errors only when we test-run the script.

Of course, purpose-built tools like VSCode with the PowerShell extension or PSScriptAnalyzer will provide more detailed feedback and best practices, but it's good to know that we have this built-in option for quick and dirty syntax checks.