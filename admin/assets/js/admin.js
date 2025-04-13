/**
 * Admin Dashboard JavaScript
 */

// Utility functions
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        maximumFractionDigits: 0 
    }).format(amount);
};

// Initialize tooltips
const initTooltips = () => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
};

// Load chart data from API (Placeholder function)
const loadChartData = () => {
    // In a real application, this would fetch data from a backend API
    // For now, we'll use static data defined in the dashboard.html
    console.log('Chart data would be loaded from API in production');
};

// Show notification
const showNotification = (message, type = 'info') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    const content = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toast.innerHTML = content;
    
    // Add to toast container (create if doesn't exist)
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Initialize the toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove after hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
};

// Confirmation dialog
const confirmAction = (message, callback) => {
    if (confirm(message)) {
        callback();
    }
};

// Admin account functions
const checkAdminAuth = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = '/user/pages/login.html';
        return false;
    }
    return true;
};

const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = '/user/pages/login.html';
};

// Event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAdminAuth()) return;
    
    // Initialize tooltips
    initTooltips();
    
    // Load chart data if on dashboard page
    if (document.getElementById('revenueChart')) {
        loadChartData();
    }
    
    // Setup logout event (if not using sidebar component)
    const logoutButton = document.getElementById('manual-logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    
    // Setup table search functionality
    const tableSearchInputs = document.querySelectorAll('.table-search');
    tableSearchInputs.forEach(input => {
        input.addEventListener('keyup', function() {
            const searchText = this.value.toLowerCase();
            const targetTable = document.querySelector(this.dataset.target);
            
            if (!targetTable) return;
            
            const rows = targetTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchText) ? '' : 'none';
            });
        });
    });
    
    // Setup delete confirmation
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const itemId = this.dataset.id;
            const itemType = this.dataset.type || 'item';
            
            confirmAction(`Bạn có chắc chắn muốn xóa ${itemType} này?`, () => {
                // In a real app, this would call an API to delete the item
                console.log(`Deleting ${itemType} with ID: ${itemId}`);
                showNotification(`Đã xóa ${itemType} thành công!`, 'success');
                
                // Optionally remove the item from the UI
                const row = this.closest('tr');
                if (row) {
                    row.remove();
                }
            });
        });
    });
});

// Sidebar activation helper
const activateMenu = () => {
    const path = window.location.pathname;
    const menuItems = document.querySelectorAll('#sidebar .nav-link');
    
    menuItems.forEach(item => {
        item.classList.remove('active');
        
        const href = item.getAttribute('href');
        if (href && path.includes(href.split('/').pop().split('.')[0])) {
            item.classList.add('active');
        }
    });
};

// Activate current menu item based on URL
function activateMenu() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page link
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    alert(message); // In a real app, use a proper notification system
}

// Confirm delete
function confirmDelete(type, id) {
    return confirm(`Bạn có chắc chắn muốn xóa ${type} này không?`);
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
} 