/**
 * load-header.js — Med Arb International
 * ========================================
 * 1. Fetches header.html and injects it into #medarb-header
 * 2. Wires up:
 *    - Animated hamburger ↔ X toggle
 *    - Smooth mobile menu slide open/close
 *    - Close on outside click, ESC key, resize, and link click
 *    - Scroll-shadow enhancement on nav bar
 *    - Active link highlighting based on current URL
 * ========================================
 */

(function () {
  'use strict';

  /* ── 1. FETCH & INJECT ──────────────────────────── */
  fetch('header.html')
    .then(function (res) {
      if (!res.ok) throw new Error('header.html not found');
      return res.text();
    })
    .then(function (html) {
      var container = document.getElementById('medarb-header');
      if (!container) {
        console.error('load-header.js: #medarb-header element not found.');
        return;
      }
      container.innerHTML = html;

      /* After injection, run all init functions */
      initScrollShadow();
      initActiveLink();
      initMobileMenu();
    })
    .catch(function (err) {
      console.error('load-header.js: Failed to load header —', err);
      var container = document.getElementById('medarb-header');
      if (container) {
        container.innerHTML =
          '<div style="background:#0A2540;color:#fff;padding:1rem 2rem;font-family:sans-serif;font-size:0.85rem;">' +
          'Med Arb International — Navigation unavailable' +
          '</div>';
      }
    });


  /* ── 2. SCROLL SHADOW ───────────────────────────── */
  function initScrollShadow() {
    var nav = document.getElementById('medarb-nav');
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load in case page is already scrolled
  }


  /* ── 3. ACTIVE LINK ─────────────────────────────── */
  function initActiveLink() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    /* Desktop links */
    var desktopLinks = document.querySelectorAll('.nav-links a');
    desktopLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.split('/').pop() === currentPage) {
        link.classList.add('active');
      }
    });

    /* Mobile links */
    var mobileLinks = document.querySelectorAll('.nav-mobile-menu a');
    mobileLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.split('/').pop() === currentPage) {
        link.style.color = '#a8841e';
        link.style.fontWeight = '600';
      }
    });
  }


  /* ── 4. MOBILE MENU ─────────────────────────────── */
  function initMobileMenu() {
    var btn  = document.getElementById('navHamburger');
    var menu = document.getElementById('navMobileMenu');
    if (!btn || !menu) {
      console.warn('load-header.js: Hamburger or mobile menu not found.');
      return;
    }

    var isOpen = false;

    function openMenu() {
      isOpen = true;
      menu.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Close menu');
    }

    function closeMenu() {
      isOpen = false;
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
    }

    /* Toggle on hamburger click */
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      isOpen ? closeMenu() : openMenu();
    });

    /* Close when any nav link inside mobile menu is clicked */
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    /* Close on ESC key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    /* Close when clicking outside the menu/button */
    document.addEventListener('click', function (e) {
      if (!isOpen) return;
      var nav = document.getElementById('medarb-nav');
      if (nav && !nav.contains(e.target)) closeMenu();
    });

    /* Close and hide desktop-only state on resize to desktop */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && isOpen) closeMenu();
    });
  }

})();
