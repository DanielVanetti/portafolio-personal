<#
    Empaqueta el proyecto para AulaVirtual, sin dependencias ni artefactos
    de build. Se ejecuta desde la raiz del proyecto:

        powershell -ExecutionPolicy Bypass -File scripts/empaquetar.ps1
#>

$ErrorActionPreference = 'Stop'

$raiz = Split-Path $PSScriptRoot -Parent
$destino = Join-Path $raiz 'entrega.zip'
$staging = Join-Path ([System.IO.Path]::GetTempPath()) "entrega-portafolio-$(Get-Random)"

# Lo que nunca debe viajar en la entrega.
#
# Ademas de las dependencias y los artefactos de build, quedan fuera los
# documentos de trabajo interno: el plan y las guias de convenciones de
# `.claude/`. La entrega lleva solo el proyecto y ENTREGA.md.
$excluir = @(
    'node_modules', '.output', '.nuxt', '.nitro', '.cache', '.data', 'dist',
    '.git', 'entrega.zip',
    '.claude', 'PLAN-portafolio-nuxt.md'
)

Write-Host "Preparando copia limpia en $staging"
New-Item -ItemType Directory -Path $staging -Force | Out-Null

Get-ChildItem -Path $raiz -Force | Where-Object { $excluir -notcontains $_.Name } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $staging -Recurse -Force
}

if (Test-Path $destino) {
    Remove-Item $destino -Force
}

Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $destino -Force
Remove-Item $staging -Recurse -Force

$tamano = [math]::Round((Get-Item $destino).Length / 1MB, 2)
Write-Host "Listo: $destino ($tamano MB)"

# Verificacion: que no se haya colado nada de lo excluido.
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($destino)
$intrusos = $zip.Entries | Where-Object {
    $_.FullName -match '^(node_modules|\.output|\.nuxt|\.git|\.claude)/' -or
    $_.FullName -eq 'PLAN-portafolio-nuxt.md'
}
$zip.Dispose()

if ($intrusos) {
    Write-Error "El zip contiene rutas que debian excluirse: $($intrusos[0].FullName)"
} else {
    Write-Host "Verificado: sin node_modules, .output, .nuxt, .git, .claude ni el plan"
}
