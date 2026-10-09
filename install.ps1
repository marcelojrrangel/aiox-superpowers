param(
  [Parameter(Position = 0)]
  [string]$TargetPath = (Get-Location).Path,

  [switch]$Force,
  [switch]$DryRun
)

$SourceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SOURCE = (Resolve-Path $SourceRoot).Path
$TARGET = (Resolve-Path $TargetPath).Path

$DirsToCopy = @(
  @{Src = ".opencode/skills";     Dst = ".opencode/skills"},
  @{Src = ".opencode/tools";     Dst = ".opencode/tools"},
  @{Src = ".opencode/plugins";   Dst = ".opencode/plugins"},
  @{Src = ".aiox-core";          Dst = ".aiox-core"},
  @{Src = ".clinerules";         Dst = ".clinerules"},
  @{Src = ".cline/workflows";    Dst = ".cline/workflows"},
  @{Src = "memory-bank-template"; Dst = "memory-bank-template"}
)

$FilesToCopy = @(
  @{Src = ".opencode/AGENTS.md";         Dst = ".opencode/AGENTS.md"},
  @{Src = ".opencode/package.json";      Dst = ".opencode/package.json"},
  @{Src = ".opencode/package-lock.json"; Dst = ".opencode/package-lock.json"},
  @{Src = "opencode.json";              Dst = "opencode.json"},
  @{Src = "AGENTS.md";                  Dst = "AGENTS.md"}
)

$DirsToCreate = @(
  "$TARGET\.opencode\logs",
  "$TARGET\docs\designs",
  "$TARGET\docs\plans",
  "$TARGET\.agent\workflows",
  "$TARGET\memory-bank"
)

function Log($msg) { Write-Host ">> $msg" }

function Copy-IfNewer($src, $dst) {
  if (Test-Path $dst) {
    $srcTime = (Get-Item $src).LastWriteTime
    $dstTime = (Get-Item $dst).LastWriteTime
    if ($srcTime -le $dstTime -and -not $Force) { return $false }
  }
  $parent = Split-Path -Parent $dst
  if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  if ($DryRun) { Log "[DRY-RUN] Copy $src -> $dst"; return $true }
  Copy-Item -Path $src -Destination $dst -Recurse -Force
  return $true
}

function Merge-OpencodeJson($srcFile, $dstFile) {
  if (-not (Test-Path $dstFile)) {
    if ($DryRun) { Log "[DRY-RUN] Copy $srcFile -> $dstFile (new)"; return }
    Copy-Item $srcFile $dstFile -Force
    Log "Created $dstFile"
    return
  }

  $src = Get-Content $srcFile -Raw | ConvertFrom-Json
  $dst = Get-Content $dstFile -Raw | ConvertFrom-Json

  if (-not (Get-Member -InputObject $dst -Name "instructions" -MemberType Properties)) {
    $dst | Add-Member -NotePropertyName "instructions" -NotePropertyValue @(".opencode/AGENTS.md")
  } elseif ($dst.instructions -notcontains ".opencode/AGENTS.md") {
    $dst.instructions += ".opencode/AGENTS.md"
  }

  $srcAgentNames = $src.agent.PSObject.Properties.Name
  $dstAgentNames = $dst.agent.PSObject.Properties.Name
  foreach ($name in $srcAgentNames) {
    if ($dstAgentNames -notcontains $name) {
      $dst.agent | Add-Member -NotePropertyName $name -NotePropertyValue $src.agent.$name
      Log "  Agent added: @$name"
    }
  }

  $srcCmdNames = $src.command.PSObject.Properties.Name
  $dstCmdNames = $dst.command.PSObject.Properties.Name
  foreach ($name in $srcCmdNames) {
    if ($dstCmdNames -notcontains $name) {
      $dst.command | Add-Member -NotePropertyName $name -NotePropertyValue $src.command.$name
      Log "  Command added: /$name"
    }
  }

  if ($DryRun) {
    Log "[DRY-RUN] opencode.json merged (would write)"
    return
  }

  $json = $dst | ConvertTo-Json -Depth 10
  $content = $json -replace '    ', '  '
  Set-Content -Path $dstFile -Value $content -NoNewline
  Log "Merged $dstFile"
}

function Show-Summary {
  Write-Host ""
  Write-Host "========================================"
  Write-Host " AIOX Superpowers instalado com sucesso!"
  Write-Host "========================================"
  Write-Host ""
  Write-Host " Projeto : $TARGET"
  Write-Host ""
  Write-Host " Estrutura adicionada (OpenCode):"
  Write-Host "   .opencode/AGENTS.md   - Instrucoes mestre"
  Write-Host "   .opencode/skills/     - 21 skills"
  Write-Host "   .opencode/tools/      - 4 tools (model-router, model-ping, etc)"
  Write-Host "   .opencode/plugins/    - Plugin bootstrap"
  Write-Host "   .aiox-core/workflows/ - 6 workflows"
  Write-Host ""
  Write-Host " Estrutura adicionada (Cline):"
  Write-Host "   AGENTS.md             - Indice + comandos em linguagem natural"
  Write-Host "   .clinerules/          - Rules persistentes (mestre, memory-bank, TDD)"
  Write-Host "   .cline/skills/        - 22 skills (formato Cline)"
  Write-Host "   .cline/workflows/     - 6 workflows em markdown"
  Write-Host "   memory-bank/          - Memoria persistente entre sessoes"
  Write-Host ""
  Write-Host " Proximos passos (Cline):"
  Write-Host "   1. Abra o projeto no VS Code com Cline"
  Write-Host '   2. Peca: "inicie um brainstorm sobre <ideia>"'
  Write-Host '   3. Ou: "execute o workflow full-cycle para <feature>"'
  Write-Host ""
  Write-Host " Proximos passos (OpenCode):"
  Write-Host ""
  Write-Host " Proximos passos:"
  Write-Host "   1. Abra o projeto:  opencode"
  Write-Host "   2. Execute:         /aiox-init (verificar instalacao)"
  Write-Host "   3. Veja ajuda:      /aiox-help"
  Write-Host ""
  Write-Host " Comandos disponiveis:"
  Write-Host "   /aiox-help       - Ajuda do framework"
  Write-Host "   /aiox-brainstorm - Sessao de brainstorming"
  Write-Host "   /aiox-plan       - Criar plano de implementacao"
  Write-Host "   /aiox-workflow   - Executar workflow"
  Write-Host "   /aiox-story      - Gerenciar user stories"
  Write-Host "   /aiox-review     - Code review"
  Write-Host "   /aiox-status     - Status do projeto"
  Write-Host "========================================"
}

Log "AIOX Superpowers Installer"
Log "Source: $SOURCE"
Log "Target: $TARGET"
Write-Host ""

if (-not (Test-Path "$SOURCE\.opencode\AGENTS.md")) {
  Write-Error "Source does not look like aiox-superpowers. Run this script from the framework root."
  exit 1
}

if ($DryRun) { Log "DRY-RUN mode - no files will be written" }

Log "Creating directories..."
foreach ($dir in $DirsToCreate) {
  if (-not (Test-Path $dir)) {
    if ($DryRun) { Log "[DRY-RUN] mkdir $dir"; continue }
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
}

Log "Copying directories..."
foreach ($entry in $DirsToCopy) {
  $srcFull = Join-Path $SOURCE $entry.Src
  $dstFull = Join-Path $TARGET $entry.Dst
  if (Test-Path $srcFull) {
    if (Copy-IfNewer $srcFull $dstFull) {
      Log "  $($entry.Src) -> $($entry.Dst)"
    }
  }
}

Log "Copying files..."
foreach ($entry in $FilesToCopy) {
  $srcFull = Join-Path $SOURCE $entry.Src
  $dstFull = Join-Path $TARGET $entry.Dst
  if (Test-Path $srcFull) {
    if ($entry.Src -eq "opencode.json") {
      Merge-OpencodeJson $srcFull $dstFull
    } elseif (Copy-IfNewer $srcFull $dstFull) {
      Log "  $($entry.Src) -> $($entry.Dst)"
    }
  }
}

if ($DryRun) {
  Log "[DRY-RUN] Skipping npm install"
} else {
  Log "Installing .opencode dependencies..."
  Push-Location "$TARGET\.opencode"
  npm install 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Log "  npm install OK"
  } else {
    Write-Warning "  npm install failed, run manually: cd .opencode && npm install"
  }
  Pop-Location
}

$mbTemplate = Join-Path $TARGET "memory-bank-template"
$mbTarget = Join-Path $TARGET "memory-bank"
if (Test-Path $mbTemplate) {
  Get-ChildItem -Path $mbTemplate -File | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $projName = Split-Path -Leaf $TARGET
    $content = $content -replace [regex]::Escape("<nome-do-projeto>"), $projName
    Set-Content -Path (Join-Path $mbTarget $_.Name) -Value $content -NoNewline
  }
  if (-not $DryRun) { Remove-Item -Recurse -Force $mbTemplate }
  Log "  memory-bank-template/ -> memory-bank/ (inicializado)"
}

$clineSrc = Join-Path $TARGET ".opencode/skills"
$clineDst = Join-Path $TARGET ".cline/skills"
if ((Test-Path $clineSrc) -and (-not $DryRun)) {
  if (-not (Test-Path $clineDst)) { New-Item -ItemType Directory -Path $clineDst -Force | Out-Null }
  Copy-Item -Path (Join-Path $clineSrc "*") -Destination $clineDst -Recurse -Force
  Log "  .opencode/skills -> .cline/skills (formato Cline compativel)"
}

Show-Summary
