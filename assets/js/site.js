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

// Brief form -> pre-filled email (static site, no backend)
const form = document.getElementById("brief");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const subject = `Launch film brief: ${f.get("product") || "new project"}`;
    const body = [
      `Name: ${f.get("name") || ""}`,
      `Product / website: ${f.get("product") || ""}`,
      `What I need: ${f.get("need") || ""}`,
      `Launch date: ${f.get("date") || ""}`,
      "",
      `${f.get("notes") || ""}`,
    ].join("\n");
    window.location.href = `mailto:team@nexuspulsetech.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
