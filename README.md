# Zukko Avlod

`Zukko Avlod` maktab olimpiadalari uchun yaratilgan full-stack platforma. Loyiha PowerShell backend, vanilla frontend va JSON asosli yengil ma'lumotlar bazasi bilan ishlaydi.

## Nimalar bor

- Landing page, footer va `Begzod Poziljonov` haqida qisqa ma'lumot
- Student ro'yxatdan o'tishi va avtomatik dashboard redirect
- `5-sinf`dan `9-sinf`gacha validation
- Student login, dashboard, `Help Center`, faol olimpiadalar va `Recently`
- Test topshirish sahifasi
- Natija sahifasida savollar bo'yicha yuqori navigatsiya
- To'g'ri javoblar yashil, noto'g'ri javoblar qizil
- Hidden admin portal
- Admin paneldan kod yozmasdan olimpiada yaratish
- `dark mode` va `light mode`

## Ishga tushirish

PowerShell orqali:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080
```

Yoki:

```powershell
.\run.ps1
```

Shundan so'ng brauzerda oching:

- Student/public: [http://localhost:8080](http://localhost:8080)
- Admin portal: [http://localhost:8080/teacher-portal-begzod-2026](http://localhost:8080/teacher-portal-begzod-2026)

## Default admin login

- Login: `begzod`
- Parol: `Begzod2026!`

## Ma'lumotlar saqlanishi

Loyiha ma'lumotlari shu faylda saqlanadi:

- [data/app-db.json](C:\Users\Ziyodullo\OneDrive\Desktop\Zukko Avlod\data\app-db.json)

Session siri shu yerda yaratiladi:

- [data/session-secret.txt](C:\Users\Ziyodullo\OneDrive\Desktop\Zukko Avlod\data\session-secret.txt)

## Asosiy fayllar

- [server.ps1](C:\Users\Ziyodullo\OneDrive\Desktop\Zukko Avlod\server.ps1)
- [public/index.html](C:\Users\Ziyodullo\OneDrive\Desktop\Zukko Avlod\public\index.html)
- [public/assets/css/styles.css](C:\Users\Ziyodullo\OneDrive\Desktop\Zukko Avlod\public\assets\css\styles.css)
- [public/assets/js/app.js](C:\Users\Ziyodullo\OneDrive\Desktop\Zukko Avlod\public\assets\js\app.js)
