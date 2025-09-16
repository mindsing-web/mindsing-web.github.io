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
      // Clear output when form values are cleared via the shared clear-values flow
      try {
        form.addEventListener('form:cleared', function () {
          var out = document.getElementById('income-output');
          if (out) out.innerHTML = '';
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
