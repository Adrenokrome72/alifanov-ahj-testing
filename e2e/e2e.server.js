import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static(join(__dirname, '..', 'dist')));

app.listen(8080, () => {
  console.log('Server running at http://localhost:8080');
  console.log('Server PID:', process.pid);
}).on('error', (err) => {
  console.error('Server error:', err.message);
});