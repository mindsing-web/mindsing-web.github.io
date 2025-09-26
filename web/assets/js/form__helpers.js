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

        // Insert into DOM. If PasswordGate exists and content is locked,
        // defer insertion until unlock to avoid exposing protected info.
        function doInsertTip () {
          try {
            document.body.appendChild (tip);
          } catch (e) {}
        }
        if (window.PasswordGate && typeof window.PasswordGate === 'function') {
          // If any password-protected areas are present and not unlocked, defer.
          try {
            var anyLocked = !!document.querySelector ('.js-password-protected');
            if (anyLocked) {
              window.formHelpers = window.formHelpers || {};
              window.formHelpers._deferredInfoTooltips = window.formHelpers
                ._deferredInfoTooltips || [];
              window.formHelpers._deferredInfoTooltips.push (doInsertTip);
            } else {
              doInsertTip ();
            }
          } catch (e) {
            doInsertTip ();
          }
        } else {
          doInsertTip ();
        }

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

  // Public helper to flush deferred info tooltips after content is revealed
  function flushDeferredInfoTooltips () {
    try {
      window.formHelpers = window.formHelpers || {};
      var q = window.formHelpers._deferredInfoTooltips || [];
      q.forEach (function (f) {
        try {
          f ();
        } catch (e) {}
      });
      window.formHelpers._deferredInfoTooltips = [];
    } catch (e) {}
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

        // focus the primary action so Enter will confirm
        try {
          ok.focus && ok.focus ();
        } catch (e) {}

        function cleanup () {
          document.body.removeChild (overlay);
          document.removeEventListener ('keydown', onKey, true);
        }
        function onKey (e) {
          if (e.key === 'Escape' || e.key === 'Esc') {
            cleanup ();
            resolve (false);
            return;
          }
          // Enter should accept the confirmation when the dialog is open
          if (e.key === 'Enter') {
            cleanup ();
            resolve (true);
            return;
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
      function handleClearForForm (form) {
        if (!form) return;
        clearFormState (form);
        try {
          form.reset ();
        } catch (err) {}
        try {
          if (
            window.history &&
            typeof window.history.replaceState === 'function'
          ) {
            var url = new URL (location.href);
            url.search = '';
            window.history.replaceState ({}, document.title, url.toString ());
          } else {
            location.search = '';
          }
        } catch (err) {
          console.error ('clear-values: could not clear URL token', err);
        }
        // also clear hash if present
        try {
          if (
            window.history &&
            typeof window.history.replaceState === 'function'
          ) {
            var url2 = new URL (location.href);
            url2.hash = '';
            window.history.replaceState ({}, document.title, url2.toString ());
          } else {
            location.hash = '';
          }
        } catch (err) {
          // ignore
        }
        // If a collapsed summary is visible, expand the form back before signalling cleared
        try {
          if (
            window.formDime &&
            typeof window.formDime.expandFromSummary === 'function'
          ) {
            try {
              window.formDime.expandFromSummary (form);
            } catch (e) {
              /* ignore */
            }
          }
        } catch (e) {}
        form.dispatchEvent (new CustomEvent ('form:cleared'));
      }
      forms.forEach (function (form) {
        var clearBtn = form.querySelector ('.btn--clear-values');
        if (!clearBtn) return;
        // mark this button as bound so delegated handler can skip it
        try {
          clearBtn.setAttribute ('data-clear-bound', 'true');
        } catch (err) {}
        clearBtn.addEventListener ('click', function (e) {
          e.preventDefault ();
          e.stopPropagation ();
          showConfirm ({
            title: 'Clear saved values?',
            body: 'This will clear saved form values for this calculator. Are you sure?',
            okText: 'Yes, clear',
            cancelText: 'Cancel',
          }).then (function (ok) {
            if (!ok) return;
            handleClearForForm (form);
          });
        });
      });

      // Also bind any clear buttons that live outside the forms (e.g., action bar)
      var outerClearBtns = Array.prototype.slice.call (
        root.querySelectorAll ('.btn--clear-values')
      );
      outerClearBtns.forEach (function (btn) {
        // if the button is inside a form we've already bound, skip (it was handled above)
        if (btn.closest ('form')) return;
        // if this button was already bound above, skip
        if (
          btn.getAttribute &&
          btn.getAttribute ('data-clear-bound') === 'true'
        )
          return;
        // mark as bound to avoid future duplicate binding
        try {
          btn.setAttribute ('data-clear-bound', 'true');
        } catch (err) {}
        btn.addEventListener ('click', function (e) {
          e.preventDefault ();
          e.stopPropagation ();
          showConfirm ({
            title: 'Clear saved values?',
            body: 'This will clear saved form values for this calculator. Are you sure?',
            okText: 'Yes, clear',
            cancelText: 'Cancel',
          }).then (function (ok) {
            if (!ok) return;
            // Try data-target-form attr, then fallback to default form id on page
            var targetFormId =
              btn.getAttribute ('data-target-form') ||
              (root.querySelector ('form.calculator--form') &&
                root.querySelector ('form.calculator--form').id) ||
              'dime-form';
            var targetForm =
              document.getElementById (targetFormId) ||
              document.querySelector ('form.calculator--form');
            handleClearForForm (targetForm);
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
      initNotesButton (document);
    });
  } else {
    addAsterisks (document);
    initInfoTooltips (document);
    initFormPersistence (document);
    initClearValues (document);
    initHashOnSubmit (document);
    initPrefillFromURL (document);
    initAddKeyButton (document);
    initNotesButton (document);
  }

  // Delegated handler for any clear-values buttons that may be added later
  try {
    document.addEventListener (
      'click',
      function (e) {
        var btn = e.target.closest && e.target.closest ('.btn--clear-values');
        if (!btn) return;
        // If the button is inside a form, the per-form handler should handle it
        if (btn.closest && btn.closest ('form')) return;
        // If the button was already bound directly, skip delegated handling
        if (
          btn.getAttribute &&
          btn.getAttribute ('data-clear-bound') === 'true'
        )
          return;
        e.preventDefault ();
        showConfirm ({
          title: 'Clear saved values?',
          body: 'This will clear saved form values for this calculator. Are you sure?',
          okText: 'Yes, clear',
          cancelText: 'Cancel',
        }).then (function (ok) {
          if (!ok) return;
          try {
            var targetFormId =
              btn.getAttribute ('data-target-form') ||
              (document.querySelector ('form.calculator--form') &&
                document.querySelector ('form.calculator--form').id) ||
              'dime-form';
            var targetForm =
              document.getElementById (targetFormId) ||
              document.querySelector ('form.calculator--form');
            if (!targetForm) return;
            // reuse handleClearForForm if available in this scope
            try {
              handleClearForForm (targetForm);
            } catch (err) {
              // fallback: perform simple clear
              try {
                targetForm.reset ();
              } catch (e) {}
            }
          } catch (err) {
            console.error ('delegated clear-values handler error', err);
          }
        });
      },
      false
    );
  } catch (e) {}

  // Delegated handler for notes toggle buttons as a fallback
  try {
    document.addEventListener (
      'click',
      function (e) {
        var btn = e.target && e.target.closest
          ? e.target.closest ('.btn--notes-toggle')
          : null;
        if (!btn) return;
        // If button was already directly bound, let that handler run
        if (btn.__notes_bound) return;
        e.preventDefault ();
        e.stopPropagation ();
        try {
          var targetFormId =
            btn.getAttribute && btn.getAttribute ('data-target-form');
          var form = null;
          if (targetFormId) form = document.getElementById (targetFormId);
          if (!form)
            form =
              document.querySelector ('form.calculator--form') ||
              document.querySelector ('form');
          if (!form) return;
          window.formHelpers.openNotes (form);
        } catch (err) {}
      },
      false
    );
  } catch (e) {}

  // Delegated fallback to persist form values: save form state on input/change (debounced)
  try {
    var __fh_save_timers = new WeakMap ();
    function __fh_schedule_save (form) {
      try {
        if (!form) return;
        var t = __fh_save_timers.get (form);
        if (t) clearTimeout (t);
        __fh_save_timers.set (
          form,
          setTimeout (function () {
            try {
              saveFormState (form);
            } catch (e) {}
          }, 250)
        );
      } catch (e) {}
    }
    document.addEventListener (
      'input',
      function (e) {
        try {
          var el = e.target;
          if (!el) return;
          var form = el.closest && el.closest ('form.calculator--form');
          if (!form) return;
          __fh_schedule_save (form);
        } catch (err) {}
      },
      true
    );
    document.addEventListener (
      'change',
      function (e) {
        try {
          var el = e.target;
          if (!el) return;
          var form = el.closest && el.closest ('form.calculator--form');
          if (!form) return;
          __fh_schedule_save (form);
        } catch (err) {}
      },
      true
    );
  } catch (e) {}

  // Expose functions for dynamic content
  window.formHelpers = window.formHelpers || {};
  window.formHelpers.addAsterisks = addAsterisks;
  window.formHelpers.initInfoTooltips = initInfoTooltips;
  window.formHelpers.flushDeferredInfoTooltips = flushDeferredInfoTooltips;
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

  // --- Generic notes dialog (reusable across forms) ---
  function ensureNotesDialog () {
    try {
      // If server-rendered dialog exists, use it
      var existing = document.getElementById ('notes-dialog');
      if (existing) {
        bindNotesDialog (existing);
        return existing;
      }

      // If a template is provided (<template id="notes-dialog-template">), clone it
      try {
        var tpl = document.getElementById ('notes-dialog-template');
        if (tpl && tpl.content) {
          var clone = tpl.content.cloneNode (true);
          // find dialog node in clone
          var dlg = clone.querySelector && clone.querySelector ('dialog');
          if (dlg) {
            document.body.appendChild (clone);
            bindNotesDialog (dlg);
            return dlg;
          }
        }
      } catch (e) {
        // ignore
      }

      // No server markup found; do not inject HTML from JS. Return null so callers can handle absence.
      return null;
    } catch (e) {
      return null;
    }
  }

  // Helper to attach handlers to an existing dialog element. Idempotent.
  function bindNotesDialog (dlg) {
    try {
      if (!dlg || dlg.__notes_bound) return;
      dlg.__notes_bound = true;

      var closeBtn = dlg.querySelector ('#notes-close');
      var saveBtn = dlg.querySelector ('#notes-save');
      var ta = dlg.querySelector ('#notes_dialog_textarea');

      function setNotesToggleState (formId, state) {
        try {
          var toggles = Array.prototype.slice.call (
            document.querySelectorAll ('.btn--notes-toggle')
          );
          toggles.forEach (function (tb) {
            try {
              var tgt = tb.getAttribute && tb.getAttribute ('data-target-form');
              if (!tgt || !formId || tgt === formId) {
                tb.setAttribute ('aria-expanded', state ? 'true' : 'false');
              }
            } catch (e) {}
          });
        } catch (e) {}
      }

      function closeNotesInternal () {
        try {
          if (typeof dlg.close === 'function') dlg.close ();
          else dlg.removeAttribute ('open');
        } catch (e) {
          try {
            dlg.removeAttribute ('open');
          } catch (err) {}
        }
        try {
          var fid = dlg.__notes_target_form_id || null;
        } catch (e) {
          var fid = null;
        }
        try {
          delete dlg.__notes_target;
        } catch (e) {}
        try {
          dlg.__notes_target_selector = null;
        } catch (e) {}
        try {
          dlg.__notes_target_form_id = null;
        } catch (e) {}
        setNotesToggleState (fid, false);
      }

      function saveNotesInternal (ev) {
        try {
          if (ev && typeof ev.preventDefault === 'function')
            ev.preventDefault ();
        } catch (e) {}
        try {
          if (ev && typeof ev.stopPropagation === 'function')
            ev.stopPropagation ();
        } catch (e) {}
        try {
          var txt = ta && ta.value ? ta.value.trim () : '';
          var target = dlg.__notes_target;
          if (target && target.tagName) {
            try {
              target.value = txt;
            } catch (e) {}
            try {
              target.dispatchEvent (new Event ('change', {bubbles: true}));
            } catch (e) {}
            try {
              // Ensure form persistence saves immediately in case delegated listeners missed the event
              var parentForm = target && target.closest
                ? target.closest ('form')
                : null;
              if (parentForm)
                try {
                  saveFormState (parentForm);
                } catch (e) {}
            } catch (e) {}
          } else if (dlg.__notes_target_selector) {
            try {
              var el = document.querySelector (dlg.__notes_target_selector);
              if (el) {
                el.value = txt;
                try {
                  el.dispatchEvent (new Event ('change', {bubbles: true}));
                } catch (e) {}
              }
              try {
                var pf = el && el.closest ? el.closest ('form') : null;
                if (pf)
                  try {
                    saveFormState (pf);
                  } catch (e) {}
              } catch (e) {}
            } catch (e) {}
          }
        } catch (e) {}
        closeNotesInternal ();
      }

      if (closeBtn)
        closeBtn.addEventListener (
          'click',
          function () {
            closeNotesInternal ();
          },
          true
        );
      if (saveBtn) saveBtn.addEventListener ('click', saveNotesInternal, true);

      dlg.__openFor = function (form, targetSelectorOrId) {
        try {
          var target = null;
          var selector = null;
          if (targetSelectorOrId && form) {
            selector = targetSelectorOrId.charAt &&
              targetSelectorOrId.charAt (0) === '#'
              ? targetSelectorOrId
              : '#' + targetSelectorOrId;
            try {
              target = form.querySelector (selector);
            } catch (e) {
              target = null;
            }
          }
          if (!target && form) {
            var t =
              form.querySelector ('textarea[id^="notes_"]') ||
              form.querySelector ('textarea[name^="notes"]') ||
              form.querySelector ('#expense_notes') ||
              form.querySelector ('textarea[data-notes]');
            if (t) {
              target = t;
              selector = '#' + (t.id || t.name);
            }
          }
          if (!target && selector && form) {
            try {
              var id = selector.replace (/^#/, '');
              var hidden = document.createElement ('textarea');
              hidden.id = id;
              hidden.name = id;
              hidden.style.display = 'none';
              form.appendChild (hidden);
              target = hidden;
            } catch (e) {
              target = null;
            }
          }
          dlg.__notes_target = target;
          dlg.__notes_target_selector = selector || null;
          try {
            dlg.__notes_target_form_id = form &&
              (form.id || (form.getAttribute && form.getAttribute ('name')))
              ? form.id || form.getAttribute ('name')
              : null;
          } catch (e) {
            dlg.__notes_target_form_id = null;
          }
          try {
            if (ta) ta.value = target && target.value ? target.value : '';
          } catch (e) {
            if (ta) ta.value = '';
          }
          try {
            if (typeof dlg.showModal === 'function') dlg.showModal ();
            else dlg.setAttribute ('open', '');
          } catch (e) {
            dlg.setAttribute ('open', '');
          }
          try {
            if (ta) {
              ta.focus ();
              var v = ta.value || '';
              ta.selectionStart = ta.selectionEnd = v.length;
            }
          } catch (e) {}
          try {
            setNotesToggleState (dlg.__notes_target_form_id, true);
          } catch (e) {}
        } catch (e) {}
      };

      dlg.__close = function () {
        closeNotesInternal ();
      };
    } catch (e) {}
  }

  function openNotes (form, targetSelectorOrId) {
    try {
      var dlg = ensureNotesDialog ();
      if (!dlg) return;
      dlg.__openFor (form, targetSelectorOrId);
    } catch (e) {}
  }

  function closeNotes () {
    try {
      var dlg = document.getElementById ('notes-dialog');
      if (dlg && typeof dlg.__close === 'function') dlg.__close ();
    } catch (e) {}
  }

  window.formHelpers.ensureNotesDialog = ensureNotesDialog;
  window.formHelpers.openNotes = openNotes;
  window.formHelpers.closeNotes = closeNotes;

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
    return (async function () {
      try {
        var data = await decodeTokenToObject (token || '');
        if (!form || !data) return {};
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
        return data;
      } catch (e) {
        console.error ('populateFormFromToken error:', e);
        return {};
      }
    }) ();
  }

  window.formHelpers.base64UrlEncode = base64UrlEncode;
  window.formHelpers.base64UrlDecode = base64UrlDecode;
  window.formHelpers.createTokenFromForm = createTokenFromForm;
  window.formHelpers.decodeTokenToObject = decodeTokenToObject;
  window.formHelpers.writeTokenToQuery = writeTokenToQuery;
  window.formHelpers.populateFormFromToken = populateFormFromToken;

  // --- Client-side AES-GCM helpers for encrypted share URLs ---
  var b64u = {
    enc: function (b) {
      try {
        var a = '';
        var bytes = new Uint8Array (b);
        for (var i = 0; i < bytes.byteLength; i++)
          a += String.fromCharCode (bytes[i]);
        return btoa (a)
          .replace (/\+/g, '-')
          .replace (/\//g, '_')
          .replace (/=+$/g, '');
      } catch (e) {
        return '';
      }
    },
    dec: function (s) {
      try {
        var b64 = (s || '').replace (/-/g, '+').replace (/_/g, '/');
        while (b64.length % 4)
          b64 += '=';
        var bin = atob (b64);
        var arr = new Uint8Array (bin.length);
        for (var i = 0; i < bin.length; i++)
          arr[i] = bin.charCodeAt (i);
        return arr;
      } catch (e) {
        return new Uint8Array ();
      }
    },
  };

  async function deriveKey (pass, saltUint8) {
    var enc = new TextEncoder ();
    var keyMaterial = await crypto.subtle.importKey (
      'raw',
      enc.encode (pass),
      {name: 'PBKDF2'},
      false,
      ['deriveKey']
    );
    return crypto.subtle.deriveKey (
      {name: 'PBKDF2', salt: saltUint8, iterations: 100000, hash: 'SHA-256'},
      keyMaterial,
      {name: 'AES-GCM', length: 256},
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptJSON (obj, pass) {
    var enc = new TextEncoder ();
    var iv = crypto.getRandomValues (new Uint8Array (12));
    var salt = crypto.getRandomValues (new Uint8Array (16));
    var key = await deriveKey (pass, salt);
    var plaintext = enc.encode (JSON.stringify (obj));
    var ct = await crypto.subtle.encrypt (
      {name: 'AES-GCM', iv: iv},
      key,
      plaintext
    );
    return {ct: b64u.enc (ct), iv: b64u.enc (iv), salt: b64u.enc (salt)};
  }

  async function decryptJSON (pack, pass) {
    var dec = new TextDecoder ();
    var iv = b64u.dec (pack.iv || '');
    var salt = b64u.dec (pack.salt || '');
    var ct = b64u.dec (pack.ct || '');
    var key = await deriveKey (pass, salt);
    var pt = await crypto.subtle.decrypt ({name: 'AES-GCM', iv: iv}, key, ct);
    return JSON.parse (dec.decode (pt));
  }

  // Build a share URL that places ciphertext in the query and the passphrase in the fragment
  async function createEncryptedShareUrl (form, passphrase) {
    try {
      if (!form) return '';
      var pass = passphrase || null;
      if (!pass) {
        try {
          var pid = form.getAttribute && form.getAttribute ('data-protect-id')
            ? form.getAttribute ('data-protect-id')
            : 'default';
          pass =
            sessionStorage.getItem ('password_gate:' + pid) ||
            localStorage.getItem ('password_gate:' + pid) ||
            null;
        } catch (e) {
          pass = null;
        }
      }
      // If no pass found, return empty and let caller decide how to handle failure
      if (!pass) return '';
      var data = {};
      var fd = new FormData (form);
      fd.forEach (function (v, k) {
        data[k] = v;
      });
      var pack = await encryptJSON (data, pass);
      var q = new URLSearchParams (pack).toString ();
      return (
        location.origin +
        location.pathname +
        '?' +
        q +
        '#key=' +
        encodeURIComponent (pass)
      );
    } catch (e) {
      console.error ('createEncryptedShareUrl error:', e);
      return '';
    }
  }

  // Try to decrypt a search (ct/iv/salt) using provided pass and populate a form
  async function tryDecryptSearchToForm (searchParams, pass, form) {
    try {
      var pack = {
        ct: searchParams.get ('ct'),
        iv: searchParams.get ('iv'),
        salt: searchParams.get ('salt'),
      };
      if (!pack.ct || !pack.iv || !pack.salt) return false;
      var passToUse = pass || null;
      if (!passToUse && form) {
        try {
          var pid2 = form.getAttribute && form.getAttribute ('data-protect-id')
            ? form.getAttribute ('data-protect-id')
            : 'default';
          passToUse =
            sessionStorage.getItem ('password_gate:' + pid2) ||
            localStorage.getItem ('password_gate:' + pid2) ||
            null;
        } catch (e) {
          passToUse = null;
        }
      }
      if (!passToUse) return false;
      var data = await decryptJSON (pack, passToUse);
      if (!form || !data) return true;
      Object.keys (data).forEach (function (k) {
        try {
          var els =
            form.elements[k] ||
            document.querySelector ('[name="' + k + '"]') ||
            document.getElementById (k);
          if (!els) return;
          // If multiple elements exist (NodeList), set each; otherwise set value
          if (els.length && typeof els !== 'string') {
            for (var i = 0; i < els.length; i++)
              try {
                els[i].value = data[k];
              } catch (e) {}
          } else {
            try {
              els.value = data[k];
            } catch (e) {}
          }
        } catch (e) {}
      });
      try {
        form.dispatchEvent (new Event ('change', {bubbles: true}));
      } catch (e) {}
      return true;
    } catch (e) {
      return false;
    }
  }

  window.formHelpers.encryptJSON = encryptJSON;
  window.formHelpers.decryptJSON = decryptJSON;
  window.formHelpers.createEncryptedShareUrl = createEncryptedShareUrl;
  window.formHelpers.tryDecryptSearchToForm = tryDecryptSearchToForm;

  // --- Prefill forms from URL hash or query ---
  // Looks for either a token in the search ("?token") or a query-string-style
  // fragment ("#field=val&...") and populates the target form.
  function initPrefillFromURL (root) {
    root = root || document;
    try {
      // find target form: prefer explicit form with id 'dime-form', then any calculator form
      var form =
        document.getElementById ('dime-form') ||
        document.querySelector ('form.calculator--form') ||
        null;
      if (!form) return;

      // Helper to parse hash like '#a=1&b=2' -> URLSearchParams
      function parseFragmentToParams (frag) {
        if (!frag) return null;
        var s = frag.replace (/^#/, '');
        if (!s) return null;
        return new URLSearchParams (s);
      }

      // If there's a search token (e.g., '?<payload>' or '?payload.sig'), try to decode and populate
      var search = (location.search || '').replace (/^\?/, '');
      if (search) {
        // If query contains encrypted payload (ct/iv/salt) and fragment contains key=, try to decrypt
        try {
          var usp = new URLSearchParams (location.search.replace (/^\?/, ''));
          if (usp.get ('ct') && usp.get ('iv') && usp.get ('salt')) {
            var keyMatch = (location.hash || '').match (/key=([^&]+)/);
            if (keyMatch) {
              var pass = decodeURIComponent (keyMatch[1]);
              try {
                window.formHelpers
                  .tryDecryptSearchToForm (usp, pass, form)
                  .then (function (ok) {
                    /* ignore return */
                  });
                return;
              } catch (e) {}
            }
            // if no key in fragment, do not attempt decryption here
          }
        } catch (e) {}
        // fallback: assume search is a token payload (base64url or base64url.sig)
        try {
          window.formHelpers.populateFormFromToken (search, form);
          return;
        } catch (e) {}
      }

      // Next, look at fragment as either token or query string
      var hash = (location.hash || '').replace (/^#/, '');
      if (!hash) return;

      // If hash contains '=' treat it as query-string-style values
      if (hash.indexOf ('=') !== -1) {
        var params = parseFragmentToParams (location.hash);
        if (!params) return;
        // Apply params to form elements
        for (var pair of params.entries ()) {
          var key = pair[0];
          var val = pair[1];
          var el = form.elements[key] || form.querySelector ('#' + key);
          if (!el) continue;
          var tag = (el.tagName || '').toLowerCase ();
          var type = (el.type || '').toLowerCase ();
          try {
            if (type === 'checkbox') el.checked = val === '1' || val === 'true';
            else if (type === 'radio') {
              var radios = form.querySelectorAll ('input[name="' + key + '"]');
              radios.forEach (function (r) {
                if (r.value === val) r.checked = true;
              });
            } else {
              el.value = val;
            }
          } catch (e) {}
        }
        try {
          form.dispatchEvent (new Event ('change', {bubbles: true}));
        } catch (e) {}
        return;
      }

      // Otherwise treat hash as a base64url token and try to populate
      try {
        window.formHelpers.populateFormFromToken (
          location.hash.replace (/^#/, ''),
          form
        );
      } catch (e) {}
    } catch (e) {
      console.error ('initPrefillFromURL error:', e);
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
      var btn = document.getElementById ('btn-add-key');
      if (!btn) return;

      var dialog = document.getElementById ('add-key-dialog');
      var input = dialog ? dialog.querySelector ('#add_key_input') : null;
      var closeBtn = dialog ? dialog.querySelector ('#add-key-close') : null;
      var submitBtn = dialog ? dialog.querySelector ('#add-key-submit') : null;
      var errorEl = dialog ? dialog.querySelector ('#add-key-error') : null;

      function openDialog () {
        try {
          if (!dialog) return;
          if (typeof dialog.showModal === 'function') dialog.showModal ();
          else dialog.setAttribute ('open', '');
        } catch (e) {
          dialog.setAttribute ('open', '');
        }
        if (input) {
          input.value = '';
          setTimeout (function () {
            input.focus ();
          }, 10);
        }
      }

      function closeDialog () {
        try {
          if (!dialog) return;
          if (typeof dialog.close === 'function') dialog.close ();
          else dialog.removeAttribute ('open');
        } catch (e) {
          dialog.removeAttribute ('open');
        }
      }

      function isValidToken (str) {
        if (!str) return false;
        var s = (str || '').replace (/^[#?]/, '').trim ();
        // Reject empty, whitespace, or query-style strings with '&'
        if (!s) return false;
        if (/\s/.test (s)) return false;
        if (s.indexOf ('&') !== -1) return false;
        // Accept anything else (be permissive so tokens that work in the URL are accepted)
        return true;
      }

      function applyFragment (fragment) {
        fragment = (fragment || '').replace (/^[#?]/, '');
        if (!fragment) return;
        try {
          if (history && history.replaceState) {
            var url = new URL (location.href);
            // write to the query string (search) so URL looks like ?token
            url.search = fragment ? '?' + fragment : '';
            history.replaceState ({}, document.title, url.toString ());
          } else {
            location.search = fragment ? '?' + fragment : '';
          }
        } catch (err) {
          try {
            location.search = fragment ? '?' + fragment : '';
          } catch (er) {}
        }
        var form =
          document.getElementById ('dime-form') ||
          document.querySelector ('form.calculator--form');
        if (!form) return;
        try {
          // populateFormFromToken now returns a Promise that resolves when populated
          var p = window.formHelpers.populateFormFromToken (fragment, form);
          if (p && typeof p.then === 'function') {
            p
              .then (function () {
                // Trigger the render/update functions if available
                try {
                  if (window.formDime) {
                    window.formDime.renderDebtOutput &&
                      window.formDime.renderDebtOutput (form);
                    window.formDime.renderIncomeOutput &&
                      window.formDime.renderIncomeOutput (form);
                    window.formDime.renderMortgageOutput &&
                      window.formDime.renderMortgageOutput (form);
                    window.formDime.renderEducationOutput &&
                      window.formDime.renderEducationOutput (form);
                    window.formDime.renderDimeOutput &&
                      window.formDime.renderDimeOutput (form);
                    window.formDime.renderCoverageNeed &&
                      window.formDime.renderCoverageNeed (form);
                  } else {
                    // fallback: submit the form programmatically to fire submit handlers
                    try {
                      form.dispatchEvent (
                        new Event ('submit', {bubbles: true})
                      );
                    } catch (e) {}
                  }
                } catch (err) {}
              })
              .catch (function () {
                // ignore
              });
          }
        } catch (e) {}
      }

      // Register click on main button to open the dialog (or fallback to prompt)
      btn.addEventListener (
        'click',
        function (e) {
          e.preventDefault ();
          if (!dialog) {
            // Fallback prompt: accept ONLY a full query string containing ct/iv/salt and that starts with 'ct='
            var val = window.prompt (
              'Paste full query (must start with "ct=...&iv=...&salt=..."):',
              ''
            );
            if (!val) return;
            var raw = val.trim ();
            // Strict: must start with ct= and include iv and salt
            if (
              !(raw.indexOf ('ct=') === 0 &&
                /ct=/.test (raw) &&
                /iv=/.test (raw) &&
                /salt=/.test (raw))
            ) {
              try {
                alert (
                  'Invalid input. Only encrypted ciphertext in the form "ct=...&iv=...&salt=..." is accepted.'
                );
              } catch (e) {}
              return;
            }
            var usp = new URLSearchParams (raw.replace (/^\?/, ''));
            var form =
              document.getElementById ('dime-form') ||
              document.querySelector ('form.calculator--form');
            // Use stored plaintext passphrase from localStorage only (sessionStorage contains hash, not usable for decryption)
            try {
              var pidx = form && form.getAttribute
                ? form.getAttribute ('data-protect-id') || 'default'
                : 'default';
              var storedPass = null;
              try {
                storedPass =
                  localStorage.getItem ('password_gate:' + pidx) || null;
              } catch (ee) {
                storedPass = null;
              }
              if (!storedPass) {
                try {
                  alert (
                    'No stored passphrase found in localStorage. Please unlock the protected content first before adding an encrypted key.'
                  );
                } catch (e) {}
                return;
              }
              window.formHelpers
                .tryDecryptSearchToForm (usp, storedPass, form)
                .then (function (ok) {
                  if (!ok) {
                    try {
                      alert ('Decryption failed');
                    } catch (e) {}
                    return;
                  }

                  // Track successful Add Key action
                  if (window.Tracking) {
                    window.Tracking.addKeySuccess ('prompt');
                  } else {
                    // Fallback if tracking module isn't loaded
                    try {
                      var userName = '';
                      try {
                        userName =
                          localStorage.getItem ('ga4_user_name') ||
                          sessionStorage.getItem ('ga4_user_name') ||
                          'anonymous';
                      } catch (e) {
                        userName = 'anonymous';
                      }

                      window.dataLayer = window.dataLayer || [];
                      window.dataLayer.push ({
                        event: 'add_key_success',
                        user_name: userName,
                        key_method: 'prompt',
                        event_category: 'engagement',
                        event_label: 'add_encrypted_key',
                      });
                    } catch (e) {
                      console.warn ('GA4 tracking error:', e);
                    }
                  }

                  // Auto-submit after decryption to trigger calculation
                  try {
                    form.dispatchEvent (new Event ('submit', {bubbles: true}));
                  } catch (e) {}
                });
            } catch (e) {
              try {
                alert ('Failed to apply key');
              } catch (err) {}
            }
            return;
          }
          openDialog ();
        },
        true
      );

      // Register dialog controls once
      if (closeBtn)
        closeBtn.addEventListener (
          'click',
          function () {
            closeDialog ();
          },
          true
        );
      if (dialog)
        dialog.addEventListener (
          'cancel',
          function (ev) {
            ev.preventDefault ();
            closeDialog ();
          },
          true
        );
      if (submitBtn && input) {
        submitBtn.addEventListener (
          'click',
          function (ev) {
            ev.preventDefault ();
            var v = (input.value || '').trim ();
            if (!v) {
              if (errorEl) {
                errorEl.style.display = 'block';
              }
              input && input.focus ();
              return;
            }
            // If user pasted a full query (ct/iv/salt), parse it and use stored passphrase from localStorage
            if (/ct=/.test (v) && /iv=/.test (v) && /salt=/.test (v)) {
              // require it to start with ct=
              var raw = v.replace (/^[#?]/, '').trim ();
              if (raw.indexOf ('ct=') !== 0) {
                if (errorEl) {
                  errorEl.style.display = 'block';
                  errorEl.textContent = 'Encrypted key must start with "ct="';
                }
                input && input.focus ();
                return;
              }
              var usp = new URLSearchParams (raw.replace (/^\?/, ''));
              var form =
                document.getElementById ('dime-form') ||
                document.querySelector ('form.calculator--form');
              try {
                var pidy = form && form.getAttribute
                  ? form.getAttribute ('data-protect-id') || 'default'
                  : 'default';
                var stored = null;
                try {
                  stored =
                    localStorage.getItem ('password_gate:' + pidy) || null;
                } catch (ee) {
                  stored = null;
                }
                if (!stored) {
                  if (errorEl) {
                    errorEl.style.display = 'block';
                    errorEl.textContent =
                      'No stored passphrase found. Please unlock the content first.';
                  }
                  input && input.focus ();
                  return;
                }
                window.formHelpers
                  .tryDecryptSearchToForm (usp, stored, form)
                  .then (function (ok) {
                    if (!ok) {
                      try {
                        alert ('Decryption failed');
                      } catch (e) {}
                      return;
                    }

                    // Track successful Add Key action
                    if (window.Tracking) {
                      window.Tracking.addKeySuccess ('dialog');
                    } else {
                      // Fallback if tracking module isn't loaded
                      try {
                        var userName = '';
                        try {
                          userName =
                            localStorage.getItem ('ga4_user_name') ||
                            sessionStorage.getItem ('ga4_user_name') ||
                            'anonymous';
                        } catch (e) {
                          userName = 'anonymous';
                        }

                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push ({
                          event: 'add_key_success',
                          user_name: userName,
                          key_method: 'dialog',
                          event_category: 'engagement',
                          event_label: 'add_encrypted_key',
                        });
                      } catch (e) {
                        console.warn ('GA4 tracking error:', e);
                      }
                    }

                    // Auto-submit after decryption to trigger calculation
                    try {
                      form.dispatchEvent (
                        new Event ('submit', {bubbles: true})
                      );
                    } catch (e) {}
                  });
              } catch (e) {
                if (errorEl) {
                  errorEl.style.display = 'block';
                }
              }
              closeDialog ();
              return;
            }
            // Anything else is invalid for Add Key (we only accept ct=... keys)
            if (errorEl) {
              errorEl.style.display = 'block';
              errorEl.textContent =
                'Invalid key. Paste encrypted ciphertext starting with "ct=...&iv=...&salt=...".';
            }
            input && input.focus ();
          },
          true
        );
        // allow Enter key inside input to submit
        input.addEventListener (
          'keydown',
          function (ev) {
            if (ev.key === 'Enter') {
              ev.preventDefault ();
              submitBtn.click ();
            }
          },
          true
        );
        // hide error when typing
        input.addEventListener (
          'input',
          function () {
            if (errorEl) errorEl.style.display = 'none';
          },
          true
        );
      }
    } catch (e) {
      console.error ('initAddKeyButton error:', e);
    }
  }

  window.formHelpers.initAddKeyButton = initAddKeyButton;

  // --- Notes button initializer ---
  function initNotesButton (root) {
    root = root || document;
    try {
      var buttons = Array.prototype.slice.call (
        root.querySelectorAll ('#btn-toggle-notes, .btn--notes-toggle')
      );
      buttons.forEach (function (btn) {
        if (btn.__notes_bound) return;
        btn.__notes_bound = true;
        btn.addEventListener (
          'click',
          function (e) {
            e.preventDefault ();
            e.stopPropagation ();
            // Allow explicit target via data-target-form, otherwise find the first calculator form
            var targetFormId =
              btn.getAttribute && btn.getAttribute ('data-target-form');
            var form = null;
            if (targetFormId) form = document.getElementById (targetFormId);
            if (!form)
              form =
                document.querySelector ('form.calculator--form') ||
                document.querySelector ('form');
            if (!form) return;
            try {
              // openNotes will gracefully return if no dialog/template is present
              window.formHelpers.openNotes (form);
            } catch (err) {}
          },
          true
        );
      });
    } catch (e) {}
  }

  window.formHelpers.initNotesButton = initNotesButton;
}) ();
