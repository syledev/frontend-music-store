// Toggle Sidebar on mobile
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.createElement('button');
    sidebarToggle.classList.add('btn', 'btn-dark', 'd-md-none', 'position-fixed');
    sidebarToggle.style.top = '1rem';
    sidebarToggle.style.left = '1rem';
    sidebarToggle.style.zIndex = '1031';
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    document.body.appendChild(sidebarToggle);
    
    sidebarToggle.addEventListener('click', function() {
        document.querySelector('#sidebar').classList.toggle('show');
    });
});

// Update current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Initialize tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Initialize popovers
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
});

// Example Chart (you can customize this based on your needs)
const ctx = document.getElementById('salesChart');
if (ctx) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
            datasets: [{
                label: 'Doanh thu theo tháng',
                data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Handle form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Form submitted');
    });
});

// Handle delete buttons
document.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('click', function(e) {
        if (!confirm('Bạn có chắc chắn muốn xóa?')) {
            e.preventDefault();
        }
    });
}); 