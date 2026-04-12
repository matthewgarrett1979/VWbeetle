import { buildRecord, phases } from '../src/data/checklist-data.js';

const UPSTASH_URL = process.env.UPSTASH_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_TOKEN;
const STORAGE_KEY = 'beetle-checklist-v1';

export default async function handler(req, res) {
  try {
    const response = await fetch(`${UPSTASH_URL}/get/${STORAGE_KEY}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await response.json();
    const checked = data.result ? JSON.parse(data.result) : {};

    const buildTotal = buildRecord.reduce((acc, p) => acc + p.jobs.length, 0);
    const interactiveTotal = phases.reduce((acc, p) => acc + p.jobs.length, 0);
    const totalJobs = buildTotal + interactiveTotal;
    const checkedCount = Object.values(checked).filter(Boolean).length;
    const doneCount = buildTotal + checkedCount;
    const percentage = Math.round((doneCount / totalJobs) * 100);

    res.status(200).json({
      total: totalJobs,
      done: doneCount,
      left: totalJobs - doneCount,
      percentage,
      phases: phases.length,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
