import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static(join(__dirname, '..', 'dist')));

// Отдача index.html для всех маршрутов
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(8080, () => {
  console.log('Server running at http://localhost:8080');
  console.log('Server PID:', process.pid);
}).on('error', (err) => {
  console.error('Server error:', err.message);
});