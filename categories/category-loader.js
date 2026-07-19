/* ─────────────────────────────────────────────────────────────────────────────
   category-loader.js  —  Reads window.CAT_DATA and populates category-template
   Must be loaded AFTER the data file (e.g. data/ecopark.js) and category.js
   ───────────────────────────────────────────────────────────────────────────── */
'use strict';

(function () {
  var D = window.CAT_DATA;
  if (!D) { console.error('CAT_DATA not defined'); return; }

  /* ── Helpers ─────────────────────────────────────────────── */
  function el(id) { return document.getElementById(id); }
  function setHTML(id, html) { var e = el(id); if (e) e.innerHTML = html; }
  function setText(id, txt)  { var e = el(id); if (e) e.textContent = txt; }

  /* ── Hero ────────────────────────────────────────────────── */
  function populateHero() {
    var heroImg   = document.querySelector('.spv-hero-img');
    var heroTitle = document.querySelector('.spv-hero-title');
    if (heroImg)   { heroImg.src = D.heroImg; heroImg.alt = D.title; }
    if (heroTitle) heroTitle.innerHTML = D.title;

    // Page <title>
    var stripped = D.title.replace(/&amp;/g, '&').replace(/&/g, '&');
    document.title = stripped + ' — SUVIKALP | CCO';

    // Breadcrumb
    var bc = document.querySelector('.sf-breadcrumb span:last-child');
    if (bc) bc.innerHTML = D.title;
  }

  /* ── About Tab ───────────────────────────────────────────── */
  function populateAbout() {
    // Label
    var labelEl = document.querySelector('.about-hero-label');
    if (labelEl) labelEl.innerHTML = D.aboutLabel || 'Mine Repurposing Category';

    // Primary / Secondary text
    var primary   = document.querySelector('.about-intro-primary p');
    var secondary = document.querySelector('.about-intro-secondary p');
    if (primary)   primary.innerHTML   = D.aboutPrimary   || '';
    if (secondary) secondary.innerHTML = D.aboutSecondary || '';

    // Schemes ticker
    var ticker = el('schemesTicker');
    if (ticker && D.schemes && D.schemes.length) {
      var cards = D.schemes.map(function(s) {
        return '<div class="scheme-card">' +
          '<div class="scheme-card-icon">' + (s.icon || '') + '</div>' +
          '<div class="scheme-card-tag">'  + (s.tag  || '') + '</div>' +
          '<div class="scheme-card-title">' + (s.title || '') + '</div>' +
          '<div class="scheme-card-desc">'  + (s.desc  || '') + '</div>' +
          '</div>';
      }).join('');
      // duplicate set for seamless loop (aria-hidden)
      var dups = D.schemes.map(function(s) {
        return '<div class="scheme-card" aria-hidden="true">' +
          '<div class="scheme-card-icon">' + (s.icon || '') + '</div>' +
          '<div class="scheme-card-tag">'  + (s.tag  || '') + '</div>' +
          '<div class="scheme-card-title">' + (s.title || '') + '</div>' +
          '<div class="scheme-card-desc">'  + (s.desc  || '') + '</div>' +
          '</div>';
      }).join('');
      ticker.innerHTML = cards + dups;
    }
  }

  /* ── PRISM Tab ───────────────────────────────────────────── */
  var PRISM_COLORS = { P:'#C85000', R:'#1a5ca8', I:'#b06a10', S:'#5a3d9e', M:'#1a7a5e' };
  var PRISM_BG     = { P:'#fff0e6', R:'#e4eef9', I:'#faedda', S:'#edeaf8', M:'#e1f3ec' };
  var PRISM_CB     = { P:'#fff8f3', R:'#f3f7fd', I:'#fdf7f0', S:'#f7f5fd', M:'#f1faf6' };
  var PRISM_NAMES  = { P:'Post-mining', R:'Repurposing', I:'Investment', S:'Strategy',   M:'Management' };

  function buildAccordions(list) {
    if (!list || !list.length) return '';
    return list.map(function(item) {
      return '<div class="accordion-item">' +
        '<button class="accordion-btn" onclick="toggleAccordion(this)">' +
        '<span>' + (item.q || '') + '</span>' +
        '<span class="accordion-chevron">&#8964;</span>' +
        '</button>' +
        '<div class="accordion-body" style="display:none;">' + (item.a || '') + '</div>' +
        '</div>';
    }).join('');
  }

  function populatePrism() {
    var order = ['P','R','I','S','M'];

    // Pills
    var pillsRow = document.querySelector('.prism2-pills-row');
    if (pillsRow) {
      pillsRow.innerHTML = order.map(function(k, i) {
        return '<div class="prism2-pill' + (i === 0 ? ' active' : '') + '" ' +
          'id="prism2-card-' + k + '" ' +
          'onclick="prism2Show(\'' + k + '\')" ' +
          'style="--pc:' + PRISM_COLORS[k] + ';--pb:' + PRISM_BG[k] + ';">' +
          '<div class="prism2-pill-letter">' + k + '</div>' +
          '<div class="prism2-pill-name">'   + PRISM_NAMES[k] + '</div>' +
          '</div>';
      }).join('');
    }

    // Panels
    var wrap = document.querySelector('.prism2-wrap');
    if (!wrap) return;

    // Remove existing panels (keep pills row)
    wrap.querySelectorAll('.prism2-content-panel').forEach(function(p){ p.remove(); });

    order.forEach(function(k, idx) {
      var pd = D.prism && D.prism[k];
      if (!pd) return;

      var isFirst = (idx === 0);
      var isLast  = (idx === order.length - 1);

      var panel = document.createElement('div');
      panel.className = 'prism2-content-panel' + (isFirst ? ' active' : '');
      panel.id = 'prism2-panel-' + k;
      panel.style.cssText = '--pc:' + PRISM_COLORS[k] + ';--pb:' + PRISM_BG[k] + ';--cb:' + PRISM_CB[k] + ';';

      panel.innerHTML =
        '<div class="prism2-panel-header">' +
          '<div class="prism2-panel-header-letter">' + k + '</div>' +
          '<div class="prism2-panel-header-text">' +
            '<div class="prism2-panel-title">' + pd.title + '</div>' +
            '<p class="prism2-panel-desc">' + pd.desc + '</p>' +
          '</div>' +
        '</div>' +
        buildAccordions(pd.accordions) +
        '<div class="prism2-nav-row">' +
          '<button class="prism2-btn-prev" id="prism2-prev-' + k + '" onclick="prism2Prev()"' +
            (isFirst ? ' disabled' : '') + '>&#8592; Previous</button>' +
          '<button class="prism2-btn-next" id="prism2-next-' + k + '" onclick="prism2Next()"' +
            (isLast  ? ' disabled' : '') + '>' +
            (isLast  ? 'Framework complete' : 'Next pillar &#8594;') +
          '</button>' +
        '</div>';

      wrap.appendChild(panel);
    });
  }

  /* ── Case Studies Tab ────────────────────────────────────── */
  function populateCaseStudies() {
    var track = el('litTrack-all');
    if (!track || !D.casestudies || !D.casestudies.length) return;

    track.innerHTML = D.casestudies.map(function(cs) {
      return '<a class="lit-card" href="' + (cs.url || '#') + '" target="_blank" rel="noopener noreferrer" ' +
        'style="--lit-accent:' + cs.accent + ';--lit-glow:' + cs.glow + ';--lit-tint:' + cs.tint + ';">' +
        '<div class="lit-card-body">' +
          '<div class="lit-card-title">' + cs.title + '</div>' +
          '<div class="lit-card-meta">' +
            '<div class="lit-card-type"><span>' + cs.type + '</span></div>' +
            '<div class="lit-card-source">Source: <span>' + cs.source + '</span></div>' +
          '</div>' +
          '<div class="lit-card-desc">' + cs.desc + '</div>' +
        '</div>' +
        '<div class="lit-card-footer">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' +
          '<polyline points="14 2 14 8 20 8"/></svg> View' +
        '</div>' +
      '</a>';
    }).join('');
  }

  /* ── Run on DOMContentLoaded ─────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    populateHero();
    populateAbout();
    populatePrism();
    populateCaseStudies();
    // Re-initialise carousel after cards are injected
    // category.js initCarousel runs on its own DOMContentLoaded — but since
    // we inject cards in the same event loop tick, carousel is built empty.
    // We fire litMove rebuild via a micro-task so DOM is settled.
    setTimeout(function(){
      var evt = new Event('resize');
      window.dispatchEvent(evt);
    }, 50);
  });

})();
