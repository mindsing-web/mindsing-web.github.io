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
      console.error('form__helpers addAsterisks error:', e);
    }
  }

  // --- Info tooltip behavior ---
  // Transforms <a class="info" title="..."> into a click-toggle tooltip.
  function initInfoTooltips(root) {
    root = root || document;
    try {
      var DEFAULT_OFFSET = 20; // px distance from trigger to tooltip
      var infos = Array.prototype.slice.call(root.querySelectorAll('a.info'));
      infos.forEach(function (el, i) {
        // Ensure it's focusable and has role
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', el.getAttribute('tabindex') || '0');

        var content = el.getAttribute('title') || el.getAttribute('data-title') || '';
        if (!content) return;

        // Remove default title to avoid native tooltip
        el.removeAttribute('title');

        // Per-element offset override (data-tooltip-offset="16")
        var OFFSET = parseInt(el.getAttribute('data-tooltip-offset'), 10) || DEFAULT_OFFSET;

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
          var top = rect.top + scrollY - tip.offsetHeight - OFFSET;
          if (top < scrollY + OFFSET) {
            top = rect.bottom + scrollY + OFFSET;
          }
          var left = rect.left + scrollX + (rect.width / 2) - (tip.offsetWidth / 2);
          left = Math.max(scrollX + OFFSET, Math.min(left, scrollX + document.documentElement.clientWidth - tip.offsetWidth - OFFSET));
          tip.style.top = top + 'px';
          tip.style.left = left + 'px';
        }

        function openTip() {
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

        // Remove fragment hrefs so clicks don't add #
        try {
          var href = el.getAttribute('href');
          if (href && (href === '#' || href.indexOf('#') === 0)) {
            el.removeAttribute('href');
          }
        } catch (err) {}

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
      console.error('form__helpers initInfoTooltips error:', e);
    }
  }

  // --- Form persistence (sessionStorage) ---
  function getFormKey(form) {
    var id = form.id || form.getAttribute('name') || 'form';
    return 'formstate:' + (location.pathname || '') + ':' + id;
  }

  function serializeForm(form) {
    var data = {};
    var els = form.elements;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.name && !el.id) continue;
      var key = el.name || el.id;
      var tag = (el.tagName || '').toLowerCase();
      var type = (el.type || '').toLowerCase();
      if (type === 'password' || type === 'file') continue;
      if (type === 'checkbox') {
        data[key] = el.checked;
      } else if (type === 'radio') {
        if (el.checked) data[key] = el.value;
      } else if (tag === 'select') {
        if (el.multiple) {
          var vals = [];
          for (var j = 0; j < el.options.length; j++) {
            if (el.options[j].selected) vals.push(el.options[j].value);
          }
          data[key] = vals;
        } else {
          data[key] = el.value;
        }
      } else {
        data[key] = el.value;
      }
    }
    try {
      return JSON.stringify(data);
    } catch (e) {
      return '';
    }
  }

  function restoreForm(form) {
    try {
      var key = getFormKey(form);
      var raw = sessionStorage.getItem(key);
      if (!raw) return;
      var data = JSON.parse(raw || '{}');
      var els = form.elements;
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (!el.name && !el.id) continue;
        var name = el.name || el.id;
        var tag = (el.tagName || '').toLowerCase();
        var type = (el.type || '').toLowerCase();
        if (!(name in data)) continue;
        var val = data[name];
        if (type === 'checkbox') {
          el.checked = !!val;
        } else if (type === 'radio') {
          el.checked = (el.value === val);
        } else if (tag === 'select') {
          if (el.multiple && Array.isArray(val)) {
            for (var j = 0; j < el.options.length; j++) {
              el.options[j].selected = val.indexOf(el.options[j].value) !== -1;
            }
          } else {
            el.value = val;
          }
        } else {
          el.value = val;
        }
      }
    } catch (e) {
      console.error('form__helpers restoreForm error:', e);
    }
  }

  function saveFormState(form) {
    try {
      var key = getFormKey(form);
      var raw = serializeForm(form);
      sessionStorage.setItem(key, raw);
    } catch (e) {
      console.error('form__helpers saveFormState error:', e);
    }
  }

  function clearFormState(form) {
    try {
      var key = getFormKey(form);
      sessionStorage.removeItem(key);
    } catch (e) {
      console.error('form__helpers clearFormState error:', e);
    }
  }

  function initFormPersistence(root) {
    root = root || document;
    try {
      var selector = 'form.calculator--form, form[data-save="session"]';
      var forms = Array.prototype.slice.call(root.querySelectorAll(selector));
      forms.forEach(function (form, idx) {
        // Restore existing state
        restoreForm(form);

        // Debounced save
        var saveTimer = null;
        function scheduleSave() {
          if (saveTimer) clearTimeout(saveTimer);
          saveTimer = setTimeout(function () { saveFormState(form); }, 250);
        }

        // Listen for input and change events
        form.addEventListener('input', scheduleSave, true);
        form.addEventListener('change', scheduleSave, true);

        // On submit clear if requested
        form.addEventListener('submit', function (e) {
          var clearOnSubmit = form.getAttribute('data-clear-on-submit');
          if (clearOnSubmit === 'true' || clearOnSubmit === '' ) {
            clearFormState(form);
          } else {
            // ensure final values saved
            saveFormState(form);
          }
        }, true);
      });
    } catch (e) {
      console.error('form__helpers initFormPersistence error:', e);
    }
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      addAsterisks(document);
      initInfoTooltips(document);
      initFormPersistence(document);
    });
  } else {
    addAsterisks(document);
    initInfoTooltips(document);
    initFormPersistence(document);
  }

  // Expose functions for dynamic content
  window.formHelpers = window.formHelpers || {};
  window.formHelpers.addAsterisks = addAsterisks;
  window.formHelpers.initInfoTooltips = initInfoTooltips;
  window.formHelpers.saveFormState = saveFormState;
  window.formHelpers.clearFormState = clearFormState;

})();
