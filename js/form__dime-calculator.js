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
  function collapseToSummary (form) {
    try {
      if (!form) return;
      if (form.getAttribute ('data-dime-collapsed') === 'true') return;
      // compute values
      var d = computeDebtValue (form);
      var i = computeIncomeValue (form);
      var m = computeMortgageValue (form);
      var e = computeEducationValue (form).total || 0;
      var coverage = computeCoverageNeed (form);
      // create spinner outside the form so it stays visible when form is hidden
      var spinner = document.createElement ('div');
      spinner.className = 'dime-spinner mw7 center pa3';
      spinner.setAttribute ('role', 'status');
      spinner.style.textAlign = 'center';
      spinner.textContent = 'Calculating...';
      try {
        form.parentNode.insertBefore (spinner, form);
      } catch (e) {
        /* ignore */
      }

      // store original display value for the form
      try {
        form.dataset.dimeOrigDisplay = form.style.display || '';
      } catch (e) {}

      // small delay to show spinner
      setTimeout (function () {
        try {
          form.style.display = 'none';
        } catch (e) {}

        // build summary
        var s = document.createElement ('div');
        s.id = 'dime-summary';
        s.className = 'mw7 center pa3';
        s.style.opacity = '0';
        s.style.transition = 'opacity 300ms ease';
        var html = '';
        html +=
          '<p class="mb1"><strong>D =</strong> ' +
          formatCurrency (d) +
          ' <small>(Debt)</small></p>';
        html +=
          '<p class="mb1"><strong>I =</strong> ' +
          formatCurrency (i) +
          ' <small>(Income)</small></p>';
        html +=
          '<p class="mb1"><strong>M =</strong> ' +
          formatCurrency (m) +
          ' <small>(Mortgage)</small></p>';
        html +=
          '<p class="mb2"><strong>E =</strong> ' +
          formatCurrency (e) +
          ' <small>(Education)</small></p>';
        if (coverage && coverage.inForce && coverage.inForce > 0) {
          // When there is an existing in-force policy, show the DIME Target above it
          if (typeof coverage.target !== 'undefined') {
            // Underline the DIME Target and italicize the dollar amount
            html +=
              '<p class="mb1"><small><u>DIME Target: <em>' +
              formatCurrency (coverage.target) +
              '</em></u></small></p>';
          }
          html +=
            '<p class="mb1"><small>Current in-force: ' +
            formatCurrency (coverage.inForce) +
            '</small></p>';
        }
        // Always show the Life Insurance Target (total need) with extra padding above
        html +=
          '<h3 class="mt4 mb1">Life Insurance Target: ' +
          formatCurrency (coverage ? coverage.need : computeDimeValue (form)) +
          '</h3>';
        // Buttons row: copy left, show details right (secondary)
        html +=
          '<div class="mt3" style="display:flex; justify-content:space-between; align-items:center;">';
        html += '<div class="">';
        html +=
          '<button id="btn-copy-target" class="btn btn--primary">Copy to clipboard</button>';
        html += '</div>';
        html += '<div class="">';
        html +=
          '<button id="btn-show-details" class="btn btn--secondary">Show details</button>';
        html += '</div>';
        html += '</div>';
        // Display the token/key underneath
        var keyDisplay = '';
        try {
          var token = '';
          // prefer query string token if present
          try {
            token = (location.search || '').replace (/^\?/, '');
          } catch (e) {
            token = '';
          }
          if (
            !token &&
            window.formHelpers &&
            typeof window.formHelpers.getTokenFromForm === 'function'
          ) {
            try {
              token = window.formHelpers.getTokenFromForm (form) || '';
            } catch (e) {
              token = '';
            }
          }
          if (token) keyDisplay = token;
        } catch (e) {
          keyDisplay = '';
        }
        if (keyDisplay) {
          html += '<p class="mt2 mb0"><small>Insurance target key:</small></p>';
          html +=
            '<p class="mt0 mb0"><code class="summary-key" style="user-select: all;">' +
            escapeHtml (keyDisplay) +
            '</code></p>';
          // Also show any saved notes below the insurance key
          try {
            var notesText = '';
            var notesEl =
              form.querySelector ('#notes_dime') ||
              document.getElementById ('notes_dime');
            if (notesEl) notesText = (notesEl.value || '').trim ();
            if (notesText) {
              html +=
                '<p class="mt1 mb0 summary-notes"><small>Notes: ' +
                escapeHtml (notesText).replace (/\n/g, '<br>') +
                '</small></p>';
            }
          } catch (e) {
            // ignore notes rendering errors
          }
        }
        s.innerHTML = html;

        // insert summary where the form was
        try {
          form.parentNode.insertBefore (s, form.nextSibling);
        } catch (e) {}
        // remove spinner
        try {
          spinner.parentNode && spinner.parentNode.removeChild (spinner);
        } catch (e) {}
        // hide calculator home button on summary view
        try {
          var homeButton = document.querySelector ('a[href="/calculator/"]');
          if (homeButton) {
            homeButton.style.display = 'none';
            homeButton.style.setProperty ('display', 'none', 'important');
            // Also hide the parent paragraph
            if (homeButton.parentElement) {
              homeButton.parentElement.style.display = 'none';
              homeButton.parentElement.style.setProperty (
                'display',
                'none',
                'important'
              );
            }
          }
        } catch (e) {}
        setTimeout (function () {
          s.style.opacity = '1';
        }, 20);

        form.setAttribute ('data-dime-collapsed', 'true');
        // Disable action bar controls while showing the summary
        try {
          disableActionBarControls ();
        } catch (e) {}

        // hook show details
        var showBtn =
          s.querySelector ('#btn-show-details') ||
          document.getElementById ('btn-show-details');
        if (showBtn)
          showBtn.addEventListener (
            'click',
            function () {
              expandFromSummary (form);
            },
            true
          );
        // hook copy to clipboard
        var copyBtn =
          s.querySelector ('#btn-copy-target') ||
          document.getElementById ('btn-copy-target');
        if (copyBtn) {
          copyBtn.addEventListener (
            'click',
            function () {
              try {
                // Build a plain-text summary to copy
                var lines = [];
                lines.push ('DIME Calculator');
                lines.push ('');
                // D/I/M/E values
                try {
                  lines.push ('D: ' + formatCurrency (d) + ' (Debt)');
                  lines.push ('I: ' + formatCurrency (i) + ' (Income)');
                  lines.push ('M: ' + formatCurrency (m) + ' (Mortgage)');
                  lines.push ('E: ' + formatCurrency (e) + ' (Education)');
                } catch (e) {}
                // Optional coverage target / in-force
                try {
                  if (coverage && coverage.inForce && coverage.inForce > 0) {
                    if (typeof coverage.target !== 'undefined')
                      lines.push (
                        'DIME Target: ' + formatCurrency (coverage.target)
                      );
                    lines.push (
                      'Current in-force: ' + formatCurrency (coverage.inForce)
                    );
                  }
                } catch (e) {}
                // Main headline
                try {
                  lines.push ('');
                  lines.push (
                    'Life Insurance Target: ' +
                      formatCurrency (
                        coverage ? coverage.need : computeDimeValue (form)
                      )
                  );
                } catch (e) {}
                lines.push ('');
                // Key
                var tokenTxt = '';
                var el = s.querySelector ('.summary-key');
                if (!el) el = document.querySelector ('.summary-key');
                if (el)
                  tokenTxt = (el.textContent || el.innerText || '').trim ();
                if (!tokenTxt) {
                  try {
                    var qs = (location.search || '').replace (/^\?/, '');
                    var params = qs.split ('&').reduce (function (acc, p) {
                      var parts = p.split ('=');
                      if (parts.length === 1) return acc;
                      acc[decodeURIComponent (parts[0])] = decodeURIComponent (
                        parts.slice (1).join ('=')
                      );
                      return acc;
                    }, {});
                    tokenTxt = params.token || params.key || qs || '';
                  } catch (e) {
                    tokenTxt = (location.search || '').replace (/^\?/, '');
                  }
                }
                if (tokenTxt) lines.push ('Insurance target key: ' + tokenTxt);

                // Include notes if present
                try {
                  var notesEl2 =
                    form.querySelector ('#notes_dime') ||
                    document.getElementById ('notes_dime');
                  var notesTxt = '';
                  if (notesEl2) notesTxt = (notesEl2.value || '').trim ();
                  if (!notesTxt) {
                    // also try to find notes inside dialog textarea if copied from summary
                    var summaryNotes = s.querySelector ('.summary-notes');
                    if (summaryNotes)
                      notesTxt = (summaryNotes.textContent ||
                        summaryNotes.innerText ||
                        '')
                        .trim ();
                  }
                  if (notesTxt) {
                    lines.push ('');
                    lines.push ('Notes:');
                    lines.push (notesTxt);
                  }
                } catch (e) {}

                var full = lines.join ('\n');
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard
                    .writeText (full)
                    .then (function () {
                      copyBtn.textContent = 'Copied';
                      setTimeout (function () {
                        copyBtn.textContent = 'Copy to clipboard';
                      }, 2000);
                    })
                    .catch (function () {
                      fallbackCopyTextToClipboard (full, copyBtn);
                    });
                } else {
                  fallbackCopyTextToClipboard (full, copyBtn);
                }
              } catch (e) {
                try {
                  console.error ('copy error', e);
                } catch (err) {}
              }
            },
            true
          );
        }
      }, 300);
    } catch (e) {
      console.error ('collapseToSummary error:', e);
    }
  }

  function expandFromSummary (form) {
    try {
      if (!form) return;
      if (form.getAttribute ('data-dime-collapsed') !== 'true') return;
      var summary = document.getElementById ('dime-summary');
      if (summary && summary.parentNode)
        summary.parentNode.removeChild (summary);
      // restore form display
      try {
        var orig = form.dataset && form.dataset.dimeOrigDisplay;
        form.style.display = typeof orig !== 'undefined' ? orig : '';
        try {
          delete form.dataset.dimeOrigDisplay;
        } catch (e) {}
      } catch (e) {}
      form.removeAttribute ('data-dime-collapsed');
      // Enable action bar controls after showing the summary
      try {
        enableActionBarControls ();
      } catch (e) {}
      // show calculator home button when returning to full form
      try {
        var homeButton = document.querySelector ('a[href="/calculator/"]');
        if (homeButton) {
          homeButton.style.display = '';
          homeButton.style.removeProperty ('display');
          // Also show the parent paragraph
          if (homeButton.parentElement) {
            homeButton.parentElement.style.display = '';
            homeButton.parentElement.style.removeProperty ('display');
          }
        }
      } catch (e) {}
    } catch (e) {
      console.error ('expandFromSummary error:', e);
    }
  }
  // Disable/enable action bar controls (calculator home, add key, notes)
  function disableActionBarControls () {
    try {
      var home = document.querySelector ('a[href="/calculator/"]');
      if (home) {
        home.dataset._display = home.style.display || '';
        home.style.display = 'none';
        home.setAttribute ('aria-hidden', 'true');
      }
    } catch (e) {}
    try {
      var addKey = document.getElementById ('btn-add-key');
      if (addKey) {
        addKey.dataset._disabled = addKey.disabled ? '1' : '0';
        addKey.disabled = true;
        addKey.classList.add ('btn--disabled');
        addKey.setAttribute ('aria-disabled', 'true');
      }
    } catch (e) {}
    try {
      var notes =
        document.getElementById ('btn-toggle-notes') ||
        document.querySelector ('.btn--notes-toggle');
      if (notes) {
        notes.dataset._disabled = notes.disabled ? '1' : '0';
        try {
          notes.disabled = true;
        } catch (e) {}
        notes.classList.add ('btn--disabled');
        notes.setAttribute ('aria-disabled', 'true');
      }
    } catch (e) {}
  }

  function enableActionBarControls () {
    try {
      var home = document.querySelector ('a[href="/calculator/"]');
      if (home) {
        home.style.display = home.dataset._display || '';
        try {
          delete home.dataset._display;
        } catch (e) {}
        home.removeAttribute ('aria-hidden');
      }
    } catch (e) {}
    try {
      var addKey = document.getElementById ('btn-add-key');
      if (addKey) {
        addKey.disabled = addKey.dataset._disabled === '1';
        addKey.classList.remove ('btn--disabled');
        addKey.removeAttribute ('aria-disabled');
        try {
          delete addKey.dataset._disabled;
        } catch (e) {}
      }
    } catch (e) {}
    try {
      var notes =
        document.getElementById ('btn-toggle-notes') ||
        document.querySelector ('.btn--notes-toggle');
      if (notes) {
        try {
          notes.disabled = notes.dataset._disabled === '1';
        } catch (e) {}
        notes.classList.remove ('btn--disabled');
        notes.removeAttribute ('aria-disabled');
        try {
          delete notes.dataset._disabled;
        } catch (e) {}
      }
    } catch (e) {}
  }

  // Simple HTML escape helper for injecting token text
  function escapeHtml (str) {
    if (!str && str !== 0) return '';
    return String (str)
      .replace (/&/g, '&amp;')
      .replace (/</g, '&lt;')
      .replace (/>/g, '&gt;')
      .replace (/"/g, '&quot;')
      .replace (/'/g, '&#39;');
  }

  // Fallback copy for older browsers
  function fallbackCopyTextToClipboard (text, btn) {
    try {
      var textarea = document.createElement ('textarea');
      textarea.value = text;
      textarea.setAttribute ('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild (textarea);
      var selected = document.getSelection ().rangeCount > 0
        ? document.getSelection ().getRangeAt (0)
        : null;
      textarea.select ();
      try {
        var ok = document.execCommand ('copy');
        if (ok && btn) {
          var old = btn.textContent;
          btn.textContent = 'Copied';
          setTimeout (function () {
            try {
              btn.textContent = old;
            } catch (e) {}
          }, 2000);
        }
      } catch (err) {
        // give up quietly
      }
      document.body.removeChild (textarea);
      if (selected) {
        try {
          document.getSelection ().removeAllRanges ();
          document.getSelection ().addRange (selected);
        } catch (e) {}
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

            // Track calculate button click
            if (window.Tracking) {
              window.Tracking.calculatorCalculate ('dime');
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
                  event: 'calculator_calculate',
                  calculator_type: 'dime',
                  user_name: userName,
                  event_category: 'engagement',
                  event_label: 'calculate_button_click',
                });
              } catch (e) {
                console.warn ('GA4 tracking error:', e);
              }
            }

            var salt = form.getAttribute ('data-token-salt') || null;
            // Prefer encrypted share URL when possible (uses saved pass in sessionStorage/localStorage)
            try {
              if (
                window.formHelpers &&
                typeof window.formHelpers.createEncryptedShareUrl === 'function'
              ) {
                var encUrl = await window.formHelpers.createEncryptedShareUrl (
                  form
                );
                if (encUrl) {
                  try {
                    console.debug ('form__dime: created encrypted share url');
                  } catch (e) {}
                  try {
                    // Replace the current URL without navigating
                    if (history && history.replaceState)
                      history.replaceState (null, document.title, encUrl);
                    else location.href = encUrl;
                  } catch (e) {
                    try {
                      location.href = encUrl;
                    } catch (er) {}
                  }
                } else {
                  try {
                    console.debug (
                      'form__dime: no stored passphrase available, cannot produce encrypted URL'
                    );
                  } catch (e) {}
                  try {
                    showConfirm ({
                      title: 'Encryption key missing',
                      body: 'No stored passphrase was found to encrypt the share link. Unlock the protected content or add a key before sharing.',
                      okText: 'OK',
                    });
                  } catch (e) {}
                  return;
                }
              } else {
                // encryption helper not present: fallback to signed token
                if (
                  window.formHelpers &&
                  typeof window.formHelpers.createTokenFromForm === 'function'
                ) {
                  var token = await window.formHelpers.createTokenFromForm (
                    form,
                    {salt: salt}
                  );
                  if (
                    typeof window.formHelpers.writeTokenToQuery === 'function'
                  ) {
                    window.formHelpers.writeTokenToQuery (token);
                  } else {
                    try {
                      location.search = token;
                    } catch (err) {}
                  }
                }
              }
            } catch (e) {
              // if anything goes wrong, fallback to existing token behavior
              try {
                if (
                  window.formHelpers &&
                  typeof window.formHelpers.createTokenFromForm === 'function'
                ) {
                  var token = await window.formHelpers.createTokenFromForm (
                    form,
                    {salt: salt}
                  );
                  if (
                    typeof window.formHelpers.writeTokenToQuery === 'function'
                  ) {
                    window.formHelpers.writeTokenToQuery (token);
                  } else {
                    try {
                      location.search = token;
                    } catch (err) {}
                  }
                }
              } catch (err) {}
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
              if (
                active &&
                (active.tagName === 'BUTTON' || active.tagName === 'INPUT')
              ) {
                try {
                  active.blur ();
                } catch (e) {}
              }
              // Also ensure the form's submit button is blurred as a fallback
              try {
                var submitBtn = form.querySelector ('button[type="submit"]');
                if (submitBtn) submitBtn.blur ();
              } catch (e) {}
            } catch (err) {}
            // delayed fallback: blur again after a short timeout to clear any lingering active styles
            try {
              setTimeout (function () {
                try {
                  var a = document.activeElement;
                  if (a && (a.tagName === 'BUTTON' || a.tagName === 'INPUT'))
                    try {
                      a.blur ();
                    } catch (e) {}
                  var sb = form.querySelector ('button[type="submit"]');
                  if (sb)
                    try {
                      sb.blur ();
                    } catch (e) {}
                } catch (e) {}
              }, 50);
            } catch (e) {}
            // Collapse to compact summary after calculation
            try {
              collapseToSummary (form);
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

      // Notes dialog: use generic helper from formHelpers
      try {
        var notesBtn =
          form.querySelector ('#btn-toggle-notes') ||
          document.getElementById ('btn-toggle-notes') ||
          document.querySelector ('.btn--notes-toggle');
        if (notesBtn) {
          notesBtn.addEventListener (
            'click',
            function () {
              try {
                if (
                  window.formHelpers &&
                  typeof window.formHelpers.openNotes === 'function'
                ) {
                  // prefer matching textarea id inside this form: notes_dime
                  window.formHelpers.openNotes (form, 'notes_dime');
                }
              } catch (e) {}
            },
            true
          );
        }

        // ensure form clears close the notes dialog
        form.addEventListener (
          'form:cleared',
          function () {
            try {
              if (
                window.formHelpers &&
                typeof window.formHelpers.closeNotes === 'function'
              )
                window.formHelpers.closeNotes ();
            } catch (e) {}
          },
          true
        );
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
        try {
          if (
            window.formHelpers &&
            typeof window.formHelpers.createEncryptedShareUrl === 'function'
          ) {
            var encUrl2 = await window.formHelpers.createEncryptedShareUrl (
              form
            );
            if (encUrl2) {
              try {
                if (history && history.replaceState)
                  history.replaceState (null, document.title, encUrl2);
                else location.href = encUrl2;
              } catch (e) {
                try {
                  location.href = encUrl2;
                } catch (er) {}
              }
            } else {
              try {
                console.debug (
                  'form__dime delegated submit: no stored passphrase available, cannot produce encrypted URL'
                );
              } catch (e) {}
              try {
                showConfirm ({
                  title: 'Encryption key missing',
                  body: 'No stored passphrase was found to encrypt the share link. Unlock the protected content or add a key before sharing.',
                  okText: 'OK',
                });
              } catch (e) {}
              return;
            }
          } else if (
            window.formHelpers &&
            typeof window.formHelpers.createTokenFromForm === 'function'
          ) {
            var token2 = await window.formHelpers.createTokenFromForm (form, {
              salt: salt,
            });
            if (typeof window.formHelpers.writeTokenToQuery === 'function')
              window.formHelpers.writeTokenToQuery (token2);
            else
              try {
                location.search = token2;
              } catch (e) {}
          }
        } catch (e) {
          try {
            if (
              window.formHelpers &&
              typeof window.formHelpers.createTokenFromForm === 'function'
            ) {
              var token2 = await window.formHelpers.createTokenFromForm (form, {
                salt: salt,
              });
              if (typeof window.formHelpers.writeTokenToQuery === 'function')
                window.formHelpers.writeTokenToQuery (token2);
              else
                try {
                  location.search = token2;
                } catch (er) {}
            }
          } catch (err) {}
        }
        try {
          if (
            window.formDime &&
            typeof window.formDime.renderDebtOutput === 'function'
          ) {
            window.formDime.renderDebtOutput (form);
          }
          if (
            window.formDime &&
            typeof window.formDime.renderIncomeOutput === 'function'
          ) {
            window.formDime.renderIncomeOutput (form);
          }
          if (
            window.formDime &&
            typeof window.formDime.renderMortgageOutput === 'function'
          ) {
            window.formDime.renderMortgageOutput (form);
          }
          if (
            window.formDime &&
            typeof window.formDime.renderEducationOutput === 'function'
          ) {
            window.formDime.renderEducationOutput (form);
          }
          if (
            window.formDime &&
            typeof window.formDime.renderDimeOutput === 'function'
          ) {
            window.formDime.renderDimeOutput (form);
          }
          if (
            window.formDime &&
            typeof window.formDime.renderCoverageNeed === 'function'
          ) {
            window.formDime.renderCoverageNeed (form);
          }
          // remove focus/active state from the submit button so visual "active" styles clear
          try {
            var active = document.activeElement;
            if (
              active &&
              (active.tagName === 'BUTTON' || active.tagName === 'INPUT')
            ) {
              try {
                active.blur ();
              } catch (e) {}
            }
            try {
              var submitBtn = form.querySelector ('button[type="submit"]');
              if (submitBtn) submitBtn.blur ();
            } catch (e) {}
          } catch (err) {}
          // delayed fallback: blur again after a short timeout to clear any lingering active styles
          try {
            setTimeout (function () {
              try {
                var a = document.activeElement;
                if (a && (a.tagName === 'BUTTON' || a.tagName === 'INPUT'))
                  try {
                    a.blur ();
                  } catch (e) {}
                var sb = form.querySelector ('button[type="submit"]');
                if (sb)
                  try {
                    sb.blur ();
                  } catch (e) {}
              } catch (e) {}
            }, 50);
          } catch (e) {}
        } catch (err) {
          console.error ('form__dime delegated submit handler error:', err);
        }
      } catch (err) {
        console.error ('form__dime delegated submit listener error:', err);
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
