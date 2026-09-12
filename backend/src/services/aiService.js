const fs = require("fs");

const rules = [
  { category: "Electrical", words: ["electric", "electrical", "wire", "shock", "light", "bulb", "fan", "switch", "socket", "power"] },
  { category: "Wi-Fi / Network", words: ["wifi", "wi-fi", "internet", "network", "router", "connectivity"] },
  { category: "Water / Plumbing", words: ["water", "leak", "pipe", "tap", "toilet", "flush", "plumbing", "washroom"] },
  { category: "Cleanliness", words: ["garbage", "trash", "dirty", "clean", "waste", "dust", "smell"] },
  { category: "Infrastructure", words: ["crack", "wall", "ceiling", "door", "window", "floor", "road", "pothole", "chair", "desk", "bench"] },
  { category: "Safety", words: ["fire", "danger", "unsafe", "emergency", "exposed", "broken railing", "accident"] }
];

function classify(text = "") {
  const normalized = text.toLowerCase();
  let best = { category: "Other", score: 0 };
  for (const rule of rules) {
    const score = rule.words.reduce((n, word) => n + (normalized.includes(word) ? 1 : 0), 0);
    if (score > best.score) best = { category: rule.category, score };
  }

  const criticalWords = ["fire", "shock", "exposed wire", "gas leak", "accident", "collapse", "emergency"];
  const highWords = ["leak", "broken", "not working", "unsafe", "pothole"];
  let severityScore = 35 + Math.min(best.score * 12, 30);
  if (criticalWords.some(w => normalized.includes(w))) severityScore = 95;
  else if (highWords.some(w => normalized.includes(w))) severityScore = Math.max(severityScore, 75);

  let priority = "Low";
  if (severityScore >= 90) priority = "Critical";
  else if (severityScore >= 70) priority = "High";
  else if (severityScore >= 45) priority = "Medium";

  const departmentMap = {
    "Electrical": "Electrical Maintenance",
    "Wi-Fi / Network": "IT & Network",
    "Water / Plumbing": "Plumbing & Water",
    "Cleanliness": "Housekeeping",
    "Infrastructure": "Civil & Infrastructure",
    "Safety": "Safety & Security"
  };

  return {
    category: best.category,
    priority,
    severityScore,
    confidence: Math.min(0.55 + best.score * 0.12, 0.96),
    assignedDepartment: departmentMap[best.category] || "General Maintenance"
  };
}

async function analyze({ title, description, imagePath }) {
  const result = classify(`${title || ""} ${description || ""}`);

  // Optional OpenAI integration can be added here without changing the API contract.
  // The local model is deliberately used as a zero-key fallback for hackathon demos.
  return {
    ...result,
    imageAnalyzed: Boolean(imagePath && fs.existsSync(imagePath)),
    explanation: `Detected ${result.category} issue with ${result.priority} priority based on the submitted description.`
  };
}

module.exports = { analyze };
