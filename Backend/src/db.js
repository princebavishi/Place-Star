const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// In production (Docker/Railway) set DB_PATH to a mounted volume path e.g. /data/database.sqlite
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');
const db = new DatabaseSync(dbPath);


// Enable foreign keys
db.exec("PRAGMA foreign_keys = ON;");

// Register custom SQL functions to match MySQL behavior
db.function('CONCAT', (...args) => args.join(''));

db.function('CURDATE', () => {
    return new Date().toISOString().slice(0, 10);
});

db.function('CURTIME', () => {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
});

db.function('NOW', () => {
    return new Date().toISOString().replace('T', ' ').slice(0, 19);
});

function query(sql, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = [];
    }
    if (!params) {
        params = [];
    }

    // Preprocess SQL: replace double quotes and CURRENT_TIME() for SQLite compatibility
    let cleanSql = sql.replace(/"/g, "'");
    cleanSql = cleanSql.replace(/CURRENT_TIME\(\)/gi, "CURTIME()");

    let cleanParams = params;

    // Handle MySQL-style bulk insert expansion (VALUES ?) for SQLite
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

    // Match parameter count with the number of placeholders in the SQL statement to prevent "column index out of range" errors
    const placeholderCount = (cleanSql.match(/\?/g) || []).length;
    const finalParams = [];
    for (let i = 0; i < placeholderCount; i++) {
        const val = cleanParams[i];
        finalParams.push(val === undefined ? null : val);
    }

    try {
        const isSelect = /^\s*(SELECT|PRAGMA|SHOW|EXPLAIN)/i.test(cleanSql);
        const stmt = db.prepare(cleanSql);
        
        if (isSelect) {
            const rows = stmt.all(...finalParams);
            if (callback) {
                process.nextTick(() => callback(null, rows));
            }
        } else {
            const info = stmt.run(...finalParams);
            const result = {
                insertId: info.lastInsertRowid,
                affectedRows: info.changes
            };
            if (callback) {
                process.nextTick(() => callback(null, result));
            }
        }
    } catch (err) {
        console.error("SQLite Error executing:", cleanSql);
        console.error("Params:", finalParams);
        console.error("Error:", err.message);
        if (callback) {
            process.nextTick(() => callback(err));
        }
    }
}

const connection = {
    threadId: 1,
    connect: (callback) => {
        if (callback) process.nextTick(() => callback(null));
    },
    end: (callback) => {
        if (callback) process.nextTick(() => callback(null));
    },
    query: query
};

module.exports = connection;
