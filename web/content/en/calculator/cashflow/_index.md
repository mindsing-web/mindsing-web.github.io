---
title: "Cashflow Calculator"
hideFromSitemap: true
password: "creative"
token_salt: "Y2FzaGZsb3ctcGFnZS1zYWx0LTIwMjUtMDktMTYtYWJjMTIz"
form_id: "cashflow-form"
---

<!-- Cashflow calculator page -->

<h1 class="pw-hide-until-unlock">Cashflow Calculator</h1>

<div class="password-access-wrapper">
  <button type="button" class="btn btn--primary btn--access-content" data-protect-id="cashflow">Access Content</button>
</div>

<form id="cashflow-form" class="mw8 center pa3 calculator--form js-password-protected relative pb3"
      data-protect-id="cashflow"
      data-token-salt="Y2FzaGZsb3ctcGFnZS1zYWx0LTIwMjUtMDktMTYtYWJjMTIz">

  <div class="flex flex-wrap nl2 nr2">

  <!-- ===================== Income Section (Restructured) ===================== -->
  <div id="income-section" class="w-100 mb4 br3 shadow-1 bg-white ba b--black-10 bl br" style="overflow:hidden;">
    <h2 class="mt0 mb0 pv3 ph2 collapse-section-header bb b--black-10 flex items-center bg-near-white" id="after-tax-header">
      After tax income
      <span class="collapse-caret" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="currentColor"><path d="M7 5l6 5-6 5V5z"/></svg>
      </span>
    </h2>
  <div class="flex flex-wrap nl2 nr2 collapsible-section bg-white pv3 ph3" id="income-collapsible-section">
      <div class="w-100 w-50-ns ph2">
        <h3 class="mt0 mb2">Income</h3>
        <div class="flex flex-wrap nl2 nr2">
          <div class="w-100 ph2 mb3">
            <label for="annual_salary" class="db mb1">
              Annual salary
              <a href="#" class="info ml1" title="Primary earner’s gross annual income.">(i)</a>
            </label>
            <input id="annual_salary" name="annual_salary" type="number"
                    class="input-reset ba b--black-20 pa2 w-100" required aria-required="true">
          </div>
          <div class="w-100 ph2 mb3">
            <label for="spouse_income" class="db mb1">
              Spouse annual income
              <a href="#" class="info ml1" title="Partner or spouse gross annual income, if applicable.">(i)</a>
            </label>
            <input id="spouse_income" name="spouse_income" type="number"
                    class="input-reset ba b--black-20 pa2 w-100">
          </div>
          <div class="w-100 ph2 mb3">
            <label for="additional_income" class="db mb1">
              Additional income
              <a href="#" class="info ml1" title="Bonuses, side gigs, rental income, etc.">(i)</a>
            </label>
            <input id="additional_income" name="additional_income" type="number"
                    class="input-reset ba b--black-20 pa2 w-100">
          </div>
        </div>
        <!-- Gross and monthly gross summary -->
        <div id="income-section-summary" class="mt3"></div>
      </div>
      <div class="w-100 w-50-ns ph2">
        <h3 class="mt0 mb2">Tax estimation</h3>
        <div class="w-100 ph2 mb3">
          <label for="average_tax_percent" class="db mb1">
            Estimated effective tax rate (%)
          </label>
          <input type="number" id="average_tax_percent" name="average_tax_percent" min="0" max="100" step="0.01" class="input-reset ba b--black-20 pa2 w-100 not-allowed" readonly>
          <div class="mt2">
            <label class="flex items-center ma0">
              <input type="checkbox" id="override-tax-input" class="mr2">
              Override
            </label>
          </div>
          <div id="average-tax-help" class="mv2 f6 gray">Estimated tax rate.</div>
          <p class="mv2 f6">
            <a href="#" id="tax-assumptions-link">Tax assumptions</a>
          </p>
          <div id="annual-tax-liability" class="help-text mt2"></div>
        </div>
      </div>
    </div>
    <!-- Tax assumptions modal (unchanged, remains inside the section for context) -->
    <div class="bt b--black-10 bg-near-white pv2 ph2 flex items-center justify-between" style="border-bottom-left-radius:.5rem;border-bottom-right-radius:.5rem;">
  <div id="income-output" class="section-output fw6"></div>
    </div>
  </div>

  <!-- Monthly after-tax income output now integrated in income-section footer above -->

  <!-- Tax assumptions modal -->
  <dialog id="tax-assumptions-modal" class="dialog mw6 center" aria-labelledby="tax-assumptions-title" aria-modal="true">
    <form method="dialog" class="ph3 pv3">
      <div class="flex items-center justify-between mb3">
        <h3 id="tax-assumptions-title" class="ma0">Tax assumptions</h3>
        <button type="button" id="tax-assumptions-close" class="btn btn--secondary" aria-label="Close">Close</button>
      </div>
      <div class="mb3">
        <p>
          Simplified guidance: uses approximate single-filer federal brackets plus ~4% state/local.</p>
          <p>Brackets used (approx):</p>
          <p>
          10% up to $11,000;<br>
          12% up to $44,725;<br>
          22% up to $95,375;<br>
          24% up to $182,100;<br>
          32% up to $231,250;<br>
          35% up to $578,125;<br>
          37% above that.</p>
          <p>Source: <a href="https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2023" target="_blank" rel="noopener">
            IRS 2023 tax brackets
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="0.95em" height="0.95em" style="display:inline;margin-left:0.18em;vertical-align:-0.18em;fill:currentColor;" aria-hidden="true" focusable="false"><path d="M14 3h7v7h-2V6.41l-9.29 9.3a1 1 0 0 1-1.42-1.42l9.3-9.29H14V3z"></path><path d="M5 5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7H5V5z"></path></svg>
          </a>
        </p>
      </div>
    </form>
  </dialog>

  <!-- Income output -->
  <div class="w-100 ph2 mb4">
    <div id="income-output" class="section-output"></div>
  </div>

  <!-- ===================== Deductions Collapsible Section ===================== -->
  <div id="deductions-section" class="w-100 mb4 br3 shadow-1 bg-white ba b--black-10 bl br" style="overflow:hidden;">
  <h2 class="mt0 mb0 pv3 ph2 collapse-section-header bb b--black-10 flex items-center bg-near-white" id="deductions-header" data-default-collapsed="true">
      Deductions
      <span class="collapse-caret" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="currentColor"><path d="M7 5l6 5-6 5V5z"/></svg>
      </span>
    </h2>
    <div class="collapsible-section bg-white pv3 ph3" id="deductions-collapsible-section">
      <div class="flex flex-wrap nl2 nr2">
        <div class="w-100 w-50-ns ph2 mb3">
          <label for="deduct_retirement" class="db mb1">
            Retirement contributions (401k, IRA) <span class="gray">(monthly)</span>
          </label>
          <input id="deduct_retirement" name="deduct_retirement" type="number" class="input-reset ba b--black-20 pa2 w-100" min="0">
        </div>
        <div class="w-100 w-50-ns ph2 mb3">
          <label for="deduct_health" class="db mb1">
            Health insurance premiums <span class="gray">(monthly)</span>
          </label>
          <input id="deduct_health" name="deduct_health" type="number" class="input-reset ba b--black-20 pa2 w-100" min="0">
        </div>
        <div class="w-100 w-50-ns ph2 mb3">
          <label for="deduct_hsa" class="db mb1">
            HSA/FSA contributions <span class="gray">(monthly)</span>
          </label>
          <input id="deduct_hsa" name="deduct_hsa" type="number" class="input-reset ba b--black-20 pa2 w-100" min="0">
        </div>
        <div class="w-100 w-50-ns ph2 mb3">
          <label for="duduct_monthly_other" class="db mb1">
            Other monthly deductions <span class="gray">(monthly)</span>
          </label>
          <input id="duduct_monthly_other" name="duduct_monthly_other" type="number" class="input-reset ba b--black-20 pa2 w-100" min="0">
        </div>
      </div>
      <div id="deduction-benefit-summary" class="mt3"></div>
      <!-- Annual Deductions Collapsible Section -->
      <div id="annual-deductions-section" class="mt4 br2 shadow-1 bg-white ba b--black-10" style="overflow:hidden;">
  <h3 class="mt0 mb0 pv2 ph2 collapse-section-header bb b--black-10 flex items-center bg-near-white pointer" id="annual-deductions-header" data-default-collapsed="true">
          Annual deductions
          <span class="collapse-caret ml2" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M7 5l6 5-6 5V5z"/></svg>
          </span>
        </h3>
        <div class="collapsible-section bg-white pv3 ph3" id="annual-deductions-collapsible-section">
          <div class="flex flex-wrap nl2 nr2">
            <div class="w-100 w-50-ns ph2 mb3">
              <label for="annual_charity" class="db mb1">
                Charitable contributions <span class="gray">(annual)</span>
              </label>
              <input id="annual_charity" name="annual_charity" type="number" class="input-reset ba b--black-20 pa2 w-100" min="0">
            </div>
            <div class="w-100 w-50-ns ph2 mb3">
              <label for="annual_mortgage_interest" class="db mb1">
                Mortgage interest <span class="gray">(annual)</span>
              </label>
              <input id="annual_mortgage_interest" name="annual_mortgage_interest" type="number" class="input-reset ba b--black-20 pa2 w-100" min="0">
            </div>
            <div class="w-100 w-50-ns ph2 mb3">
              <label for="annual_property_tax" class="db mb1">
                Property taxes <span class="gray">(annual)</span>
              </label>
              <input id="annual_property_tax" name="annual_property_tax" type="number" class="input-reset ba b--black-20 pa2 w-100" min="0">
            </div>
            <div class="w-100 w-50-ns ph2 mb3">
              <label for="annual_other" class="db mb1">
                Other annual deductions <span class="gray">(annual)</span>
              </label>
              <input id="annual_other" name="annual_other" type="number" class="input-reset ba b--black-20 pa2 w-100" min="0">
            </div>
          </div>
          <div id="annual-deduction-summary" class="mt3"></div>
        </div>
      </div>
    </div>
    <div class="bt b--black-10 bg-near-white pv2 ph2 flex items-center justify-between br--bottom br3">
      <div id="deductions-output" class="section-output fw6"></div>
    </div>
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
  <!-- Notes storage field (kept in-form so the shared notes dialog can read/write) -->

<textarea id="expense_notes" name="expense_notes" rows="4" style="display:none;" class="input-reset ba b--black-20 pa2 w-100"></textarea>

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
  <a href="/calculator/" class="btn btn--secondary pw-hide-until-unlock">← Calculator Home</a>
</p>
