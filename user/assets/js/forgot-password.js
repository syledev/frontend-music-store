// Load header and footer
document.addEventListener('DOMContentLoaded', () => {
    // Load header
    fetch('../components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('../components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));

    // Initialize forgot password form
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;

            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email);

            if (user) {
                // In a real application, you would send a password reset email here
                // For demo purposes, we'll just show a success message
                const successMessage = document.getElementById('success-message');
                if (successMessage) {
                    successMessage.textContent = 'Hướng dẫn đặt lại mật khẩu đã được gửi vào email của bạn';
                    successMessage.style.display = 'block';
                }

                // Hide error message if it was shown
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }

                // Disable form
                forgotPasswordForm.querySelector('button[type="submit"]').disabled = true;
                forgotPasswordForm.querySelector('input').disabled = true;

                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            } else {
                // Show error message
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.textContent = 'Email không tồn tại trong hệ thống';
                    errorMessage.style.display = 'block';
                }

                // Hide success message if it was shown
                const successMessage = document.getElementById('success-message');
                if (successMessage) {
                    successMessage.style.display = 'none';
                }
            }
        });
    }
}); 