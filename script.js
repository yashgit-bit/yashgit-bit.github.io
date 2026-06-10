const state = {
  typingWords: [
    "beautiful user interfaces.",
    "fast, scalable web apps.",
    "premium digital experiences.",
  ],
};

const els = {
  loader: document.getElementById("loader"),
  progressBar: document.getElementById("progressBar"),
  typingText: document.getElementById("typingText"),
  navToggle: document.getElementById("navToggle"),
  navLinks: document.getElementById("navLinks"),
  themeToggle: document.getElementById("themeToggle"),
  year: document.getElementById("year"),
  cursorBubble: document.getElementById("customCursor"),
  cursorDot: document.getElementById("customCursorDot"),
  particleCanvas: document.getElementById("particleCanvas"),
  filterBtns: document.querySelectorAll(".filter-btn"),
  projectCards: document.querySelectorAll(".project-card"),
  revealNodes: document.querySelectorAll(".reveal"),
  sectionNodes: document.querySelectorAll("main section[id]"),
};

function runLoader() {
  window.addEventListener("load", () => {
    setTimeout(() => {
      els.loader?.classList.add("hidden");
    }, 900);
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

function setupThemeToggle() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") document.body.classList.add("light");
  updateThemeIcon();

  els.themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const theme = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("theme", theme);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const icon = els.themeToggle?.querySelector(".theme-toggle__icon");
    if (!icon) return;
    icon.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
  }
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
          if (entry.target.matches(".card")) animateSkillBars(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  els.revealNodes.forEach((node) => io.observe(node));
}

function animateSkillBars(container) {
  container.querySelectorAll(".bar i").forEach((bar) => {
    const level = bar.dataset.level || "0";
    if (bar.style.width) return;
    bar.style.width = `${level}%`;
  });
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
        card.style.display = visible ? "block" : "none";
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
    { threshold: 0.55 }
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

function setupParticleBackground() {
  const canvas = els.particleCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let particles = [];
  const particleCount = 56;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const light = document.body.classList.contains("light");
    const color = light ? "rgba(45, 102, 210, 0.45)" : "rgba(152, 189, 255, 0.55)";

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

function setupContactForm() {
  const form = document.querySelector(".contact-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email")?.value || "[YOUR EMAIL]";
    const message = document.getElementById("message")?.value || "";
    const name = document.getElementById("name")?.value || "Portfolio Visitor";
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });
}

runLoader();
setYear();
setupTypingEffect();
setupThemeToggle();
setupMobileNav();
setupRevealAnimations();
setupProjectFilters();
setupScrollProgress();
setupActiveSectionHighlight();
setupCustomCursor();
setupParticleBackground();
setupContactForm();

