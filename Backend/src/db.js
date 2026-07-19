const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { Pool } = require('pg');

const usePostgres = !!(process.env.DATABASE_URL || process.env.PGHOST);
let pgPool = null;
let sqliteDb = null;

if (usePostgres) {
    const config = {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway')
            ? { rejectUnauthorized: false }
            : false
    };
    pgPool = new Pool(config);
    console.log("Using PostgreSQL Database pool.");
} else {
    // Dynamically select DB path: /data/database.sqlite inside Docker/Railway, local path otherwise
    const dbPath = process.env.DB_PATH || (fs.existsSync('/data') ? '/data/database.sqlite' : path.join(__dirname, '..', 'database.sqlite'));
    sqliteDb = new DatabaseSync(dbPath);
    // Enable foreign keys
    sqliteDb.exec("PRAGMA foreign_keys = ON;");
    // Register custom SQL functions to match MySQL behavior
    sqliteDb.function('CONCAT', (...args) => args.join(''));
    sqliteDb.function('CURDATE', () => new Date().toISOString().slice(0, 10));
    sqliteDb.function('CURTIME', () => {
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    });
    sqliteDb.function('NOW', () => new Date().toISOString().replace('T', ' ').slice(0, 19));
    console.log("Using SQLite Database Sync.");
}

function query(sql, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = [];
    }
    if (!params) {
        params = [];
    }

    // Preprocess SQL: replace double quotes
    let cleanSql = sql.replace(/"/g, "'");

    // Handle MySQL-style bulk insert expansion (VALUES ?)
    let cleanParams = params;
    if (params.length === 1 && Array.isArray(params[0]) && Array.isArray(params[0][0])) {
        const rows = params[0];
        if (rows.length > 0) {
            const rowLength = rows[0].length;
            const placeholders = rows.map(() => '(' + Array(rowLength).fill('?').join(', ') + ')').join(', ');
            cleanSql = cleanSql.replace(/VALUES\s*\?/i, 'VALUES ' + placeholders);
            cleanParams = rows.reduce((acc, val) => acc.concat(val), []);
        } else {
            if (callback) {
                return process.nextTick(() => callback(null, { insertId: 0, affectedRows: 0 }));
            }
        }
    }

    if (usePostgres) {
        // Replace CURRENT_TIME() for PG (which already has native CURRENT_TIME)
        let pgSql = cleanSql.replace(/CURRENT_TIME\(\)/gi, "CURRENT_TIME");
        
        // Convert ? placeholders to $1, $2...
        let index = 1;
        pgSql = pgSql.replace(/\?/g, () => `$${index++}`);

        const isInsert = /^\s*INSERT\s+/i.test(pgSql);
        if (isInsert && !/RETURNING/i.test(pgSql)) {
            pgSql += " RETURNING *";
        }

        pgPool.query(pgSql, cleanParams, (err, res) => {
            if (err) {
                console.error("Postgres Error executing:", pgSql);
                console.error("Params:", cleanParams);
                console.error("Error:", err.message);
                if (callback) callback(err);
                return;
            }

            const rows = res.rows;
            // Map lowercase PostgreSQL columns back to camelCase/PascalCase
            const mappedRows = rows.map(row => {
                const mapped = {};
                for (const key of Object.keys(row)) {
                    let matchedKey = key;
                    // User columns
                    if (key === 'userid') matchedKey = 'UserID';
                    else if (key === 'firstname') matchedKey = 'FirstName';
                    else if (key === 'middlename') matchedKey = 'MiddleName';
                    else if (key === 'lastname') matchedKey = 'LastName';
                    else if (key === 'email') matchedKey = 'Email';
                    else if (key === 'username') matchedKey = 'Username';
                    else if (key === 'password') matchedKey = 'Password';
                    else if (key === 'role') matchedKey = 'Role';
                    else if (key === 'sem') matchedKey = 'sem';
                    else if (key === 'class') matchedKey = 'class';
                    else if (key === 'batch') matchedKey = 'batch';
                    else if (key === 'created_at') matchedKey = 'created_at';
                    else if (key === 'updated_at') matchedKey = 'updated_at';
                    else if (key === 'otp') matchedKey = 'OTP';
                    else if (key === 'status') matchedKey = 'Status';
                    else if (key === 'accountstatus') matchedKey = 'AccountStatus';
                    // Exam columns
                    else if (key === 'examid') matchedKey = 'ExamID';
                    else if (key === 'title') matchedKey = 'Title';
                    else if (key === 'description') matchedKey = 'Description';
                    else if (key === 'subject') matchedKey = 'Subject';
                    else if (key === 'number_of_questions') matchedKey = 'Number_of_Questions';
                    else if (key === 'exam_total_marks') matchedKey = 'Exam_Total_Marks';
                    else if (key === 'examdate') matchedKey = 'ExamDate';
                    else if (key === 'starttime') matchedKey = 'StartTime';
                    else if (key === 'endtime') matchedKey = 'EndTime';
                    else if (key === 'creatorid') matchedKey = 'CreatorID';
                    // Question columns
                    else if (key === 'questionid') matchedKey = 'QuestionID';
                    else if (key === 'questiontext') matchedKey = 'QuestionText';
                    else if (key === 'mark') matchedKey = 'Mark';
                    else if (key === 'questiontype') matchedKey = 'QuestionType';
                    else if (key === 'correct_option') matchedKey = 'Correct_Option';
                    // Options
                    else if (key === 'optionid') matchedKey = 'OptionID';
                    else if (key === 'optiona') matchedKey = 'OptionA';
                    else if (key === 'optionb') matchedKey = 'OptionB';
                    else if (key === 'optionc') matchedKey = 'OptionC';
                    else if (key === 'optiond') matchedKey = 'OptionD';
                    // Submissions
                    else if (key === 'submissionid') matchedKey = 'SubmissionID';
                    else if (key === 'submissiondate') matchedKey = 'SubmissionDate';
                    // Classes
                    else if (key === 'classid') matchedKey = 'ClassID';
                    else if (key === 'classname') matchedKey = 'ClassName';
                    else if (key === 'teacherid') matchedKey = 'TeacherID';
                    else if (key === 'studentid') matchedKey = 'StudentID';
                    // Assignments
                    else if (key === 'assignmentid') matchedKey = 'AssignmentID';
                    else if (key === 'assigneddate') matchedKey = 'AssignedDate';
                    else if (key === 'duedate') matchedKey = 'DueDate';
                    // Aggregate counts
                    else if (key === 'completedexamscount') matchedKey = 'completedExamsCount';
                    else if (key === 'notstartedexamscount') matchedKey = 'notStartedExamsCount';

                    mapped[matchedKey] = row[key];
                }
                return mapped;
            });

            let insertId = 0;
            if (isInsert && rows.length > 0) {
                const firstKey = Object.keys(rows[0])[0];
                insertId = rows[0][firstKey];
            }

            const result = isInsert || /^\s*(UPDATE|DELETE)/i.test(pgSql)
                ? { insertId, affectedRows: res.rowCount }
                : mappedRows;

            if (callback) process.nextTick(() => callback(null, result));
        });
    } else {
        // SQLite query engine
        let sqliteSql = cleanSql.replace(/CURRENT_TIME\(\)/gi, "CURTIME()");
        const placeholderCount = (sqliteSql.match(/\?/g) || []).length;
        const finalParams = [];
        for (let i = 0; i < placeholderCount; i++) {
            const val = cleanParams[i];
            finalParams.push(val === undefined ? null : val);
        }

        try {
            const isSelect = /^\s*(SELECT|PRAGMA|SHOW|EXPLAIN)/i.test(sqliteSql);
            const stmt = sqliteDb.prepare(sqliteSql);
            
            if (isSelect) {
                const rows = stmt.all(...finalParams);
                if (callback) process.nextTick(() => callback(null, rows));
            } else {
                const info = stmt.run(...finalParams);
                const result = {
                    insertId: info.lastInsertRowid,
                    affectedRows: info.changes
                };
                if (callback) process.nextTick(() => callback(null, result));
            }
        } catch (err) {
            console.error("SQLite Error executing:", sqliteSql);
            console.error("Params:", finalParams);
            console.error("Error:", err.message);
            if (callback) process.nextTick(() => callback(err));
        }
    }
}

const connection = {
    threadId: 1,
    connect: (callback) => {
        if (callback) process.nextTick(() => callback(null));
    },
    end: (callback) => {
        if (pgPool) {
            pgPool.end(callback);
        } else {
            if (callback) process.nextTick(() => callback(null));
        }
    },
    query: query
};

module.exports = connection;
