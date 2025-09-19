// Reusable collapse/expand helpers for headers and collapsible sections
(function () {
  'use strict';

  function safeQuery(root, selector) {
    try { return (root || document).querySelectorAll(selector); } catch (e) { return []; }
  }

  function findTargetSection(header) {
    // Prefer explicit data-target
    var dt = header.getAttribute && header.getAttribute('data-target');
    if (dt) {
      return document.getElementById(dt) || document.querySelector(dt);
    }
    // fallback: id-based convention: replace -header with -collapsible-section
    if (header.id && header.id.indexOf('-header') !== -1) {
      var candidate = header.id.replace(/-header$/, '-collapsible-section');
      var el = document.getElementById(candidate);
      if (el) return el;
    }
    // fallback: next sibling with class 'collapsible-section'
    var sib = header.nextElementSibling;
    while (sib) {
      if (sib.classList && sib.classList.contains('collapsible-section')) return sib;
      sib = sib.nextElementSibling;
    }
    return null;
  }

  function makeClickable(header) {
    try {
      header.style.cursor = 'pointer';
      header.setAttribute('role', header.getAttribute('role') || 'button');
    } catch (e) {}
  }

  function attach(header, section) {
    if (!header || !section) return;
    makeClickable(header);
    header.addEventListener('click', function () {
      var collapsed = header.classList.toggle('collapsed');
      section.style.display = collapsed ? 'none' : '';
    }, true);
  }

  function init(root) {
    root = root || document;
    // find all headers with class collapse-section-header
    var headers = safeQuery(root, '.collapse-section-header');
    Array.prototype.forEach.call(headers, function (header) {
      var section = findTargetSection(header);
      attach(header, section);
    });
  }

  // expose
  window.collapseSections = window.collapseSections || {};
  window.collapseSections.init = init;

})();
