/**
 * GA4/GTM Tracking Module
 * Centralized tracking functions for all user interactions
 *
 * This module provides a clean interface for tracking user events
 * while maintaining user context across the application.
 */

(function () {
  'use strict';
  // Initialize tracking namespace
  window.Tracking = window.Tracking || {};

  /**
   * Get the current user name from storage
   * @returns {string} User name or 'anonymous'
   */
  function getCurrentUser () {
    try {
      return (
        localStorage.getItem ('ga4_user_name') ||
        sessionStorage.getItem ('ga4_user_name') ||
        'anonymous'
      );
    } catch (e) {
      return 'anonymous';
    }
  }

  /**
   * Send event to GA4/GTM dataLayer with error handling
   * @param {Object} eventData - Event data object
   */
  function sendEvent (eventData) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push (eventData);
    } catch (e) {
      console.warn ('GA4 tracking error:', e);
    }
  }

  /**
   * Track password-protected content access
   * @param {string} protectionId - Content protection ID
   * @param {string} userName - User's name
   */
  window.Tracking.passwordAccess = function (protectionId, userName) {
    sendEvent ({
      event: 'password_protected_access',
      user_name: userName,
      protection_id: protectionId,
      event_category: 'engagement',
      event_label: 'protected_content_access',
    });
  };

  /**
   * Track calculator Calculate button clicks
   * @param {string} calculatorType - 'cashflow' or 'dime'
   */
  window.Tracking.calculatorCalculate = function (calculatorType) {
    sendEvent ({
      event: 'calculator_calculate',
      calculator_type: calculatorType,
      user_name: getCurrentUser (),
      event_category: 'engagement',
      event_label: 'calculate_button_click',
    });
  };

  /**
   * Track successful Add Key actions
   * @param {string} method - 'prompt' or 'dialog'
   */
  window.Tracking.addKeySuccess = function (method) {
    sendEvent ({
      event: 'add_key_success',
      user_name: getCurrentUser (),
      key_method: method,
      event_category: 'engagement',
      event_label: 'add_encrypted_key',
    });
  };

  /**
   * Track form interactions
   * @param {string} formType - Type of form
   * @param {string} action - Action performed
   * @param {Object} additionalData - Additional event data
   */
  window.Tracking.formInteraction = function (
    formType,
    action,
    additionalData
  ) {
    var eventData = {
      event: 'form_interaction',
      form_type: formType,
      form_action: action,
      user_name: getCurrentUser (),
      event_category: 'engagement',
      event_label: formType + '_' + action,
    };

    // Merge additional data
    if (additionalData && typeof additionalData === 'object') {
      Object.keys (additionalData).forEach (function (key) {
        eventData[key] = additionalData[key];
      });
    }

    sendEvent (eventData);
  };

  /**
   * Track page/content views with user context
   * @param {string} contentType - Type of content viewed
   * @param {string} contentId - Content identifier
   * @param {Object} additionalData - Additional event data
   */
  window.Tracking.contentView = function (
    contentType,
    contentId,
    additionalData
  ) {
    var eventData = {
      event: 'content_view',
      content_type: contentType,
      content_id: contentId,
      user_name: getCurrentUser (),
      event_category: 'engagement',
      event_label: contentType + '_view',
    };

    // Merge additional data
    if (additionalData && typeof additionalData === 'object') {
      Object.keys (additionalData).forEach (function (key) {
        eventData[key] = additionalData[key];
      });
    }

    sendEvent (eventData);
  };

  /**
   * Track user actions with context
   * @param {string} action - Action name
   * @param {Object} eventData - Custom event data
   */
  window.Tracking.userAction = function (action, eventData) {
    var defaultData = {
      event: 'user_action',
      action: action,
      user_name: getCurrentUser (),
      event_category: 'engagement',
      event_label: action,
    };

    // Merge custom event data
    if (eventData && typeof eventData === 'object') {
      Object.keys (eventData).forEach (function (key) {
        defaultData[key] = eventData[key];
      });
    }

    sendEvent (defaultData);
  };

  /**
   * Store user name globally for tracking
   * @param {string} userName - User's name
   */
  window.Tracking.setUserName = function (userName) {
    if (!userName || typeof userName !== 'string') return;

    var cleanName = userName.trim ();
    if (!cleanName) return;

    try {
      localStorage.setItem ('ga4_user_name', cleanName);
      sessionStorage.setItem ('ga4_user_name', cleanName);
    } catch (e) {
      console.warn ('Failed to store user name for tracking:', e);
    }
  };

  /**
   * Get current user name
   * @returns {string} Current user name or 'anonymous'
   */
  window.Tracking.getUserName = getCurrentUser;
}) ();
