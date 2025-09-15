// Form helper utilities: required asterisks + click-to-toggle tooltips for .info
(function () {
  'use strict';

  // --- Required asterisks ---
  function addAsterisks(root) {
    root = root || document;
    try {
      var selectors = 'input[required], select[required], textarea[required]';
      var els = root.querySelectorAll(selectors);
      els.forEach(function (el) {
        var id = el.id;
        var label = id ? document.querySelector('label[for="' + id + '"]') : null;
        if (!label) {
          var parent = el.parentElement;
          while (parent && parent !== document.body) {
            if (parent.tagName && parent.tagName.toLowerCase() === 'label') {
              label = parent;
              break;
            }
            parent = parent.parentElement;
          }
        }
        if (!label) return;
        if (label.querySelector('.required-asterisk')) return;
        var span = document.createElement('span');
        span.className = 'required-asterisk';
        span.textContent = '*';
        label.insertBefore(span, label.firstChild);
      });
    } catch (e) {
      console.error('form-helpers addAsterisks error:', e);
    }
  }

  // --- Info tooltip behavior ---
  // Transforms <a class="info" title="..."> into a click-toggle tooltip.
  function initInfoTooltips(root) {
    root = root || document;
    try {
      var infos = Array.prototype.slice.call(root.querySelectorAll('a.info'));
      infos.forEach(function (el, i) {
        // Ensure it's focusable and has role
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', el.getAttribute('tabindex') || '0');

        var content = el.getAttribute('title') || el.getAttribute('data-title') || '';
        if (!content) return;

        // Remove default title to avoid native tooltip
        el.removeAttribute('title');

        // Create tooltip element
        var tip = document.createElement('div');
        tip.className = 'info-tooltip';
        tip.setAttribute('role', 'tooltip');
        var tipId = 'info-tooltip-' + (el.id || ('fh' + i));
        tip.id = tipId;
        tip.textContent = content;
        tip.style.position = 'absolute';
        tip.style.zIndex = 10000;
        tip.style.background = 'rgba(0,0,0,0.9)';
        tip.style.color = 'white';
        tip.style.padding = '6px 8px';
        tip.style.borderRadius = '4px';
        tip.style.fontSize = '13px';
        tip.style.maxWidth = '260px';
        tip.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        tip.style.display = 'none';

        // Associate aria
        el.setAttribute('aria-haspopup', 'true');
        el.setAttribute('aria-expanded', 'false');
        el.setAttribute('aria-controls', tipId);

        // Insert into DOM
        document.body.appendChild(tip);

        function positionTip() {
          var rect = el.getBoundingClientRect();
          var scrollY = window.scrollY || window.pageYOffset;
          var scrollX = window.scrollX || window.pageXOffset;
          // Place above by default, otherwise below
          var top = rect.top + scrollY - tip.offsetHeight - 8;
          if (top < scrollY + 8) {
            top = rect.bottom + scrollY + 8;
          }
          var left = rect.left + scrollX + (rect.width / 2) - (tip.offsetWidth / 2);
          left = Math.max(scrollX + 8, Math.min(left, scrollX + document.documentElement.clientWidth - tip.offsetWidth - 8));
          tip.style.top = top + 'px';
          tip.style.left = left + 'px';
        }

        function openTip(e) {
          positionTip();
          tip.style.display = 'block';
          el.setAttribute('aria-expanded', 'true');
          // focus the tooltip for screen readers
          tip.setAttribute('tabindex', '-1');
          tip.focus && tip.focus();
          // register outside click handler
          document.addEventListener('click', onDocClick, true);
          document.addEventListener('keydown', onKeyDown, true);
        }

        function closeTip() {
          tip.style.display = 'none';
          el.setAttribute('aria-expanded', 'false');
          document.removeEventListener('click', onDocClick, true);
          document.removeEventListener('keydown', onKeyDown, true);
        }

        function toggleTip() {
          if (tip.style.display === 'none' || tip.style.display === '') openTip(); else closeTip();
        }

        function onDocClick(e) {
          if (e.target === el || el.contains(e.target) || e.target === tip || tip.contains(e.target)) return;
          closeTip();
        }

        function onKeyDown(e) {
          if (e.key === 'Escape' || e.key === 'Esc') {
            closeTip();
            el.focus && el.focus();
          }
          if (e.key === 'Enter' || e.key === ' ' ) {
            e.preventDefault();
            toggleTip();
          }
        }

        el.addEventListener('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          toggleTip();
        });
        el.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            toggleTip();
          }
        });

        // Reposition on resize/scroll when open
        window.addEventListener('resize', function () { if (tip.style.display !== 'none') positionTip(); });
        window.addEventListener('scroll', function () { if (tip.style.display !== 'none') positionTip(); }, true);
      });
    } catch (e) {
      console.error('form-helpers initInfoTooltips error:', e);
    }
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      addAsterisks(document);
      initInfoTooltips(document);
    });
  } else {
    addAsterisks(document);
    initInfoTooltips(document);
  }

  // Expose functions for dynamic content
  window.formHelpers = {
    addAsterisks: addAsterisks,
    initInfoTooltips: initInfoTooltips
  };

})();
