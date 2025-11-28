/**
 * GA4/GTM Tracking Module - COMPLIANCE-SAFE MODE
 *
 * PRIVACY & COMPLIANCE FEATURES FOR CALCULATORS:
 * - Calculator events: No user identification (no user_name, developer_name, session_id)
 * - Calculator events: Only sends event name + calculator_type
 * - Blocks all numeric values and form inputs from calculator events
 * - Safe mode for private browsing and unknown referrers
 * - Analytics disabled by default (owner-mode only)
 * - Global kill switch available
 *
 * NON-CALCULATOR PAGE TRACKING:
 * - Standard page interactions (links, scrolling, buttons) are tracked
 * - Still blocks PII and numeric data to prevent accidental data leakage
 */

(function () {
  'use strict';

  // Prevent double initialization
  if (window.Tracking && window.Tracking._initialized) {
    return;
  }

  // ========================================================================
  // GLOBAL KILL SWITCH - Set to true to disable ALL tracking immediately
  // ========================================================================
  if (window.DISABLE_ANALYTICS === true || window.CALCULATOR_DISABLE_ANALYTICS === true) {
    window.Tracking = {
      _initialized: true,
      _disabled: true,
      calculatorCalculate: function() {},
      passwordAccess: function() {},
      addKeySuccess: function() {},
      formInteraction: function() {},
      contentView: function() {},
      userAction: function() {},
      getStatus: function() { return { disabled: true, reason: 'Global kill switch active' }; }
    };
    console.log('[Tracking] DISABLED via global kill switch');
    return;
  }

  // Initialize tracking namespace
  window.Tracking = window.Tracking || {};
  window.dataLayer = window.dataLayer || [];

  // ========================================================================
  // COMPLIANCE-SAFE MODE DETECTION
  // ========================================================================
  function isComplianceSafeMode() {
    // URL parameter: ?safe=true
    try {
      var urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('safe') === 'true') {
        return true;
      }
    } catch (e) {}

    // Private/incognito mode detection
    try {
      if (navigator.storage && navigator.storage.estimate) {
        // Most browsers restrict storage in private mode
        if (!window.localStorage || !window.sessionStorage) {
          return true;
        }
      }
    } catch (e) {
      return true; // If we can't access storage, assume private mode
    }

    // Unknown referrer (direct navigation or external)
    try {
      var referrer = document.referrer || '';
      var hostname = window.location.hostname;
      if (referrer && !referrer.includes(hostname)) {
        // External referrer - enable safe mode
        return true;
      }
    } catch (e) {}

    return false;
  }

  // ========================================================================
  // OWNER MODE CHECK - Analytics only enabled for owner
  // ========================================================================
  function isOwnerMode() {
    try {
      return localStorage.getItem('OWNER_MODE') === 'true';
    } catch (e) {
      return false;
    }
  }

  // ========================================================================
  // PII PROTECTION - Reject dangerous data patterns
  // ========================================================================
  function containsPII(value) {
    if (value === null || value === undefined) return false;

    var str = String(value);

    // Reject strings > 20 characters (could be names, emails, etc.)
    if (str.length > 20) return true;

    // Reject anything with spaces (could be full names)
    if (str.indexOf(' ') !== -1) return true;

    // Reject numeric values (form inputs, financial data)
    if (!isNaN(parseFloat(str)) && isFinite(str)) return true;

    // Reject name-like patterns (capitalized words)
    if (/^[A-Z][a-z]+$/.test(str)) return true;

    // Reject email patterns
    if (str.indexOf('@') !== -1) return true;

    return false;
  }

  // ========================================================================
  // PAYLOAD SANITIZER - Block all dangerous data
  // ========================================================================
  function sanitizePayload(eventData) {
    var safe = {};

    // For calculator events: ONLY allow event and calculator_type
    if (eventData.event === 'calculator_calculate') {
      safe.event = eventData.event;

      if (eventData.calculator_type) {
        // Validate calculator_type is a safe enum value
        if (eventData.calculator_type === 'dime' || eventData.calculator_type === 'cashflow') {
          safe.calculator_type = eventData.calculator_type;
        }
      }

      // Scan for any PII or numeric data in calculator events
      for (var key in eventData) {
        if (containsPII(eventData[key])) {
          console.warn('[Tracking] BLOCKED: PII detected in calculator event field "' + key + '"');
          return null; // Abort entire event if PII detected
        }
      }

      return safe;
    }

    // For non-calculator events: Allow standard tracking fields but block PII
    safe.event = eventData.event;

    // Allowed fields for general page tracking
    var allowedFields = [
      'action',
      'link_type',
      'link_url',
      'page_section',
      'button_type',
      'form_type',
      'form_action',
      'form_id',
      'nav_url',
      'nav_section',
      'cta_url',
      'is_primary',
      'scroll_depth',
      'page_type',
      'content_type',
      'content_id',
      'page_title',
      'page_path',
      'event_category',
      'event_label'
    ];

    for (var i = 0; i < allowedFields.length; i++) {
      var field = allowedFields[i];
      if (eventData[field] !== undefined && eventData[field] !== null) {
        // Still check for PII in these fields
        if (containsPII(eventData[field])) {
          console.warn('[Tracking] BLOCKED: PII detected in field "' + field + '"');
          continue; // Skip this field but don't abort entire event
        }
        safe[field] = eventData[field];
      }
    }

    return safe;
  }

  // ========================================================================
  // CORE TRACKING FUNCTION - Minimal, safe, compliant
  // ========================================================================
  function sendEvent(eventData) {
    // Check global kill switch
    if (window.DISABLE_ANALYTICS === true || window.CALCULATOR_DISABLE_ANALYTICS === true) {
      console.log('[Tracking] Event blocked: Global kill switch active');
      return;
    }

    // Check safe mode
    if (isComplianceSafeMode()) {
      console.log('[Tracking] Event blocked: Compliance-safe mode active');
      return;
    }

    // Check owner mode
    if (!isOwnerMode()) {
      console.log('[Tracking] Event blocked: Not in owner mode');
      return;
    }

    try {
      // Sanitize payload - remove ALL identifiers and dangerous data
      var safePayload = sanitizePayload(eventData);

      if (!safePayload) {
        console.warn('[Tracking] Event aborted: Payload failed safety checks');
        return;
      }

      // Final validation: ensure no user identifiers leaked through
      if (safePayload.user_name || safePayload.developer_name || safePayload.session_id ||
          safePayload.user_id || safePayload.client_id || safePayload.userName) {
        console.error('[Tracking] CRITICAL: User identifier detected, aborting event');
        return;
      }

      // Send only the minimal, safe payload
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(safePayload);

      console.log('[Tracking] Event sent (compliance-safe):', safePayload);

    } catch (e) {
      console.warn('[Tracking] Error:', e);
    }
  }

  // ========================================================================
  // PUBLIC API - Compliance-safe tracking functions
  // ========================================================================

  /**
   * Track calculator Calculate button clicks
   * @param {string} calculatorType - 'cashflow' or 'dime'
   */
  window.Tracking.calculatorCalculate = function (calculatorType) {
    // Validate calculator type to prevent injection
    if (calculatorType !== 'dime' && calculatorType !== 'cashflow') {
      console.warn('[Tracking] Invalid calculator type:', calculatorType);
      return;
    }

    sendEvent({
      event: 'calculator_calculate',
      calculator_type: calculatorType
    });
  };

  /**
   * Legacy function - now no-op for compliance
   */
  window.Tracking.passwordAccess = function () {
    // Disabled for compliance - no user tracking
  };

  /**
   * Legacy function - now no-op for compliance
   */
  window.Tracking.addKeySuccess = function () {
    // Disabled for compliance - no user tracking
  };

  /**
   * Legacy function - now active for page tracking
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
      event_category: 'engagement',
      event_label: formType + '_' + action
    };

    // Merge additional data
    if (additionalData && typeof additionalData === 'object') {
      for (var key in additionalData) {
        if (additionalData.hasOwnProperty(key)) {
          eventData[key] = additionalData[key];
        }
      }
    }

    sendEvent(eventData);
  };

  /**
   * Legacy function - now active for page tracking
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
      event_category: 'engagement',
      event_label: contentType + '_view'
    };

    // Merge additional data
    if (additionalData && typeof additionalData === 'object') {
      for (var key in additionalData) {
        if (additionalData.hasOwnProperty(key)) {
          eventData[key] = additionalData[key];
        }
      }
    }

    sendEvent(eventData);
  };

  /**
   * Legacy function - now active for page tracking
   */
  window.Tracking.userAction = function (action, eventData) {
    var defaultData = {
      event: 'user_action',
      action: action,
      event_category: 'engagement',
      event_label: action
    };

    // Merge custom event data
    if (eventData && typeof eventData === 'object') {
      for (var key in eventData) {
        if (eventData.hasOwnProperty(key)) {
          defaultData[key] = eventData[key];
        }
      }
    }

    sendEvent(defaultData);
  };

  /**
   * Legacy function - now no-op for compliance
   */
  window.Tracking.setUserName = function () {
    // Disabled for compliance - no user identification
  };

  /**
   * Legacy function - now no-op for compliance
   */
  window.Tracking.getUserName = function () {
    // Disabled for compliance - no user identification
    return null;
  };

  /**
   * Get tracking module status and diagnostics
   */
  window.Tracking.getStatus = function() {
    return {
      trackingModuleLoaded: true,
      complianceSafeMode: isComplianceSafeMode(),
      ownerMode: isOwnerMode(),
      globalKillSwitch: window.DISABLE_ANALYTICS === true || window.CALCULATOR_DISABLE_ANALYTICS === true,
      trackingEnabled: isOwnerMode() && !isComplianceSafeMode() &&
                       window.DISABLE_ANALYTICS !== true &&
                       window.CALCULATOR_DISABLE_ANALYTICS !== true,
      dataLayerLength: window.dataLayer ? window.dataLayer.length : 0
    };
  };

  /**
   * Enable owner mode (analytics enabled)
   */
  window.Tracking.enableOwnerMode = function() {
    try {
      localStorage.setItem('OWNER_MODE', 'true');
      console.log('[Tracking] Owner mode ENABLED - Analytics active');
    } catch (e) {
      console.warn('[Tracking] Could not enable owner mode:', e);
    }
  };

  /**
   * Disable owner mode (analytics disabled)
   */
  window.Tracking.disableOwnerMode = function() {
    try {
      localStorage.removeItem('OWNER_MODE');
      console.log('[Tracking] Owner mode DISABLED - Analytics inactive');
    } catch (e) {
      console.warn('[Tracking] Could not disable owner mode:', e);
    }
  };

  // Initialize
  console.log('[Tracking] Compliance-safe module initialized');
  console.log('[Tracking] Status:', window.Tracking.getStatus());

  if (!isOwnerMode()) {
    console.log('[Tracking] Analytics DISABLED (not in owner mode)');
    console.log('[Tracking] To enable: window.Tracking.enableOwnerMode()');
  }

  if (isComplianceSafeMode()) {
    console.log('[Tracking] Safe mode ACTIVE - Analytics disabled');
  }

  window.Tracking._initialized = true;

})();
