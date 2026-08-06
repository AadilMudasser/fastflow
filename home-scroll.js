(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scenes = Array.from(document.querySelectorAll("[data-scroll-scene]"));
  const loader = document.querySelector("[data-home-loader]");
  const header = document.querySelector(".site-header");

  if (!scenes.length) return;

  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add("is-hidden");
    window.setTimeout(() => loader.remove(), 520);
  };

  const formatStat = (element, value) => {
    const prefix = element.dataset.statPrefix || "";
    const suffix = element.dataset.statSuffix || "";
    element.textContent = `${prefix}${Math.round(value)}${suffix}`;
  };

  const stats = Array.from(document.querySelectorAll("[data-stat-target]"));
  let statsPlayed = false;

  const playStats = () => {
    if (statsPlayed || !window.gsap) return;
    statsPlayed = true;
    stats.forEach((stat, index) => {
      const counter = { value: 0 };
      gsap.to(counter, {
        value: Number(stat.dataset.statTarget),
        duration: 1.15,
        delay: index * 0.08,
        ease: "power3.out",
        onUpdate: () => formatStat(stat, counter.value)
      });
    });
  };

  stats.forEach((stat) => formatStat(stat, reduceMotion ? Number(stat.dataset.statTarget) : 0));

  const firstVideo = scenes[0]?.querySelector("video");
  if (firstVideo) {
    if (firstVideo.readyState >= 2) {
      hideLoader();
    } else {
      firstVideo.addEventListener("loadeddata", hideLoader, { once: true });
      firstVideo.addEventListener("canplay", hideLoader, { once: true });
      window.setTimeout(hideLoader, 2600);
    }
  } else {
    hideLoader();
  }

  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    hideLoader();
    scenes.forEach((scene) => {
      const video = scene.querySelector("video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      scene.querySelectorAll(".scene-copy").forEach((item) => {
        item.style.opacity = 1;
        item.style.transform = "none";
        item.style.filter = "none";
      });
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.set(".scene-copy", {
    autoAlpha: 0,
    y: 28,
    filter: "blur(12px)",
    clipPath: "inset(0 0 18% 0)"
  });

  const setIn = (selector, fromVars = {}) => {
    gsap.set(selector, {
      autoAlpha: 0,
      y: fromVars.y ?? 28,
      x: fromVars.x ?? 0,
      scale: fromVars.scale ?? 1,
      filter: "blur(12px)",
      clipPath: "inset(0 0 18% 0)"
    });
  };

  const reveal = (timeline, selector, at, vars = {}) => {
    timeline.to(selector, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      clipPath: "inset(0 0 0% 0)",
      duration: vars.duration || 0.12,
      ease: vars.ease || "power2.out"
    }, at);
  };

  const conceal = (timeline, selector, at, vars = {}) => {
    timeline.to(selector, {
      autoAlpha: 0,
      y: vars.y ?? -22,
      x: vars.x ?? 0,
      scale: vars.scale ?? 0.985,
      filter: "blur(10px)",
      clipPath: "inset(14% 0 0 0)",
      duration: vars.duration || 0.1,
      ease: vars.ease || "power2.in"
    }, at);
  };

  setIn(".hero-eyebrow", { x: -22 });
  setIn(".hero-dead", { x: -34 });
  setIn(".hero-live", { x: 34 });
  setIn(".hero-support", { x: 24 });
  setIn(".hero-actions", { y: 18 });
  setIn(".problem-panel", { x: -24 });
  setIn(".old-way-panel", { x: -22 });
  setIn(".fastflow-way-panel", { x: 22 });
  setIn(".stats-rail", { y: 18 });
  setIn(".demo-proof", { x: 26 });
  setIn(".system-step", { x: -20 });
  setIn(".revenue-flow", { y: 18 });
  setIn(".services-reveal", { x: -22 });
  setIn(".founder-reveal", { x: 24 });
  setIn(".final-cta-cinema", { y: 24, scale: 0.98 });

  const buildContentTimeline = (scene) => {
    const name = scene.dataset.scene;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

    if (name === "hero") {
      reveal(tl, scene.querySelector(".hero-eyebrow"), 0.12);
      conceal(tl, scene.querySelector(".hero-eyebrow"), 0.32, { y: -12 });
      reveal(tl, scene.querySelector(".hero-dead"), 0.25);
      conceal(tl, scene.querySelector(".hero-dead"), 0.48, { x: -20 });
      reveal(tl, scene.querySelector(".hero-live"), 0.45);
      reveal(tl, scene.querySelector(".hero-support"), 0.63);
      reveal(tl, scene.querySelector(".hero-actions"), 0.82);
    }

    if (name === "system") {
      reveal(tl, scene.querySelector(".problem-panel"), 0.05);
      conceal(tl, scene.querySelector(".problem-panel"), 0.2);
      reveal(tl, scene.querySelector(".old-way-panel"), 0.18);
      conceal(tl, scene.querySelector(".old-way-panel"), 0.36, { x: -18 });
      reveal(tl, scene.querySelector(".fastflow-way-panel"), 0.3);
      reveal(tl, scene.querySelector(".stats-rail"), 0.42);
      tl.call(playStats, null, 0.45);
      conceal(tl, scene.querySelector(".fastflow-way-panel"), 0.54, { x: 18 });
      conceal(tl, scene.querySelector(".stats-rail"), 0.57);
      reveal(tl, scene.querySelector(".demo-proof"), 0.56);
      conceal(tl, scene.querySelector(".demo-proof"), 0.7, { x: 18 });
      gsap.utils.toArray(scene.querySelectorAll(".system-step")).forEach((step, index) => {
        reveal(tl, step, 0.66 + index * 0.055);
        conceal(tl, step, 0.78 + index * 0.045, { x: -16 });
      });
      reveal(tl, scene.querySelector(".revenue-flow"), 0.88);
    }

    if (name === "final") {
      reveal(tl, scene.querySelector(".services-reveal"), 0.08);
      conceal(tl, scene.querySelector(".services-reveal"), 0.38, { x: -18 });
      reveal(tl, scene.querySelector(".founder-reveal"), 0.42);
      conceal(tl, scene.querySelector(".founder-reveal"), 0.68, { x: 18 });
      reveal(tl, scene.querySelector(".final-cta-cinema"), 0.74, { duration: 0.16 });
    }

    tl.to({}, { duration: 0.001 }, 1);
    return tl;
  };

  const videoControllers = scenes.map((scene) => {
    const video = scene.querySelector("video");
    const timeline = buildContentTimeline(scene);
    const controller = {
      scene,
      video,
      timeline,
      targetTime: 0,
      currentTime: 0,
      active: false,
      duration: 1
    };

    const refreshDuration = () => {
      controller.duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 1;
      ScrollTrigger.refresh();
    };

    video.pause();
    video.addEventListener("loadedmetadata", refreshDuration, { once: true });
    video.addEventListener("durationchange", refreshDuration);

    ScrollTrigger.create({
      trigger: scene,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onToggle: (self) => {
        controller.active = self.isActive;
        if (!self.isActive) video.pause();
      },
      onUpdate: (self) => {
        const progress = self.progress;
        controller.targetTime = progress * controller.duration;
        timeline.progress(progress);
        if (scene.dataset.scene === "system" && progress > 0.42) playStats();
      }
    });

    return controller;
  });

  gsap.ticker.add(() => {
    videoControllers.forEach((controller) => {
      const { video } = controller;
      if (!video || !controller.active || !controller.duration) return;

      const actual = video.currentTime || 0;
      const diff = controller.targetTime - actual;
      if (Math.abs(diff) < 0.018) return;

      const nextTime = actual + diff * 0.18;
      try {
        video.currentTime = Math.max(0, Math.min(controller.duration - 0.03, nextTime));
      } catch (error) {
        controller.active = false;
      }
    });
  });

  const debounce = (callback, delay) => {
    let timer = 0;
    return () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(callback, delay);
    };
  };

  const refresh = debounce(() => ScrollTrigger.refresh(), 180);
  window.addEventListener("resize", refresh, { passive: true });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
