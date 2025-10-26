// Make all external links open in a new window
document.addEventListener('DOMContentLoaded', function() {
  // Select all links that start with http or https and don't contain mindsing.com
  const links = document.querySelectorAll('a[href^="http"]');

  links.forEach(link => {
    const href = link.getAttribute('href');
    // Check if it's not an internal link (doesn't contain mindsing.com)
    if (!href.includes('mindsing.com') && !href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
});
