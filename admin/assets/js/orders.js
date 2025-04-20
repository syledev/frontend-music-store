/**
 * Orders Management JavaScript
 */

$(document).ready(function() {
    // Load sidebar component
    $("#sidebar-container").load("/admin/components/sidebar.html", function() {
        console.log("Sidebar loaded");
        // Activate the current menu item
        activateMenu();
    });

    // Order status change handler
    $('.status-select').change(function() {
        const orderId = $(this).data('order-id');
        const newStatus = $(this).val();
        
        // In a real app, this would update the order status in the database
        console.log(`Updating order ${orderId} status to ${newStatus}`);
        
        // Show success notification
        showNotification(`Đã cập nhật trạng thái đơn hàng #${orderId} thành "${newStatus}"`, 'success');
        
        // Add to timeline
        if ($('#orderDetailId').text() === orderId) {
            const now = new Date();
            const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            const newTimelineItem = `
                <li class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <h6 class="timeline-title">Đơn hàng ${getStatusText(newStatus)}</h6>
                        <p class="timeline-date">${formattedDate}</p>
                    </div>
                </li>
            `;
            
            $('#orderTimeline').append(newTimelineItem);
        }
    });
    
    // Date filter handler
    $('#dateFilter').change(function() {
        const filter = $(this).val();
        
        // Hide custom date range by default
        $('#customDateRange').hide();
        
        // Show custom date range if selected
        if (filter === 'custom') {
            $('#customDateRange').show();
            return; // Wait for user to select dates and click apply
        }
        
        // Filter orders by date
        filterOrdersByDate(filter);
    });
    
    // Apply custom date filter
    $('#applyDateFilter').click(function() {
        const fromDate = $('#dateFrom').val();
        const toDate = $('#dateTo').val();
        
        if (!fromDate || !toDate) {
            showNotification('Vui lòng chọn khoảng thời gian', 'warning');
            return;
        }
        
        // In a real app, this would filter orders by the date range
        console.log(`Filtering orders from ${fromDate} to ${toDate}`);
        
        // For demo, show a success message
        showNotification(`Đã lọc đơn hàng từ ${formatDate(fromDate)} đến ${formatDate(toDate)}`, 'info');
    });
    
    // Status filter handler
    $('#statusFilter').change(function() {
        const status = $(this).val().toLowerCase();
        
        $("#ordersTable tbody tr").filter(function() {
            // Get the current status text from the selected option
            const currentStatus = $(this).find('select.status-select option:selected').text().toLowerCase();
            $(this).toggle(status === '' || currentStatus.includes(status));
        });
    });
    
    // Order detail modal handler
    $('.view-order-btn').click(function() {
        const orderId = $(this).data('id');
        
        // In a real app, this would fetch the order details from the server
        // For now, we'll use sample data
        loadOrderDetails(orderId);
    });
    
    // Print order button
    $('#printOrderBtn').click(function() {
        // In a real app, this would open a print dialog with a formatted order document
        window.print();
    });
    
    // Save order changes button
    $('#saveOrderChangesBtn').click(function() {
        // In a real app, this would save any changes to the order
        showNotification('Đã lưu thay đổi đơn hàng thành công!', 'success');
        $('#orderDetailModal').modal('hide');
    });
});

// Function to handle order detail loading
function loadOrderDetails(orderId) {
    console.log(`Loading order details for ${orderId}`);
    
    // Update order ID in modal
    $('#orderDetailId').text(orderId);
    
    // In a real app, this would fetch data from the server
    // For demo, use sample data based on order ID
    let customerName, customerEmail, customerPhone, customerAddress;
    let paymentMethod, orderNote, orderItems, orderTotal;
    let orderTimeline;
    
    // Sample data based on order ID
    switch(orderId) {
        case 'ORD001':
            customerName = "Nguyễn Văn A";
            customerEmail = "nguyenvana@email.com";
            customerPhone = "0912345678";
            customerAddress = "123 Đường ABC, Quận 1, TP. Hồ Chí Minh";
            paymentMethod = "Thanh toán khi nhận hàng (COD)";
            orderNote = "Giao hàng trong giờ hành chính";
            orderItems = [
                {
                    image: "https://via.placeholder.com/50",
                    name: "Guitar Acoustic Yamaha F310",
                    price: "3.500.000đ",
                    quantity: 1,
                    total: "3.500.000đ"
                }
            ];
            orderTotal = "3.500.000đ";
            orderTimeline = [
                {title: "Đơn hàng đã được đặt", date: "20/03/2023 08:15"},
                {title: "Đơn hàng đã được xác nhận", date: "20/03/2023 09:30"},
                {title: "Đơn hàng đang được giao", date: "20/03/2023 14:20"},
                {title: "Đơn hàng đã được giao thành công", date: "21/03/2023 10:05"}
            ];
            break;
            
        case 'ORD002':
            customerName = "Trần Thị B";
            customerEmail = "tranthib@email.com";
            customerPhone = "0987654321";
            customerAddress = "456 Đường XYZ, Quận 2, TP. Hồ Chí Minh";
            paymentMethod = "Chuyển khoản ngân hàng";
            orderNote = "Giao buổi tối sau 18h";
            orderItems = [
                {
                    image: "https://via.placeholder.com/50",
                    name: "Piano điện Casio PX-S1000",
                    price: "15.000.000đ",
                    quantity: 1,
                    total: "15.000.000đ"
                }
            ];
            orderTotal = "15.000.000đ";
            orderTimeline = [
                {title: "Đơn hàng đã được đặt", date: "21/03/2023 10:30"},
                {title: "Đơn hàng đã được xác nhận", date: "21/03/2023 11:45"},
                {title: "Đơn hàng đang được giao", date: "22/03/2023 09:15"}
            ];
            break;
            
        // More cases for other orders...
        
        default:
            // Default values if order not found
            customerName = "Khách hàng";
            customerEmail = "email@example.com";
            customerPhone = "0123456789";
            customerAddress = "Địa chỉ khách hàng";
            paymentMethod = "Thanh toán khi nhận hàng (COD)";
            orderNote = "";
            orderItems = [];
            orderTotal = "0đ";
            orderTimeline = [];
    }
    
    // Update customer information
    $('#customerName').text(customerName);
    $('#customerEmail').text(customerEmail);
    $('#customerPhone').text(customerPhone);
    $('#customerAddress').text(customerAddress);
    $('#paymentMethod').text(paymentMethod);
    $('#orderNote').text(orderNote);
    
    // Update order items
    let orderItemsHtml = '';
    orderItems.forEach(item => {
        orderItemsHtml += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="Product" class="img-thumbnail me-2">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td>${item.total}</td>
            </tr>
        `;
    });
    
    $('#orderItemsTable').html(orderItemsHtml);
    $('#orderTotal').text(orderTotal);
    
    // Update order timeline
    let timelineHtml = '';
    orderTimeline.forEach(event => {
        timelineHtml += `
            <li class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h6 class="timeline-title">${event.title}</h6>
                    <p class="timeline-date">${event.date}</p>
                </div>
            </li>
        `;
    });
    
    $('#orderTimeline').html(timelineHtml);
}

// Helper function to filter orders by date
function filterOrdersByDate(filter) {
    // In a real app, this would filter orders based on the selected date range
    console.log(`Filtering orders by date: ${filter}`);
    
    // For demo, show a success message
    let filterText = '';
    
    switch(filter) {
        case 'today':
            filterText = 'hôm nay';
            break;
        case 'week':
            filterText = 'tuần này';
            break;
        case 'month':
            filterText = 'tháng này';
            break;
        default:
            filterText = 'tất cả thời gian';
    }
    
    if (filter !== '') {
        showNotification(`Đã lọc đơn hàng theo ${filterText}`, 'info');
    }
}

// Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
function formatDate(dateString) {
    const parts = dateString.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Helper function to get status text for timeline
function getStatusText(status) {
    switch(status) {
        case 'Chờ xác nhận':
            return 'đang chờ xác nhận';
        case 'Đã xác nhận':
            return 'đã được xác nhận';
        case 'Đang giao':
            return 'đang được giao';
        case 'Đã giao':
            return 'đã được giao thành công';
        case 'Đã hủy':
            return 'đã bị hủy';
        default:
            return status.toLowerCase();
    }
} 