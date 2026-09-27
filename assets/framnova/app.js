(function () {
  "use strict";

  var root = document.documentElement;
  var config = window.FramnovaConfig || {
    chromeWebStoreUrl: "https://chromewebstore.google.com/detail/framnova/fcagagedgniajofnacjggkgjpfiebndc",
    chromeBetaPath: "/extension/",
    chromeStoreStatus: "live"
  };
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = Boolean(navigator.connection && navigator.connection.saveData);
  var savedLocale = localStorage.getItem("framnova-locale") || localStorage.getItem("screencrate-locale");
  var locale = savedLocale === "es" ? "es" : "en";

  var translatedElements = Array.prototype.slice.call(document.querySelectorAll("[data-es]"));
  var localeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-locale]"));

  function getOwnText(element) {
    if (!element.children.length) {
      return element.textContent.trim();
    }

    return Array.prototype.filter.call(element.childNodes, function (node) {
      return node.nodeType === Node.TEXT_NODE && node.nodeValue.trim();
    }).map(function (node) {
      return node.nodeValue.trim();
    }).join(" ");
  }

  translatedElements.forEach(function (element) {
    element.setAttribute("data-en-copy", getOwnText(element));
  });

  function setText(element, value) {
    if (!element.children.length) {
      element.textContent = value;
      return;
    }

    var textNode = Array.prototype.find.call(element.childNodes, function (node) {
      return node.nodeType === Node.TEXT_NODE && node.nodeValue.trim();
    });

    if (textNode) {
      textNode.nodeValue = value + " ";
    } else {
      element.insertBefore(document.createTextNode(value + " "), element.firstChild);
    }
  }

  var scenarioCopy = {
    en: {
      design: {
        title: "Review the new product experience",
        address: "studio.northstar.design/review",
        prompt: "Review these screens as one product experience. Find inconsistencies in hierarchy, spacing, components, and CTA language."
      },
      research: {
        title: "Synthesize the market references",
        address: "research.northstar.design/reference-set",
        prompt: "Synthesize the patterns across these product examples. Identify repeated conventions, meaningful differences, and opportunities for our product."
      },
      issue: {
        title: "Document the broken flow",
        address: "app.northstar.design/repro/empty-state",
        prompt: "Use these screenshots in order to explain the failure, separate the expected and actual states, and suggest the most likely cause."
      }
    },
    es: {
      design: {
        title: "Revisar la nueva experiencia de producto",
        address: "studio.northstar.design/revision",
        prompt: "Revisa estas pantallas como una sola experiencia. Detecta inconsistencias de jerarquía, espaciado, componentes y lenguaje de los CTA."
      },
      research: {
        title: "Sintetizar las referencias del mercado",
        address: "research.northstar.design/referencias",
        prompt: "Sintetiza los patrones de estos ejemplos. Identifica convenciones repetidas, diferencias relevantes y oportunidades para nuestro producto."
      },
      issue: {
        title: "Documentar el flujo roto",
        address: "app.northstar.design/repro/estado-vacio",
        prompt: "Utiliza estas capturas en orden para explicar el fallo, separar el estado esperado del real y sugerir la causa más probable."
      }
    }
  };

  var caseCopy = {
    en: {
      design: {
        number: "01 / 03",
        badge: "DESIGN REVIEW SET",
        title: "See the experience, not isolated frames.",
        body: "Bring desktop layouts, mobile states, components, and visual references into one focused critique.",
        prompt: "Compare these screens and prioritize the design inconsistencies that will most affect usability."
      },
      research: {
        number: "02 / 03",
        badge: "PRODUCT RESEARCH SET",
        title: "Find the pattern across the references.",
        body: "Collect product flows, feature patterns, pricing pages, and competitor references without losing their relationship.",
        prompt: "Synthesize the patterns across these examples and identify opportunities for our product."
      },
      issue: {
        number: "03 / 03",
        badge: "ISSUE EVIDENCE SET",
        title: "Show what happened before the broken state.",
        body: "Keep the preceding step, actual result, expected design, and supporting details in one ordered set.",
        prompt: "Use these screenshots in order to explain the failure and suggest the most likely cause."
      }
    },
    es: {
      design: {
        number: "01 / 03",
        badge: "CONJUNTO DE REVISIÓN",
        title: "Observa la experiencia, no fotogramas aislados.",
        body: "Reúne diseños de escritorio, estados móviles, componentes y referencias visuales en una crítica enfocada.",
        prompt: "Compara estas pantallas y prioriza las inconsistencias de diseño que más afectarán a la usabilidad."
      },
      research: {
        number: "02 / 03",
        badge: "CONJUNTO DE INVESTIGACIÓN",
        title: "Encuentra el patrón entre las referencias.",
        body: "Recopila flujos, patrones de funciones, páginas de precios y referencias de competidores sin perder su relación.",
        prompt: "Sintetiza los patrones de estos ejemplos e identifica oportunidades para nuestro producto."
      },
      issue: {
        number: "03 / 03",
        badge: "CONJUNTO DE EVIDENCIAS",
        title: "Muestra qué ocurrió antes del estado roto.",
        body: "Mantén el paso anterior, el resultado real, el diseño esperado y los detalles de apoyo en un conjunto ordenado.",
        prompt: "Utiliza estas capturas en orden para explicar el fallo y sugerir la causa más probable."
      }
    }
  };

  var currentScenario = "design";
  var currentCase = "design";

  function updateScenarioCopy() {
    var copy = scenarioCopy[locale][currentScenario];
    document.querySelectorAll("[data-demo-title]").forEach(function (element) {
      element.textContent = copy.title;
    });
    var address = document.querySelector("[data-demo-address]");
    if (address) address.textContent = copy.address;
    document.querySelectorAll("[data-demo-prompt]").forEach(function (element) {
      element.textContent = copy.prompt;
    });
    var promptInput = document.querySelector("[data-demo-prompt-input]");
    if (promptInput) promptInput.value = copy.prompt;
  }

  function updateCaseCopy() {
    var copy = caseCopy[locale][currentCase];
    var number = document.querySelector(".case-number");
    var badge = document.querySelector("[data-case-badge]");
    var title = document.querySelector("[data-case-title]");
    var body = document.querySelector("[data-case-body]");
    var prompt = document.querySelector("[data-case-prompt]");
    if (number) number.textContent = copy.number;
    if (badge) badge.textContent = copy.badge;
    if (title) title.textContent = copy.title;
    if (body) body.textContent = copy.body;
    if (prompt) prompt.textContent = copy.prompt;
  }

  function applyLocale(nextLocale) {
    locale = nextLocale === "es" ? "es" : "en";
    root.lang = locale;

    translatedElements.forEach(function (element) {
      setText(element, locale === "es" ? element.getAttribute("data-es") : element.getAttribute("data-en-copy"));
    });

    localeButtons.forEach(function (button) {
      var active = button.getAttribute("data-locale") === locale;
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    var workflowVisual = document.querySelector(".workflow-visual");
    if (workflowVisual) {
      workflowVisual.setAttribute("data-shape-label", locale === "es" ? "ORDENANDO CONJUNTO" : "ARRANGING SET");
    }

    updateScenarioCopy();
    updateCaseCopy();
    localStorage.setItem("framnova-locale", locale);
  }

  localeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      applyLocale(button.getAttribute("data-locale"));
    });
  });

  var header = document.querySelector("[data-header]");
  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  var menuButton = document.querySelector(".menu-button");
  var mobileMenu = document.getElementById("mobile-menu");

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    menuButton.setAttribute("aria-label", open ? (locale === "es" ? "Cerrar menú" : "Close menu") : (locale === "es" ? "Abrir menú" : "Open menu"));
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.inert = !open;
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
  }

  if (menuButton && mobileMenu) {
    setMenu(false);
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("click", function (event) {
      if (menuButton.getAttribute("aria-expanded") === "true" && !mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
        setMenu(false);
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuButton && menuButton.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuButton.focus();
    }
  });

  document.querySelectorAll("[data-store-action]").forEach(function (link) {
    var live = config.chromeStoreStatus === "live" && config.chromeWebStoreUrl;
    link.setAttribute("href", live ? config.chromeWebStoreUrl : config.chromeBetaPath);
    if (live) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  var demo = document.querySelector("[data-demo-root]");
  var demoButtons = Array.prototype.slice.call(document.querySelectorAll("[data-demo-go]"));
  var pauseButton = document.querySelector("[data-demo-pause]");
  var demoSteps = ["capture", "arrange", "send"];
  var demoIndex = 0;
  var demoPaused = reducedMotion || saveData;
  var demoTimer = null;

  function updatePauseButton() {
    if (!pauseButton) return;
    var action = demoPaused ? (locale === "es" ? "Reproducir demostración" : "Play demo") : (locale === "es" ? "Pausar demostración" : "Pause demo");
    var icon = pauseButton.querySelector("[data-demo-pause-icon]");
    var label = pauseButton.querySelector("[data-demo-pause-label]");
    if (icon) icon.textContent = demoPaused ? "▶" : "Ⅱ";
    if (label) label.textContent = action;
    pauseButton.setAttribute("aria-label", action);
  }

  function setDemoStep(step) {
    if (!demo || demoSteps.indexOf(step) < 0) return;
    demoIndex = demoSteps.indexOf(step);
    demo.setAttribute("data-demo-step", step);
    demoButtons.forEach(function (button) {
      var active = button.getAttribute("data-demo-go") === step;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.querySelectorAll("[data-demo-count]").forEach(function (element) {
      element.textContent = step === "capture" ? "5" : "6";
    });
  }

  function stopDemoTimer() {
    if (demoTimer) window.clearInterval(demoTimer);
    demoTimer = null;
  }

  function startDemoTimer() {
    stopDemoTimer();
    if (demoPaused || !demo) return;
    demoTimer = window.setInterval(function () {
      setDemoStep(demoSteps[(demoIndex + 1) % demoSteps.length]);
    }, 3600);
  }

  function restartDemoTimer() {
    if (!demoPaused) startDemoTimer();
  }

  demoButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setDemoStep(button.getAttribute("data-demo-go"));
      restartDemoTimer();
    });
  });

  if (pauseButton) {
    pauseButton.addEventListener("click", function () {
      demoPaused = !demoPaused;
      updatePauseButton();
      startDemoTimer();
    });
  }

  document.querySelectorAll("[data-watch-demo]").forEach(function (button) {
    button.addEventListener("click", function () {
      var target = document.getElementById("workflow");
      if (target) target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      setDemoStep("capture");
      if (!reducedMotion && !saveData) {
        demoPaused = false;
        updatePauseButton();
        startDemoTimer();
      }
    });
  });

  document.querySelectorAll(".scenario-button").forEach(function (button) {
    button.addEventListener("click", function () {
      currentScenario = button.getAttribute("data-scenario");
      document.querySelectorAll(".scenario-button").forEach(function (candidate) {
        var active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-selected", active ? "true" : "false");
      });
      if (demo) demo.setAttribute("data-scenario", currentScenario);
      updateScenarioCopy();
      setDemoStep("capture");
      restartDemoTimer();
    });
  });

  document.querySelectorAll("[data-provider]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll("[data-provider]").forEach(function (candidate) {
        candidate.classList.toggle("is-active", candidate === button);
      });
      document.querySelectorAll("[data-demo-provider]").forEach(function (element) {
        element.textContent = button.getAttribute("data-provider");
      });
    });
  });

  var attachAction = document.querySelector(".attach-action");
  if (attachAction) {
    attachAction.addEventListener("click", function () {
      setDemoStep("send");
      restartDemoTimer();
    });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopDemoTimer();
    else startDemoTimer();
  });

  var workflowRoot = document.querySelector("[data-workflow-root]");
  var workflowVisual = document.querySelector(".workflow-visual");
  if (workflowRoot && workflowVisual) {
    workflowRoot.querySelectorAll("[data-workflow]").forEach(function (button) {
      button.addEventListener("click", function () {
        var state = button.getAttribute("data-workflow");
        workflowVisual.setAttribute("data-workflow-state", state);
        workflowRoot.querySelectorAll("[data-workflow]").forEach(function (candidate) {
          var active = candidate === button;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-selected", active ? "true" : "false");
        });
      });
    });
  }

  var caseStage = document.querySelector("[data-case-stage]");
  document.querySelectorAll("[data-case]").forEach(function (button) {
    button.addEventListener("click", function () {
      currentCase = button.getAttribute("data-case");
      if (caseStage) caseStage.setAttribute("data-case-stage", currentCase);
      document.querySelectorAll("[data-case]").forEach(function (candidate) {
        var active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-selected", active ? "true" : "false");
      });
      updateCaseCopy();
    });
  });

  function bindArrowNavigation(selector, attribute) {
    var buttons = Array.prototype.slice.call(document.querySelectorAll(selector));
    buttons.forEach(function (button, index) {
      button.addEventListener("keydown", function (event) {
        if (["ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) < 0) return;
        event.preventDefault();
        var next = index;
        if (event.key === "Home") next = 0;
        else if (event.key === "End") next = buttons.length - 1;
        else next = (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].focus();
        buttons[next].click();
      });
    });
  }

  bindArrowNavigation("[data-demo-go]", "data-demo-go");
  bindArrowNavigation(".scenario-button", "data-scenario");
  bindArrowNavigation("[data-workflow]", "data-workflow");
  bindArrowNavigation("[data-case]", "data-case");

  document.querySelectorAll(".faq-list details").forEach(function (details) {
    details.addEventListener("toggle", function () {
      if (!details.open) return;
      document.querySelectorAll(".faq-list details").forEach(function (candidate) {
        if (candidate !== details) candidate.open = false;
      });
    });
  });

  var revealElements = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(function (element) { element.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealElements.forEach(function (element) { observer.observe(element); });
  }

  applyLocale(locale);
  setDemoStep("capture");
  updatePauseButton();
  startDemoTimer();
})();
