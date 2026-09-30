// Reel sound toggle
document.querySelectorAll("[data-sound]").forEach((btn) => {
  const v = document.getElementById(btn.dataset.sound);
  if (!v) return;
  btn.addEventListener("click", () => {
    if (v.muted) { v.muted = false; v.currentTime = 0; v.play(); btn.textContent = "Sound off"; }
    else { v.muted = true; btn.textContent = "Play with sound"; }
  });
});

// Work cards: preview loop on hover (desktop) or when scrolled into view (touch)
const cards = document.querySelectorAll(".card");
const touch = window.matchMedia("(hover: none)").matches;
cards.forEach((c) => {
  const v = c.querySelector("video");
  if (!v) return;
  if (!touch) {
    c.addEventListener("mouseenter", () => { v.play().catch(() => {}); });
    c.addEventListener("mouseleave", () => { v.pause(); });
  }
});
if (touch && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target.querySelector("video");
      if (!v) return;
      if (e.isIntersecting) { e.target.classList.add("playing"); v.play().catch(() => {}); }
      else { e.target.classList.remove("playing"); v.pause(); }
    });
  }, { threshold: 0.6 });
  cards.forEach((c) => io.observe(c));
}

// Work filters
document.querySelectorAll(".filters .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filters .chip").forEach((c) => c.classList.toggle("on", c === chip));
    const f = chip.dataset.filter;
    cards.forEach((c) => c.classList.toggle("hide", f !== "all" && !(c.dataset.tags || "").split(" ").includes(f)));
  });
});

// Forms -> sent on-page via FormSubmit (no email app needed)
const ENDPOINT = "https://formsubmit.co/ajax/team@nexuspulsetech.com";
document.querySelectorAll("form[data-kind]").forEach((form) => {
  const msg = form.querySelector(".formmsg");
  const btn = form.querySelector("button[type=submit]");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return; // bot
    data._subject = `${form.dataset.kind}: ${data.website || data.name}`;
    data._template = "table";
    if (btn) btn.disabled = true;
    msg.textContent = "Sending…";
    try {
      const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(r.status);
      form.reset();
      msg.textContent = "Got it — you'll hear from us within 24 hours.";
    } catch {
      const body = Object.entries(data).filter(([k]) => !k.startsWith("_")).map(([k, v]) => `${k}: ${v}`).join("\n");
      const gm = `https://mail.google.com/mail/?view=cm&to=team@nexuspulsetech.com&su=${encodeURIComponent(data._subject)}&body=${encodeURIComponent(body)}`;
      msg.innerHTML = `Our form is down right now. <a href="${gm}" target="_blank" rel="noopener">Send it via Gmail</a> or email team@nexuspulsetech.com.`;
      if (btn) btn.disabled = false;
    }
  });
});

// Copy email
document.querySelectorAll("[data-copy]").forEach((b) => {
  b.addEventListener("click", () => {
    navigator.clipboard.writeText(b.dataset.copy).then(() => { b.textContent = "Copied"; setTimeout(() => (b.textContent = "Copy"), 1600); });
  });
});

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
