export async function fetchFolder(folder) {
  try {
    const res = await fetch(`/api/photos?folder=${encodeURIComponent(folder)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.images || []);
  } catch { return []; }
}
