// Sample product data
const products = [
    {
        id: 1,
        name: 'Đàn Guitar Acoustic Yamaha F310',
        price: 1500000,
        image: '/user/assets/images/products/guitar-1.jpg',
        category: 'Guitar',
        rating: 4.5,
        reviewCount: 12
    },
    {
        id: 2,
        name: 'Piano điện Casio CDP-S110',
        price: 12000000,
        image: '/user/assets/images/products/piano-1.jpg',
        category: 'Piano',
        rating: 4.8,
        reviewCount: 8
    },
    {
        id: 3,
        name: 'Trống điện Roland TD-1DMK',
        price: 8000000,
        image: '/user/assets/images/products/drum-1.jpg',
        category: 'Trống',
        rating: 4.6,
        reviewCount: 15
    },
    {
        id: 4,
        name: 'Đàn Guitar Classic Cordoba C5',
        price: 2500000,
        image: '/user/assets/images/products/guitar-2.jpg',
        category: 'Guitar',
        rating: 4.7,
        reviewCount: 10
    },
    {
        id: 5,
        name: 'Piano điện Yamaha CLP-735',
        price: 25000000,
        image: '/user/assets/images/products/piano-2.jpg',
        category: 'Piano',
        rating: 4.9,
        reviewCount: 6
    },
    {
        id: 6,
        name: 'Trống Acoustic Pearl Export',
        price: 12000000,
        image: '/user/assets/images/products/drum-2.jpg',
        category: 'Trống',
        rating: 4.5,
        reviewCount: 9
    },
    {
        id: 7,
        name: 'Đàn Guitar Bass Ibanez GSRM20',
        price: 3500000,
        image: '/user/assets/images/products/guitar-3.jpg',
        category: 'Guitar',
        rating: 4.4,
        reviewCount: 7
    },
    {
        id: 8,
        name: 'Piano điện Roland FP-30X',
        price: 15000000,
        image: '/user/assets/images/products/piano-3.jpg',
        category: 'Piano',
        rating: 4.7,
        reviewCount: 11
    },
    {
        id: 9,
        name: 'Trống điện Alesis Nitro Mesh',
        price: 6000000,
        image: '/user/assets/images/products/drum-3.jpg',
        category: 'Trống',
        rating: 4.3,
        reviewCount: 13
    },
    {
        id: 10,
        name: 'Đàn Guitar Electric Fender Stratocaster',
        price: 18000000,
        image: '/user/assets/images/products/guitar-4.jpg',
        category: 'Guitar',
        rating: 4.8,
        reviewCount: 16
    },
    {
        id: 11,
        name: 'Piano điện Kawai ES110',
        price: 18000000,
        image: '/user/assets/images/products/piano-4.jpg',
        category: 'Piano',
        rating: 4.6,
        reviewCount: 14
    }
];

let currentPage = 1;
const productsPerPage = 9;
let filteredProducts = [...products];

// Load header and footer
$(document).ready(function() {
    // Load header
    $("#header").load("/user/components/header.html", function() {
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
        console.log('Header loaded');
    });
    
    // Load footer
    $("#footer").load("/user/components/footer.html", function() {
        console.log('Footer loaded');
        // Update copyright year after footer is loaded
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    });

    // Đọc tham số từ URL
    parseUrlParams();

    // Initialize products page
    loadProducts();
    initializeEventHandlers();
    updatePagination();
});

// Đọc và xử lý tham số từ URL
function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Xử lý tham số danh mục
    if (urlParams.has('category')) {
        const category = urlParams.get('category').toLowerCase();
        
        // Lọc sản phẩm theo danh mục
        if (category !== 'all') {
            filteredProducts = products.filter(p => {
                const productCategory = p.category.toLowerCase();
                
                // Xử lý trường hợp đặc biệt
                if (category === 'trong' && productCategory.includes('trống')) {
                    return true;
                }
                
                return productCategory === category || 
                       // Xử lý một số trường hợp cụ thể
                       (category === 'piano' && productCategory.includes('piano')) ||
                       (category === 'guitar' && productCategory.includes('guitar')) ||
                       (category === 'wind' && productCategory.includes('hơi')) ||
                       (category === 'violin' && productCategory.includes('violin'));
            });
            
            // Cập nhật giao diện để hiển thị danh mục đã chọn
            $('.list-group-item').removeClass('active');
            $(`.list-group-item[data-category="${category}"]`).addClass('active');
        }
    }
    
    // Xử lý tham số tìm kiếm nếu có
    if (urlParams.has('search')) {
        const searchTerm = urlParams.get('search').toLowerCase();
        $('#searchInput').val(searchTerm);
        
        filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Xử lý tham số khoảng giá nếu có
    if (urlParams.has('maxPrice')) {
        const maxPrice = parseInt(urlParams.get('maxPrice'));
        if (!isNaN(maxPrice)) {
            $('#priceRange').val(maxPrice);
            $('#maxPrice').text(formatPrice(maxPrice));
            $('#currentPrice').text(formatPrice(maxPrice));
            
            filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
        }
    } else {
        // Khởi tạo giá trị mặc định
        $('#currentPrice').text(formatPrice(50000000));
    }
    
    // Cập nhật số lượng sản phẩm trong mỗi danh mục
    updateCategoryCounts();
}

// Tạo URL với các tham số bộ lọc hiện tại
function getFilteredUrl() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    
    // Lấy danh mục hiện tại
    const category = $('.list-group-item.active').data('category');
    if (category && category !== 'all') {
        params.set('category', category);
    }
    
    // Lấy từ khóa tìm kiếm
    const searchTerm = $('#searchInput').val();
    if (searchTerm) {
        params.set('search', searchTerm);
    }
    
    // Lấy khoảng giá
    const maxPrice = $('#priceRange').val();
    if (maxPrice && maxPrice < 50000000) {
        params.set('maxPrice', maxPrice);
    }
    
    return `${url.pathname}?${params.toString()}`;
}

// Load products based on filters and pagination
function loadProducts() {
    const productsContainer = $('#products-container');
    productsContainer.empty();
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
    
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true' || 
                    (localStorage.getItem('currentUser') && 
                     JSON.parse(localStorage.getItem('currentUser')).role === 'admin');
    
    $('#showing-products').text(`Hiển thị ${startIndex + 1} - ${endIndex} / ${filteredProducts.length} sản phẩm`);
    
    if (filteredProducts.length === 0) {
        productsContainer.append(`
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-4x text-muted mb-3"></i>
                <h4>Không tìm thấy sản phẩm phù hợp</h4>
                <p class="text-muted">Vui lòng thử lại với các bộ lọc khác</p>
                <button id="resetFilters" class="btn btn-primary mt-3">Xóa bộ lọc</button>
            </div>
        `);
        return;
    }
    
    for (let i = startIndex; i < endIndex; i++) {
        const product = filteredProducts[i];
        
        // Define action buttons based on user role
        const actionButtons = isAdmin 
            ? `
                <div class="d-flex justify-content-center mt-auto">
                    <a href="/user/pages/product-detail.html?id=${product.id}" class="btn btn-outline-primary w-100">
                        <i class="fas fa-eye"></i> Chi tiết
                    </a>
                </div>
              `
            : `
                <div class="d-flex flex-column gap-2 mt-auto">
                    <div class="d-flex justify-content-between">
                        <a href="/user/pages/product-detail.html?id=${product.id}" class="btn btn-outline-primary">
                            <i class="fas fa-eye"></i> Chi tiết
                        </a>
                        <button class="btn btn-outline-danger add-to-wishlist" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <button class="btn btn-primary w-100 add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart me-1"></i> Thêm vào giỏ
                    </button>
                </div>
              `;
        
        // Tạo thẻ hiển thị danh mục
        const categoryBadge = `<span class="badge bg-${getCategoryColorClass(product.category)}">${product.category}</span>`;
        
        productsContainer.append(`
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="product-card card h-100">
                    <div class="product-image-container">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">${categoryBadge}</div>
                        <h5 class="card-title" title="${product.name}">${product.name}</h5>
                        <div class="product-rating mb-2">
                            ${generateRatingStars(product.rating)}
                            <span class="rating-count">(${product.reviewCount})</span>
                        </div>
                        <p class="price text-primary fw-bold mb-3">${formatPrice(product.price)}</p>
                        ${actionButtons}
                    </div>
                </div>
            </div>
        `);
    }
    
    // Only initialize these buttons for non-admin users
    if (!isAdmin) {
        initializeWishlistButtons();
        initializeCartButtons();
    }
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pagination = $('#pagination');
    pagination.empty();

    // Ẩn phân trang nếu chỉ có 1 trang hoặc không có sản phẩm
    if (totalPages <= 1) {
        pagination.parent().hide();
        return;
    } else {
        pagination.parent().show();
    }

    // Previous button
    pagination.append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        pagination.append(`
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `);
    }

    // Next button
    pagination.append(`
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `);
}

// Initialize event handlers
function initializeEventHandlers() {
    // Pagination click handler
    $(document).on('click', '.page-link', function(e) {
        e.preventDefault();
        const newPage = parseInt($(this).data('page'));
        if (!isNaN(newPage) && newPage !== currentPage && newPage > 0) {
            currentPage = newPage;
            loadProducts();
            updatePagination();
            // Scroll to top of products
            $('#products-container')[0].scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Category filter
    $('.list-group-item').click(function() {
        $('.list-group-item').removeClass('active');
        $(this).addClass('active');
        const category = $(this).data('category');
        
        filteredProducts = category === 'all' 
            ? [...products]
            : products.filter(p => p.category.toLowerCase() === category || 
                                  (category === 'trong' && p.category.toLowerCase().includes('trống')));
        
        currentPage = 1;
        loadProducts();
        updatePagination();
        
        // Cập nhật URL khi thay đổi danh mục
        const newUrl = getFilteredUrl();
        window.history.replaceState(null, '', newUrl);
    });

    // Search handler
    $('#searchInput').on('input', debounce(function() {
        const searchTerm = $(this).val().toLowerCase();
        filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        loadProducts();
        updatePagination();
        
        // Cập nhật URL khi tìm kiếm
        const newUrl = getFilteredUrl();
        window.history.replaceState(null, '', newUrl);
    }, 300));
    
    // Search button click
    $('#searchButton').click(function() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        if (searchTerm) {
            filteredProducts = products.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
            currentPage = 1;
            loadProducts();
            updatePagination();
            
            // Cập nhật URL khi tìm kiếm
            const newUrl = getFilteredUrl();
            window.history.replaceState(null, '', newUrl);
        }
    });

    // Price range handler
    $('#priceRange').on('input', function() {
        const maxPrice = parseInt($(this).val());
        $('#maxPrice').text(formatPrice(maxPrice));
        $('#currentPrice').text(formatPrice(maxPrice));
        
        filteredProducts = products.filter(p => p.price <= maxPrice);
        currentPage = 1;
        loadProducts();
        updatePagination();
        
        // Cập nhật URL khi thay đổi khoảng giá
        const newUrl = getFilteredUrl();
        window.history.replaceState(null, '', newUrl);
    });

    // Clear filters
    $('#clearFilters, #resetFilters').click(function() {
        $('#searchInput').val('');
        $('#priceRange').val(50000000);
        $('#maxPrice').text('50.000.000đ');
        $('#currentPrice').text('50.000.000đ');
        $('.list-group-item').removeClass('active');
        $('.list-group-item[data-category="all"]').addClass('active');
        
        filteredProducts = [...products];
        currentPage = 1;
        loadProducts();
        updatePagination();
        
        // Cập nhật URL khi xóa bộ lọc
        window.history.replaceState(null, '', window.location.pathname);
    });

    // Add to wishlist
    $(document).on('click', '.add-to-wishlist', function() {
        const productId = parseInt($(this).data('product-id'));
        addToWishlist(productId);
    });
}

// Generate star rating HTML
function generateRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-warning"></i>';
        }
    }
    return stars;
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize wishlist buttons
function initializeWishlistButtons() {
    $('.add-to-wishlist').click(function() {
        const productId = parseInt($(this).data('product-id'));
        addToWishlist(productId);
    });
}

// Add to wishlist
function addToWishlist(productId) {
    console.log('Adding to wishlist product ID:', productId);
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('currentUser') !== null;
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true' || 
                   (localStorage.getItem('currentUser') && 
                    JSON.parse(localStorage.getItem('currentUser')).role === 'admin');
    
    if (isAdmin) {
        alert('Tài khoản admin không được sử dụng chức năng này!');
        return;
    }
    
    if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
        window.location.href = '../pages/login.html';
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
        alert('Sản phẩm đã có trong danh sách yêu thích!');
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
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
    
    alert('Đã thêm sản phẩm vào danh sách yêu thích!');
}

// Initialize cart buttons
function initializeCartButtons() {
    $('.add-to-cart').click(function() {
        const productId = parseInt($(this).data('product-id'));
        addToCart(productId);
    });
}

// Add to cart function
function addToCart(productId) {
    console.log('Adding to cart product ID:', productId);
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('currentUser') !== null;
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true' || 
                   (localStorage.getItem('currentUser') && 
                    JSON.parse(localStorage.getItem('currentUser')).role === 'admin');
    
    if (isAdmin) {
        alert('Tài khoản admin không được sử dụng chức năng này!');
        return;
    }
    
    if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        window.location.href = '../pages/login.html';
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
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        // Increment quantity if product already in cart
        existingProduct.quantity += 1;
    } else {
        // Add new product to cart with quantity 1
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
    
    alert('Đã thêm sản phẩm vào giỏ hàng!');
}

// Cập nhật số lượng sản phẩm trong mỗi danh mục
function updateCategoryCounts() {
    // Đếm số lượng sản phẩm trong mỗi danh mục
    const categoryCounts = {
        all: products.length,
        guitar: products.filter(p => p.category.toLowerCase().includes('guitar')).length,
        piano: products.filter(p => p.category.toLowerCase().includes('piano')).length,
        trong: products.filter(p => p.category.toLowerCase().includes('trống')).length,
        violin: products.filter(p => p.category.toLowerCase().includes('violin')).length,
        phukien: products.filter(p => p.category.toLowerCase().includes('phụ kiện')).length
    };
    
    // Cập nhật giao diện
    $('.list-group-item').each(function() {
        const category = $(this).data('category');
        const count = categoryCounts[category] || 0;
        
        // Thêm badge hiển thị số lượng
        if ($(this).find('.badge').length === 0) {
            $(this).append(`<span class="badge bg-secondary float-end">${count}</span>`);
        } else {
            $(this).find('.badge').text(count);
        }
    });
}

// Tạo HTML cho sản phẩm
function createProductHTML(product) {
    // Kiểm tra xem người dùng có phải là admin không
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true' || 
                   (localStorage.getItem('currentUser') && 
                    JSON.parse(localStorage.getItem('currentUser')).role === 'admin');
    
    // Tạo HTML khác nhau tùy thuộc vào vai trò người dùng
    const actionButtons = isAdmin 
        ? `
            <div class="d-flex justify-content-center mt-auto">
                <a href="/user/pages/product-detail.html?id=${product.id}" class="btn btn-outline-primary w-100">
                    <i class="fas fa-eye"></i> Chi tiết
                </a>
            </div>
          `
        : `
            <div class="d-flex flex-column gap-2 mt-auto">
                <div class="d-flex justify-content-between">
                    <a href="/user/pages/product-detail.html?id=${product.id}" class="btn btn-outline-primary">
                        <i class="fas fa-eye"></i> Chi tiết
                    </a>
                    <button class="btn btn-outline-danger add-to-wishlist" data-product-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <button class="btn btn-primary w-100 add-to-cart" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart me-1"></i> Thêm vào giỏ
                </button>
            </div>
          `;
    
    // Tạo thẻ hiển thị danh mục
    const categoryBadge = `<span class="badge bg-${getCategoryColorClass(product.category)}">${product.category}</span>`;
    
    // Tạo HTML cho sản phẩm
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card card h-100">
                <div class="product-image-container">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">${categoryBadge}</div>
                    <h5 class="card-title" title="${product.name}">${product.name}</h5>
                    <div class="product-rating mb-2">
                        ${generateRatingStars(product.rating)}
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>
                    <p class="price text-primary fw-bold mb-3">${formatPrice(product.price)}</p>
                    ${actionButtons}
                </div>
            </div>
        </div>
    `;
}

// Get category color class
function getCategoryColorClass(category) {
    const categoryMap = {
        'Piano': 'info',
        'Guitar': 'success',
        'Trống': 'warning',
        'Violin': 'danger',
        'Nhạc cụ hơi': 'primary',
        'Phụ kiện': 'secondary'
    };
    
    return categoryMap[category] || 'secondary';
} 