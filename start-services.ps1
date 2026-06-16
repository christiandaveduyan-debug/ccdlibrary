#!/usr/bin/env pwsh
# CCD Library - Startup Script
# This script starts both backend and frontend services

$ErrorActionPreference = "Stop"

# Colors for output
$success = @{ForegroundColor = 'Green'}
$error_color = @{ForegroundColor = 'Red'}
$info = @{ForegroundColor = 'Cyan'}

Write-Host "`n" + ("="*60) -foreground Cyan
Write-Host "  CCD Library - Full Stack Startup" -foreground Cyan
Write-Host ("="*60) -foreground Cyan

# Define paths
$root = "c:\Users\Acer\Downloads\City-College-of-Davao-Library-main"
$backend = "$root\ccdlib"
$frontend = "$root\City-College-of-Davao-Library-main\LIB"

Write-Host "`n📍 Checking directories..." @info

if (-not (Test-Path $backend)) {
    Write-Host "❌ Backend directory not found: $backend" @error_color
    exit 1
}

if (-not (Test-Path $frontend)) {
    Write-Host "❌ Frontend directory not found: $frontend" @error_color
    exit 1
}

Write-Host "✅ Backend found: $backend" @success
Write-Host "✅ Frontend found: $frontend" @success

# Check .env files
Write-Host "`n🔍 Checking configuration files..." @info

if (-not (Test-Path "$backend\.env")) {
    Write-Host "⚠️  .env not found in backend!" @error_color
    exit 1
}

if (-not (Test-Path "$frontend\.env.local")) {
    Write-Host "⚠️  .env.local not found in frontend!" @error_color
    exit 1
}

Write-Host "✅ Backend .env exists" @success
Write-Host "✅ Frontend .env.local exists" @success

# Check if Cargo.toml exists
if (-not (Test-Path "$backend\Cargo.toml")) {
    Write-Host "❌ Cargo.toml not found!" @error_color
    exit 1
}

# Check if package.json exists
if (-not (Test-Path "$frontend\package.json")) {
    Write-Host "❌ package.json not found!" @error_color
    exit 1
}

Write-Host "`n✅ All prerequisites checked!" @success

Write-Host "`n📝 Configuration:" @info
$db_url = (Select-String -Path "$backend\.env" -Pattern "DATABASE_URL" | Select-Object -First 1).Line
Write-Host "   Backend DB: $($db_url.Replace(':sidi_1121200@', ':****@'))"

$api_url = (Select-String -Path "$frontend\.env.local" -Pattern "VITE_API_URL" | Select-Object -First 1).Line
Write-Host "   Frontend API: $api_url"

Write-Host "`n🚀 Ready to start!`n" @info
Write-Host "Options:" @info
Write-Host "  [B] Start Backend only (Ctrl+C to stop)" @info
Write-Host "  [F] Start Frontend only (Ctrl+C to stop)" @info
Write-Host "  [A] Start Backend in new terminal, then Frontend in current" @info
Write-Host "  [Q] Quit" @info

$choice = Read-Host "`nChoose an option [B/F/A/Q]"

switch ($choice.ToUpper()) {
    'B' {
        Write-Host "`n📦 Starting Backend...", -ForegroundColor Yellow
        Write-Host "⏳ This may take a minute on first run...`n", -ForegroundColor Yellow
        Set-Location $backend
        cargo run
    }
    'F' {
        Write-Host "`n📦 Installing Frontend dependencies..." -ForegroundColor Yellow
        Set-Location $frontend
        npm install
        Write-Host "`n📦 Starting Frontend...", -ForegroundColor Yellow
        Write-Host "⏳ This may take a minute...`n", -ForegroundColor Yellow
        npm run dev
    }
    'A' {
        Write-Host "`n📦 Starting Backend in new PowerShell window..." -ForegroundColor Yellow
        Start-Process pwsh -ArgumentList "-Command cd '$backend'; cargo run"
        
        Write-Host "📦 Installing Frontend dependencies..." -ForegroundColor Yellow
        Set-Location $frontend
        npm install
        
        Write-Host "`n📦 Starting Frontend..." -ForegroundColor Yellow
        Write-Host "⏳ Open http://localhost:5173 in your browser`n" -ForegroundColor Cyan
        npm run dev
    }
    'Q' {
        Write-Host "Goodbye!" -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice!" @error_color
        exit 1
    }
}

Write-Host "`n✅ Services started successfully!" @success
Write-Host "`n📍 Access points:" @info
Write-Host "   Frontend: http://localhost:5173" @info
Write-Host "   Backend:  http://localhost:8000" @info
Write-Host "   Database: Supabase (Cloud)" @info

Write-Host "`n💡 Tip: Login with demo account" @info
Write-Host "   Email: admin@library.edu" @info
Write-Host "   Password: admin123" @info

Write-Host "`n" 
