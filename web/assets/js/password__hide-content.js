// PasswordGate - simple client-side password gate (not secure) using localStorage
(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function createEl(tag, attrs, text) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    if (text) el.textContent = text;
    return el;
  }

  // PasswordGate class
  function PasswordGate(rootEl, options) {
    options = options || {};
    this.root = rootEl;
    this.id = options.id || rootEl.getAttribute('data-protect-id') || 'default';
    this.storageKey = 'password_gate_unlocked:' + this.id;
    this.password = options.password || rootEl.getAttribute('data-password') || '';
    if (!this.password) {
      try {
        var main = rootEl.closest ? rootEl.closest('main') : document.querySelector('main');
        if (main && main.getAttribute) {
          this.password = main.getAttribute('data-protect-password') || this.password;
        }
      } catch (e) { /* ignore */ }
    }
    this.buttonSelector = options.buttonSelector || '.btn--access-content';
    this.button = null;
    this.overlay = null;
    this.actionBar = document.getElementById('action-bar');
    console.log('PasswordGate: actionBar found:', this.actionBar);
    if (this.actionBar) {
      this.actionBar.style.visibility = 'hidden';
    }
    this.init();
  }

  PasswordGate.prototype.isUnlocked = function () {
    try { return localStorage.getItem(this.storageKey) === '1'; } catch (e) { return false; }
  };

  PasswordGate.prototype.setUnlocked = function (val) {
    try { if (val) localStorage.setItem(this.storageKey, '1'); else localStorage.removeItem(this.storageKey); } catch (e) {}
  };

  PasswordGate.prototype.showContent = function () {
    this.root.style.display = '';
    this.root.removeAttribute('aria-hidden');
    if (this.actionBar) {
      this.actionBar.style.visibility = 'visible';
    }
    if (!this.button) return;
    try {
      var wrapper = null;
      try { wrapper = this.button.closest ? this.button.closest('.password-access-wrapper') : null; } catch (er) { wrapper = null; }

      if (wrapper && wrapper.parentNode) {
        // remove wrapper if present
        if (wrapper.remove) wrapper.remove(); else wrapper.parentNode.removeChild(wrapper);
      } else {
        // remove the button itself
        var parent = this.button.parentNode;
        try { if (this.button.remove) this.button.remove(); else if (parent) parent.removeChild(this.button); } catch (er) { /* ignore */ }
        // if parent now empty (no element children and no non-whitespace text), remove it
        try {
          if (parent && parent.parentNode) {
            var isEmpty = true;
            for (var i = 0; i < parent.childNodes.length; i++) {
              var n = parent.childNodes[i];
              if (n.nodeType === 1) { isEmpty = false; break; }
              if (n.nodeType === 3 && (n.textContent || '').trim() !== '') { isEmpty = false; break; }
            }
            if (isEmpty) {
              if (parent.remove) parent.remove(); else parent.parentNode.removeChild(parent);
            }
          }
        } catch (er) { /* ignore */ }
      }
    } catch (e) {
      try { this.button.style.display = 'none'; } catch (er) { /* ignore */ }
    }
    this.button = null;
  };

  PasswordGate.prototype.hideContent = function () {
    this.root.style.display = 'none';
    this.root.setAttribute('aria-hidden', 'true');
    if (this.button) this.button.style.display = '';
  };

  PasswordGate.prototype.buildOverlay = function () {
    var self = this;
    var overlay = createEl('div', { 'class': 'password-gate-overlay', 'role': 'dialog', 'aria-modal': 'true' });
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.zIndex = 30000;

    var box = createEl('div', { 'class': 'password-gate-box' });
    box.style.background = '#fff';
    box.style.padding = '20px';
    box.style.borderRadius = '6px';
    box.style.maxWidth = '420px';
    box.style.width = '90%';
    box.style.boxShadow = '0 6px 24px rgba(0,0,0,0.3)';

    var h = createEl('h3', {}, 'Enter password to access content');
    h.style.marginTop = '0';
    var p = createEl('p', {}, 'This content is password protected.');

    var input = createEl('input', { 'type': 'password', 'class': 'password-gate-input', 'aria-label': 'Password' });
    input.style.width = '100%';
    input.style.padding = '8px 10px';
    input.style.marginTop = '8px';
    input.style.boxSizing = 'border-box';

    var err = createEl('div', { 'class': 'password-gate-error' });
    err.style.color = 'red';
    err.style.minHeight = '18px';
    err.style.marginTop = '8px';

    var controls = createEl('div', { 'class': 'password-gate-controls' });
    controls.style.marginTop = '12px';
    controls.style.textAlign = 'right';

    var cancel = createEl('button', { 'type': 'button', 'class': 'btn btn--secondary password-gate-cancel' }, 'Cancel');
    var ok = createEl('button', { 'type': 'button', 'class': 'btn btn--primary password-gate-ok' }, 'Enter');
    cancel.style.marginRight = '8px';

    controls.appendChild(cancel);
    controls.appendChild(ok);
    box.appendChild(h);
    box.appendChild(p);
    box.appendChild(input);
    box.appendChild(err);
    box.appendChild(controls);
    overlay.appendChild(box);

    function cleanup() {
      try { document.body.removeChild(overlay); } catch (e) {}
      document.removeEventListener('keydown', onKey, true);
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        cleanup();
      }
      if (e.key === 'Enter') {
        ok.click();
      }
    }

    cancel.addEventListener('click', function () { cleanup(); });
    ok.addEventListener('click', function () {
      var val = input.value || '';
      if (val === self.password) {
        self.setUnlocked(true);
        cleanup();
        self.showContent();
      } else {
        err.textContent = 'Incorrect password';
        input.focus();
      }
    });

    document.addEventListener('keydown', onKey, true);

    return overlay;
  };

  PasswordGate.prototype.init = function () {
    var self = this;
    // find button with matching data-protect-id if present
    var btn = null;
    try { btn = document.querySelector(this.buttonSelector + '[data-protect-id="' + this.id + '"]') || document.querySelector(this.buttonSelector); } catch (e) { }
    this.button = btn;

    // ensure root is hidden until unlocked
    if (this.isUnlocked()) {
      this.showContent();
      return;
    }

    this.hideContent();

    if (!this.button) {
      // create an access button and insert before the root
      var b = createEl('button', { 'type': 'button', 'class': 'btn btn--primary btn--access-content', 'data-protect-id': this.id }, 'Access Content');
      this.button = b;
      try { this.root.parentNode.insertBefore(b, this.root); } catch (e) {}
    }

    this.button.addEventListener('click', function (e) {
      e.preventDefault();
      // show overlay
      try {
        self.overlay = self.buildOverlay();
        document.body.appendChild(self.overlay);
        var input = self.overlay.querySelector('.password-gate-input');
        input && input.focus();
      } catch (err) { console.error('PasswordGate open error', err); }
    }, true);
  };

  // Auto-init for elements with class js-password-protected
  function autoInit() {
    $all('.js-password-protected').forEach(function (el) {
      try {
        var opts = { id: el.getAttribute('data-protect-id') || undefined, buttonSelector: '.btn--access-content' };
        var pw = el.getAttribute('data-password');
        if (pw) opts.password = pw;
        new PasswordGate(el, opts);
      } catch (e) { console.error('PasswordGate init error', e); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit); else autoInit();

  // expose for manual use
  window.PasswordGate = PasswordGate;

})();
