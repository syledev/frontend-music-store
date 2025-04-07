// Authentication functionality
class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.updateAuthUI();
    }

    // Register new user
    register(userData) {
        // Validate password match
        if (userData.password !== userData.confirmPassword) {
            this.showError('Mật khẩu xác nhận không khớp');
            return false;
        }

        // Validate password strength
        if (!this.validatePassword(userData.password)) {
            this.showError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
            return false;
        }

        // Get existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if email already exists
        if (users.find(user => user.email === userData.email)) {
            this.showError('Email đã được sử dụng');
            return false;
        }

        // Add new user
        users.push({
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: this.hashPassword(userData.password),
            createdAt: new Date().toISOString()
        });

        // Save users
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after register
        this.login(userData.email, userData.password);
        return true;
    }

    // Login user
    login(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === this.hashPassword(password));

        if (user) {
            this.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateAuthUI();
            return true;
        } else {
            this.showError('Email hoặc mật khẩu không đúng');
            return false;
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateAuthUI();
        window.location.href = 'index.html';
    }

    // Update UI based on auth state
    updateAuthUI() {
        const authLinks = document.querySelectorAll('.auth-links');
        const userLinks = document.querySelectorAll('.user-links');
        const userName = document.querySelector('.user-name');

        if (this.currentUser) {
            authLinks.forEach(link => link.style.display = 'none');
            userLinks.forEach(link => link.style.display = 'block');
            if (userName) userName.textContent = this.currentUser.name;
        } else {
            authLinks.forEach(link => link.style.display = 'block');
            userLinks.forEach(link => link.style.display = 'none');
            if (userName) userName.textContent = '';
        }
    }

    // Validate password strength
    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    }

    // Hash password (simple implementation for demo)
    hashPassword(password) {
        return btoa(password); // Note: This is not secure, use proper hashing in production
    }

    // Show error message
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
        errorDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const form = document.querySelector('form');
        form.insertBefore(errorDiv, form.firstChild);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize auth
const auth = new Auth();

// Initialize login form
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        if (auth.login(email, password)) {
            if (remember) {
                localStorage.setItem('rememberEmail', email);
            } else {
                localStorage.removeItem('rememberEmail');
            }
            window.location.href = 'index.html';
        }
    });
}

// Initialize register form
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirm-password').value
        };

        if (auth.register(userData)) {
            window.location.href = 'index.html';
        }
    });
}

// Initialize logout buttons
const logoutButtons = document.querySelectorAll('.logout-btn');
logoutButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        auth.logout();
    });
});

// Mock user data
const users = [
    { email: 'admin@gmail.com', password: 'abc123', role: 'admin', displayName: 'Admin' },
    { email: 'user@gmail.com', password: 'abc123', role: 'user', displayName: 'User' },
    { email: 'user1@gmail.com', password: 'abc123', role: 'user', displayName: 'User' }
];

// Xóa tất cả dữ liệu người dùng
function clearAllUserData() {
    // Lưu lại cart và wishlist vào biến tạm
    const cart = localStorage.getItem('cart');
    const wishlist = localStorage.getItem('wishlist');
    
    // Xóa thông tin đăng nhập
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdminLoggedIn');
    sessionStorage.removeItem('currentUser');
    
    // Khôi phục lại cart và wishlist
    if (cart) {
        localStorage.setItem('cart', cart);
    }
    if (wishlist) {
        localStorage.setItem('wishlist', wishlist);
    }
}

// Admin login
function loginAdmin(email, password) {
    // Lưu cart và wishlist hiện tại vào biến tạm (nếu có)
    const currentCart = localStorage.getItem('cart');
    const currentWishlist = localStorage.getItem('wishlist');
    
    // Xóa thông tin người dùng cũ nhưng không xóa cart và wishlist
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdminLoggedIn');
    
    const admin = users.find(user => user.email === email && user.password === password && user.role === 'admin');
    if (admin) {
        const currentUser = {
            email: admin.email,
            role: 'admin',
            displayName: admin.displayName
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('isAdminLoggedIn', 'true');
        
        // Khôi phục cart và wishlist
        if (currentCart) {
            localStorage.setItem('cart', currentCart);
        }
        if (currentWishlist) {
            localStorage.setItem('wishlist', currentWishlist);
        }
        
        return true;
    }
    return false;
}

// User login
function loginUser(email, password) {
    // Lưu cart và wishlist hiện tại vào biến tạm (nếu có)
    const currentCart = localStorage.getItem('cart');
    const currentWishlist = localStorage.getItem('wishlist');
    
    // Xóa thông tin người dùng cũ nhưng không xóa cart và wishlist
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdminLoggedIn');
    
    const user = users.find(user => user.email === email && user.password === password && user.role === 'user');
    if (user) {
        const currentUser = {
            email: user.email,
            role: 'user',
            displayName: user.displayName
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Khôi phục cart và wishlist
        if (currentCart) {
            localStorage.setItem('cart', currentCart);
        }
        if (currentWishlist) {
            localStorage.setItem('wishlist', currentWishlist);
        }
        
        return true;
    }
    return false;
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem("currentUser") !== null || 
           localStorage.getItem("isLoggedIn") === 'true' || 
           localStorage.getItem("isAdminLoggedIn") === 'true';
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

// Logout function
function logout() {
    clearAllUserData();
    updateAuthUI();
    window.location.href = '../index.html';
}

// Require login for protected features
function requireLogin(redirectUrl) {
    if (!isLoggedIn()) {
        // Store the intended redirect URL
        if (redirectUrl) {
            localStorage.setItem("redirectAfterLogin", redirectUrl);
        }
        // Show login required message
        alert("Vui lòng đăng nhập để sử dụng tính năng này!");
        // Redirect to login page
        window.location.href = "../pages/login.html";
        return false;
    }
    return true;
}

// Update UI based on authentication state
function updateAuthUI() {
    const currentUser = getCurrentUser();
    const isUserLoggedIn = localStorage.getItem("isLoggedIn") === 'true';
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === 'true';
    
    if (currentUser || isUserLoggedIn || isAdminLoggedIn) {
        // Hide login/register buttons and show user dropdown
        $(".login-register-btns").addClass("d-none");
        $(".user-dropdown").removeClass("d-none");
        
        // Update username
        let username = 'User';
        if (currentUser) {
            username = currentUser.role === 'admin' ? 'Admin' : currentUser.email.split('@')[0];
        } else if (isAdminLoggedIn) {
            username = 'Admin';
        }
        $(".user-name").text(username);
        
        // Show/hide admin elements
        if (currentUser && currentUser.role === 'admin' || isAdminLoggedIn) {
            $(".admin-only").removeClass("d-none");
        } else {
            $(".admin-only").addClass("d-none");
        }
        
        // Update cart and wishlist counts
        updateCartAndWishlistCounts();
    } else {
        // Show login/register buttons and hide user dropdown
        $(".login-register-btns").removeClass("d-none");
        $(".user-dropdown").addClass("d-none");
        $(".admin-only").addClass("d-none");
    }
}

// Update cart and wishlist counts
function updateCartAndWishlistCounts() {
    // Update cart count
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    $('.cart-count').text(cart.length);
    
    // Update wishlist count
    const wishlist = localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')) : [];
    $('.wishlist-count').text(wishlist.length);
}

// Handle login
function handleLogin(email, password, rememberMe) {
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Store user info
        localStorage.setItem("currentUser", JSON.stringify({
            email: user.email,
            role: user.role,
            displayName: user.displayName
        }));
        
        // Set isLoggedIn flag
        localStorage.setItem("isLoggedIn", "true");

        // Handle remember me
        if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }

        // Update UI
        updateAuthUI();

        // Redirect if needed
        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
            localStorage.removeItem("redirectAfterLogin");
            window.location.href = redirectUrl;
        } else {
            window.location.href = "../index.html";
        }
        
        return true;
    } else {
        alert("Email hoặc mật khẩu không đúng!");
        return false;
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    updateAuthUI();
    window.location.href = "/pages/login.html";
}

// Add event listeners for protected features
$(document).ready(function() {
    // Update auth UI when page loads
    updateAuthUI();

    // Add to cart
    $(document).on("click", ".add-to-cart", function(e) {
        e.preventDefault();
        if (requireLogin("../pages/cart.html")) {
            // Add to cart logic here
        }
    });

    // Add to wishlist
    $(document).on("click", ".add-to-wishlist", function(e) {
        e.preventDefault();
        if (requireLogin("../pages/wishlist.html")) {
            // Add to wishlist logic here
        }
    });

    // Post comment
    $(document).on("submit", ".comment-form", function(e) {
        e.preventDefault();
        if (requireLogin()) {
            // Post comment logic here
        }
    });

    // View cart
    $(document).on("click", ".view-cart", function(e) {
        e.preventDefault();
        if (requireLogin("../pages/cart.html")) {
            window.location.href = "../pages/cart.html";
        }
    });

    // View wishlist
    $(document).on("click", ".view-wishlist", function(e) {
        e.preventDefault();
        if (requireLogin("../pages/wishlist.html")) {
            window.location.href = "../pages/wishlist.html";
        }
    });
}); 