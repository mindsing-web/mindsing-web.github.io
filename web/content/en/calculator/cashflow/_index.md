---
title: "Cashflow Calculator"
hideFromSitemap: true
password: "creative"
token_salt: "Y2FzaGZsb3ctcGFnZS1zYWx0LTIwMjUtMDktMTYtYWJjMTIz"
---

<!-- Cashflow calculator page -->

# Cashflow Calculator

<div class="password-access-wrapper">
  <button type="button" class="btn btn--primary btn--access-content" data-protect-id="cashflow">Access Content</button>
</div>

<form id="cashflow-form" class="mw8 center pa3 calculator--form js-password-protected relative pb3"
      data-protect-id="cashflow"
      data-token-salt="Y2FzaGZsb3ctcGFnZS1zYWx0LTIwMjUtMDktMTYtYWJjMTIz">

  <div class="flex flex-wrap nl2 nr2">

  <!-- ===================== Income ===================== -->
  <h2 class="w-100 ph2 mt0 mb2">Income</h2>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="annual_salary" class="db mb1">
      Annual salary
      <a href="#" class="info ml1" title="Primary earner’s gross annual income.">(i)</a>
    </label>
    <input id="annual_salary" name="annual_salary" type="number"
            class="input-reset ba b--black-20 pa2 w-100" required aria-required="true">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="spouse_income" class="db mb1">
      Spouse annual income
      <a href="#" class="info ml1" title="Partner or spouse gross annual income, if applicable.">(i)</a>
    </label>
    <input id="spouse_income" name="spouse_income" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="additional_income" class="db mb1">
      Additional income
      <a href="#" class="info ml1" title="Bonuses, side gigs, rental income, etc.">(i)</a>
    </label>
    <input id="additional_income" name="additional_income" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="average_tax_percent" class="db mb1">
      Average tax %
      <a href="#" class="info ml1" title="Estimated effective tax rate across all income.">(i)</a>
    </label>
    <input id="average_tax_percent" name="average_tax_percent" type="number" step="0.01" min="0" max="100"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <!-- Income output -->
  <div class="w-100 ph2 mb4">
    <div id="income-output" class="section-output"></div>
  </div>

  <!-- ===================== Expenses (monthly) ===================== -->
  <h2 class="w-100 ph2 mt0 mb2">Expenses, monthly</h2>

  <!-- Left column: expense fields -->
  <div class="w-100 ph2">
    <div class="flex flex-wrap nl2 nr2">

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_housing" class="db mb1">
      Housing (mortgage / rent)
      <a href="#" class="info ml1" title="Principal + interest + escrow or monthly rent.">(i)</a>
    </label>
    <input id="exp_housing" name="exp_housing" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_transportation" class="db mb1">
      Transportation <a href="#" class="info ml1" title="Fuel, public transit, maintenance, parking.">(i)</a>
    </label>
    <input id="exp_transportation" name="exp_transportation" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_utilities" class="db mb1">
      Utilities <a href="#" class="info ml1" title="Electric, gas, water, sewer, trash, internet, mobile.">(i)</a>
    </label>
    <input id="exp_utilities" name="exp_utilities" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_extras" class="db mb1">
      Extras <a href="#" class="info ml1" title="Subscriptions, gifts, hobbies—general miscellaneous.">(i)</a>
    </label>
    <input id="exp_extras" name="exp_extras" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_life_ins" class="db mb1">
      Life insurance premiums <a href="#" class="info ml1" title="Monthly life insurance payments.">(i)</a>
    </label>
    <input id="exp_life_ins" name="exp_life_ins" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_medical" class="db mb1">
      Medical <a href="#" class="info ml1" title="Health insurance, copays, prescriptions.">(i)</a>
    </label>
    <input id="exp_medical" name="exp_medical" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_groceries" class="db mb1">Groceries</label>
    <input id="exp_groceries" name="exp_groceries" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_dining_travel" class="db mb1">
      Dining, travel and entertainment
    </label>
    <input id="exp_dining_travel" name="exp_dining_travel" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_childcare" class="db mb1">
      Child care <a href="#" class="info ml1" title="Daycare, after-school, activities.">(i)</a>
    </label>
    <input id="exp_childcare" name="exp_childcare" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_credit_cards" class="db mb1">
      Credit cards <a href="#" class="info ml1" title="Monthly payments on credit card balances.">(i)</a>
    </label>
    <input id="exp_credit_cards" name="exp_credit_cards" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_other_debts" class="db mb1">
      Other debts <a href="#" class="info ml1" title="Personal loans, lines of credit, etc.">(i)</a>
    </label>
    <input id="exp_other_debts" name="exp_other_debts" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_savings" class="db mb1">
      Savings and investments <a href="#" class="info ml1" title="401(k), IRA, brokerage contributions.">(i)</a>
    </label>
    <input id="exp_savings" name="exp_savings" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="exp_other" class="db mb1">Other</label>
    <input id="exp_other" name="exp_other" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

</div>
  </div>


  <!-- Expenses output -->
  <div class="w-100 ph2 mb4">
    <div id="expenses-output" class="section-output"></div>
  </div>

  <!-- ===================== Net Cashflow ===================== -->
  <h2 class="w-100 ph2 mt3 mb2">Net cashflow</h2>
  <div class="w-100 ph2 mb4">
    <div id="net-cashflow-output" class="section-output"></div>
  </div>

  <!-- Notes dialog (shared pattern with DIME) -->

  <!-- Optional: Add key dialog (same UX as DIME) -->
  <dialog id="add-key-dialog" class="dialog mw6 center" aria-labelledby="add-key-title" aria-modal="true">
    <form class="ph3 pv3">
      <div class="flex items-center justify-between mb3">
        <h3 id="add-key-title" class="ma0">Add key</h3>
        <button type="button" id="add-key-close" class="btn btn--secondary" aria-label="Close">Close</button>
      </div>
      <label for="add_key_input" class="db mb2">Paste hashed key (base64url or base64url.signature)</label>
      <input id="add_key_input" name="add_key_input" type="text"
              class="input-reset ba b--black-20 pa2 w-100"
              placeholder="e.g. abcdef... or payload.sig" autocomplete="off">
      <p class="mv2 f6 gray">Accepted characters: letters, numbers, '-', '_' and optional '.' for signature separator.</p>
      <p id="add-key-error" class="mv2 f6 red" style="display:none;">Invalid key format. Paste a base64url token optionally with a signature separated by a dot.</p>
      <div class="tr mt3">
        <button id="add-key-submit" class="btn btn--primary" type="button">Apply key</button>
      </div>
    </form>
  </dialog>

  </div>
</form>

<p class="mw8 center ph3 pb6">
  <a href="/calculator/" class="btn btn--secondary">← Calculator Home</a>
</p>
