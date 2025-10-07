import { create } from 'xmlbuilder2';
import fs from 'fs';

export function buildJobsXml(jobs) {
  const root = { jobs: jobs.map(j => ({
    job: {
      title: j.title,
      description: j.description_html || j.description_text,
      city: j.city,
      postcode: j.postcode,
      country: j.country,
      employment_type: j.employment_type,
      salary_min: j.salary?.min,
      salary_max: j.salary?.max,
      currency: j.salary?.currency || 'EUR',
      period: j.salary?.period || 'MONTH',
      validThrough: j.valid_through,
      apply_url: j.apply_url
    }
  }))};
  const doc = create({ version: '1.0', encoding: 'UTF-8' }).ele(root);
  return doc.end({ prettyPrint: true });
}
