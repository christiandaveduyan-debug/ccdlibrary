#!/usr/bin/env pwsh
# CCD Library - Database Connection Tester
# This script verifies your Supabase connection is working

$ErrorActionPreference = "Stop"

$info = @{ForegroundColor = 'Cyan'}
$success = @{ForegroundColor = 'Green'}
$warning = @{ForegroundColor = 'Yellow'}
$error_color = @{ForegroundColor = 'Red'}

Write-Host "`n" + ("="*70) @info
Write-Host "  CCD Library - Supabase Connection Tester" @info
Write-Host ("="*70) @info

# Get DATABASE_URL from .env
$backend = "c:\Users\Acer\Downloads\City-College-of-Davao-Library-main\ccdlib"
$env_file = "$backend\.env"

if (-not (Test-Path $env_file)) {
    Write-Host "`n❌ .env file not found at: $env_file" @error_color
    exit 1
}

Write-Host "`n📂 Reading configuration..." @info

# Extract DATABASE_URL
$db_url = (Select-String -Path $env_file -Pattern "^DATABASE_URL=" | Select-Object -First 1).Line
if (-not $db_url) {
    Write-Host "❌ DATABASE_URL not found in .env" @error_color
    exit 1
}

$db_url_value = $db_url.Split('=', 2)[1]
Write-Host "✅ Found DATABASE_URL" @success

# Parse URL components
if ($db_url_value -match "postgresql://([^:]+):([^@]+)@([^:/]+):(\d+)/(.+)") {
    $user = $matches[1]
    $password = $matches[2]
    $host = $matches[3]
    $port = $matches[4]
    $database = $matches[5]
    
    Write-Host "`n🔍 Connection Details:" @info
    Write-Host "   User: $user" @info
    Write-Host "   Host: $host" @info
    Write-Host "   Port: $port" @info
    Write-Host "   Database: $database" @info
    Write-Host "   Password: $($password.Substring(0, [Math]::Min(5, $password.Length)))..." @info
} else {
    Write-Host "❌ Invalid DATABASE_URL format!" @error_color
    exit 1
}

# Check if psql is available
Write-Host "`n🔍 Checking for psql (PostgreSQL client)..." @info
$psql_path = (Get-Command psql -ErrorAction SilentlyContinue).Source

if ($psql_path) {
    Write-Host "✅ psql found at: $psql_path" @success
    
    Write-Host "`n⏳ Testing connection..." @warning
    Write-Host "   (This may take 10-30 seconds...)" @info
    
    try {
        $result = & psql $db_url_value -c "SELECT 1 as connected, version();" -q 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ CONNECTION SUCCESSFUL! 🎉" @success
            Write-Host "`n📊 Database Server Info:" @info
            $result | ForEach-Object { Write-Host "   $_" @info }
            Write-Host "`n✅ Your Supabase database is working correctly!" @success
            Write-Host "`n▶️  You can now run: cd $backend ; cargo run" @success
        } else {
            Write-Host "`n❌ CONNECTION FAILED!" @error_color
            Write-Host "`n📋 Error Output:" @error_color
            $result | ForEach-Object { Write-Host "   $_" @error_color }
            
            Write-Host "`n🔧 Troubleshooting:" @warning
            Write-Host "   1. Check your password in .env" @warning
            Write-Host "   2. Verify Supabase project is active (not paused)" @warning
            Write-Host "   3. Try using the connection pooler (already configured)" @warning
        }
    } catch {
        Write-Host "`n❌ Error running psql!" @error_color
        Write-Host "   $_" @error_color
    }
} else {
    Write-Host "⚠️  psql not found. Installing PostgreSQL client..." @warning
    Write-Host "`n📝 Quick Manual Test Instead:" @info
    
    Write-Host "`n   Option 1: Verify in Supabase Dashboard" @info
    Write-Host "   1. Go to supabase.com" @info
    Write-Host "   2. Select your project" @info
    Write-Host "   3. Go to Settings > Database" @info
    Write-Host "   4. Look for 'Connection Status' - should show 'Active'" @info
    
    Write-Host "`n   Option 2: Try running backend directly" @info
    Write-Host "   1. Open PowerShell" @info
    Write-Host "   2. Run: cd $backend" @info
    Write-Host "   3. Run: cargo run" @info
    Write-Host "   4. Look for: '✅ DATABASE CONNECTION SUCCESSFUL!'" @info
    
    # Try to install psql via chocolatey if available
    $choco = Get-Command choco -ErrorAction SilentlyContinue
    if ($choco) {
        Write-Host "`n💡 Install PostgreSQL client with:" @info
        Write-Host "   choco install postgresql" @info
    }
}

Write-Host "`n" + ("="*70) @info
Write-Host "  Next Steps:" @info
Write-Host ("="*70) @info
Write-Host "`n1. Make sure schema.sql is executed in Supabase SQL Editor" @info
Write-Host "2. Update any incorrect credentials in .env" @info  
Write-Host "3. Run: ./start-services.ps1" @info
Write-Host "`n"
