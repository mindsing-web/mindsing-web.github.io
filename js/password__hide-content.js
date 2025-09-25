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
    // We avoid storing plaintext passwords in the DOM. Prefer a hashed value
    // emitted as `data-protect-password-hash` on the <main> element. If a
    // plaintext option is provided (for backwards compatibility), it will be used.
    this.password = options.password || rootEl.getAttribute('data-password') || '';
  this.passwordHash = null;
  // Ensure a shared, in-memory store for password hashes so we can remove them from the DOM
  PasswordGate.hashStore = PasswordGate.hashStore || {};
    try {
      var main = rootEl.closest ? rootEl.closest('main') : document.querySelector('main');
      if (main && main.getAttribute) {
        try {
          var ph = main.getAttribute('data-protect-password-hash');
          var plain = main.getAttribute('data-protect-password');
          if (ph) {
            // store and remove from DOM to avoid exposing in inspector
            PasswordGate.hashStore[this.id] = PasswordGate.hashStore[this.id] || {};
            PasswordGate.hashStore[this.id].hash = ph;
            try { main.removeAttribute('data-protect-password-hash'); } catch (e) {}
            this.passwordHash = ph;
          } else if (plain) {
            PasswordGate.hashStore[this.id] = PasswordGate.hashStore[this.id] || {};
            PasswordGate.hashStore[this.id].plain = plain;
            try { main.removeAttribute('data-protect-password'); } catch (e) {}
            this.password = plain;
          }
        } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }
    this.buttonSelector = options.buttonSelector || '.btn--access-content';
    this.button = null;
    this.overlay = null;
    this.actionBar = document.querySelector('.action-bar');
    // Prefer any stored values from the in-memory hash store
    try {
      PasswordGate.hashStore = PasswordGate.hashStore || {};
      if (PasswordGate.hashStore[this.id]) {
        if (PasswordGate.hashStore[this.id].hash) this.passwordHash = PasswordGate.hashStore[this.id].hash;
        if (PasswordGate.hashStore[this.id].plain) this.password = PasswordGate.hashStore[this.id].plain;
      }
    } catch (ee) {}
    try { /* intentionally silent in production */ } catch (e) {}
    if (this.actionBar) {
      // ensure the action bar is hidden via CSS until JS reveals it
      this.actionBar.classList.add('pw-action-hidden');
      // detach it now so it doesn't flash (replace with placeholder)
      try {
        var abParent = this.actionBar.parentNode;
        if (abParent) {
          var abPlaceholder = document.createElement('div');
          abPlaceholder.className = 'pw-actionbar-placeholder';
          try { abParent.replaceChild(abPlaceholder, this.actionBar); } catch (e) { /* ignore */ }
          this._actionBarOriginal = this.actionBar;
          this._actionBarPlaceholder = abPlaceholder;
          this._actionBarDetached = true;
        }
      } catch (e) { /* ignore */ }
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
    // If we detached the node earlier, re-insert it first
    if (this._detached && this._placeholder && this._originalNode) {
      try {
        this._placeholder.parentNode.replaceChild(this._originalNode, this._placeholder);
        this.root = this._originalNode;
      } catch (e) { /* ignore */ }
    }
    this.root.style.display = '';
    this.root.removeAttribute('aria-hidden');
      // Reinsert the action bar if we detached it earlier
      if (this._actionBarDetached && this._actionBarPlaceholder && this._actionBarOriginal) {
        try {
          this._actionBarPlaceholder.parentNode.replaceChild(this._actionBarOriginal, this._actionBarPlaceholder);
          this.actionBar = this._actionBarOriginal;
        } catch (e) { /* ignore */ }
      }
      if (this.actionBar) {
        this.actionBar.classList.remove('pw-action-hidden');
      }
      try { document.body.classList.add('pw-unlocked'); } catch (e) {}
      // Flush any deferred info-tooltips so they can be inserted now
      try { if (window.formHelpers && typeof window.formHelpers.flushDeferredInfoTooltips === 'function') window.formHelpers.flushDeferredInfoTooltips(); } catch (e) {}
    try { document.body.classList.remove('pw-content-hidden'); } catch (e) {}
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
    // Detach the protected node from the DOM and replace with a lightweight placeholder
    try {
      if (!this._detached && this.root && this.root.parentNode) {
        var placeholder = document.createElement('div');
        placeholder.className = 'pw-protected-placeholder';
        placeholder.setAttribute('aria-hidden', 'true');
        try { this.root.parentNode.replaceChild(placeholder, this.root); } catch (e) { /* ignore */ }
        this._originalNode = this.root;
        this._placeholder = placeholder;
        this._detached = true;
      }
    } catch (e) { /* ignore */ }
    try { this.root.style.display = 'none'; } catch (e) {}
    try { this.root.setAttribute && this.root.setAttribute('aria-hidden', 'true'); } catch (e) {}
    if (this.button) {
      try { this.button.classList.remove('pw-access-visible'); } catch (e) {}
    }
    // re-hide the action bar until content is shown
    if (this.actionBar) this.actionBar.classList.add('pw-action-hidden');
  try { document.body.classList.remove('pw-unlocked'); } catch (e) {}
    // restore body-level hiding only if there are no access buttons explicitly visible
    try {
      var anyVisible = !!document.querySelector('.btn--access-content.pw-access-visible');
      if (!anyVisible) document.body.classList.add('pw-buttons-hidden');
      // ensure protected content remains hidden until explicitly revealed
      try { document.body.classList.add('pw-content-hidden'); } catch (e) {}
    } catch (e) {}
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
      (async function(){
        var ok = false;
        try {
          // If a hash was provided by the server, compute SHA-256 of entered value and compare
          if (self.passwordHash && window.crypto && window.crypto.subtle) {
            var enc = new TextEncoder().encode(val);
            var buf = await window.crypto.subtle.digest('SHA-256', enc);
            var hex = Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('00' + b.toString(16)).slice(-2); }).join('');
            if (hex === self.passwordHash) ok = true;
          } else {
            // fallback: compare plaintext if provided in options (back-compat)
            if (val === self.password) ok = true;
          }
        } catch (e) { ok = false; }

        if (ok) {
        self.setUnlocked(true);
        try { sessionStorage.setItem('password_gate:' + self.id, val); } catch (e) {}
        // Store password in localStorage for encrypted key operations
        try { localStorage.setItem('password_gate:' + self.id, val); } catch (e) {}
        cleanup();
        self.showContent();
      } else {
        err.textContent = 'Incorrect password';
        input.focus();
      }
    })();
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
      // It will be controlled by the body-level `pw-buttons-hidden` class and the
      // `pw-access-visible` class toggled below.
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
    // If the content is locked (not unlocked) reveal the button and make sure
    // body-level hiding class is removed so CSS can show explicit buttons.
    try {
      if (!this.isUnlocked()) {
        try { this.button.classList.add('pw-access-visible'); } catch (e) {}
        try { document.body.classList.remove('pw-buttons-hidden'); } catch (e) {}
      }
    } catch (e) {}
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
