# Development setup script for Windows.
# Ensures Redis is running (Docker), creates the venv, installs dependencies,
# and starts Celery worker + backend + frontend.

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Venv = Join-Path $Root ".venv"
$Python = Join-Path $Venv "Scripts\python.exe"

function Ensure-Redis {
    $listening = Get-NetTCPConnection -LocalPort 6379 -State Listen -ErrorAction SilentlyContinue
    if ($listening) {
        Write-Host "Redis already running on :6379" -ForegroundColor Green
        return
    }
    $docker = Get-Command docker -ErrorAction SilentlyContinue
    if (-not $docker) {
        throw "Redis is not running and Docker is not available. Start Redis on port 6379 manually."
    }
    Write-Host "Starting Redis container..." -ForegroundColor Cyan
    & docker run -d --name ai-fakenews-redis -p 6379:6379 --restart unless-stopped redis:7
    Start-Sleep -Seconds 3
}

function Invoke-Steps {
    Ensure-Redis

    if (-not (Test-Path $Python)) {
        Write-Host "Creating virtual environment..." -ForegroundColor Cyan
        python -m venv $Venv
    }

    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    & $Python -m pip install --upgrade pip --quiet
    & $Python -m pip install -r (Join-Path $Root "backend\requirements.txt") --quiet

    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    & npm --prefix (Join-Path $Root "frontend") install

    Write-Host "Starting Celery worker..." -ForegroundColor Green
    $worker = Start-Process -FilePath $Python -ArgumentList "-m", "celery", "-A", "app.celery_app", "worker", "--pool=solo", "--loglevel=info" -WorkingDirectory (Join-Path $Root "backend") -PassThru -NoNewWindow

    Write-Host "Starting backend (http://localhost:8000)..." -ForegroundColor Green
    $backend = Start-Process -FilePath $Python -ArgumentList "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000" -WorkingDirectory (Join-Path $Root "backend") -PassThru -NoNewWindow

    Write-Host "Starting frontend (http://localhost:3000)..." -ForegroundColor Green
    $frontend = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory (Join-Path $Root "frontend") -PassThru -NoNewWindow

    Write-Host ""
    Write-Host "Backend:  http://localhost:8000  (docs at /docs)" -ForegroundColor Yellow
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C in the opened windows or close them to stop." -ForegroundColor Yellow

    $frontend.WaitForExit()
    $worker.Kill()
    $backend.Kill()
}

Invoke-Steps
