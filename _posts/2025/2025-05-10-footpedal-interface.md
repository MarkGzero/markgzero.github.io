---
layout: post
title: 'Reading Raw Data from a Foot Pedal HID'
date: '2025-05-10'
excerpt: >-
   Learning to read raw data from a foot pedal HID device using C# and the Windows API.
comments: true
---

## Reading Raw Data from a Foot Pedal HID

(more info to come)

<img src="/images/olympus_footpedal.png" alt="Olympus RS31H">


{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
$source = @"
using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Windows.Forms;

public class RawInputForm : Form
{
    [StructLayout(LayoutKind.Sequential)]
    struct RAWINPUTDEVICE
    {
        public ushort usUsagePage;
        public ushort usUsage;
        public uint dwFlags;
        public IntPtr hwndTarget;
    }

    [StructLayout(LayoutKind.Sequential)]
    struct RAWINPUTHEADER
    {
        public int dwType;
        public int dwSize;
        public IntPtr hDevice;
        public IntPtr wParam;
    }

    [StructLayout(LayoutKind.Sequential)]
    struct RAWHID
    {
        public int dwSizeHid;
        public int dwCount;
        public byte bRawData; // Actual data follows this byte
    }

    [DllImport("user32.dll", SetLastError = true)]
    static extern bool RegisterRawInputDevices(RAWINPUTDEVICE[] pRawInputDevices, uint uiNumDevices, uint cbSize);

    [DllImport("user32.dll")]
    static extern uint GetRawInputData(IntPtr hRawInput, uint uiCommand, IntPtr pData, ref uint pcbSize, uint cbSizeHeader);

    const int WM_INPUT = 0x00FF;
    const uint RIDEV_INPUTSINK = 0x00000100;
    const uint RID_INPUT = 0x10000003;

    public RawInputForm()
    {
        this.Load += new EventHandler(this.OnLoad);
    }

    public void KeepAlive() { } // Suppress PowerShell warning

    private void OnLoad(object sender, EventArgs e)
    {
        RAWINPUTDEVICE[] rid = new RAWINPUTDEVICE[1];
        rid[0].usUsagePage = 0x0C;
        rid[0].usUsage = 0x01;
        rid[0].dwFlags = RIDEV_INPUTSINK;
        rid[0].hwndTarget = this.Handle;

        if (!RegisterRawInputDevices(rid, (uint)rid.Length, (uint)Marshal.SizeOf(typeof(RAWINPUTDEVICE))))
        {
            MessageBox.Show("Failed to register raw input device.");
        }
    }

    protected override void WndProc(ref Message m)
    {
        if (m.Msg == WM_INPUT)
        {
            uint dwSize = 0;
            GetRawInputData(m.LParam, RID_INPUT, IntPtr.Zero, ref dwSize, (uint)Marshal.SizeOf(typeof(RAWINPUTHEADER)));

            IntPtr buffer = Marshal.AllocHGlobal((int)dwSize);
            GetRawInputData(m.LParam, RID_INPUT, buffer, ref dwSize, (uint)Marshal.SizeOf(typeof(RAWINPUTHEADER)));

            byte[] rawData = new byte[dwSize];
            Marshal.Copy(buffer, rawData, 0, (int)dwSize);
            Marshal.FreeHGlobal(buffer);

            StringBuilder sb = new StringBuilder();
            sb.AppendLine("Raw Input Data:");
            for (int i = 0; i < rawData.Length; i++)
            {
                sb.AppendFormat("{0:X2} ", rawData[i]);
            }
            sb.AppendLine();

            if (rawData.Length >= 36)
            {
                int usageId = BitConverter.ToInt32(rawData, 24);
                if (usageId != 0)
                {
                    sb.AppendLine(String.Format("Detected Usage ID: 0x{0:X}", usageId));
                }

                int buttonCode32 = BitConverter.ToInt32(rawData, 32);
                int buttonCode28 = BitConverter.ToInt32(rawData, 28);
                int buttonCode = buttonCode32 != 0 ? buttonCode32 : buttonCode28;

                string buttonName = "None/Released";
                if ((buttonCode & 0x01000000) != 0) buttonName = "Right";
                else if ((buttonCode & 0x02000000) != 0) buttonName = "Middle";
                else if ((buttonCode & 0x03000000) != 0) buttonName = "MiddleHigh";
                else if ((buttonCode & 0x04000000) != 0) buttonName = "Left";
                else if (buttonCode == 2) buttonName = "Top";

                sb.AppendLine(String.Format("Footpad Button Code: {0} ({1})", buttonCode, buttonName));
            }

            Console.WriteLine(sb.ToString());
        }

        base.WndProc(ref m);
    }
}
"@

Add-Type -TypeDefinition $source -ReferencedAssemblies "System.Windows.Forms.dll"

# Handler delegate
$handler = [ConsoleCancelEventHandler]{
    param($sender, $args)
    Write-Host "`nCtrl+C pressed—shutting down..."
    # Prevent PowerShell from also terminating abruptly
    $args.Cancel = $true
    [System.Windows.Forms.Application]::ExitThread()
}

# Wire it up
[Console]::add_CancelKeyPress($handler)

# Build and run your form
$form = New-Object RawInputForm
$form.WindowState     = 'Minimized'
$form.ShowInTaskbar   = $false
[System.Windows.Forms.Application]::Run($form)

```