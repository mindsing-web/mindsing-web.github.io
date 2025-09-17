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
      out.innerHTML =
        '<p class="mb0"><strong>Gross income =</strong> ' + formatCurrency(value) + '</p>' +
        '<p class="mt1 mb0"><small>Sum of salary, spouse, and additional income</small></p>';
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
        return;
      }
      var suggested = estimateEffectiveTaxRate(gross);
      help.innerHTML = 'Suggested effective tax rate: <strong>' + (suggested ? suggested + '%' : '—') + '</strong> based on gross income of ' + formatCurrency(gross) + '. You can override in the field above.';
    } catch (e) {}
  }

  function attachHandlers (form) {
    try {
      if (!form) return;
      var fields = ['annual_salary', 'spouse_income', 'additional_income'];
      fields.forEach(function (id) {
        var el = form.querySelector('#' + id);
        if (!el) return;
        // on focus change (blur) update output
        el.addEventListener('blur', function () { renderGrossIncome(form); }, true);
        // also update on input change for better UX
        el.addEventListener('change', function () { renderGrossIncome(form); }, true);
      });
    } catch (e) {
      console.error('form__cashflow attachHandlers error:', e);
    }
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    try {
      var form = document.getElementById('cashflow-form') || document.querySelector('form.calculator--form');
      if (!form) return;
      attachHandlers(form);
      // Do not render initially to keep blank; but if any inputs already have values, render once
      var initial = computeGrossIncome(form);
      if (initial && initial > 0) renderGrossIncome(form);
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
          // Move focus to first input (annual_salary) for accessibility
          var firstInput = document.getElementById('annual_salary');
          if (firstInput) firstInput.focus();
        }, true);
      } catch (e) {
        /* ignore */
      }
      // expose for manual calls if needed
      window.formCashflow = window.formCashflow || {};
      window.formCashflow.renderIncomeOutput = function () { renderGrossIncome(form); };
    } catch (e) {
      console.error('form__cashflow init error:', e);
    }
  }, false);

})();
