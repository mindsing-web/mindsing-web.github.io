// Appends a required asterisk to labels for required inputs, selects and textareas.
(function () {
  function addAsterisks(root) {
    root = root || document;
    try {
      var selectors = 'input[required], select[required], textarea[required]';
      var els = root.querySelectorAll(selectors);
      els.forEach(function (el) {
        var id = el.id;
        var label = id ? document.querySelector('label[for="' + id + '"]') : null;
        // If no label with for=, try to find a parent label (label > input)
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
      // fail silently
      console.error('required-asterisk error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { addAsterisks(document); });
  } else {
    addAsterisks(document);
  }

  // Expose for dynamic content to call after injection
  window.addRequiredAsterisks = addAsterisks;
})();
