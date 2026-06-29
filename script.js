const state = {
  typingWords: [
    "machine learning models.",
    "data analysis projects.",
    "AI-powered applications.",
  ],
};

const els = {
  loader: document.getElementById("loader"),
  progressBar: document.getElementById("progressBar"),
  typingText: document.getElementById("typingText"),
  navToggle: document.getElementById("navToggle"),
  navLinks: document.getElementById("navLinks"),
  year: document.getElementById("year"),
  cursorBubble: document.getElementById("customCursor"),
  cursorDot: document.getElementById("customCursorDot"),
  filterBtns: document.querySelectorAll(".filter-btn"),
  projectCards: document.querySelectorAll(".project-card"),
  revealNodes: document.querySelectorAll(".reveal"),
  sectionNodes: document.querySelectorAll("main section[id]"),
};

function runLoader() {
  window.addEventListener("load", () => {
    setTimeout(() => {
      els.loader?.classList.add("hidden");
    }, 700);
  });
}

function setYear() {
  if (els.year) els.year.textContent = String(new Date().getFullYear());
}

function setupTypingEffect() {
  if (!els.typingText) return;
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function step() {
    const word = state.typingWords[wordIndex];
    if (!deleting) {
      charIndex += 1;
      els.typingText.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(step, 1200);
        return;
      }
    } else {
      charIndex -= 1;
      els.typingText.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % state.typingWords.length;
      }
    }
    setTimeout(step, deleting ? 40 : 65);
  }
  step();
}

function setupMobileNav() {
  els.navToggle?.addEventListener("click", () => {
    const expanded = els.navToggle.getAttribute("aria-expanded") === "true";
    els.navToggle.setAttribute("aria-expanded", String(!expanded));
    els.navLinks?.classList.toggle("open");
  });

  els.navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      els.navLinks?.classList.remove("open");
      els.navToggle?.setAttribute("aria-expanded", "false");
    });
  });
}

function setupRevealAnimations() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.12 }
  );

  els.revealNodes.forEach((node) => io.observe(node));
}

function setupProjectFilters() {
  els.filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      els.projectCards.forEach((card) => {
        const category = card.dataset.category;
        const visible = filter === "all" || filter === category;
        card.style.display = visible ? "flex" : "none";
      });
    });
  });
}

function setupScrollProgress() {
  function updateProgress() {
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (scrollTop / max) * 100 : 0;
    if (els.progressBar) els.progressBar.style.width = `${progress}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

function setupActiveSectionHighlight() {
  const navMap = {};
  document.querySelectorAll(".nav-links a").forEach((link) => {
    navMap[link.getAttribute("href")?.replace("#", "") || ""] = link;
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        document.querySelectorAll(".nav-links a").forEach((a) => a.classList.remove("active"));
        navMap[id]?.classList.add("active");
      });
    },
    { threshold: 0.45 }
  );

  els.sectionNodes.forEach((section) => sectionObserver.observe(section));
}

function setupCustomCursor() {
  if (
    window.matchMedia("(pointer: coarse)").matches ||
    !els.cursorBubble ||
    !els.cursorDot
  ) {
    if (els.cursorBubble) els.cursorBubble.style.display = "none";
    if (els.cursorDot) els.cursorDot.style.display = "none";
    return;
  }

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let bubbleX = targetX;
  let bubbleY = targetY;
  let rafId = 0;
  const followEase = 0.2;

  function animateBubble() {
    bubbleX += (targetX - bubbleX) * followEase;
    bubbleY += (targetY - bubbleY) * followEase;
    els.cursorBubble.style.left = `${bubbleX}px`;
    els.cursorBubble.style.top = `${bubbleY}px`;
    rafId = requestAnimationFrame(animateBubble);
  }

  function onMove(event) {
    targetX = event.clientX;
    targetY = event.clientY;
    els.cursorDot.style.left = `${targetX}px`;
    els.cursorDot.style.top = `${targetY}px`;
    if (!rafId) animateBubble();
  }

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseleave", () => {
    els.cursorBubble.style.opacity = "0";
    els.cursorDot.style.opacity = "0";
  });
  window.addEventListener("mouseenter", () => {
    els.cursorBubble.style.opacity = "1";
    els.cursorDot.style.opacity = "1";
  });

  document.querySelectorAll("a, button, input, textarea").forEach((node) => {
    node.addEventListener("mouseenter", () => {
      els.cursorBubble.classList.add("is-active");
      els.cursorDot.classList.add("is-active");
    });
    node.addEventListener("mouseleave", () => {
      els.cursorBubble.classList.remove("is-active");
      els.cursorDot.classList.remove("is-active");
    });
  });
}

function setupContactForm() {
  const form = document.querySelector(".contact-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const visitorEmail = document.getElementById("email")?.value || "";
    const message = document.getElementById("message")?.value || "";
    const name = document.getElementById("name")?.value || "Portfolio Visitor";
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${visitorEmail ? ` (${visitorEmail})` : ""}`
    );
    window.location.href = `mailto:yashjoshiglobal@gmail.com?subject=${subject}&body=${body}`;
  });
}

runLoader();
setYear();
setupTypingEffect();
setupMobileNav();
setupRevealAnimations();
setupProjectFilters();
setupScrollProgress();
setupActiveSectionHighlight();
setupCustomCursor();
setupContactForm();
