/**
 * GA4/GTM Tracking Module
 * Centralized tracking functions for all user interactions
 *
 * This module provides a clean interface for tracking user events
 * while maintaining user context across the application.
 */

(function () {
  'use strict';

  // Prevent double initialization
  if (window.Tracking && window.Tracking._initialized) {
    console.log('[Tracking] Already initialized, skipping duplicate load');
    return;
  }

  // Initialize tracking namespace
  window.Tracking = window.Tracking || {};

  // Initialize dataLayer immediately to avoid timing issues
  window.dataLayer = window.dataLayer || [];

  // Add debug flag that can be set in console: window.Tracking.debug = true
  window.Tracking.debug = false;

  // Environment detection and configuration
  window.Tracking.config = {
    // Auto-detect environment
    environment: (function() {
      var hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('.local') || hostname.includes(':')) {
        return 'development';
      } else if (hostname.includes('staging') || hostname.includes('test') || hostname.includes('dev.')) {
        return 'staging';
      } else {
        return 'production';
      }
    })(),

    // Control tracking behavior by environment
    sendToGA4: true, // Set to false to completely disable GA4 in local
    logEvents: true, // Always log events to console for debugging

    // Custom dimensions for environment separation
    environmentDimension: 'environment', // GA4 custom dimension name

    // User identification
    developerName: localStorage.getItem('developer_name') || 'unknown_dev'
  };

  /**
   * Log debug information if debug mode is enabled
   * @param {string} message - Debug message
   * @param {Object} data - Optional data to log
   */
  function debugLog(message, data) {
    if (window.Tracking.debug || window.Tracking.config.logEvents) {
      console.log('[Tracking]', message, data || '');
    }
  }

  /**
   * Get the current user name from storage
   * @returns {string} User name or 'anonymous'
   */
  function getCurrentUser () {
    try {
      var userName = localStorage.getItem ('ga4_user_name') ||
                    sessionStorage.getItem ('ga4_user_name') ||
                    'anonymous';
      debugLog('getCurrentUser:', userName);
      return userName;
    } catch (e) {
      debugLog('getCurrentUser error:', e);
      return 'anonymous';
    }
  }

  /**
   * Send event to GA4/GTM dataLayer with error handling
   * @param {Object} eventData - Event data object
   */
  function sendEvent (eventData) {
    try {
      // Ensure dataLayer exists
      window.dataLayer = window.dataLayer || [];

      // Add environment and developer information to all events
      eventData.environment = window.Tracking.config.environment;
      eventData.timestamp = new Date().toISOString();

      // Add developer name in non-production environments
      if (window.Tracking.config.environment !== 'production') {
        eventData.developer_name = window.Tracking.config.developerName;
        eventData.session_id = sessionStorage.getItem('dev_session_id') || 'dev_session_' + Date.now();
        // Store session ID for this development session
        if (!sessionStorage.getItem('dev_session_id')) {
          sessionStorage.setItem('dev_session_id', eventData.session_id);
        }
      }

      // Always log events for debugging (can be filtered in GA4)
      debugLog('Event prepared:', eventData);

      // Send to GA4 based on configuration
      if (window.Tracking.config.sendToGA4) {
        window.dataLayer.push(eventData);
        debugLog('Event sent to GA4. dataLayer length:', window.dataLayer.length);
      } else {
        debugLog('GA4 sending disabled - event logged only:', eventData);
      }

    } catch (e) {
      console.warn ('GA4 tracking error:', e);
      debugLog('sendEvent error:', e);
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

  /**
   * Get tracking module status and diagnostics
   * @returns {Object} Status information
   */
  window.Tracking.getStatus = function() {
    var status = {
      trackingModuleLoaded: typeof window.Tracking !== 'undefined',
      dataLayerExists: typeof window.dataLayer !== 'undefined',
      dataLayerLength: window.dataLayer ? window.dataLayer.length : 0,
      currentUser: getCurrentUser(),
      debugMode: window.Tracking.debug,
      gtmLoaded: typeof window.google_tag_manager !== 'undefined',
      environment: window.Tracking.config.environment,
      sendToGA4: window.Tracking.config.sendToGA4,
      developerName: window.Tracking.config.developerName
    };

    console.log('Tracking Status:', status);
    return status;
  };

  /**
   * Disable GA4 tracking (events will still be logged to console)
   */
  window.Tracking.disableGA4 = function() {
    window.Tracking.config.sendToGA4 = false;
    debugLog('GA4 tracking disabled - events will be logged only');
  };

  /**
   * Enable GA4 tracking
   */
  window.Tracking.enableGA4 = function() {
    window.Tracking.config.sendToGA4 = true;
    debugLog('GA4 tracking enabled');
  };

  /**
   * Set developer name for local development tracking
   * @param {string} name - Developer name
   */
  window.Tracking.setDeveloperName = function(name) {
    if (name && typeof name === 'string') {
      window.Tracking.config.developerName = name.trim();
      localStorage.setItem('developer_name', name.trim());
      debugLog('Developer name set to:', name.trim());
    }
  };

  /**
   * Configure tracking for local development
   * @param {Object} options - Configuration options
   */
  window.Tracking.configureLocal = function(options) {
    options = options || {};

    // Set developer name if provided
    if (options.developerName) {
      window.Tracking.setDeveloperName(options.developerName);
    }

    // Configure GA4 sending
    if (typeof options.sendToGA4 === 'boolean') {
      window.Tracking.config.sendToGA4 = options.sendToGA4;
    }

    // Configure debug logging
    if (typeof options.debug === 'boolean') {
      window.Tracking.debug = options.debug;
    }

    debugLog('Local configuration updated:', window.Tracking.config);
  };

  // Initialize and log status
  debugLog('Tracking module initialized');

  // Auto-configure for local development
  if (window.Tracking.config.environment === 'development') {
    // In local development, enable debug logging by default
    window.Tracking.debug = true;
    window.Tracking.config.logEvents = true;

    // Optionally disable GA4 sending in local (uncomment to disable)
    // window.Tracking.config.sendToGA4 = false;

    debugLog('Local development detected - debug mode enabled');
    debugLog('To disable GA4 in local, run: window.Tracking.disableGA4()');
    debugLog('To set your developer name, run: window.Tracking.setDeveloperName("YourName")');
  }

  if (window.Tracking.debug) {
    window.Tracking.getStatus();
  }

  // Mark as initialized
  window.Tracking._initialized = true;

}) ();
