// Load header and footer
$(document).ready(function() {
    // Load header
    $("#header").load("/components/header.html", function() {
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
    });
    
    // Load footer
    $("#footer").load("/components/footer.html");
    
    // Load dialog
    $("#dialog").load("/components/dialog/dialog.html");

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '/pages/login.html';
        return;
    }

    // Initialize review functionality
    initializeStarRating();
    initializeReviewForm();
    
    // Handle submit all reviews button
    $('#submit-all-reviews').click(function() {
        submitAllReviews();
    });
});

// Initialize star rating
function initializeStarRating() {
    $(document).on('click', '.star-rating i', function() {
        const starValue = $(this).data('value');
        
        // Update visual state of stars
        $(this).parent().find('i').each(function(index) {
            if (index < starValue) {
                $(this).removeClass('far').addClass('fas');
            } else {
                $(this).removeClass('fas').addClass('far');
            }
        });
        
        // Update rating text
        $(this).parent().find('.rating-text').text(`(${starValue}/5)`);
        
        // Update hidden input with rating value
        $(this).closest('.review-product-item').find('.rating-value').val(starValue);
    });
}

// Initialize review form
function initializeReviewForm() {
    $(document).on('submit', '.review-form', function(e) {
        e.preventDefault();
        
        const productId = $(this).closest('.review-product-item').data('product-id');
        const rating = $(this).find('.rating-value').val();
        const comment = $(this).find('.review-comment').val();
        
        if (!rating || rating === '0') {
            Dialog.error('Vui lòng chọn số sao đánh giá!');
            return;
        }
        
        if (!comment) {
            Dialog.error('Vui lòng nhập nhận xét của bạn!');
            return;
        }
        
        // Save review
        saveReview(productId, rating, comment);
        
        // Show success message
        showSuccess($(this));
    });
}

// Save review to localStorage
function saveReview(productId, rating, comment) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Create review object
    const review = {
        productId: productId,
        userId: currentUser.id,
        userName: currentUser.name,
        rating: parseInt(rating),
        comment: comment,
        date: new Date().toISOString()
    };
    
    // Get existing reviews
    const reviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
    
    // Check if user already reviewed this product
    const existingReviewIndex = reviews.findIndex(r => 
        r.productId == productId && r.userId == currentUser.id
    );
    
    if (existingReviewIndex !== -1) {
        // Update existing review
        reviews[existingReviewIndex] = {
            ...reviews[existingReviewIndex],
            rating: parseInt(rating),
            comment: comment,
            date: new Date().toISOString()
        };
    } else {
        // Add new review
        reviews.push(review);
    }
    
    // Save to localStorage
    localStorage.setItem('productReviews', JSON.stringify(reviews));
    
    return true;
}

// Show success message
function showSuccess(form) {
    // Disable form
    form.find('button').prop('disabled', true);
    form.find('textarea').prop('disabled', true);
    form.find('.star-rating i').css('pointer-events', 'none');
    
    // Show checkmark on button
    form.find('button').html('<i class="fas fa-check"></i> Đã gửi đánh giá');
    
    // If all forms are completed, show success message
    const activeForms = $('.review-form').not(':has(button:disabled)');
    if (activeForms.length === 0) {
        // Hide review forms and show success message
        $('#review-success').fadeIn();
        
        // Hide submit all button
        $('#submit-all-reviews').hide();
    }
}

// Submit all reviews
function submitAllReviews() {
    const forms = $('.review-form').not(':has(button:disabled)');
    let allValid = true;
    
    forms.each(function() {
        const rating = $(this).find('.rating-value').val();
        const comment = $(this).find('.review-comment').val();
        
        if (!rating || rating === '0') {
            Dialog.error('Vui lòng chọn số sao đánh giá cho tất cả sản phẩm!');
            allValid = false;
            return false;
        }
        
        if (!comment) {
            Dialog.error('Vui lòng nhập nhận xét cho tất cả sản phẩm!');
            allValid = false;
            return false;
        }
    });
    
    if (allValid) {
        forms.each(function() {
            const productId = $(this).closest('.review-product-item').data('product-id');
            const rating = $(this).find('.rating-value').val();
            const comment = $(this).find('.review-comment').val();
            
            // Save review
            saveReview(productId, rating, comment);
            
            // Show success for this form
            showSuccess($(this));
        });
        
        // Show overall success message
        $('#review-success').fadeIn();
        
        // Scroll to success message
        $('html, body').animate({
            scrollTop: $('#review-success').offset().top - 100
        }, 500);
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true' || 
           localStorage.getItem('currentUser') !== null || 
           localStorage.getItem('isAdminLoggedIn') === 'true';
}

// Load order details
function loadOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderNumber.toString() === orderId.toString());
    
    if (!order) {
        showError('Không tìm thấy đơn hàng!');
        return;
    }
    
    // Display order details
    $('#order-number').text(order.orderNumber);
    
    const orderDate = new Date(order.date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    $('#order-date').text(orderDate);
    
    $('#order-status').text(order.status);
    $('#order-total').text(formatPrice(order.total));
    
    // Load products for review
    loadOrderProductsForReview(order);
}

// Show error message
function showError(message) {
    $('#review-container').html(`
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle me-2"></i>${message}
        </div>
        <div class="text-center mt-4">
            <a href="/pages/orders.html" class="btn btn-primary">
                <i class="fas fa-arrow-left me-2"></i>Quay lại đơn hàng
            </a>
        </div>
    `);
}

// Load products from an order for review
function loadOrderProductsForReview(order) {
    if (!order.items || order.items.length === 0) {
        showError('Đơn hàng không có sản phẩm nào!');
        return;
    }
    
    // Get existing reviews
    const reviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
    
    const productsHtml = order.items.map(item => {
        // Create a unique ID for the product's review form
        const formId = `review-form-${item.id}`;
        
        // Check if review already exists
        const existingReview = reviews.find(r => 
            r.productId == item.id && 
            r.orderId == order.orderNumber
        );
        
        return `
            <div class="review-section mb-4" data-product-id="${item.id}">
                <div class="row mb-4">
                    <div class="col-md-2 text-center">
                        <img src="${item.image}" alt="${item.name}" class="product-image mb-2">
                    </div>
                    <div class="col-md-10">
                        <h4>${item.name}</h4>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <p class="text-muted mb-1">Danh mục: ${item.category || 'Nhạc cụ'}</p>
                                <p class="mb-0"><strong>Đơn giá:</strong> ${formatPrice(item.price)} × ${item.quantity}</p>
                            </div>
                            <a href="/pages/product-detail.html?id=${item.id}" class="btn btn-outline-primary btn-sm">
                                <i class="fas fa-eye me-1"></i> Xem sản phẩm
                            </a>
                        </div>
                    </div>
                </div>
                
                ${existingReview ? `
                    <!-- Existing Review -->
                    <div class="existing-review">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5 class="mb-1">Đánh giá của bạn</h5>
                                <div class="star-display">
                                    ${generateStarRating(existingReview.rating)}
                                    <span class="ms-2">(${existingReview.rating}/5)</span>
                                </div>
                            </div>
                            <button class="btn btn-outline-primary btn-sm edit-review-btn" data-product-id="${item.id}">
                                <i class="fas fa-edit me-1"></i> Chỉnh sửa
                            </button>
                        </div>
                        <p class="review-comment mb-1">${existingReview.comment}</p>
                        <div class="review-date">Đã đánh giá vào: ${new Date(existingReview.date).toLocaleDateString('vi-VN')}</div>
                    </div>
                ` : `
                    <!-- Review Form -->
                    <form class="review-form" id="${formId}">
                        <input type="hidden" name="productId" value="${item.id}">
                        <input type="hidden" name="orderId" value="${order.orderNumber}">
                        <input type="hidden" class="rating-value" name="rating" value="0">
                        
                        <div class="mb-4">
                            <label class="form-label">Đánh giá của bạn:</label>
                            <div class="star-rating" data-form-id="${formId}">
                                <i class="far fa-star" data-value="1"></i>
                                <i class="far fa-star" data-value="2"></i>
                                <i class="far fa-star" data-value="3"></i>
                                <i class="far fa-star" data-value="4"></i>
                                <i class="far fa-star" data-value="5"></i>
                                <span class="ms-2 rating-text">(0/5)</span>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="comment-${item.id}" class="form-label">Nhận xét của bạn:</label>
                            <textarea class="form-control" id="comment-${item.id}" name="comment" rows="4" placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm..."></textarea>
                            <div class="invalid-feedback">Vui lòng nhập nhận xét của bạn.</div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane me-2"></i>Gửi đánh giá
                        </button>
                    </form>
                `}
            </div>
        `;
    }).join('');
    
    // Add a submit all button if there are multiple products without reviews
    const productsWithoutReviews = order.items.filter(item => 
        !reviews.some(r => r.productId == item.id && r.orderId == order.orderNumber)
    );
    
    let submitAllButton = '';
    if (productsWithoutReviews.length > 1) {
        submitAllButton = `
            <div class="text-center mt-4 mb-5">
                <button id="submit-all-reviews" class="btn btn-lg btn-primary">
                    <i class="fas fa-paper-plane me-2"></i>Gửi tất cả đánh giá
                </button>
            </div>
        `;
    }
    
    $('#review-container').html(productsHtml + submitAllButton);
    
    // Initialize star ratings
    initializeStarRatings();
    
    // Initialize review forms
    initializeReviewForms();
    
    // Initialize edit buttons
    initializeEditButtons(order);
    
    // Initialize submit all button
    $('#submit-all-reviews').on('click', function() {
        submitAllReviews();
    });
}

// Initialize star ratings
function initializeStarRatings() {
    // Handle star rating hover
    $('.star-rating i').hover(
        function() {
            const value = $(this).data('value');
            const starRating = $(this).parent();
            
            starRating.find('i').each(function(index) {
                if (index < value) {
                    $(this).addClass('fas').removeClass('far');
                } else {
                    $(this).addClass('far').removeClass('fas');
                }
            });
        },
        function() {
            const starRating = $(this).parent();
            const formId = starRating.data('form-id');
            const ratingValue = $(`#${formId} .rating-value`).val();
            
            starRating.find('i').each(function(index) {
                if (index < ratingValue) {
                    $(this).addClass('fas').removeClass('far');
                } else {
                    $(this).addClass('far').removeClass('fas');
                }
            });
        }
    );
    
    // Handle star rating click
    $('.star-rating i').on('click', function() {
        const value = $(this).data('value');
        const starRating = $(this).parent();
        const formId = starRating.data('form-id');
        
        // Update stars
        starRating.find('i').each(function(index) {
            if (index < value) {
                $(this).addClass('fas').removeClass('far');
            } else {
                $(this).addClass('far').removeClass('fas');
            }
        });
        
        // Update rating text
        starRating.find('.rating-text').text(`(${value}/5)`);
        
        // Update hidden input with rating value
        $(`#${formId} .rating-value`).val(value);
    });
}

// Initialize review forms
function initializeReviewForms() {
    $('.review-form').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const productId = form.find('input[name="productId"]').val();
        const orderId = form.find('input[name="orderId"]').val();
        const rating = form.find('.rating-value').val();
        const comment = form.find('textarea[name="comment"]').val();
        
        // Validate form
        let isValid = true;
        
        if (!rating || rating === '0') {
            alert('Vui lòng chọn số sao đánh giá!');
            isValid = false;
        }
        
        if (!comment.trim()) {
            form.find('textarea[name="comment"]').addClass('is-invalid');
            isValid = false;
        } else {
            form.find('textarea[name="comment"]').removeClass('is-invalid');
        }
        
        if (!isValid) return;
        
        // Save review
        if (saveProductReview(productId, orderId, rating, comment)) {
            // Show success message
            showSuccess(form);
        }
    });
}

// Initialize edit buttons
function initializeEditButtons(order) {
    $('.edit-review-btn').on('click', function() {
        const productId = $(this).data('product-id');
        const reviewSection = $(this).closest('.review-section');
        const existingReview = getExistingReview(productId, order.orderNumber);
        
        if (existingReview) {
            // Create form HTML
            const formId = `review-form-${productId}`;
            const formHtml = `
                <form class="review-form" id="${formId}">
                    <input type="hidden" name="productId" value="${productId}">
                    <input type="hidden" name="orderId" value="${order.orderNumber}">
                    <input type="hidden" class="rating-value" name="rating" value="${existingReview.rating}">
                    
                    <div class="mb-4">
                        <label class="form-label">Đánh giá của bạn:</label>
                        <div class="star-rating" data-form-id="${formId}">
                            <i class="${existingReview.rating >= 1 ? 'fas' : 'far'} fa-star" data-value="1"></i>
                            <i class="${existingReview.rating >= 2 ? 'fas' : 'far'} fa-star" data-value="2"></i>
                            <i class="${existingReview.rating >= 3 ? 'fas' : 'far'} fa-star" data-value="3"></i>
                            <i class="${existingReview.rating >= 4 ? 'fas' : 'far'} fa-star" data-value="4"></i>
                            <i class="${existingReview.rating >= 5 ? 'fas' : 'far'} fa-star" data-value="5"></i>
                            <span class="ms-2 rating-text">(${existingReview.rating}/5)</span>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="comment-${productId}" class="form-label">Nhận xét của bạn:</label>
                        <textarea class="form-control" id="comment-${productId}" name="comment" rows="4" placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm...">${existingReview.comment}</textarea>
                        <div class="invalid-feedback">Vui lòng nhập nhận xét của bạn.</div>
                    </div>
                    
                    <div class="d-flex justify-content-between">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save me-2"></i>Cập nhật đánh giá
                        </button>
                        <button type="button" class="btn btn-outline-secondary cancel-edit-btn">
                            <i class="fas fa-times me-2"></i>Hủy
                        </button>
                    </div>
                </form>
            `;
            
            // Replace the existing review with the form
            reviewSection.find('.existing-review').replaceWith(formHtml);
            
            // Initialize star ratings for the new form
            initializeStarRatings();
            
            // Initialize the new form
            initializeReviewForms();
            
            // Handle cancel button
            reviewSection.find('.cancel-edit-btn').on('click', function() {
                // Reload the page to reset the form
                location.reload();
            });
        }
    });
}

// Get existing review
function getExistingReview(productId, orderId) {
    const reviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
    return reviews.find(r => r.productId == productId && r.orderId == orderId);
}

// Save product review
function saveProductReview(productId, orderId, rating, comment) {
    // Get user information
    const userEmail = localStorage.getItem('userEmail');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Get orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderNumber.toString() === orderId.toString());
    
    if (!order) {
        console.error('Order not found for ID:', orderId);
        return false;
    }
    
    const review = {
        productId: parseInt(productId),
        orderId: order.orderNumber,
        userEmail: userEmail || (currentUser ? currentUser.email : 'anonymous'),
        userName: currentUser ? currentUser.name : 'Khách hàng',
        rating: parseInt(rating),
        comment,
        date: new Date().toISOString()
    };
    
    // Get existing reviews and add new one
    const reviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
    
    // Check if user already reviewed this product
    const existingReviewIndex = reviews.findIndex(r => 
        r.productId == productId && 
        r.orderId == order.orderNumber
    );
    
    if (existingReviewIndex !== -1) {
        // Update existing review
        reviews[existingReviewIndex] = {
            ...reviews[existingReviewIndex],
            rating: parseInt(rating),
            comment,
            date: new Date().toISOString()
        };
    } else {
        // Add new review
        reviews.push(review);
    }
    
    // Save reviews
    localStorage.setItem('productReviews', JSON.stringify(reviews));
    
    // Update product rating
    updateProductRating(productId);
    
    console.log('Review saved successfully');
    return true;
}

// Update product rating
function updateProductRating(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const reviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
    
    // Find all reviews for this product
    const productReviews = reviews.filter(r => r.productId == productId);
    
    if (productReviews.length > 0) {
        // Calculate average rating
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / productReviews.length;
        
        // Update product in storage
        const productIndex = products.findIndex(p => p.id == productId);
        if (productIndex !== -1) {
            products[productIndex].rating = averageRating;
            products[productIndex].reviewCount = productReviews.length;
            localStorage.setItem('products', JSON.stringify(products));
        }
    }
}

// Generate star rating HTML
function generateStarRating(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }
    return starsHtml;
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
} 