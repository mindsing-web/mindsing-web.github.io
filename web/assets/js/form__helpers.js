// Form helper utilities: required asterisks + click-to-toggle tooltips for .info
(function () {
  'use strict';
  // --- Required asterisks ---
  function addAsterisks (root) {
    root = root || document;
    try {
      var selectors = 'input[required], select[required], textarea[required]';
      var els = root.querySelectorAll (selectors);
      els.forEach (function (el) {
        var id = el.id;
        var label = id
          ? document.querySelector ('label[for="' + id + '"]')
          : null;
        if (!label) {
          var parent = el.parentElement;
          while (parent && parent !== document.body) {
            if (parent.tagName && parent.tagName.toLowerCase () === 'label') {
              label = parent;
              break;
            }
            parent = parent.parentElement;
          }
        }
        if (!label) return;
        if (label.querySelector ('.required-asterisk')) return;
        var span = document.createElement ('span');
        span.className = 'required-asterisk';
        span.textContent = '*';
        label.insertBefore (span, label.firstChild);
      });
    } catch (e) {
      console.error ('form__helpers addAsterisks error:', e);
    }
  }

  // --- Info tooltip behavior ---
  // Transforms <a class="info" title="..."> into a click-toggle tooltip.
  function initInfoTooltips (root) {
    root = root || document;
    try {
      var DEFAULT_OFFSET = 20; // px distance from trigger to tooltip
      var infos = Array.prototype.slice.call (root.querySelectorAll ('a.info'));
      infos.forEach (function (el, i) {
        // Ensure it's focusable and has role
        el.setAttribute ('role', 'button');
        el.setAttribute ('tabindex', el.getAttribute ('tabindex') || '0');

        var content =
          el.getAttribute ('title') || el.getAttribute ('data-title') || '';
        if (!content) return;

        // Remove default title to avoid native tooltip
        el.removeAttribute ('title');

        // Per-element offset override (data-tooltip-offset="16")
        var OFFSET =
          parseInt (el.getAttribute ('data-tooltip-offset'), 10) ||
          DEFAULT_OFFSET;

        // Create tooltip element
        var tip = document.createElement ('div');
        tip.className = 'info-tooltip';
        tip.setAttribute ('role', 'tooltip');
        var tipId = 'info-tooltip-' + (el.id || 'fh' + i);
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
        el.setAttribute ('aria-haspopup', 'true');
        el.setAttribute ('aria-expanded', 'false');
        el.setAttribute ('aria-controls', tipId);

        // Insert into DOM
        document.body.appendChild (tip);

        function positionTip () {
          var rect = el.getBoundingClientRect ();
          var scrollY = window.scrollY || window.pageYOffset;
          var scrollX = window.scrollX || window.pageXOffset;
          // Place above by default, otherwise below
          var top = rect.top + scrollY - tip.offsetHeight - OFFSET;
          if (top < scrollY + OFFSET) {
            top = rect.bottom + scrollY + OFFSET;
          }
          var left = rect.left + scrollX + rect.width / 2 - tip.offsetWidth / 2;
          left = Math.max (
            scrollX + OFFSET,
            Math.min (
              left,
              scrollX +
                document.documentElement.clientWidth -
                tip.offsetWidth -
                OFFSET
            )
          );
          tip.style.top = top + 'px';
          tip.style.left = left + 'px';
        }

        function openTip () {
          positionTip ();
          tip.style.display = 'block';
          el.setAttribute ('aria-expanded', 'true');
          // focus the tooltip for screen readers
          tip.setAttribute ('tabindex', '-1');
          tip.focus && tip.focus ();
          // register outside click handler
          document.addEventListener ('click', onDocClick, true);
          document.addEventListener ('keydown', onKeyDown, true);
        }

        function closeTip () {
          tip.style.display = 'none';
          el.setAttribute ('aria-expanded', 'false');
          document.removeEventListener ('click', onDocClick, true);
          document.removeEventListener ('keydown', onKeyDown, true);
        }

        function toggleTip () {
          if (tip.style.display === 'none' || tip.style.display === '')
            openTip ();
          else closeTip ();
        }

        function onDocClick (e) {
          if (
            e.target === el ||
            el.contains (e.target) ||
            e.target === tip ||
            tip.contains (e.target)
          )
            return;
          closeTip ();
        }

        function onKeyDown (e) {
          if (e.key === 'Escape' || e.key === 'Esc') {
            closeTip ();
            el.focus && el.focus ();
          }
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault ();
            toggleTip ();
          }
        }

        // Remove fragment hrefs so clicks don't add #
        try {
          var href = el.getAttribute ('href');
          if (href && (href === '#' || href.indexOf ('#') === 0)) {
            el.removeAttribute ('href');
          }
        } catch (err) {}

        el.addEventListener ('click', function (ev) {
          ev.preventDefault ();
          ev.stopPropagation ();
          toggleTip ();
        });
        el.addEventListener ('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault ();
            toggleTip ();
          }
        });

        // Reposition on resize/scroll when open
        window.addEventListener ('resize', function () {
          if (tip.style.display !== 'none') positionTip ();
        });
        window.addEventListener (
          'scroll',
          function () {
            if (tip.style.display !== 'none') positionTip ();
          },
          true
        );
      });
    } catch (e) {
      console.error ('form__helpers initInfoTooltips error:', e);
    }
  }

  // --- Form persistence (sessionStorage) ---
  function getFormKey (form) {
    var id = form.id || form.getAttribute ('name') || 'form';
    return 'formstate:' + (location.pathname || '') + ':' + id;
  }

  function serializeForm (form) {
    var data = {};
    var els = form.elements;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.name && !el.id) continue;
      var key = el.name || el.id;
      var tag = (el.tagName || '').toLowerCase ();
      var type = (el.type || '').toLowerCase ();
      if (type === 'password' || type === 'file') continue;
      if (type === 'checkbox') {
        data[key] = el.checked;
      } else if (type === 'radio') {
        if (el.checked) data[key] = el.value;
      } else if (tag === 'select') {
        if (el.multiple) {
          var vals = [];
          for (var j = 0; j < el.options.length; j++) {
            if (el.options[j].selected) vals.push (el.options[j].value);
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
      return JSON.stringify (data);
    } catch (e) {
      return '';
    }
  }

  function restoreForm (form) {
    try {
      var key = getFormKey (form);
      var raw = sessionStorage.getItem (key);
      if (!raw) return;
      var data = JSON.parse (raw || '{}');
      var els = form.elements;
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (!el.name && !el.id) continue;
        var name = el.name || el.id;
        var tag = (el.tagName || '').toLowerCase ();
        var type = (el.type || '').toLowerCase ();
        if (!(name in data)) continue;
        var val = data[name];
        if (type === 'checkbox') {
          el.checked = !!val;
        } else if (type === 'radio') {
          el.checked = el.value === val;
        } else if (tag === 'select') {
          if (el.multiple && Array.isArray (val)) {
            for (var j = 0; j < el.options.length; j++) {
              el.options[j].selected = val.indexOf (el.options[j].value) !== -1;
            }
          } else {
            el.value = val;
          }
        } else {
          el.value = val;
        }
      }
    } catch (e) {
      console.error ('form__helpers restoreForm error:', e);
    }
  }

  function saveFormState (form) {
    try {
      var key = getFormKey (form);
      var raw = serializeForm (form);
      sessionStorage.setItem (key, raw);
    } catch (e) {
      console.error ('form__helpers saveFormState error:', e);
    }
  }

  function clearFormState (form) {
    try {
      var key = getFormKey (form);
      sessionStorage.removeItem (key);
    } catch (e) {
      console.error ('form__helpers clearFormState error:', e);
    }
  }

  function initFormPersistence (root) {
    root = root || document;
    try {
      var selector = 'form.calculator--form, form[data-save="session"]';
      var forms = Array.prototype.slice.call (root.querySelectorAll (selector));
      forms.forEach (function (form, idx) {
        // Restore existing state
        restoreForm (form);

        // Debounced save
        var saveTimer = null;
        function scheduleSave () {
          if (saveTimer) clearTimeout (saveTimer);
          saveTimer = setTimeout (function () {
            saveFormState (form);
          }, 250);
        }

        // Listen for input and change events
        form.addEventListener ('input', scheduleSave, true);
        form.addEventListener ('change', scheduleSave, true);

        // On submit clear if requested
        form.addEventListener (
          'submit',
          function (e) {
            var clearOnSubmit = form.getAttribute ('data-clear-on-submit');
            if (clearOnSubmit === 'true' || clearOnSubmit === '') {
              clearFormState (form);
            } else {
              // ensure final values saved
              saveFormState (form);
            }
          },
          true
        );
      });
    } catch (e) {
      console.error ('form__helpers initFormPersistence error:', e);
    }
  }

  // --- Confirm dialog utility ---
  function showConfirm (options) {
    options = options || {};
    var title = options.title || 'Are you sure?';
    var body = options.body || '';
    var okText = options.okText || 'OK';
    var cancelText = options.cancelText || 'Cancel';
    return new Promise (function (resolve) {
      try {
        // create modal elements
        var overlay = document.createElement ('div');
        overlay.className =
          'confirm-overlay fixed top-0 left-0 w-100 h-100 flex items-center justify-center';
        overlay.style.zIndex = 20000;
        overlay.style.background = 'rgba(0,0,0,0.4)';

        var box = document.createElement ('div');
        box.className = 'confirm-box bg-white pa3 br2';
        box.style.minWidth = '320px';
        box.style.maxWidth = '90%';

        var h = document.createElement ('h3');
        h.textContent = title;
        h.style.marginTop = '0';
        var p = document.createElement ('p');
        p.innerHTML = body;

        var controls = document.createElement ('div');
        controls.className = 'tr mt3';

        var cancel = document.createElement ('button');
        cancel.className = 'btn mr2';
        cancel.textContent = cancelText;
        var ok = document.createElement ('button');
        ok.className = 'btn btn--primary';
        ok.textContent = okText;

        controls.appendChild (cancel);
        controls.appendChild (ok);
        box.appendChild (h);
        box.appendChild (p);
        box.appendChild (controls);
        overlay.appendChild (box);
        document.body.appendChild (overlay);

        function cleanup () {
          document.body.removeChild (overlay);
          document.removeEventListener ('keydown', onKey, true);
        }
        function onKey (e) {
          if (e.key === 'Escape' || e.key === 'Esc') {
            cleanup ();
            resolve (false);
          }
        }
        cancel.addEventListener ('click', function () {
          cleanup ();
          resolve (false);
        });
        ok.addEventListener ('click', function () {
          cleanup ();
          resolve (true);
        });
        document.addEventListener ('keydown', onKey, true);
      } catch (e) {
        console.error ('showConfirm error:', e);
        resolve (false);
      }
    });
  }

  // --- Initialize clear-values buttons on forms ---
  function initClearValues (root) {
    root = root || document;
    try {
      var forms = Array.prototype.slice.call (
        root.querySelectorAll (
          'form.calculator--form, form[data-save="session"]'
        )
      );
      // helper to run the clear flow for a specific form element
      function handleClearForForm(form) {
        if (!form) return;
        clearFormState (form);
        try { form.reset(); } catch (err) {}
        try {
          if (window.history && typeof window.history.replaceState === 'function') {
            var url = new URL(location.href);
            url.search = '';
            window.history.replaceState({}, document.title, url.toString());
          } else {
            location.search = '';
          }
        } catch (err) {
          console.error('clear-values: could not clear URL token', err);
        }
        form.dispatchEvent (new CustomEvent('form:cleared'));
      }
      forms.forEach (function (form) {
        var clearBtn = form.querySelector ('.btn--clear-values');
        if (!clearBtn) return;
        // mark this button as bound so delegated handler can skip it
        try { clearBtn.setAttribute('data-clear-bound', 'true'); } catch (err) {}
        clearBtn.addEventListener ('click', function (e) {
          e.preventDefault ();
          e.stopPropagation();
          showConfirm ({
            title: 'Clear saved values?',
            body: 'This will clear saved form values for this calculator. Are you sure?',
            okText: 'Yes, clear',
            cancelText: 'Cancel',
          }).then (function (ok) {
            if (!ok) return;
            handleClearForForm(form);
          });
        });
      });

      // Also bind any clear buttons that live outside the forms (e.g., action bar)
      var outerClearBtns = Array.prototype.slice.call(root.querySelectorAll('.btn--clear-values'));
      outerClearBtns.forEach(function(btn){
        // if the button is inside a form we've already bound, skip (it was handled above)
        if (btn.closest('form')) return;
        // if this button was already bound above, skip
        if (btn.getAttribute && btn.getAttribute('data-clear-bound') === 'true') return;
        // mark as bound to avoid future duplicate binding
        try { btn.setAttribute('data-clear-bound', 'true'); } catch (err) {}
        btn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          showConfirm({
            title: 'Clear saved values?',
            body: 'This will clear saved form values for this calculator. Are you sure?',
            okText: 'Yes, clear',
            cancelText: 'Cancel',
          }).then(function(ok){
            if (!ok) return;
            // Try data-target-form attr, then fallback to default form id on page
            var targetFormId = btn.getAttribute('data-target-form') || (root.querySelector('form.calculator--form') && root.querySelector('form.calculator--form').id) || 'dime-form';
            var targetForm = document.getElementById(targetFormId) || document.querySelector('form.calculator--form');
            handleClearForForm(targetForm);
          });
        });
      });
    } catch (e) {
      console.error ('initClearValues error:', e);
    }
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener ('DOMContentLoaded', function () {
      addAsterisks (document);
      initInfoTooltips (document);
      initFormPersistence (document);
      initClearValues (document);
      initHashOnSubmit (document);
      initPrefillFromURL (document);
      initAddKeyButton (document);
    });
  } else {
    addAsterisks (document);
    initInfoTooltips (document);
    initFormPersistence (document);
    initClearValues (document);
    initHashOnSubmit (document);
    initPrefillFromURL (document);
    initAddKeyButton (document);
  }

  // Delegated handler for any clear-values buttons that may be added later
  try {
  document.addEventListener('click', function(e){
      var btn = e.target.closest && e.target.closest('.btn--clear-values');
      if (!btn) return;
      // If the button is inside a form, the per-form handler should handle it
      if (btn.closest && btn.closest('form')) return;
      // If the button was already bound directly, skip delegated handling
      if (btn.getAttribute && btn.getAttribute('data-clear-bound') === 'true') return;
      e.preventDefault();
      showConfirm({
        title: 'Clear saved values?',
        body: 'This will clear saved form values for this calculator. Are you sure?',
        okText: 'Yes, clear',
        cancelText: 'Cancel',
      }).then(function(ok){
        if (!ok) return;
        try {
          var targetFormId = btn.getAttribute('data-target-form') || (document.querySelector('form.calculator--form') && document.querySelector('form.calculator--form').id) || 'dime-form';
          var targetForm = document.getElementById(targetFormId) || document.querySelector('form.calculator--form');
          if (!targetForm) return;
          // reuse handleClearForForm if available in this scope
          try { handleClearForForm(targetForm); } catch (err) {
            // fallback: perform simple clear
            try { targetForm.reset(); } catch (e) {}
          }
        } catch (err) {
          console.error('delegated clear-values handler error', err);
        }
      });
  }, false);
  } catch (e) {}

  // Expose functions for dynamic content
  window.formHelpers = window.formHelpers || {};
  window.formHelpers.addAsterisks = addAsterisks;
  window.formHelpers.initInfoTooltips = initInfoTooltips;
  window.formHelpers.saveFormState = saveFormState;
  window.formHelpers.clearFormState = clearFormState;
  window.formHelpers.showConfirm = showConfirm;
  window.formHelpers.initClearValues = initClearValues;

  // --- Encode form values into URL (query string in fragment/hash)
  // Usage: formHelpers.encodeFormToURLHash(form, { includeEmpty: false, useFragment: true })
  function encodeFormToURLHash (form, opts) {
    opts = opts || {};
    var includeEmpty = !!opts.includeEmpty;
    var useFragment = typeof opts.useFragment === 'undefined'
      ? true
      : !!opts.useFragment;
    try {
      if (!form || !(form instanceof HTMLFormElement)) return '';
      var rawJson = serializeForm (form) || '{}';
      var parsed = JSON.parse (rawJson);
      var params = new URLSearchParams ();
      Object.keys (parsed).forEach (function (k) {
        var v = parsed[k];
        if (
          !includeEmpty &&
          (v === null || v === '' || typeof v === 'undefined')
        )
          return;
        if (Array.isArray (v))
          v.forEach (function (it) {
            params.append (k, it);
          });
        else params.append (k, String (v));
      });
      var qs = params.toString ();
      if (useFragment) {
        // Use location.hash without triggering navigation: preserve existing path/search
        var hash = qs ? '#' + qs : '';
        try {
          if (history && history.replaceState)
            history.replaceState (
              null,
              '',
              location.pathname + location.search + hash
            );
          else location.hash = qs;
        } catch (e) {
          try {
            location.hash = qs;
          } catch (er) {}
        }
      } else {
        // Update search (will reload in some browsers if assigned directly)
        var newUrl = location.pathname + (qs ? '?' + qs : '');
        try {
          if (history && history.replaceState)
            history.replaceState (null, '', newUrl);
          else location.search = qs;
        } catch (e) {
          try {
            location.search = qs;
          } catch (er) {}
        }
      }
      return qs;
    } catch (e) {
      console.error ('form__helpers encodeFormToURLHash error:', e);
      return '';
    }
  }

  window.formHelpers.encodeFormToURLHash = encodeFormToURLHash;

  // Auto-bind: if a form has `data-hash-on-submit`, encode on submit.
  function initHashOnSubmit (root) {
    root = root || document;
    try {
      var forms = Array.prototype.slice.call (
        root.querySelectorAll ('form[data-hash-on-submit]')
      );
      forms.forEach (function (form) {
        form.addEventListener (
          'submit',
          function (e) {
            try {
              e.preventDefault ();
              encodeFormToURLHash (form, {
                includeEmpty: false,
                useFragment: true,
              });
              var submitAfter = form.getAttribute ('data-submit-after-hash');
              if (submitAfter === 'true') form.submit ();
            } catch (err) {
              console.error ('initHashOnSubmit submit handler error:', err);
            }
          },
          true
        );
      });
    } catch (e) {
      console.error ('initHashOnSubmit error:', e);
    }
  }

  window.formHelpers.initHashOnSubmit = initHashOnSubmit;

  // --- Tokenized form export/import (base64url of JSON)
  function base64UrlEncode (str) {
    try {
      // Use TextEncoder -> arrayBuffer -> base64url
      var buf = utf8ToUint8Array (str).buffer;
      return arrayBufferToBase64Url (buf);
    } catch (e) {
      console.error ('base64UrlEncode error:', e);
      return '';
    }
  }

  function base64UrlDecode (b64url) {
    try {
      // convert base64url to Uint8Array then decode as UTF-8
      var b64 = b64url.replace (/-/g, '+').replace (/_/g, '/');
      while (b64.length % 4)
        b64 += '=';
      var binary = atob (b64);
      var len = binary.length;
      var bytes = new Uint8Array (len);
      for (var i = 0; i < len; i++)
        bytes[i] = binary.charCodeAt (i);
      return new TextDecoder ().decode (bytes);
    } catch (e) {
      console.error ('base64UrlDecode error:', e);
      return '';
    }
  }
  // HMAC-SHA256 helpers using Web Crypto
  function utf8ToUint8Array (str) {
    return new TextEncoder ().encode (str);
  }

  function arrayBufferToBase64Url (buf) {
    var binary = '';
    var bytes = new Uint8Array (buf);
    for (var i = 0; i < bytes.byteLength; i++)
      binary += String.fromCharCode (bytes[i]);
    var b64 = btoa (binary);
    return b64.replace (/\+/g, '-').replace (/\//g, '_').replace (/=+$/g, '');
  }

  function importHmacKeyFromSalt (salt) {
    try {
      // Cache imported keys by salt to avoid repeated imports
      window._formHelpersHmacKeyCache = window._formHelpersHmacKeyCache || {};
      if (window._formHelpersHmacKeyCache[salt])
        return window._formHelpersHmacKeyCache[salt];
      var keyData = utf8ToUint8Array (salt);
      var p = crypto.subtle.importKey (
        'raw',
        keyData,
        {name: 'HMAC', hash: {name: 'SHA-256'}},
        false,
        ['sign', 'verify']
      );
      window._formHelpersHmacKeyCache[salt] = p;
      return p;
    } catch (e) {
      return Promise.reject (e);
    }
  }

  function hmacSha256Base64Url (message, salt) {
    return (async function () {
      var data = utf8ToUint8Array (message);
      var key = await importHmacKeyFromSalt (salt);
      var sigBuf = await crypto.subtle.sign ('HMAC', key, data);
      return arrayBufferToBase64Url (sigBuf);
    }) ();
  }

  // Create token from form. If opts.salt is provided, returns a Promise that resolves
  // to a signed token: "{payload}.{sig}" where payload is base64url(JSON) and sig is base64url(HMAC_SHA256(payload, salt)).
  function createTokenFromForm (form, opts) {
    opts = opts || {};
    try {
      var json = serializeForm (form) || '{}';
      var payload = base64UrlEncode (json);
      var salt = opts.salt || null;
      if (!salt) return Promise.resolve (payload);
      return hmacSha256Base64Url (payload, salt)
        .then (function (sig) {
          return payload + '.' + sig;
        })
        .catch (function (e) {
          console.error ('createTokenFromForm (signed) error:', e);
          return payload;
        });
    } catch (e) {
      console.error ('createTokenFromForm error:', e);
      return Promise.resolve ('');
    }
  }

  // Decode token to object. If opts.salt is provided and token contains a signature,
  // verification will be attempted and a Promise is returned which resolves to the object
  // on success or an empty object on failure.
  function decodeTokenToObject (token, opts) {
    opts = opts || {};
    try {
      if (!token) return Promise.resolve ({});
      var parts = ('' + token).split ('.');
      var payload = parts[0] || '';
      var sig = parts[1] || null;
      var json = base64UrlDecode (payload);
      var obj = JSON.parse (json || '{}');
      var salt = opts.salt || null;
      if (!sig || !salt) return Promise.resolve (obj);
      return hmacSha256Base64Url (payload, salt)
        .then (function (expectedSig) {
          if (expectedSig === sig) return obj;
          throw new Error ('signature-mismatch');
        })
        .catch (function (e) {
          console.error ('decodeTokenToObject verification failed:', e);
          return {};
        });
    } catch (e) {
      console.error ('decodeTokenToObject error:', e);
      return Promise.resolve ({});
    }
  }

  function writeTokenToQuery (token, opts) {
    opts = opts || {};
    try {
      if (!token) {
        if (history && history.replaceState)
          history.replaceState (null, '', location.pathname + location.hash);
        else location.search = '';
        return;
      }
      var query = '?' + token;
      if (history && history.replaceState)
        history.replaceState (
          null,
          '',
          location.pathname + query + location.hash
        );
      else location.search = token;
    } catch (e) {
      try {
        location.search = token;
      } catch (er) {
        console.error ('writeTokenToQuery error:', er);
      }
    }
  }

  function populateFormFromToken (token, form) {
    (async function () {
      try {
        var data = await decodeTokenToObject (token || '');
        if (!form || !data) return;
        var els = form.elements;
        for (var i = 0; i < els.length; i++) {
          var el = els[i];
          if (!el.name && !el.id) continue;
          var key = el.name || el.id;
          if (!(key in data)) continue;
          var tag = (el.tagName || '').toLowerCase ();
          var type = (el.type || '').toLowerCase ();
          var val = data[key];
          if (type === 'checkbox') {
            el.checked = !!val && (val === true || val === '1' || val === 1);
          } else if (type === 'radio') {
            el.checked = el.value === val;
          } else if (tag === 'select') {
            if (el.multiple && Array.isArray (val)) {
              for (var j = 0; j < el.options.length; j++) {
                el.options[j].selected =
                  val.indexOf (el.options[j].value) !== -1;
              }
            } else {
              el.value = val;
            }
          } else {
            el.value = val;
          }
        }
        try {
          form.dispatchEvent (new Event ('change', {bubbles: true}));
        } catch (e) {}
      } catch (e) {
        console.error ('populateFormFromToken error:', e);
      }
    }) ();
  }

  window.formHelpers.base64UrlEncode = base64UrlEncode;
  window.formHelpers.base64UrlDecode = base64UrlDecode;
  window.formHelpers.createTokenFromForm = createTokenFromForm;
  window.formHelpers.decodeTokenToObject = decodeTokenToObject;
  window.formHelpers.writeTokenToQuery = writeTokenToQuery;
  window.formHelpers.populateFormFromToken = populateFormFromToken;

  // --- Prefill forms from URL hash or query ---
  // Looks for either a token in the search ("?token") or a query-string-style
  // fragment ("#field=val&...") and populates the target form.
  function initPrefillFromURL (root) {
    root = root || document;
    try {
      // find target form: prefer explicit form with id 'dime-form', then any calculator form
      var form = document.getElementById('dime-form') || document.querySelector('form.calculator--form') || null;
      if (!form) return;

      // Helper to parse hash like '#a=1&b=2' -> URLSearchParams
      function parseFragmentToParams (frag) {
        if (!frag) return null;
        var s = frag.replace(/^#/, '');
        if (!s) return null;
        return new URLSearchParams(s);
      }

      // If there's a search token (e.g., '?<payload>' or '?payload.sig'), try to decode and populate
      var search = (location.search || '').replace(/^\?/, '');
      if (search) {
        // assume search is a token payload (base64url or base64url.sig)
        try {
          window.formHelpers.populateFormFromToken(search, form);
          return;
        } catch (e) {}
      }

      // Next, look at fragment as either token or query string
      var hash = (location.hash || '').replace(/^#/, '');
      if (!hash) return;

      // If hash contains '=' treat it as query-string-style values
      if (hash.indexOf('=') !== -1) {
        var params = parseFragmentToParams(location.hash);
        if (!params) return;
        // Apply params to form elements
        for (var pair of params.entries()) {
          var key = pair[0];
          var val = pair[1];
          var el = form.elements[key] || form.querySelector('#' + key);
          if (!el) continue;
          var tag = (el.tagName || '').toLowerCase();
          var type = (el.type || '').toLowerCase();
          try {
            if (type === 'checkbox') el.checked = (val === '1' || val === 'true');
            else if (type === 'radio') {
              var radios = form.querySelectorAll('input[name="' + key + '"]');
              radios.forEach(function(r){ if (r.value === val) r.checked = true; });
            } else { el.value = val; }
          } catch (e) {}
        }
        try { form.dispatchEvent(new Event('change', {bubbles:true})); } catch (e) {}
        return;
      }

      // Otherwise treat hash as a base64url token and try to populate
      try {
        window.formHelpers.populateFormFromToken(location.hash.replace(/^#/, ''), form);
      } catch (e) {}
    } catch (e) {
      console.error('initPrefillFromURL error:', e);
    }
  }

  window.formHelpers.initPrefillFromURL = initPrefillFromURL;

  // --- Add key button behavior ---
  // When present, the button with id `btn-add-key` will prompt the user for a token
  // or query-style fragment. The value will be written to the URL (hash preferred)
  // and the form will be populated immediately.
  function initAddKeyButton (root) {
    root = root || document;
    try {
      var btn = document.getElementById('btn-add-key');
      if (!btn) return;

  var dialog = document.getElementById('add-key-dialog');
  var input = dialog ? dialog.querySelector('#add_key_input') : null;
  var closeBtn = dialog ? dialog.querySelector('#add-key-close') : null;
  var submitBtn = dialog ? dialog.querySelector('#add-key-submit') : null;
  var errorEl = dialog ? dialog.querySelector('#add-key-error') : null;

      function openDialog() {
        try {
          if (!dialog) return;
          if (typeof dialog.showModal === 'function') dialog.showModal();
          else dialog.setAttribute('open', '');
        } catch (e) { dialog.setAttribute('open', ''); }
        if (input) { input.value = ''; setTimeout(function(){ input.focus(); }, 10); }
      }

      function closeDialog() {
        try { if (!dialog) return; if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); } catch (e) { dialog.removeAttribute('open'); }
      }

      function isValidToken(str) {
        if (!str) return false;
        var s = (str || '').replace(/^[#?]/, '').trim();
        // Reject empty, whitespace, or query-style strings with '&'
        if (!s) return false;
        if (/\s/.test(s)) return false;
        if (s.indexOf('&') !== -1) return false;
        // Accept anything else (be permissive so tokens that work in the URL are accepted)
        return true;
      }

      function applyFragment(fragment) {
        fragment = (fragment || '').replace(/^[#?]/, '');
        if (!fragment) return;
        try {
          if (history && history.replaceState) {
            var url = new URL(location.href);
            // write to the query string (search) so URL looks like ?token
            url.search = fragment ? ('?' + fragment) : '';
            history.replaceState({}, document.title, url.toString());
          } else {
            location.search = fragment ? ('?' + fragment) : '';
          }
        } catch (err) {
          try { location.search = fragment ? ('?' + fragment) : ''; } catch (er) {}
        }
        var form = document.getElementById('dime-form') || document.querySelector('form.calculator--form');
        if (!form) return;
        try { window.formHelpers.populateFormFromToken(fragment, form); } catch (e) {}
      }

      // Register click on main button to open the dialog (or fallback to prompt)
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!dialog) {
          var val = window.prompt('Paste token (base64url or base64url.signature):', '');
          if (!val) return;
          var frag = val.replace(/^#/, '').trim();
          if (!isValidToken(frag)) {
            try { alert('Invalid key format. Paste a base64url token optionally with a signature separated by a dot.'); } catch (e) {}
            return;
          }
          applyFragment(frag);
          return;
        }
        openDialog();
      }, true);

      // Register dialog controls once
      if (closeBtn) closeBtn.addEventListener('click', function () { closeDialog(); }, true);
      if (dialog) dialog.addEventListener('cancel', function (ev) { ev.preventDefault(); closeDialog(); }, true);
      if (submitBtn && input) {
        submitBtn.addEventListener('click', function (ev) {
          ev.preventDefault();
          var v = (input.value || '').trim();
          if (!isValidToken(v)) {
            if (errorEl) { errorEl.style.display = 'block'; }
            input && input.focus();
            return;
          }
          if (errorEl) { errorEl.style.display = 'none'; }
          applyFragment(v);
          closeDialog();
        }, true);
        // allow Enter key inside input to submit
        input.addEventListener('keydown', function(ev){ if (ev.key === 'Enter') { ev.preventDefault(); submitBtn.click(); } }, true);
        // hide error when typing
        input.addEventListener('input', function(){ if (errorEl) errorEl.style.display = 'none'; }, true);
      }
    } catch (e) {
      console.error('initAddKeyButton error:', e);
    }
  }

  window.formHelpers.initAddKeyButton = initAddKeyButton;
}) ();
