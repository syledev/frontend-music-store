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
    $("#dialog").load("/components/dialog/dialog.html");

    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Check if user is admin
    if (isAdminLoggedIn()) {
        // Display admin message instead of cart
        showAdminMessage();
        return;
    }

    // Load cart items
    loadCart();

    // Load Vietnam provinces
    loadVietnamProvinces();
    
    // Handle form validation
    validateForm();
    
    // Handle province change
    $('#province').change(function() {
        const provinceId = $(this).val();
        if (provinceId) {
            loadDistricts(provinceId);
        } else {
            $('#district').html('<option value="">Chọn Quận/Huyện</option>');
            $('#ward').html('<option value="">Chọn Phường/Xã</option>');
        }
    });
    
    // Handle district change
    $('#district').change(function() {
        const districtId = $(this).val();
        if (districtId) {
            loadWards(districtId);
        } else {
            $('#ward').html('<option value="">Chọn Phường/Xã</option>');
        }
    });

    // Event handlers
    $(document).on('click', '.delete-item', function() {
        const productId = $(this).data('id');
        removeFromCart(productId);
    });
    
    $(document).on('click', '.quantity-decrease', function() {
        const productId = $(this).data('id');
        updateCartItemQuantity(productId, 'decrease');
    });
    
    $(document).on('click', '.quantity-increase', function() {
        const productId = $(this).data('id');
        updateCartItemQuantity(productId, 'increase');
    });
    
    $(document).on('change', '.cart-item-quantity', function() {
        const productId = $(this).data('id');
        const quantity = parseInt($(this).val());
        if (quantity > 0) {
            updateCartItemQuantity(productId, 'set', quantity);
        }
    });
    
    // Select all checkbox
    $('#selectAll').change(function() {
        const isChecked = $(this).prop('checked');
        $('.cart-item-checkbox').prop('checked', isChecked);
        updateCartTotal();
    });
    
    // Individual checkbox
    $(document).on('change', '.cart-item-checkbox', function() {
        // Check if all checkboxes are checked
        const allChecked = $('.cart-item-checkbox:checked').length === $('.cart-item-checkbox').length;
        $('#selectAll').prop('checked', allChecked);
        
        updateCartTotal();
    });
    
    // Delete selected items
    $('#deleteSelected').click(function() {
        const selectedItems = $('.cart-item-checkbox:checked');
        
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn sản phẩm cần xóa');
            return;
        }
        
        if (confirm('Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?')) {
            selectedItems.each(function() {
                const productId = $(this).data('id');
                removeFromCart(productId, false);
            });
            loadCart();
        }
    });
    
    // Xóa đã chọn (từ nút ở trên cùng)
    $('#delete-selected').click(function() {
        const selectedItems = $('.cart-item-checkbox:checked');
        
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn sản phẩm cần xóa');
            return;
        }
        
        if (confirm('Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?')) {
            selectedItems.each(function() {
                const productId = $(this).data('id');
                removeFromCart(productId, false);
            });
            loadCart();
        }
    });
    
    // Checkout button
    $('#checkout-btn').click(function() {
        const selectedItems = $('.cart-item-checkbox:checked');
        
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
            return;
        }
        
        // Hide cart and show shipping form
        $('#cart-container').slideUp();
        $('#shipping-info').slideDown();
    });
    
    // Shipping form submission
    $('#shipping-form').submit(function(e) {
        e.preventDefault();
        
        const paymentMethod = $('input[name="paymentMethod"]:checked').val();
        
        if (paymentMethod === 'cod') {
            // Create order and redirect to orders page
            createOrder('cod');
            alert('Đơn hàng của bạn đã được đặt thành công!');
            window.location.href = 'orders.html';
        } else {
            // Show QR payment
            $('#shipping-info').slideUp();
            $('#payment-qr').slideDown();
            
            // Update order info
            const total = calculateSelectedTotal();
            $('#order-code').text('#' + generateOrderId());
            $('#order-amount').text(formatPrice(total));
        }
    });
    
    // Confirm payment
    $('#confirm-payment-btn').click(function() {
        createOrder('online');
        alert('Cảm ơn bạn đã thanh toán! Đơn hàng đang được xử lý.');
        window.location.href = 'orders.html';
    });
    
    // Cancel payment
    $('#cancel-payment-btn').click(function() {
        $('#payment-qr').slideUp();
        $('#shipping-info').slideDown();
    });

    // Nút "Thanh toán" ở tổng giỏ hàng
    $('.thanh-toan-btn').click(function() {
        const selectedItems = $('.cart-item-checkbox:checked');
        
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
            return;
        }
        
        // Hide cart and show shipping form
        $('#cart-container').slideUp();
        $('#shipping-info').slideDown();
    });
});

// Show admin message
function showAdminMessage() {
    const cartContainer = $('.container');
    cartContainer.html(`
        <div class="row justify-content-center mt-5">
            <div class="col-md-8">
                <div class="alert alert-warning text-center" role="alert">
                    <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                    <h4 class="alert-heading">Thông báo!</h4>
                    <p>Tài khoản admin không được sử dụng chức năng giỏ hàng.</p>
                    <p>Vui lòng sử dụng tài khoản người dùng thông thường để mua sắm.</p>
                    <hr>
                    <a href="/index.html" class="btn btn-primary">
                        <i class="fas fa-home me-2"></i>Quay lại trang chủ
                    </a>
                    <a href="/pages/dashboard.html" class="btn btn-outline-primary ms-2">
                        <i class="fas fa-tachometer-alt me-2"></i>Quản lý cửa hàng
                    </a>
                </div>
            </div>
        </div>
    `);
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true' || 
           localStorage.getItem('currentUser') !== null || 
           localStorage.getItem('isAdminLoggedIn') === 'true';
}

// Check if admin is logged in
function isAdminLoggedIn() {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
}

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cart = getCart();
    $('.cart-count').text(cart.length);
}

// Load cart items
function loadCart() {
    const cart = getCart();
    
    // Update cart quantity in header
    updateCartCount();
    
    if (cart.length === 0) {
        // Show empty cart message
        $('#empty-cart-message').show();
        $('#cart-items-container').hide();
        updateCartTotal();
        return;
    }
    
    // Show cart items
    $('#empty-cart-message').hide();
    $('#cart-items-container').show();
    
    // Generate cart items HTML
    const cartItemsHtml = cart.map(item => `
        <tr>
            <td>
                <div class="form-check">
                    <input class="form-check-input cart-item-checkbox" type="checkbox" data-id="${item.id}">
                        </div>
            </td>
            <td>
                <img src="${item.image}" alt="${item.name}" class="cart-item-image rounded">
            </td>
            <td>
                <h5 class="fs-6">${item.name}</h5>
                <small class="text-muted">${item.category}</small>
            </td>
            <td>${formatPrice(item.price)}</td>
            <td>
                <div class="input-group input-group-sm" style="max-width: 150px; margin: 0 auto;">
                    <button class="btn btn-outline-secondary quantity-decrease" type="button" data-id="${item.id}">-</button>
                    <input type="number" class="form-control text-center cart-item-quantity" value="${item.quantity}" min="1" data-id="${item.id}" style="min-width: 50px;">
                    <button class="btn btn-outline-secondary quantity-increase" type="button" data-id="${item.id}">+</button>
                </div>
            </td>
            <td class="fw-bold">${formatPrice(item.price * item.quantity)}</td>
            <td>
                <button class="btn btn-outline-danger btn-sm delete-item" data-id="${item.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
        `).join('');
    
    $('#cart-items').html(cartItemsHtml);
    
    // Update cart total
    updateCartTotal();
}

// Update cart total
function updateCartTotal() {
    const subtotal = calculateSelectedTotal();
    const shipping = subtotal > 0 ? 30000 : 0;
        const total = subtotal + shipping;
        
    $('#subtotal').text(formatPrice(subtotal));
    $('#shipping').text(formatPrice(shipping));
    $('#total').text(formatPrice(total));
    
    // Update Tạm tính and Tổng cộng
    $('.tam-tinh').text(formatPrice(subtotal));
    $('.phi-van-chuyen').text(formatPrice(shipping));
    $('.tong-cong').text(formatPrice(total));
}

// Calculate total for selected items
function calculateSelectedTotal() {
    const cart = getCart();
    let total = 0;
    
    // Get selected item IDs
    const selectedIds = $('.cart-item-checkbox:checked').map(function() {
        return $(this).data('id');
    }).get();
    
    // Calculate total for selected items
    cart.forEach(item => {
        if (selectedIds.includes(item.id)) {
            total += item.price * item.quantity;
        }
    });
    
    return total;
}

// Update cart item quantity
function updateCartItemQuantity(productId, action, value = null) {
    const cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex === -1) return;
    
    switch (action) {
        case 'increase':
            cart[productIndex].quantity += 1;
            break;
        case 'decrease':
            if (cart[productIndex].quantity > 1) {
                cart[productIndex].quantity -= 1;
            }
            break;
        case 'set':
            cart[productIndex].quantity = value;
            break;
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    $(`.cart-item-quantity[data-id="${productId}"]`).val(cart[productIndex].quantity);
    
    // Update subtotal for this item
    const itemSubtotal = cart[productIndex].price * cart[productIndex].quantity;
    $(`.cart-item-quantity[data-id="${productId}"]`).closest('tr').find('td:nth-last-child(2)').text(formatPrice(itemSubtotal));
    
    // Update cart total
    updateCartTotal();
}

// Remove item from cart
function removeFromCart(productId, reload = true) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update UI
    if (reload) {
        loadCart();
        
        // Update cart count in header
        updateCartCount();
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

// Generate random order ID
function generateOrderId() {
    return Math.floor(10000 + Math.random() * 90000);
}

// Create order
function createOrder(paymentMethod) {
    // Get selected items
    const cart = getCart();
    const selectedIds = $('.cart-item-checkbox:checked').map(function() {
        return $(this).data('id');
    }).get();
    
    const selectedItems = cart.filter(item => selectedIds.includes(item.id));
    
    // Calculate total
    const subtotal = calculateSelectedTotal();
    const shipping = 30000;
    const total = subtotal + shipping;
    
    // Get shipping info
    const shippingInfo = {
        fullName: $('#fullName').val(),
        phone: $('#phone').val(),
        email: $('#email').val(),
        province: $('#province option:selected').text(),
        district: $('#district option:selected').text(),
        ward: $('#ward option:selected').text(),
        address: $('#address').val(),
        note: $('#note').val()
    };
    
    // Create order object
    const orderId = generateOrderId();
    const order = {
        id: orderId,
        orderNumber: orderId,
        date: new Date().toISOString(),
        items: selectedItems,
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        status: paymentMethod === 'cod' ? 'Đang xử lý' : 'Đã thanh toán',
        paymentMethod: paymentMethod,
        shippingInfo: shippingInfo
    };
    
    // Save order to localStorage
    const orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Remove selected items from cart
    selectedIds.forEach(id => {
        removeFromCart(id, false);
    });
    
    return order;
}

// Form validation
function validateForm() {
    const form = document.getElementById('shipping-form');
    
    if (form) {
        // Phone validation - only allow numbers
        $('#phone').on('input', function() {
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
            if ($(this).val().length > 10) {
                $(this).val($(this).val().substring(0, 10));
            }
        });
        
        // Email validation
        $('#email').on('blur', function() {
            const email = $(this).val();
            if (email && !isValidEmail(email)) {
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        
        // Form submission validation
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    }
}

// Email validation regex
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Google Maps API for Vietnam locations
function loadVietnamProvinces() {
    // Show loading message
    $('#province').html('<option value="">Đang tải dữ liệu...</option>');
    
    // API URL for Vietnamese provinces
    fetch('https://provinces.open-api.vn/api/p/')
        .then(response => response.json())
        .then(data => {
            // Clear loading message
            $('#province').html('<option value="">Chọn Tỉnh/Thành phố</option>');
            
            // Add each province to the dropdown
            data.forEach(province => {
                $('#province').append(`<option value="${province.code}">${province.name}</option>`);
            });
        })
        .catch(error => {
            console.error('Error loading provinces:', error);
            // Fallback to static list if API fails
            loadStaticProvinces();
        });
}

// Load districts based on selected province
function loadDistricts(provinceCode) {
    // Show loading message
    $('#district').html('<option value="">Đang tải dữ liệu...</option>');
    
    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
        .then(response => response.json())
        .then(data => {
            // Clear loading message
            $('#district').html('<option value="">Chọn Quận/Huyện</option>');
            
            // Add each district to the dropdown
            if (data && data.districts) {
                data.districts.forEach(district => {
                    $('#district').append(`<option value="${district.code}">${district.name}</option>`);
                });
            }
        })
        .catch(error => {
            console.error('Error loading districts:', error);
            $('#district').html('<option value="">Lỗi khi tải dữ liệu</option>');
        });
}

// Load wards based on selected district
function loadWards(districtCode) {
    // Show loading message
    $('#ward').html('<option value="">Đang tải dữ liệu...</option>');
    
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
        .then(response => response.json())
        .then(data => {
            // Clear loading message
            $('#ward').html('<option value="">Chọn Phường/Xã</option>');
            
            // Add each ward to the dropdown
            if (data && data.wards) {
                data.wards.forEach(ward => {
                    $('#ward').append(`<option value="${ward.code}">${ward.name}</option>`);
                });
            }
        })
        .catch(error => {
            console.error('Error loading wards:', error);
            $('#ward').html('<option value="">Lỗi khi tải dữ liệu</option>');
        });
}

// Fallback function if API fails
function loadStaticProvinces() {
    $('#province').html('<option value="">Chọn Tỉnh/Thành phố</option>');
    
    // Add some major provinces
    const majorProvinces = [
        { code: '01', name: 'Hà Nội' },
        { code: '79', name: 'TP. Hồ Chí Minh' },
        { code: '48', name: 'Đà Nẵng' },
        { code: '92', name: 'Cần Thơ' },
        { code: '31', name: 'Hải Phòng' }
    ];
    
    majorProvinces.forEach(province => {
        $('#province').append(`<option value="${province.code}">${province.name}</option>`);
    });
} 