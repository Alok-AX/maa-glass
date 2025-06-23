// Handle login form submission
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        // In a real app, you would verify credentials with your backend
        localStorage.setItem('authToken', 'simulated-token');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', email.split('@')[0]);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }, 1000);
});

// Handle signup form submission
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const phone = document.getElementById('phone-number').value;
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        // In a real app, you would send this data to your backend
        localStorage.setItem('authToken', 'simulated-token');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', firstName + ' ' + lastName);
        localStorage.setItem('userPhone', phone);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }, 1000);
});

// Logout functionality
document.getElementById('logout-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    window.location.href = 'login.html';
});

// Check authentication on dashboard load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('billing.html')) {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            window.location.href = 'login.html';
        } else {
            // Set user info
            const userName = localStorage.getItem('userName');
            if (userName) {
                document.getElementById('user-name').textContent = userName;
            }
        }
    }
});