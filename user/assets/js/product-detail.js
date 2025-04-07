// Sample product data
const products = [
    {
        id: 1,
        name: 'Đàn Guitar Acoustic Yamaha F310',
        price: 3500000,
        image: '../assets/images/products/guitar-1.jpg',
        images: ['../assets/images/products/guitar-1.jpg', '../assets/images/products/guitar-2.jpg', '../assets/images/products/guitar-3.jpg'],
        category: 'Guitar',
        sku: 'YMH-F310',
        status: 'Còn hàng',
        rating: 4.5,
        reviewCount: 12,
        description: `Đàn Guitar Acoustic Yamaha F310 là một trong những cây đàn guitar được ưa chuộng nhất của Yamaha, phù hợp cho người mới bắt đầu học đàn guitar.

Đặc điểm nổi bật:
- Thùng đàn được làm từ gỗ Spruce (mặt trước) và gỗ Meranti (mặt sau và hông)
- Cần đàn làm từ gỗ Nato chắc chắn
- Mặt phím và ngựa đàn được làm từ gỗ Rosewood cao cấp
- Dây đàn D'Addario EXP11 chất lượng cao
- Độ vang tốt, âm thanh ấm áp
- Thiết kế đẹp mắt, tỉ mỉ trong từng chi tiết
- Phù hợp cho người mới học và người chơi có kinh nghiệm`,
        specifications: {
            'Thương hiệu': 'Yamaha',
            'Model': 'F310',
            'Xuất xứ': 'Indonesia',
            'Kiểu dáng': 'Dreadnought',
            'Mặt trước': 'Gỗ Spruce',
            'Mặt sau và hông': 'Gỗ Meranti',
            'Cần đàn': 'Gỗ Nato',
            'Mặt phím': 'Gỗ Rosewood',
            'Ngựa đàn': 'Gỗ Rosewood',
            'Dây đàn': "D'Addario EXP11",
            'Màu sắc': 'Nâu tự nhiên',
            'Số phím': '20 phím',
            'Chiều dài scale': '650mm',
            'Chiều rộng ngựa đàn': '43mm'
        },
        reviews: [
            {
                user: 'Nguyễn Văn A',
                rating: 5,
                date: '2024-03-15',
                comment: 'Đàn chất lượng tốt, âm thanh hay, rất phù hợp cho người mới học.'
            },
            {
                user: 'Trần Thị B',
                rating: 4,
                date: '2024-03-10',
                comment: 'Đàn đẹp, giao hàng nhanh, giá cả hợp lý.'
            }
        ]
    },
    {
        id: 2,
        name: 'Guitar Classic Yamaha C40',
        price: 3200000,
        image: '../assets/images/products/guitar-2.jpg',
        images: ['../assets/images/products/guitar-2.jpg', '../assets/images/products/guitar-1.jpg', '../assets/images/products/guitar-3.jpg'],
        category: 'Guitar',
        sku: 'YMH-C40',
        status: 'Còn hàng',
        rating: 4.7,
        reviewCount: 18,
        description: 'Guitar Classic Yamaha C40 là lựa chọn hoàn hảo cho người mới bắt đầu học đàn guitar. Với chất lượng âm thanh tuyệt vời và độ bền cao, đàn Yamaha C40 sẽ đồng hành cùng bạn trên hành trình âm nhạc.',
        specifications: {
            'Thương hiệu': 'Yamaha',
            'Model': 'C40',
            'Xuất xứ': 'Indonesia',
            'Kiểu dáng': 'Classic',
            'Mặt trước': 'Gỗ Spruce',
            'Mặt sau và hông': 'Gỗ Meranti',
            'Cần đàn': 'Gỗ Nato',
            'Mặt phím': 'Gỗ Rosewood',
            'Dây đàn': 'Nylon',
            'Số phím': '18 phím'
        }
    },
    {
        id: 3,
        name: 'Piano Yamaha C3X PE',
        price: 850000000,
        image: '../assets/images/products/piano-1.jpg',
        images: ['../assets/images/products/piano-1.jpg', '../assets/images/products/piano-2.jpg'],
        category: 'Piano',
        sku: 'YMH-C3X-PE',
        status: 'Còn hàng',
        rating: 5.0,
        reviewCount: 7,
        description: 'Piano Yamaha C3X PE là cây đàn grand piano cao cấp với âm thanh sâu lắng, rõ ràng và sống động. Thiết kế sang trọng với lớp sơn đen bóng quyến rũ, phù hợp cho biểu diễn chuyên nghiệp.',
        specifications: {
            'Thương hiệu': 'Yamaha',
            'Model': 'C3X PE',
            'Xuất xứ': 'Nhật Bản',
            'Chiều dài': '186cm',
            'Chiều rộng': '149cm',
            'Chiều cao': '101cm',
            'Trọng lượng': '320kg',
            'Số phím': '88 phím',
            'Pedal': '3 pedal',
            'Màu sắc': 'Đen bóng (Polished Ebony)'
        }
    },
    {
        id: 4,
        name: 'Trống Pearl Decade Maple',
        price: 25000000,
        image: '../assets/images/products/drum-1.jpg',
        images: ['../assets/images/products/drum-1.jpg', '../assets/images/products/drum-2.jpg'],
        category: 'Trống',
        sku: 'PRL-DMP925',
        status: 'Còn hàng',
        rating: 4.6,
        reviewCount: 9,
        description: 'Bộ trống Pearl Decade Maple với chất lượng âm thanh vượt trội, được làm từ gỗ maple cao cấp, mang đến âm thanh ấm áp, sống động và đầy sức mạnh.',
        specifications: {
            'Thương hiệu': 'Pearl',
            'Model': 'Decade Maple',
            'Xuất xứ': 'Đài Loan',
            'Chất liệu': 'Gỗ Maple',
            'Bao gồm': 'Bass drum 22", Tom 10", Tom 12", Floor Tom 16", Snare 14"',
            'Màu sắc': 'Satin Brown Burst'
        }
    },
    {
        id: 5,
        name: 'Đàn Violin Yamaha V5SA',
        price: 12000000,
        image: '../assets/images/products/violin-1.jpg',
        images: ['../assets/images/products/violin-1.jpg', '../assets/images/products/violin-2.jpg'],
        category: 'Violin',
        sku: 'YMH-V5SA',
        status: 'Còn hàng',
        rating: 4.8,
        reviewCount: 11,
        description: 'Đàn Violin Yamaha V5SA được làm thủ công từ gỗ vân sam cao cấp, mang đến âm thanh ấm áp, trong trẻo và độ cộng hưởng tuyệt vời.',
        specifications: {
            'Thương hiệu': 'Yamaha',
            'Model': 'V5SA',
            'Xuất xứ': 'Nhật Bản',
            'Mặt trên': 'Gỗ vân sam (Spruce) đặc biệt chọn lọc',
            'Mặt dưới và hông': 'Gỗ phong (Maple)',
            'Cần đàn': 'Gỗ phong',
            'Kích thước': '4/4 (full size)',
            'Phụ kiện kèm theo': 'Hộp đựng, cần kéo, nhựa thông'
        }
    }
];

// Fallback product images
const fallbackImages = {
    'Guitar': '../assets/images/products/guitar-1.jpg',
    'Piano': '../assets/images/products/piano-1.jpg',
    'Trống': '../assets/images/products/drum-1.jpg',
    'Violin': '../assets/images/products/violin-1.jpg',
    'default': '../assets/images/products/default.jpg'
};

// Load header and footer
$(document).ready(function() {
    console.log("Document ready");
    
    $("#header").load("/components/header.html", function() {
        console.log("Header loaded");
        // After header is loaded, check login status and update UI
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
    });
    
    $("#footer").load("/components/footer.html", function() {
        console.log("Footer loaded");
    });
    
    // Get product id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    console.log("Product ID from URL:", productId);
    
    if (productId) {
        // Force a small delay to ensure DOM is ready
        setTimeout(() => {
            console.log("Loading product details for ID:", productId);
            loadProductDetails(productId);
        }, 100);
    } else {
        console.error("No product ID found in URL");
        $('#product-detail').html('<div class="alert alert-danger">Không tìm thấy ID sản phẩm</div>');
    }
});

// Load product details
function loadProductDetails(productId) {
    // Find product by ID
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
        $('#product-detail').html('<div class="alert alert-danger">Sản phẩm không tồn tại</div>');
        return;
    }
    
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true' || 
                    (localStorage.getItem('currentUser') && 
                     JSON.parse(localStorage.getItem('currentUser')).role === 'admin');
    
    // Generate fallback image URL
    const getFallbackImage = (product) => {
        if (product.image) return product.image;
        return product.category ? fallbackImages[product.category] || fallbackImages.default : fallbackImages.default;
    };
    
    // Set page title
    document.title = `${product.name} - Music Store`;
    
    // Create product images slider
    let imagesHtml = '';
    if (product.images && product.images.length > 0) {
        const mainImage = product.images[0];
        
        // Main image with magnifier glass icon overlay
        const imageHtml = `
            <div class="product-main-image mb-3 position-relative">
                <img src="${mainImage}" alt="${product.name}" class="img-fluid rounded" id="main-product-image">
                <button class="zoom-image-btn position-absolute top-0 end-0 btn btn-light rounded-circle m-2" title="Phóng to ảnh">
                    <i class="fas fa-search-plus"></i>
                </button>
            </div>
        `;
        
        // Thumbnails
        const thumbnailsHtml = `
            <div class="product-thumbnails d-flex overflow-auto">
                ${product.images.map((img, index) => `
                    <div class="product-thumbnail-item me-2 ${index === 0 ? 'active' : ''}">
                        <img src="${img}" alt="Thumbnail ${index + 1}" class="img-thumbnail product-thumbnail" data-image="${img}" style="width: 80px; height: 80px; object-fit: cover;">
                    </div>
                `).join('')}
            </div>
        `;
        
        imagesHtml = imageHtml + thumbnailsHtml;
    } else {
        // Fallback image
        imagesHtml = `
            <div class="product-main-image position-relative">
                <img src="${getFallbackImage(product)}" alt="${product.name}" class="img-fluid rounded">
                <button class="zoom-image-btn position-absolute top-0 end-0 btn btn-light rounded-circle m-2" title="Phóng to ảnh">
                    <i class="fas fa-search-plus"></i>
                </button>
            </div>
        `;
    }
    
    // HTML for the product detail page
    const productHtml = `
        <div class="row">
            <div class="col-md-6">
                ${imagesHtml}
            </div>
            <div class="col-md-6">
                <h1 class="product-title">${product.name}</h1>
                <div class="product-meta mb-3">
                    <span class="badge bg-primary me-2">${product.category}</span>
                    <div class="product-rating d-inline-block">
                        ${generateRatingStars(product.rating)}
                        <span class="text-muted ms-2">(${product.reviewCount} đánh giá)</span>
                    </div>
                </div>
                <div class="product-price mb-3">
                    <span class="price-value">${formatPrice(product.price)}</span>
                </div>
                <div class="product-info mb-4">
                    <div><strong>Mã sản phẩm:</strong> <span>${product.sku || 'N/A'}</span></div>
                    <div><strong>Tình trạng:</strong> <span class="text-success">${product.status || 'Còn hàng'}</span></div>
                </div>
                
                ${isAdmin ? 
                    `<!-- Admin message -->
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        Tài khoản admin không thể thêm sản phẩm vào giỏ hàng hoặc danh sách yêu thích
                    </div>` 
                    : 
                    `<!-- Add to cart section -->
                    <div class="add-to-cart-section mb-4">
                        <div class="d-flex align-items-center mb-3">
                            <div class="me-3">
                                <label for="quantity" class="form-label mb-0">Số lượng:</label>
                            </div>
                            <div class="quantity-control d-flex">
                                <button id="decrease-quantity" class="btn btn-outline-secondary">-</button>
                                <input type="number" id="quantity" class="form-control text-center mx-2" value="1" min="1" style="width: 60px;">
                                <button id="increase-quantity" class="btn btn-outline-secondary">+</button>
                            </div>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button id="add-to-cart" class="btn btn-primary flex-grow-1">
                                <i class="fas fa-shopping-cart me-2"></i>Thêm vào giỏ
                            </button>
                            <button id="add-to-wishlist" class="btn btn-outline-danger">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>`
                }
            </div>
        </div>
        
        <!-- Specifications and Reviews tabs -->
        <div class="product-tabs mt-5">
            <ul class="nav nav-tabs" id="productTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab">Mô tả</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="specs-tab" data-bs-toggle="tab" data-bs-target="#specs" type="button" role="tab">Thông số kỹ thuật</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">Đánh giá</button>
                </li>
            </ul>
            <div class="tab-content p-4 border border-top-0 rounded-bottom" id="productTabsContent">
                <div class="tab-pane fade show active" id="description" role="tabpanel">
                    <div class="product-description-content">
                        ${product.description ? product.description.replace(/\n/g, '<br>') : 'Không có mô tả'}
                    </div>
                </div>
                <div class="tab-pane fade" id="specs" role="tabpanel">
                    ${generateSpecificationsTable(product)}
                </div>
                <div class="tab-pane fade" id="reviews" role="tabpanel">
                    ${generateReviewsSection(product)}
                </div>
            </div>
        </div>
    `;
    
    // Update the product detail container
    $('#product-detail').html(productHtml);
    
    // Initialize event handlers after DOM is updated
    
    // Thumbnail click handlers
    $('.product-thumbnail').click(function() {
        const newImageSrc = $(this).data('image');
        $('#main-product-image').attr('src', newImageSrc);
        $('.product-thumbnail-item').removeClass('active');
        $(this).parent().addClass('active');
    });
    
    // Image zoom functionality
    $('.zoom-image-btn').click(function() {
        const currentImage = $('#main-product-image').attr('src');
        
        // Create modal with zoomed image
        const zoomModal = `
            <div class="modal fade" id="imageZoomModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${product.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img src="${currentImage}" class="img-fluid" style="max-height: 80vh;" alt="${product.name}">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        $('body').append(zoomModal);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('imageZoomModal'));
        modal.show();
        
        // Remove modal from DOM after it's hidden
        $('#imageZoomModal').on('hidden.bs.modal', function() {
            $(this).remove();
        });
    });
    
    // Only initialize these handlers for non-admin users
    if (!isAdmin) {
        // Quantity buttons
        $('#decrease-quantity').click(function() {
            let quantity = parseInt($('#quantity').val());
            if (quantity > 1) {
                $('#quantity').val(quantity - 1);
            }
        });
        
        $('#increase-quantity').click(function() {
            let quantity = parseInt($('#quantity').val());
            $('#quantity').val(quantity + 1);
        });
        
        // Add to cart button
        $('#add-to-cart').click(function() {
            addToCart(product.id);
        });
        
        // Add to wishlist button
        $('#add-to-wishlist').click(function() {
            addToWishlist(product.id);
        });
        
        // Check if product is in cart or wishlist
        checkIfInCartOrWishlist(product.id);
    }
    
    // Load related products
    loadRelatedProducts(product.id);
}

// Hàm tạo HTML cho rating stars
function generateRatingStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            html += '<i class="fas fa-star text-warning"></i>';
        } else if (i - 0.5 <= rating) {
            html += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            html += '<i class="far fa-star text-warning"></i>';
        }
    }
    return html;
}

// Hàm tạo bảng thông số kỹ thuật
function generateSpecificationsTable(product) {
    if (!product.specifications || Object.keys(product.specifications).length === 0) {
        return '<p class="text-muted">Không có thông số kỹ thuật.</p>';
    }
    
    const specRows = Object.entries(product.specifications).map(([key, value]) => `
        <tr>
            <th scope="row" style="width: 30%">${key}</th>
            <td>${value}</td>
        </tr>
    `).join('');
    
    return `
        <table class="table table-striped">
            <tbody>
                ${specRows}
            </tbody>
        </table>
    `;
}

// Hàm tạo phần đánh giá
function generateReviewsSection(product) {
    if (!product.reviews || product.reviews.length === 0) {
        return '<p class="text-center text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>';
    }
    
    const reviewItems = product.reviews.map(review => `
        <div class="review-item pb-3 mb-3 border-bottom">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="reviewer-info">
                    <h6 class="mb-0">${review.user}</h6>
                    <small class="text-muted">${review.date}</small>
                </div>
                <div class="review-rating">
                    ${generateRatingStars(review.rating)}
                </div>
            </div>
            <p class="mb-0">${review.comment}</p>
        </div>
    `).join('');
    
    return `
        <div class="reviews-container">
            <div class="average-rating mb-4">
                <h5>Đánh giá trung bình</h5>
                <div class="d-flex align-items-center">
                    <div class="h3 mb-0 me-2">${product.rating}</div>
                    <div>
                        ${generateRatingStars(product.rating)}
                        <div class="text-muted small">${product.reviewCount} đánh giá</div>
                    </div>
                </div>
            </div>
            <h5>Tất cả đánh giá</h5>
            <div class="reviews-list">
                ${reviewItems}
            </div>
        </div>
    `;
}

// Load related products
function loadRelatedProducts(productId) {
    const currentProduct = products.find(p => p.id === parseInt(productId));
    if (!currentProduct) return;

    // Find products in the same category (excluding current product)
    let relatedProducts = products.filter(p => p.category === currentProduct.category && p.id !== parseInt(productId));
    
    // If not enough products in the same category, add some from other categories
    if (relatedProducts.length < 4) {
        const otherProducts = products.filter(p => p.category !== currentProduct.category && p.id !== parseInt(productId));
        relatedProducts = [...relatedProducts, ...otherProducts].slice(0, 4);
    } else {
        relatedProducts = relatedProducts.slice(0, 4);
    }
    
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true' || 
                   (localStorage.getItem('currentUser') && 
                    JSON.parse(localStorage.getItem('currentUser')).role === 'admin');

    // Generate HTML for related products
    if (relatedProducts.length > 0) {
        const relatedProductsHtml = relatedProducts.map(product => {
            // Different card footer based on user role
            const cardFooter = isAdmin 
                ? `<div class="text-muted small mt-2">Tài khoản admin không thể thêm sản phẩm</div>`
                : `<div class="d-flex justify-content-between">
                    <button class="btn btn-sm btn-outline-primary related-add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                    </button>
                    <button class="btn btn-sm btn-outline-danger related-add-to-wishlist" data-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                  </div>`;
                  
            return `
                <div class="col-md-3 col-6 mb-4">
                    <div class="card h-100 product-card">
                        <a href="product-detail.html?id=${product.id}" class="product-link">
                            <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                        </a>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title product-name">
                                <a href="product-detail.html?id=${product.id}" class="text-dark text-decoration-none">
                                    ${product.name}
                                </a>
                            </h5>
                            <div class="mb-2">
                                ${generateRatingStars(product.rating)}
                            </div>
                            <p class="card-text text-primary fw-bold product-price mt-auto">${formatPrice(product.price)}</p>
                            ${cardFooter}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add to page
        $('#related-products').html(`
            <h3 class="mb-4">Sản phẩm liên quan</h3>
            <div class="row">
                ${relatedProductsHtml}
            </div>
        `);

        // Only add event handlers if not admin
        if (!isAdmin) {
            // Add event handlers for related products
            $('.related-add-to-cart').click(function(e) {
                e.preventDefault();
                const id = parseInt($(this).data('id'));
                addToCart(id, 1); // Default quantity 1
            });

            $('.related-add-to-wishlist').click(function(e) {
                e.preventDefault();
                const id = parseInt($(this).data('id'));
                addToWishlist(id);
            });
        }
    }
}

// Kiểm tra xem sản phẩm đã có trong giỏ hàng hoặc yêu thích chưa
function checkIfInCartOrWishlist(productId) {
    // Kiểm tra giỏ hàng
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    const isInCart = cart.some(item => item.id === productId);
    
    // Kiểm tra yêu thích
    const wishlist = localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')) : [];
    const isInWishlist = wishlist.some(item => item.id === productId);
    
    // Cập nhật giao diện
    if (isInCart) {
        $('#add-to-cart').html('<i class="fas fa-check me-1"></i> Đã thêm vào giỏ');
        $('#add-to-cart').addClass('btn-success').removeClass('btn-primary');
    }
    
    if (isInWishlist) {
        $('#add-to-wishlist').html('<i class="fas fa-check"></i>');
        $('#add-to-wishlist').addClass('btn-success').removeClass('btn-outline-danger');
    }
}

// Add to cart
function addToCart(productId, defaultQuantity = null) {
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
        showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        setTimeout(() => {
            window.location.href = '/pages/login.html';
        }, 2000);
        return;
    }
    
    // Find product
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Get quantity
    let quantity = 1;
    if (defaultQuantity) {
        quantity = parseInt(defaultQuantity);
    } else {
        const quantityInput = $('#quantity');
        if (quantityInput.length) {
            quantity = parseInt(quantityInput.val());
            if (isNaN(quantity) || quantity < 1) {
                quantity = 1;
            }
        }
    }
    
    // Get current cart
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        // Increment quantity if already in cart
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Add new product with specified quantity
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Update button state
    $('#add-to-cart').addClass('added').html('<i class="fas fa-check me-2"></i>Đã thêm vào giỏ');
    
    // Show success message
    showToast('Sản phẩm đã được thêm vào giỏ hàng');
    
    // Reset button after 3 seconds
    setTimeout(() => {
        $('#add-to-cart').removeClass('added').html('<i class="fas fa-shopping-cart me-2"></i>Thêm vào giỏ');
    }, 3000);
}

// Add to wishlist
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
        showToast('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
        setTimeout(() => {
            window.location.href = '/pages/login.html';
        }, 2000);
        return;
    }
    
    // Find product
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Get current wishlist
    const wishlist = localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')) : [];
    
    // Check if product already exists in wishlist
    if (wishlist.some(item => item.id === product.id)) {
        showToast('Sản phẩm đã có trong danh sách yêu thích');
        
        // Update button state
        $('#add-to-wishlist').addClass('active').html('<i class="fas fa-heart"></i>');
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
    
    // Update button state
    $('#add-to-wishlist').addClass('active').html('<i class="fas fa-heart"></i>');
    
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

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

// Show toast notification
function showToast(message) {
    // Get toast element
    const toastEl = $('#toast');
    
    // Set message
    toastEl.find('.toast-body').text(message);
    
    // Create Bootstrap toast instance
    const toast = new bootstrap.Toast(toastEl);
    
    // Show toast
    toast.show();
}