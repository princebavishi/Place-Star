const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// Dynamically select DB path: /data/database.sqlite inside Docker/Railway, local path otherwise
const dbPath = process.env.DB_PATH || (fs.existsSync('/data') ? '/data/database.sqlite' : path.join(__dirname, '..', 'database.sqlite'));


// SQL seed file — try repo root first, then Docker WORKDIR root (/app)
const sqlFile = (() => {
    const candidates = [
        path.join(__dirname, '..', '..', 'charusat_internship_portal.sql'),  // local dev
        path.join(__dirname, '..', 'charusat_internship_portal.sql'),         // Docker WORKDIR
        '/charusat_internship_portal.sql',                                     // volume mount
    ];
    return candidates.find(p => fs.existsSync(p)) || null;
})();



if (fs.existsSync(dbPath)) {
    console.log("Database file already exists. Skipping initialization.");
    return;
}

console.log("Initializing SQLite database at:", dbPath);
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec("PRAGMA foreign_keys = ON;");

// Create tables in order of dependency
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  UserID INTEGER PRIMARY KEY AUTOINCREMENT,
  FirstName TEXT NOT NULL,
  MiddleName TEXT,
  LastName TEXT NOT NULL,
  Email TEXT NOT NULL,
  Username TEXT NOT NULL UNIQUE,
  Password TEXT NOT NULL,
  Role TEXT CHECK(Role IN ('Admin','Faculty','Student')) NOT NULL,
  sem TEXT NOT NULL DEFAULT 'all',
  class TEXT NOT NULL DEFAULT 'all',
  batch TEXT NOT NULL DEFAULT 'all',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  OTP TEXT,
  Status TEXT CHECK(Status IN ('Active','Inactive','Suspended')) NOT NULL DEFAULT 'Active',
  AccountStatus TEXT CHECK(AccountStatus IN ('Verified','Not Verified')) NOT NULL DEFAULT 'Not Verified'
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS classes (
  ClassID INTEGER PRIMARY KEY AUTOINCREMENT,
  ClassName TEXT NOT NULL,
  TeacherID INTEGER NOT NULL,
  FOREIGN KEY (TeacherID) REFERENCES users (UserID)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS exams (
  ExamID INTEGER PRIMARY KEY AUTOINCREMENT,
  Title TEXT NOT NULL,
  Description TEXT,
  Subject TEXT,
  Number_of_Questions INTEGER,
  Exam_Total_Marks INTEGER,
  Status TEXT CHECK(Status IN ('Not Started','Started','Completed')) NOT NULL DEFAULT 'Not Started',
  ExamDate TEXT,
  StartTime TEXT,
  EndTime TEXT,
  Feedback TEXT,
  CreatorID INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sem TEXT NOT NULL DEFAULT 'all',
  className TEXT,
  batch TEXT NOT NULL DEFAULT 'all',
  FOREIGN KEY (CreatorID) REFERENCES users (UserID)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS classexams (
  ClassID INTEGER NOT NULL,
  ExamID INTEGER NOT NULL,
  PRIMARY KEY (ClassID, ExamID),
  FOREIGN KEY (ClassID) REFERENCES classes (ClassID),
  FOREIGN KEY (ExamID) REFERENCES exams (ExamID)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS classstudents (
  ClassID INTEGER NOT NULL,
  StudentID INTEGER NOT NULL,
  PRIMARY KEY (ClassID, StudentID),
  FOREIGN KEY (ClassID) REFERENCES classes (ClassID),
  FOREIGN KEY (StudentID) REFERENCES users (UserID)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS examassignments (
  AssignmentID INTEGER PRIMARY KEY AUTOINCREMENT,
  ExamID INTEGER NOT NULL,
  UserID INTEGER NOT NULL,
  AssignedDate TEXT NOT NULL,
  DueDate TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ExamID) REFERENCES exams (ExamID) ON DELETE CASCADE,
  FOREIGN KEY (UserID) REFERENCES users (UserID)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS exam_logs (
  LogID INTEGER PRIMARY KEY AUTOINCREMENT,
  ExamID INTEGER NOT NULL,
  UserID INTEGER NOT NULL,
  Status TEXT CHECK(Status IN ('Attempted','Not Attempted')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS quizsubmissions (
  SubmissionID INTEGER PRIMARY KEY AUTOINCREMENT,
  ExamID INTEGER NOT NULL,
  UserID INTEGER NOT NULL,
  SubmissionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT,
  FOREIGN KEY (ExamID) REFERENCES exams (ExamID) ON DELETE CASCADE,
  FOREIGN KEY (UserID) REFERENCES users (UserID)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS questions (
  QuestionID INTEGER PRIMARY KEY AUTOINCREMENT,
  ExamID INTEGER NOT NULL,
  QuestionText TEXT NOT NULL,
  Mark INTEGER,
  QuestionType TEXT CHECK(QuestionType IN ('Multiple Choice','True/False','Short Answer')) NOT NULL,
  Correct_Option TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ExamID) REFERENCES exams (ExamID) ON DELETE CASCADE
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS questionanswers (
  AnswerID INTEGER PRIMARY KEY AUTOINCREMENT,
  SubmissionID INTEGER NOT NULL,
  QuestionID INTEGER NOT NULL,
  AnswerText TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (SubmissionID) REFERENCES quizsubmissions (SubmissionID) ON DELETE CASCADE,
  FOREIGN KEY (QuestionID) REFERENCES questions (QuestionID) ON DELETE CASCADE
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS questionoptions (
  OptionID INTEGER PRIMARY KEY AUTOINCREMENT,
  QuestionID INTEGER NOT NULL,
  OptionA TEXT,
  OptionB TEXT,
  OptionC TEXT,
  OptionD TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (QuestionID) REFERENCES questions (QuestionID) ON DELETE CASCADE
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS quiz_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  studentname TEXT,
  FOREIGN KEY (quiz_id) REFERENCES exams (ExamID),
  FOREIGN KEY (student_id) REFERENCES users (UserID)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS student_quiz_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  student_name TEXT NOT NULL,
  exam_id INTEGER NOT NULL,
  total_questions INTEGER,
  total_marks INTEGER,
  time TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users (UserID),
  FOREIGN KEY (exam_id) REFERENCES exams (ExamID)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS systemlogs (
  LogID INTEGER PRIMARY KEY AUTOINCREMENT,
  LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UserID INTEGER,
  ActionTaken TEXT,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (UserID) REFERENCES users (UserID)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS systemsettings (
  SettingID INTEGER PRIMARY KEY AUTOINCREMENT,
  SettingName TEXT NOT NULL UNIQUE,
  SettingValue TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

// Seed default users from sql dump file
if (fs.existsSync(sqlFile)) {
    const content = fs.readFileSync(sqlFile, 'utf8');
    const insertRegex = /INSERT INTO `users` [\s\S]*?;/g;
    const match = content.match(insertRegex);
    if (match) {
        // Mark all seeded users as Verified to bypass OTP verification
        let insertSql = match[0].replace(/'Not Verified'/g, "'Verified'");
        db.exec(insertSql);
        console.log("Seeded users table successfully (marked as Verified)!");
    } else {
        console.warn("Could not find INSERT INTO users statement in SQL file.");
    }
} else {
    console.warn("SQL file not found at " + sqlFile);
}

// Seed additional demo credentials requested by the user
console.log("Seeding custom demo credentials...");
db.exec(`
INSERT OR IGNORE INTO users (FirstName, LastName, Email, Username, Password, Role, sem, class, batch, Status, AccountStatus) VALUES
('Admin', 'One', 'admin1@example.com', 'admin1', 'admin1', 'Admin', 'all', 'all', 'all', 'Active', 'Verified'),
('Faculty', 'One', 'faculty1@example.com', 'faculty1', 'faculty1', 'Faculty', 'all', 'all', 'all', 'Active', 'Verified'),
('Faculty', 'Two', 'faculty2@example.com', 'faculty2', 'faculty2', 'Faculty', 'all', 'all', 'all', 'Active', 'Verified'),
('Student', 'One', 'student1@example.com', 'student1', 'student1', 'Student', 'SEM 4', '4CE', 'A', 'Active', 'Verified'),
('Student', 'Two', 'student2@example.com', 'student2', 'student2', 'Student', 'SEM 4', '4CE', 'A', 'Active', 'Verified'),
('Student', 'Three', 'student3@example.com', 'student3', 'student3', 'Student', 'SEM 4', '4CE', 'A', 'Active', 'Verified'),
('Student', 'Four', 'student4@example.com', 'student4', 'student4', 'Student', 'SEM 4', '4CE', 'A', 'Active', 'Verified');
`);
console.log("Custom demo credentials seeded successfully.");

// Seed a one-question demo quiz
console.log("Seeding one-question demo quiz...");
db.exec(`
INSERT OR IGNORE INTO exams (ExamID, Title, Description, Subject, Number_of_Questions, Exam_Total_Marks, Status, ExamDate, StartTime, EndTime, CreatorID, sem, className, batch)
VALUES (1, 'General Knowledge', 'A simple one-question quiz about programming.', 'Computer Science', 1, 10, 'Started', '2028-12-31', '00:00:00', '23:59:59', 2, 'SEM 4', '4CE', 'A');
`);

db.exec(`
INSERT OR IGNORE INTO questions (QuestionID, ExamID, QuestionText, Mark, QuestionType, Correct_Option)
VALUES (1, 1, 'What is the runtime complexity of accessing an element in an array by index?', 10, 'Multiple Choice', 'A');
`);

db.exec(`
INSERT OR IGNORE INTO questionoptions (OptionID, QuestionID, OptionA, OptionB, OptionC, OptionD)
VALUES (1, 1, 'O(1)', 'O(N)', 'O(log N)', 'O(N^2)');
`);
console.log("Demo quiz seeded successfully.");

console.log("SQLite database initialized successfully.");
