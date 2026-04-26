param(
    [int]$Port = 8080
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Script:RootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$Script:PublicPath = Join-Path $Script:RootPath "public"
$Script:DataPath = Join-Path $Script:RootPath "data\\app-db.json"
$Script:SecretPath = Join-Path $Script:RootPath "data\\session-secret.txt"
$Script:StudentSessionCookieName = "za_student_session"
$Script:AdminSessionCookieName = "za_admin_session"
$Script:LegacySessionCookieName = "za_session"
$Script:AdminPortalPath = "/teacher-portal-begzod-2026"
$Script:AdminUsername = "begzod"
$Script:AdminPassword = "Begzod2026!"

function Get-IsoNow {
    return (Get-Date).ToString("o")
}

function New-RandomToken {
    param([int]$Size = 32)

    $bytes = New-Object byte[] $Size
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

function ConvertTo-Base64Url {
    param([string]$Value)

    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Value)
    return [Convert]::ToBase64String($bytes).TrimEnd("=").Replace("+", "-").Replace("/", "_")
}

function ConvertFrom-Base64Url {
    param([string]$Value)

    $normalized = $Value.Replace("-", "+").Replace("_", "/")
    switch ($normalized.Length % 4) {
        2 { $normalized += "==" }
        3 { $normalized += "=" }
    }

    $bytes = [Convert]::FromBase64String($normalized)
    return [System.Text.Encoding]::UTF8.GetString($bytes)
}

function Get-SessionSecret {
    if (-not (Test-Path $Script:SecretPath)) {
        New-Item -ItemType Directory -Force (Split-Path -Parent $Script:SecretPath) | Out-Null
        Set-Content -Path $Script:SecretPath -Value (New-RandomToken 48) -Encoding UTF8
    }

    return (Get-Content $Script:SecretPath -Raw).Trim()
}

function New-PasswordHash {
    param([string]$Password)

    $saltBytes = New-Object byte[] 16
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($saltBytes)
    $derive = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($Password, $saltBytes, 120000)
    $hashBytes = $derive.GetBytes(32)

    return [PSCustomObject]@{
        salt = [Convert]::ToBase64String($saltBytes)
        hash = [Convert]::ToBase64String($hashBytes)
    }
}

function Test-Password {
    param(
        [string]$Password,
        [string]$Salt,
        [string]$Hash
    )

    $saltBytes = [Convert]::FromBase64String($Salt)
    $derive = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($Password, $saltBytes, 120000)
    $computedHash = [Convert]::ToBase64String($derive.GetBytes(32))
    return $computedHash -eq $Hash
}

function Initialize-Database {
    New-Item -ItemType Directory -Force (Split-Path -Parent $Script:DataPath) | Out-Null

    if (Test-Path $Script:DataPath) {
        return
    }

    $adminPassword = New-PasswordHash $Script:AdminPassword
    $now = Get-Date
    $startAt = $now.AddDays(-1).ToString("o")
    $endAt = $now.AddDays(30).ToString("o")

    $database = [PSCustomObject]@{
        meta = [PSCustomObject]@{
            createdAt = Get-IsoNow
            nextUserId = 2
            nextOlympiadId = 3
            nextSubmissionId = 1
        }
        users = @(
            [PSCustomObject]@{
                id = 1
                role = "admin"
                username = $Script:AdminUsername
                firstName = "Begzod"
                lastName = "Poziljonov"
                studentCode = $null
                class = $null
                passwordSalt = $adminPassword.salt
                passwordHash = $adminPassword.hash
                createdAt = Get-IsoNow
            }
        )
        olympiads = @(
            [PSCustomObject]@{
                id = 1
                title = "Matematika Sprint"
                subject = "math"
                description = "5-7-sinf o'quvchilari uchun tezkor mantiqiy va hisoblash savollari."
                gradeLevels = @(5, 6, 7)
                startAt = $startAt
                endAt = $endAt
                durationMinutes = 35
                createdBy = 1
                createdAt = Get-IsoNow
                questions = @(
                    [PSCustomObject]@{ id = 1; text = "36 ning 1/4 qismi nechiga teng?"; options = @("6", "8", "9", "12"); correctIndex = 2 },
                    [PSCustomObject]@{ id = 2; text = "7 x 8 - 12 ifodasining qiymatini toping."; options = @("42", "44", "46", "52"); correctIndex = 1 },
                    [PSCustomObject]@{ id = 3; text = "Perimetri 24 sm bo'lgan kvadratning bir tomoni nechiga teng?"; options = @("4 sm", "5 sm", "6 sm", "8 sm"); correctIndex = 2 },
                    [PSCustomObject]@{ id = 4; text = "15 ga eng yaqin juft sonni tanlang."; options = @("13", "14", "15", "17"); correctIndex = 1 }
                )
            },
            [PSCustomObject]@{
                id = 2
                title = "Ingliz Tili Challenge"
                subject = "english"
                description = "8-9-sinf o'quvchilari uchun grammatika, vocabulary va reading savollari."
                gradeLevels = @(8, 9)
                startAt = $startAt
                endAt = $endAt
                durationMinutes = 40
                createdBy = 1
                createdAt = Get-IsoNow
                questions = @(
                    [PSCustomObject]@{ id = 1; text = "Choose the correct form: She ___ to school every day."; options = @("go", "goes", "going", "gone"); correctIndex = 1 },
                    [PSCustomObject]@{ id = 2; text = "Which word is a synonym of 'big'?"; options = @("small", "tiny", "large", "short"); correctIndex = 2 },
                    [PSCustomObject]@{ id = 3; text = "Select the correct question: ___ you like English?"; options = @("Do", "Does", "Did", "Is"); correctIndex = 0 },
                    [PSCustomObject]@{ id = 4; text = "Choose the correct translation of 'kitob'. "; options = @("pen", "book", "copybook", "bag"); correctIndex = 1 }
                )
            }
        )
        submissions = @()
    }

    $database | ConvertTo-Json -Depth 12 | Set-Content -Path $Script:DataPath -Encoding UTF8
}

function Read-Database {
    return (Get-Content -Path $Script:DataPath -Raw | ConvertFrom-Json)
}

function Save-Database {
    param([object]$Database)

    $Database | ConvertTo-Json -Depth 12 | Set-Content -Path $Script:DataPath -Encoding UTF8
}

function New-StudentCode {
    param([int]$Id)
    return "ZA-2026-{0:D4}" -f $Id
}

function New-AuthToken {
    param(
        [int]$UserId,
        [string]$Role
    )

    $payload = [PSCustomObject]@{
        userId = $UserId
        role = $Role
        exp = (Get-Date).AddDays(7).ToString("o")
    } | ConvertTo-Json -Compress

    $encodedPayload = ConvertTo-Base64Url $payload
    $secretBytes = [System.Text.Encoding]::UTF8.GetBytes((Get-SessionSecret))
    $payloadBytes = [System.Text.Encoding]::UTF8.GetBytes($encodedPayload)
    $hmac = New-Object System.Security.Cryptography.HMACSHA256
    $hmac.Key = $secretBytes
    $signature = [Convert]::ToBase64String($hmac.ComputeHash($payloadBytes)).TrimEnd("=").Replace("+", "-").Replace("/", "_")
    return "$encodedPayload.$signature"
}

function Get-AuthPayload {
    param([string]$Token)

    if ([string]::IsNullOrWhiteSpace($Token) -or -not $Token.Contains(".")) {
        return $null
    }

    $parts = $Token.Split(".")
    if ($parts.Length -ne 2) {
        return $null
    }

    $secretBytes = [System.Text.Encoding]::UTF8.GetBytes((Get-SessionSecret))
    $payloadBytes = [System.Text.Encoding]::UTF8.GetBytes($parts[0])
    $hmac = New-Object System.Security.Cryptography.HMACSHA256
    $hmac.Key = $secretBytes
    $expected = [Convert]::ToBase64String($hmac.ComputeHash($payloadBytes)).TrimEnd("=").Replace("+", "-").Replace("/", "_")

    if ($expected -ne $parts[1]) {
        return $null
    }

    $payloadJson = ConvertFrom-Base64Url $parts[0]
    $payload = $payloadJson | ConvertFrom-Json
    if ([datetime]::Parse($payload.exp) -lt (Get-Date)) {
        return $null
    }

    return $payload
}

function Set-SessionCookie {
    param(
        [object]$Response,
        [string]$Token,
        [string]$Role
    )

    $expires = [DateTime]::UtcNow.AddDays(7).ToString("R")
    $cookieName = if ($Role -eq "admin") { $Script:AdminSessionCookieName } else { $Script:StudentSessionCookieName }
    [void]$Response.Cookies.Add("$cookieName=$Token; Path=/; HttpOnly; SameSite=Lax; Expires=$expires")
}

function Clear-SessionCookie {
    param([object]$Response)
    [void]$Response.Cookies.Add("$($Script:StudentSessionCookieName)=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT")
    [void]$Response.Cookies.Add("$($Script:AdminSessionCookieName)=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT")
    [void]$Response.Cookies.Add("$($Script:LegacySessionCookieName)=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT")
}

function Get-CurrentUser {
    param(
        [object]$Request,
        [object]$Database,
        [string]$PreferredRole = "student"
    )

    $cookieName = if ($PreferredRole -eq "admin") { $Script:AdminSessionCookieName } else { $Script:StudentSessionCookieName }
    $cookie = $Request.Cookies[$cookieName]
    if ($null -eq $cookie -and $PreferredRole -eq "student") {
        $cookie = $Request.Cookies[$Script:LegacySessionCookieName]
    }

    if ($null -eq $cookie) {
        return $null
    }

    $payload = Get-AuthPayload $cookie
    if ($null -eq $payload) {
        return $null
    }

    return ($Database.users | Where-Object { $_.id -eq [int]$payload.userId } | Select-Object -First 1)
}

function Get-SafeUser {
    param([object]$User)

    if ($null -eq $User) {
        return $null
    }

    return [PSCustomObject]@{
        id = $User.id
        role = $User.role
        username = $User.username
        firstName = $User.firstName
        lastName = $User.lastName
        studentCode = $User.studentCode
        class = $User.class
        createdAt = $User.createdAt
    }
}

function Read-JsonBody {
    param([object]$Request)

    $raw = $Request.Body

    if ([string]::IsNullOrWhiteSpace($raw)) {
        return $null
    }

    return $raw | ConvertFrom-Json
}

function Get-ReasonPhrase {
    param([int]$StatusCode)

    switch ($StatusCode) {
        200 { return "OK" }
        201 { return "Created" }
        204 { return "No Content" }
        400 { return "Bad Request" }
        401 { return "Unauthorized" }
        403 { return "Forbidden" }
        404 { return "Not Found" }
        409 { return "Conflict" }
        500 { return "Internal Server Error" }
        default { return "OK" }
    }
}

function Send-BytesResponse {
    param(
        [object]$Response,
        [int]$StatusCode,
        [string]$ContentType,
        [byte[]]$Bytes
    )

    if ($Response.Sent) {
        return
    }

    $reason = Get-ReasonPhrase $StatusCode
    $headerBuilder = New-Object System.Text.StringBuilder
    [void]$headerBuilder.Append("HTTP/1.1 $StatusCode $reason`r`n")
    [void]$headerBuilder.Append("Content-Type: $ContentType`r`n")
    [void]$headerBuilder.Append("Content-Length: $($Bytes.Length)`r`n")
    [void]$headerBuilder.Append("Connection: close`r`n")
    [void]$headerBuilder.Append("Access-Control-Allow-Origin: http://localhost:$Port`r`n")
    [void]$headerBuilder.Append("Access-Control-Allow-Credentials: true`r`n")
    [void]$headerBuilder.Append("Access-Control-Allow-Headers: Content-Type`r`n")
    [void]$headerBuilder.Append("Access-Control-Allow-Methods: GET, POST, OPTIONS`r`n")
    foreach ($cookie in $Response.Cookies) {
        [void]$headerBuilder.Append("Set-Cookie: $cookie`r`n")
    }
    [void]$headerBuilder.Append("`r`n")

    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headerBuilder.ToString())
    $Response.Stream.Write($headerBytes, 0, $headerBytes.Length)
    if ($Bytes.Length -gt 0) {
        $Response.Stream.Write($Bytes, 0, $Bytes.Length)
    }
    $Response.Stream.Flush()
    $Response.Sent = $true
}

function Write-JsonResponse {
    param(
        [object]$Response,
        [int]$StatusCode,
        [object]$Data
    )

    $json = $Data | ConvertTo-Json -Depth 12
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    Send-BytesResponse -Response $Response -StatusCode $StatusCode -ContentType "application/json; charset=utf-8" -Bytes $bytes
}

function Write-FileResponse {
    param(
        [object]$Response,
        [string]$FilePath
    )

    $extension = [System.IO.Path]::GetExtension($FilePath).ToLowerInvariant()
    $contentType = switch ($extension) {
        ".html" { "text/html; charset=utf-8" }
        ".css" { "text/css; charset=utf-8" }
        ".js" { "application/javascript; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".svg" { "image/svg+xml" }
        ".png" { "image/png" }
        default { "application/octet-stream" }
    }

    $bytes = [System.IO.File]::ReadAllBytes($FilePath)
    Send-BytesResponse -Response $Response -StatusCode 200 -ContentType $contentType -Bytes $bytes
}

function Write-NotFound {
    param([object]$Response)

    $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
    Send-BytesResponse -Response $Response -StatusCode 404 -ContentType "text/plain; charset=utf-8" -Bytes $bytes
}

function Write-ErrorResponse {
    param(
        [object]$Response,
        [int]$StatusCode,
        [string]$Message
    )

    Write-JsonResponse $Response $StatusCode ([PSCustomObject]@{
        ok = $false
        message = $Message
    })
}

function Test-ValidName {
    param([string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return $false
    }

    $trimmed = $Value.Trim()
    return $trimmed -match "^[A-Za-z' -]{2,40}$"
}

function Test-ValidGrade {
    param([object]$Value)

    $grade = 0
    if (-not [int]::TryParse([string]$Value, [ref]$grade)) {
        return $false
    }

    return $grade -ge 5 -and $grade -le 9
}

function Get-SubjectLabel {
    param([string]$Subject)
    switch ($Subject) {
        "math" { return "Matematika" }
        "english" { return "Ingliz tili" }
        default { return $Subject }
    }
}

function Get-OlympiadStatus {
    param([object]$Olympiad)

    $now = Get-Date
    $startAt = [datetime]::Parse($Olympiad.startAt)
    $endAt = [datetime]::Parse($Olympiad.endAt)

    if ($now -lt $startAt) { return "scheduled" }
    if ($now -gt $endAt) { return "ended" }
    return "active"
}

function Get-RankForSubmission {
    param(
        [object]$Database,
        [int]$OlympiadId,
        [int]$SubmissionId
    )

    $ranked = @($Database.submissions | Where-Object { $_.olympiadId -eq $OlympiadId } | Sort-Object @{ Expression = { $_.percentage }; Descending = $true }, @{ Expression = { [datetime]::Parse($_.submittedAt) }; Descending = $false })
    for ($i = 0; $i -lt $ranked.Count; $i++) {
        if ($ranked[$i].id -eq $SubmissionId) {
            return ($i + 1)
        }
    }

    return $null
}

function Get-StudentDashboardData {
    param(
        [object]$Database,
        [object]$Student
    )

    $studentSubmissions = @($Database.submissions | Where-Object { $_.userId -eq $Student.id })
    $recentItems = @()
    $totalPercentage = 0
    $top3Count = 0
    $subjectGroups = @{}

    foreach ($submission in $studentSubmissions) {
        $olympiad = $Database.olympiads | Where-Object { $_.id -eq $submission.olympiadId } | Select-Object -First 1
        if ($null -eq $olympiad) {
            continue
        }

        $rank = Get-RankForSubmission $Database $submission.olympiadId $submission.id
        if ($rank -and $rank -le 3) {
            $top3Count++
        }

        $subject = $olympiad.subject
        if (-not $subjectGroups.ContainsKey($subject)) {
            $subjectGroups[$subject] = [PSCustomObject]@{
                subject = $subject
                label = Get-SubjectLabel $subject
                participated = 0
                average = 0
            }
        }

        $subjectGroups[$subject].participated++
        $subjectGroups[$subject].average += [double]$submission.percentage
        $totalPercentage += [double]$submission.percentage

        $recentItems += [PSCustomObject]@{
            submissionId = $submission.id
            olympiadId = $submission.olympiadId
            title = $olympiad.title
            subject = $olympiad.subject
            subjectLabel = Get-SubjectLabel $olympiad.subject
            submittedAt = $submission.submittedAt
            percentage = [math]::Round([double]$submission.percentage, 1)
            correctCount = $submission.correctCount
            totalQuestions = $submission.totalQuestions
            rank = $rank
        }
    }

    $subjectStats = @()
    foreach ($entry in $subjectGroups.GetEnumerator()) {
        $item = $entry.Value
        $average = if ($item.participated -gt 0) { [math]::Round(($item.average / $item.participated), 1) } else { 0 }
        $subjectStats += [PSCustomObject]@{
            subject = $item.subject
            label = $item.label
            participated = $item.participated
            average = $average
        }
    }

    $studentGrade = [int]$Student.class
    $submittedIds = @($studentSubmissions | ForEach-Object { $_.olympiadId })
    $available = @(
        $Database.olympiads |
        Where-Object {
            $_.gradeLevels -contains $studentGrade -and
            (Get-OlympiadStatus $_) -eq "active" -and
            $submittedIds -notcontains $_.id
        } |
        Sort-Object { [datetime]::Parse($_.endAt) }
    ) | ForEach-Object {
        [PSCustomObject]@{
            id = $_.id
            title = $_.title
            subject = $_.subject
            subjectLabel = Get-SubjectLabel $_.subject
            description = $_.description
            startAt = $_.startAt
            endAt = $_.endAt
            durationMinutes = $_.durationMinutes
            questionCount = @($_.questions).Count
            gradeLevels = $_.gradeLevels
        }
    }

    $recentSorted = @($recentItems | Sort-Object { [datetime]::Parse($_.submittedAt) } -Descending)
    $averagePercentage = if ($studentSubmissions.Count -gt 0) { [math]::Round(($totalPercentage / $studentSubmissions.Count), 1) } else { 0 }

    return [PSCustomObject]@{
        profile = [PSCustomObject]@{
            firstName = $Student.firstName
            lastName = $Student.lastName
            class = $Student.class
            studentCode = $Student.studentCode
        }
        stats = [PSCustomObject]@{
            totalParticipated = $studentSubmissions.Count
            top3Wins = $top3Count
            averagePercentage = $averagePercentage
            subjectStats = @($subjectStats | Sort-Object label)
        }
        availableOlympiads = @($available)
        recent = @($recentSorted)
    }
}

function Get-ResultPayload {
    param(
        [object]$Database,
        [object]$Submission
    )

    $olympiad = $Database.olympiads | Where-Object { $_.id -eq $Submission.olympiadId } | Select-Object -First 1
    $student = $Database.users | Where-Object { $_.id -eq $Submission.userId } | Select-Object -First 1
    $questions = @()

    for ($i = 0; $i -lt @($olympiad.questions).Count; $i++) {
        $question = $olympiad.questions[$i]
        $selectedIndex = $Submission.answers[$i]
        $isCorrect = $selectedIndex -eq $question.correctIndex

        $questions += [PSCustomObject]@{
            number = ($i + 1)
            text = $question.text
            options = $question.options
            selectedIndex = $selectedIndex
            correctIndex = $question.correctIndex
            isCorrect = $isCorrect
        }
    }

    return [PSCustomObject]@{
        submissionId = $Submission.id
        olympiad = [PSCustomObject]@{
            id = $olympiad.id
            title = $olympiad.title
            subject = $olympiad.subject
            subjectLabel = Get-SubjectLabel $olympiad.subject
            submittedAt = $Submission.submittedAt
            percentage = $Submission.percentage
            correctCount = $Submission.correctCount
            totalQuestions = $Submission.totalQuestions
            student = [PSCustomObject]@{
                firstName = $student.firstName
                lastName = $student.lastName
                class = $student.class
            }
        }
        questions = @($questions)
    }
}

function Ensure-Student {
    param([object]$User)
    return ($null -ne $User -and $User.role -eq "student")
}

function Ensure-Admin {
    param([object]$User)
    return ($null -ne $User -and $User.role -eq "admin")
}

function Handle-ApiRequest {
    param(
        [object]$Context,
        [string]$Method,
        [string]$Path
    )

    $db = Read-Database
    $studentUser = Get-CurrentUser $Context.Request $db "student"
    $adminUser = Get-CurrentUser $Context.Request $db "admin"
    $currentUser = if ($null -ne $studentUser) { $studentUser } else { $adminUser }

    if ($Method -eq "GET" -and $Path -eq "/api/context") {
        Write-JsonResponse $Context.Response 200 ([PSCustomObject]@{
            ok = $true
            user = Get-SafeUser $currentUser
            studentUser = Get-SafeUser $studentUser
            adminUser = Get-SafeUser $adminUser
            adminPortalPath = $Script:AdminPortalPath
        })
        return
    }

    if ($Method -eq "POST" -and $Path -eq "/api/auth/register") {
        $body = Read-JsonBody $Context.Request
        $firstName = [string]$body.firstName
        $lastName = [string]$body.lastName
        $grade = [string]$body.class
        $password = [string]$body.password

        if (-not (Test-ValidName $firstName) -or -not (Test-ValidName $lastName)) {
            Write-ErrorResponse $Context.Response 400 "Ism va familiya to'liq va to'g'ri kiritilishi kerak."
            return
        }

        if (-not (Test-ValidGrade $grade)) {
            Write-ErrorResponse $Context.Response 400 "Sinf faqat 5-sinfdan 9-sinfgacha bo'lishi mumkin."
            return
        }

        if ([string]::IsNullOrWhiteSpace($password) -or $password.Trim().Length -lt 6) {
            Write-ErrorResponse $Context.Response 400 "Parol kamida 6 ta belgidan iborat bo'lishi kerak."
            return
        }

        $normalizedFirstName = $firstName.Trim()
        $normalizedLastName = $lastName.Trim()
        $normalizedGrade = [int]$grade
        $existing = @(
            $db.users |
            Where-Object {
                $_.role -eq "student" -and
                $_.firstName.ToLowerInvariant() -eq $normalizedFirstName.ToLowerInvariant() -and
                $_.lastName.ToLowerInvariant() -eq $normalizedLastName.ToLowerInvariant() -and
                [int]$_.class -eq $normalizedGrade
            }
        )

        if ($existing.Count -gt 0) {
            Write-ErrorResponse $Context.Response 409 "Bu ism, familiya va sinf bilan o'quvchi allaqachon ro'yxatdan o'tgan."
            return
        }

        $newId = [int]$db.meta.nextUserId
        $passwordData = New-PasswordHash $password
        $student = [PSCustomObject]@{
            id = $newId
            role = "student"
            username = $null
            firstName = $normalizedFirstName
            lastName = $normalizedLastName
            studentCode = New-StudentCode $newId
            class = $normalizedGrade
            passwordSalt = $passwordData.salt
            passwordHash = $passwordData.hash
            createdAt = Get-IsoNow
        }

        $db.users = @($db.users) + $student
        $db.meta.nextUserId = $newId + 1
        Save-Database $db

        $token = New-AuthToken -UserId $student.id -Role "student"
        Set-SessionCookie $Context.Response $token "student"
        Write-JsonResponse $Context.Response 201 ([PSCustomObject]@{
            ok = $true
            user = Get-SafeUser $student
            redirectTo = "/dashboard"
        })
        return
    }

    if ($Method -eq "POST" -and $Path -eq "/api/auth/login") {
        $body = Read-JsonBody $Context.Request
        $studentCode = [string]$body.studentCode
        $password = [string]$body.password

        $student = $db.users | Where-Object { $_.role -eq "student" -and $_.studentCode -eq $studentCode.Trim() } | Select-Object -First 1
        if ($null -eq $student -or -not (Test-Password $password $student.passwordSalt $student.passwordHash)) {
            Write-ErrorResponse $Context.Response 401 "Student ID yoki parol noto'g'ri."
            return
        }

        Set-SessionCookie $Context.Response (New-AuthToken -UserId $student.id -Role "student") "student"
        Write-JsonResponse $Context.Response 200 ([PSCustomObject]@{
            ok = $true
            user = Get-SafeUser $student
            redirectTo = "/dashboard"
        })
        return
    }

    if ($Method -eq "POST" -and $Path -eq "/api/auth/admin-login") {
        $body = Read-JsonBody $Context.Request
        $username = [string]$body.username
        $password = [string]$body.password

        $admin = $db.users | Where-Object { $_.role -eq "admin" -and $_.username -eq $username.Trim() } | Select-Object -First 1
        if ($null -eq $admin -or -not (Test-Password $password $admin.passwordSalt $admin.passwordHash)) {
            Write-ErrorResponse $Context.Response 401 "Admin login ma'lumotlari noto'g'ri."
            return
        }

        Set-SessionCookie $Context.Response (New-AuthToken -UserId $admin.id -Role "admin") "admin"
        Write-JsonResponse $Context.Response 200 ([PSCustomObject]@{
            ok = $true
            user = Get-SafeUser $admin
            redirectTo = $Script:AdminPortalPath
        })
        return
    }

    if ($Method -eq "POST" -and $Path -eq "/api/auth/logout") {
        Clear-SessionCookie $Context.Response
        Write-JsonResponse $Context.Response 200 ([PSCustomObject]@{ ok = $true })
        return
    }

    if ($Method -eq "GET" -and $Path -eq "/api/student/dashboard") {
        if (-not (Ensure-Student $studentUser)) {
            Write-ErrorResponse $Context.Response 401 "Dashboard uchun tizimga kirish kerak."
            return
        }

        Write-JsonResponse $Context.Response 200 ([PSCustomObject]@{
            ok = $true
            dashboard = Get-StudentDashboardData $db $studentUser
        })
        return
    }

    if ($Method -eq "GET" -and $Path -eq "/api/student/help") {
        if (-not (Ensure-Student $studentUser)) {
            Write-ErrorResponse $Context.Response 401 "Help Center uchun tizimga kirish kerak."
            return
        }

        Write-JsonResponse $Context.Response 200 ([PSCustomObject]@{
            ok = $true
            sections = @(
                [PSCustomObject]@{ title = "Platformaga kirish"; body = "Student ID va parolingiz orqali tizimga kiring. Dashboardda sizga mos faol olimpiadalar avtomatik chiqadi." },
                [PSCustomObject]@{ title = "Test topshirish"; body = "Mavjud olimpiadalar bo'limidan kerakli testni tanlang, savollarga javob bering va yakunda topshiring." },
                [PSCustomObject]@{ title = "Natijani ko'rish"; body = "Recently bo'limidagi Natijasini ko'rish tugmasi orqali oldingi ishlagan testlaringizning to'g'ri va noto'g'ri javoblarini ko'rishingiz mumkin." }
            )
        })
        return
    }

    if ($Method -eq "GET" -and $Path -match "^/api/student/olympiads/(\d+)$") {
        if (-not (Ensure-Student $studentUser)) {
            Write-ErrorResponse $Context.Response 401 "Olimpiadani ko'rish uchun tizimga kirish kerak."
            return
        }

        $olympiadId = [int]$Matches[1]
        $olympiad = $db.olympiads | Where-Object { $_.id -eq $olympiadId } | Select-Object -First 1
        if ($null -eq $olympiad) {
            Write-ErrorResponse $Context.Response 404 "Olimpiada topilmadi."
            return
        }

        if ((Get-OlympiadStatus $olympiad) -ne "active" -or $olympiad.gradeLevels -notcontains [int]$studentUser.class) {
            Write-ErrorResponse $Context.Response 403 "Bu olimpiada hozir siz uchun faol emas."
            return
        }

        $existingSubmission = $db.submissions | Where-Object { $_.olympiadId -eq $olympiadId -and $_.userId -eq $studentUser.id } | Select-Object -First 1
        if ($null -ne $existingSubmission) {
            Write-ErrorResponse $Context.Response 409 "Siz bu olimpiadani allaqachon topshirgansiz."
            return
        }

        $questions = @()
        foreach ($question in $olympiad.questions) {
            $questions += [PSCustomObject]@{
                id = $question.id
                text = $question.text
                options = $question.options
            }
        }

        Write-JsonResponse $Context.Response 200 ([PSCustomObject]@{
            ok = $true
            olympiad = [PSCustomObject]@{
                id = $olympiad.id
                title = $olympiad.title
                subject = $olympiad.subject
                subjectLabel = Get-SubjectLabel $olympiad.subject
                description = $olympiad.description
                durationMinutes = $olympiad.durationMinutes
                startAt = $olympiad.startAt
                endAt = $olympiad.endAt
                questions = @($questions)
            }
        })
        return
    }

    if ($Method -eq "POST" -and $Path -match "^/api/student/olympiads/(\d+)/submit$") {
        if (-not (Ensure-Student $studentUser)) {
            Write-ErrorResponse $Context.Response 401 "Test topshirish uchun tizimga kirish kerak."
            return
        }

        $olympiadId = [int]$Matches[1]
        $olympiad = $db.olympiads | Where-Object { $_.id -eq $olympiadId } | Select-Object -First 1
        if ($null -eq $olympiad) {
            Write-ErrorResponse $Context.Response 404 "Olimpiada topilmadi."
            return
        }

        if ((Get-OlympiadStatus $olympiad) -ne "active" -or $olympiad.gradeLevels -notcontains [int]$studentUser.class) {
            Write-ErrorResponse $Context.Response 403 "Bu olimpiada hozir siz uchun faol emas."
            return
        }

        $existingSubmission = $db.submissions | Where-Object { $_.olympiadId -eq $olympiadId -and $_.userId -eq $studentUser.id } | Select-Object -First 1
        if ($null -ne $existingSubmission) {
            Write-ErrorResponse $Context.Response 409 "Siz bu olimpiadani allaqachon topshirgansiz."
            return
        }

        $body = Read-JsonBody $Context.Request
        $answers = @($body.answers)
        if ($answers.Count -ne @($olympiad.questions).Count) {
            Write-ErrorResponse $Context.Response 400 "Barcha savollar uchun javob tanlanishi kerak."
            return
        }

        $correctCount = 0
        $normalizedAnswers = @()
        for ($i = 0; $i -lt @($olympiad.questions).Count; $i++) {
            $question = $olympiad.questions[$i]
            $selectedIndex = -1
            if (-not [int]::TryParse([string]$answers[$i], [ref]$selectedIndex)) {
                Write-ErrorResponse $Context.Response 400 "Savol javoblari noto'g'ri formatda yuborildi."
                return
            }

            if ($selectedIndex -lt 0 -or $selectedIndex -ge @($question.options).Count) {
                Write-ErrorResponse $Context.Response 400 "Har bir savol uchun to'g'ri variant tanlanishi kerak."
                return
            }

            if ($selectedIndex -eq [int]$question.correctIndex) {
                $correctCount++
            }

            $normalizedAnswers += $selectedIndex
        }

        $totalQuestions = @($olympiad.questions).Count
        $percentage = [math]::Round(($correctCount / $totalQuestions) * 100, 1)
        $submissionId = [int]$db.meta.nextSubmissionId
        $submission = [PSCustomObject]@{
            id = $submissionId
            olympiadId = $olympiadId
            userId = $studentUser.id
            answers = $normalizedAnswers
            correctCount = $correctCount
            totalQuestions = $totalQuestions
            percentage = $percentage
            submittedAt = Get-IsoNow
        }

        $db.submissions = @($db.submissions) + $submission
        $db.meta.nextSubmissionId = $submissionId + 1
        Save-Database $db

        Write-JsonResponse $Context.Response 201 ([PSCustomObject]@{
            ok = $true
            submissionId = $submission.id
            redirectTo = "/results/$($submission.id)"
        })
        return
    }

    if ($Method -eq "GET" -and $Path -match "^/api/student/results/(\d+)$") {
        if (-not (Ensure-Student $studentUser)) {
            Write-ErrorResponse $Context.Response 401 "Natijani ko'rish uchun tizimga kirish kerak."
            return
        }

        $submissionId = [int]$Matches[1]
        $submission = $db.submissions | Where-Object { $_.id -eq $submissionId -and $_.userId -eq $studentUser.id } | Select-Object -First 1
        if ($null -eq $submission) {
            Write-ErrorResponse $Context.Response 404 "Natija topilmadi."
            return
        }

        Write-JsonResponse $Context.Response 200 ([PSCustomObject]@{
            ok = $true
            result = Get-ResultPayload $db $submission
        })
        return
    }

    if ($Method -eq "GET" -and $Path -eq "/api/admin/overview") {
        if (-not (Ensure-Admin $adminUser)) {
            Write-ErrorResponse $Context.Response 401 "Admin panel uchun maxsus kirish kerak."
            return
        }

        $olympiads = @($db.olympiads | Sort-Object { [datetime]::Parse($_.createdAt) } -Descending | ForEach-Object {
            $olympiadItem = $_
            [PSCustomObject]@{
                id = $olympiadItem.id
                title = $olympiadItem.title
                subject = $olympiadItem.subject
                subjectLabel = Get-SubjectLabel $olympiadItem.subject
                description = $olympiadItem.description
                gradeLevels = $olympiadItem.gradeLevels
                startAt = $olympiadItem.startAt
                endAt = $olympiadItem.endAt
                durationMinutes = $olympiadItem.durationMinutes
                questionCount = @($olympiadItem.questions).Count
                status = Get-OlympiadStatus $olympiadItem
                submissionCount = @($db.submissions | Where-Object { $_.olympiadId -eq $olympiadItem.id }).Count
            }
        })

        Write-JsonResponse $Context.Response 200 ([PSCustomObject]@{
            ok = $true
            admin = [PSCustomObject]@{
                firstName = $adminUser.firstName
                lastName = $adminUser.lastName
            }
            summary = [PSCustomObject]@{
                active = @($olympiads | Where-Object { $_.status -eq "active" }).Count
                scheduled = @($olympiads | Where-Object { $_.status -eq "scheduled" }).Count
                ended = @($olympiads | Where-Object { $_.status -eq "ended" }).Count
                submissions = @($db.submissions).Count
            }
            olympiads = @($olympiads)
        })
        return
    }

    if ($Method -eq "POST" -and $Path -match "^/api/admin/olympiads/(\d+)/end$") {
        if (-not (Ensure-Admin $adminUser)) {
            Write-ErrorResponse $Context.Response 401 "Admin panel uchun maxsus kirish kerak."
            return
        }

        $olympiadId = [int]$Matches[1]
        $olympiad = $db.olympiads | Where-Object { $_.id -eq $olympiadId } | Select-Object -First 1
        if ($null -eq $olympiad) {
            Write-ErrorResponse $Context.Response 404 "Olimpiada topilmadi."
            return
        }

        $olympiad.endAt = (Get-Date).AddMinutes(-1).ToString("o")
        Save-Database $db

        Write-JsonResponse $Context.Response 200 ([PSCustomObject]@{
            ok = $true
            olympiadId = $olympiadId
        })
        return
    }

    if ($Method -eq "POST" -and $Path -eq "/api/admin/olympiads") {
        if (-not (Ensure-Admin $adminUser)) {
            Write-ErrorResponse $Context.Response 401 "Admin panel uchun maxsus kirish kerak."
            return
        }

        $body = Read-JsonBody $Context.Request
        $title = [string]$body.title
        $subject = [string]$body.subject
        $description = [string]$body.description
        $durationMinutes = 0
        [int]::TryParse([string]$body.durationMinutes, [ref]$durationMinutes) | Out-Null

        if ([string]::IsNullOrWhiteSpace($title) -or $title.Trim().Length -lt 4) {
            Write-ErrorResponse $Context.Response 400 "Olimpiada nomi kamida 4 belgidan iborat bo'lishi kerak."
            return
        }

        if ($subject -notin @("math", "english")) {
            Write-ErrorResponse $Context.Response 400 "Fan faqat matematika yoki ingliz tili bo'lishi mumkin."
            return
        }

        if ($durationMinutes -lt 10 -or $durationMinutes -gt 180) {
            Write-ErrorResponse $Context.Response 400 "Davomiylik 10 va 180 daqiqa oralig'ida bo'lishi kerak."
            return
        }

        $gradeLevels = @()
        foreach ($grade in @($body.gradeLevels)) {
            if (Test-ValidGrade $grade) {
                $gradeLevels += [int]$grade
            }
        }
        $gradeLevels = @($gradeLevels | Sort-Object -Unique)
        if ($gradeLevels.Count -eq 0) {
            Write-ErrorResponse $Context.Response 400 "Kamida bitta mos sinf tanlanishi kerak."
            return
        }

        $startAt = [datetime]::MinValue
        $endAt = [datetime]::MinValue
        if (-not [datetime]::TryParse([string]$body.startAt, [ref]$startAt) -or -not [datetime]::TryParse([string]$body.endAt, [ref]$endAt)) {
            Write-ErrorResponse $Context.Response 400 "Boshlanish va tugash vaqti to'g'ri kiritilishi kerak."
            return
        }

        if ($endAt -le $startAt) {
            Write-ErrorResponse $Context.Response 400 "Tugash vaqti boshlanish vaqtidan keyin bo'lishi kerak."
            return
        }

        $questions = @()
        $rawQuestions = @($body.questions)
        if ($rawQuestions.Count -lt 1) {
            Write-ErrorResponse $Context.Response 400 "Kamida bitta savol kiritilishi kerak."
            return
        }

        for ($i = 0; $i -lt $rawQuestions.Count; $i++) {
            $question = $rawQuestions[$i]
            $text = [string]$question.text
            $options = @($question.options | ForEach-Object { [string]$_ })
            $correctIndex = -1
            [int]::TryParse([string]$question.correctIndex, [ref]$correctIndex) | Out-Null

            if ([string]::IsNullOrWhiteSpace($text) -or $options.Count -ne 4 -or @($options | Where-Object { [string]::IsNullOrWhiteSpace($_) }).Count -gt 0 -or $correctIndex -lt 0 -or $correctIndex -gt 3) {
                Write-ErrorResponse $Context.Response 400 "Har bir savol to'liq, 4 ta variantli va bitta to'g'ri javobli bo'lishi kerak."
                return
            }

            $questions += [PSCustomObject]@{
                id = ($i + 1)
                text = $text.Trim()
                options = $options
                correctIndex = $correctIndex
            }
        }

        $newOlympiadId = [int]$db.meta.nextOlympiadId
        $newOlympiad = [PSCustomObject]@{
            id = $newOlympiadId
            title = $title.Trim()
            subject = $subject
            description = $description.Trim()
            gradeLevels = $gradeLevels
            startAt = $startAt.ToString("o")
            endAt = $endAt.ToString("o")
            durationMinutes = $durationMinutes
            createdBy = $adminUser.id
            createdAt = Get-IsoNow
            questions = $questions
        }

        $db.olympiads = @($db.olympiads) + $newOlympiad
        $db.meta.nextOlympiadId = $newOlympiadId + 1
        Save-Database $db

        Write-JsonResponse $Context.Response 201 ([PSCustomObject]@{
            ok = $true
            olympiadId = $newOlympiad.id
        })
        return
    }

    Write-NotFound $Context.Response
}

function Handle-Request {
    param([object]$Context)

    $response = $Context.Response
    $request = $Context.Request
    $path = $request.Path
    $method = $request.Method

    if ($method -eq "OPTIONS") {
        Send-BytesResponse -Response $response -StatusCode 204 -ContentType "text/plain; charset=utf-8" -Bytes ([byte[]]@())
        return
    }

    try {
        if ($path.StartsWith("/api/")) {
            Handle-ApiRequest -Context $Context -Method $method -Path $path
            return
        }

        $relativePath = if ($path -eq "/") { "index.html" } else { $path.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar) }
        $targetPath = Join-Path $Script:PublicPath $relativePath
        $publicFullPath = [System.IO.Path]::GetFullPath($Script:PublicPath)
        $resolvedTarget = [System.IO.Path]::GetFullPath($targetPath)

        if ($resolvedTarget.StartsWith($publicFullPath) -and (Test-Path $resolvedTarget) -and -not (Get-Item $resolvedTarget).PSIsContainer) {
            Write-FileResponse $response $resolvedTarget
            return
        }

        Write-FileResponse $response (Join-Path $Script:PublicPath "index.html")
    }
    catch {
        $message = $_.Exception.Message
        if ($response.Sent) {
            return
        }

        Write-JsonResponse $response 500 ([PSCustomObject]@{
            ok = $false
            message = "Server xatosi: $message"
        })
    }
}

Initialize-Database
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
function Read-HttpRequest {
    param([System.Net.Sockets.TcpClient]$Client)

    $stream = $Client.GetStream()
    $buffer = New-Object byte[] 4096
    $headerData = New-Object System.Collections.Generic.List[byte]
    $headerEnd = -1

    while ($headerEnd -lt 0) {
        $read = $stream.Read($buffer, 0, $buffer.Length)
        if ($read -le 0) {
            return $null
        }

        for ($i = 0; $i -lt $read; $i++) {
            $headerData.Add($buffer[$i])
        }

        $bytes = $headerData.ToArray()
        for ($i = 0; $i -le ($bytes.Length - 4); $i++) {
            if ($bytes[$i] -eq 13 -and $bytes[$i + 1] -eq 10 -and $bytes[$i + 2] -eq 13 -and $bytes[$i + 3] -eq 10) {
                $headerEnd = $i
                break
            }
        }
    }

    $allBytes = $headerData.ToArray()
    $headerBytes = New-Object byte[] $headerEnd
    [System.Array]::Copy($allBytes, 0, $headerBytes, 0, $headerEnd)
    $headerText = [System.Text.Encoding]::UTF8.GetString($headerBytes)
    $lines = $headerText -split "`r`n"
    if ($lines.Count -eq 0) {
        return $null
    }

    $requestLine = $lines[0].Split(" ")
    $rawPath = if ($requestLine.Length -gt 1) { $requestLine[1] } else { "/" }
    $uri = [Uri]("http://localhost:$Port$rawPath")
    $headers = @{}
    if ($lines.Count -gt 1) {
        foreach ($line in $lines[1..($lines.Count - 1)]) {
            if ([string]::IsNullOrWhiteSpace($line) -or -not $line.Contains(":")) {
                continue
            }
            $parts = $line.Split(":", 2)
            $headers[$parts[0].Trim()] = $parts[1].Trim()
        }
    }

    $contentLength = 0
    if ($headers.ContainsKey("Content-Length")) {
        [int]::TryParse($headers["Content-Length"], [ref]$contentLength) | Out-Null
    }

    $bodyStart = $headerEnd + 4
    $remaining = $allBytes.Length - $bodyStart
    $bodyBytes = New-Object byte[] $contentLength
    if ($contentLength -gt 0) {
        if ($remaining -gt 0) {
            $copyLength = [Math]::Min($remaining, $contentLength)
            [System.Array]::Copy($allBytes, $bodyStart, $bodyBytes, 0, $copyLength)
            $offset = $copyLength
        } else {
            $offset = 0
        }

        while ($offset -lt $contentLength) {
            $chunk = $stream.Read($bodyBytes, $offset, $contentLength - $offset)
            if ($chunk -le 0) {
                break
            }
            $offset += $chunk
        }
    }

    $cookies = @{}
    if ($headers.ContainsKey("Cookie")) {
        foreach ($cookiePart in $headers["Cookie"].Split(";")) {
            $pair = $cookiePart.Split("=", 2)
            if ($pair.Length -eq 2) {
                $cookies[$pair[0].Trim()] = $pair[1].Trim()
            }
        }
    }

    return [PSCustomObject]@{
        Method = $requestLine[0].ToUpperInvariant()
        Path = $uri.AbsolutePath
        RawPath = $rawPath
        Headers = $headers
        Cookies = $cookies
        Body = if ($contentLength -gt 0) { [System.Text.Encoding]::UTF8.GetString($bodyBytes) } else { "" }
    }
}

function New-RequestContext {
    param([System.Net.Sockets.TcpClient]$Client)

    return [PSCustomObject]@{
        Client = $Client
        Stream = $Client.GetStream()
        Request = Read-HttpRequest $Client
        Response = [PSCustomObject]@{
            Stream = $Client.GetStream()
            Cookies = (New-Object System.Collections.ArrayList)
            Sent = $false
        }
    }
}

$address = [System.Net.IPAddress]::Parse("127.0.0.1")
$listener = New-Object System.Net.Sockets.TcpListener($address, $Port)
$listener.Start()

Write-Host ""
Write-Host "Zukko Avlod server is running at http://localhost:$Port"
Write-Host "Admin portal: http://localhost:$Port$($Script:AdminPortalPath)"
Write-Host "Admin username: $($Script:AdminUsername)"
Write-Host "Admin password: $($Script:AdminPassword)"
Write-Host "Press Ctrl + C to stop."
Write-Host ""

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $context = New-RequestContext $client
        if ($null -eq $context.Request) {
            $client.Close()
            continue
        }
        Handle-Request $context
        $context.Stream.Close()
        $client.Close()
    }
}
finally {
    $listener.Stop()
}
