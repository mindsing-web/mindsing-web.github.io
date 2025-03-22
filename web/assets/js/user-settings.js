/**
 * @fileoverview Privacy consent management script for handling user cookie preferences.
 * This script manages a privacy banner that allows users to accept or reject tracking cookies.
 * It stores user preferences in localStorage and communicates consent status to Google Tag Manager
 * via the dataLayer.
 *
 * @summary Manages privacy consent with accept/reject options and time-based expiration.
 * @version 1.0.0
 * @author MindSing
 * @license MIT
 *
 * @requires localStorage
 * @requires dataLayer
 */

// This script manages the display and functionality of a privacy consent banner.
document.addEventListener ('DOMContentLoaded', function () {
  const banner = document.getElementById ('privacy-banner');
  const acceptBtn = document.getElementById ('accept-privacy');
  const rejectBtn = document.getElementById ('reject-privacy');

  // Initialize dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];

  /**
   * Updates the dataLayer with the user's consent choice
   * @param {boolean} hasConsent - Whether the user has given consent
   * @returns {void}
   */
  function updateDataLayerConsent (hasConsent) {
    window.dataLayer.push ({
      event: 'privacyUpdate',
      privacyConsent: hasConsent,
    });
    // console.log ('Privacy consent updated in dataLayer:', hasConsent);
  }

  // Get the stored consent data
  const consentStatus = localStorage.getItem ('privacy-status');
  const consentExpiry = localStorage.getItem ('privacy-expiry');
  const now = new Date ();

  // Check if rejection has expired (only applies to "rejected" status)
  const isExpired =
    consentStatus === 'rejected' &&
    consentExpiry &&
    now > new Date (consentExpiry);

  // Clear expired rejection
  if (isExpired) {
    localStorage.removeItem ('privacy-status');
    localStorage.removeItem ('privacy-expiry');
  }

  // Determine current consent status
  const hasConsent = consentStatus === 'accepted';
  const hasValidDecision =
    consentStatus === 'accepted' ||
    (consentStatus === 'rejected' && !isExpired);

  // Push current consent state to dataLayer
  updateDataLayerConsent (hasConsent);

  /**
   * Shows the privacy banner if needed
   * @returns {void}
   */
  function showBannerIfNeeded () {
    if (!hasValidDecision) {
      banner.style.display = 'block';
    }
  }

  // Wait for afterLoad event before showing banner
  // Listen for both dataLayer event and DOM event for robustness

  // Option 1: Listen for custom DOM event (works without GTM)
  document.addEventListener ('afterPageLoad', function () {
    showBannerIfNeeded ();
  });

  // Option 2: Check if event already happened (if this script loads after event)
  let dataLayerArray = window.dataLayer || [];
  let alreadyLoaded = dataLayerArray.some (function (item) {
    return item.event === 'afterLoad';
  });

  if (alreadyLoaded) {
    showBannerIfNeeded ();
  }

  // Handle accept button click
  acceptBtn.addEventListener ('click', function () {
    // Store acceptance (permanent)
    localStorage.setItem ('privacy-status', 'accepted');
    localStorage.removeItem ('privacy-expiry'); // No expiry for acceptance

    banner.style.display = 'none';
    updateDataLayerConsent (true);
  });

  // Handle reject button click
  rejectBtn.addEventListener ('click', function () {
    // Store rejection with 4-week expiration
    const fourWeeksLater = new Date ();
    fourWeeksLater.setDate (fourWeeksLater.getDate () + 28); // 4 weeks = 28 days

    localStorage.setItem ('privacy-status', 'rejected');
    localStorage.setItem ('privacy-expiry', fourWeeksLater.toISOString ());

    banner.style.display = 'none';
    updateDataLayerConsent (false);
  });
});
