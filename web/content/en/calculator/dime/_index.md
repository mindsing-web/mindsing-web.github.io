---
title: "DIME Calculator"
hideFromSitemap: true
password: "creative"
token_salt: "b3JpZ2luYWwtc2VjdXJlLXNlcnZlci1zYWx0LWFzZGZoYWtzZA"
form_id: "dime-form"
---

<!-- DIME calculator page -->

# <h1 class="pw-hide-until-unlock">DIME Calculator</h1>

<div class="password-access-wrapper">
  <button type="button" class="btn btn--primary btn--access-content" data-protect-id="dime">Access Content</button>
</div>

<form id="dime-form" class="mw7 center pa3 calculator--form js-password-protected relative pb3" data-protect-id="dime" data-token-salt="b3JpZ2luYWwtc2VjdXJlLXNlcnZlci1zYWx0LWFzZGZoYWtzZA">

<div class="flex flex-wrap nl2 nr2">

  <!-- Section: Debt -->
  <h2 class="w-100 ph2 mt0 mb2">Debt</h2>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="final_expenses" class="db mb1">
      Final expenses
      <a href="#" class="info ml1" title="Experts recommend $10,000–25,000">(i)</a>
    </label>
    <input id="final_expenses" name="final_expenses" type="number"
      class="input-reset ba b--black-20 pa2 w-100" required aria-required="true">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="credit_card_debts" class="db mb1">Credit card debts</label>
    <input id="credit_card_debts" name="credit_card_debts" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="car_loans" class="db mb1">Car loans</label>
    <input id="car_loans" name="car_loans" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="other_debts" class="db mb1">Other debts</label>
    <input id="other_debts" name="other_debts" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <!-- Debt section output -->

  <div class="w-100 ph2 mb4">
    <div id="debt-output" class="section-output"></div>
  </div>

  <!-- Section: Income -->
  <h2 class="w-100 ph2 mt0 mb2">Income</h2>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="annual_salary" class="db mb1">Annual salary</label>
    <input id="annual_salary" name="annual_salary" type="number"
      class="input-reset ba b--black-20 pa2 w-100" required aria-required="true">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="income_multiplier" class="db mb1">
      Income multiplier
      <a href="#" class="info ml1" title="Experts recommend six to ten times annual income">(i)</a>
    </label>
    <input id="income_multiplier" name="income_multiplier" type="number"
      class="input-reset ba b--black-20 pa2 w-100" required aria-required="true">
  </div>

  <!-- Income section output -->
  <div class="w-100 ph2 mb4">
    <div id="income-output" class="section-output"></div>
  </div>

  <!-- Section: Mortgage -->
  <h2 class="w-100 ph2 mt3 mb2">Mortgage</h2>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="monthly_rent" class="db mb1">Monthly rent</label>
    <input id="monthly_rent" name="monthly_rent" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="months_rent" class="db mb1">
      Months of rent
      <a href="#" class="info ml1" title="Generally 60 (5 years)">(i)</a>
    </label>
    <input id="months_rent" name="months_rent" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="mortgage_balance" class="db mb1">Mortgage balance</label>
    <input id="mortgage_balance" name="mortgage_balance" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <!-- Mortgage section output -->
  <div class="w-100 ph2 mb4">
    <div id="mortgage-output" class="section-output"></div>
  </div>

  <!-- Section: Education -->
  <h2 class="w-100 ph2 mt3 mb2">Education</h2>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="student_loans" class="db mb1">Student loans outstanding</label>
    <input id="student_loans" name="student_loans" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="dependent_education" class="db mb1">
      Dependent education needs
      <a href="#" class="info ml1" title="Generally plan for $50k to $150k per child">(i)</a>
    </label>
    <input id="dependent_education" name="dependent_education" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <!-- Education section output -->
  <div class="w-100 ph2 mb4">
    <div id="education-output" class="section-output"></div>
  </div>

  <!-- Section: DIME Insurance Targets -->
  <h2 class="w-100 ph2 mt3 mb2">DIME Insurance Targets</h2>

  <div class="w-100 ph2 mb4">
    <div id="dime-output" class="section-output"></div>
  </div>

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="current_insurance" class="db mb1">Current in-force insurance</label>
    <input id="current_insurance" name="current_insurance" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <!-- Gap and Coverage need output -->
  <div class="w-100 ph2 mb3">
    <div id="coverage-need-output" class="section-output"></div>
  </div>

  <!-- Notes storage field: kept in-form so the generic notes dialog can read/write this value -->
  <textarea id="notes_dime" name="notes_dime" rows="4" style="display:none;" class="input-reset ba b--black-20 pa2 w-100"></textarea>

  <dialog id="add-key-dialog" class="dialog mw6 center" aria-labelledby="add-key-title" aria-modal="true">
    <form class="ph3 pv3">
      <div class="flex items-center justify-between mb3">
        <h3 id="add-key-title" class="ma0">Add key</h3>
        <button type="button" id="add-key-close" class="btn btn--secondary" aria-label="Close">Close</button>
      </div>
      <label for="add_key_input" class="db mb2">Paste hashed key (base64url or base64url.signature)</label>
      <input id="add_key_input" name="add_key_input" type="text" class="input-reset ba b--black-20 pa2 w-100" placeholder="e.g. abcdef... or payload.sig" autocomplete="off">
  <p class="mv2 f6 gray">Accepted characters: letters, numbers, '-', '_' and optional '.' for signature separator.</p>
  <p id="add-key-error" class="mv2 f6 red" style="display:none;">Invalid key format. Paste a base64url token optionally with a signature separated by a dot.</p>
      <div class="tr mt3">
  <button id="add-key-submit" class="btn btn--primary" type="button">Apply key</button>
      </div>
    </form>
  </dialog>
</div>
</form>

<p class="mw7 center ph3 pb6">
  <a href="/calculator/" class="btn btn--secondary pw-hide-until-unlock">← Calculator Home</a>
</p>
