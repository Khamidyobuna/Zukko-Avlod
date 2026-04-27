const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik fayllar
app.use(express.static(path.join(__dirname, 'public')));

// DB yo'li
const DB_PATH = path.join(__dirname, 'data', 'app-db.json');

// Yordamchi funksiyalar
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    return {
      meta: { createdAt: new Date().toISOString(), nextUserId: 1, nextOlympiadId: 1, nextSubmissionId: 1 },
      users: [],
      olympiads: [],
      submissions: []
    };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (err) {
    console.error("DB xatosi:", err);
    return { meta: {}, users: [], olympiads: [], submissions: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('base64');
}

function generateSalt() {
  return crypto.randomBytes(16).toString('base64');
}

// --- API ROUTES ---

// 1. Context
app.get('/api/context', (req, res) => {
  res.json({ ok: true, user: null });
});

// 2. Admin Login
app.post('/api/auth/admin-login', (req, res) => {
  const { username, password } = req.body;

  // README dagi default admin
  if (username === 'begzod' && password === 'Begzod2026!') {
    return res.json({ message: "Muvaffaqiyatli", redirectTo: "/teacher-portal-begzod-2026" });
  }

  res.status(401).json({ message: "Login yoki parol noto'g'ri" });
});

// 3. Admin Overview
app.get('/api/admin/overview', (req, res) => {
  const db = readDB();
  const now = new Date();

  const summary = { active: 0, scheduled: 0, ended: 0, submissions: db.submissions.length };

  const olympiads = db.olympiads.map(o => {
    const start = new Date(o.startAt);
    const end = new Date(o.endAt);
    let status = 'scheduled';

    if (now >= start && now <= end) status = 'active';
    else if (now > end) status = 'ended';

    if (status === 'active') summary.active++;
    else if (status === 'scheduled') summary.scheduled++;
    else summary.ended++;

    let subjectLabel = o.subject === 'math' ? 'Matematika' : (o.subject === 'english' ? 'Ingliz tili' : o.subject);

    return {
      ...o,
      status,
      subjectLabel,
      submissionCount: db.submissions.filter(s => s.olympiadId === o.id).length
    };
  });

  const admin = { firstName: 'Begzod', lastName: 'Poziljonov' };

  res.json({
    admin,
    summary,
    olympiads: olympiads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  });
});

// 4. Yangi Olimpiada Qo'shish
app.post('/api/admin/olympiads', (req, res) => {
  const db = readDB();
  const newOlympiad = req.body;

  newOlympiad.id = db.meta.nextOlympiadId++;
  newOlympiad.createdBy = 1;
  newOlympiad.createdAt = new Date().toISOString();

  if (newOlympiad.questions) {
    newOlympiad.questions.forEach((q, index) => {
      q.id = index + 1;
    });
  }

  db.olympiads.push(newOlympiad);
  writeDB(db);

  res.json({ message: "Olimpiada yaratildi", olympiad: newOlympiad });
});

// 5. Olimpiadani Tugatish
app.post('/api/admin/olympiads/:id/end', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const olympiad = db.olympiads.find(o => o.id === id);

  if (olympiad) {
    olympiad.endAt = new Date(Date.now() - 1000 * 60).toISOString();
    writeDB(db);
    res.json({ message: "Olimpiada tugatildi" });
  } else {
    res.status(404).json({ message: "Topilmadi" });
  }
});

// 6. Student Register
app.post('/api/auth/register', (req, res) => {
  const db = readDB();
  const { firstName, lastName, class: grade, password } = req.body;

  const salt = generateSalt();
  const hash = hashPassword(password, salt);

  const newUser = {
    id: db.meta.nextUserId++,
    role: 'student',
    firstName,
    lastName,
    studentCode: `ZA-2026-${String(db.meta.nextUserId - 1).padStart(4, '0')}`,
    class: parseInt(grade),
    passwordSalt: salt,
    passwordHash: hash,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  res.json({ message: "Ro'yxatdan o'tildi", user: newUser, redirectTo: "/dashboard" });
});

// 7. Student Login
app.post('/api/auth/login', (req, res) => {
  const db = readDB();
  const { studentCode, password } = req.body;

  const user = db.users.find(u => u.studentCode === studentCode && u.role === 'student');

  if (user) {
    const hash = hashPassword(password, user.passwordSalt);
    if (hash === user.passwordHash) {
      return res.json({ message: "Kirildi", user, redirectTo: "/dashboard" });
    }
  }

  res.status(401).json({ message: "Student ID yoki parol noto'g'ri" });
});

// 8. Dashboard Data (Demo)
app.get('/api/student/dashboard', (req, res) => {
  const userCode = req.query.code;
  const db = readDB();

  let profile = { firstName: "Mehmon", lastName: "", class: 9, studentCode: "N/A" };
  let stats = { totalParticipated: 0, top3Wins: 0, averagePercentage: 0, subjectStats: [] };
  let availableOlympiads = [];
  let recent = [];

  if (userCode) {
    const user = db.users.find(u => u.studentCode === userCode);
    if (user) {
      profile = user;

      const now = new Date();
      availableOlympiads = db.olympiads.filter(o => {
        const start = new Date(o.startAt);
        const end = new Date(o.endAt);
        return now >= start && now <= end && o.gradeLevels.includes(user.class);
      }).map(o => ({
        ...o,
        questionCount: o.questions ? o.questions.length : 0
      }));

      const submissions = db.submissions.filter(s => s.userId === user.id);
      recent = submissions.map(s => {
        const olympiad = db.olympiads.find(o => o.id === s.olympiadId);
        return {
          ...s,
          title: olympiad ? olympiad.title : "Noma'lum",
          subject: olympiad ? olympiad.subject : "unknown"
        };
      });

      // Stats hisoblash (soddalashtirilgan)
      stats.totalParticipated = submissions.length;
    }
  }

  res.json({
    dashboard: {
      profile,
      stats,
      availableOlympiads,
      recent
    }
  });
});

// SPA uchun Catch-all Route
app.get('*', (req, res) => {
  if (req.path.includes('.') && !req.path.startsWith('/api/')) {
    return res.status(404).send('File not found');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server
app.listen(PORT, () => {
  console.log(`✅ Server ${PORT} portda ishlayapti!`);
});