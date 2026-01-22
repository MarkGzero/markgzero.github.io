---
layout: post
title: Monitoring (USB) Device Change Events with PowerShell
subtitle: Capture system device changes using WMI to quickly identify connected or disconnected hardware
date: 2025-11-16
categories: 
tags: [powerShell, WMI, Device Monitoring, USB, HID]
author: Mark Go
---



```powershell
function Start-WMIDeviceChangeMonitor {
    [CmdletBinding()]
    param()

    $sourceId = "DeviceChangeEvent"
    $query    = "SELECT * FROM Win32_DeviceChangeEvent"

    # Clean stale subscriptions from previous runs
    Unregister-Event -SourceIdentifier $sourceId -ErrorAction SilentlyContinue
    Get-Event       -SourceIdentifier $sourceId -ErrorAction SilentlyContinue | Remove-Event

    Write-Host "Listening for system plug-and-play (PnP) device changes... (Ctrl+C to stop)`n"

    # Baseline snapshot
    $before = Get-PnpDevice | 
              Select-Object InstanceId, Status, Class, FriendlyName

    # Register new event subscription
    $subscription = Register-WmiEvent -Query $query -SourceIdentifier $sourceId

    try {
        while ($true) {

            # Wait for a Win32_DeviceChangeEvent
            $evt = Wait-Event -SourceIdentifier $sourceId

            # Remove from event queue
            Remove-Event -EventIdentifier $evt.EventIdentifier -ErrorAction SilentlyContinue

            Write-Verbose ("Event Fired: {0}" -f ($evt.SourceEventArgs.NewEvent | Out-String | select-string -pattern "EventType|TIME_CREATED"))

            # Decode type
            $etype = $evt.SourceEventArgs.NewEvent.EventType
            switch ($etype) {
                1 { $type = "ConfigChanged" }
                2 { $type = "DeviceArrival" }
                3 { $type = "DeviceRemoval" }
                default { $type = "Unknown($etype)" }
            }

            # New snapshot
            $after = Get-PnpDevice |
                     Select-Object InstanceId, Status, Class, FriendlyName

            # Compute add/remove
            $diff = Compare-Object $before $after -Property InstanceId -PassThru

            $added   = $diff | Where-Object {$_.SideIndicator -eq "=>"}
            $removed = $diff | Where-Object {$_.SideIndicator -eq "<="}

            # Compute changed devices
            $changed = @()
            $common = $after | Where-Object InstanceId -in $before.InstanceId
            foreach ($dev in $common) {
                $old = $before | Where-Object InstanceId -eq $dev.InstanceId
                if ($old) {
                    if ($old.Status       -ne $dev.Status       -or
                        $old.Class        -ne $dev.Class        -or
                        $old.FriendlyName -ne $dev.FriendlyName) {
                        $changed += $dev
                    }
                }
            }

            # Update baseline
            $before = $after

            # Output arrivals
            if ($added) {
                foreach ($dev in $added) {
                    [pscustomobject]@{
                        Action       = "Arrival"
                        Timestamp    = Get-Date
                        InstanceId   = $dev.InstanceId
                        FriendlyName = $dev.FriendlyName
                        Class        = $dev.Class
                        Status       = $dev.Status
                    } | Format-List
                }
            }

            # Output removals
            if ($removed) {
                foreach ($dev in $removed) {
                    [pscustomobject]@{
                        Action       = "Removal"
                        Timestamp    = Get-Date
                        InstanceId   = $dev.InstanceId
                        FriendlyName = $dev.FriendlyName
                        Class        = $dev.Class
                        Status       = $dev.Status
                    } | Format-List
                }
            }

            # Output config changes
            if ($changed -and $type -eq "ConfigChanged") {
                foreach ($dev in $changed) {
                    [pscustomobject]@{
                        Action       = "Updated"
                        Timestamp    = Get-Date
                        InstanceId   = $dev.InstanceId
                        FriendlyName = $dev.FriendlyName
                        Class        = $dev.Class
                        Status       = $dev.Status
                    } | Format-List
                }
            }
        }
    }
    finally {

        Write-Host "`nCleanup..." -ForegroundColor Yellow

        # Cleanup subscription + queued events
        Unregister-Event -SourceIdentifier $sourceId -ErrorAction SilentlyContinue
        Get-Event -SourceIdentifier $sourceId -ErrorAction SilentlyContinue |
            Remove-Event -ErrorAction SilentlyContinue

        # Dispose watcher
        if ($subscription -and $subscription.SourceObject) {
            try { $subscription.SourceObject.Stop() } catch {}
            try { $subscription.SourceObject.Dispose() } catch {}
        }

        Write-Host "Done." -ForegroundColor Green
    }
}

```