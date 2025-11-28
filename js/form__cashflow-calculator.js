// Cashflow calculator specific behaviors (Income gross calculation)
(function () {
  "use strict";

  function formatCurrency(val) {
    try {
      var n = Number(val) || 0;
      return n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });
    } catch (e) {
      return "$0";
    }
  }

  // --- Deduction benefit summary ---
  function renderDeductionBenefitSummary(form) {
    try {
      var retirement =
        parseFloat(form.querySelector("#deduct_retirement")?.value) || 0;
      var health = parseFloat(form.querySelector("#deduct_health")?.value) || 0;
      var hsa = parseFloat(form.querySelector("#deduct_hsa")?.value) || 0;
      var other =
        parseFloat(form.querySelector("#duduct_monthly_other")?.value) || 0;
      var totalMonthly = retirement + health + hsa + other;
      var totalAnnual = totalMonthly * 12;
      var taxInput = form.querySelector("#average_tax_percent");
      var taxRate = taxInput ? parseFloat(taxInput.value) : 0;
      if (!isFinite(taxRate) || taxRate < 0) taxRate = 0;
      var annualTaxBenefit = totalAnnual * (taxRate / 100);
      var out = document.getElementById("deduction-benefit-summary");
      if (!out) return;

      // Only show content if there are actual deductions
      if (totalMonthly > 0 || totalAnnual > 0) {
        out.innerHTML =
          '<p class="mb0"><strong>Total monthly paycheck deductions:</strong> ' +
          formatCurrency(totalMonthly) +
          "</p>" +
          '<p class="mt1 mb0"><strong>Total annual deductions:</strong> ' +
          formatCurrency(totalAnnual) +
          "</p>" +
          '<p class="mt2 mb0"><strong>Estimated annual tax benefit:</strong> ' +
          formatCurrency(annualTaxBenefit) +
          "</p>" +
          '<p class="mt1 mb0"><small>Tax benefit is estimated as total annual deductions × effective tax rate.</small></p>';
      } else {
        out.innerHTML = "";
      }
    } catch (e) {
      console.error("[deduction-summary] error", e);
    }
  }

  // --- Annual deductions summary (annual fields) ---
  function renderAnnualDeductionSummary(form) {
    try {
      var charity =
        parseFloat(form.querySelector("#annual_charity")?.value) || 0;
      var mortgage =
        parseFloat(form.querySelector("#annual_mortgage_interest")?.value) || 0;
      var property =
        parseFloat(form.querySelector("#annual_property_tax")?.value) || 0;
      var other = parseFloat(form.querySelector("#annual_other")?.value) || 0;
      var total = charity + mortgage + property + other;
      var out = document.getElementById("annual-deduction-summary");
      if (!out) return;
      if (!total) {
        out.innerHTML = "";
        return;
      }
      out.innerHTML =
        '<p class="mb0"><strong>Total annual deductions:</strong> ' +
        formatCurrency(total) +
        "</p>";
    } catch (e) {
      console.error("[annual-deduction-summary] error", e);
    }
  }

  // --- Comprehensive deductions output (monthly cashflow impact) ---
  function renderDeductionsOutput(form) {
    try {
      var calcArea = document.getElementById("deductions-calculations");
      var summaryOut = document.getElementById("deductions-output");
      if (!calcArea || !summaryOut) return;

      // Monthly paycheck deductions
      var retirement =
        parseFloat(form.querySelector("#deduct_retirement")?.value) || 0;
      var health = parseFloat(form.querySelector("#deduct_health")?.value) || 0;
      var hsa = parseFloat(form.querySelector("#deduct_hsa")?.value) || 0;
      var monthlyOther =
        parseFloat(form.querySelector("#duduct_monthly_other")?.value) || 0;
      var totalMonthlyDeductions = retirement + health + hsa + monthlyOther;

      // Annual deductions (converted to monthly impact)
      var charity =
        parseFloat(form.querySelector("#annual_charity")?.value) || 0;
      var mortgage =
        parseFloat(form.querySelector("#annual_mortgage_interest")?.value) || 0;
      var property =
        parseFloat(form.querySelector("#annual_property_tax")?.value) || 0;
      var annualOther =
        parseFloat(form.querySelector("#annual_other")?.value) || 0;
      var totalAnnualDeductions = charity + mortgage + property + annualOther;
      var monthlyFromAnnual = totalAnnualDeductions / 12;

      // Get tax rate for benefit calculations
      var taxInput = form.querySelector("#average_tax_percent");
      var taxRate = taxInput ? parseFloat(taxInput.value) : 0;
      if (!isFinite(taxRate) || taxRate < 0) taxRate = 0;

      // Calculate tax benefits
      var monthlyPaycheckTaxSavings = totalMonthlyDeductions * (taxRate / 100);
      var annualTaxSavings = totalAnnualDeductions * (taxRate / 100);
      var monthlyFromAnnualTaxSavings = annualTaxSavings / 12;
      var totalMonthlyTaxSavings =
        monthlyPaycheckTaxSavings + monthlyFromAnnualTaxSavings;

      // Net monthly impact (deductions reduce take-home, but tax savings increase it)
      var netMonthlyImpact =
        -(totalMonthlyDeductions + monthlyFromAnnual) + totalMonthlyTaxSavings;

      // Build detailed calculations output for the white area
      var calcHtml = "";
      if (totalMonthlyDeductions > 0 || totalAnnualDeductions > 0) {
        calcHtml = '<div class="f6">';
        if (totalMonthlyDeductions > 0) {
          calcHtml +=
            '<p class="mb2"><strong>Monthly paycheck deductions:</strong> ' +
            formatCurrency(totalMonthlyDeductions) +
            "</p>";
        }
        if (totalAnnualDeductions > 0) {
          calcHtml +=
            '<p class="mb2"><strong>Monthly impact from annual deductions:</strong> ' +
            formatCurrency(monthlyFromAnnual) +
            "</p>";
        }
        calcHtml +=
          '<p class="mb2"><strong>Total monthly deductions impact:</strong> ' +
          formatCurrency(totalMonthlyDeductions + monthlyFromAnnual) +
          "</p>";
        if (taxRate > 0) {
          calcHtml +=
            '<p class="mb2 green"><strong>Monthly tax savings:</strong> ' +
            formatCurrency(totalMonthlyTaxSavings) +
            "</p>";
          calcHtml +=
            '<p class="mb0 f7">Based on ' +
            taxRate +
            "% effective tax rate</p>";
        }
        calcHtml += "</div>";
      }
      calcArea.innerHTML = calcHtml;

      // Build summary output with after-deductions income for the gray footer
      var grossAnnual = computeGrossIncome(form);
      var grossMonthly = grossAnnual / 12;
      var afterTaxMonthly = grossMonthly * (1 - taxRate / 100);
      var afterDeductionsMonthly = afterTaxMonthly + netMonthlyImpact;

      // Check if there are any income inputs with values > 0
      var hasIncomeInputs = false;
      var incomeIds = ["annual_salary", "spouse_income", "additional_income"];
      incomeIds.forEach(function (id) {
        var el = form.querySelector("#" + id);
        if (el && el.value && parseFloat(el.value) > 0) {
          hasIncomeInputs = true;
        }
      });

      if (hasIncomeInputs && grossAnnual > 0) {
        summaryOut.innerHTML =
          '<h3 class="mt0 mb0">Monthly after-tax and deductions income: ' +
          formatCurrency(afterDeductionsMonthly) +
          "</h3>";
      } else {
        summaryOut.innerHTML = "";
      }

      // Update net cashflow whenever deductions change
      renderNetCashflowOutput(form);
    } catch (e) {
      console.error("[deductions-output] error", e);
    }
  }

  function computeGrossIncome(form) {
    try {
      var ids = ["annual_salary", "spouse_income", "additional_income"];
      var sum = 0;
      ids.forEach(function (id) {
        var el = form.querySelector("#" + id);
        if (!el) return;
        var v = parseFloat(el.value);
        if (!isFinite(v)) v = 0;
        sum += v;
      });
      return sum;
    } catch (e) {
      console.error("form__cashflow computeGrossIncome error:", e);
      return 0;
    }
  }

  function renderGrossIncome(form) {
    try {
      var out = document.getElementById("income-output");
      if (!out) return;
      var value = computeGrossIncome(form);
      if (!value) {
        // leave blank but keep element available for layout
        out.innerHTML = "";
        return;
      }
      // Monthly gross
      var monthlyGross = value / 12;
      // After-tax monthly
      var taxInput = form.querySelector("#average_tax_percent");
      var taxRate = taxInput ? parseFloat(taxInput.value) : 0;
      if (!isFinite(taxRate) || taxRate < 0) taxRate = 0;
      var afterTaxAnnual = value * (1 - taxRate / 100);
      var afterTaxMonthly = afterTaxAnnual / 12;
      // Move gross and monthly gross inside income-section, after-tax outside
      var grossHtml =
        '<p class="mb0"><strong>Gross income =</strong> ' +
        formatCurrency(value) +
        "</p>" +
        '<p class="mt1 mb0"><small>Sum of salary, spouse, and additional income</small></p>' +
        '<p class="mt2 mb0"><strong>Monthly gross income =</strong> ' +
        formatCurrency(monthlyGross) +
        "</p>";
      var afterTaxHtml =
        '<h3 class="mt2 mb0"><strong>Monthly after-tax income =</strong> ' +
        formatCurrency(afterTaxMonthly) +
        "</h3>";
      // Place grossHtml inside #income-section-summary, afterTaxHtml in #income-output
      var sectionSummary = form.querySelector("#income-section-summary");
      if (sectionSummary) sectionSummary.innerHTML = grossHtml;
      out.innerHTML = afterTaxHtml;
      renderDeductionBenefitSummary(form);
      renderNetCashflowOutput(form);
    } catch (e) {
      console.error("form__cashflow renderGrossIncome error:", e);
    }
  }

  // --- Expenses calculation and output ---
  function computeMonthlyExpenses(form) {
    try {
      var expenseIds = [
        "exp_housing",
        "exp_transportation",
        "exp_utilities",
        "exp_extras",
        "exp_life_ins",
        "exp_medical",
        "exp_groceries",
        "exp_dining_travel",
        "exp_childcare",
        "exp_credit_cards",
        "exp_other_debts",
        "exp_savings",
        "exp_other",
      ];
      var total = 0;
      expenseIds.forEach(function (id) {
        var el = form.querySelector("#" + id);
        if (!el) return;
        var val = parseFloat(el.value) || 0;
        total += val;
      });
      return total;
    } catch (e) {
      console.error("[computeMonthlyExpenses] error:", e);
      return 0;
    }
  }

  function renderExpensesOutput(form) {
    try {
      var out = document.getElementById("expenses-output");
      if (!out) return;

      var totalExpenses = computeMonthlyExpenses(form);

      if (totalExpenses === 0) {
        out.innerHTML =
          '<h3 class="mt0 mb0">Total monthly expenses: Enter expenses above</h3>';
        return;
      }

      out.innerHTML =
        '<h3 class="mt0 mb0">Total monthly expenses: ' +
        formatCurrency(totalExpenses) +
        "</h3>";

      // Update net cashflow whenever expenses change
      renderNetCashflowOutput(form);
    } catch (e) {
      console.error("[expenses-output] error", e);
    }
  }

  // --- Net Cashflow calculation and output ---
  function renderNetCashflowOutput(form) {
    try {
      var headerSpan = document.getElementById("net-cashflow-amount");
      var header = document.getElementById("net-cashflow-header");
      if (!headerSpan) return;

      // Get monthly after-tax and deductions income
      var grossMonthly = computeGrossIncome(form) / 12;
      if (grossMonthly === 0) {
        if (headerSpan) headerSpan.textContent = "";
        if (header)
          header.className = header.className.replace(/ (green|red)/g, "");
        return;
      }

      // Calculate after-tax and deductions income (same logic as deductions output)
      var taxInput = form.querySelector("#average_tax_percent");
      var taxRate = taxInput ? parseFloat(taxInput.value) : 0;
      if (!isFinite(taxRate) || taxRate < 0) taxRate = 0;

      var afterTaxMonthly = grossMonthly * (1 - taxRate / 100);

      // Get deduction impact
      var retirement =
        parseFloat(form.querySelector("#deduct_retirement")?.value) || 0;
      var health = parseFloat(form.querySelector("#deduct_health")?.value) || 0;
      var hsa = parseFloat(form.querySelector("#deduct_hsa")?.value) || 0;
      var monthlyOther =
        parseFloat(form.querySelector("#duduct_monthly_other")?.value) || 0;
      var totalMonthlyDeductions = retirement + health + hsa + monthlyOther;

      var charity =
        parseFloat(form.querySelector("#annual_charity")?.value) || 0;
      var mortgage =
        parseFloat(form.querySelector("#annual_mortgage_interest")?.value) || 0;
      var property =
        parseFloat(form.querySelector("#annual_property_tax")?.value) || 0;
      var annualOther =
        parseFloat(form.querySelector("#annual_other")?.value) || 0;
      var totalAnnualDeductions = charity + mortgage + property + annualOther;
      var monthlyFromAnnual = totalAnnualDeductions / 12;

      var monthlyPaycheckTaxSavings = totalMonthlyDeductions * (taxRate / 100);
      var annualTaxSavings = totalAnnualDeductions * (taxRate / 100);
      var monthlyFromAnnualTaxSavings = annualTaxSavings / 12;
      var totalMonthlyTaxSavings =
        monthlyPaycheckTaxSavings + monthlyFromAnnualTaxSavings;

      var netMonthlyDeductionImpact =
        -(totalMonthlyDeductions + monthlyFromAnnual) + totalMonthlyTaxSavings;
      var afterDeductionsMonthly = afterTaxMonthly + netMonthlyDeductionImpact;

      // Get total monthly expenses
      var totalExpenses = computeMonthlyExpenses(form);

      // Calculate net cashflow
      var netCashflow = afterDeductionsMonthly - totalExpenses;

      // Display with color coding
      var colorClass = netCashflow >= 0 ? "green" : "red";
      var sign = netCashflow >= 0 ? "+" : "";

      // Update the H2 header span and apply color class to header
      if (headerSpan) {
        headerSpan.textContent = sign + formatCurrency(netCashflow);
      }
      if (header) {
        // Remove existing color classes and add the appropriate one
        header.className =
          header.className.replace(/ (green|red)/g, "") + " " + colorClass;
      }
    } catch (e) {
      console.error("[net-cashflow-output] error", e);
    }
  }

  // --- Tax guidance ---
  // Simple US federal tax bracket approximation (single filer, 2023-ish thresholds)
  var FEDERAL_BRACKETS = [
    { rate: 0.1, thresh: 11000 },
    { rate: 0.12, thresh: 44725 },
    { rate: 0.22, thresh: 95375 },
    { rate: 0.24, thresh: 182100 },
    { rate: 0.32, thresh: 231250 },
    { rate: 0.35, thresh: 578125 },
    { rate: 0.37, thresh: Infinity },
  ];

  function estimateEffectiveTaxRate(gross) {
    try {
      if (!isFinite(gross) || gross <= 0) return 0;
      // approximate progressive tax to compute an effective federal rate
      var remaining = gross;
      var prev = 0;
      var tax = 0;
      for (var i = 0; i < FEDERAL_BRACKETS.length; i++) {
        var b = FEDERAL_BRACKETS[i];
        var slice = Math.max(0, Math.min(remaining, b.thresh - prev));
        if (slice <= 0) {
          prev = b.thresh;
          continue;
        }
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

  function updateTaxHelp(form) {
    try {
      var help = document.getElementById("average-tax-help");
      if (!help) return;
      var gross = computeGrossIncome(form) || 0;
      if (!gross || gross <= 0) {
        help.textContent =
          "Enter your estimated effective tax rate or use the suggested rate based on gross income.";
        updateAnnualTaxLiability(0, 0);
        return;
      }
      var suggested = estimateEffectiveTaxRate(gross);
      help.innerHTML =
        "Suggested effective tax rate: <strong>" +
        (suggested ? suggested + "%" : "—") +
        "</strong> based on gross income of " +
        formatCurrency(gross) +
        ". You can override in the field above.";
      updateAnnualTaxLiability(gross, suggested);
    } catch (e) {}
  }

  // --- Annual tax liability display ---
  function updateAnnualTaxLiability(gross, effectiveRate) {
    try {
      var liabilityEl = document.getElementById("annual-tax-liability");
      if (!liabilityEl) return;
      if (!gross || !effectiveRate) {
        liabilityEl.innerHTML = "";
        return;
      }
      var tax = Math.round((gross * effectiveRate) / 100);
      liabilityEl.innerHTML =
        '<p class="mb0"><strong>Estimated annual tax liability:</strong> ' +
        formatCurrency(tax) +
        "</p>";
    } catch (e) {}
  }

  function attachHandlers(form) {
    // Deduction fields update summary and output
    [
      "deduct_retirement",
      "deduct_health",
      "deduct_hsa",
      "duduct_monthly_other",
    ].forEach(function (id) {
      var el = form.querySelector("#" + id);
      if (!el) return;
      el.addEventListener(
        "input",
        function () {
          renderDeductionBenefitSummary(form);
          renderDeductionsOutput(form);
        },
        true
      );
    });
    // Also update summary when tax rate changes
    var taxInput2 = form.querySelector("#average_tax_percent");
    if (taxInput2) {
      taxInput2.addEventListener(
        "input",
        function () {
          renderDeductionBenefitSummary(form);
          renderDeductionsOutput(form);
        },
        true
      );
    }
    try {
      if (!form) return;
      var fields = ["annual_salary", "spouse_income", "additional_income"];
      fields.forEach(function (id) {
        var el = form.querySelector("#" + id);
        if (!el) return;
        // on focus change (blur) update output
        el.addEventListener(
          "blur",
          function () {
            renderGrossIncome(form);
            autoPopulateTax(form);
            renderDeductionsOutput(form);
          },
          true
        );
        // also update on input change for better UX
        el.addEventListener(
          "change",
          function () {
            renderGrossIncome(form);
            autoPopulateTax(form);
            renderDeductionsOutput(form);
          },
          true
        );
      });
      // Also update output when tax input changes
      var taxInput = form.querySelector("#average_tax_percent");
      if (taxInput) {
        taxInput.addEventListener(
          "input",
          function () {
            renderGrossIncome(form);
            renderDeductionsOutput(form);
          },
          true
        );
      }
      // Handler for override checkbox
      var override = form.querySelector("#override-tax-input");
      var taxInput = form.querySelector("#average_tax_percent");
      if (override && taxInput) {
        override.addEventListener("change", function () {
          if (override.checked) {
            taxInput.removeAttribute("readonly");
            taxInput.classList.remove("not-allowed");
            taxInput.required = true;
            taxInput.focus();
          } else {
            taxInput.setAttribute("readonly", "readonly");
            taxInput.classList.add("not-allowed");
            taxInput.required = false;
            autoPopulateTax(form);
            // Recalculate income section to reflect the updated tax rate
            renderGrossIncome(form);
            updateTaxHelp(form);
            renderDeductionsOutput(form);
          }
        });
      }
      // Annual deduction fields: update annual summary and deductions output on input/change/blur
      [
        "annual_charity",
        "annual_mortgage_interest",
        "annual_property_tax",
        "annual_other",
      ].forEach(function (id) {
        var el = form.querySelector("#" + id);
        if (!el) return;
        el.addEventListener(
          "input",
          function () {
            renderAnnualDeductionSummary(form);
            renderDeductionsOutput(form);
          },
          true
        );
        el.addEventListener(
          "change",
          function () {
            renderAnnualDeductionSummary(form);
            renderDeductionsOutput(form);
          },
          true
        );
        el.addEventListener(
          "blur",
          function () {
            renderAnnualDeductionSummary(form);
            renderDeductionsOutput(form);
          },
          true
        );
      });

      // Expense fields: update expenses output on input/change/blur
      var expenseIds = [
        "exp_housing",
        "exp_transportation",
        "exp_utilities",
        "exp_extras",
        "exp_life_ins",
        "exp_medical",
        "exp_groceries",
        "exp_dining_travel",
        "exp_childcare",
        "exp_credit_cards",
        "exp_other_debts",
        "exp_savings",
        "exp_other",
      ];
      expenseIds.forEach(function (id) {
        var el = form.querySelector("#" + id);
        if (!el) return;
        el.addEventListener(
          "input",
          function () {
            renderExpensesOutput(form);
          },
          true
        );
        el.addEventListener(
          "change",
          function () {
            renderExpensesOutput(form);
          },
          true
        );
        el.addEventListener(
          "blur",
          function () {
            renderExpensesOutput(form);
          },
          true
        );
      });
    } catch (e) {
      console.error("form__cashflow attachHandlers error:", e);
    }
  }

  // Auto-populate tax input unless override is checked
  function autoPopulateTax(form) {
    try {
      var taxInput = form.querySelector("#average_tax_percent");
      var override = form.querySelector("#override-tax-input");
      if (!taxInput || (override && override.checked)) return;
      var gross = computeGrossIncome(form) || 0;
      var suggested = gross ? estimateEffectiveTaxRate(gross) : "";
      if (suggested) {
        taxInput.value = suggested;
      } else {
        taxInput.value = "";
      }
      taxInput.setAttribute("readonly", "readonly");
      taxInput.classList.add("not-allowed");
      taxInput.required = false;

      // Trigger input event to ensure calculations update
      try {
        var event = new Event("input", { bubbles: true });
        taxInput.dispatchEvent(event);
      } catch (e) {
        // Fallback for older browsers
        if (taxInput.fireEvent) {
          taxInput.fireEvent("oninput");
        }
      }

      renderDeductionBenefitSummary(form);
    } catch (e) {}
  }

  // Initialize when DOM is ready
  document.addEventListener(
    "DOMContentLoaded",
    function () {
      try {
        var form =
          document.getElementById("cashflow-form") ||
          document.querySelector("form.calculator--form");
        if (!form) return;
        attachHandlers(form);
        renderDeductionBenefitSummary(form);
        // On load, ensure tax input state matches override checkbox
        var override = form.querySelector("#override-tax-input");
        var taxInput = form.querySelector("#average_tax_percent");
        if (override && taxInput) {
          if (override.checked) {
            taxInput.removeAttribute("readonly");
            taxInput.classList.remove("not-allowed");
            taxInput.required = true;
          } else {
            taxInput.setAttribute("readonly", "readonly");
            taxInput.classList.add("not-allowed");
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
        // render annual deduction summary and deductions output on load (if values present)
        renderAnnualDeductionSummary(form);
        renderDeductionsOutput(form);
        renderExpensesOutput(form);
        renderNetCashflowOutput(form);
        // update tax help when gross income changes
        try {
          // hook into our render call so tax help also updates
          var origRender =
            window.formCashflow && window.formCashflow.renderIncomeOutput;
          // ensure help updates on input events for income fields
          ["annual_salary", "spouse_income", "additional_income"].forEach(
            function (id) {
              var el = form.querySelector("#" + id);
              if (!el) return;
              el.addEventListener(
                "blur",
                function () {
                  updateTaxHelp(form);
                },
                true
              );
              el.addEventListener(
                "change",
                function () {
                  updateTaxHelp(form);
                },
                true
              );
            }
          );
          // update when average tax input is focused to show guidance
          var taxInput = form.querySelector("#average_tax_percent");
          if (taxInput) {
            taxInput.addEventListener(
              "focus",
              function () {
                updateTaxHelp(form);
              },
              true
            );
            // Also update annual tax liability on manual input
            taxInput.addEventListener(
              "input",
              function () {
                var gross = computeGrossIncome(form) || 0;
                var val = parseFloat(taxInput.value);
                if (!isFinite(val) || val <= 0) {
                  updateAnnualTaxLiability(gross, 0);
                } else {
                  updateAnnualTaxLiability(gross, val);
                }
              },
              true
            );
          }
          // initial help update
          updateTaxHelp(form);
          // --- Tax assumptions modal ---
          var taxAssumptionsLink = document.getElementById(
            "tax-assumptions-link"
          );
          var taxAssumptionsModal = document.getElementById(
            "tax-assumptions-modal"
          );
          var taxAssumptionsClose = document.getElementById(
            "tax-assumptions-close"
          );
          if (taxAssumptionsLink && taxAssumptionsModal) {
            taxAssumptionsLink.addEventListener("click", function (e) {
              e.preventDefault();
              taxAssumptionsModal.showModal();
            });
          }
          if (taxAssumptionsClose && taxAssumptionsModal) {
            taxAssumptionsClose.addEventListener("click", function (e) {
              e.preventDefault();
              taxAssumptionsModal.close();
            });
          }
        } catch (e) {}
        // Clear output when form values are cleared via the shared clear-values flow
        try {
          form.addEventListener(
            "form:cleared",
            function () {
              // If we're in summary view, expand back to full form first
              if (form.getAttribute("data-cashflow-collapsed") === "true") {
                expandFromSummary(form);
              }

              // Clear all output elements
              var outputIds = [
                "income-output",
                "income-section-summary",
                "deduction-benefit-summary",
                "deductions-calculations",
                "annual-deduction-summary",
                "deductions-output",
                "expenses-output",
              ];
              outputIds.forEach(function (id) {
                var el = document.getElementById(id);
                if (el) el.innerHTML = "";
              });

              // Clear net cashflow display
              var netCashflowSpan = document.getElementById(
                "net-cashflow-amount"
              );
              var netCashflowHeader = document.getElementById(
                "net-cashflow-header"
              );
              if (netCashflowSpan) netCashflowSpan.textContent = "";
              if (netCashflowHeader) {
                netCashflowHeader.className =
                  netCashflowHeader.className.replace(/ (green|red)/g, "");
              }

              // Clear estimated tax field by id (not scoped to form, in case of duplicate ids)
              var taxInput = document.getElementById("average_tax_percent");
              if (taxInput) taxInput.value = "";
              // Clear help text for estimated tax
              var taxHelp = document.getElementById("average-tax-help");
              if (taxHelp) taxHelp.textContent = "Estimated tax rate.";
              // Clear annual tax liability
              var liabilityEl = document.getElementById("annual-tax-liability");
              if (liabilityEl) liabilityEl.innerHTML = "";
              // Uncheck override and reset input state
              var override = document.getElementById("override-tax-input");
              if (override) override.checked = false;
              if (taxInput) {
                taxInput.setAttribute("readonly", "readonly");
                taxInput.required = false;
              }
              // Move focus to first input (annual_salary) for accessibility
              var firstInput = document.getElementById("annual_salary");
              if (firstInput) firstInput.focus();
            },
            true
          );
        } catch (e) {
          /* ignore */
        }
        // expose for manual calls if needed
        window.formCashflow = window.formCashflow || {};
        window.formCashflow.renderIncomeOutput = function () {
          renderGrossIncome(form);
        };
        window.formCashflow.collapseToSummary = collapseToSummary;
        window.formCashflow.expandFromSummary = expandFromSummary;
        // expose annual deduction renderer for debugging/workaround
        window.formCashflow.renderAnnualDeductions = function () {
          renderAnnualDeductionSummary(
            document.getElementById("cashflow-form") ||
              document.querySelector("form.calculator--form")
          );
        };
        // Safety: attach document-level listeners to annual fields in case form-scoped handlers miss them
        [
          "annual_charity",
          "annual_mortgage_interest",
          "annual_property_tax",
          "annual_other",
        ].forEach(function (id) {
          var el = document.getElementById(id);
          if (!el) return;
          ["input", "change", "blur"].forEach(function (ev) {
            el.addEventListener(
              ev,
              function () {
                var f =
                  document.getElementById("cashflow-form") ||
                  document.querySelector("form.calculator--form");
                if (f) renderAnnualDeductionSummary(f);
              },
              true
            );
          });
        });
      } catch (e) {
        console.error("form__cashflow init error:", e);
      }

      // Collapse the form to a compact summary after calculation
      function collapseToSummary(form) {
        try {
          if (!form) return;
          if (form.getAttribute("data-cashflow-collapsed") === "true") return;

          // Compute values for summary
          var grossAnnual = computeGrossIncome(form);
          var grossMonthly = grossAnnual / 12;
          var taxInput = form.querySelector("#average_tax_percent");
          var taxRate = taxInput ? parseFloat(taxInput.value) : 0;
          if (!isFinite(taxRate) || taxRate < 0) taxRate = 0;

          var afterTaxMonthly = grossMonthly * (1 - taxRate / 100);

          // Get deduction impact (same as renderNetCashflowOutput)
          var retirement =
            parseFloat(form.querySelector("#deduct_retirement")?.value) || 0;
          var health =
            parseFloat(form.querySelector("#deduct_health")?.value) || 0;
          var hsa = parseFloat(form.querySelector("#deduct_hsa")?.value) || 0;
          var monthlyOther =
            parseFloat(form.querySelector("#duduct_monthly_other")?.value) || 0;
          var totalMonthlyDeductions = retirement + health + hsa + monthlyOther;

          var charity =
            parseFloat(form.querySelector("#annual_charity")?.value) || 0;
          var mortgage =
            parseFloat(
              form.querySelector("#annual_mortgage_interest")?.value
            ) || 0;
          var property =
            parseFloat(form.querySelector("#annual_property_tax")?.value) || 0;
          var annualOther =
            parseFloat(form.querySelector("#annual_other")?.value) || 0;
          var totalAnnualDeductions =
            charity + mortgage + property + annualOther;
          var monthlyFromAnnual = totalAnnualDeductions / 12;

          var monthlyPaycheckTaxSavings =
            totalMonthlyDeductions * (taxRate / 100);
          var annualTaxSavings = totalAnnualDeductions * (taxRate / 100);
          var monthlyFromAnnualTaxSavings = annualTaxSavings / 12;
          var totalMonthlyTaxSavings =
            monthlyPaycheckTaxSavings + monthlyFromAnnualTaxSavings;

          var netMonthlyDeductionImpact =
            -(totalMonthlyDeductions + monthlyFromAnnual) +
            totalMonthlyTaxSavings;
          var afterDeductionsMonthly =
            afterTaxMonthly + netMonthlyDeductionImpact;

          var totalExpenses = computeMonthlyExpenses(form);
          var netCashflow = afterDeductionsMonthly - totalExpenses;

          // Create spinner
          var spinner = document.createElement("div");
          spinner.className = "cashflow-spinner mw7 center pa3";
          spinner.setAttribute("role", "status");
          spinner.style.textAlign = "center";
          spinner.textContent = "Calculating...";
          try {
            form.parentNode.insertBefore(spinner, form);
          } catch (e) {
            /* ignore */
          }

          // Store original display value for the form
          try {
            form.dataset.cashflowOrigDisplay = form.style.display || "";
          } catch (e) {}

          // Small delay to show spinner
          setTimeout(function () {
            try {
              form.style.display = "none";
            } catch (e) {}

            // Build summary
            var s = document.createElement("div");
            s.id = "cashflow-summary";
            s.className = "mw7 center pa3";
            s.style.opacity = "0";
            s.style.transition = "opacity 300ms ease";

            var html = "";
            html +=
              '<p class="mb1"><strong>Monthly Income:</strong> ' +
              formatCurrency(afterDeductionsMonthly) +
              "</p>";
            if (totalExpenses > 0) {
              html +=
                '<p class="mb1"><strong>Monthly Expenses:</strong> ' +
                formatCurrency(totalExpenses) +
                "</p>";
            }

            var colorClass = netCashflow >= 0 ? "green" : "red";
            var sign = netCashflow >= 0 ? "+" : "";
            html +=
              '<h3 class="mt4 mb1 ' +
              colorClass +
              '">Net Income: ' +
              sign +
              formatCurrency(netCashflow) +
              "</h3>";

            // Buttons row: copy left, show details right (secondary)
            html +=
              '<div class="mt3" style="display:flex; justify-content:space-between; align-items:center;">';
            html += '<div class="">';
            html +=
              '<button id="btn-copy-cashflow" class="btn btn--primary">Copy to clipboard</button>';
            html += "</div>";
            html += '<div class="">';
            html +=
              '<button id="btn-show-cashflow-details" class="btn btn--secondary">Show details</button>';
            html += "</div>";
            html += "</div>";

            // Display the token/key underneath
            var keyDisplay = "";
            try {
              var token = "";
              try {
                token = (location.search || "").replace(/^\?/, "");
              } catch (e) {
                token = "";
              }
              if (
                !token &&
                window.formHelpers &&
                typeof window.formHelpers.getTokenFromForm === "function"
              ) {
                try {
                  token = window.formHelpers.getTokenFromForm(form) || "";
                } catch (e) {
                  token = "";
                }
              }
              if (token) keyDisplay = token;
            } catch (e) {
              keyDisplay = "";
            }

            if (keyDisplay) {
              html +=
                '<p class="mt2 mb0"><small>Cashflow calculation key:</small></p>';
              html +=
                '<p class="mt0 mb0"><code class="summary-key" style="user-select: all;">' +
                escapeHtml(keyDisplay) +
                "</code></p>";

              // Show any saved notes below the key
              try {
                var notesText = "";
                var notesEl =
                  form.querySelector("#notes_cashflow") ||
                  document.getElementById("notes_cashflow");
                if (notesEl) notesText = (notesEl.value || "").trim();
                if (notesText) {
                  html +=
                    '<p class="mt1 mb0 summary-notes"><small>Notes: ' +
                    escapeHtml(notesText).replace(/\n/g, "<br>") +
                    "</small></p>";
                }
              } catch (e) {
                // ignore notes rendering errors
              }
            }

            s.innerHTML = html;

            // Insert summary where the form was
            try {
              form.parentNode.insertBefore(s, form.nextSibling);
            } catch (e) {}
            // Remove spinner
            try {
              spinner.parentNode && spinner.parentNode.removeChild(spinner);
            } catch (e) {}
            // Hide calculator home button on summary view
            try {
              var homeButton = document.querySelector('a[href="/calculator/"]');
              if (homeButton) {
                homeButton.style.display = "none";
                homeButton.style.setProperty("display", "none", "important");
                if (homeButton.parentElement) {
                  homeButton.parentElement.style.display = "none";
                  homeButton.parentElement.style.setProperty(
                    "display",
                    "none",
                    "important"
                  );
                }
              }
            } catch (e) {}

            setTimeout(function () {
              s.style.opacity = "1";
            }, 20);

            form.setAttribute("data-cashflow-collapsed", "true");

            // Hook show details button
            var showBtn = s.querySelector("#btn-show-cashflow-details");
            if (showBtn)
              showBtn.addEventListener(
                "click",
                function () {
                  expandFromSummary(form);
                },
                true
              );

            // Hook copy to clipboard button
            var copyBtn = s.querySelector("#btn-copy-cashflow");
            if (copyBtn) {
              copyBtn.addEventListener(
                "click",
                function () {
                  try {
                    var lines = [];
                    lines.push("Cashflow Calculator");
                    lines.push("");
                    lines.push(
                      "Monthly Income: " +
                        formatCurrency(afterDeductionsMonthly)
                    );
                    if (totalExpenses > 0) {
                      lines.push(
                        "Monthly Expenses: " + formatCurrency(totalExpenses)
                      );
                    }
                    lines.push("");
                    lines.push(
                      "Net Income: " + sign + formatCurrency(netCashflow)
                    );
                    lines.push("");

                    // Key
                    var tokenTxt = "";
                    var el = s.querySelector(".summary-key");
                    if (el)
                      tokenTxt = (el.textContent || el.innerText || "").trim();
                    if (tokenTxt) {
                      lines.push("Cashflow calculation key:");
                      lines.push(tokenTxt);
                    }

                    // Include notes if present
                    try {
                      var notesEl2 =
                        form.querySelector("#notes_cashflow") ||
                        document.getElementById("notes_cashflow");
                      var notesTxt = "";
                      if (notesEl2) notesTxt = (notesEl2.value || "").trim();
                      if (notesTxt) {
                        lines.push("");
                        lines.push("Notes:");
                        lines.push(notesTxt);
                      }
                    } catch (e) {}

                    var full = lines.join("\n");
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard
                        .writeText(full)
                        .then(function () {
                          copyBtn.textContent = "Copied";
                          setTimeout(function () {
                            copyBtn.textContent = "Copy to clipboard";
                          }, 2000);
                        })
                        .catch(function () {
                          fallbackCopyTextToClipboard(full, copyBtn);
                        });
                    } else {
                      fallbackCopyTextToClipboard(full, copyBtn);
                    }
                  } catch (e) {
                    try {
                      console.error("copy error", e);
                    } catch (err) {}
                  }
                },
                true
              );
            }
          }, 300);
        } catch (e) {
          console.error("collapseToSummary error:", e);
        }
      }

      function expandFromSummary(form) {
        try {
          if (!form) return;
          if (form.getAttribute("data-cashflow-collapsed") !== "true") return;
          var summary = document.getElementById("cashflow-summary");
          if (summary && summary.parentNode)
            summary.parentNode.removeChild(summary);
          // Restore form display
          try {
            var orig = form.dataset && form.dataset.cashflowOrigDisplay;
            form.style.display = typeof orig !== "undefined" ? orig : "";
            try {
              delete form.dataset.cashflowOrigDisplay;
            } catch (e) {}
          } catch (e) {}
          form.removeAttribute("data-cashflow-collapsed");
          // Show calculator home button when returning to full form
          try {
            var homeButton = document.querySelector('a[href="/calculator/"]');
            if (homeButton) {
              homeButton.style.display = "";
              homeButton.style.removeProperty("display");
              if (homeButton.parentElement) {
                homeButton.parentElement.style.display = "";
                homeButton.parentElement.style.removeProperty("display");
              }
            }
          } catch (e) {}
        } catch (e) {
          console.error("expandFromSummary error:", e);
        }
      }

      // Simple HTML escape helper
      function escapeHtml(str) {
        if (!str && str !== 0) return "";
        return String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
      }

      // Fallback copy for older browsers
      function fallbackCopyTextToClipboard(text, btn) {
        try {
          var textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "absolute";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          var selected =
            document.getSelection().rangeCount > 0
              ? document.getSelection().getRangeAt(0)
              : null;
          textarea.select();
          try {
            var ok = document.execCommand("copy");
            if (ok && btn) {
              var old = btn.textContent;
              btn.textContent = "Copied";
              setTimeout(function () {
                try {
                  btn.textContent = old;
                } catch (e) {}
              }, 2000);
            }
          } catch (err) {
            // give up quietly
          }
          document.body.removeChild(textarea);
          if (selected) {
            try {
              document.getSelection().removeAllRanges();
              document.getSelection().addRange(selected);
            } catch (e) {}
          }
        } catch (e) {}
      }

      // Add form submission handler to trigger the summary
      try {
        var form =
          document.getElementById("cashflow-form") ||
          document.querySelector("form.calculator--form");
        if (form) {
          form.addEventListener(
            "submit",
            async function (e) {
              try {
                e.preventDefault();

                // Track calculation event
                try {
                  if (window.Tracking && typeof window.Tracking.calculatorCalculate === 'function') {
                    window.Tracking.calculatorCalculate('cashflow');
                  }
                } catch (trackingErr) {
                  console.warn('Cashflow calculation tracking failed:', trackingErr);
                }

                // Prevent duplicate execution
                if (form.getAttribute("data-cashflow-processing") === "true")
                  return;
                form.setAttribute("data-cashflow-processing", "true");

                var salt = form.getAttribute("data-token-salt") || null;

                // Handle token/URL creation (similar to DIME calculator)
                try {
                  if (
                    window.formHelpers &&
                    typeof window.formHelpers.createEncryptedShareUrl ===
                      "function"
                  ) {
                    var encUrl =
                      await window.formHelpers.createEncryptedShareUrl(form);
                    if (encUrl) {
                      try {
                        if (history && history.replaceState)
                          history.replaceState(null, document.title, encUrl);
                        else location.href = encUrl;
                      } catch (e) {
                        try {
                          location.href = encUrl;
                        } catch (er) {}
                      }
                    } else {
                      try {
                        showConfirm({
                          title: "Encryption key missing",
                          body: "No stored passphrase was found to encrypt the share link. Unlock the protected content or add a key before sharing.",
                          okText: "OK",
                        });
                      } catch (e) {}
                      return;
                    }
                  } else if (
                    window.formHelpers &&
                    typeof window.formHelpers.createTokenFromForm === "function"
                  ) {
                    var token = await window.formHelpers.createTokenFromForm(
                      form,
                      { salt: salt }
                    );
                    if (
                      typeof window.formHelpers.writeTokenToQuery === "function"
                    ) {
                      window.formHelpers.writeTokenToQuery(token);
                    } else {
                      try {
                        location.search = token;
                      } catch (err) {}
                    }
                  }
                } catch (e) {
                  try {
                    if (
                      window.formHelpers &&
                      typeof window.formHelpers.createTokenFromForm ===
                        "function"
                    ) {
                      var token = await window.formHelpers.createTokenFromForm(
                        form,
                        { salt: salt }
                      );
                      if (
                        typeof window.formHelpers.writeTokenToQuery ===
                        "function"
                      ) {
                        window.formHelpers.writeTokenToQuery(token);
                      } else {
                        try {
                          location.search = token;
                        } catch (err) {}
                      }
                    }
                  } catch (err) {}
                }

                // Update all outputs before collapsing
                renderGrossIncome(form);
                renderDeductionBenefitSummary(form);
                renderAnnualDeductionSummary(form);
                renderDeductionsOutput(form);
                renderExpensesOutput(form);
                renderNetCashflowOutput(form);

                // Remove focus from submit button
                try {
                  var active = document.activeElement;
                  if (
                    active &&
                    (active.tagName === "BUTTON" || active.tagName === "INPUT")
                  ) {
                    try {
                      active.blur();
                    } catch (e) {}
                  }
                  var submitBtn = form.querySelector('button[type="submit"]');
                  if (submitBtn) submitBtn.blur();
                } catch (err) {}

                // Collapse to summary after calculation
                try {
                  collapseToSummary(form);
                } catch (e) {}

                // Clear processing flag
                form.removeAttribute("data-cashflow-processing");
              } catch (err) {
                form.removeAttribute("data-cashflow-processing");
                console.error("form__cashflow submit handler error:", err);
              }
            },
            true
          );

          // Also add a direct click handler to the calculate button as backup
          var calculateBtn =
            form.querySelector('button[type="submit"]') ||
            form.querySelector(".btn--calculate");

          if (!calculateBtn) {
            // Look for any button that might contain "Calculate" text
            var buttons = form.querySelectorAll("button");
            for (var i = 0; i < buttons.length; i++) {
              if (
                buttons[i].textContent &&
                buttons[i].textContent.toLowerCase().includes("calculate")
              ) {
                calculateBtn = buttons[i];
                break;
              }
            }
          }

          if (calculateBtn) {
            calculateBtn.addEventListener(
              "click",
              function (e) {
                e.preventDefault();
                // Trigger the form submit which will handle tracking
                form.dispatchEvent(
                  new Event("submit", { bubbles: true, cancelable: true })
                );
              },
              true
            );
          }
        }
      } catch (e) {
        console.error("form__cashflow submit handler init error:", e);
      }

      // Delegated submit listener as backup
      document.addEventListener(
        "submit",
        async function (e) {
          try {
            var form = e.target;
            if (
              !form ||
              (form.id !== "cashflow-form" &&
                !form.classList.contains("calculator--form"))
            )
              return;

            // Prevent duplicate execution
            if (form.getAttribute("data-cashflow-processing") === "true")
              return;
            form.setAttribute("data-cashflow-processing", "true");

            e.preventDefault();
            var salt = form.getAttribute("data-token-salt") || null; // Handle token/URL creation
            try {
              if (
                window.formHelpers &&
                typeof window.formHelpers.createEncryptedShareUrl === "function"
              ) {
                var encUrl = await window.formHelpers.createEncryptedShareUrl(
                  form
                );
                if (encUrl) {
                  try {
                    if (history && history.replaceState)
                      history.replaceState(null, document.title, encUrl);
                    else location.href = encUrl;
                  } catch (e) {
                    try {
                      location.href = encUrl;
                    } catch (er) {}
                  }
                } else {
                  try {
                    showConfirm({
                      title: "Encryption key missing",
                      body: "No stored passphrase was found to encrypt the share link. Unlock the protected content or add a key before sharing.",
                      okText: "OK",
                    });
                  } catch (e) {}
                  return;
                }
              } else if (
                window.formHelpers &&
                typeof window.formHelpers.createTokenFromForm === "function"
              ) {
                var token = await window.formHelpers.createTokenFromForm(form, {
                  salt: salt,
                });
                if (
                  typeof window.formHelpers.writeTokenToQuery === "function"
                ) {
                  window.formHelpers.writeTokenToQuery(token);
                } else {
                  try {
                    location.search = token;
                  } catch (err) {}
                }
              }
            } catch (e) {
              try {
                if (
                  window.formHelpers &&
                  typeof window.formHelpers.createTokenFromForm === "function"
                ) {
                  var token = await window.formHelpers.createTokenFromForm(
                    form,
                    { salt: salt }
                  );
                  if (
                    typeof window.formHelpers.writeTokenToQuery === "function"
                  ) {
                    window.formHelpers.writeTokenToQuery(token);
                  } else {
                    try {
                      location.search = token;
                    } catch (err) {}
                  }
                }
              } catch (err) {}
            }

            // Update all outputs before collapsing
            try {
              if (
                window.formCashflow &&
                typeof window.formCashflow.renderIncomeOutput === "function"
              ) {
                window.formCashflow.renderIncomeOutput();
              }
              // Call individual render functions if available
              var formToUse =
                document.getElementById("cashflow-form") ||
                document.querySelector("form.calculator--form");
              if (formToUse) {
                renderGrossIncome(formToUse);
                renderDeductionBenefitSummary(formToUse);
                renderAnnualDeductionSummary(formToUse);
                renderDeductionsOutput(formToUse);
                renderExpensesOutput(formToUse);
                renderNetCashflowOutput(formToUse);
              }
            } catch (err) {
              console.error("Error updating outputs:", err);
            }

            // Remove focus from submit button
            try {
              var active = document.activeElement;
              if (
                active &&
                (active.tagName === "BUTTON" || active.tagName === "INPUT")
              ) {
                try {
                  active.blur();
                } catch (e) {}
              }
              var submitBtn = form.querySelector('button[type="submit"]');
              if (submitBtn) submitBtn.blur();
            } catch (err) {}

            // Collapse to summary after calculation
            try {
              if (
                window.formCashflow &&
                typeof window.formCashflow.collapseToSummary === "function"
              ) {
                window.formCashflow.collapseToSummary(form);
              } else {
                collapseToSummary(form);
              }
            } catch (e) {
              console.error("Error collapsing to summary:", e);
            }

            // Clear processing flag
            form.removeAttribute("data-cashflow-processing");
          } catch (err) {
            form.removeAttribute("data-cashflow-processing");
            console.error(
              "form__cashflow delegated submit handler error:",
              err
            );
          }
        },
        true
      );

      // Initialize shared collapse/expand handlers for section headers
      if (
        window.collapseSections &&
        typeof window.collapseSections.init === "function"
      ) {
        try {
          window.collapseSections.init(
            document.getElementById("cashflow-form") || document
          );
        } catch (e) {}
      }
    },
    false
  );
})();
