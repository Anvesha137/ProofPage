import 'dotenv/config';
import { sql, initDb } from '../api/db.js';

function generateUniqueCode(len = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let res = '';
  for (let i = 0; i < len; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

async function updateKhushiHandle() {
  await initDb();
  
  // Find Khushi
  const users = await sql.query('SELECT * FROM users WHERE LOWER(email) = $1', ['khushi@gmail.com']);
  if (!users || users.length === 0) {
    console.error('Khushi not found');
    process.exit(1);
  }
  
  const userId = users[0].id;
  const uniqueCode = generateUniqueCode(10);
  const newHandle = `khushi-${uniqueCode}`;
  
  console.log(`Setting Khushi handle to: ${newHandle} (unique 10-char suffix: ${uniqueCode})`);
  
  await sql.query('UPDATE profiles SET handle = $1 WHERE user_id = $2', [newHandle, userId]);
  
  const updated = await sql.query('SELECT user_id, name, handle, email FROM profiles WHERE user_id = $1', [userId]);
  console.log('Updated profile:', updated[0]);
}

updateKhushiHandle()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

