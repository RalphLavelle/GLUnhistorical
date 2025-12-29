# PowerShell script to build frontend and backend for production
# Usage: .\scripts\build-production.ps1

Write-Host "Building frontend..." -ForegroundColor Cyan
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend npm install failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "Frontend build complete!" -ForegroundColor Green
Set-Location ..

Write-Host "Building backend..." -ForegroundColor Cyan
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend npm install failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "Backend build complete!" -ForegroundColor Green
Set-Location ..

Write-Host "`nProduction build complete!" -ForegroundColor Green
Write-Host "Frontend output: frontend\dist\frontend\browser" -ForegroundColor Yellow
Write-Host "Backend output: backend\dist" -ForegroundColor Yellow


