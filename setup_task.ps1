$action = New-ScheduledTaskAction -Execute 'node' -Argument '"c:\Users\Aakanksha\.gemini\antigravity\scratch\bharatone_spaces_website\auto-poster.js" --count=10' -WorkingDirectory 'c:\Users\Aakanksha\.gemini\antigravity\scratch\bharatone_spaces_website\'
$trigger = New-ScheduledTaskTrigger -Daily -At 10:00AM
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -Hidden -RunOnlyIfNetworkAvailable
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive

Register-ScheduledTask -TaskName 'BharatOneAutoBlogger' -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'Generates and posts a new blog article daily at 10:00 AM using Gemini.'

Write-Host "✅ Task 'BharatOneAutoBlogger' successfully scheduled to run daily at 10:00 AM!" -ForegroundColor Green
Write-Host "To test it right now, you can open Task Scheduler, find 'BharatOneAutoBlogger', right-click and 'Run', or just run auto_blog.py manually."
