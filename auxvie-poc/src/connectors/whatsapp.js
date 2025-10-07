import fetch from 'node-fetch';

export async function sendWhatsApp({ phoneNumberId, bearer, to, text }) {
  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
  const payload = { messaging_product: 'whatsapp', to, type: 'text', text: { body: text } };
  const res = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${bearer}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await res.json();
  if (!res.ok) throw new Error(`WhatsApp error: ${res.status} ${JSON.stringify(data)}`);
  return data;
}
