const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Statik fayllarni serve qilish (public papkasidan)
app.use(express.static(path.join(__dirname, 'public')));

// Asosiy sahifa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`✅ Zukko Avlod serveri ${PORT} portda ishga tushdi!`);
});