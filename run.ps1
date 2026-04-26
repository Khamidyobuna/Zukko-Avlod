param(
    [int]$Port = 8080
)

& "$PSScriptRoot\\server.ps1" -Port $Port
