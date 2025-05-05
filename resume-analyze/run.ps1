# run.ps1

Write-Host "🚀 Starting FEDBRIDGE Project..." -ForegroundColor Cyan

# --- FRONTEND SETUP ---
Write-Host "`n🔧 Setting up Frontend..." -ForegroundColor Yellow
cd "resume-analyze/frontend"

Write-Host "📦 Installing frontend dependencies..." -ForegroundColor DarkYellow
npm install

Write-Host "▶️ Launching frontend (npm run dev)..." -ForegroundColor DarkGreen
Start-Process powershell -ArgumentList "cd $(Resolve-Path .); npm run dev" -WindowStyle Normal

# Go back to root to prepare for server setup
cd ../..

# --- BACKEND SETUP ---
Write-Host "`n🔧 Setting up Backend (Server)..." -ForegroundColor Yellow
cd "resume-analyze/server"

Write-Host "📦 Installing server dependencies..." -ForegroundColor DarkYellow
npm install

Write-Host "▶️ Launching backend (node --watch server.js)..." -ForegroundColor DarkGreen
Start-Process powershell -ArgumentList "cd $(Resolve-Path .); node --watch server.js" -WindowStyle Normal

Write-Host "`n✅ FEDBRIDGE project is running!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173 (or specified port)"
Write-Host "Backend:  Running with Node (watch mode)"

#-- run it --
# -- .\run.ps1
