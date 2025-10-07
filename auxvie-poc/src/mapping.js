export function buildShortText(job) {
  const salary = job?.salary ? `Salaire: ${job.salary.min || ''}-${job.salary.max || ''} ${job.salary.currency || 'EUR'} / ${job.salary.period || 'MONTH'}` : '';
  const loc = [job.city, job.postcode].filter(Boolean).join(' ');
  const parts = [
    `📌 ${job.title}`,
    loc ? `📍 ${loc}` : null,
    salary || null,
    job.description_text ? `📝 ${job.description_text.slice(0, 180)}…` : null,
    job.apply_url ? `👉 Postuler: ${job.apply_url}` : null
  ].filter(Boolean);
  return parts.join('\n');
}

export function buildTelegramMessage(job) {
  const salary = job?.salary ? `<b>Salaire:</b> ${job.salary.min || ''}-${job.salary.max || ''} ${job.salary.currency || 'EUR'} / ${job.salary.period || 'MONTH'}` : '';
  const loc = [job.city, job.postcode].filter(Boolean).join(' ');
  const parts = [
    `<b>${job.title}</b>`,
    loc ? `📍 <i>${loc}</i>` : null,
    salary || null,
    job.description_text ? job.description_text.slice(0, 300) + '…' : null,
    job.apply_url ? `<a href="${job.apply_url}">Postuler</a>` : null
  ].filter(Boolean);
  return parts.join('\n');
}
