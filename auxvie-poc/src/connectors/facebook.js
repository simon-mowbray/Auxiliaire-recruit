import fetch from 'node-fetch';

export async function postFacebookPage({ pageId, pageToken, message, link }) {
  const url = `https://graph.facebook.com/v21.0/${pageId}/feed?access_token=${encodeURIComponent(pageToken)}`;
  const body = new URLSearchParams({ message });
  if (link) body.append('link', link);
  const res = await fetch(url, { method: 'POST', body });
  const data = await res.json();
  if (!res.ok) throw new Error(`Facebook error: ${res.status} ${JSON.stringify(data)}`);
  return data; // { id: 'PAGEID_postID' }
}
