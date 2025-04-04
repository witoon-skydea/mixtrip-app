/**
 * MixTrip - Main JavaScript
 */

// DOM Ready Event
document.addEventListener('DOMContentLoaded', function() {
  console.log('MixTrip JS initialized');
  
  // Initialize components
  initNavbar();
  initAnimations();
  
  // Add smooth scrolling to all links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Initialize Navbar Behavior
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  // Change navbar style on scroll
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
  
  // Mobile menu toggle
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (navbarToggler && navbarCollapse) {
    document.addEventListener('click', function(e) {
      const isNavbarToggler = navbarToggler.contains(e.target);
      const isNavbarCollapse = navbarCollapse.contains(e.target);
      
      if (isNavbarToggler) {
        navbarCollapse.classList.toggle('show');
      } else if (!isNavbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    });
  }
}

// Initialize Animations
function initAnimations() {
  // Add animation classes to elements when they enter the viewport
  const animatedElements = document.querySelectorAll('.feature-card, .destination-card, .testimonial-card');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(element => {
      element.classList.add('animated');
    });
  }
}

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', message, source, lineno, colno, error);
  return true;
};
