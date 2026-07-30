---
layout: post
title: "Running Winget Upgrade Unattended"
date: 2026-07-29
subtitle: "if updates are available, upgrade all installed apps silently and unattended"
tags: [powershell, winget, windows, automation, elevated]
comments: true
---

**Note: Run As Administrator**

{% include codeHeader.html %}
```powershell
$logPath   = Join-Path $env:TEMP 'winget-upgrade-all.log'
$errorPath = Join-Path $env:TEMP 'winget-upgrade-all-error.log'
$timeoutMs = [int][TimeSpan]::FromMinutes(30).TotalMilliseconds

$arguments = @(
    'upgrade'
    '--all'
    '--silent'
    '--accept-package-agreements'
    '--accept-source-agreements'
    '--include-unknown'
    '--disable-interactivity'
)

$process = Start-Process -FilePath 'winget.exe' `
    -ArgumentList $arguments `
    -NoNewWindow `
    -PassThru `
    -RedirectStandardOutput $logPath `
    -RedirectStandardError $errorPath

try {
    if (-not $process.WaitForExit($timeoutMs)) {
        # Kill winget and any installer processes it launched.
        & taskkill.exe /PID $process.Id /T /F *> $null
        $process.WaitForExit()

        throw "winget exceeded the 30-minute timeout and was terminated."
    }

    $exitCode = $process.ExitCode

    [pscustomobject]@{
        ExitCode = $exitCode
        Succeeded = ($exitCode -eq 0)
        OutputLog = $logPath
        ErrorLog  = $errorPath
    }
}
finally {
    $process.Dispose()
}
```
