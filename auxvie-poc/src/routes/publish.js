import { dedupeKey } from '../utils/hash.js';
import { buildJobsXml } from '../utils/xml.js';
import { postFacebookPage } from '../connectors/facebook.js';
import { sendWhatsApp } from '../connectors/whatsapp.js';
import { sendTelegram } from '../connectors/telegram.js';
import { pushViaSftp } from '../connectors/flux.js';
import { buildShortText, buildTelegramMessage } from '../mapping.js';
import fs from 'fs';
import path from 'path';

export async function publishHandler(req, res) {
  try {
    const { board = '', job } = req.body || {};
    if (!job || !job.id || !job.title) return res.status(400).json({ error: 'job.id et job.title requis' });

    // enrichi
    job.short_text = buildShortText(job);
    job.telegram_message = buildTelegramMessage(job);

    const key = dedupeKey(board || 'flux', job);

    if (board === 'facebook') {
      const pageId = process.env.FACEBOOK_PAGE_ID;
      const token = process.env.FACEBOOK_PAGE_TOKEN;
      if (!pageId || !token) return res.status(400).json({ error: 'FACEBOOK_PAGE_ID/TOKEN manquants' });
      const out = await postFacebookPage({ pageId, pageToken: token, message: job.short_text, link: job.apply_url });
      return res.json({ status: 'posted', board, job_id: job.id, dedupe_key: key, external: out });
    }

    if (board === 'whatsapp') {
      const phoneId = process.env.WA_PHONE_NUMBER_ID;
      const bearer = process.env.WA_BEARER;
      if (!phoneId || !bearer || !job.whatsapp_to) return res.status(400).json({ error: 'WA_PHONE_NUMBER_ID/WA_BEARER et job.whatsapp_to requis' });
      const out = await sendWhatsApp({ phoneNumberId: phoneId, bearer, to: job.whatsapp_to, text: job.short_text });
      return res.json({ status: 'posted', board, job_id: job.id, dedupe_key: key, external: out });
    }

    if (board === 'telegram') {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (!token || !chatId) return res.status(400).json({ error: 'TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID manquants' });
      const out = await sendTelegram({ botToken: token, chatId, text: job.telegram_message });
      return res.json({ status: 'posted', board, job_id: job.id, dedupe_key: key, external: out });
    }

    // FLUX: génère un XML et optionnellement push SFTP
    const xml = buildJobsXml([job]);
    const outDir = path.join('/mnt/data', 'out');
    const localPath = path.join(outDir, 'jobs.xml');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(localPath, xml, 'utf8');

    let sftp = null;
    if (process.env.SFTP_HOST && process.env.SFTP_USER) {
      sftp = await pushViaSftp(localPath);
    }

    return res.json({ status: 'posted', board: board || 'flux', job_id: job.id, dedupe_key: key, xml_path: localPath, sftp });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
}
