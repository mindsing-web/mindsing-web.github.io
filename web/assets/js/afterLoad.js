/**
 * @fileoverview Manages custom page events for timing and performance
 * This script creates an afterLoad event in the dataLayer after a specified delay
 *
 * @summary Trigger delayed events for other scripts to respond to
 * @version 1.0.0
 * @author MindSing
 * @license MIT
 *
 * @requires dataLayer
 */

(function() {
  try {
    // Configuration constants
    const AFTER_LOAD_DELAY_MS = 2500;

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Trigger afterLoad event after delay
    window.setTimeout(function() {
      window.dataLayer.push({'event': 'afterLoad'});

      // Also dispatch a DOM event for non-GTM scripts
      document.dispatchEvent(new CustomEvent('afterPageLoad'));
    }, AFTER_LOAD_DELAY_MS);
  } catch (err) {
    // Log any errors that occur during the execution of the script
    console.error('Error in page events script:', err);
  }
})();
