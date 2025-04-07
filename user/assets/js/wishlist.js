// Load header and footer
$(document).ready(function() {
    $("#header").load("../components/header.html", function() {
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
    });
    $("#footer").load("../components/footer.html");

    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    loadWishlistItems();
    updateWishlistCount();
    
    // Xử lý sự kiện cho nút "Xóa tất cả"
    $(document).on('click', '#xoa-tat-ca', function() {
        showConfirmDialog('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?', function() {
            clearWishlist();
        });
    });
});

// Hiển thị dialog xác nhận có thể tùy chỉnh
function showConfirmDialog(title, message, callback) {
    // Tạo dialog
    const dialogHTML = `
        <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmModalLabel">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${message}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-danger" id="confirmAction">Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Thêm dialog vào body nếu chưa tồn tại
    if ($('#confirmModal').length === 0) {
        $('body').append(dialogHTML);
    }
    
    // Hiển thị dialog
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    confirmModal.show();
    
    // Xử lý khi nhấn nút xác nhận
    $('#confirmAction').on('click', function() {
        confirmModal.hide();
        if (typeof callback === 'function') {
            callback();
        }
    });
    
    // Dọn dẹp sau khi đóng dialog
    $('#confirmModal').on('hidden.bs.modal', function() {
        $('#confirmAction').off('click');
        $(this).remove();
    });
}

// Xóa tất cả sản phẩm khỏi wishlist
function clearWishlist() {
    localStorage.removeItem('wishlist');
    loadWishlistItems();
    updateWishlistCount();
    
    // Hiển thị thông báo thành công
    showSuccessMessage('Đã xóa tất cả sản phẩm khỏi danh sách yêu thích!');
}

// Hiển thị thông báo thành công
function showSuccessMessage(message) {
    const alertHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Thêm thông báo vào container
    $('.container').prepend(alertHTML);
    
    // Tự động ẩn sau 3 giây
    setTimeout(function() {
        $('.alert').alert('close');
    }, 3000);
}

// Get wishlist from localStorage
function getWishlist() {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

// Save wishlist to localStorage
function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

// Update wishlist count in header
function updateWishlistCount() {
    const wishlist = getWishlist();
    $('.wishlist-count').text(wishlist.length);
}

// Load wishlist items
function loadWishlistItems() {
    const wishlist = getWishlist();
    const container = $('#wishlist-items');
    const emptyWishlist = $('#empty-wishlist');

    if (wishlist.length === 0) {
        container.hide();
        emptyWishlist.show();
        $('#xoa-tat-ca').addClass('d-none');
        return;
    }

    container.empty();
    emptyWishlist.hide();
    $('#xoa-tat-ca').removeClass('d-none');

    wishlist.forEach(item => {
        const itemHtml = `
            <div class="card mb-3 wishlist-item" data-product-id="${item.id}">
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text text-primary fw-bold">${formatPrice(item.price)}</p>
                            <p class="card-text"><small class="text-muted">Đã thêm vào: ${item.addedDate}</small></p>
                        </div>
                    </div>
                    <div class="col-md-2 d-flex align-items-center justify-content-end p-3">
                        <button class="btn btn-primary me-2 add-to-cart" data-product-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                        </button>
                        <button class="btn btn-outline-danger remove-from-wishlist" data-product-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.append(itemHtml);
    });
}

// Event delegation for dynamically created elements
$(document).on('click', '.remove-from-wishlist', function() {
    const productId = parseInt($(this).data('product-id'));
    const itemElement = $(this).closest('.wishlist-item');
    const productName = itemElement.find('.card-title').text();
    
    // Hiển thị dialog xác nhận
    showConfirmDialog('Xác nhận xóa', `Bạn có muốn xóa sản phẩm "${productName}" khỏi danh sách yêu thích không?`, function() {
        removeFromWishlist(productId);
    });
});

$(document).on('click', '.add-to-cart', function() {
    const productId = parseInt($(this).data('product-id'));
    addToCart(productId);
});

// Add to wishlist
function addToWishlist(product) {
    const wishlist = getWishlist();
    
    // Check if product already exists in wishlist
    if (wishlist.some(item => item.id === product.id)) {
        showSuccessMessage('Sản phẩm đã có trong danh sách yêu thích!');
        return;
    }

    // Add product with current date
    product.addedDate = new Date().toLocaleDateString('vi-VN');
    wishlist.push(product);
    saveWishlist(wishlist);
    loadWishlistItems();
    
    showSuccessMessage('Đã thêm sản phẩm vào danh sách yêu thích!');
}

// Remove from wishlist
function removeFromWishlist(productId) {
    console.log('Removing product ID:', productId);
    const wishlist = getWishlist();
    const newWishlist = wishlist.filter(item => item.id !== productId);
    
    // Log để debug
    console.log('Before:', wishlist.length, 'items');
    console.log('After:', newWishlist.length, 'items');
    
    saveWishlist(newWishlist);
    loadWishlistItems();
    
    // Hiển thị thông báo
    showSuccessMessage('Đã xóa sản phẩm khỏi danh sách yêu thích!');
}

// Add to cart
function addToCart(productId) {
    // Get cart from localStorage
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    
    // Get product from wishlist
    const wishlist = getWishlist();
    const product = wishlist.find(item => item.id === productId);
    
    if (product) {
        // Check if product already exists in cart
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        // Save cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        $('.cart-count').text(cart.length);
        
        showSuccessMessage('Đã thêm sản phẩm vào giỏ hàng!');
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

// Check if user is logged in
function isLoggedIn() {
    // Kiểm tra cả admin và user thông thường
    return localStorage.getItem('currentUser') !== null || 
           localStorage.getItem('isLoggedIn') === 'true' || 
           localStorage.getItem('isAdminLoggedIn') === 'true';
} 