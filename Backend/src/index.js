const dotenv = require('dotenv');
// Load .env first (Railway injects env vars directly so this is a no-op in production)
dotenv.config({ path: './.env' });

require('./init_db.js');
const app = require('./app.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
