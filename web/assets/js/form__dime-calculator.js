// DIME calculator specific behaviors (Debt output)
(function () {
  'use strict';

  function formatCurrency(val) {
    try {
      var n = Number(val) || 0;
      return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    } catch (e) {
      return '$0';
    }
  }

  function computeDebtValue(form) {
    try {
      var ids = ['final_expenses', 'credit_card_debts', 'car_loans', 'other_debts'];
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
      console.error('form__dime computeDebtValue error:', e);
      return 0;
    }
  }

  function renderDebtOutput(form) {
    try {
      var out = document.getElementById('debt-output');
      if (!out) return;
      var value = computeDebtValue(form);
      out.innerHTML = '<p class="mb0"><strong>D =</strong> ' + formatCurrency(value) + '</p>';
    } catch (e) {
      console.error('form__dime renderDebtOutput error:', e);
    }
  }

  function initDebtOutput(root) {
    root = root || document;
    try {
      var form = root.querySelector('#dime-form');
      if (!form) return;
      renderDebtOutput(form);
      var ids = ['final_expenses', 'credit_card_debts', 'car_loans', 'other_debts'];
      ids.forEach(function (id) {
        var el = form.querySelector('#' + id);
        if (!el) return;
        el.addEventListener('blur', function () { renderDebtOutput(form); }, true);
        el.addEventListener('change', function () { renderDebtOutput(form); }, true);
      });
    } catch (e) {
      console.error('form__dime initDebtOutput error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initDebtOutput(document); });
  } else {
    initDebtOutput(document);
  }

  // expose for tests or manual init
  window.formDime = {
    initDebtOutput: initDebtOutput,
    computeDebtValue: computeDebtValue,
    renderDebtOutput: renderDebtOutput
  };

})();
