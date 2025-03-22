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

// Privacy mode configuration - toggle between modes
const PRIVACY_MODE = {
  EXPLICIT_CONSENT: 'explicit', // Shows both accept/reject buttons
  AUTO_ACCEPT: 'auto', // Only shows reject button, auto-accepts
};

// Set the current mode - change this to toggle behavior
const currentPrivacyMode = PRIVACY_MODE.AUTO_ACCEPT;

// This script manages the display and functionality of a privacy consent banner.

document.addEventListener ('DOMContentLoaded', function () {
  const banner = document.getElementById ('privacy-banner');
  const acceptBtn = document.getElementById ('accept-privacy');
  const rejectBtn = document.getElementById ('reject-privacy');
  const acknowledgeBtn = document.getElementById ('acknowledge-privacy');

  // Add a class to the banner indicating the current privacy mode
  banner.classList.add (
    `privacy-mode-${currentPrivacyMode === PRIVACY_MODE.AUTO_ACCEPT ? 'auto' : 'explicit'}`
  );

  // Show/hide buttons based on privacy mode
  if (currentPrivacyMode === PRIVACY_MODE.AUTO_ACCEPT) {
    acceptBtn.style.display = 'none';
    acknowledgeBtn.style.display = 'inline-block';
  } else {
    acceptBtn.style.display = 'inline-block';
    acknowledgeBtn.style.display = 'none';
  }

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
    console.log ('Privacy consent updated in dataLayer:', hasConsent);
  }

  // Handle acknowledge button click - just hide the banner (consent already given in auto mode)
  acknowledgeBtn.addEventListener ('click', function () {
    banner.style.display = 'none';
  });

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
   * Accepts privacy consent and updates UI/storage
   * @param {boolean} hideBanner - Whether to hide the banner after accepting
   */
  function acceptPrivacy (hideBanner = true) {
    // Store acceptance (permanent)
    localStorage.setItem ('privacy-status', 'accepted');
    localStorage.removeItem ('privacy-expiry'); // No expiry for acceptance

    // Only hide the banner if explicitly requested
    if (hideBanner) {
      banner.style.display = 'none';
    }

    updateDataLayerConsent (true);
  }

  /**
   * Shows the privacy banner if needed based on current mode
   * @returns {void}
   */
  function showBannerIfNeeded () {
    if (!hasValidDecision) {
      // Configure banner based on privacy mode
      if (currentPrivacyMode === PRIVACY_MODE.AUTO_ACCEPT) {
        // Auto-accept in the background without hiding the banner
        acceptPrivacy (false);

        // No need to change the accept button visibility in this implementation
        // as we want to keep the banner with the accept button visible
      }

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

  // Handle accept button click - explicitly hide the banner when clicked
  acceptBtn.addEventListener ('click', function () {
    acceptPrivacy (true);
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
