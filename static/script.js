

// Initialize Swiper
const swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Mobile Menu Toggle - Fixed
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
const headerActions = document.querySelector('.header-actions');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    
    // Create mobile menu actions if they don't exist
    if (window.innerWidth < 768) {
      if (!nav.querySelector('.mobile-actions')) {
        const mobileActions = document.createElement('div');
        mobileActions.className = 'mobile-actions';
        mobileActions.innerHTML = `
          <button class="btn btn-login" id="mobileLoginButton">
            <i class="fas fa-sign-in-alt"></i> Sign In
          </button>
          <button class="btn btn-primary" id="mobileSignupButton">
            Get Started Free
          </button>
        `;
        nav.appendChild(mobileActions);
        
        // Add event listeners to mobile buttons
        document.getElementById('mobileLoginButton').addEventListener('click', () => {
          alert('Redirecting to login page...');
        });
        
        document.getElementById('mobileSignupButton').addEventListener('click', () => {
          alert('Redirecting to signup page...');
        });
      }
    }
  });
}

// Close mobile menu on link click
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      nav.classList.remove('active');
    }
  });
});

// Button click handlers
const getStartedButtons = document.querySelectorAll('#getStarted, #getStartedBottom');
const signupButton = document.getElementById('signupButton');
const loginButton = document.getElementById('loginButton');
const watchDemoButton = document.getElementById('watchDemo');

// Add the watchDemoButton if it doesn't exist in HTML
if (!watchDemoButton) {
  const heroActions = document.querySelector('.hero-actions');
  if (heroActions && !heroActions.querySelector('#watchDemo')) {
    const watchDemoBtn = document.createElement('button');
    watchDemoBtn.className = 'btn btn-outline btn-lg';
    watchDemoBtn.id = 'watchDemo';
    watchDemoBtn.innerHTML = '<i class="fas fa-play-circle"></i> Watch Demo';
    heroActions.appendChild(watchDemoBtn);
    
    watchDemoBtn.addEventListener('click', () => {
      alert('Opening demo video...');
    });
  }
}

getStartedButtons.forEach(button => {
  button.addEventListener('click', () => {
   
     window.location.href = '/register';
  });
});

if (signupButton) {
  signupButton.addEventListener('click', () => {
  
   window.location.href = '/register';
  });
}

if (loginButton) {
  loginButton.addEventListener('click', () => {
  
     window.location.href = '/login';
  });
}

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.style.padding = '15px 0';
    header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.padding = '20px 0';
    header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
  }
});

// Template preview interaction
const templateCards = document.querySelectorAll('.template-card');
templateCards.forEach(card => {
  card.addEventListener('click', () => {
    alert('This template would open in a preview modal. In a real app, users could see a live preview.');
  });
});

// Review card hover effect enhancement
const reviewCards = document.querySelectorAll('.review-card');
reviewCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-10px)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// Window resize handler to adjust menu
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    nav.classList.remove('active');
    // Remove mobile actions if they exist
    const mobileActions = nav.querySelector('.mobile-actions');
    if (mobileActions) {
      mobileActions.remove();
    }
  }
});

// Fix for initial page load - ensure content is visible
document.addEventListener('DOMContentLoaded', function() {
  // Force a reflow to ensure all content is visible
  document.body.style.visibility = 'visible';
  
  // Add margin to all sections for mobile
  if (window.innerWidth < 768) {
    const sections = document.querySelectorAll('.section, .hero, .cta-section');
    sections.forEach(section => {
      section.style.marginTop = '0';
    });
  }
  
  // Check if all elements are visible
  setTimeout(() => {
    const allElements = document.querySelectorAll('*');
    let hiddenElements = [];
    
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        if (el.offsetParent === null && 
            style.position !== 'fixed' && 
            style.position !== 'absolute' &&
            !el.classList.contains('aos-init') &&
            !el.classList.contains('aos-animate')) {
          hiddenElements.push(el);
        }
      }
    });
    
    // Force show any hidden critical elements
    if (hiddenElements.length > 0) {
      hiddenElements.forEach(el => {
        if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && el.tagName !== 'LINK') {
          el.style.display = 'block';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        }
      });
    }
  }, 100);
});