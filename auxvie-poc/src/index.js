import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { publishHandler } from './routes/publish.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ ok: true, name: 'auxvie-poc' }));

app.post('/publish', publishHandler);
app.post('/publish/flux', publishHandler); // même handler, "board" inutile

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`[auxvie-poc] listening on http://localhost:${port}`));
