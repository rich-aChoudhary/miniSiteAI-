document.addEventListener('DOMContentLoaded', function() {
    // Handle Signup Form
    const signupForm = document.querySelector('form:not(#login-form)');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const username = signupForm.querySelector('input[type="text"]').value;
            const email = signupForm.querySelector('input[type="email"]').value;
            const password = signupForm.querySelector('#password').value;
            const messageDiv = signupForm.querySelector('.message') || document.createElement('div');
            
            if (!messageDiv.classList.contains('message')) {
                messageDiv.classList.add('message');
                signupForm.appendChild(messageDiv);
            }

            // Basic client-side validation
            if (!username || !email || !password) {
                messageDiv.style.color = 'red';
                messageDiv.textContent = 'Please fill in all fields';
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                messageDiv.style.color = 'red';
                messageDiv.textContent = 'Please enter a valid email address';
                return;
            }

            // Password strength validation
            if (password.length < 4) {
                messageDiv.style.color = 'red';
                messageDiv.textContent = 'Password must be at least 4 characters long';
                return;
            }

            try {
                // Simulated API call - replace with actual API endpoint
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    messageDiv.style.color = 'green';
                    messageDiv.textContent = 'Signup successful! Redirecting to dashboard...';
                    // Save user info to localStorage for persistence if returned
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                    window.location.href = '/dashboard';
                } else {
                    messageDiv.style.color = 'red';
                    messageDiv.textContent = data.message || 'Signup failed. Please try again.';
                }
            } catch (error) {
                messageDiv.style.color = 'red';
                messageDiv.textContent = 'An error occurred. Please try again later.';
                console.error('Signup error:', error);
            }
        });
    }
});