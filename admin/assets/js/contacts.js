/**
 * Contacts Management JavaScript
 */

$(document).ready(function() {
    // Load sidebar component
    $("#sidebar-container").load("../components/sidebar.html", function() {
        console.log("Sidebar loaded");
        // Activate the current menu item
        activateMenu();
    });

    // Initialize functions
    loadContacts();
    setupEventListeners();
});

// Sample data for demonstration
let contacts = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        phone: "0123456789",
        subject: "Tư vấn mua đàn guitar",
        message: "Tôi muốn được tư vấn về các loại đàn guitar phù hợp cho người mới học.",
        date: "2024-03-15",
        status: "new"
    },
    // Add more sample contacts here
];

// Load contacts to table
function loadContacts() {
    const tableBody = document.getElementById('contactsTable');
    tableBody.innerHTML = '';

    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.id}</td>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>${contact.subject}</td>
            <td>${formatDate(contact.date)}</td>
            <td><span class="badge bg-${getStatusBadgeClass(contact.status)}">${formatStatus(contact.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewContact(${contact.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteContact(${contact.id})">
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
    const searchInput = document.querySelector('input[placeholder="Tìm kiếm liên hệ..."]');
    searchInput.addEventListener('input', handleSearch);

    // Filter functionality
    document.getElementById('statusFilter').addEventListener('change', handleFilters);
    document.getElementById('timeFilter').addEventListener('change', handleFilters);

    // Send reply
    document.getElementById('sendReply').addEventListener('click', handleSendReply);
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        contact.phone.includes(searchTerm) ||
        contact.subject.toLowerCase().includes(searchTerm)
    );
    renderFilteredContacts(filteredContacts);
}

// Handle filters
function handleFilters() {
    const statusValue = document.getElementById('statusFilter').value;
    const timeValue = document.getElementById('timeFilter').value;

    let filteredContacts = contacts;

    if (statusValue) {
        filteredContacts = filteredContacts.filter(contact => contact.status === statusValue);
    }

    if (timeValue) {
        const today = new Date();
        const contactDate = new Date();
        
        switch(timeValue) {
            case 'today':
                filteredContacts = filteredContacts.filter(contact => 
                    new Date(contact.date).toDateString() === today.toDateString()
                );
                break;
            case 'week':
                const weekAgo = new Date(today.setDate(today.getDate() - 7));
                filteredContacts = filteredContacts.filter(contact => 
                    new Date(contact.date) >= weekAgo
                );
                break;
            case 'month':
                const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                filteredContacts = filteredContacts.filter(contact => 
                    new Date(contact.date) >= monthAgo
                );
                break;
        }
    }

    renderFilteredContacts(filteredContacts);
}

// Render filtered contacts
function renderFilteredContacts(contacts) {
    const tableBody = document.getElementById('contactsTable');
    tableBody.innerHTML = '';

    contacts.forEach(contact => {
        // ... (same as in loadContacts)
    });
}

// View contact details
function viewContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    document.getElementById('viewContactName').textContent = contact.name;
    document.getElementById('viewContactEmail').textContent = contact.email;
    document.getElementById('viewContactPhone').textContent = contact.phone;
    document.getElementById('viewContactSubject').textContent = contact.subject;
    document.getElementById('viewContactDate').textContent = formatDate(contact.date);
    document.getElementById('viewContactStatus').textContent = formatStatus(contact.status);
    document.getElementById('viewContactMessage').textContent = contact.message;

    const modal = new bootstrap.Modal(document.getElementById('viewContactModal'));
    modal.show();
}

// Handle send reply
function handleSendReply() {
    const reply = document.getElementById('contactReply').value;
    if (!reply.trim()) {
        showErrorMessage('Vui lòng nhập nội dung phản hồi');
        return;
    }

    // In a real application, this would send the reply to the server
    showSuccessMessage('Đã gửi phản hồi thành công');
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('viewContactModal'));
    modal.hide();
    document.getElementById('contactReply').value = '';
}

// Delete contact
function deleteContact(id) {
    if (confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) {
        contacts = contacts.filter(c => c.id !== id);
        loadContacts();
        showSuccessMessage('Đã xóa liên hệ thành công');
    }
}

// Utility functions
function formatStatus(status) {
    const statusMap = {
        'new': 'Mới',
        'processing': 'Đang xử lý',
        'resolved': 'Đã xử lý'
    };
    return statusMap[status] || status;
}

function getStatusBadgeClass(status) {
    const classMap = {
        'new': 'info',
        'processing': 'warning',
        'resolved': 'success'
    };
    return classMap[status] || 'secondary';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function showSuccessMessage(message) {
    // In a real application, you would use a proper notification system
    alert(message);
}

function showErrorMessage(message) {
    // In a real application, you would use a proper notification system
    alert('Lỗi: ' + message);
} 