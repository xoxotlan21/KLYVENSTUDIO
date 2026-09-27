import { translations } from './translations.js';
import logoLightUrl from './logo.png';
import logoDarkUrl from './logo-dark.png';

(function () {
  var d = document.documentElement;
  if (!('animate' in Element.prototype)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  d.classList.add('pre');
  setTimeout(function () {
    d.classList.remove('pre');
  }, 4000);
})();

(function () {
  var html = document.documentElement;
  if (!html.classList.contains('pre')) return;
  var EXPO = 'cubic-bezier(.16,1,.3,1)';
  var SOFT = 'cubic-bezier(.22,.7,.25,1)';
  var GLASS = 'cubic-bezier(.2,.75,.28,1)';
  var s = matchMedia('(max-width: 640px)').matches ? .86 : 1;
  var running = [];

  function animate(el, keyframes, delay, dur, ease) {
    var nodes = document.querySelectorAll(el);
    nodes.forEach(function (node) {
      var a = node.animate(keyframes, {
        duration: Math.round((dur || 600) * s),
        delay: Math.round((delay || 0) * s),
        easing: ease || 'ease',
        fill: 'both'
      });
      running.push(a);
    });
  }

  function rise(el, delay, dur) {
    animate(el, [{ clipPath: 'inset(100% 0 -14% 0)', translate: '0 .16em' }, { clipPath: 'inset(-18% 0 -14% 0)', translate: '0 0' }], delay, dur, EXPO);
  }

  function lift(el, delay, dist, dur) {
    animate(el, [{ opacity: 0, translate: '0 ' + (dist || '.7em') }, { opacity: 1, translate: '0 0' }], delay, dur || 560, SOFT);
  }

  function settle(el, delay, dur, from, dist) {
    animate(el, [{ opacity: 0, scale: from || .985, translate: '0 ' + (dist || '1.1em') }, { opacity: 1, scale: 1, translate: '0 0' }], delay, dur || 760, GLASS);
  }

  settle('.hero-topbar', 80, 700, .99, '.5em');
  lift('.hero-kicker', 220, '.6em', 520);
  lift('.hero-title', 300, '.5em', 650);
  lift('.hero-description', 420, '.5em', 580);
  settle('.hero-actions', 500, 600, .98, '.4em');
  lift('.hero-services-line', 580, '.4em', 500);
  settle('.hero-create-card', 460, 780, .98, '.9em');
  settle('.hero-status-pill', 600, 680, .98, '.6em');
  settle('.hero-selected-work-badge', 620, 680, .98, '.6em');

  Promise.all(running.map(function (a) {
    return a.finished.catch(function () {});
  })).then(function () {
    document.documentElement.classList.remove('pre');
    running.forEach(function (a) { a.cancel(); });
    running.length = 0;
  });
})();

(function () {
  var btn = document.querySelector('.burger');
  var menu = document.getElementById('site-menu');
  if (!btn || !menu) return;

  function closeMenu() {
    btn.setAttribute('aria-expanded', 'false');
    menu.removeAttribute('data-open');
  }

  function openMenu() {
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('data-open', 'true');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu(); else openMenu();
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', function (e) {
    if (!btn.contains(e.target) && !menu.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      btn.focus();
    }
  });

  var landscape = window.matchMedia('(min-aspect-ratio: 1/1)');
  var handleLand = function (event) {
    if (event.matches) closeMenu();
  };
  if (landscape.addEventListener) {
    landscape.addEventListener('change', handleLand);
  } else {
    landscape.addListener(handleLand);
  }
})();

(function () {
  var v = document.querySelector('video.bg');
  if (!v) return;
  var q = matchMedia('(prefers-reduced-motion: reduce)');
  var sync = function () {
    if (q.matches) {
      v.pause();
      v.currentTime = 0;
    } else {
      v.play().catch(function () {});
    }
  };
  if (q.addEventListener) {
    q.addEventListener('change', sync);
  } else {
    q.addListener(sync);
  }
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) sync();
  });
  v.addEventListener('canplay', sync);
  sync();
})();

(function () {
  var body = document.body;
  var html = document.documentElement;
  var update = function () {
    var scrolled = window.scrollY > 90;
    body.classList.toggle('has-scrolled', scrolled);
    html.classList.toggle('has-scrolled', scrolled);
    var dock = document.querySelector('.scroll-dock');
    if (dock) dock.setAttribute('data-visible', scrolled ? 'true' : 'false');
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

(function () {
  var burger = document.querySelector('.dock-burger');
  var menu = document.getElementById('dock-mobile-menu');
  var backdrop = document.getElementById('dock-backdrop');
  if (!burger || !menu) return;

  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    if (backdrop) {
      backdrop.classList.remove('is-open');
      backdrop.setAttribute('aria-hidden', 'true');
    }
  }

  function openMenu() {
    burger.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    if (backdrop) {
      backdrop.classList.add('is-open');
      backdrop.setAttribute('aria-hidden', 'false');
    }
  }

  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = burger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', function () {
      closeMenu();
    });
  }

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('click', function (e) {
    if (!burger.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      burger.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
})();

(function () {
  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionPreference.matches) return;

  var revealSelectors = [
    // The Klyven Approach Section
    '.approach-header > *',
    '.approach-flow > *',
    '.approach-pillars > *',
    '.approach-action',

    // Selected Work Section
    '.work-header > *',
    '.work-grid > .work-card',

    // How It Works / Services Section
    '.how-header > *',
    '.how-annot',
    '.how-board',
    '.how-cta-row',

    // Before and After Section
    '.ba-header > *',
    '.ba-comparison-wrap > *',
    '.ba-features-grid > *',

    // Why Klyven Section
    '.why-copy > *',
    '.why-visual',
    '.why-grid > *',

    // Pricing Section
    '.pricing-header > *',
    '.pricing-grid > .pricing-card',
    '.pricing-footnote',

    // FAQ Section
    '.faq-section .section-kicker',
    '.faq-section .section-title',
    '.faq-list > .faq-item',

    // CTA Final Section
    '.cta-inner > .cta-title',
    '.cta-inner > .cta-copy',
    '.cta-inner > .cta-row'
  ];

  document.querySelectorAll(revealSelectors.join(',')).forEach(function (element) {
    element.setAttribute('data-reveal', '');
  });

  // Stagger delays for grid / grouped children
  var staggerContainers = [
    '.approach-flow',
    '.approach-pillars',
    '.work-grid',
    '.ba-comparison-wrap',
    '.ba-features-grid',
    '.why-grid',
    '.pricing-grid',
    '.faq-list'
  ];

  document.querySelectorAll(staggerContainers.join(',')).forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (item, index) {
      item.style.setProperty('--reveal-delay', Math.min(index * 95, 320) + 'ms');
    });
  });

  document.documentElement.classList.add('motion-ready');

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach(function (element) {
      element.classList.add('is-visible');
    });
    return;
  }

  var revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(function (element) {
    revealObserver.observe(element);
  });
})();

// ==========================================================================
// KLYVEN STUDIO - LANGUAGE SWITCHER (EN / ES)
// ==========================================================================
(function () {
  function getStoredLang() {
    try {
      return localStorage.getItem('klyven_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  }

  function setLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    var t = translations[lang];
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('klyven_lang', lang);
    } catch (e) {}

    // Update all elements with data-i18n
    var elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        if (el.getAttribute('data-i18n-html') === 'true') {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Update form placeholders
    var placeholderEls = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderEls.forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) {
        el.setAttribute('placeholder', t[key]);
      }
    });

    // Sync bilingual content blocks (Legal documents)
    var langBlocks = document.querySelectorAll('[data-lang-block]');
    langBlocks.forEach(function (el) {
      el.style.display = el.getAttribute('data-lang-block') === lang ? 'block' : 'none';
    });
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 60);

    // Sync all unified language buttons (.lang-btn)
    var targetLabel = lang === 'en' ? 'ES' : 'EN';
    var targetAria = lang === 'en' ? 'Cambiar a Español' : 'Switch to English';
    var langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(function (btn) {
      var textSpan = btn.querySelector('.lang-btn-text');
      if (textSpan) {
        textSpan.textContent = targetLabel;
      }
      btn.setAttribute('aria-label', targetAria);
      btn.setAttribute('title', targetAria);
    });

    // Sync any split toggle buttons (.lang-toggle-btn) for compatibility
    var buttons = document.querySelectorAll('.lang-toggle-btn');
    buttons.forEach(function (btn) {
      btn.querySelectorAll('.lang-opt').forEach(function (opt) {
        var optLang = opt.getAttribute('data-lang');
        var isActive = optLang === lang;
        opt.classList.toggle('active', isActive);
        opt.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    });

    // Sync theme toggle buttons tooltip and aria-label
    var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    var isDark = currentTheme === 'dark';
    var themeLabel = isDark
      ? (lang === 'es' ? 'Cambiar a modo claro' : 'Switch to light mode')
      : (lang === 'es' ? 'Cambiar a modo oscuro' : 'Switch to dark mode');
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.setAttribute('aria-label', themeLabel);
      btn.setAttribute('title', themeLabel);
    });
  }

  // Handle click events on language toggle buttons
  document.addEventListener('click', function (e) {
    var singleBtn = e.target.closest('.lang-btn');
    if (singleBtn) {
      e.preventDefault();
      var current = document.documentElement.lang || 'en';
      setLanguage(current === 'en' ? 'es' : 'en');
      return;
    }

    var opt = e.target.closest('.lang-opt');
    var btn = e.target.closest('.lang-toggle-btn');
    if (opt) {
      e.preventDefault();
      var targetLang = opt.getAttribute('data-lang');
      if (targetLang) setLanguage(targetLang);
      return;
    }
    if (btn) {
      e.preventDefault();
      var currentLang = document.documentElement.lang || 'en';
      setLanguage(currentLang === 'en' ? 'es' : 'en');
    }
  });

  // Initialize with stored or default language
  var initialLang = getStoredLang();
  setLanguage(initialLang);
})();

// ==========================================================================
// DARK MODE THEME CONTROLLER
// ==========================================================================
(function () {
  function getStoredTheme() {
    try {
      return localStorage.getItem('klyven_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } catch (e) {
      return 'light';
    }
  }

  function updateHeroVideo(theme) {
    var lightVideo = document.querySelector('.bg-video-light');
    var darkVideo = document.querySelector('.bg-video-dark');
    if (lightVideo && darkVideo) {
      if (theme === 'dark') {
        lightVideo.pause();
        darkVideo.play().catch(function () {});
      } else {
        darkVideo.pause();
        lightVideo.play().catch(function () {});
      }
    }
  }

  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') theme = 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem('klyven_theme', theme);
    } catch (e) {}

    updateHeroVideo(theme);

    // Swap logos to dark mode logo if theme is dark
    var isDark = theme === 'dark';
    document.querySelectorAll('.hero-logo, .dock-logo, .footer-logo-img').forEach(function (img) {
      img.src = isDark ? logoDarkUrl : logoLightUrl;
    });
    var fav = document.querySelector('link[rel="icon"]');
    if (fav) fav.href = isDark ? logoDarkUrl : logoLightUrl;

    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', isDark ? '#000000' : '#E6EDF6');

    // Update aria labels on all theme buttons
    var isEs = (document.documentElement.lang || 'en') === 'es';
    var label = isDark
      ? (isEs ? 'Cambiar a modo claro' : 'Switch to light mode')
      : (isEs ? 'Cambiar a modo oscuro' : 'Switch to dark mode');
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  // Handle click on theme toggle buttons
  document.addEventListener('click', function (e) {
    var themeBtn = e.target.closest('.theme-toggle-btn');
    if (themeBtn) {
      e.preventDefault();
      var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
      return;
    }
  });

  // Listen for OS system theme changes
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('klyven_theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  } catch (err) {}

  // Initialize theme on load
  setTheme(getStoredTheme());
})();

// ==========================================================================
// FORM CONSENT & SUBMISSION HANDLER
// ==========================================================================
(function () {
  var form = document.getElementById('project-inquiry-form');
  if (!form) return;

  var feedback = document.getElementById('form-feedback');
  var privacyConsent = document.getElementById('consent-privacy');
  var marketingConsent = document.getElementById('consent-marketing');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (privacyConsent && !privacyConsent.checked) {
      if (feedback) {
        feedback.className = 'form-feedback-message is-error';
        feedback.textContent = document.documentElement.lang === 'es'
          ? 'Por favor, acepta la Política de Privacidad para enviar tu consulta.'
          : 'Please accept the Privacy Policy to submit your inquiry.';
      }
      return;
    }

    var formData = {
      name: (form.querySelector('[name="name"]') || {}).value || '',
      email: (form.querySelector('[name="email"]') || {}).value || '',
      message: (form.querySelector('[name="message"]') || {}).value || '',
      privacyConsent: true,
      marketingConsent: marketingConsent ? marketingConsent.checked : false,
      consentDate: new Date().toISOString()
    };

    // Store consent choice and date
    try {
      localStorage.setItem('klyven_last_consent', JSON.stringify({
        privacyConsent: formData.privacyConsent,
        marketingConsent: formData.marketingConsent,
        consentDate: formData.consentDate,
        email: formData.email
      }));

      var storedInquiries = JSON.parse(localStorage.getItem('klyven_inquiries') || '[]');
      storedInquiries.push(formData);
      localStorage.setItem('klyven_inquiries', JSON.stringify(storedInquiries));
    } catch (err) {
      console.warn('Storage error:', err);
    }

    if (feedback) {
      feedback.className = 'form-feedback-message is-success';
      feedback.textContent = document.documentElement.lang === 'es'
        ? '¡Gracias! Tu consulta y preferencias de consentimiento han sido guardadas. Te responderemos a la brevedad.'
        : 'Thank you! Your inquiry and consent preferences have been recorded. We will be in touch shortly.';
    }

    form.reset();
  });
})();

// ==========================================================================
// COOKIE PREFERENCES BANNER & SETTINGS MODAL
// ==========================================================================
(function () {
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;

  var detailsPanel = document.getElementById('cookie-details-panel');
  var btnAccept = document.getElementById('cookie-btn-accept');
  var btnEssential = document.getElementById('cookie-btn-essential');
  var btnCustomize = document.getElementById('cookie-btn-customize');
  var btnSave = document.getElementById('cookie-btn-save');
  var toggleAnalytics = document.getElementById('cookie-analytics-toggle');
  var toggleMarketing = document.getElementById('cookie-marketing-toggle');

  function getSavedPreferences() {
    try {
      var saved = localStorage.getItem('klyven_cookie_consent');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  function savePreferences(prefs) {
    try {
      prefs.timestamp = new Date().toISOString();
      localStorage.setItem('klyven_cookie_consent', JSON.stringify(prefs));
    } catch (e) {}
    hideBanner();
  }

  function showBanner(openCustomize) {
    banner.removeAttribute('hidden');
    banner.style.display = 'block';

    var current = getSavedPreferences() || { essential: true, analytics: false, marketing: false };
    if (toggleAnalytics) toggleAnalytics.checked = !!current.analytics;
    if (toggleMarketing) toggleMarketing.checked = !!current.marketing;

    if (openCustomize && detailsPanel) {
      detailsPanel.removeAttribute('hidden');
      if (btnCustomize) btnCustomize.setAttribute('hidden', '');
      if (btnSave) btnSave.removeAttribute('hidden');
    }
  }

  function hideBanner() {
    banner.setAttribute('hidden', '');
    banner.style.display = 'none';
    if (detailsPanel) detailsPanel.setAttribute('hidden', '');
    if (btnCustomize) btnCustomize.removeAttribute('hidden');
    if (btnSave) btnSave.setAttribute('hidden', '');
  }

  if (btnAccept) {
    btnAccept.addEventListener('click', function () {
      savePreferences({ essential: true, analytics: true, marketing: true });
    });
  }

  if (btnEssential) {
    btnEssential.addEventListener('click', function () {
      savePreferences({ essential: true, analytics: false, marketing: false });
    });
  }

  if (btnCustomize) {
    btnCustomize.addEventListener('click', function () {
      if (detailsPanel) {
        detailsPanel.removeAttribute('hidden');
        btnCustomize.setAttribute('hidden', '');
        if (btnSave) btnSave.removeAttribute('hidden');
      }
    });
  }

  if (btnSave) {
    btnSave.addEventListener('click', function () {
      savePreferences({
        essential: true,
        analytics: toggleAnalytics ? toggleAnalytics.checked : false,
        marketing: toggleMarketing ? toggleMarketing.checked : false
      });
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-settings]')) {
      e.preventDefault();
      showBanner(true);
    }
  });

  var existing = getSavedPreferences();
  if (!existing) {
    setTimeout(function () {
      showBanner(false);
    }, 700);
  }
})();

// ==========================================================================
// 8. TOP-TIER INTERACTIONS (3D TILT & AMBIENT GLOW)
// ==========================================================================
(function initTopTierInteractions() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 1. Ambient Glow Coordinates in Dark Mode
  window.addEventListener('mousemove', function (e) {
    document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
  }, { passive: true });

  // 2. 3D Tilt & Glare on Work Browser Frames
  var workCards = document.querySelectorAll('.work-card');
  workCards.forEach(function (card) {
    var frame = card.querySelector('.work-browser-frame');
    if (!frame) return;

    var glare = frame.querySelector('.work-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'work-glare';
      frame.appendChild(glare);
    }

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -5.5;
      var rotateY = ((x - centerX) / centerX) * 5.5;

      frame.style.transform = 'perspective(1200px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-4px) scale3d(1.012, 1.012, 1.012)';

      var glareX = (x / rect.width) * 100;
      var glareY = (y / rect.height) * 100;
      glare.style.background = 'radial-gradient(circle at ' + glareX.toFixed(1) + '% ' + glareY.toFixed(1) + '%, rgba(255,255,255,0.2) 0%, transparent 65%)';
      glare.style.opacity = '1';
    }, { passive: true });

    card.addEventListener('mouseleave', function () {
      frame.style.transform = '';
      glare.style.opacity = '0';
    }, { passive: true });
  });
})();

// ==========================================================================
// 9. PROJECT CONCEPT MODAL (FULL-PAGE PREVIEW)
// ==========================================================================
(function initProjectModal() {
  var modal = document.getElementById('project-modal');
  if (!modal) return;

  var viewport = document.getElementById('project-browser-viewport');
  var closeBtn = document.getElementById('project-modal-close-btn');
  var closeDot = document.getElementById('project-modal-close-dot');
  var backdrop = document.getElementById('project-modal-backdrop');

  function openModal(projectId) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-project-modal-open');

    var urlPill = modal.querySelector('.project-browser-url');
    var allSites = modal.querySelectorAll('.project-site-container');
    allSites.forEach(function (site) {
      site.style.display = 'none';
    });

    var currentLang = document.documentElement.lang || 'en';

    if (projectId === 'nolock') {
      if (viewport) viewport.classList.add('is-iframe-mode');
      var nolockSite = document.getElementById('project-site-nolock');
      var iframe = document.getElementById('project-nolock-iframe');
      var loader = document.getElementById('project-iframe-loader');
      var liveLink = document.getElementById('project-modal-live-link');

      if (nolockSite) nolockSite.style.display = 'flex';
      if (liveLink) {
        liveLink.href = 'https://getnolock.com/';
        liveLink.style.display = 'inline-flex';
      }

      if (iframe) {
        var targetSrc = iframe.getAttribute('data-src') || 'https://getnolock.com/';
        if (!iframe.src || iframe.src === 'about:blank' || !iframe.src.includes('getnolock.com')) {
          if (loader) loader.classList.remove('is-hidden');
          iframe.src = targetSrc;
          iframe.onload = function () {
            if (loader) loader.classList.add('is-hidden');
          };
        }
      }
      if (urlPill) urlPill.textContent = 'https://getnolock.com';
    } else if (projectId === 'framnova' || projectId === 'cafe') {
      if (viewport) viewport.classList.add('is-iframe-mode');
      var framnovaSite = document.getElementById('project-site-framnova');
      var iframe = document.getElementById('project-framnova-iframe');
      var loader = document.getElementById('project-iframe-loader-framnova');
      var liveLink = document.getElementById('project-modal-live-link');

      if (framnovaSite) framnovaSite.style.display = 'flex';
      if (liveLink) {
        liveLink.href = 'https://www.framnova.com/';
        liveLink.style.display = 'inline-flex';
      }

      if (iframe) {
        var targetSrc = iframe.getAttribute('data-src') || 'framnova-preview.html';
        if (!iframe.src || iframe.src === 'about:blank' || !iframe.src.includes('framnova-preview.html')) {
          if (loader) loader.classList.remove('is-hidden');
          iframe.src = targetSrc;
          iframe.onload = function () {
            if (loader) loader.classList.add('is-hidden');
          };
        }
      }
      if (urlPill) urlPill.textContent = 'https://www.framnova.com';
    } else {
      if (viewport) viewport.classList.remove('is-iframe-mode');
      var liveLink = document.getElementById('project-modal-live-link');
      if (liveLink) liveLink.style.display = 'none';

      var nwSite = document.getElementById('project-site-northwood');
      if (nwSite) {
        nwSite.style.display = 'block';
        nwSite.querySelectorAll('[data-lang-block]').forEach(function (el) {
          el.style.display = el.getAttribute('data-lang-block') === currentLang ? 'block' : 'none';
        });
        setTimeout(function () {
          window.dispatchEvent(new Event('resize'));
        }, 60);
      }
      if (urlPill) urlPill.textContent = 'https://www.northwoodlandscapes.com';
    }

    if (viewport) viewport.scrollTop = 0;
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-project-modal-open');
    if (viewport) viewport.classList.remove('is-iframe-mode');
  }

  document.addEventListener('click', function (e) {
    var internalLink = e.target.closest('a[href^="#nw-"]');
    if (internalLink && modal.classList.contains('is-open')) {
      e.preventDefault();
      var targetId = internalLink.getAttribute('href').substring(1);
      var currentLang = document.documentElement.lang || 'en';
      var target = document.getElementById(targetId) || 
                   document.getElementById(targetId + '-' + currentLang);
      if (target && viewport) {
        var offsetTop = target.offsetTop;
        viewport.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
      return;
    }

    var trigger = e.target.closest('[data-open-project]');
    if (trigger) {
      e.preventDefault();
      var projectId = trigger.getAttribute('data-open-project');
      openModal(projectId);
      return;
    }

    if (e.target === backdrop || e.target.closest('#project-modal-close-btn') || e.target.closest('#project-modal-close-dot')) {
      e.preventDefault();
      closeModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
  /* Northwood Capabilities Interactive Stage */
  function initNorthwoodCapabilities() {
    var capData = {
      en: [
        {
          num: '01',
          category: 'MASTERPLANNING & 3D MODELING',
          title: 'Visualizing the landscape before breaking ground.',
          desc: 'Plan drawings, photorealistic 3D models, daylight trajectory analysis and plant palettes tuned to all four seasons.',
          banner: 'assets/nw-cap-banner-01.jpg',
          alt: '01 · Masterplanning & 3D Modeling'
        },
        {
          num: '02',
          category: 'ARCHITECTURAL STONEWORK & PATIOS',
          title: 'Grounded in lasting materials.',
          desc: 'Dry-stacked walls, granite walkways, fire hearths and sustainable timber decking.',
          banner: 'assets/nw-cap-banner-02.jpg',
          alt: '02 · Architectural Stonework & Patios'
        },
        {
          num: '03',
          category: 'WATER FEATURES & CUSTOM POOLS',
          title: 'Sculpting serenity with living water.',
          desc: 'Reflection ponds, limestone fountains and swimming sanctuaries seamlessly integrated into the natural landscape.',
          banner: 'assets/nw-cap-banner-03.jpg',
          alt: '03 · Water Features & Custom Pools'
        },
        {
          num: '04',
          category: 'SCULPTURAL LIGHTING & SMART IRRIGATION',
          title: 'Illuminating natural form and conserving every drop.',
          desc: 'Low-voltage ambient illumination, architectural grazing and weather-responsive drip irrigation micro-systems.',
          banner: 'assets/nw-cap-banner-04.jpg',
          alt: '04 · Sculptural Lighting & Smart Irrigation'
        }
      ],
      es: [
        {
          num: '01',
          category: 'PLANIFICACIÓN MAESTRA Y MODELADO 3D',
          title: 'Visualizando el paisaje antes de mover una piedra.',
          desc: 'Planos topográficos, modelos 3D fotorrealistas, análisis de trayectoria solar y selección botánica adaptada a las cuatro estaciones.',
          banner: 'assets/nw-cap-banner-01.jpg',
          alt: '01 · Planificación Maestra y Modelado 3D'
        },
        {
          num: '02',
          category: 'CANTERÍA ARQUITECTÓNICA Y TERRAZAS',
          title: 'Arraigado en materiales imperecederos.',
          desc: 'Muros de piedra seca, caminos de granito, fogateros y terrazas en madera sostenible.',
          banner: 'assets/nw-cap-banner-02.jpg',
          alt: '02 · Cantería Arquitectónica y Terrazas'
        },
        {
          num: '03',
          category: 'ELEMENTOS DE AGUA Y PISCINAS A MEDIDA',
          title: 'Esculpiendo serenidad con agua viva.',
          desc: 'Estanques de reflexión, fuentes de piedra caliza y piscinas integradas armoniosamente al relieve natural.',
          banner: 'assets/nw-cap-banner-03.jpg',
          alt: '03 · Elementos de Agua y Piscinas a Medida'
        },
        {
          num: '04',
          category: 'ILUMINACIÓN ESCULTURAL Y RIEGO INTELIGENTE',
          title: 'Resaltando formas naturales y cuidando cada gota.',
          desc: 'Iluminación ambiental de bajo voltaje, luces rasantes y sistemas de riego por goteo inteligentes adaptados al microclima.',
          banner: 'assets/nw-cap-banner-04.jpg',
          alt: '04 · Iluminación Escultural y Riego Inteligente'
        }
      ]
    };

    var sections = document.querySelectorAll('[data-nw-cap-section]');
    sections.forEach(function (section) {
      var currentIdx = 1; // Stage 02 active by default
      var isEs = section.id.indexOf('-es') !== -1;
      var list = isEs ? capData.es : capData.en;

      var bannerImgs = section.querySelectorAll('.nw-cap-banner-img');
      var panel = section.querySelector('.nw-cap-glass-panel');
      var panelNum = section.querySelector('.nw-cap-panel-num');
      var panelCategory = section.querySelector('.nw-cap-panel-category');
      var panelTitle = section.querySelector('.nw-cap-panel-title');
      var panelDesc = section.querySelector('.nw-cap-panel-desc');
      var navItems = section.querySelectorAll('.nw-cap-nav-item');
      var arrowBtn = section.querySelector('.nw-cap-arrow-btn');

      function updateStage(idx) {
        currentIdx = idx;
        var data = list[idx];
        if (!data) return;

        navItems.forEach(function (btn, i) {
          if (i === idx) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
          } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          }
        });

        if (bannerImgs.length) {
          bannerImgs.forEach(function (img, i) {
            if (i === idx) {
              img.classList.add('is-active');
            } else {
              img.classList.remove('is-active');
            }
          });
        }

        if (panel) {
          panel.style.opacity = '0.35';
          setTimeout(function () {
            if (panelNum) panelNum.textContent = data.num;
            if (panelCategory) panelCategory.textContent = data.category;
            if (panelTitle) panelTitle.textContent = data.title;
            if (panelDesc) panelDesc.textContent = data.desc;
            panel.style.opacity = '1';
          }, 140);
        }
      }

      navItems.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var idx = parseInt(btn.getAttribute('data-cap-idx'), 10);
          updateStage(idx);
        });
      });

      if (arrowBtn) {
        arrowBtn.addEventListener('click', function () {
          var nextIdx = (currentIdx + 1) % list.length;
          updateStage(nextIdx);
        });
      }
    });
  }

  /* ==========================================================================
     Northwood Interactive Selected Projects (Fluid Bento & Quickview Modal)
     ========================================================================== */
  function initNorthwoodProjects() {
    var projectsData = {
      meadow: {
        num: '01',
        img: 'assets/nw-proj-meadow.jpg',
        es: {
          badge: '01',
          location: 'CARMEL VALLEY • RESIDENCIA',
          title: 'The Meadow House',
          desc: 'Un diálogo fluido entre arquitectura contemporánea y la topografía ondulada de Carmel Valley. Creamos una secuencia de terrazas en piedra caliza con iluminación rasante oculta, integrando especies gramíneas autóctonas que se mecen con la brisa costera y desdibujan el límite entre interior y exterior.',
          specLoc: 'Carmel Valley, California',
          specArea: '6,800 m²',
          specYear: '2024',
          specScope: 'Arquitectura de Paisaje, Senderos & Iluminación',
          cta: 'Consultar proyecto similar'
        },
        en: {
          badge: '01',
          location: 'CARMEL VALLEY • RESIDENCE',
          title: 'The Meadow House',
          desc: 'A seamless dialogue between modern pavilion architecture and Carmel Valley’s gentle topography. We orchestrated stepped limestone terraces with concealed grazing light fixtures, weaving native ornamental grasses that sway in coastal breezes and dissolve the boundary between indoors and outdoors.',
          specLoc: 'Carmel Valley, California',
          specArea: '6,800 sq m',
          specYear: '2024',
          specScope: 'Landscape Architecture, Pathways & Illumination',
          cta: 'Inquire about similar project'
        }
      },
      oakridge: {
        num: '02',
        img: 'assets/nw-proj-oakridge.jpg',
        es: {
          badge: '02',
          location: 'NAPA VALLEY • VIÑEDO',
          title: 'Oakridge Residence',
          desc: 'Un oasis de serenidad en el corazón vitivinícola de Napa Valley. Diseñado alrededor de un estanque reflectante central en piedra natural tratada, flanqueado por olivos centenarios rescatados y terrazas íntimas para contemplar los viñedos al atardecer con iluminación escenográfica.',
          specLoc: 'Napa Valley, California',
          specArea: '12,400 m²',
          specYear: '2023',
          specScope: 'Espejo de Agua, Olivos Centenarios & Master Plan',
          cta: 'Consultar proyecto similar'
        },
        en: {
          badge: '02',
          location: 'NAPA VALLEY • VINEYARD',
          title: 'Oakridge Residence',
          desc: 'A sanctuary of quiet calm situated in the heart of Napa wine country. Anchored by a bespoke limestone reflecting basin, framed by salvaged century-old olive trees, and stepped lounge terraces oriented toward the sunset over the vineyards.',
          specLoc: 'Napa Valley, California',
          specArea: '12,400 sq m',
          specYear: '2023',
          specScope: 'Water Feature, Heritage Olives & Master Plan',
          cta: 'Inquire about similar project'
        }
      },
      hillside: {
        num: '03',
        img: 'assets/nw-proj-hillside.jpg',
        es: {
          badge: '03',
          location: 'CONDADO DE MARÍN • JARDÍN EN COLINA',
          title: 'Hillside Sanctuary',
          desc: 'Intervención en una pronunciada ladera en Marin County. Mediante muros de contención de piedra local y bio-zanjas de drenaje sostenible, tallamos escalinatas suspendidas y una pérgola de madera noble con vistas panorámicas sobre la bahía.',
          specLoc: 'Marin County, California',
          specArea: '4,200 m²',
          specYear: '2024',
          specScope: 'Estabilización de Ladera, Pérgola & Flora Nativa',
          cta: 'Consultar proyecto similar'
        },
        en: {
          badge: '03',
          location: 'MARIN COUNTY • HILLSIDE GARDEN',
          title: 'Hillside Sanctuary',
          desc: 'A precision intervention across a dramatic hillside slope in Marin County. Using local dry-stack retaining stone and sustainable bio-swales, we sculpted floating illuminated stairs and an architectural timber pergola capturing panoramic bay views.',
          specLoc: 'Marin County, California',
          specArea: '4,200 sq m',
          specYear: '2024',
          specScope: 'Slope Stabilization, Pergola & Native Planting',
          cta: 'Inquire about similar project'
        }
      }
    };

    var projectKeys = ['meadow', 'oakridge', 'hillside'];
    var currentProjectIdx = 0;

    var drawer = document.getElementById('nw-drawer');
    var drawerBackdrop = document.getElementById('nw-drawer-backdrop');
    var drawerCloseBtn = document.getElementById('nw-drawer-close-btn');
    var drawerImg = document.getElementById('nw-drawer-img');
    var drawerBadge = document.getElementById('nw-drawer-badge');
    var drawerLoc = document.getElementById('nw-drawer-location');
    var drawerTitle = document.getElementById('nw-drawer-title');
    var drawerDesc = document.getElementById('nw-drawer-desc');
    var drawerSpecLoc = document.getElementById('nw-drawer-spec-loc');
    var drawerSpecArea = document.getElementById('nw-drawer-spec-area');
    var drawerSpecYear = document.getElementById('nw-drawer-spec-year');
    var drawerSpecScope = document.getElementById('nw-drawer-spec-scope');
    var drawerPrevBtn = document.getElementById('nw-drawer-prev-btn');
    var drawerNextBtn = document.getElementById('nw-drawer-next-btn');
    var drawerCtaBtn = document.getElementById('nw-drawer-cta-btn');
    var drawerCtaText = document.getElementById('nw-drawer-cta-text');

    function getCurrentLang() {
      var htmlLang = document.documentElement.lang || 'es';
      return htmlLang.indexOf('en') === 0 ? 'en' : 'es';
    }

    function renderDrawer(projKey) {
      var item = projectsData[projKey];
      if (!item) return;

      var lang = getCurrentLang();
      var data = item[lang] || item.es;

      if (drawerImg) {
        drawerImg.src = item.img;
        drawerImg.alt = data.title + ' — ' + data.location;
      }
      if (drawerBadge) drawerBadge.textContent = data.badge;
      if (drawerLoc) drawerLoc.textContent = data.location;
      if (drawerTitle) drawerTitle.textContent = data.title;
      if (drawerDesc) drawerDesc.textContent = data.desc;
      if (drawerSpecLoc) drawerSpecLoc.textContent = data.specLoc;
      if (drawerSpecArea) drawerSpecArea.textContent = data.specArea;
      if (drawerSpecYear) drawerSpecYear.textContent = data.specYear;
      if (drawerSpecScope) drawerSpecScope.textContent = data.specScope;
      if (drawerCtaText) drawerCtaText.textContent = data.cta;
      if (drawerCtaBtn) {
        drawerCtaBtn.href = lang === 'en' ? '#nw-contact-en' : '#nw-contact-es';
      }
    }

    function openDrawer(projKey) {
      var idx = projectKeys.indexOf(projKey);
      if (idx !== -1) currentProjectIdx = idx;
      renderDrawer(projectKeys[currentProjectIdx]);
      if (drawer) {
        drawer.classList.add('is-active');
        drawer.setAttribute('aria-hidden', 'false');
        if (drawerCloseBtn) drawerCloseBtn.focus();
      }
    }

    function closeDrawer() {
      if (drawer) {
        drawer.classList.remove('is-active');
        drawer.setAttribute('aria-hidden', 'true');
      }
    }

    function stepProject(dir) {
      currentProjectIdx = (currentProjectIdx + dir + projectKeys.length) % projectKeys.length;
      renderDrawer(projectKeys[currentProjectIdx]);
    }

    var cards = document.querySelectorAll('.nw-proj-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x.toFixed(1) + '%');
        card.style.setProperty('--mouse-y', y.toFixed(1) + '%');
      });

      card.addEventListener('click', function (e) {
        var projKey = card.getAttribute('data-nw-project');
        if (projKey) {
          e.preventDefault();
          openDrawer(projKey);
        }
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          var projKey = card.getAttribute('data-nw-project');
          if (projKey) {
            e.preventDefault();
            openDrawer(projKey);
          }
        }
      });
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeDrawer);
    }
    if (drawerPrevBtn) {
      drawerPrevBtn.addEventListener('click', function () { stepProject(-1); });
    }
    if (drawerNextBtn) {
      drawerNextBtn.addEventListener('click', function () { stepProject(1); });
    }
    if (drawerCtaBtn) {
      drawerCtaBtn.addEventListener('click', function () {
        closeDrawer();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!drawer || !drawer.classList.contains('is-active')) return;
      if (e.key === 'Escape') {
        closeDrawer();
      } else if (e.key === 'ArrowLeft') {
        stepProject(-1);
      } else if (e.key === 'ArrowRight') {
        stepProject(1);
      }
    });
  }

  /* ==========================================================================
     Interactive Before & After Split Slider
     ========================================================================== */
  function initBeforeAfterSlider() {
    var viewport = document.getElementById('ba-slider-viewport');
    var rangeInput = document.getElementById('ba-slider-range');
    var presetBtns = document.querySelectorAll('.ba-preset-btn');
    var dividerEl = document.getElementById('ba-slider-divider');
    if (!viewport || !rangeInput) return;

    function updateSplit(val) {
      var clamped = Math.max(2, Math.min(98, val));
      viewport.style.setProperty('--ba-split', clamped + '%');
      rangeInput.value = clamped;

      presetBtns.forEach(function (btn) {
        var presetVal = Number(btn.getAttribute('data-preset'));
        if (Math.abs(presetVal - clamped) <= 8) {
          btn.classList.add('is-active');
        } else {
          btn.classList.remove('is-active');
        }
      });
    }

    rangeInput.addEventListener('input', function () {
      updateSplit(Number(this.value));
    });

    var animFrame = null;
    function animateSplit(target) {
      if (animFrame) cancelAnimationFrame(animFrame);
      var current = parseFloat(viewport.style.getPropertyValue('--ba-split')) || Number(rangeInput.value) || 50;
      var startTime = performance.now();
      var duration = 380;

      function step(now) {
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var currentVal = current + (target - current) * ease;
        updateSplit(currentVal);
        if (progress < 1) {
          animFrame = requestAnimationFrame(step);
        }
      }
      animFrame = requestAnimationFrame(step);
    }

    presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetVal = Number(this.getAttribute('data-preset'));
        animateSplit(targetVal);
      });
    });

    var isDragging = false;
    function onPointerDown(e) {
      // Allow full user interaction with any child buttons, inputs, pills, tabs
      if (e.target.closest('button, input, select, textarea, a, .orion-level-tab, .orion-filter-pill, .orion-node-btn, .orion-nav-circle-btn, .orion-search-btn, .orion-circle-action-btn, .simple-btn, .simple-apply-btn, .simple-search-btn, .orion-salary-card, .orion-input')) {
        return;
      }
      var isDivider = e.target.closest('.ba-slider-divider, .ba-slider-handle');
      var rect = viewport.getBoundingClientRect();
      var clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      if (clientX !== null) {
        var splitPx = rect.left + (rect.width * (parseFloat(viewport.style.getPropertyValue('--ba-split')) || 50) / 100);
        var distFromSplit = Math.abs(clientX - splitPx);
        if (isDivider || distFromSplit <= 36) {
          isDragging = true;
          viewport.classList.add('is-dragging');
          moveHandle(e);
        }
      }
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      moveHandle(e);
    }

    function onPointerUp() {
      if (isDragging) {
        isDragging = false;
        viewport.classList.remove('is-dragging');
      }
    }

    function moveHandle(e) {
      var rect = viewport.getBoundingClientRect();
      var clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
      var pct = ((clientX - rect.left) / rect.width) * 100;
      updateSplit(pct);
    }

    if (dividerEl) {
      dividerEl.addEventListener('mousedown', function (e) {
        isDragging = true;
        viewport.classList.add('is-dragging');
        moveHandle(e);
      });
      dividerEl.addEventListener('touchstart', function (e) {
        isDragging = true;
        viewport.classList.add('is-dragging');
        moveHandle(e);
      }, { passive: true });
    }

    viewport.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    viewport.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  /* ==========================================================================
     Interactive ORION SPACE Mission Control Platform (Living Space Experience)
     ========================================================================== */
  function initOrionLiveApp() {
    var app = document.getElementById('orion-live-app');
    if (!app) return;

    // 1. Categories: Earth Orbit · Moon · Deep Space & Dynamic Telemetry
    var levelTabs = app.querySelectorAll('.orion-level-tab');
    var cand1 = document.getElementById('orion-cand-1');
    var cand2 = document.getElementById('orion-cand-2');
    var cand3 = document.getElementById('orion-cand-3');
    var idxVal = document.getElementById('orion-idx-val');
    var idxSup = document.getElementById('orion-idx-sup');
    var idxTrack = document.getElementById('orion-idx-track');
    var vacVal = document.getElementById('orion-vac-val');
    var vacSup = document.getElementById('orion-vac-sup');

    var categoryData = {
      earth: {
        cand1: '3 840', cand1Pct: '58%',
        cand2: '5 210', cand2Pct: '62%',
        cand3: '420', cand3Pct: '8%',
        idx: '99.2%', idxSup: 'SYNC', idxPos: '45%',
        vac: '186', vacSup: '+12'
      },
      moon: {
        cand1: '1 240', cand1Pct: '22%',
        cand2: '2 980', cand2Pct: '44%',
        cand3: '850', cand3Pct: '18%',
        idx: '98.6%', idxSup: 'RELAY', idxPos: '64%',
        vac: '94', vacSup: '+8'
      },
      deep: {
        cand1: '2 574', cand1Pct: '32%',
        cand2: '4 131', cand2Pct: '54%',
        cand3: '998', cand3Pct: '14%',
        idx: '99.8%', idxSup: 'SYNC', idxPos: '84%',
        vac: '142', vacSup: '+18'
      }
    };

    levelTabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        e.stopPropagation();
        var cat = this.getAttribute('data-level');
        if (!cat || !categoryData[cat]) return;

        levelTabs.forEach(function (t) { t.classList.remove('is-active-lime'); });
        this.classList.add('is-active-lime');

        var data = categoryData[cat];
        if (cand1) {
          cand1.textContent = data.cand1;
          if (cand1.nextElementSibling) cand1.nextElementSibling.textContent = data.cand1Pct;
        }
        if (cand2) {
          cand2.textContent = data.cand2;
          if (cand2.nextElementSibling) cand2.nextElementSibling.textContent = data.cand2Pct;
        }
        if (cand3) {
          cand3.textContent = data.cand3;
          if (cand3.nextElementSibling) cand3.nextElementSibling.textContent = data.cand3Pct;
        }
        if (idxVal) idxVal.textContent = data.idx;
        if (idxSup) idxSup.textContent = data.idxSup;
        if (idxTrack) idxTrack.style.transform = 'translateX(' + data.idxPos + ')';
        if (vacVal) vacVal.textContent = data.vac;
        if (vacSup) vacSup.textContent = data.vacSup;
      });
    });

    // 2. Filter Pills Toggle: Active · Destination · Agency · Mission Type · Upcoming
    var filterPills = app.querySelectorAll('.orion-filter-pill');
    filterPills.forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('is-active');
      });
    });

    // 3. Dynamic Carousel Navigation (01 / 153, 02 / 153, 03 / 153, 04 / 153)
    var prevBtn = document.getElementById('orion-prev-btn');
    var nextBtn = document.getElementById('orion-next-btn');
    var idxCounter = document.getElementById('orion-card-idx');
    var cardsTrack = document.getElementById('orion-cards-track');

    var missionDecks = [
      {
        idx: '01',
        cards: [
          {
            markClass: 'mark-amazon', markText: 'MR',
            title: 'Mars Recon Orbiter', company: 'Mars Orbit · Active',
            tags: ['Mars Surface', 'High-Res SAR', 'Relay Hub', 'Operational'],
            pct: '98%', label: 'Live Link', liked: true,
            dashoffset: 4
          },
          {
            markClass: 'mark-bereal', markText: 'EC',
            title: 'Europa Clipper', company: 'Outer System · In Transit',
            tags: ['Jupiter System', 'Radiation Shield', 'Autonomous', 'Cruising'],
            pct: '92%', label: 'Deep Signal', liked: false,
            dashoffset: 16
          },
          {
            markClass: 'mark-wise', markText: 'JW',
            title: 'James Webb Observatory', company: 'Lagrange L2 · Operational',
            tags: ['Infrared Array', 'Deep Field', 'Spectrometry', 'Active'],
            pct: '99%', label: 'Live Link', liked: true,
            dashoffset: 2
          }
        ]
      },
      {
        idx: '02',
        cards: [
          {
            markClass: 'mark-amazon', markText: 'SO',
            title: 'Solar Orbiter', company: 'Heliosphere · En Route',
            tags: ['Solar Physics', 'Corona Imaging', 'Thermal Shield', 'Nominal'],
            pct: '89%', label: 'Live Link', liked: false,
            dashoffset: 22
          },
          {
            markClass: 'mark-bereal', markText: 'TD',
            title: 'Titan Dragonfly', company: 'Atmospheric Probe · Staged',
            tags: ['Saturn System', 'Aviation Array', 'Surface Analysis', 'Scheduled'],
            pct: '84%', label: 'Staged Link', liked: false,
            dashoffset: 32
          },
          {
            markClass: 'mark-wise', markText: 'PS',
            title: 'Parker Solar Probe', company: 'Perihelion · Transmitting',
            tags: ['Solar Corona', 'Dust Detector', 'Record Velocity', 'Live Feed'],
            pct: '95%', label: 'Solar Signal', liked: true,
            dashoffset: 10
          }
        ]
      },
      {
        idx: '03',
        cards: [
          {
            markClass: 'mark-amazon', markText: 'LM',
            title: 'Lunar Mission', company: 'Exploration · In Progress',
            tags: ['Moon Orbit', 'Artemis III', 'Crewed', 'Telemetry Stable'],
            pct: '94%', label: 'Live Link', liked: true,
            dashoffset: 12
          },
          {
            markClass: 'mark-bereal', markText: 'OS',
            title: 'Observation Satellite', company: 'Earth Orbit · Active',
            tags: ['Low Earth Orbit', 'Sentinel-6', 'SAR Imaging', 'Real-time Feed'],
            pct: '86%', label: 'Live Link', liked: false,
            dashoffset: 28
          },
          {
            markClass: 'mark-wise', markText: 'DP',
            title: 'Deep Space Probe', company: 'Deep Space · Transmitting',
            tags: ['Kuiper Belt', 'Voyager Link', 'DSN Active', 'Interstellar'],
            pct: '91%', label: 'Deep Signal', liked: false,
            dashoffset: 18
          }
        ]
      },
      {
        idx: '04',
        cards: [
          {
            markClass: 'mark-amazon', markText: 'RL',
            title: 'Orbital Research Lab', company: 'Low Earth Orbit · Crewed',
            tags: ['Microgravity', 'Biological Array', 'EVA Active', 'Station Link'],
            pct: '97%', label: 'Live Link', liked: true,
            dashoffset: 6
          },
          {
            markClass: 'mark-bereal', markText: 'AS',
            title: 'Asteroid Sample Probe', company: 'Deep Space · Return Cruise',
            tags: ['Near Earth Object', 'Sample Capsule', 'Propulsion OK', 'Tracking'],
            pct: '93%', label: 'Deep Signal', liked: false,
            dashoffset: 14
          },
          {
            markClass: 'mark-wise', markText: 'V1',
            title: 'Interstellar Probe', company: 'Heliopause · Exploring',
            tags: ['Voyager 1', 'Interstellar Medium', 'Plasma Wave Link', 'Transmitting'],
            pct: '88%', label: 'Deep Signal', liked: true,
            dashoffset: 24
          }
        ]
      }
    ];

    var currentDeckIdx = 2; // Default 03 matching user prompt

    function renderDeck(deckIndex) {
      if (!cardsTrack) return;
      var deck = missionDecks[deckIndex];
      if (idxCounter) idxCounter.textContent = deck.idx;

      cardsTrack.classList.add('is-sliding');
      setTimeout(function () {
        cardsTrack.scrollLeft = 0;
        cardsTrack.innerHTML = deck.cards.map(function (c) {
          var tagsHtml = c.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('');
          return (
            '<article class="orion-job-card">' +
              '<div class="orion-job-top">' +
                '<div class="orion-company-mark ' + c.markClass + '">' + c.markText + '</div>' +
                '<div class="orion-job-heading">' +
                  '<h3 class="orion-job-title">' + c.title + '</h3>' +
                  '<span class="orion-job-meta">' + c.company + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="orion-job-pill-tags">' + tagsHtml + '</div>' +
              '<div class="orion-job-bottom-meta">' +
                '<button type="button" class="orion-view-mission-btn">View Mission ↗</button>' +
              '</div>' +
              '<div class="orion-compat-cluster">' +
                '<div class="orion-node-buttons">' +
                  '<button type="button" class="orion-node-btn node-link" title="Expandir">⤢</button>' +
                  '<button type="button" class="orion-node-btn node-close" title="Descartar">✕</button>' +
                  '<button type="button" class="orion-node-btn node-heart ' + (c.liked ? 'is-liked' : '') + '" title="Seguir">' + (c.liked ? '♥' : '♡') + '</button>' +
                  '<button type="button" class="orion-node-btn node-check" title="Confirmar">✓</button>' +
                '</div>' +
                '<div class="orion-gauge-wrap">' +
                  '<svg class="orion-gauge-svg" viewBox="0 0 80 80">' +
                    '<circle cx="40" cy="40" r="32" class="gauge-bg"/>' +
                    '<circle cx="40" cy="40" r="32" class="gauge-arc" style="stroke-dasharray: 201; stroke-dashoffset: ' + c.dashoffset + ';"/>' +
                  '</svg>' +
                  '<div class="orion-gauge-content">' +
                    '<span class="orion-gauge-pct">' + c.pct + '</span>' +
                    '<span class="orion-gauge-label">' + c.label + '</span>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</article>'
          );
        }).join('');
        bindCardActions();
        cardsTrack.classList.remove('is-sliding');
      }, 100);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        currentDeckIdx = (currentDeckIdx - 1 + missionDecks.length) % missionDecks.length;
        renderDeck(currentDeckIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        currentDeckIdx = (currentDeckIdx + 1) % missionDecks.length;
        renderDeck(currentDeckIdx);
      });
    }

    // 4. Card Interactive Buttons (Heart, Telemetry Confirm, Dismiss Close, View Mission)
    function bindCardActions() {
      var hearts = app.querySelectorAll('.node-heart');
      hearts.forEach(function (h) {
        h.onclick = function (e) {
          e.stopPropagation();
          var isLiked = this.classList.toggle('is-liked');
          this.textContent = isLiked ? '♥' : '♡';
        };
      });

      var checks = app.querySelectorAll('.node-check');
      checks.forEach(function (c) {
        c.onclick = function (e) {
          e.stopPropagation();
          var isApplied = this.classList.toggle('is-applied');
          this.setAttribute('title', isApplied ? 'Telemetría Confirmada ✓' : 'Confirmar');
        };
      });

      var closes = app.querySelectorAll('.node-close');
      closes.forEach(function (cl) {
        cl.onclick = function (e) {
          e.stopPropagation();
          var card = this.closest('.orion-job-card');
          if (card) card.classList.toggle('is-dismissed');
        };
      });

      var viewMissionBtns = app.querySelectorAll('.orion-view-mission-btn');
      viewMissionBtns.forEach(function (btn) {
        btn.onclick = function (e) {
          e.stopPropagation();
          var origText = this.textContent;
          this.textContent = 'Telemetry Synced ✓';
          this.style.background = '#a3e635';
          this.style.color = '#0a0e14';
          var self = this;
          setTimeout(function () {
            self.textContent = origText;
            self.style.background = '';
            self.style.color = '';
          }, 1200);
        };
      });
    }
    bindCardActions();

    // 5. Explore Button Real-time Action
    var searchBtn = app.querySelector('.orion-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var origText = this.textContent;
        this.textContent = 'Scanning...';
        this.style.background = '#a3e635';
        setTimeout(function () {
          searchBtn.textContent = '153 Missions';
          setTimeout(function () {
            searchBtn.textContent = origText;
            searchBtn.style.background = '';
          }, 1200);
        }, 400);
      });
    }

    // 6. Interactive LAUNCH ACTIVITY Hover
    var salaryCard = app.querySelector('.orion-salary-card');
    var salaryTag = app.querySelector('.orion-salary-pill-tag');
    var salaryCircle = app.querySelector('.orion-salary-svg circle');
    if (salaryCard && salaryTag && salaryCircle) {
      salaryCard.addEventListener('mousemove', function (e) {
        var rect = salaryCard.getBoundingClientRect();
        var relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        var newPct = (96.5 + relX * 3.4).toFixed(1);
        salaryTag.textContent = newPct + '%';
        salaryTag.style.left = (35 + relX * 35) + '%';
        var cx = Math.round(50 + relX * 180);
        var cy = Math.round(55 - Math.sin(relX * Math.PI) * 20);
        salaryCircle.setAttribute('cx', cx);
        salaryCircle.setAttribute('cy', cy);
      });
      salaryCard.addEventListener('mouseleave', function () {
        salaryTag.textContent = '99.4%';
        salaryTag.style.left = '52%';
        salaryCircle.setAttribute('cx', 150);
        salaryCircle.setAttribute('cy', 38);
      });
    }

    // 7. Interactive Simple Layer (Before side buttons)
    var simpleApplyBtns = document.querySelectorAll('.simple-apply-btn');
    simpleApplyBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (this.textContent === 'View Mission') {
          this.textContent = 'Loaded ✓';
          this.style.background = '#64748b';
          var self = this;
          setTimeout(function () {
            self.textContent = 'View Mission';
            self.style.background = '';
          }, 1500);
        }
      });
    });
  }

  /* ==========================================================================
     High-End Text Scramble / Decrypt Engine (Awwwards Style)
     ========================================================================== */
  function initTextScramble() {
    var chars = '0123456789ABCDEF!<>-_\\/[]{}—=+*^?#';
    var targets = document.querySelectorAll(
      '.hero-kicker, .approach-kicker, .work-kicker, .how-kicker, .section-kicker, .pricing-kicker, [data-scramble]'
    );

    targets.forEach(function (el) {
      el.classList.add('has-scramble-effect');
      var isScrambling = false;
      var frameRequest = null;

      function scramble() {
        if (isScrambling) cancelAnimationFrame(frameRequest);

        var currentText = el.innerText.trim();
        var targetText = currentText;
        if (!targetText) return;

        var length = targetText.length;
        var queue = [];

        for (var i = 0; i < length; i++) {
          var from = currentText[i] || '';
          var to = targetText[i] || '';
          var start = Math.floor(Math.random() * 5);
          var end = start + Math.floor(Math.random() * 8) + 4;
          queue.push({ from: from, to: to, start: start, end: end, char: '' });
        }

        var frame = 0;
        isScrambling = true;

        function update() {
          var output = '';
          var complete = 0;

          for (var i = 0; i < queue.length; i++) {
            var item = queue[i];
            if (item.to === ' ') {
              complete++;
              output += ' ';
            } else if (frame >= item.end) {
              complete++;
              output += item.to;
            } else if (frame >= item.start) {
              if (!item.char || Math.random() < 0.35) {
                item.char = chars[Math.floor(Math.random() * chars.length)];
              }
              output += '<span class="scramble-char">' + item.char + '</span>';
            } else {
              output += item.from;
            }
          }

          el.innerHTML = output;

          if (complete >= queue.length) {
            isScrambling = false;
            el.innerText = targetText;
          } else {
            frameRequest = requestAnimationFrame(update);
            frame++;
          }
        }

        update();
      }

      var hoverTimeout = null;
      el.addEventListener('mouseenter', function () {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(function () {
          scramble();
        }, 40);
      });

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setTimeout(function () {
                scramble();
              }, 120);
              observer.unobserve(el);
            }
          });
        }, { threshold: 0.6 });
        observer.observe(el);
      }
    });
  }

  // ==========================================================================
  // LINEAR & RAYCAST SPOTLIGHT GLOW (RADIAL LINTERNA & GLOWING BORDER)
  // ==========================================================================
  function initLinearSpotlightGlow() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // 1. Coordinated Card Groups (light spills seamlessly between adjacent cards)
    var groupConfigs = [
      {
        container: '.pricing-grid',
        cards: '.pricing-card'
      },
      {
        container: '.approach-flow',
        cards: '.approach-idea-card, .approach-experience-card'
      },
      {
        container: '.nw-bento-grid',
        cards: '.nw-bento-card'
      }
    ];

    groupConfigs.forEach(function (cfg) {
      var containers = document.querySelectorAll(cfg.container);
      containers.forEach(function (container) {
        var cards = container.querySelectorAll(cfg.cards);
        if (!cards.length) return;

        cards.forEach(function (card) {
          card.classList.add('spotlight-card');
        });

        var rafId = null;

        function onMouseMove(e) {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(function () {
            cards.forEach(function (card) {
              var rect = card.getBoundingClientRect();
              var x = e.clientX - rect.left;
              var y = e.clientY - rect.top;
              card.style.setProperty('--mouse-x', x.toFixed(1) + 'px');
              card.style.setProperty('--mouse-y', y.toFixed(1) + 'px');
              card.style.setProperty('--spotlight-opacity', '1');
            });
          });
        }

        function onMouseLeave() {
          if (rafId) cancelAnimationFrame(rafId);
          cards.forEach(function (card) {
            card.style.setProperty('--spotlight-opacity', '0');
          });
        }

        container.addEventListener('mousemove', onMouseMove, { passive: true });
        container.addEventListener('mouseleave', onMouseLeave, { passive: true });
      });
    });

    // 2. Standalone Individual Cards
    var standaloneCards = document.querySelectorAll(
      '.hero-create-card, .contact-form-card, .board-chat-card, .board-sitemap-card'
    );

    standaloneCards.forEach(function (card) {
      card.classList.add('spotlight-card');
      var rafId = null;

      function onMouseMove(e) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', x.toFixed(1) + 'px');
          card.style.setProperty('--mouse-y', y.toFixed(1) + 'px');
          card.style.setProperty('--spotlight-opacity', '1');
        });
      }

      function onMouseLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.setProperty('--spotlight-opacity', '0');
      }

      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  // ==========================================================================
  // REAL-TIME STUDIO CLOCK (GMT-6 / CENTRAL TIME)
  // ==========================================================================
  function initStudioLiveClock() {
    var clockEls = document.querySelectorAll('[data-live-clock]');
    if (!clockEls.length) return;

    function renderClock() {
      var now = new Date();
      var options = {
        timeZone: 'America/Mexico_City',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };

      try {
        var formatter = new Intl.DateTimeFormat('en-GB', options);
        var timeStr = formatter.format(now);
        var parts = timeStr.split(':');
        var shortTime = parts[0] + ':' + parts[1];

        clockEls.forEach(function (el) {
          if (el.hasAttribute('data-clock-short')) {
            el.textContent = shortTime;
          } else {
            el.textContent = timeStr;
          }
        });
      } catch (e) {
        var h = String(now.getHours()).padStart(2, '0');
        var m = String(now.getMinutes()).padStart(2, '0');
        var s = String(now.getSeconds()).padStart(2, '0');
        clockEls.forEach(function (el) {
          el.textContent = el.hasAttribute('data-clock-short') ? (h + ':' + m) : (h + ':' + m + ':' + s);
        });
      }
    }

    renderClock();
    setInterval(renderClock, 1000);
  }

  initTextScramble();
  initBeforeAfterSlider();
  initOrionLiveApp();
  initNorthwoodCapabilities();
  initNorthwoodProjects();
  initLinearSpotlightGlow();
  initStudioLiveClock();
})();





