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

    // Initialize login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Store user info in localStorage
                const userData = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    loginMethod: 'email'
                };

                if (rememberMe) {
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('currentUser', JSON.stringify(userData));
                }

                // Show success message
                showToast('Đăng nhập thành công! Đang chuyển hướng...', 'success');

                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                // Show error message
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.textContent = 'Email hoặc mật khẩu không đúng';
                    errorMessage.style.display = 'block';
                }
            }
        });
    }

    // Initialize Google login
    const googleLoginBtn = document.getElementById('google-login');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            // Note: In a real application, you would implement Google OAuth here
            // For demo purposes, we'll just show a message
            showToast('Tính năng đang được phát triển', 'info');
        });
    }
});

// Show toast message
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast position-fixed bottom-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    const bgClass = type === 'success' ? 'bg-success text-white' : 
                    type === 'error' ? 'bg-danger text-white' : 
                    'bg-info text-white';
    
    toast.innerHTML = `
        <div class="toast-header ${bgClass}">
            <strong class="me-auto">Thông báo</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(toast);
    });
}

// Prevent form redirect
$(document).ready(function() {
    // Kiểm tra nếu đã đăng nhập thì chuyển về trang chủ
    if (isLoggedIn()) {
        window.location.href = '../index.html';
    }
    
    // Gắn sự kiện submit cho form đăng nhập
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        
        // Lấy thông tin đăng nhập
        const email = $('#email').val();
        const password = $('#password').val();
        const remember = $('#remember').prop('checked');
        
        // Kiểm tra đăng nhập admin
        if (loginAdmin(email, password)) {
            // Lưu trạng thái ghi nhớ nếu được chọn
            if (remember) {
                localStorage.setItem('rememberEmail', email);
            }
            
            // Chuyển hướng sau đăng nhập
            const redirectUrl = localStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            } else {
                window.location.href = '../index.html';
            }
            return false;
        }
        
        // Kiểm tra đăng nhập user thông thường
        if (loginUser(email, password)) {
            // Lưu trạng thái ghi nhớ nếu được chọn
            if (remember) {
                localStorage.setItem('rememberEmail', email);
            }
            
            // Chuyển hướng sau đăng nhập
            const redirectUrl = localStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            } else {
                window.location.href = '../index.html';
            }
            return false;
        }
        
        // Hiển thị thông báo lỗi nếu đăng nhập thất bại
        showLoginError();
        return false;
    });
    
    // Kiểm tra xem có email đã lưu chưa
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
        $('#email').val(rememberedEmail);
        $('#remember').prop('checked', true);
    }
    
    // Xử lý hiển thị/ẩn mật khẩu
    $('.password-toggle').on('click', function() {
        const passwordInput = document.getElementById('password');
        const icon = $(this).find('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });
});

// Hiển thị thông báo lỗi đăng nhập
function showLoginError() {
    const errorMsg = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i>
            Email hoặc mật khẩu không đúng. Vui lòng thử lại.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Thêm thông báo lỗi vào đầu form
    $('#login-form').prepend(errorMsg);
    
    // Tự động xóa thông báo sau 5 giây
    setTimeout(function() {
        $('.alert').alert('close');
    }, 5000);
} 