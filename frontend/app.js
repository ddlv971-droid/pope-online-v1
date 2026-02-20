// ✅ API Render
const API_BASE = "https://popeonline-ai-api.onrender.com";

const el = (id) => document.getElementById(id);
const status = (txt) => el("status").textContent = txt;

function buildPayload(mode){
  return {
    mode,
    usecase: el("usecase").value,
    context: el("context").value.trim(),
    objective: el("objective").value.trim(),
    facts: el("facts").value.trim(),
    locale: "fr-FR"
  };
}

function setOutput(text){
  el("output").textContent = text;
}

async function callAI(mode){
  const payload = buildPayload(mode);

  // Garde-fous client (le serveur fait aussi un filtrage)
  const raw = (payload.context + "\n" + payload.facts).toLowerCase();
  const forbiddenHints = ["numéro de sécurité sociale", "nss", "dossier médical", "diagnostic", "adresse", "téléphone", "date de naissance", "iban", "rib"];
  if (forbiddenHints.some(k => raw.includes(k))) {
    setOutput("⚠️ Données potentiellement sensibles détectées. Merci de retirer/anonymiser avant génération.");
    return;
  }

  status("En cours…");

  const res = await fetch(`${API_BASE}/chat`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });

  if(!res.ok){
    const msg = await res.text();
    status("Erreur");
    setOutput("Erreur API : " + msg);
    return;
  }

  const data = await res.json();
  status("Terminé");
  setOutput(data.text || "(vide)");
}

el("btnGenerate")?.addEventListener("click", () => callAI("generate"));
el("btnRefine")?.addEventListener("click", () => callAI("refine"));
el("btnRisk")?.addEventListener("click", () => callAI("risk_check"));

el("btnCopy")?.addEventListener("click", async () => {
  const txt = el("output").textContent || "";
  await navigator.clipboard.writeText(txt);
  status("Copié ✓");
  setTimeout(() => status("Prêt"), 900);
});

el("btnRequestReview")?.addEventListener("click", () => {
  const email = el("email").value.trim();
  const need = el("reviewNeed").value.trim();
  const draft = el("output").textContent || "";

  const subject = encodeURIComponent("[POPE Online] Demande de revue experte — POPE AI");
  const body = encodeURIComponent(
`Bonjour,

Je souhaite une revue experte POPE (juridique/finances/organisation).

Attentes :
${need || "(à préciser)"}

Draft POPE AI :
-------------------------
${draft}
-------------------------

Contexte :
${el("context").value || "(non précisé)"}

Objectif :
${el("objective").value || "(non précisé)"}

Cordialement,
${email || "(email non renseigné)"}`
  );

  window.location.href = `mailto:contact@popeconsulting-group.com?subject=${subject}&body=${body}`;
});
