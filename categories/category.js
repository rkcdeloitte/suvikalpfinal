/* ─────────────────────────────────────────────────────────────────────────────
   category.js  —  Shared JS for all Suvikalp category pages
   Injected by _template.html → used by every generated category page
   ───────────────────────────────────────────────────────────────────────────── */
'use strict';

/* ── Slideshow ──────────────────────────────────────────── */
let projIdx = 0;
let projTimer = null;
const PROJ_TOTAL = 4;

function projGoTo(n) {
  const slides = document.querySelectorAll('.proj-slide');
  const dots   = document.querySelectorAll('.proj-ss-dot');
  const ctr    = document.getElementById('projCurrent');
  slides[projIdx].classList.remove('active');
  if (dots[projIdx]) dots[projIdx].classList.remove('active');
  projIdx = (n + PROJ_TOTAL) % PROJ_TOTAL;
  slides[projIdx].classList.add('active');
  if (dots[projIdx]) dots[projIdx].classList.add('active');
  if (ctr) ctr.textContent = projIdx + 1;
}

function projSlide(dir) { projGoTo(projIdx + dir); resetProjTimer(); }

function resetProjTimer() {
  clearInterval(projTimer);
  projTimer = setInterval(() => projGoTo(projIdx + 1), 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  resetProjTimer();
  const ss = document.getElementById('projSlideshow');
  if (ss) {
    ss.addEventListener('mouseenter', () => clearInterval(projTimer));
    ss.addEventListener('mouseleave', resetProjTimer);
  }
});

/* ── Schemes ticker ─────────────────────────────────────── */
(function(){
  var ticker = document.getElementById('schemesTicker');
  if (!ticker) return;
  var SPEED = 0.6;
  var CARD_W = 236;
  var paused = false;
  var manualPauseTimer;
  function halfWidth() { return ticker.scrollWidth / 2; }
  function tick() {
    if (!paused) {
      ticker.scrollLeft += SPEED;
      if (ticker.scrollLeft >= halfWidth()) ticker.scrollLeft -= halfWidth();
    }
    requestAnimationFrame(tick);
  }
  window.schemesNav = function(dir) {
    clearTimeout(manualPauseTimer);
    paused = true;
    var target = ticker.scrollLeft + dir * CARD_W;
    var half = halfWidth();
    if (target < 0) target += half;
    if (target >= half) target -= half;
    ticker.scrollTo({ left: target, behavior: 'smooth' });
    manualPauseTimer = setTimeout(function(){ paused = false; }, 3500);
  };
  ticker.addEventListener('mouseenter', function(){ clearTimeout(manualPauseTimer); paused = true; });
  ticker.addEventListener('mouseleave', function(){ paused = false; });
  requestAnimationFrame(tick);
})();

/* ── Tab navigation ─────────────────────────────────────── */
function showSPVTab(tabId, skipScroll) {
  const nav  = document.querySelector('.spv-tabs');
  const page = document.querySelector('.page');

  /* 1. Lock page height BEFORE the panel switch so a shorter panel
        cannot shrink the document and force the browser to snap scrollY
        back toward 0 (which would re-expose the hero banner).          */
  if (page) page.style.minHeight = page.offsetHeight + 'px';

  /* 2. Capture the scroll target BEFORE switching panels so the
        nav's getBoundingClientRect() still reflects the current layout. */
  let scrollTarget = -1;
  if (!skipScroll && nav) {
    const stickyOffset = parseInt(getComputedStyle(nav).top) || 70;
    const navTop = nav.getBoundingClientRect().top + window.scrollY;
    scrollTarget = Math.max(0, navTop - stickyOffset);
  }

  /* 3. Switch panels */
  document.querySelectorAll('.spv-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.spv-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('spv-panel-' + tabId);
  const tab   = document.querySelector('.spv-tab[data-tab="' + tabId + '"]');
  if (panel) panel.style.display = 'block';
  if (tab)   tab.classList.add('active');
  if (tabId === 'prism') {
    // Disable CSS animation first — animation-fill-mode:both holds opacity:0 and overrides inline styles
    document.querySelectorAll('#spv-panel-prism .pr-nav-item').forEach(el => {
      el.style.animation = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    prism2Show(PRISM2_ORDER[prism2Current] || 'P');
    if (typeof prNav === 'function') prNav(PRISM2_ORDER[prism2Current] || 'P');
  }
  if (tabId === 'casestudies') triggerStepsReveal();

  /* 4. Scroll to pre-calculated target (skip on first page load) */
  if (scrollTarget >= 0) {
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  }

  /* 5. Release height lock after scroll animation completes */
  setTimeout(() => { if (page) page.style.minHeight = ''; }, 600);
}

function triggerStepsReveal() {
  const els = document.querySelectorAll('.section-steps .reveal:not(.visible)');
  els.forEach((el, i) => { setTimeout(() => el.classList.add('visible'), i * 100); });
}

/* ── PRISM2 Navigation ──────────────────────────────────── */
const PRISM2_ORDER = ['P','R','I','S','M'];
/* PRISM2_COLORS and PRISM2_BG are injected per-page via inline <script> before this file */
let prism2Current = 0;

function prism2Show(key) {
  const idx = PRISM2_ORDER.indexOf(key);
  if (idx === -1) return;
  prism2Current = idx;
  PRISM2_ORDER.forEach(function(k) {
    const pill = document.getElementById('prism2-card-' + k);
    if (!pill) return;
    pill.classList.toggle('active', k === key);
    pill.style.borderColor = '';
    pill.style.background  = '';
  });
  document.querySelectorAll('.prism2-content-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('prism2-panel-' + key);
  if (panel) panel.classList.add('active');
}

function prism2Next() {
  if (prism2Current < PRISM2_ORDER.length - 1) {
    const key = PRISM2_ORDER[prism2Current + 1];
    if (typeof prNav === 'function') prNav(key); else prism2Show(key);
  }
}
function prism2Prev() {
  if (prism2Current > 0) {
    const key = PRISM2_ORDER[prism2Current - 1];
    if (typeof prNav === 'function') prNav(key); else prism2Show(key);
  }
}

/* ── VIBGYOR ────────────────────────────────────────────── */
const VIBGYOR_ORDER  = ['V','I','B','G','Y','O','R'];
const VIBGYOR_COLORS = {V:'#7C3AB5',I:'#1A56CC',B:'#1D9E75',G:'#3B6D11',Y:'#BA7517',O:'#C85000',R:'#A32D2D'};
let vibgyorCurrent = 0;

function showVibgyorPanel(letter) {
  const idx = VIBGYOR_ORDER.indexOf(letter);
  if (idx === -1) return;
  vibgyorCurrent = idx;
  document.querySelectorAll('.vibgyor-step').forEach((s, i) => {
    s.classList.toggle('done',   i < idx);
    s.classList.toggle('active', i === idx);
  });
  document.querySelectorAll('.vibgyor-panel').forEach(p =>
    p.classList.toggle('active', p.dataset.pillar === letter)
  );
  const pct  = (idx / (VIBGYOR_ORDER.length - 1)) * 100;
  const fill = document.getElementById('vibgyor-progress');
  if (fill) { fill.style.width = pct + '%'; fill.style.background = VIBGYOR_COLORS[letter]; }
}

function vibgyorNext() { if (vibgyorCurrent < VIBGYOR_ORDER.length - 1) showVibgyorPanel(VIBGYOR_ORDER[vibgyorCurrent + 1]); }
function vibgyorPrev() { if (vibgyorCurrent > 0) showVibgyorPanel(VIBGYOR_ORDER[vibgyorCurrent - 1]); }

/* ── Accordion ──────────────────────────────────────────── */
function toggleAccordion(btn) {
  const item   = btn.closest('.accordion-item');
  const body   = item ? item.querySelector('.accordion-body') : btn.nextElementSibling;
  if (!body) return;
  const isOpen = body.style.display === 'block';
  const parent = btn.closest('.prism2-content-panel, .vibgyor-panel, .spv-panel');
  if (parent) {
    parent.querySelectorAll('.accordion-body').forEach(b => b.style.display = 'none');
    parent.querySelectorAll('.accordion-btn').forEach(b => b.classList.remove('open'));
  }
  if (!isOpen) {
    body.style.display = 'block';
    btn.classList.add('open');
    /* Scroll button into view if it is behind a sticky header */
    requestAnimationFrame(function() {
      const rect = btn.getBoundingClientRect();
      if (rect.top < 185) {
        window.scrollBy({ top: rect.top - 185, behavior: 'smooth' });
      }
    });
  }
}

/* ── Case study sub-tabs ────────────────────────────────── */
function showCaseTab(tab, btn) {
  document.querySelectorAll('.cs-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.cs-subtab').forEach(b => b.classList.remove('active'));
  document.getElementById('cs-' + tab).style.display = 'block';
  btn.classList.add('active');
}

/* ── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showSPVTab('about', true); /* skipScroll=true: hero banner visible on first load */
  prism2Show('P');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseFloat(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = i * 100;
    revealObs.observe(el);
  });
});

/* ── Tender v6 filter & search ──────────────────────────── */
(function(){
  var activeFilter = 'all', searchQuery = '';
  function t5Render(){
    var sections = document.querySelectorAll('#spv-panel-tender .t5-section');
    var vis = 0;
    sections.forEach(function(sec){
      var secKey = sec.getAttribute('data-sec');
      var showSec = (activeFilter === 'all' || activeFilter === secKey);
      var secVis = 0;
      sec.querySelectorAll('.t5-row').forEach(function(row){
        var titleMatch = !searchQuery || (row.getAttribute('data-title') || '').indexOf(searchQuery) !== -1;
        var show = showSec && titleMatch;
        row.style.display = show ? '' : 'none';
        if(show){ secVis++; vis++; }
      });
      sec.style.display = secVis > 0 ? '' : 'none';
    });
    var counter = document.getElementById('t5Counter');
    if(counter) counter.textContent = vis + ' document' + (vis === 1 ? '' : 's');
    var empty = document.getElementById('t5Empty');
    if(empty) empty.style.display = vis === 0 ? '' : 'none';
  }
  window.t5Filter = function(type){
    activeFilter = type;
    document.querySelectorAll('#spv-panel-tender .t5-pill').forEach(function(p){
      var m = (p.getAttribute('onclick') || '').match(/t5Filter\('?(\w+)'?\)/);
      if(m) p.classList.toggle('active', m[1] === type);
    });
    t5Render();
  };
  window.t5Search = function(val){ searchQuery = val.trim().toLowerCase(); t5Render(); };
  document.addEventListener('DOMContentLoaded', function(){ t5Render(); });
})();

/* ── Literature carousel ────────────────────────────────── */
(function(){
  function initCarousel(sfx){
    var track = document.getElementById('litTrack-' + sfx);
    if(!track) return;
    var dots  = document.getElementById('litDots-' + sfx);
    var prev  = document.getElementById('litPrev-' + sfx);
    var next  = document.getElementById('litNext-' + sfx);
    var current = 0;
    function getVis(){
      var w = track.parentElement ? track.parentElement.offsetWidth : 800;
      if(w < 420) return 1;
      if(w < 660) return 2;
      if(w < 920) return 3;
      return 4;
    }
    function cards(){ return Array.from(track.children); }
    function buildDots(){
      if(!dots) return;
      dots.innerHTML = '';
      var pages = Math.ceil(cards().length / getVis());
      for(var i = 0; i < pages; i++){
        var d = document.createElement('button');
        d.className = 'lit-dot' + (i === current ? ' active' : '');
        d.setAttribute('aria-label', 'Page ' + (i+1));
        (function(idx){ d.onclick = function(){ goTo(idx); }; })(i);
        dots.appendChild(d);
      }
    }
    var nav = prev ? prev.closest('.lit-nav') : (next ? next.closest('.lit-nav') : null);
    function goTo(page){
      var vis = getVis();
      var total = cards().length;
      var pages = Math.ceil(total / vis);
      current = Math.max(0, Math.min(page, pages - 1));

      // Single-page mode: center cards, hide nav, no transform
      if(pages <= 1){
        track.classList.add('lit-centered');
        track.dataset.count = total;
        track.style.transform = '';
        if(nav) nav.style.display = 'none';
        return;
      }

      // Multi-page mode: normal paginated carousel
      track.classList.remove('lit-centered');
      delete track.dataset.count;
      if(nav) nav.style.display = '';
      var cardList = cards();
      var w = cardList.length ? (cardList[0].offsetWidth + 18) : 0;
      track.style.transform = 'translateX(-' + (current * vis * w) + 'px)';
      if(dots) Array.from(dots.children).forEach(function(d,i){ d.classList.toggle('active', i === current); });
      if(prev) prev.disabled = (current === 0);
      if(next) next.disabled = (current >= pages - 1);
    }
    window.litMove = function(s, dir){ if(s === sfx) goTo(current + dir); };
    buildDots(); goTo(0);
    window.addEventListener('resize', function(){ buildDots(); goTo(current); });
  }
  document.addEventListener('DOMContentLoaded', function(){ initCarousel('all'); });
})();
