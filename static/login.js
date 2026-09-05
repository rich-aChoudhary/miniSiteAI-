document.addEventListener('DOMContentLoaded', function() {
    initAuthSystem();
});

const authSystem = {
    currentForm: 'login',
    notificationTimeout: null
};

function initAuthSystem() {
    setupFormSwitching();
    setupFormSubmissions();
    setupPasswordToggles();
    setupPasswordValidation();
    setupNotifications();
}

function setupFormSwitching() {
    const switchToSignupBtn = document.getElementById('switchToSignup');
    const switchToLoginFromSignup = document.getElementById('switchToLoginFromSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    const backToLogin = document.getElementById('backToLogin');
    const returnToLogin = document.getElementById('returnToLogin');
    
    if (switchToSignupBtn) {
        switchToSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            switchForm('signup');
        });
    }
    
    if (switchToLoginFromSignup) {
        switchToLoginFromSignup.addEventListener('click', function(e) {
            e.preventDefault();
            switchForm('login');
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            switchForm('login');
        });
    }
    
    if (backToLogin) {
        backToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            switchForm('login');
        });
    }
    
    if (returnToLogin) {
        returnToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            switchForm('login');
        });
    }
    
    // Forgot Password
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchForm('forgot');
        });
    }
}

// Switch Form
function switchForm(formName) {
    // Hide all forms
    const forms = document.querySelectorAll('.form-wrapper');
    forms.forEach(form => {
        form.classList.remove('active');
    });
    
    // Show success message if it's visible
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.add('hidden');
    }
    
    // Show selected form
    const targetForm = document.getElementById(formName + 'Form');
    if (targetForm) {
        targetForm.classList.add('active');
        authSystem.currentForm = formName;
        
        // Update brand panel link text
        const panelFooterLink = document.getElementById('switchToLogin');
        if (panelFooterLink) {
            if (formName === 'login') {
                panelFooterLink.textContent = 'Sign In';
            } else {
                panelFooterLink.textContent = 'Sign Up';
            }
        }
        
        // Clear any notifications
        clearNotification();
    }
}

// Set up Form Submissions
function setupFormSubmissions() {
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    

}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();

    const email = (document.getElementById('login-email') || {}).value || '';
    const password = (document.getElementById('login-password') || {}).value || '';

    // Basic client-side validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
 
     const submitBtn = event.target.querySelector('button[type="submit"]') || e.target.querySelector('.btn-primary');
    const originalText = submitBtn ? submitBtn.innerHTML : null;
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>Logging in...';
        submitBtn.disabled = true;
    }
let loader = document.getElementById('auth-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'auth-loader';
        loader.className = 'loader-overlay';
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        loader.appendChild(spinner);
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
    try {
        // API call - replace endpoint if your backend uses a different route
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json().catch(() => ({}));
        if (response.ok) {
            if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
             loader.style.display = 'none';
            showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => { window.location.href = '/dashboard'; }, 700);
        } else {
            loader.style.display = 'none';
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
            showNotification(data.error || 'Login failed. Please try again.', 'error');
        }
    } catch (error) {
        loader.style.display = 'none';
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        showNotification('An error occurred. Please try again later.', 'error');
    }
}

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();

    const nameEl = document.getElementById('signup-name');
    const emailEl = document.getElementById('signup-email');
    const passwordEl = document.getElementById('signup-password');
    const confirmEl = document.getElementById('confirm-password');
    const termsEl = document.getElementById('termsAgreement');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value.trim() : '';
    const confirmPassword = confirmEl ? confirmEl.value.trim() : '';
    const termsAgreed = termsEl ? termsEl.checked : true; // default true if not present

    // Validation
    if (!name || !email || !password) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }

    if (confirmEl && password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (!termsAgreed) {
        showNotification('Please agree to the Terms of Service', 'error');
        return;
    }

    if (!isStrongPassword(password)) {
        showNotification('Password must include uppercase, lowercase, and a number', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('.btn-primary');
    const originalText = submitBtn ? submitBtn.innerHTML : null;
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
    }

    // Show loader
    let loader = document.getElementById('auth-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'auth-loader';
        loader.className = 'loader-overlay';
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        loader.appendChild(spinner);
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: name, email: email, password: password })
        });

        // Try to read response as text and JSON for better debugging
        const respText = await response.text().catch(() => '');
        let data = {};
        try { data = respText ? JSON.parse(respText) : {}; } catch (e) { data = {}; }

        if (response.ok) {
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('user', JSON.stringify({
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    plan: data.user.plan || 'free'
                }));
            }

            showNotification(data.message || 'Account created successfully! Redirecting...', 'success');
            setTimeout(() => { window.location.href = '/login'; }, 1200);
        } else {
            const serverMsg = data.message || respText || 'Registration failed. Please try again.';
            showNotification(serverMsg, 'error');
            loader.style.display = 'none';
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    } catch (err) {
        console.error('Signup error:', err);
        showNotification('An error occurred. Please try again later.', 'error');
        loader.style.display = 'none';
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
}


// Set up Password Toggles
function setupPasswordToggles() {
    const togglePassword = document.getElementById('togglePassword');
    const toggleSignupPassword = document.getElementById('toggleSignupPassword');
    
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('login-password');
            const icon = this.querySelector('i');
            togglePasswordVisibility(passwordInput, icon);
        });
    }
    
    if (toggleSignupPassword) {
        toggleSignupPassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('signup-password');
            const icon = this.querySelector('i');
            togglePasswordVisibility(passwordInput, icon);
        });
    }
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

// Set up Password Validation
function setupPasswordValidation() {
    const passwordInput = document.getElementById('signup-password');

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
    const notification = document.getElementById('formNotification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    if (!notification || !notificationMessage) return;
    
    // Clear any existing timeout
    if (authSystem.notificationTimeout) {
        clearTimeout(authSystem.notificationTimeout);
    }
    
    // Set message and type
    notificationMessage.textContent = message;
    notification.className = 'form-notification show ' + type;
    
    // Auto-hide after 5 seconds
    authSystem.notificationTimeout = setTimeout(() => {
        clearNotification();
    }, 5000);
}

// Clear Notification
function clearNotification() {
    const notification = document.getElementById('formNotification');
    if (notification) {
        notification.classList.remove('show');
    }
    
    if (authSystem.notificationTimeout) {
        clearTimeout(authSystem.notificationTimeout);
        authSystem.notificationTimeout = null;
    }
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isStrongPassword(password) {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
}