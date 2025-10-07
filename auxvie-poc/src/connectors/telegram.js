import fetch from 'node-fetch';

export async function sendTelegram({ botToken, chatId, text }) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const body = new URLSearchParams({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: 'true' });
  const res = await fetch(url, { method: 'POST', body });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(`Telegram error: ${JSON.stringify(data)}`);
  return data;
}
