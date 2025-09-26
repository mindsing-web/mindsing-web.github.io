/**
 * General Page Tracking
 * Basic page view and interaction tracking for non-calculator pages
 */

(function() {
  'use strict';

  // Wait for tracking module and DOM to be ready
  function initPageTracking() {
    if (typeof window.Tracking === 'undefined') {
      // Retry in 100ms if tracking module isn't loaded yet
      setTimeout(initPageTracking, 100);
      return;
    }

    // Track page view
    window.Tracking.contentView('page', getPageType(), {
      page_title: document.title,
      page_path: window.location.pathname,
      page_url: window.location.href
    });

    // Track all link and button clicks
    document.addEventListener('click', function(e) {
      var element = e.target.closest('a, button, [role="button"]');
      if (!element) return;

      var isLink = element.tagName === 'A';
      var isButton = element.tagName === 'BUTTON' || element.getAttribute('role') === 'button';
      
      if (isLink && element.href) {
        var isExternal = element.hostname !== window.location.hostname;
        var isEmail = element.href.startsWith('mailto:');
        var isTel = element.href.startsWith('tel:');
        var isInternal = !isExternal && !isEmail && !isTel;

        // Track all link types
        var linkType = isEmail ? 'email' : isTel ? 'phone' : isExternal ? 'external' : 'internal';
        window.Tracking.userAction('link_click', {
          link_type: linkType,
          link_url: element.href,
          link_text: element.textContent.trim(),
          page_section: getPageSection(element),
          link_id: element.id || null,
          link_classes: element.className || null
        });
      }
      
      if (isButton) {
        // Track button clicks
        window.Tracking.userAction('button_click', {
          button_type: element.type || 'button',
          button_text: element.textContent.trim(),
          page_section: getPageSection(element),
          button_id: element.id || null,
          button_classes: element.className || null,
          form_id: element.form ? element.form.id : null
        });
      }
    });

    // Track form submissions (non-calculator forms)
    document.addEventListener('submit', function(e) {
      var form = e.target;
      if (form.tagName === 'FORM' && !form.classList.contains('calculator--form')) {
        window.Tracking.formInteraction('contact', 'submit', {
          form_id: form.id || 'unknown',
          form_action: form.action || 'unknown',
          form_method: form.method || 'get'
        });
      }
    });

    // Track navigation menu interactions
    document.addEventListener('click', function(e) {
      var navElement = e.target.closest('nav a, .menu a, .navigation a');
      if (navElement) {
        window.Tracking.userAction('navigation_click', {
          nav_text: navElement.textContent.trim(),
          nav_url: navElement.href,
          nav_section: getPageSection(navElement)
        });
      }
    });

    // Track CTA button interactions specifically
    document.addEventListener('click', function(e) {
      var cta = e.target.closest('.btn, .cta, [class*="call-to-action"], [class*="btn-"]');
      if (cta) {
        window.Tracking.userAction('cta_click', {
          cta_text: cta.textContent.trim(),
          cta_type: cta.className,
          cta_url: cta.href || null,
          page_section: getPageSection(cta),
          is_primary: cta.classList.contains('btn--primary') || cta.classList.contains('primary')
        });
      }
    });

    // Track scroll depth (25%, 50%, 75%, 100%)
    var scrollDepths = [25, 50, 75, 100];
    var trackedDepths = [];
    
    function trackScrollDepth() {
      var scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      
      scrollDepths.forEach(function(depth) {
        if (scrollPercent >= depth && trackedDepths.indexOf(depth) === -1) {
          trackedDepths.push(depth);
          window.Tracking.userAction('scroll_depth', {
            scroll_depth: depth,
            page_type: getPageType()
          });
        }
      });
    }

    // Throttle scroll events
    var scrollTimeout;
    window.addEventListener('scroll', function() {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScrollDepth, 250);
    });

    console.log('[PageTracking] Enhanced tracking initialized for page type:', getPageType());
    console.log('[PageTracking] Now tracking: links, buttons, CTAs, navigation, forms, and scroll depth');
  }

  /**
   * Get the type of page based on URL
   */
  function getPageType() {
    var path = window.location.pathname;
    
    if (path === '/' || path === '') return 'homepage';
    if (path.includes('/about')) return 'about';
    if (path.includes('/services')) return 'services';
    if (path.includes('/booking')) return 'booking';
    if (path.includes('/privacy')) return 'privacy';
    if (path.includes('/calculator')) return 'calculator';
    
    return 'other';
  }

  /**
   * Get the section of the page where an element is located
   */
  function getPageSection(element) {
    var section = element.closest('section, header, footer, nav, main');
    if (section) {
      return section.className || section.tagName.toLowerCase();
    }
    return 'unknown';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTracking);
  } else {
    initPageTracking();
  }

})();