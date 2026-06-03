$ErrorActionPreference = 'Continue'

$f = 'd:\SSR Restaurant\nextjs-app\src\app\menu\page.tsx'
$c = Get-Content $f -Raw
$m = [regex]::Matches($c, "name:\s*'([^']+)'")
$names = $m | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique

$dest = 'd:\SSR Restaurant\nextjs-app\public\images\menu-ai'
New-Item -ItemType Directory -Path $dest -Force | Out-Null

$ok = 0
$fail = 0
$results = @()

foreach ($name in $names) {
  $slug = ($name.ToLower() -replace '[^a-z0-9]+', '-' -replace '(^-+|-+$)', '')
  $out = Join-Path $dest ($slug + '.jpg')

  $prompt = "Ultra realistic food photography of the Indian dish '$name', plated and ready to eat on a restaurant table, Andhra style cuisine, close-up food shot, natural lighting, detailed texture, appetizing, edible cooked food only, no animals, no wildlife, no birds, no humans, no people, no text, no logo, no watermark"
  $encoded = [System.Uri]::EscapeDataString($prompt)
  $url = "https://image.pollinations.ai/prompt/$encoded?width=1024&height=1024&seed=777&nologo=true&model=flux"

  try {
    Invoke-WebRequest -Uri $url -OutFile $out -TimeoutSec 120
    $size = (Get-Item $out).Length

    if ($size -gt 8000) {
      $ok++
      $results += "OK|$name|$slug.jpg|$size"
    }
    else {
      Remove-Item $out -Force -ErrorAction SilentlyContinue
      $fail++
      $results += "FAIL_SMALL|$name|$slug.jpg|$size"
    }
  }
  catch {
    $fail++
    $results += "FAIL|$name|$slug.jpg|$($_.Exception.Message)"
  }
}

$log = 'd:\SSR Restaurant\nextjs-app\menu-ai-regeneration-log.txt'
$results | Set-Content $log
Write-Output "Regenerated: $ok, Failed: $fail, Log: $log"