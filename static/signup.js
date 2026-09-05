document.addEventListener('DOMContentLoaded', function() {
    initSignupSystem();

    initAnimations();
});
const signupSystem = {
    passwordStrength: 0,
    notificationTimeout: null
};

function initSignupSystem() {
    setupFormSubmission();
    setupPasswordStrength();
    setupPasswordToggle();
    setupSocialSignup();
    setupNotifications();
    setupSmoothScrolling();
    setupDemoVideo();
}

// Set up Form Submission
function setupFormSubmission() {
    const registrationForm = document.getElementById('registration-form');
    if (!registrationForm) return;
    
    registrationForm.addEventListener('submit', handleSignup);
}

// Handle Signup
function handleSignup(e) {
    e.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const profession = document.getElementById('profession').value.trim();
    const terms = document.getElementById('terms').checked;
    const newsletter = document.getElementById('newsletter').checked;
    
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Please agree to the Terms of Service', 'error');
        return;
    }
    
    // Check password strength
    if (signupSystem.passwordStrength < 2) {
        showNotification('Please use a stronger password', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('MiniSiteAI_users')) || [];
        const userExists = users.some(u => u.email === email);
        
        if (userExists) {
            showNotification('An account with this email already exists', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name: fullName,
            email: email,
            password: password, // In real app, this should be hashed
            profession: profession || 'Not specified',
            newsletter: newsletter,
            createdAt: new Date().toISOString(),
            plan: 'free',
            portfolios: []
        };
        
        // Save to localStorage
        users.push(newUser);
        localStorage.setItem('MiniSiteAI_users', JSON.stringify(users));
        sessionStorage.setItem('MiniSiteAI_user', JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            plan: newUser.plan,
            profession: newUser.profession
        }));
        
        // Show success notification
        showNotification('Account created successfully! Welcome to MiniSiteAI', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Reset form
        registrationForm.reset();
        
        // Update password strength display
        updatePasswordStrength(0);
        
        // Redirect to dashboard after delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }, 1500);
}

// Set up Password Strength
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        signupSystem.passwordStrength = strength;
        updatePasswordStrength(strength);
    });
}

// Calculate Password Strength
function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase
    if (/[a-z]/.test(password)) strength += 1; // Lowercase
    if (/\d/.test(password)) strength += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special characters
    
    // Cap at 5 for display
    return Math.min(strength, 5);
}

// Update Password Strength Display
function updatePasswordStrength(strength) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    const percentage = (strength / 5) * 100;
    strengthFill.style.width = `${percentage}%`;
    
    // Update color and text based on strength
    let color, text;
    
    switch(strength) {
        case 0:
            color = '#dc2626';
            text = 'Very weak';
            break;
        case 1:
            color = '#ef4444';
            text = 'Weak';
            break;
        case 2:
            color = '#f59e0b';
            text = 'Fair';
            break;
        case 3:
            color = '#10b981';
            text = 'Good';
            break;
        case 4:
            color = '#3b82f6';
            text = 'Strong';
            break;
        case 5:
            color = '#059669';
            text = 'Very strong';
            break;
        default:
            color = '#e5e7eb';
            text = 'Password strength';
    }
    
    strengthFill.style.backgroundColor = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
}

// Set up Password Toggle
function setupPasswordToggle() {
    const togglePassword = document.getElementById('togglePassword');
    if (!togglePassword) return;
    
    togglePassword.addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const icon = this.querySelector('i');
        togglePasswordVisibility(passwordInput, icon);
    });
}

// Toggle Password Visibility
function togglePasswordVisibility(input, icon) {
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Set up Social Signup
function setupSocialSignup() {
    const googleButtons = document.querySelectorAll('.google-btn');
    const githubButtons = document.querySelectorAll('.github-btn');
    const linkedinButtons = document.querySelectorAll('.linkedin-btn');
    
    googleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Google signup would be implemented in a real app', 'info');
            // In a real app, this would trigger OAuth flow
        });
    });
    
    githubButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('GitHub signup would be implemented in a real app', 'info');
            // In a real app, this would trigger OAuth flow
        });
    });
    
    linkedinButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('LinkedIn signup would be implemented in a real app', 'info');
            // In a real app, this would trigger OAuth flow
        });
    });
}

// Set up Notifications
function setupNotifications() {
    const closeNotificationBtn = document.getElementById('closeNotification');
    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', clearNotification);
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    if (!notification || !notificationMessage) return;
    
    // Clear any existing timeout
    if (signupSystem.notificationTimeout) {
        clearTimeout(signupSystem.notificationTimeout);
    }
    
    // Set message and type
    notificationMessage.textContent = message;
    notification.className = 'notification show ' + type;
    
    // Update icon based on type
    const icon = notification.querySelector('i');
    if (icon) {
        if (type === 'success') {
            icon.className = 'fas fa-check-circle';
        } else if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
        } else {
            icon.className = 'fas fa-info-circle';
        }
    }
    
    // Auto-hide after 5 seconds
    signupSystem.notificationTimeout = setTimeout(() => {
        clearNotification();
    }, 5000);
}

// Clear Notification
function clearNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.remove('show');
    }
    
    if (signupSystem.notificationTimeout) {
        clearTimeout(signupSystem.notificationTimeout);
        signupSystem.notificationTimeout = null;
    }
}

// Set up Smooth Scrolling
function setupSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or links to different page
            if (href === '#' || href.includes('.html')) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Set up Demo Video
function setupDemoVideo() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (!videoPlaceholder) return;
    
    videoPlaceholder.addEventListener('click', function() {
        showNotification('In a real app, this would play a demo video', 'info');
        // In a real app, this would open a modal with a video player
    });
}

// Initialize Animations
function initAnimations() {
    // Add scroll animations
    setupScrollAnimations();
    
    // Add hover effects to cards
    setupCardHoverEffects();
    
    // Add typing effect to hero text
    setupTypingEffect();
}

// Set up Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    document.querySelectorAll('.feature-card, .template-card, .testimonial-card, .pricing-card, .faq-item').forEach(el => {
        observer.observe(el);
    });
}

// Set up Card Hover Effects
function setupCardHoverEffects() {
    // Portfolio cards in hero
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
}

// Set up Typing Effect (optional)
function setupTypingEffect() {
    const heroTitle = document.querySelector('.hero-text h1');
    if (!heroTitle) return;
    
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing effect on page load
    setTimeout(typeWriter, 1000);
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Auto-fill demo data for testing (remove in production)
function setupDemoData() {
    // Only for development/demo purposes
    if (window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1')) {
        const demoBtn = document.createElement('button');
        demoBtn.className = 'demo-data-btn';
        demoBtn.innerHTML = '<i class="fas fa-magic"></i> Fill Demo Data';
        demoBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        
        demoBtn.addEventListener('click', function() {
            document.getElementById('fullName').value = 'Demo User';
            document.getElementById('email').value = 'demo@MiniSiteAI.com';
            document.getElementById('password').value = 'Demo123!';
            document.getElementById('confirmPassword').value = 'Demo123!';
            document.getElementById('profession').value = 'Software Developer';
            document.getElementById('terms').checked = true;
            document.getElementById('newsletter').checked = true;
            
            // Update password strength
            const passwordInput = document.getElementById('password');
            const strength = calculatePasswordStrength(passwordInput.value);
            updatePasswordStrength(strength);
            
            showNotification('Demo data filled. You can now test the signup form.', 'info');
        });
        
        document.body.appendChild(demoBtn);
    }
}

// Initialize demo data button (for testing only)
setupDemoData();