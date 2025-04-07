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

    // Initialize register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validate password match
            if (password !== confirmPassword) {
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.textContent = 'Mật khẩu xác nhận không khớp';
                    errorMessage.style.display = 'block';
                }
                return;
            }

            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if email already exists
            if (users.some(user => user.email === email)) {
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.textContent = 'Email đã được sử dụng';
                    errorMessage.style.display = 'block';
                }
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password
            };

            // Add user to localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Show success message
            const toast = document.createElement('div');
            toast.className = 'toast position-fixed bottom-0 end-0 m-3';
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'assertive');
            toast.setAttribute('aria-atomic', 'true');
            toast.innerHTML = `
                <div class="toast-header">
                    <strong class="me-auto">Thông báo</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...
                </div>
            `;
            document.body.appendChild(toast);
            
            const bsToast = new bootstrap.Toast(toast);
            bsToast.show();

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }
}); 