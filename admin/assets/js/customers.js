/**
 * Customers Management JavaScript
 */

$(document).ready(function() {
    // Load sidebar component
    $("#sidebar-container").load("../components/sidebar.html", function() {
        console.log("Sidebar loaded");
        // Activate the current menu item
        activateMenu();
    });

    // Initialize functions
    loadCustomers();
    setupEventListeners();
});

// Sample data for demonstration
let customers = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        phone: "0123456789",
        birthday: "1990-01-01",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        membership: "normal",
        status: "active",
        joinDate: "2024-01-01",
        notes: "Khách hàng thân thiết",
        orders: [
            {
                id: "ORD001",
                date: "2024-03-15",
                total: 5000000,
                status: "completed"
            },
            {
                id: "ORD002",
                date: "2024-03-20",
                total: 3000000,
                status: "processing"
            }
        ]
    },
    // Add more sample customers here
];

let currentCustomerId = null;

// Load customers to table
function loadCustomers() {
    const tableBody = document.getElementById('customersTable');
    tableBody.innerHTML = '';

    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td><span class="membership-badge membership-${customer.membership}">${formatMembership(customer.membership)}</span></td>
            <td>${formatDate(customer.joinDate)}</td>
            <td><span class="status-badge status-${customer.status}">${formatStatus(customer.status)}</span></td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-outline-primary" onclick="viewCustomer(${customer.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editCustomer(${customer.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteCustomer(${customer.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('input[placeholder="Tìm kiếm khách hàng..."]');
    searchInput.addEventListener('input', handleSearch);

    // Filter functionality
    document.getElementById('membershipFilter').addEventListener('change', handleFilters);
    document.getElementById('statusFilter').addEventListener('change', handleFilters);

    // Save customer
    document.getElementById('saveCustomer').addEventListener('click', handleSaveCustomer);
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm)
    );
    renderFilteredCustomers(filteredCustomers);
}

// Handle filters
function handleFilters() {
    const membershipValue = document.getElementById('membershipFilter').value;
    const statusValue = document.getElementById('statusFilter').value;

    let filteredCustomers = customers;

    if (membershipValue) {
        filteredCustomers = filteredCustomers.filter(customer => customer.membership === membershipValue);
    }

    if (statusValue) {
        filteredCustomers = filteredCustomers.filter(customer => customer.status === statusValue);
    }

    renderFilteredCustomers(filteredCustomers);
}

// Render filtered customers
function renderFilteredCustomers(customers) {
    const tableBody = document.getElementById('customersTable');
    tableBody.innerHTML = '';

    customers.forEach(customer => {
        // ... (same as in loadCustomers)
    });
}

// View customer details
function viewCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;

    currentCustomerId = id;
    document.getElementById('viewCustomerName').textContent = customer.name;
    document.getElementById('viewCustomerEmail').textContent = customer.email;
    document.getElementById('viewCustomerPhone').textContent = customer.phone;
    document.getElementById('viewCustomerBirthday').textContent = formatDate(customer.birthday);
    document.getElementById('viewCustomerMembership').textContent = formatMembership(customer.membership);
    document.getElementById('viewCustomerStatus').textContent = formatStatus(customer.status);
    document.getElementById('viewCustomerAddress').textContent = customer.address;
    document.getElementById('viewCustomerNotes').textContent = customer.notes;

    // Load order history
    const orderTableBody = document.querySelector('#orderHistoryTable tbody');
    orderTableBody.innerHTML = '';
    customer.orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${formatDate(order.date)}</td>
            <td>${formatCurrency(order.total)}</td>
            <td>${formatOrderStatus(order.status)}</td>
        `;
        orderTableBody.appendChild(row);
    });

    const modal = new bootstrap.Modal(document.getElementById('viewCustomerModal'));
    modal.show();
}

// Edit customer
function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;

    currentCustomerId = id;
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerEmail').value = customer.email;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerBirthday').value = customer.birthday;
    document.getElementById('customerAddress').value = customer.address;
    document.getElementById('customerMembership').value = customer.membership;
    document.getElementById('customerStatus').value = customer.status;
    document.getElementById('customerNotes').value = customer.notes;

    const modal = new bootstrap.Modal(document.getElementById('addCustomerModal'));
    modal.show();
}

// Handle save customer
function handleSaveCustomer() {
    const form = document.getElementById('customerForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const customerData = {
        id: currentCustomerId || customers.length + 1,
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        birthday: document.getElementById('customerBirthday').value,
        address: document.getElementById('customerAddress').value,
        membership: document.getElementById('customerMembership').value,
        status: document.getElementById('customerStatus').value,
        notes: document.getElementById('customerNotes').value,
        joinDate: new Date().toISOString().split('T')[0],
        orders: []
    };

    if (currentCustomerId) {
        // Update existing customer
        const index = customers.findIndex(c => c.id === currentCustomerId);
        if (index !== -1) {
            customers[index] = { ...customers[index], ...customerData };
        }
    } else {
        // Add new customer
        customers.push(customerData);
    }

    loadCustomers();
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addCustomerModal'));
    modal.hide();
    form.reset();
    currentCustomerId = null;

    showSuccessMessage('Thông tin khách hàng đã được lưu thành công!');
}

// Delete customer
function deleteCustomer(id) {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
        customers = customers.filter(c => c.id !== id);
        loadCustomers();
        showSuccessMessage('Khách hàng đã được xóa thành công!');
    }
}

// Utility functions
function formatStatus(status) {
    const statusMap = {
        'active': 'Đang hoạt động',
        'inactive': 'Không hoạt động',
        'blocked': 'Đã khóa'
    };
    return statusMap[status] || status;
}

function formatMembership(membership) {
    const membershipMap = {
        'normal': 'Thường',
        'vip': 'VIP',
        'premium': 'Premium'
    };
    return membershipMap[membership] || membership;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatOrderStatus(status) {
    const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

function showSuccessMessage(message) {
    // In a real application, you would use a proper notification system
    alert(message);
}

function showErrorMessage(message) {
    // In a real application, you would use a proper notification system
    alert('Lỗi: ' + message);
} 