---
layout: post
title: 'PowerShell Get-Member Essentials: Static vs Instance Members'
date: '2025-11-02'
excerpt: >-
  Master the key distinction between static and instance members in PowerShell using Get-Member to unlock the full power of .NET objects.
comments: true
---



## 🧠 Why Get-Member Matters

PowerShell sits on top of .NET, which means every object you work with has properties, methods, events, and fields. `Get-Member` is your diagnostic tool to inspect these objects and discover their capabilities without needing to read documentation.

Understanding the difference between static and instance members is crucial for effective PowerShell scripting – it's the difference between knowing what you can do with an object versus what you can do with the type itself.

## 🧰 Get-Member Overview

`Get-Member` is used to inspect objects and see their:

* **Properties** - Data stored in the object
* **Methods** - Actions you can perform on the object  
* **Events** - Notifications the object can send
* **Fields** - Direct access to object data

## 📌 Key Distinction: Static vs Instance Members

The most important concept to understand is the difference between static and instance members:

| Usage | Shows | Example Use |
|-------|-------|-------------|
| `[type] | Get-Member` | **Instance members only** | `'A'.GetType()` |
| `[type] | Get-Member -Static` | **Static members on the type** | `[char]::IsDigit('5')` |

### Instance Members Example

{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
# See what you can do with a string object
"Hello World" | Get-Member

# Output shows instance methods like:
# - ToUpper()
# - ToLower() 
# - Substring()
# - Replace()
```

### Static Members Example

{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
# See what you can do with the String type itself
[string] | Get-Member -Static

# Output shows static methods like:
# - IsNullOrEmpty()
# - Join()
# - Format()
# - Compare()
```

## 🔍 Practical Examples

### Working with Character Types

{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
# Instance members - what you can do with a char object
[char]'A' | Get-Member

# Static members - utility methods on the char type
[char] | Get-Member -Static

# Use static methods for validation
[char]::IsDigit('5')     # True
[char]::IsLetter('A')    # True
[char]::IsWhiteSpace(' ') # True
```

### Math Operations

{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
# Static members are essential for Math operations
[Math] | Get-Member -Static

# Use static methods for calculations
[Math]::Max(10, 20)      # 20
[Math]::Sqrt(16)         # 4
[Math]::Round(3.14159, 2) # 3.14
```

### Type Conversions

{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
# Convert class has many static conversion methods
[Convert] | Get-Member -Static

# Convert between types
[Convert]::ToInt32("42")           # 42
[Convert]::ToBase64String([byte[]]@(1,2,3)) # AQID
[Convert]::FromBase64String("AQID")         # 1,2,3
```

## 🎯 Why This Distinction Matters

### 1. **Understanding the .NET Object Model**
PowerShell leverages .NET's rich type system. Knowing how to access both type-level and object-level functionality gives you access to the full .NET framework.

### 2. **Avoiding Confusion**
Without `-Static`, you might wrongly assume methods like `IsDigit()` or `Parse()` don't exist on a type, when they're actually available as static methods.

### 3. **Effective Scripting**
Static methods are essential for:
- **Type conversions**: `[int]::Parse("42")`
- **Utility functions**: `[Math]::Abs(-5)`
- **Class-level operations**: `[DateTime]::Now`
- **Validation**: `[char]::IsDigit('5')`

### 4. **Exploring Types Efficiently** 
`Get-Member` helps you discover capabilities without needing external documentation.

## 💡 Pro Tips

### Explore Both at Once
{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
# Create a helper function to see both static and instance members
function Get-AllMembers {
    param([type]$Type)
    
    Write-Host "=== Instance Members ===" -ForegroundColor Green
    $Type | Get-Member
    
    Write-Host "`n=== Static Members ===" -ForegroundColor Yellow
    $Type | Get-Member -Static
}

# Usage
Get-AllMembers [string]
```

### Filter by Member Type
{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
# Only show methods
[string] | Get-Member -MemberType Method

# Only show properties  
[string] | Get-Member -MemberType Property

# Only show static methods
[Math] | Get-Member -Static -MemberType Method
```

### Search for Specific Members
{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
# Find members with specific names
[string] | Get-Member *Format*
[DateTime] | Get-Member -Static *Parse*
```

## 🎪 Common Use Cases

### File Operations
{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
# File class static methods
[System.IO.File] | Get-Member -Static

# Read file content
[System.IO.File]::ReadAllText("C:\temp\file.txt")

# Check if file exists
[System.IO.File]::Exists("C:\temp\file.txt")
```

### DateTime Manipulation
{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
# DateTime static methods
[DateTime] | Get-Member -Static

# Parse dates
[DateTime]::Parse("2025-11-02")
[DateTime]::ParseExact("02/11/2025", "dd/MM/yyyy", $null)

# Current time
[DateTime]::Now
[DateTime]::UtcNow
```

### Path Operations
{% include codeHeader.html %}
{% include codeHeader.html %}
```powershell
# Path class for file system operations
[System.IO.Path] | Get-Member -Static

# Combine paths
[System.IO.Path]::Combine("C:\", "temp", "file.txt")

# Get file extension
[System.IO.Path]::GetExtension("file.txt")
```

## 🚀 Conclusion

Mastering `Get-Member` with the `-Static` parameter opens up the full power of .NET in PowerShell. Remember:

- Use `Get-Member` to explore **instance** capabilities
- Use `Get-Member -Static` to explore **type-level** capabilities  
- Static methods often provide utility functions and class-level operations
- Both are essential for effective PowerShell scripting

*Generate by GitHub Copilot; Model: Claude Sonnet 4