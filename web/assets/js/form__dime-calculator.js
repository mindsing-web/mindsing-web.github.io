// DIME calculator specific behaviors (Debt output)
(function () {
  'use strict';
  function formatCurrency (val) {
    try {
      var n = Number (val) || 0;
      return n.toLocaleString ('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      });
    } catch (e) {
      return '$0';
    }
  }

  function computeDebtValue (form) {
    try {
      var ids = [
        'final_expenses',
        'credit_card_debts',
        'car_loans',
        'other_debts',
      ];
      var sum = 0;
      ids.forEach (function (id) {
        var el = form.querySelector ('#' + id);
        if (!el) return;
        var v = parseFloat (el.value);
        if (!isFinite (v)) v = 0;
        sum += v;
      });
      return sum;
    } catch (e) {
      console.error ('form__dime computeDebtValue error:', e);
      return 0;
    }
  }

  function renderDebtOutput (form) {
    try {
      var out = document.getElementById ('debt-output');
      if (!out) return;
      var value = computeDebtValue (form);
      out.innerHTML =
        '<p class="mb0"><strong>D =</strong> ' +
        formatCurrency (value) +
        '</p>' +
        '<p class="mt1 mb0"><small>Total debt and final expense protection</small></p>';
    } catch (e) {
      console.error ('form__dime renderDebtOutput error:', e);
    }
  }

  // --- Income calculation and output ---
  function computeIncomeValue (form) {
    try {
      var salaryEl = form.querySelector ('#annual_salary');
      var multEl = form.querySelector ('#income_multiplier');
      var salary = salaryEl ? parseFloat (salaryEl.value) : 0;
      var mult = multEl ? parseFloat (multEl.value) : 0;
      if (!isFinite (salary)) salary = 0;
      if (!isFinite (mult)) mult = 0;
      return salary * mult;
    } catch (e) {
      console.error ('form__dime computeIncomeValue error:', e);
      return 0;
    }
  }

  function renderIncomeOutput (form) {
    try {
      var out = document.getElementById ('income-output');
      if (!out) return;
      var value = computeIncomeValue (form);
      out.innerHTML =
        '<p class="mb0"><strong>I =</strong> ' +
        formatCurrency (value) +
        '</p>' +
        '<p class="mt1 mb0"><small>Income replacement target (annual salary × multiplier)</small></p>';
    } catch (e) {
      console.error ('form__dime renderIncomeOutput error:', e);
    }
  }

  // --- Mortgage calculation and output ---
  function computeMortgageValue (form) {
    try {
      var rentEl = form.querySelector ('#monthly_rent');
      var monthsEl = form.querySelector ('#months_rent');
      var mortEl = form.querySelector ('#mortgage_balance');
      var rent = rentEl ? parseFloat (rentEl.value) : 0;
      var months = monthsEl ? parseFloat (monthsEl.value) : 0;
      var mort = mortEl ? parseFloat (mortEl.value) : 0;
      if (!isFinite (rent)) rent = 0;
      if (!isFinite (months)) months = 0;
      if (!isFinite (mort)) mort = 0;
      return rent * months + mort;
    } catch (e) {
      console.error ('form__dime computeMortgageValue error:', e);
      return 0;
    }
  }

  function renderMortgageOutput (form) {
    try {
      var out = document.getElementById ('mortgage-output');
      if (!out) return;
      var value = computeMortgageValue (form);
      out.innerHTML =
        '<p class="mb0"><strong>M =</strong> ' +
        formatCurrency (value) +
        '</p>' +
        '<p class="mt1 mb0"><small>Provides basic living cost replacement protection</small></p>';
    } catch (e) {
      console.error ('form__dime renderMortgageOutput error:', e);
    }
  }

  // --- Education calculation and output ---
  function computeEducationValue (form) {
    try {
      var loansEl = form.querySelector ('#student_loans');
      var depEl = form.querySelector ('#dependent_education');
      var loans = loansEl ? parseFloat (loansEl.value) : 0;
      var dep = depEl ? parseFloat (depEl.value) : 0;
      if (!isFinite (loans)) loans = 0;
      if (!isFinite (dep)) dep = 0;
      return {loans: loans, dependent: dep, total: loans + dep};
    } catch (e) {
      console.error ('form__dime computeEducationValue error:', e);
      return {loans: 0, dependent: 0, total: 0};
    }
  }

  function renderEducationOutput (form) {
    try {
      var out = document.getElementById ('education-output');
      if (!out) return;
      var data = computeEducationValue (form);
      // Show E = total and a small breakdown
      out.innerHTML =
        '<p class="mb0"><strong>E =</strong> ' +
        formatCurrency (data.total) +
        '</p>' +
        '<p class="mt1 mb0"><small>Covers outstanding student loans and dependent education needs</small></p>';
    } catch (e) {
      console.error ('form__dime renderEducationOutput error:', e);
    }
  }

  // --- DIME total calculation and output ---
  function computeDimeValue (form) {
    try {
      var d = computeDebtValue (form);
      var i = computeIncomeValue (form);
      var m = computeMortgageValue (form);
      var e = computeEducationValue (form).total || 0;
      return d + i + m + e;
    } catch (e) {
      console.error ('form__dime computeDimeValue error:', e);
      return 0;
    }
  }

  function renderDimeOutput (form) {
    try {
      var out = document.getElementById ('dime-output');
      if (!out) return;
      var value = computeDimeValue (form);
      out.innerHTML =
        '<h3 class="mb0 underline">DIME Coverage Target = <em>' +
        formatCurrency (value) +
        '</em></h3>' +
        '<p class="mt1 mb0"><small>Combined total of debt, income replacement, mortgage, and education needs</small></p>';
    } catch (e) {
      console.error ('form__dime renderDimeOutput error:', e);
    }
  }

  // --- Coverage need calculation (DIME target - in-force)
  function computeCoverageNeed (form) {
    try {
      var target = computeDimeValue (form) || 0;
      var inForceEl = form.querySelector ('#current_insurance');
      var inForce = inForceEl ? parseFloat (inForceEl.value) : 0;
      if (!isFinite (inForce)) inForce = 0;
      var need = target - inForce;
      if (!isFinite (need) || need < 0) need = 0;
      return {target: target, inForce: inForce, need: need};
    } catch (e) {
      console.error ('form__dime computeCoverageNeed error:', e);
      return {target: 0, inForce: 0, need: 0};
    }
  }

  function renderCoverageNeed (form) {
    try {
      var out = document.getElementById ('coverage-need-output');
      if (!out) return;
      var data = computeCoverageNeed (form);
      out.innerHTML =
        '<h2 class="mb0"><u>Total Coverage Need = <em>' +
        formatCurrency (data.need) +
        '</em></u></h2>' +
        '<p class="mt1 mb0"><small>DIME Coverage Target (' +
        formatCurrency (data.target) +
        ') - in-force (' +
        formatCurrency (data.inForce) +
        ') = Total Coverage Need</small></p>';
    } catch (e) {
      console.error ('form__dime renderCoverageNeed error:', e);
    }
  }

  // Collapse the form to a compact summary after calculation
  function collapseToSummary(form) {
    try {
      if (!form) return;
      if (form.getAttribute('data-dime-collapsed') === 'true') return;
      // compute values
      var d = computeDebtValue(form);
      var i = computeIncomeValue(form);
      var m = computeMortgageValue(form);
      var e = computeEducationValue(form).total || 0;
      var coverage = computeCoverageNeed(form);
      // create spinner outside the form so it stays visible when form is hidden
      var spinner = document.createElement('div');
      spinner.className = 'dime-spinner mw7 center pa3';
      spinner.setAttribute('role','status');
      spinner.style.textAlign = 'center';
      spinner.textContent = 'Calculating...';
      try { form.parentNode.insertBefore(spinner, form); } catch (e) { /* ignore */ }

      // store original display value for the form
      try { form.dataset.dimeOrigDisplay = form.style.display || ''; } catch (e) {}

      // small delay to show spinner
      setTimeout(function(){
        try { form.style.display = 'none'; } catch (e) {}

        // build summary
        var s = document.createElement('div');
        s.id = 'dime-summary';
        s.className = 'mw7 center pa3';
        s.style.opacity = '0';
        s.style.transition = 'opacity 300ms ease';
        var html = '';
        html += '<p class="mb1"><strong>D =</strong> ' + formatCurrency(d) + '</p>';
        html += '<p class="mb1"><strong>I =</strong> ' + formatCurrency(i) + '</p>';
        html += '<p class="mb1"><strong>M =</strong> ' + formatCurrency(m) + '</p>';
        html += '<p class="mb2"><strong>E =</strong> ' + formatCurrency(e) + '</p>';
        if (coverage && coverage.inForce && coverage.inForce > 0) {
          // When there is an existing in-force policy, show the DIME Target above it
          if (typeof coverage.target !== 'undefined') {
            html += '<p class="mb1"><small>DIME Target: ' + formatCurrency(coverage.target) + '</small></p>';
          }
          html += '<p class="mb1"><small>Current in-force: ' + formatCurrency(coverage.inForce) + '</small></p>';
        }
        // Always show the Life Insurance Target (total need)
        html += '<h3 class="mt2 mb1">Life Insurance Target: ' + formatCurrency(coverage ? coverage.need : computeDimeValue(form)) + '</h3>';
  // Buttons row: copy left, show details right (secondary)
  html += '<div class="mt3" style="display:flex; justify-content:space-between; align-items:center;">';
  html += '<div class="">';
  html += '<button id="btn-copy-target" class="btn btn--primary">Copy to clipboard</button>';
  html += '</div>';
  html += '<div class="">';
  html += '<button id="btn-show-details" class="btn btn--secondary">Show details</button>';
  html += '</div>';
  html += '</div>';
        // Display the token/key underneath
        var keyDisplay = '';
        try {
          var token = '';
          // prefer query string token if present
          try { token = (location.search || '').replace(/^\?/, ''); } catch (e) { token = ''; }
          if (!token && window.formHelpers && typeof window.formHelpers.getTokenFromForm === 'function') {
            try { token = window.formHelpers.getTokenFromForm(form) || ''; } catch (e) { token = ''; }
          }
          if (token) keyDisplay = token;
        } catch (e) { keyDisplay = ''; }
        if (keyDisplay) {
          html += '<p class="mt2 mb0"><small>Insurance target key: <code id="dime-summary-key">' + escapeHtml(keyDisplay) + '</code></small></p>';
        }
        s.innerHTML = html;

        // insert summary where the form was
        try { form.parentNode.insertBefore(s, form.nextSibling); } catch (e) {}
        // remove spinner
        try { spinner.parentNode && spinner.parentNode.removeChild(spinner); } catch (e) {}
        setTimeout(function(){ s.style.opacity = '1'; }, 20);

        form.setAttribute('data-dime-collapsed','true');

        // hook show details
        var showBtn = document.getElementById('btn-show-details');
        if (showBtn) showBtn.addEventListener('click', function(){ expandFromSummary(form); }, true);
        // hook copy to clipboard
        var copyBtn = document.getElementById('btn-copy-target');
        if (copyBtn) {
          copyBtn.addEventListener('click', function(){
            try {
              var txt = '';
              var el = document.getElementById('dime-summary-key');
              if (el) txt = (el.textContent || el.innerText || '').trim();
              if (!txt) {
                // try parse token= from query string
                try {
                  var qs = (location.search || '').replace(/^\?/, '');
                  var params = qs.split('&').reduce(function(acc, p){
                    var parts = p.split('=');
                    if (parts.length === 1) return acc;
                    acc[decodeURIComponent(parts[0])] = decodeURIComponent(parts.slice(1).join('='));
                    return acc;
                  }, {});
                  if (params.token) txt = params.token;
                  else if (params.key) txt = params.key;
                  else txt = qs || '';
                } catch (e) { txt = (location.search || '').replace(/^\?/, ''); }
              }
              if (!txt && window.formHelpers && typeof window.formHelpers.getTokenFromForm === 'function') {
                try { txt = window.formHelpers.getTokenFromForm(form) || ''; } catch (e) { txt = ''; }
              }
              if (!txt) return;
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(txt).then(function(){
                  copyBtn.textContent = 'Copied';
                  setTimeout(function(){ copyBtn.textContent = 'Copy to clipboard'; }, 2000);
                }).catch(function(){
                  // fallback
                  fallbackCopyTextToClipboard(txt, copyBtn);
                });
              } else {
                fallbackCopyTextToClipboard(txt, copyBtn);
              }
            } catch (e) {
              try { console.error('copy error', e); } catch (err) {}
            }
          }, true);
        }
      }, 300);
    } catch (e) {
      console.error('collapseToSummary error:', e);
    }
  }

  function expandFromSummary(form) {
    try {
      if (!form) return;
      if (form.getAttribute('data-dime-collapsed') !== 'true') return;
      var summary = document.getElementById('dime-summary');
      if (summary && summary.parentNode) summary.parentNode.removeChild(summary);
      // restore form display
      try {
        var orig = form.dataset && form.dataset.dimeOrigDisplay;
        form.style.display = (typeof orig !== 'undefined') ? orig : '';
        try { delete form.dataset.dimeOrigDisplay; } catch (e) {}
      } catch (e) {}
      form.removeAttribute('data-dime-collapsed');
    } catch (e) {
      console.error('expandFromSummary error:', e);
    }
  }

  // Simple HTML escape helper for injecting token text
  function escapeHtml (str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Fallback copy for older browsers
  function fallbackCopyTextToClipboard(text, btn) {
    try {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      var selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : null;
      textarea.select();
      try {
        var ok = document.execCommand('copy');
        if (ok && btn) {
          var old = btn.textContent;
          btn.textContent = 'Copied';
          setTimeout(function(){ try { btn.textContent = old; } catch(e){} }, 2000);
        }
      } catch (err) {
        // give up quietly
      }
      document.body.removeChild(textarea);
      if (selected) {
        try { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } catch (e) {}
      }
    } catch (e) {}
  }

  function initDebtOutput (root) {
    root = root || document;
    try {
      var form = root.querySelector ('#dime-form');
      if (!form) return;
      // Listen for form cleared event to reset outputs
      form.addEventListener (
        'form:cleared',
        function () {
          try {
            var ids = [
              'debt-output',
              'income-output',
              'mortgage-output',
              'education-output',
              'dime-output',
              'coverage-need-output',
            ];
            ids.forEach (function (id) {
              var el = document.getElementById (id);
              if (el) el.innerHTML = '';
            });
          } catch (e) {
            console.error ('form__dime clear outputs error:', e);
          }
        },
        true
      );
      renderDebtOutput (form);
      var ids = [
        'final_expenses',
        'credit_card_debts',
        'car_loans',
        'other_debts',
      ];
      ids.forEach (function (id) {
        var el = form.querySelector ('#' + id);
        if (!el) return;
        el.addEventListener (
          'blur',
          function () {
            renderDebtOutput (form);
          },
          true
        );
        el.addEventListener (
          'change',
          function () {
            renderDebtOutput (form);
          },
          true
        );
      });

      // Init income output and handlers
      renderIncomeOutput (form);
      var salary = form.querySelector ('#annual_salary');
      var mult = form.querySelector ('#income_multiplier');
      if (salary) {
        salary.addEventListener (
          'blur',
          function () {
            renderIncomeOutput (form);
          },
          true
        );
        salary.addEventListener (
          'change',
          function () {
            renderIncomeOutput (form);
          },
          true
        );
      }
      if (mult) {
        mult.addEventListener (
          'blur',
          function () {
            renderIncomeOutput (form);
          },
          true
        );
        mult.addEventListener (
          'change',
          function () {
            renderIncomeOutput (form);
          },
          true
        );
      }

      // Init mortgage output and handlers
      renderMortgageOutput (form);
      var rent = form.querySelector ('#monthly_rent');
      var months = form.querySelector ('#months_rent');
      var mort = form.querySelector ('#mortgage_balance');
      if (rent) {
        rent.addEventListener (
          'blur',
          function () {
            renderMortgageOutput (form);
          },
          true
        );
        rent.addEventListener (
          'change',
          function () {
            renderMortgageOutput (form);
          },
          true
        );
      }
      if (months) {
        months.addEventListener (
          'blur',
          function () {
            renderMortgageOutput (form);
          },
          true
        );
        months.addEventListener (
          'change',
          function () {
            renderMortgageOutput (form);
          },
          true
        );
      }
      if (mort) {
        mort.addEventListener (
          'blur',
          function () {
            renderMortgageOutput (form);
          },
          true
        );
        mort.addEventListener (
          'change',
          function () {
            renderMortgageOutput (form);
          },
          true
        );
      }

      // Init education output and handlers
      renderEducationOutput (form);
      var loans = form.querySelector ('#student_loans');
      var depEdu = form.querySelector ('#dependent_education');
      if (loans) {
        loans.addEventListener (
          'blur',
          function () {
            renderEducationOutput (form);
          },
          true
        );
        loans.addEventListener (
          'change',
          function () {
            renderEducationOutput (form);
          },
          true
        );
      }
      if (depEdu) {
        depEdu.addEventListener (
          'blur',
          function () {
            renderEducationOutput (form);
          },
          true
        );
        depEdu.addEventListener (
          'change',
          function () {
            renderEducationOutput (form);
          },
          true
        );
      }

      // Init DIME combined output and wire updates when any section updates
      renderDimeOutput (form);
      renderCoverageNeed (form);
      var allIds = [
        'final_expenses',
        'credit_card_debts',
        'car_loans',
        'other_debts',
        'annual_salary',
        'income_multiplier',
        'monthly_rent',
        'months_rent',
        'mortgage_balance',
        'student_loans',
        'dependent_education',
        'current_insurance',
      ];
      allIds.forEach (function (id) {
        var el = form.querySelector ('#' + id);
        if (!el) return;
        el.addEventListener (
          'blur',
          function () {
            renderDimeOutput (form);
            renderCoverageNeed (form);
          },
          true
        );
        el.addEventListener (
          'change',
          function () {
            renderDimeOutput (form);
            renderCoverageNeed (form);
          },
          true
        );
      });

      // When the form is submitted (Calculate), encode visible values into the URL hash
      form.addEventListener (
        'submit',
        async function (e) {
          try {
            e.preventDefault ();
            var salt = form.getAttribute ('data-token-salt') || null;
            if (
              window.formHelpers &&
              typeof window.formHelpers.createTokenFromForm === 'function'
            ) {
              var token = await window.formHelpers.createTokenFromForm (form, {
                salt: salt,
              });
              if (typeof window.formHelpers.writeTokenToQuery === 'function') {
                window.formHelpers.writeTokenToQuery (token);
              } else {
                try {
                  location.search = token;
                } catch (err) {}
              }
            }
            renderDebtOutput (form);
            renderIncomeOutput (form);
            renderMortgageOutput (form);
            renderEducationOutput (form);
            renderDimeOutput (form);
            renderCoverageNeed (form);
            // remove focus/active state from the submit button so visual "active" styles clear
            try {
              var active = document.activeElement;
              if (active && (active.tagName === 'BUTTON' || active.tagName === 'INPUT')) {
                try { active.blur(); } catch (e) {}
              }
              // Also ensure the form's submit button is blurred as a fallback
              try {
                var submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.blur();
              } catch (e) {}
            } catch (err) {}
            // delayed fallback: blur again after a short timeout to clear any lingering active styles
            try {
              setTimeout(function () {
                try {
                  var a = document.activeElement;
                  if (a && (a.tagName === 'BUTTON' || a.tagName === 'INPUT')) try { a.blur(); } catch (e) {}
                  var sb = form.querySelector('button[type="submit"]');
                  if (sb) try { sb.blur(); } catch (e) {}
                } catch (e) {}
              }, 50);
            } catch (e) {}
            // Collapse to compact summary after calculation
            try {
              collapseToSummary(form);
            } catch (e) {}
          } catch (err) {
            console.error ('form__dime submit handler error:', err);
          }
        },
        true
      );
      // mark as bound so delegated handler can skip duplicate work
      try {
        form.setAttribute ('data-dime-handler-bound', 'true');
      } catch (e) {}

      // Notes dialog (uses <dialog>)
      try {
  // Notes toggle button may be inside the form or injected elsewhere (layout partial).
  var notesBtn = form.querySelector('#btn-toggle-notes') || document.getElementById('btn-toggle-notes') || document.querySelector('.btn--notes-toggle');
  var notesDialog = document.getElementById('notes-dialog');
        var notesClose = notesDialog
          ? notesDialog.querySelector ('#notes-close')
          : null;
        var notesSave = notesDialog
          ? notesDialog.querySelector ('#notes-save')
          : null;
        var notesTextarea = notesDialog
          ? notesDialog.querySelector ('#notes_dime')
          : form.querySelector ('#notes_dime');

        function openNotes () {
          if (!notesDialog) return;
          try {
            if (typeof notesDialog.showModal === 'function')
              notesDialog.showModal ();
            else notesDialog.setAttribute ('open', '');
          } catch (e) {
            notesDialog.setAttribute ('open', '');
          }
          if (notesBtn) notesBtn.setAttribute ('aria-expanded', 'true');
          if (notesTextarea) {
            // move cursor to end
            notesTextarea.focus ();
            var val = notesTextarea.value || '';
            notesTextarea.selectionStart = notesTextarea.selectionEnd =
              val.length;
          }
        }

        function closeNotes () {
          if (!notesDialog) return;
          try {
            if (typeof notesDialog.close === 'function') notesDialog.close ();
            else notesDialog.removeAttribute ('open');
          } catch (e) {
            notesDialog.removeAttribute ('open');
          }
          if (notesBtn) notesBtn.setAttribute ('aria-expanded', 'false');
        }

        if (notesBtn) {
          notesBtn.addEventListener (
            'click',
            function () {
              openNotes ();
            },
            true
          );
        }

        if (notesClose) {
          notesClose.addEventListener (
            'click',
            function () {
              closeNotes ();
            },
            true
          );
        }

        if (notesSave) {
          notesSave.addEventListener (
            'click',
            function () {
              closeNotes ();
            },
            true
          );
        }

        // close notes when form cleared
        form.addEventListener (
          'form:cleared',
          function () {
            closeNotes ();
          },
          true
        );

        // close dialog on Escape for browsers that support it
        if (notesDialog) {
          notesDialog.addEventListener (
            'cancel',
            function (ev) {
              ev.preventDefault ();
              closeNotes ();
            },
            true
          );
        }
      } catch (e) {
        console.error ('form__dime notes dialog init error', e);
      }
    } catch (e) {
      console.error ('form__dime initDebtOutput error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener ('DOMContentLoaded', function () {
      initDebtOutput (document);
    });
  } else {
    initDebtOutput (document);
  }

  // Delegated submit listener: handle submits for forms that weren't bound (e.g., revealed later)
  document.addEventListener (
    'submit',
    async function (e) {
      try {
        var form = e.target;
        if (!form || form.id !== 'dime-form') return;
        // if already bound skip
        if (
          form.getAttribute &&
          form.getAttribute ('data-dime-handler-bound') === 'true'
        )
          return;
        e.preventDefault ();
        var salt = form.getAttribute ('data-token-salt') || null;
        if (
          window.formHelpers &&
          typeof window.formHelpers.createTokenFromForm === 'function'
        ) {
          try {
            var token = await window.formHelpers.createTokenFromForm (form, {
              salt: salt,
            });
            if (typeof window.formHelpers.writeTokenToQuery === 'function') {
              window.formHelpers.writeTokenToQuery (token);
            } else {
              try {
                location.search = token;
              } catch (err) {}
            }
          } catch (err) {}
        }
        try {
          if (window.formDime && typeof window.formDime.renderDebtOutput === 'function') {
            window.formDime.renderDebtOutput(form);
          }
          if (window.formDime && typeof window.formDime.renderIncomeOutput === 'function') {
            window.formDime.renderIncomeOutput(form);
          }
          if (window.formDime && typeof window.formDime.renderMortgageOutput === 'function') {
            window.formDime.renderMortgageOutput(form);
          }
          if (window.formDime && typeof window.formDime.renderEducationOutput === 'function') {
            window.formDime.renderEducationOutput(form);
          }
          if (window.formDime && typeof window.formDime.renderDimeOutput === 'function') {
            window.formDime.renderDimeOutput(form);
          }
          if (window.formDime && typeof window.formDime.renderCoverageNeed === 'function') {
            window.formDime.renderCoverageNeed(form);
          }
          // remove focus/active state from the submit button so visual "active" styles clear
          try {
            var active = document.activeElement;
            if (active && (active.tagName === 'BUTTON' || active.tagName === 'INPUT')) {
              try { active.blur(); } catch (e) {}
            }
            try {
              var submitBtn = form.querySelector('button[type="submit"]');
              if (submitBtn) submitBtn.blur();
            } catch (e) {}
          } catch (err) {}
          // delayed fallback: blur again after a short timeout to clear any lingering active styles
          try {
            setTimeout(function () {
              try {
                var a = document.activeElement;
                if (a && (a.tagName === 'BUTTON' || a.tagName === 'INPUT')) try { a.blur(); } catch (e) {}
                var sb = form.querySelector('button[type="submit"]');
                if (sb) try { sb.blur(); } catch (e) {}
              } catch (e) {}
            }, 50);
          } catch (e) {}
        } catch (err) {
          console.error('form__dime delegated submit handler error:', err);
        }
      } catch (err) {
        console.error('form__dime delegated submit listener error:', err);
      }
    },
    true
  );

  // expose for tests or manual init
  window.formDime = {
    initDebtOutput: initDebtOutput,
    computeDebtValue: computeDebtValue,
    renderDebtOutput: renderDebtOutput,
    computeIncomeValue: computeIncomeValue,
    renderIncomeOutput: renderIncomeOutput,
    computeMortgageValue: computeMortgageValue,
    renderMortgageOutput: renderMortgageOutput,
    computeEducationValue: computeEducationValue,
    renderEducationOutput: renderEducationOutput,
    collapseToSummary: collapseToSummary,
    expandFromSummary: expandFromSummary,
  };
}) ();
