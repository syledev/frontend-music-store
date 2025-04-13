/**
 * Categories Management JavaScript
 */

$(document).ready(function() {
    // Load sidebar component
    $("#sidebar-container").load("/admin/components/sidebar.html", function() {
        console.log("Sidebar loaded");
        // Activate the current menu item
        activateMenu();
    });
    
    // Initialize the category pie chart
    initCategoryChart();
    
    // Handle save category button
    $("#saveCategoryBtn").click(function() {
        // In a real app, this would save the category to the database
        const categoryName = $("#categoryName").val();
        if (categoryName) {
            // Show success message
            showNotification(`Đã thêm danh mục "${categoryName}" thành công!`, 'success');
            
            // Close modal and reset form
            $("#addCategoryModal").modal('hide');
            $("#addCategoryForm")[0].reset();
        }
    });
    
    // Handle update category button
    $("#updateCategoryBtn").click(function() {
        // In a real app, this would update the category in the database
        const categoryName = $("#editCategoryName").val();
        if (categoryName) {
            // Show success message
            showNotification(`Đã cập nhật danh mục "${categoryName}" thành công!`, 'success');
            
            // Close modal
            $("#editCategoryModal").modal('hide');
        }
    });
    
    // Load category data into edit modal
    $('#editCategoryModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const categoryId = button.data('id');
        
        // In a real app, this would fetch the category data from the server
        // For now, we'll use sample data
        let categoryName, categoryDescription, categoryParent, categoryStatus;
        
        switch(categoryId) {
            case 1:
                categoryName = "Guitar";
                categoryDescription = "Các loại đàn guitar";
                categoryParent = "";
                categoryStatus = "Hiển thị";
                break;
            case 2:
                categoryName = "Piano";
                categoryDescription = "Các loại đàn piano";
                categoryParent = "";
                categoryStatus = "Hiển thị";
                break;
            // More cases for other categories...
            case 5:
                categoryName = "Phụ kiện";
                categoryDescription = "Phụ kiện nhạc cụ";
                categoryParent = "";
                categoryStatus = "Ẩn";
                break;
        }
        
        // Set values to form fields
        $("#editCategoryId").val(categoryId);
        $("#editCategoryName").val(categoryName);
        $("#editCategoryDescription").val(categoryDescription);
        $("#editCategoryParent").val(categoryParent);
        $("#editCategoryStatus").val(categoryStatus);
    });
    
    // Status filter
    $("#statusFilter").change(function() {
        const status = $(this).val().toLowerCase();
        $("#categoriesTable tbody tr").filter(function() {
            $(this).toggle(status === '' || $(this).find('span.badge').text().toLowerCase().includes(status));
        });
    });
});

// Function to initialize category chart
function initCategoryChart() {
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    const categoryChart = new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: ['Guitar', 'Piano', 'Trống', 'Violin', 'Phụ kiện'],
            datasets: [{
                data: [42, 28, 15, 19, 67],
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
                    position: 'bottom'
                }
            }
        }
    });
} 