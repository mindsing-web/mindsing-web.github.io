// Cashflow calculator specific behaviors (Income gross calculation)
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

  // --- Deduction benefit summary ---
  function renderDeductionBenefitSummary(form) {
    try {
  var retirement = parseFloat(form.querySelector('#deduct_retirement')?.value) || 0;
  var health = parseFloat(form.querySelector('#deduct_health')?.value) || 0;
  var hsa = parseFloat(form.querySelector('#deduct_hsa')?.value) || 0;
  var other = parseFloat(form.querySelector('#duduct_monthly_other')?.value) || 0;
  var totalMonthly = retirement + health + hsa + other;
  var totalAnnual = totalMonthly * 12;
      var taxInput = form.querySelector('#average_tax_percent');
      var taxRate = taxInput ? parseFloat(taxInput.value) : 0;
      if (!isFinite(taxRate) || taxRate < 0) taxRate = 0;
      var annualTaxBenefit = totalAnnual * (taxRate / 100);
      var out = document.getElementById('deduction-benefit-summary');
      if (!out) return;
      out.innerHTML =
        '<p class="mb0"><strong>Total monthly paycheck deductions:</strong> ' + formatCurrency(totalMonthly) + '</p>' +
        '<p class="mt1 mb0"><strong>Total annual deductions:</strong> ' + formatCurrency(totalAnnual) + '</p>' +
        '<p class="mt2 mb0"><strong>Estimated annual tax benefit:</strong> ' + formatCurrency(annualTaxBenefit) + '</p>' +
        '<p class="mt1 mb0"><small>Tax benefit is estimated as total annual deductions × effective tax rate.</small></p>';
    } catch (e) { console.error('[deduction-summary] error', e); }
  }

  // --- Annual deductions summary (annual fields) ---
  function renderAnnualDeductionSummary(form) {
    try {
      var charity = parseFloat(form.querySelector('#annual_charity')?.value) || 0;
      var mortgage = parseFloat(form.querySelector('#annual_mortgage_interest')?.value) || 0;
      var property = parseFloat(form.querySelector('#annual_property_tax')?.value) || 0;
      var other = parseFloat(form.querySelector('#annual_other')?.value) || 0;
      var total = charity + mortgage + property + other;
      var out = document.getElementById('annual-deduction-summary');
      if (!out) return;
      if (!total) {
        out.innerHTML = '';
        return;
      }
      out.innerHTML = '<p class="mb0"><strong>Total annual deductions:</strong> ' + formatCurrency(total) + '</p>';
    } catch (e) { console.error('[annual-deduction-summary] error', e); }
  }

  function computeGrossIncome (form) {
    try {
      var ids = ['annual_salary', 'spouse_income', 'additional_income'];
      var sum = 0;
      ids.forEach(function (id) {
        var el = form.querySelector('#' + id);
        if (!el) return;
        var v = parseFloat(el.value);
        if (!isFinite(v)) v = 0;
        sum += v;
      });
      return sum;
    } catch (e) {
      console.error('form__cashflow computeGrossIncome error:', e);
      return 0;
    }
  }

  function renderGrossIncome (form) {
    try {
      var out = document.getElementById('income-output');
      if (!out) return;
      var value = computeGrossIncome(form);
      if (!value) {
        // leave blank but keep element available for layout
        out.innerHTML = '';
        return;
      }
      // Monthly gross
      var monthlyGross = value / 12;
      // After-tax monthly
      var taxInput = form.querySelector('#average_tax_percent');
      var taxRate = taxInput ? parseFloat(taxInput.value) : 0;
      if (!isFinite(taxRate) || taxRate < 0) taxRate = 0;
      var afterTaxAnnual = value * (1 - taxRate / 100);
      var afterTaxMonthly = afterTaxAnnual / 12;
      // Move gross and monthly gross inside income-section, after-tax outside
      var grossHtml =
        '<p class="mb0"><strong>Gross income =</strong> ' + formatCurrency(value) + '</p>' +
        '<p class="mt1 mb0"><small>Sum of salary, spouse, and additional income</small></p>' +
        '<p class="mt2 mb0"><strong>Monthly gross income =</strong> ' + formatCurrency(monthlyGross) + '</p>';
      var afterTaxHtml =
        '<h3 class="mt2 mb0"><strong>Monthly after-tax income =</strong> ' + formatCurrency(afterTaxMonthly) + '</h3>';
      // Place grossHtml inside #income-section-summary, afterTaxHtml in #income-output
      var sectionSummary = form.querySelector('#income-section-summary');
      if (sectionSummary) sectionSummary.innerHTML = grossHtml;
      out.innerHTML = afterTaxHtml;
      renderDeductionBenefitSummary(form);
    } catch (e) {
      console.error('form__cashflow renderGrossIncome error:', e);
    }
  }

  // --- Tax guidance ---
  // Simple US federal tax bracket approximation (single filer, 2023-ish thresholds)
  var FEDERAL_BRACKETS = [
    {rate: 0.10, thresh: 11000},
    {rate: 0.12, thresh: 44725},
    {rate: 0.22, thresh: 95375},
    {rate: 0.24, thresh: 182100},
    {rate: 0.32, thresh: 231250},
    {rate: 0.35, thresh: 578125},
    {rate: 0.37, thresh: Infinity},
  ];

  function estimateEffectiveTaxRate (gross) {
    try {
      if (!isFinite(gross) || gross <= 0) return 0;
      // approximate progressive tax to compute an effective federal rate
      var remaining = gross;
      var prev = 0;
      var tax = 0;
      for (var i = 0; i < FEDERAL_BRACKETS.length; i++) {
        var b = FEDERAL_BRACKETS[i];
        var slice = Math.max(0, Math.min(remaining, b.thresh - prev));
        if (slice <= 0) { prev = b.thresh; continue; }
        tax += slice * b.rate;
        remaining -= slice;
        prev = b.thresh;
        if (remaining <= 0) break;
      }
      // add rough state/local average (flat 4%) to suggest a combined effective rate
      var stateLocal = 0.04 * gross;
      var totalTax = tax + stateLocal;
      var effective = (totalTax / gross) * 100;
      return Math.round(effective * 100) / 100; // two decimals
    } catch (e) {
      return 0;
    }
  }

  function updateTaxHelp (form) {
    try {
      var help = document.getElementById('average-tax-help');
      if (!help) return;
      var gross = computeGrossIncome(form) || 0;
      if (!gross || gross <= 0) {
        help.textContent = 'Enter your estimated effective tax rate or use the suggested rate based on gross income.';
        updateAnnualTaxLiability(0, 0);
        return;
      }
      var suggested = estimateEffectiveTaxRate(gross);
      help.innerHTML = 'Suggested effective tax rate: <strong>' + (suggested ? suggested + '%' : '—') + '</strong> based on gross income of ' + formatCurrency(gross) + '. You can override in the field above.';
      updateAnnualTaxLiability(gross, suggested);
    } catch (e) {}
  }

  // --- Annual tax liability display ---
  function updateAnnualTaxLiability(gross, effectiveRate) {
    try {
      var liabilityEl = document.getElementById('annual-tax-liability');
      if (!liabilityEl) return;
      if (!gross || !effectiveRate) {
        liabilityEl.innerHTML = '';
        return;
      }
      var tax = Math.round((gross * effectiveRate) / 100);
      liabilityEl.innerHTML = '<p class="mb0"><strong>Estimated annual tax liability:</strong> ' + formatCurrency(tax) + '</p>';
    } catch (e) {}
  }

  function attachHandlers (form) {
      // Deduction fields update summary
  ['deduct_retirement','deduct_health','deduct_hsa','duduct_monthly_other'].forEach(function(id){
        var el = form.querySelector('#'+id);
        if (!el) return;
        el.addEventListener('input', function(){ renderDeductionBenefitSummary(form); }, true);
      });
      // Also update summary when tax rate changes
      var taxInput2 = form.querySelector('#average_tax_percent');
      if (taxInput2) {
        taxInput2.addEventListener('input', function(){ renderDeductionBenefitSummary(form); }, true);
      }
    try {
      if (!form) return;
      var fields = ['annual_salary', 'spouse_income', 'additional_income'];
      fields.forEach(function (id) {
        var el = form.querySelector('#' + id);
        if (!el) return;
        // on focus change (blur) update output
        el.addEventListener('blur', function () { renderGrossIncome(form); autoPopulateTax(form); }, true);
        // also update on input change for better UX
        el.addEventListener('change', function () { renderGrossIncome(form); autoPopulateTax(form); }, true);
      });
      // Also update output when tax input changes
      var taxInput = form.querySelector('#average_tax_percent');
      if (taxInput) {
        taxInput.addEventListener('input', function () { renderGrossIncome(form); }, true);
      }
      // Handler for override checkbox
      var override = form.querySelector('#override-tax-input');
      var taxInput = form.querySelector('#average_tax_percent');
      if (override && taxInput) {
        override.addEventListener('change', function () {
          if (override.checked) {
            taxInput.removeAttribute('readonly');
            taxInput.classList.remove('not-allowed');
            taxInput.required = true;
            taxInput.focus();
          } else {
            taxInput.setAttribute('readonly', 'readonly');
            taxInput.classList.add('not-allowed');
            taxInput.required = false;
            autoPopulateTax(form);
            // Recalculate income section to reflect the updated tax rate
            renderGrossIncome(form);
            updateTaxHelp(form);
          }
        });
      }
      // Annual deduction fields: update annual summary on input/change/blur
      ['annual_charity','annual_mortgage_interest','annual_property_tax','annual_other'].forEach(function(id){
        var el = form.querySelector('#'+id);
        if (!el) return;
        el.addEventListener('input', function(){ renderAnnualDeductionSummary(form); }, true);
        el.addEventListener('change', function(){ renderAnnualDeductionSummary(form); }, true);
        el.addEventListener('blur', function(){ renderAnnualDeductionSummary(form); }, true);
      });
    } catch (e) {
      console.error('form__cashflow attachHandlers error:', e);
    }
  }

  // Auto-populate tax input unless override is checked
  function autoPopulateTax(form) {
    try {
      var taxInput = form.querySelector('#average_tax_percent');
      var override = form.querySelector('#override-tax-input');
      if (!taxInput || (override && override.checked)) return;
      var gross = computeGrossIncome(form) || 0;
      var suggested = gross ? estimateEffectiveTaxRate(gross) : '';
      if (suggested) {
        taxInput.value = suggested;
      } else {
        taxInput.value = '';
      }
      taxInput.setAttribute('readonly', 'readonly');
      taxInput.classList.add('not-allowed');
      taxInput.required = false;
      
      // Trigger input event to ensure calculations update
      try {
        var event = new Event('input', { bubbles: true });
        taxInput.dispatchEvent(event);
      } catch (e) {
        // Fallback for older browsers
        if (taxInput.fireEvent) {
          taxInput.fireEvent('oninput');
        }
      }
      
      renderDeductionBenefitSummary(form);
    } catch (e) {}
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    try {
      var form = document.getElementById('cashflow-form') || document.querySelector('form.calculator--form');
      if (!form) return;
      attachHandlers(form);
    renderDeductionBenefitSummary(form);
      // On load, ensure tax input state matches override checkbox
      var override = form.querySelector('#override-tax-input');
      var taxInput = form.querySelector('#average_tax_percent');
      if (override && taxInput) {
        if (override.checked) {
          taxInput.removeAttribute('readonly');
          taxInput.classList.remove('not-allowed');
          taxInput.required = true;
        } else {
          taxInput.setAttribute('readonly', 'readonly');
          taxInput.classList.add('not-allowed');
          taxInput.required = false;
        }
      }
      // Do not render initially to keep blank; but if any inputs already have values, render once
      var initial = computeGrossIncome(form);
      if (initial && initial > 0) {
        renderGrossIncome(form);
        autoPopulateTax(form);
      } else {
        autoPopulateTax(form);
      }
      // render annual deduction summary on load (if values present)
      renderAnnualDeductionSummary(form);
      // update tax help when gross income changes
      try {
        // hook into our render call so tax help also updates
        var origRender = window.formCashflow && window.formCashflow.renderIncomeOutput;
        // ensure help updates on input events for income fields
        ['annual_salary','spouse_income','additional_income'].forEach(function(id){
          var el = form.querySelector('#'+id);
          if (!el) return;
          el.addEventListener('blur', function(){ updateTaxHelp(form); }, true);
          el.addEventListener('change', function(){ updateTaxHelp(form); }, true);
        });
        // update when average tax input is focused to show guidance
        var taxInput = form.querySelector('#average_tax_percent');
        if (taxInput) {
          taxInput.addEventListener('focus', function(){ updateTaxHelp(form); }, true);
          // Also update annual tax liability on manual input
          taxInput.addEventListener('input', function(){
            var gross = computeGrossIncome(form) || 0;
            var val = parseFloat(taxInput.value);
            if (!isFinite(val) || val <= 0) {
              updateAnnualTaxLiability(gross, 0);
            } else {
              updateAnnualTaxLiability(gross, val);
            }
          }, true);
        }
        // initial help update
        updateTaxHelp(form);
        // --- Tax assumptions modal ---
        var taxAssumptionsLink = document.getElementById('tax-assumptions-link');
        var taxAssumptionsModal = document.getElementById('tax-assumptions-modal');
        var taxAssumptionsClose = document.getElementById('tax-assumptions-close');
        if (taxAssumptionsLink && taxAssumptionsModal) {
          taxAssumptionsLink.addEventListener('click', function(e) {
            e.preventDefault();
            taxAssumptionsModal.showModal();
          });
        }
        if (taxAssumptionsClose && taxAssumptionsModal) {
          taxAssumptionsClose.addEventListener('click', function(e) {
            e.preventDefault();
            taxAssumptionsModal.close();
          });
        }
      } catch (e) {}
      // Clear output when form values are cleared via the shared clear-values flow
      try {
        form.addEventListener('form:cleared', function () {
          var out = document.getElementById('income-output');
          if (out) out.innerHTML = '';
          // Clear estimated tax field by id (not scoped to form, in case of duplicate ids)
          var taxInput = document.getElementById('average_tax_percent');
          if (taxInput) taxInput.value = '';
          // Clear help text for estimated tax
          var taxHelp = document.getElementById('average-tax-help');
          if (taxHelp) taxHelp.textContent = 'Estimated tax rate.';
          // Clear annual tax liability
          var liabilityEl = document.getElementById('annual-tax-liability');
          if (liabilityEl) liabilityEl.innerHTML = '';
          // Uncheck override and reset input state
          var override = document.getElementById('override-tax-input');
          if (override) override.checked = false;
          if (taxInput) {
            taxInput.setAttribute('readonly', 'readonly');
            taxInput.required = false;
          }
          // Move focus to first input (annual_salary) for accessibility
          var firstInput = document.getElementById('annual_salary');
          if (firstInput) firstInput.focus();
          // clear annual deduction summary
          var annualOut = document.getElementById('annual-deduction-summary');
          if (annualOut) annualOut.innerHTML = '';
        }, true);
      } catch (e) {
        /* ignore */
      }
      // expose for manual calls if needed
      window.formCashflow = window.formCashflow || {};
      window.formCashflow.renderIncomeOutput = function () { renderGrossIncome(form); };
      // expose annual deduction renderer for debugging/workaround
      window.formCashflow.renderAnnualDeductions = function () { renderAnnualDeductionSummary(document.getElementById('cashflow-form') || document.querySelector('form.calculator--form')); };
      // Safety: attach document-level listeners to annual fields in case form-scoped handlers miss them
      ['annual_charity','annual_mortgage_interest','annual_property_tax','annual_other'].forEach(function(id){
        var el = document.getElementById(id);
        if (!el) return;
        ['input','change','blur'].forEach(function(ev){
          el.addEventListener(ev, function(){
            var f = document.getElementById('cashflow-form') || document.querySelector('form.calculator--form');
            if (f) renderAnnualDeductionSummary(f);
          }, true);
        });
      });
    } catch (e) {
      console.error('form__cashflow init error:', e);
    }

    // Initialize shared collapse/expand handlers for section headers
    if (window.collapseSections && typeof window.collapseSections.init === 'function') {
      try { window.collapseSections.init(document.getElementById('cashflow-form') || document); } catch (e) {}
    }
  }, false);

})();
