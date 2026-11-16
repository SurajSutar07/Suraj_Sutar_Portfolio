/* =========================================================
   LEARNING LOG — add new things you learn here.
   Copy one { ... } block, paste it at the TOP of the list,
   and change the text. Newest entries show first.
   - date:  shown on the card, e.g. "Oct 2026"
   - tag:   category used for the filter buttons (SQL, Power BI, Python, Excel, ML, Other)
   - title: what you learned
   - text:  one or two lines in your own words
   - link:  optional — a repo, notebook, certificate or article ("" to hide)
   ========================================================= */

const LEARNING_LOG = [
  {
    date: "",
    tag: "Excel",
    title: "Advanced Excel for MIS Reporting",
    text: "Practised dynamic array functions such as FILTER, CHOOSECOLS and HSTACK alongside XLOOKUP and INDEX-MATCH for consolidating operational reports.",
    link: ""
  },
  {
    date: "",
    tag: "Power BI",
    title: "Dashboarding and KPI Reporting",
    text: "Focused on presenting business performance through clear KPI cards, visuals and structured reporting.",
    link: ""
  },
  {
    date: "",
    tag: "SQL",
    title: "SQL for Data Analysis",
    text: "Strengthened MySQL querying skills for filtering, joining, aggregating and analysing structured datasets.",
    link: ""
  },
  {
    date: "",
    tag: "Python",
    title: "Data Cleaning with Pandas",
    text: "Worked with missing values, duplicates, data types and exploratory analysis as part of data analytics workflows.",
    link: ""
  },
  {
    date: "",
    tag: "MIS",
    title: "MIS Reporting & Operations",
    text: "Handled daily, weekly and monthly MIS reports, data consolidation, validation and operational performance tracking to support management decisions.",
    link: ""
  },
  {
    date: "",
    tag: "Data Analysis",
    title: "Data Analysis & Business Insights",
    text: "Performed data cleaning, exploratory data analysis and KPI analysis to identify trends, patterns and useful business insights.",
    link: ""
  }
];

/* ================= THEME TOGGLE ================= */
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

if (themeBtn) themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

/* ================= MOBILE MENU ================= */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
});
if (navLinks && menuBtn) navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

/* ================= NAV SHADOW, PROGRESS BAR, ACTIVE LINK ================= */
const nav = document.getElementById("nav");
const progress = document.getElementById("progress");
const sections = document.querySelectorAll("main section[id]");
const linkMap = {};
if (navLinks) {
  navLinks.querySelectorAll("a[href^='#']").forEach((a) => {
    linkMap[a.getAttribute("href").slice(1)] = a;
  });
}

function onScroll() {
  const y = window.scrollY;
  if (nav) nav.classList.toggle("scrolled", y > 20);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

  let current = "";
  sections.forEach((section) => {
    if (y >= section.offsetTop - 120) current = section.id;
  });
  Object.values(linkMap).forEach((a) => a.classList.remove("active"));
  if (linkMap[current]) linkMap[current].classList.add("active");
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ================= TYPING EFFECT ================= */
const words = ["Data Analyst", "SQL", "Power BI", "Python", "Advanced Excel", "MIS Reporting", "Business Intelligence"];
const typedEl = document.getElementById("typed");
let wi = 0, ci = words[0].length, deleting = true;

function typeLoop() {
  if (!typedEl) return;
  const word = words[wi];
  typedEl.textContent = word.slice(0, ci);
  if (deleting) {
    ci--;
    if (ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; }
  } else {
    ci++;
    if (ci > words[wi].length) { deleting = true; setTimeout(typeLoop, 1400); return; }
  }
  setTimeout(typeLoop, deleting ? 60 : 110);
}
setTimeout(typeLoop, 1600);

/* ================= REVEAL ON SCROLL + COUNTERS ================= */
function animateCount(el) {
  const target = +el.dataset.count;
  const start = performance.now();
  const dur = 1200;
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      io.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);
function observeReveals(scope = document) {
  scope.querySelectorAll(".reveal:not(.visible)").forEach((el) => io.observe(el));
}

/* ================= PROJECT FILTER ================= */
document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll(".project-card").forEach((card) => {
      card.classList.toggle("hide", f !== "all" && !card.dataset.cat.split(/\s+/).includes(f));
    });
  });
});

/* ================= LEARNING LOG RENDER ================= */
const learnList = document.getElementById("learnList");
const learnFilters = document.getElementById("learnFilters");

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderLearning(tag = "All") {
  if (!learnList) return;
  const items = tag === "All" ? LEARNING_LOG : LEARNING_LOG.filter((i) => i.tag === tag);
  learnList.innerHTML = items
    .map(
      (i) => `
      <article class="learn-card reveal">
        <div class="learn-meta">
          <span class="learn-tag">${escapeHTML(i.tag)}</span>
        </div>
        <h3>${escapeHTML(i.title)}</h3>
        <p>${escapeHTML(i.text)}</p>
        ${i.link ? `<a href="${escapeHTML(i.link)}" target="_blank" rel="noopener">View →</a>` : ""}
      </article>`
    )
    .join("");
  observeReveals(learnList);
}

const tags = ["All", ...new Set(LEARNING_LOG.map((i) => i.tag))];
if (learnFilters) {
  learnFilters.innerHTML = tags
    .map((t, idx) => `<button type="button" class="learn-filter${idx === 0 ? " active" : ""}" data-tag="${escapeHTML(t)}" aria-pressed="${idx === 0}">${escapeHTML(t)}</button>`)
    .join("");
  learnFilters.addEventListener("click", (e) => {
    const btn = e.target.closest(".learn-filter");
    if (!btn) return;
    learnFilters.querySelectorAll(".learn-filter").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    renderLearning(btn.dataset.tag);
  });
}
renderLearning();
observeReveals();

/* ================= COPY EMAIL ================= */
const toast = document.getElementById("toast");

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

const copyEmailBtn = document.getElementById("copyEmail");

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    const email = "sutarsuraj843@gmail.com";

    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied successfully! ✓");
    } catch (error) {
      showToast("Unable to copy. Please copy: " + email);
    }
  });
}


/* ================= FOOTER YEAR ================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
