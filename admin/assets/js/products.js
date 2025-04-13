/**
 * Products Management JavaScript
 */

$(document).ready(function() {
    // Load sidebar component
    $("#sidebar-container").load("/admin/components/sidebar.html", function() {
        console.log("Sidebar loaded");
        // Activate the current menu item
        activateMenu();
    });
    
    // Handle save product button
    $("#saveProductBtn").click(function() {
        // In a real app, this would save the product to the database
        const productName = $("#productName").val();
        if (productName) {
            // Show success message
            showNotification(`Đã thêm sản phẩm "${productName}" thành công!`, 'success');
            
            // Close modal and reset form
            $("#addProductModal").modal('hide');
            $("#addProductForm")[0].reset();
        }
    });
    
    // Handle update product button
    $("#updateProductBtn").click(function() {
        // In a real app, this would update the product in the database
        const productName = $("#editProductName").val();
        if (productName) {
            // Show success message
            showNotification(`Đã cập nhật sản phẩm "${productName}" thành công!`, 'success');
            
            // Close modal
            $("#editProductModal").modal('hide');
        }
    });
    
    // Load product data into edit modal
    $('#editProductModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const productId = button.data('id');
        
        // In a real app, this would fetch the product data from the server
        // For now, we'll use sample data
        let productName, productCategory, productPrice, productStock, productDescription, productStatus, productSpecs;
        
        switch(productId) {
            case 1:
                productName = "Guitar Acoustic Yamaha F310";
                productCategory = "Guitar";
                productPrice = 3500000;
                productStock = 25;
                productDescription = "Guitar acoustic chất lượng cao, phù hợp cho người mới học.";
                productStatus = "Còn hàng";
                productSpecs = "Thương hiệu: Yamaha\nXuất xứ: Indonesia\nKiểu dáng: Dreadnought\nMặt top: Spruce\nMặt sau và hông: Meranti";
                break;
            case 2:
                productName = "Piano điện Casio PX-S1000";
                productCategory = "Piano";
                productPrice = 15000000;
                productStock = 10;
                productDescription = "Piano điện cao cấp, âm thanh chân thực, thiết kế hiện đại.";
                productStatus = "Còn hàng";
                productSpecs = "Thương hiệu: Casio\nXuất xứ: Nhật Bản\nSố phím: 88 phím\nCông nghệ: AiR Sound Source\nKết nối: Bluetooth, USB";
                break;
            // More cases for other products...
        }
        
        // Set values to form fields
        $("#editProductId").val(productId);
        $("#editProductName").val(productName);
        $("#editProductCategory").val(productCategory);
        $("#editProductPrice").val(productPrice);
        $("#editProductStock").val(productStock);
        $("#editProductDescription").val(productDescription);
        $("#editProductStatus").val(productStatus);
        $("#editProductSpecs").val(productSpecs);
    });
    
    // Category filter
    $("#categoryFilter").change(function() {
        const category = $(this).val().toLowerCase();
        $("#productsTable tbody tr").filter(function() {
            $(this).toggle(category === '' || $(this).children().eq(3).text().toLowerCase().includes(category));
        });
    });
    
    // Status filter
    $("#statusFilter").change(function() {
        const status = $(this).val().toLowerCase();
        $("#productsTable tbody tr").filter(function() {
            $(this).toggle(status === '' || $(this).find('span.badge').text().toLowerCase().includes(status));
        });
    });
    
    // Initialize search functionality (already handled in admin.js)
    
    // In a real app, we would implement AJAX calls to fetch and update product data
}); 