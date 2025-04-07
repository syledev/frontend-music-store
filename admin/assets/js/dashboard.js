/**
 * Dashboard Management JavaScript
 */

// Biểu đồ doanh thu
let revenueChart;
// Biểu đồ danh mục
let categoryChart;

$(document).ready(function() {
    // Load sidebar component
    $("#sidebar-container").load("/admin/components/sidebar.html", function() {
        console.log("Sidebar loaded");
        // Activate the current menu item
        activateMenu();
    });
    
    // Khởi tạo các biểu đồ
    initCharts();
});

// Khởi tạo các biểu đồ thống kê
function initCharts() {
    initRevenueChart();
    initCategoryChart();
}

// Biểu đồ doanh thu theo thời gian
function initRevenueChart() {
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
            datasets: [{
                label: 'Doanh thu (triệu đồng)',
                data: [65, 59, 80, 81, 56, 150],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Biểu đồ phân bổ danh mục
function initCategoryChart() {
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Guitar', 'Piano', 'Trống', 'Violin', 'Khác'],
            datasets: [{
                data: [40, 20, 15, 10, 15],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Hàm để cập nhật dữ liệu biểu đồ khi cần thiết
function updateChartData(period) {
    // Trong thực tế, hàm này sẽ gọi API để lấy dữ liệu theo khoảng thời gian
    console.log(`Updating chart data for period: ${period}`);
    
    // Dữ liệu mẫu cho các khoảng thời gian khác nhau
    let revenueData;
    
    switch (period) {
        case 'week':
            revenueData = [15, 20, 18, 25, 30, 22, 28];
            break;
        case 'month':
            revenueData = [65, 59, 80, 81, 56, 150];
            break;
        case 'year':
            revenueData = [500, 650, 750, 800, 950, 1100, 900, 850, 950, 1200, 1300, 1500];
            break;
        default:
            revenueData = [65, 59, 80, 81, 56, 150];
    }
    
    // Cập nhật dữ liệu biểu đồ
    revenueChart.data.datasets[0].data = revenueData;
    revenueChart.update();
} 