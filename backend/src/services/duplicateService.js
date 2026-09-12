function tokens(text = "") {
  return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2));
}

function similarity(a, b) {
  const A = tokens(a), B = tokens(b);
  if (!A.size || !B.size) return 0;
  let common = 0;
  for (const t of A) if (B.has(t)) common++;
  return common / Math.max(1, Math.min(A.size, B.size));
}

async function findDuplicate(complaints, candidate) {
  let best = null;
  for (const c of complaints) {
    if (c.status === "Resolved") continue;
    const sameLocation = (c.location || "").toLowerCase() === (candidate.location || "").toLowerCase();
    const textScore = similarity(`${c.title} ${c.description}`, `${candidate.title} ${candidate.description}`);
    const categoryMatch = c.category === candidate.category;
    const score = textScore * 0.65 + (sameLocation ? 0.25 : 0) + (categoryMatch ? 0.10 : 0);
    if (score >= 0.58 && (!best || score > best.score)) best = { complaint: c, score };
  }
  return best;
}
module.exports = { findDuplicate, similarity };
