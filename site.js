(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const initNav = () => {
    const navRoot = document.querySelector("[data-fastflow-nav]");
    if (!navRoot || navRoot.dataset.ready === "true") return;
    navRoot.dataset.ready = "true";

    const body = document.body;
    const menu = navRoot.querySelector("#primary-navigation");
    const toggle = navRoot.querySelector(".hamburger");
    const overlay = document.querySelector("[data-nav-overlay]");
    const dropdownItem = navRoot.querySelector(".has-dropdown");
    const dropdownToggle = navRoot.querySelector(".dropdown-toggle");
    const navLinks = navRoot.querySelectorAll("a[href]");
    const desktopQuery = window.matchMedia("(min-width: 901px)");

    const setCurrentLink = () => {
      const current = window.location.pathname.split("/").pop() || "index.html";
      let servicePageActive = false;

      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === current) {
          link.setAttribute("aria-current", "page");
          if (link.classList.contains("dropdown-link")) servicePageActive = true;
        } else {
          link.removeAttribute("aria-current");
        }
      });

      if (servicePageActive) {
        dropdownToggle.dataset.current = "true";
      } else {
        delete dropdownToggle.dataset.current;
      }
    };

    const closeDropdown = () => {
      dropdownItem.classList.remove("is-open");
      dropdownToggle.setAttribute("aria-expanded", "false");
    };

    const openDropdown = () => {
      dropdownItem.classList.add("is-open");
      dropdownToggle.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      menu.classList.remove("is-open");
      body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
      if (overlay) {
        overlay.classList.remove("is-visible");
        overlay.hidden = true;
      }
      if (!desktopQuery.matches) closeDropdown();
    };

    const openMenu = () => {
      menu.classList.add("is-open");
      body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation menu");
      if (overlay) {
        overlay.hidden = false;
        requestAnimationFrame(() => overlay.classList.add("is-visible"));
      }
    };

    setCurrentLink();
    toggle.addEventListener("click", () => {
      menu.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    overlay?.addEventListener("click", closeMenu);
    dropdownToggle.addEventListener("click", () => {
      dropdownItem.classList.contains("is-open") ? closeDropdown() : openDropdown();
    });
    document.addEventListener("click", (event) => {
      if (!navRoot.contains(event.target) && desktopQuery.matches) closeDropdown();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeMenu();
      closeDropdown();
      toggle.focus();
    });
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (!desktopQuery.matches) closeMenu();
      });
    });
    desktopQuery.addEventListener("change", () => {
      closeMenu();
      closeDropdown();
    });
  };

  const initCursorGlow = () => {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    window.addEventListener("pointermove", (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    });
  };

  const initAnimations = () => {
    if (!window.gsap || reduceMotion) {
      document.querySelectorAll(".reveal-on-scroll, .page-reveal, .card-reveal").forEach((element) => {
        element.style.opacity = 1;
        element.style.transform = "none";
      });
      return;
    }

    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    gsap.from(".page-reveal", {
      opacity: 0,
      y: 24,
      duration: 0.85,
      stagger: 0.1,
      ease: "power3.out"
    });

    if (window.ScrollTrigger) {
      gsap.utils.toArray(".reveal-on-scroll").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 34,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true
          }
        });
      });

      gsap.utils.toArray(".card-reveal").forEach((group) => {
        const cards = group.querySelectorAll(".service-card, .project-card, .value-card, .info-card, .comparison-card, .mini-card");
        gsap.from(cards, {
          opacity: 0,
          y: 28,
          duration: 0.72,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: group,
            start: "top 82%",
            once: true
          }
        });
      });

      const combinedLines = document.querySelectorAll(".combined-line");
      if (combinedLines.length) {
        combinedLines.forEach((line) => {
          const length = line.getTotalLength();
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap.to(combinedLines, {
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 0.75,
          yoyo: true
        });
      }
    }
  };

  initNav();
  initCursorGlow();
  initAnimations();
})();
