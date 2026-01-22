# Script to automatically add {% include codeHeader.html %} before code blocks
# in all blog posts

$postsPath = Join-Path $PSScriptRoot "_posts"
$markdownFiles = Get-ChildItem -Path $postsPath -Recurse -Filter "*.md"

$codeHeaderInclude = "{% include codeHeader.html %}"
$updatedCount = 0
$skippedCount = 0

Write-Host "Scanning $($markdownFiles.Count) markdown files..." -ForegroundColor Cyan

foreach ($file in $markdownFiles) {
    Write-Host "`nProcessing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $modified = $false
    
    # Find all code blocks that don't already have the include
    # Pattern: newline followed by ``` but NOT preceded by {% include codeHeader.html %}
    $pattern = '(?<!{% include codeHeader\.html %}\r?\n)(\r?\n)(```\w+)'
    
    if ($content -match $pattern) {
        # Replace: add the include before each code block
        $newContent = $content -replace $pattern, "`$1$codeHeaderInclude`$1`$2"
        
        if ($newContent -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            $modified = $true
            $updatedCount++
            Write-Host "  ✓ Added code headers" -ForegroundColor Green
        }
    }
    
    if (-not $modified) {
        $skippedCount++
        Write-Host "  - No changes needed" -ForegroundColor Gray
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Updated: $updatedCount files" -ForegroundColor Green
Write-Host "  Skipped: $skippedCount files" -ForegroundColor Gray
Write-Host "================================`n" -ForegroundColor Cyan

if ($updatedCount -gt 0) {
    Write-Host "Run 'git diff' to review changes before committing." -ForegroundColor Yellow
}
