---
layout: post
title: "Publishing My First Signed EXE Release to GitLab"
date: 2026-05-17
subtitle: "version stamps, self-contained builds, a code signing cert, and a packages registry i didn't know existed."
tags: [dotnet, csharp, wpf, gitlab, powershell, codesigning]
comments: true
---

Big day. Today, I shipped my first-ever (alpha) release of a binary to a GitLab repository. :D

This means my team can download and run the EXE without needing to build it themselves. 

As my app matures, I can repeatably update that release with new versions, and users can easily get the latest without needing to know anything about git or building from source.

----

Here's an AI-assisted breakdown of the process. 

I'm documenting this for me, but it might be useful for someone out there.

Before touching the build, I needed to set the version numbers. This is a .NET project, so that means editing the csproj:

`Version` is what the SDK surfaces.

`AssemblyVersion` is what .NET uses for assembly binding.
 
`FileVersion` is what shows up when you right-click the EXE and open Properties.
  
Keeping all three in sync means you don't end up in the situation where Windows reports one version and your code thinks it's running another.

{% include codeHeader.html %}
```xml
<Version>0.1.0-alpha</Version>
<AssemblyVersion>0.1.0.0</AssemblyVersion>
<FileVersion>0.1.0.0</FileVersion>
```

Then the publish:

The goal was one self-contained EXE with no dependencies.

`--self-contained true` bundles the .NET runtime into the output so the recipient doesn't need anything pre-installed. `-p:PublishSingleFile=true` merges all the managed assemblies into a single EXE at publish time. `-p:IncludeNativeLibrariesForSelfExtract=true` handles the native stuff like SQLite interop and WinHttpHandler by packing it inside the EXE and extracting to a temp folder on first run.

{% include codeHeader.html %}
```powershell
dotnet publish src/Cnd2Poam.App/Cnd2Poam.App.csproj `
  -c Release `
  -r win-x64 `
  --self-contained true `
  -p:PublishSingleFile=true `
  -p:IncludeNativeLibrariesForSelfExtract=true `
  -o publish\alpha
```

Output: `cnd2poam.exe` at about 169 MB, and a `.pdb` sitting next to it. Don't distribute the pdb.

I had a code signing certificate installed in my Windows cert store. Signing the EXE means users get a clean "Verified publisher" in SmartScreen and UAC prompts instead of the "Windows protected your PC" red warning.


`/sha1` selects the cert by thumbprint. When you have multiple certs installed, this saves you from guessing which one signtool picked. Worth using every time.

`/fd SHA256` because SHA1 is deprecated for code signing. SHA256 is what modern Windows security policy requires now.

`/tr` is the timestamp server, and this is the one you absolutely do not skip. The timestamp is an RFC 3161 signature that proves the code signature existed while the cert was still valid. That means even after the cert expires in 2029, the signature stays verifiable. Without it, your signature effectively dies with the cert.

`/td SHA256` sets the digest algorithm for the timestamp itself. Has to match `/fd`.

RFC 3161 timestamp servers are interoperable, so DigiCert's works fine here.

{% include codeHeader.html %}
```powershell
& "C:\Program Files (x86)\Windows Kits\10\bin\10.0.26100.0\x86\signtool.exe" `
  sign `
  /sha1 <code signing cert thumbprint> `
  /fd SHA256 `
  /tr http://timestamp.digicert.com `
  /td SHA256 `
  /v `
  "publish\alpha\cnd2poam.exe"
```

---

Then, tagging and pushing to GitLab. The tag is the anchor for the release page, so it has to go up before the release is created.

{% include codeHeader.html %}
```powershell
git tag -a v0.1.0-alpha -m "v0.1.0-alpha -- first alpha release"
git push origin main
git push origin v0.1.0-alpha
```

The annotated tag (`-a`) matters here because it stores a tagger, a date, and a message. It's a proper git object, not just a named pointer. And tags don't go up with a normal branch push, so the second push is explicit and necessary. GitLab uses the tag as the anchor for the release page.

---

Getting the EXE somewhere permanent was the part I hadn't figured out before this project. GitLab has a Generic Packages registry and I didn't know it existed. Any versioned binary can go in there.

Upload is a single PUT:

{% include codeHeader.html %}
```powershell
Invoke-RestMethod `
  -Uri "https://gitlab.example.com/api/v4/projects/me%2Fappname/packages/generic/appname/0.1.0-alpha/appname.exe" `
  -Method Put `
  -Headers @{ "PRIVATE-TOKEN" = $token } `
  -InFile "publish\alpha\appname.exe" `
  -ContentType "application/octet-stream"
```

The namespace/project path in the URL has to be percent-encoded. `me/appname` becomes `me%2Fappname `. 

Also: IMPORTANT: the PAT needs `api` scope. `read_repository` is not enough for package registry writes.

---

Last step is the release itself. This ties the git tag, a description, and a download link together into a proper GitLab release page.

{% include codeHeader.html %}
```powershell
$body = @{
    name        = "v0.1.0-alpha"
    tag_name    = "v0.1.0-alpha"
    description = "First alpha release."
    assets      = @{
        links = @(@{
            name      = "appname.exe win-x64 self-contained"
            url       = "https://gitlab.example.com/api/v4/projects/me%2Fappname/packages/generic/appname/0.1.0-alpha/appname.exe"
            link_type = "package"
        })
    }
} | ConvertTo-Json -Depth 10 -Compress

Invoke-RestMethod `
  -Uri "https://gitlab.example.com/api/v4/projects/me%2Fappname/releases" `
  -Method Post `
  -Headers @{ "PRIVATE-TOKEN" = $token; "Content-Type" = "application/json" } `
  -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
```

Two things that bit me here. First, encode the body as UTF-8 bytes explicitly. PowerShell's default string encoding can corrupt the JSON silently and you'll get a 400 back from the API with no useful error message to help you track down why. Second, `-Compress` on `ConvertTo-Json` collapses whitespace in the output. GitLab's API is strict about the JSON format in ways that will frustrate you if you're not expecting it.

---

That's the pipeline. The exe binary is not committed to the repo. It lives in the packages registry, attached to the release, retrievable at a stable URL that doesn't move. The repo stays fast to clone. The release page has a download link. The README has a download link at the top.

v0.1.0-alpha. Signed, versioned, shipped.
