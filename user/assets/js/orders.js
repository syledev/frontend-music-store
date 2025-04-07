$(document).ready(function() {
    // Load header and footer
    $("#header").load("/components/header.html", function() {
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
    });
    $("#footer").load("/components/footer.html");
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load orders
    loadOrders();
    
    // Setup review modal
    setupReviewModal();
    
    // Event listeners
    $('#search-btn').click(function() {
        loadOrders();
    });
    
    $('#search-order').on('keyup', function(e) {
        if (e.key === 'Enter') {
            loadOrders();
        }
    });
    
    $('#filter-status').change(function() {
        loadOrders();
    });
    
    // View order details
    $(document).on('click', '.view-order', function() {
        const orderId = $(this).data('id');
        showOrderDetails(orderId);
    });
    
    // Confirm order receipt
    $(document).on('click', '#confirm-receipt', function() {
        const orderId = $(this).data('id');
        confirmReceipt(orderId);
    });

    // Handle reorder - use event delegation for dynamic elements
    $(document).on('click', '.btn-outline-success', function() {
        const orderId = $(this).data('order-id');
        reorderItems(orderId);
    });
});

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true' || 
           localStorage.getItem('currentUser') !== null || 
           localStorage.getItem('isAdminLoggedIn') === 'true';
}

// Load orders
function loadOrders() {
    const orders = getOrders();
    const searchTerm = $('#search-order').val().toLowerCase();
    const filterStatus = $('#filter-status').val();
    
    // Filter orders
    let filteredOrders = orders;
    
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
            order.orderNumber.toString().includes(searchTerm) ||
            (order.shippingInfo && order.shippingInfo.fullName.toLowerCase().includes(searchTerm))
        );
    }
    
    if (filterStatus !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
    }
    
    // Sort orders by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display orders
    const ordersContainer = $('#orders-container');
    
    if (filteredOrders.length === 0) {
        if (orders.length === 0) {
            $('#empty-orders').show();
        } else {
            ordersContainer.html(`
                <div class="alert alert-info text-center">
                    Không tìm thấy đơn hàng nào phù hợp với tìm kiếm của bạn.
                </div>
            `);
            $('#empty-orders').hide();
        }
        return;
    }
    
    $('#empty-orders').hide();
    
    const ordersHtml = filteredOrders.map(order => {
        // Get the status badge class
        let statusClass = 'bg-secondary';
        switch(order.status) {
            case 'Đang xử lý':
                statusClass = 'bg-warning text-dark';
                break;
            case 'Đã xác nhận':
                statusClass = 'bg-info text-dark';
                break;
            case 'Đang giao hàng':
                statusClass = 'bg-primary';
                break;
            case 'Đã giao':
                statusClass = 'bg-success';
                break;
            case 'Đã hủy':
                statusClass = 'bg-danger';
                break;
            case 'Đã thanh toán':
                statusClass = 'bg-info';
                break;
        }
        
        // Format date
        const orderDate = new Date(order.date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Create order items preview
        const itemsPreview = order.items.slice(0, 2).map(item => 
            `<div class="d-flex align-items-center mb-2">
                <img src="${item.image}" alt="${item.name}" class="me-2" style="width: 40px; height: 40px; object-fit: cover;">
                <div>
                    <small class="d-block">${item.name}</small>
                    <small class="text-muted">SL: ${item.quantity} x ${formatPrice(item.price)}</small>
                </div>
            </div>`
        ).join('');
        
        // Add "and X more items" if there are more than 2 items
        const moreItemsText = order.items.length > 2 
            ? `<small class="text-muted">và ${order.items.length - 2} sản phẩm khác</small>` 
            : '';
        
        return `
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <span class="fw-bold">Đơn hàng #${order.orderNumber}</span>
                            <span class="ms-2 badge ${statusClass}">${order.status}</span>
                        </div>
                        <div class="col-md-6 text-md-end">
                            <small class="text-muted">${orderDate}</small>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="order-items-list">
                                ${itemsPreview}
                                ${moreItemsText}
                            </div>
                        </div>
                        <div class="col-md-4 border-start">
                            <div class="d-flex flex-column h-100 justify-content-between">
                                <div>
                                    <p class="mb-1"><strong>Tổng tiền:</strong> ${formatPrice(order.total)}</p>
                                    <p class="mb-1"><strong>Thanh toán:</strong> ${getPaymentMethodText(order.paymentMethod)}</p>
                                    <p class="mb-3"><strong>Người nhận:</strong> ${order.shippingInfo?.fullName || 'N/A'}</p>
                                </div>
                                <div class="text-end">
                                    <button class="btn btn-outline-primary btn-sm view-order" data-id="${order.id}" data-bs-toggle="modal" data-bs-target="#orderDetailModal">
                                        <i class="fas fa-eye me-1"></i> Xem chi tiết
                                    </button>
                                    ${order.status === 'Đang giao hàng' ? `
                                        <button class="btn btn-success btn-sm confirm-receipt" data-id="${order.id}">
                                            <i class="fas fa-check me-1"></i> Đã nhận hàng
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    ordersContainer.html(ordersHtml);
}

// Show order details
function showOrderDetails(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id.toString() === orderId.toString());
    
    if (!order) {
        alert('Không tìm thấy đơn hàng!');
        return;
    }
    
    // Format date
    const orderDate = new Date(order.date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Update modal content
    $('#modal-order-id').text(order.orderNumber);
    $('#detail-order-number').text(order.orderNumber);
    $('#detail-order-date').text(orderDate);
    $('#detail-payment-method').text(getPaymentMethodText(order.paymentMethod));
    $('#detail-order-total').text(formatPrice(order.total));
    
    // Order status
    let statusClass = 'bg-secondary';
    switch(order.status) {
        case 'Đang xử lý':
            statusClass = 'bg-warning text-dark';
            break;
        case 'Đã xác nhận':
            statusClass = 'bg-info text-dark';
            break;
        case 'Đang giao hàng':
            statusClass = 'bg-primary';
            break;
        case 'Đã giao':
            statusClass = 'bg-success';
            break;
        case 'Đã hủy':
            statusClass = 'bg-danger';
            break;
        case 'Đã thanh toán':
            statusClass = 'bg-info';
            break;
    }
    $('#detail-order-status').text(order.status).removeClass().addClass(`badge ${statusClass}`);
    
    // Show or hide "Confirm Receipt" button
    if (order.status === 'Đang giao hàng') {
        $('#confirm-receipt-container').show();
        $('#confirm-receipt').data('id', order.id);
    } else {
        $('#confirm-receipt-container').hide();
    }
    
    // Order items
    const orderItemsHtml = order.items.map(item => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="me-2" style="width: 50px; height: 50px; object-fit: cover;">
                    <div>
                        <div>${item.name}</div>
                        <small class="text-muted">${item.category}</small>
                    </div>
                </div>
            </td>
            <td>${formatPrice(item.price)}</td>
            <td>${item.quantity}</td>
            <td>${formatPrice(item.price * item.quantity)}</td>
        </tr>
    `).join('');
    
    $('#detail-order-items').html(orderItemsHtml);
    $('#detail-subtotal').text(formatPrice(order.subtotal));
    $('#detail-shipping').text(formatPrice(order.shipping));
    $('#detail-total').text(formatPrice(order.total));
    
    // Shipping info
    $('#detail-recipient').text(order.shippingInfo?.fullName || 'N/A');
    $('#detail-phone').text(order.shippingInfo?.phone || 'N/A');
    $('#detail-address').text(
        `${order.shippingInfo?.address || ''}, 
         ${order.shippingInfo?.ward || ''}, 
         ${order.shippingInfo?.district || ''}, 
         ${order.shippingInfo?.province || ''}`
    );
    $('#detail-note').text(order.shippingInfo?.note || 'Không có');
    
    // Order timeline
    generateOrderTimeline(order);
}

// Generate order timeline
function generateOrderTimeline(order) {
    const timelineSteps = [
        { status: 'Đang xử lý', icon: 'fa-clipboard-list', text: 'Đơn hàng đã được đặt' },
        { status: 'Đã xác nhận', icon: 'fa-check-circle', text: 'Đơn hàng đã được xác nhận' },
        { status: 'Đang giao hàng', icon: 'fa-shipping-fast', text: 'Đơn hàng đang được giao' },
        { status: 'Đã giao', icon: 'fa-box-open', text: 'Đơn hàng đã giao thành công' }
    ];
    
    // Order status progress
    const statusIndex = {
        'Đang xử lý': 0,
        'Đã thanh toán': 0,
        'Đã xác nhận': 1,
        'Đang giao hàng': 2,
        'Đã giao': 3,
        'Đã hủy': -1
    };
    
    const currentStatusIndex = statusIndex[order.status];
    
    const timelineHtml = timelineSteps.map((step, index) => {
        let stepClass = '';
        if (currentStatusIndex === -1) {
            stepClass = 'text-muted'; // Order cancelled
        } else if (index < currentStatusIndex) {
            stepClass = 'completed'; // Previous steps
        } else if (index === currentStatusIndex) {
            stepClass = 'active'; // Current step
        }
        
        return `
            <div class="order-step d-flex align-items-start mb-3 ${stepClass}">
                <div class="order-step-marker">
                    <i class="fas ${step.icon}"></i>
                </div>
                <div>
                    <div class="fw-bold">${step.status}</div>
                    <div class="text-muted">${step.text}</div>
                    ${index === currentStatusIndex && order.status !== 'Đã hủy' ? 
                        `<small class="text-primary">Trạng thái hiện tại</small>` : ''}
                </div>
            </div>
        `;
    });
    
    // Add cancelled status if order is cancelled
    if (order.status === 'Đã hủy') {
        timelineHtml.push(`
            <div class="order-step d-flex align-items-start mb-3 active">
                <div class="order-step-marker bg-danger">
                    <i class="fas fa-times"></i>
                </div>
                <div>
                    <div class="fw-bold">Đã hủy</div>
                    <div class="text-muted">Đơn hàng đã bị hủy</div>
                    <small class="text-danger">Trạng thái hiện tại</small>
                </div>
            </div>
        `);
    }
    
    $('#order-timeline').html(timelineHtml.join(''));
}

// Confirm receipt
function confirmReceipt(orderId) {
    if (confirm('Bạn xác nhận đã nhận được hàng?')) {
        const orders = getOrders();
        const orderIndex = orders.findIndex(o => o.id.toString() === orderId.toString());
        
        if (orderIndex === -1) {
            alert('Không tìm thấy đơn hàng!');
            return;
        }
        
        // Update order status
        orders[orderIndex].status = 'Đã giao';
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Update UI
        loadOrders();
        $('#orderDetailModal').modal('hide');
        
        alert('Cảm ơn bạn đã xác nhận! Đơn hàng đã được đánh dấu là đã giao thành công.');
    }
}

// Get orders from localStorage
function getOrders() {
    return localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

// Get payment method text
function getPaymentMethodText(method) {
    switch(method) {
        case 'cod':
            return 'Thanh toán khi nhận hàng';
        case 'banking':
            return 'Chuyển khoản ngân hàng';
        case 'momo':
            return 'Ví điện tử MoMo';
        case 'online':
            return 'Thanh toán trực tuyến';
        default:
            return method;
    }
}

// Event delegation for confirm receipt button in order list
$(document).on('click', '.confirm-receipt', function(e) {
    e.stopPropagation(); // Prevent opening modal
    const orderId = $(this).data('id');
    confirmReceipt(orderId);
});

// Modal review for products
function setupReviewModal() {
    // Add the modal to the page if it doesn't exist
    if (!$('#reviewModal').length) {
        $('body').append(`
            <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="reviewModalLabel">Đánh giá sản phẩm</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="review-products">
                                <!-- Products will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    // Handle review button click
    $(document).on('click', '.review-order-btn', function() {
        const orderId = $(this).data('order-id');
        loadOrderProductsForReview(orderId);
        const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
        reviewModal.show();
    });

    // Handle star rating click
    $(document).on('click', '.star-rating i', function() {
        const starValue = $(this).data('value');
        const productId = $(this).closest('.review-product-item').data('product-id');
        
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

    // Handle review form submission
    $(document).on('submit', '.review-form', function(e) {
        e.preventDefault();
        const productId = $(this).closest('.review-product-item').data('product-id');
        const rating = $(this).find('.rating-value').val();
        const comment = $(this).find('.review-comment').val();
        
        if (saveProductReview(productId, rating, comment)) {
            // Visual feedback
            $(this).find('.submit-review-btn').prop('disabled', true).html('<i class="fas fa-check"></i> Đã gửi đánh giá');
            $(this).find('.review-comment').prop('disabled', true);
            $(this).find('.star-rating i').css('pointer-events', 'none');
            
            // Show success message
            const successMsg = $('<div class="alert alert-success mt-2">Cảm ơn bạn đã đánh giá sản phẩm!</div>');
            $(this).append(successMsg);
            
            // Update product card after a short delay
            setTimeout(() => {
                const orderId = $('.review-order-btn').data('order-id');
                loadOrderProductsForReview(orderId);
            }, 2000);
        }
    });
}

// Load products from an order for review
function loadOrderProductsForReview(orderId) {
    console.log('Loading products for review from order:', orderId);
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderNumber.toString() === orderId.toString());
    
    if (!order) {
        console.error('Order not found:', orderId);
        $('#review-products').html('<div class="alert alert-danger">Không tìm thấy đơn hàng!</div>');
        return;
    }
    
    if (!order.items || order.items.length === 0) {
        console.error('No items in order:', orderId);
        $('#review-products').html('<div class="alert alert-info">Đơn hàng không có sản phẩm nào!</div>');
        return;
    }
    
    // Get existing reviews
    const reviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
    
    const productsHtml = order.items.map(item => {
        // Check if review already exists
        const existingReview = reviews.find(r => 
            r.productId == item.id && 
            r.orderId == order.orderNumber
        );
        
        if (existingReview) {
            // Show existing review
            return `
                <div class="review-product-item card mb-3" data-product-id="${item.id}">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;" class="me-3 rounded">
                            <div>
                                <h5>${item.name}</h5>
                                <p class="text-muted mb-0">${formatPrice(item.price)} × ${item.quantity}</p>
                            </div>
                        </div>
                        <div class="alert alert-info">
                            <div class="d-flex align-items-center mb-2">
                                <span class="text-warning">
                                    ${Array(5).fill().map((_, i) => 
                                        i < existingReview.rating ? 
                                            '<i class="fas fa-star"></i>' : 
                                            '<i class="far fa-star"></i>'
                                    ).join('')}
                                </span>
                                <span class="ms-2">(${existingReview.rating}/5)</span>
                            </div>
                            <p class="mb-0">${existingReview.comment}</p>
                            <div class="text-muted mt-1 small">Đã đánh giá vào: ${new Date(existingReview.date).toLocaleDateString('vi-VN')}</div>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-outline-primary btn-sm edit-review-btn" data-product-id="${item.id}">
                                <i class="fas fa-edit"></i> Chỉnh sửa đánh giá
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Form for new review
        return `
            <div class="review-product-item card mb-3" data-product-id="${item.id}">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;" class="me-3 rounded">
                        <div>
                            <h5>${item.name}</h5>
                            <p class="text-muted mb-0">${formatPrice(item.price)} × ${item.quantity}</p>
                        </div>
                    </div>
                    <form class="review-form">
                        <input type="hidden" class="rating-value" value="0">
                        <div class="mb-3">
                            <label class="form-label">Đánh giá của bạn:</label>
                            <div class="star-rating">
                                <div class="d-flex align-items-center mb-3">
                                    <i class="far fa-star fa-lg text-warning" data-value="1" style="cursor: pointer; margin-right: 5px;"></i>
                                    <i class="far fa-star fa-lg text-warning" data-value="2" style="cursor: pointer; margin-right: 5px;"></i>
                                    <i class="far fa-star fa-lg text-warning" data-value="3" style="cursor: pointer; margin-right: 5px;"></i>
                                    <i class="far fa-star fa-lg text-warning" data-value="4" style="cursor: pointer; margin-right: 5px;"></i>
                                    <i class="far fa-star fa-lg text-warning" data-value="5" style="cursor: pointer;"></i>
                                    <span class="ms-2 rating-text">(0/5)</span>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="review-comment-${item.id}" class="form-label">Nhận xét:</label>
                            <textarea class="form-control review-comment" id="review-comment-${item.id}" rows="3" placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary submit-review-btn">Gửi đánh giá</button>
                    </form>
                </div>
            </div>
        `;
    }).join('');
    
    $('#review-products').html(productsHtml);
    
    // Set up edit review buttons
    $(document).on('click', '.edit-review-btn', function() {
        const productId = $(this).data('product-id');
        const cardElement = $(this).closest('.review-product-item');
        const existingReview = reviews.find(r => 
            r.productId == productId && 
            r.orderId == order.orderNumber
        );
        
        if (existingReview) {
            const editFormHtml = `
                <form class="review-form">
                    <input type="hidden" class="rating-value" value="${existingReview.rating}">
                    <div class="mb-3">
                        <label class="form-label">Đánh giá của bạn:</label>
                        <div class="star-rating">
                            <div class="d-flex align-items-center mb-3">
                                <i class="${existingReview.rating >= 1 ? 'fas' : 'far'} fa-star fa-lg text-warning" data-value="1" style="cursor: pointer; margin-right: 5px;"></i>
                                <i class="${existingReview.rating >= 2 ? 'fas' : 'far'} fa-star fa-lg text-warning" data-value="2" style="cursor: pointer; margin-right: 5px;"></i>
                                <i class="${existingReview.rating >= 3 ? 'fas' : 'far'} fa-star fa-lg text-warning" data-value="3" style="cursor: pointer; margin-right: 5px;"></i>
                                <i class="${existingReview.rating >= 4 ? 'fas' : 'far'} fa-star fa-lg text-warning" data-value="4" style="cursor: pointer; margin-right: 5px;"></i>
                                <i class="${existingReview.rating >= 5 ? 'fas' : 'far'} fa-star fa-lg text-warning" data-value="5" style="cursor: pointer;"></i>
                                <span class="ms-2 rating-text">(${existingReview.rating}/5)</span>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="review-comment-${productId}" class="form-label">Nhận xét:</label>
                        <textarea class="form-control review-comment" id="review-comment-${productId}" rows="3" placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm...">${existingReview.comment}</textarea>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button type="submit" class="btn btn-primary submit-review-btn">Cập nhật đánh giá</button>
                        <button type="button" class="btn btn-outline-secondary cancel-edit-btn">Hủy</button>
                    </div>
                </form>
            `;
            
            // Replace the alert with the edit form
            cardElement.find('.alert').remove();
            cardElement.find('.mt-3').remove();
            cardElement.find('.card-body').append(editFormHtml);
        }
    });
    
    // Cancel edit
    $(document).on('click', '.cancel-edit-btn', function(e) {
        e.preventDefault();
        loadOrderProductsForReview(orderId);
    });
}

// Save product review
function saveProductReview(productId, rating, comment) {
    console.log('Saving review for product:', productId, 'Rating:', rating, 'Comment:', comment);
    
    if (!rating || rating === '0') {
        alert('Vui lòng chọn số sao đánh giá!');
        return false;
    }
    
    if (!comment) {
        alert('Vui lòng nhập nhận xét của bạn!');
        return false;
    }
    
    // Get user information
    const userEmail = localStorage.getItem('userEmail');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Get orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const currentOrder = orders.find(o => o.items.some(item => item.id == productId));
    
    if (!currentOrder) {
        console.error('Order not found for product ID:', productId);
        return false;
    }
    
    const review = {
        productId: parseInt(productId),
        orderId: currentOrder.orderNumber,
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
        r.orderId == currentOrder.orderNumber
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
    const productReviews = reviews.filter(r => r.productId === productId);
    
    if (productReviews.length > 0) {
        // Calculate average rating
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / productReviews.length;
        
        // Update product in storage
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products[productIndex].rating = averageRating;
            products[productIndex].reviewCount = productReviews.length;
            localStorage.setItem('products', JSON.stringify(products));
        }
    }
}

// Reorder items from a previous order
function reorderItems(orderId) {
    console.log("Reordering items from order:", orderId);
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderNumber.toString() === orderId.toString());
    
    if (!order) {
        console.error("Order not found:", orderId);
        return false;
    }
    
    // Get current cart
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    
    // Add each item from the order to the cart
    order.items.forEach(item => {
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex > -1) {
            // Increment quantity if already in cart
            cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item with the same quantity
            cart.push({...item});
        }
    });
    
    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Update button to show success with checkmark
    const reorderBtn = $(`.btn-outline-success[data-order-id="${orderId}"]`);
    if (reorderBtn.length) {
        reorderBtn.html('<i class="fas fa-check me-1"></i> Đã thêm');
        reorderBtn.removeClass('btn-outline-success').addClass('btn-success');
        
        // Reset after 3 seconds
        setTimeout(() => {
            reorderBtn.html('<i class="fas fa-redo me-1"></i> Đặt lại');
            reorderBtn.removeClass('btn-success').addClass('btn-outline-success');
        }, 3000);
    }
    
    // Return true to indicate success
    return true;
}

// Update cart count in header
function updateCartCount() {
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    $('.cart-count').text(cart.length);
} 