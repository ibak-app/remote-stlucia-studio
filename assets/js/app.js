/* ============================================================
   REMOTE.STLUCIA.STUDIO — Core App JS
   Accordion, hamburger, sidebar scroll-spy, smooth scroll
   ============================================================ */

'use strict';

/* ── Accordion ────────────────────────────────────────────── */
function initAccordions() {
  var triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var body = this.nextElementSibling;
      var isOpen = body.classList.contains('open');

      // Close all in same accordion group
      var parent = this.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion-body.open').forEach(function(b) {
          b.classList.remove('open');
        });
        parent.querySelectorAll('.accordion-trigger.active').forEach(function(t) {
          t.classList.remove('active');
        });
      }

      if (!isOpen) {
        body.classList.add('open');
        this.classList.add('active');
      }
    });
  });

  // Open first accordion item by default if any
  document.querySelectorAll('.accordion').forEach(function(acc) {
    var firstTrigger = acc.querySelector('.accordion-trigger');
    var firstBody = acc.querySelector('.accordion-body');
    if (firstTrigger && firstBody && !firstBody.classList.contains('open')) {
      firstBody.classList.add('open');
      firstTrigger.classList.add('active');
    }
  });
}

/* ── Hamburger Menu ───────────────────────────────────────── */
function initHamburger() {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function() {
    var isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── Sidebar Scroll-Spy ───────────────────────────────────── */
function initScrollSpy() {
  var sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
  if (!sidebarLinks.length) return;

  var sections = [];
  sidebarLinks.forEach(function(link) {
    var id = link.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: link });
  });

  if (!sections.length) return;

  var ticking = false;
  var offset = 120;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var scrollY = window.scrollY;
        var current = sections[0];

        sections.forEach(function(s) {
          if (s.el.offsetTop - offset <= scrollY) {
            current = s;
          }
        });

        sidebarLinks.forEach(function(link) {
          link.classList.remove('active');
        });
        if (current) current.link.classList.add('active');

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Smooth Scroll ────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = 108;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
}

/* ── Active Nav Link ──────────────────────────────────────── */
function initActiveNav() {
  var path = window.location.pathname;
  var filename = path.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var linkFile = href.split('/').pop();
    if (
      linkFile === filename ||
      (filename === '' && linkFile === 'index.html') ||
      (filename === 'index.html' && href === './')
    ) {
      link.classList.add('active');
    }
  });
}

/* ── Rating Bars Animation ────────────────────────────────── */
function initRatingBars() {
  var bars = document.querySelectorAll('.rating-bar__fill[data-pct]');
  if (!bars.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var bar = entry.target;
        bar.style.width = bar.dataset.pct + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(function(bar) {
    bar.style.width = '0%';
    bar.style.transition = 'width 1.2s cubic-bezier(.4,0,.2,1)';
    observer.observe(bar);
  });
}

/* ── Back to Top ──────────────────────────────────────────── */
function initBackToTop() {
  var btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.textContent = '\u2191';
  btn.title = 'Back to top';
  btn.style.cssText = [
    'position:fixed', 'bottom:20px', 'right:20px', 'z-index:800',
    'width:40px', 'height:40px', 'border-radius:50%',
    'background:var(--teal)', 'color:#fff', 'border:none',
    'cursor:pointer', 'font-size:18px', 'font-weight:700',
    'display:none', 'align-items:center', 'justify-content:center',
    'box-shadow:0 4px 12px rgba(0,0,0,.2)',
    'transition:all .2s ease', 'font-family:var(--font)'
  ].join(';');

  document.body.appendChild(btn);

  window.addEventListener('scroll', function() {
    btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
  }, { passive: true });

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Init All ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initAccordions();
  initHamburger();
  initScrollSpy();
  initSmoothScroll();
  initActiveNav();
  initRatingBars();
  initBackToTop();
});
