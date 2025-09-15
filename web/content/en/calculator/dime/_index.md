---
title: "DIME Calculator"
hideFromSitemap: true
---

<!-- DIME calculator page -->

# DIME Calculator

<form id="dime-form" class="mw7 center pa3 calculator--form">

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
  <h2 class="w-100 ph2 mt3 mb2">Income</h2>

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

  <div class="w-100 w-50-ns ph2 mb3">
    <label for="current_insurance" class="db mb1">Current in-force insurance</label>
    <input id="current_insurance" name="current_insurance" type="number"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 w-50-ns ph2 mb4">
    <label for="notes_dime" class="db mb1">Notes-DIME</label>
    <input id="notes_dime" name="notes_dime" type="text"
            class="input-reset ba b--black-20 pa2 w-100">
  </div>

  <div class="w-100 ph2 mb3">
    <p class="mb0"><span class="required-asterisk">*</span> Required field</p>
  </div>

  <div class="w-100 ph2 mv3">
    <div class="form__controls-row">
      <button type="submit" class="btn btn--primary mr2">Calculate DIME</button>
      <button type="button" class="btn btn--secondary btn--clear-values">Clear values</button>
    </div>
    <a class="btn btn--secondary mt3" href="/calculator/">Back to Calculator</a>
  </div>

</div>
</form>
