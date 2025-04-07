// Wait for DOM and components to load
$(document).ready(function() {
    // Load header and footer
    $("#header").load("components/header.html", function() {
        console.log('Header loaded');
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
        
        // Update cart and wishlist counts after header is loaded
        updateCartCount();
        updateWishlistCount();
    });
    
    $("#footer").load("components/footer.html", function() {
        console.log('Footer loaded');
        // Update copyright year after footer is loaded
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    });

    // Initialize featured products
    loadFeaturedProducts();
});

// Initialize tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Initialize popovers
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
});

// Add to cart functionality
function addToCart(productId) {
    console.log('Adding to cart product ID:', productId);
    
    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true' || 
                   (localStorage.getItem('currentUser') && 
                    JSON.parse(localStorage.getItem('currentUser')).role === 'admin');
    
    if (isAdmin) {
        showToast('Tài khoản admin không được sử dụng chức năng này!');
        return;
    }
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('currentUser') !== null;
    if (!isLoggedIn) {
        showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        setTimeout(() => {
            window.location.href = '/pages/login.html';
        }, 2000);
        return;
    }
    
    // Find product
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Get current cart
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === productId);
    
    if (existingProductIndex > -1) {
        // Increment quantity if already in cart
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new product with quantity 1
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update counts in header
    updateCartCount();
    
    // Show success message
    showToast('Sản phẩm đã được thêm vào giỏ hàng');
}

// Add to wishlist functionality
function addToWishlist(productId) {
    console.log('Adding to wishlist product ID:', productId);
    
    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true' || 
                   (localStorage.getItem('currentUser') && 
                    JSON.parse(localStorage.getItem('currentUser')).role === 'admin');
    
    if (isAdmin) {
        showToast('Tài khoản admin không được sử dụng chức năng này!');
        return;
    }
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('currentUser') !== null;
    if (!isLoggedIn) {
        showToast('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích!');
        setTimeout(() => {
            window.location.href = '/pages/login.html';
        }, 2000);
        return;
    }
    
    // Find product
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Get current wishlist
    const wishlist = localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')) : [];
    
    // Check if product already exists in wishlist
    if (wishlist.some(item => item.id === productId)) {
        showToast('Sản phẩm đã có trong danh sách yêu thích!');
        return;
    }
    
    // Add product with current date
    wishlist.push({
        ...product,
        addedDate: new Date().toLocaleDateString('vi-VN')
    });
    
    // Save wishlist
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update wishlist count
    updateWishlistCount();
    
    // Show success message
    showToast('Sản phẩm đã được thêm vào danh sách yêu thích');
}

// Update cart count
function updateCartCount() {
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    $('.cart-count').text(cart.length);
}

// Update wishlist count
function updateWishlistCount() {
    const wishlist = localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')) : [];
    $('.wishlist-count').text(wishlist.length);
}

// Toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast position-fixed bottom-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Create toast content
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Thông báo</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add toast to document
    document.body.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function () {
        document.body.removeChild(toast);
    });
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        form.classList.add('was-validated');
    });
}

// Initialize form validation for all forms
document.addEventListener('DOMContentLoaded', function() {
    validateForm('contact-form');
    validateForm('comment-form');
    validateForm('login-form');
    validateForm('register-form');
    
    // Xử lý form tìm kiếm trong bộ lọc
    $('#filter-search-form').on('submit', function(e) {
        e.preventDefault();
        const searchTerm = $('#filter-search-input').val();
        if (searchTerm) {
            window.location.href = `pages/products.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });
    
    // Xử lý các danh mục trong bộ lọc
    $('.filter-category-item').on('click', function() {
        const category = $(this).data('category');
        window.location.href = `pages/products.html?category=${category}`;
    });
    
    // Xử lý thanh trượt khoảng giá
    $('#filter-price-range').on('change', function() {
        const maxPrice = $(this).val();
        window.location.href = `pages/products.html?maxPrice=${maxPrice}`;
    });
});

// Search functionality
function searchProducts(query) {
    // Implement search logic here
    console.log('Searching for:', query);
}

// Initialize search
const searchForm = document.querySelector('.search-form');
if (searchForm) {
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = this.querySelector('input[type="text"]').value;
        searchProducts(query);
    });
}

// Mobile menu toggle
const navbarToggler = document.querySelector('.navbar-toggler');
if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
        document.body.classList.toggle('menu-open');
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Lazy loading images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

// Featured products data
const products = [
    {
        id: 1,
        name: 'Piano Yamaha C3X PE',
        category: 'Piano',
        price: 850000000,
        image: 'assets/images/products/piano-1.jpg',
        featured: true,
        description: 'Đàn piano cơ cao cấp, âm thanh xuất sắc'
    },
    {
        id: 2,
        name: 'Guitar Classic Yamaha C40',
        category: 'Guitar',
        price: 3200000,
        image: 'assets/images/products/guitar-1.jpg',
        featured: true,
        description: 'Guitar classic chất lượng cho người mới học'
    },
    {
        id: 3,
        name: 'Trống Pearl Decade Maple',
        category: 'Trống',
        price: 25000000,
        image: 'assets/images/products/drums-1.jpg',
        featured: true,
        description: 'Bộ trống chuyên nghiệp, âm thanh mạnh mẽ'
    },
    {
        id: 4,
        name: 'Kèn Trumpet Yamaha YTR-2330',
        category: 'Nhạc cụ hơi',
        price: 15000000,
        image: 'assets/images/products/wind-1.jpg',
        featured: true,
        description: 'Kèn trumpet chất lượng Nhật Bản'
    }
];

// Load featured products
function loadFeaturedProducts() {
    console.log('loadFeaturedProducts function called');
    const featuredProducts = products.filter(product => product.featured);
    const productsToShow = featuredProducts.slice(0, 4);
    const featuredContainer = document.getElementById('featured-products');
    
    console.log('Featured products:', productsToShow);
    console.log('Container element:', featuredContainer);
    
    if (!featuredContainer) {
        console.error('Featured products container not found!');
        return;
    }
    
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true' || 
                   (localStorage.getItem('currentUser') && 
                    JSON.parse(localStorage.getItem('currentUser')).role === 'admin');
    
    // Clear existing content
    featuredContainer.innerHTML = '';
    
    // Create product cards
    productsToShow.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-3 mb-4';
        
        // Define action buttons based on user role
        const actionButtons = isAdmin 
            ? `
                <div class="mt-auto">
                    <a href="pages/product-detail.html?id=${product.id}" class="btn btn-outline-primary w-100">
                        <i class="fas fa-eye"></i> Chi tiết
                    </a>
                </div>
              `
            : `
                <div class="mt-auto">
                    <div class="d-flex justify-content-between mb-2">
                        <a href="pages/product-detail.html?id=${product.id}" class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-eye"></i> Chi tiết
                        </a>
                        <button class="btn btn-outline-danger btn-sm add-to-wishlist" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <button class="btn btn-primary w-100 add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart me-1"></i> Thêm vào giỏ
                    </button>
                </div>
              `;
        
        col.innerHTML = `
            <div class="product-card card h-100">
                <div class="product-image-container">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title" title="${product.name}">${product.name}</h5>
                    <p class="category text-muted">${product.category}</p>
                    <p class="price text-primary fw-bold">${formatPrice(product.price)}</p>
                    ${actionButtons}
                </div>
            </div>
        `;
        
        featuredContainer.appendChild(col);
    });
    
    // Only initialize these buttons for non-admin users
    if (!isAdmin) {
        initializeAddToCartButtons();
        initializeAddToWishlistButtons();
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing featured products');
    loadFeaturedProducts();
});

// Also try jQuery ready event as backup
$(document).ready(function() {
    console.log('jQuery ready - Checking if featured products need initialization');
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer && featuredContainer.children.length === 0) {
        console.log('Featured products container empty, initializing...');
        loadFeaturedProducts();
    }
});

// Initialize Add to Cart buttons
function initializeAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

// Initialize Add to Wishlist buttons
function initializeAddToWishlistButtons() {
    const addToWishlistButtons = document.querySelectorAll('.add-to-wishlist');
    addToWishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToWishlist(productId);
        });
    });
} 