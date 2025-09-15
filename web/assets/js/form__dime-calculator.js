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

  // --- Income calculation and output ---
  function computeIncomeValue(form) {
    try {
      var salaryEl = form.querySelector('#annual_salary');
      var multEl = form.querySelector('#income_multiplier');
      var salary = salaryEl ? parseFloat(salaryEl.value) : 0;
      var mult = multEl ? parseFloat(multEl.value) : 0;
      if (!isFinite(salary)) salary = 0;
      if (!isFinite(mult)) mult = 0;
      return salary * mult;
    } catch (e) {
      console.error('form__dime computeIncomeValue error:', e);
      return 0;
    }
  }

  function renderIncomeOutput(form) {
    try {
      var out = document.getElementById('income-output');
      if (!out) return;
      var value = computeIncomeValue(form);
      out.innerHTML = '<p class="mb0"><strong>I =</strong> ' + formatCurrency(value) + '</p>';
    } catch (e) {
      console.error('form__dime renderIncomeOutput error:', e);
    }
  }

  // --- Mortgage calculation and output ---
  function computeMortgageValue(form) {
    try {
      var rentEl = form.querySelector('#monthly_rent');
      var monthsEl = form.querySelector('#months_rent');
      var mortEl = form.querySelector('#mortgage_balance');
      var rent = rentEl ? parseFloat(rentEl.value) : 0;
      var months = monthsEl ? parseFloat(monthsEl.value) : 0;
      var mort = mortEl ? parseFloat(mortEl.value) : 0;
      if (!isFinite(rent)) rent = 0;
      if (!isFinite(months)) months = 0;
      if (!isFinite(mort)) mort = 0;
      return (rent * months) + mort;
    } catch (e) {
      console.error('form__dime computeMortgageValue error:', e);
      return 0;
    }
  }

  function renderMortgageOutput(form) {
    try {
      var out = document.getElementById('mortgage-output');
      if (!out) return;
      var value = computeMortgageValue(form);
      out.innerHTML = '<p class="mb0"><strong>M =</strong> ' + formatCurrency(value) + '</p>';
    } catch (e) {
      console.error('form__dime renderMortgageOutput error:', e);
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

      // Init income output and handlers
      renderIncomeOutput(form);
      var salary = form.querySelector('#annual_salary');
      var mult = form.querySelector('#income_multiplier');
      if (salary) {
        salary.addEventListener('blur', function () { renderIncomeOutput(form); }, true);
        salary.addEventListener('change', function () { renderIncomeOutput(form); }, true);
      }
      if (mult) {
        mult.addEventListener('blur', function () { renderIncomeOutput(form); }, true);
        mult.addEventListener('change', function () { renderIncomeOutput(form); }, true);
      }

      // Init mortgage output and handlers
      renderMortgageOutput(form);
      var rent = form.querySelector('#monthly_rent');
      var months = form.querySelector('#months_rent');
      var mort = form.querySelector('#mortgage_balance');
      if (rent) {
        rent.addEventListener('blur', function () { renderMortgageOutput(form); }, true);
        rent.addEventListener('change', function () { renderMortgageOutput(form); }, true);
      }
      if (months) {
        months.addEventListener('blur', function () { renderMortgageOutput(form); }, true);
        months.addEventListener('change', function () { renderMortgageOutput(form); }, true);
      }
      if (mort) {
        mort.addEventListener('blur', function () { renderMortgageOutput(form); }, true);
        mort.addEventListener('change', function () { renderMortgageOutput(form); }, true);
      }
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
    ,computeIncomeValue: computeIncomeValue,
    renderIncomeOutput: renderIncomeOutput
    ,computeMortgageValue: computeMortgageValue,
    renderMortgageOutput: renderMortgageOutput
  };

})();
