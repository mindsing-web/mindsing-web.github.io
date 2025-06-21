/**
 * @fileoverview Hamburger menu functionality for responsive navigation
 * This script handles the mobile hamburger menu toggle at 1140px breakpoint
 *
 * @summary Mobile navigation hamburger menu controller
 * @version 1.0.0
 * @author MindSing
 * @license MIT
 */

(function() {
  'use strict';

  // Initialize hamburger menu functionality
  function initHamburgerMenu() {
    const hamburgerButton = document.querySelector('.hamburger-button');
    const navigation = document.querySelector('.navigation-main');
    
    if (!hamburgerButton || !navigation) {
      return; // Exit if elements don't exist
    }

    // Toggle menu function
    function toggleMenu() {
      const isOpen = navigation.classList.contains('is-open');
      const newState = !isOpen;
      
      // Toggle navigation
      navigation.classList.toggle('is-open', newState);
      
      // Toggle hamburger icon
      hamburgerButton.classList.toggle('is-active', newState);
      
      // Update aria-expanded for accessibility
      hamburgerButton.setAttribute('aria-expanded', newState.toString());
    }

    // Close menu function
    function closeMenu() {
      navigation.classList.remove('is-open');
      hamburgerButton.classList.remove('is-active');
      hamburgerButton.setAttribute('aria-expanded', 'false');
    }

    // Event listeners
    hamburgerButton.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on navigation links
    const navLinks = navigation.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navigation.contains(event.target) && !hamburgerButton.contains(event.target)) {
        closeMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHamburgerMenu);
  } else {
    initHamburgerMenu();
  }
})();
