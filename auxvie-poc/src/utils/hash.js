import crypto from 'crypto';

export const dedupeKey = (board, job) => {
  const content = `${job.id}|${board}|${(job.description_html || job.description_text || '').slice(0, 10000)}`;
  return `${board}:${job.id}:${crypto.createHash('sha1').update(content).digest('hex').slice(0, 10)}`;
};
