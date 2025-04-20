/**
 * Blog Management JavaScript
 */

$(document).ready(function() {
    // Load sidebar component
    $("#sidebar-container").load("../components/sidebar.html", function() {
        console.log("Sidebar loaded");
        // Activate the current menu item
        activateMenu();
    });

    // Initialize functions
    loadBlogPosts();
    setupEventListeners();
    initializeImagePreview();
});

// Sample data for demonstration
let blogPosts = [
    {
        id: 1,
        title: "Hướng dẫn chọn đàn Guitar cho người mới bắt đầu",
        category: "guitar",
        image: "../../user/assets/images/blog/guitar-guide.jpg",
        content: "Bài viết hướng dẫn chi tiết cách chọn đàn guitar phù hợp cho người mới học...",
        date: "2024-03-15",
        status: "published"
    },
    // Add more sample blog posts here
];

// Load blog posts to table
function loadBlogPosts() {
    const tableBody = document.getElementById('blogTable');
    tableBody.innerHTML = '';

    blogPosts.forEach(post => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${post.id}</td>
            <td>
                <img src="${post.image}" alt="${post.title}" class="blog-thumbnail" 
                    onerror="this.src='../../user/assets/images/blog/post-1.jpg'">
            </td>
            <td>${post.title}</td>
            <td>${formatCategory(post.category)}</td>
            <td>${formatDate(post.date)}</td>
            <td><span class="badge bg-${getStatusBadgeClass(post.status)}">${formatStatus(post.status)}</span></td>
            <td>
                <a href="blog-editor.html?id=${post.id}" class="btn btn-sm btn-outline-primary me-1">
                    <i class="fas fa-edit"></i>
                </a>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteBlogPost(${post.id})">
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
    const searchInput = document.querySelector('input[placeholder="Tìm kiếm bài viết..."]');
    searchInput.addEventListener('input', handleSearch);

    // Filter functionality
    document.getElementById('categoryFilter').addEventListener('change', handleFilters);
    document.getElementById('statusFilter').addEventListener('change', handleFilters);

    // Save blog post
    document.getElementById('saveBlog').addEventListener('click', handleSaveBlog);

    // Reset form when modal is hidden
    $('#addBlogModal').on('hidden.bs.modal', function () {
        resetBlogForm();
    });
}

// Initialize image preview
function initializeImagePreview() {
    const imageInput = document.getElementById('blogImage');
    const previewDiv = document.getElementById('imagePreview');

    imageInput.addEventListener('change', function(e) {
        previewDiv.innerHTML = '';
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'img-thumbnail mt-2';
                img.style.maxHeight = '200px';
                previewDiv.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    });
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPosts = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
    );
    renderFilteredPosts(filteredPosts);
}

// Handle filters
function handleFilters() {
    const categoryValue = document.getElementById('categoryFilter').value;
    const statusValue = document.getElementById('statusFilter').value;

    let filteredPosts = blogPosts;

    if (categoryValue) {
        filteredPosts = filteredPosts.filter(post => post.category === categoryValue);
    }

    if (statusValue) {
        filteredPosts = filteredPosts.filter(post => post.status === statusValue);
    }

    renderFilteredPosts(filteredPosts);
}

// Render filtered posts
function renderFilteredPosts(posts) {
    const tableBody = document.getElementById('blogTable');
    tableBody.innerHTML = '';

    posts.forEach(post => {
        // ... (same as in loadBlogPosts)
    });
}

// Edit blog post
function editBlogPost(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('blogTitle').value = post.title;
    document.getElementById('blogCategory').value = post.category;
    document.getElementById('blogContent').value = post.content;
    document.getElementById('blogStatus').value = post.status;

    // Show image preview if exists
    const previewDiv = document.getElementById('imagePreview');
    if (post.image) {
        previewDiv.innerHTML = `<img src="${post.image}" class="img-thumbnail mt-2" style="max-height: 200px">`;
    }

    // Store the post ID for updating
    document.getElementById('blogForm').dataset.postId = id;

    const modal = new bootstrap.Modal(document.getElementById('addBlogModal'));
    modal.show();
}

// Handle save blog post
function handleSaveBlog() {
    const form = document.getElementById('blogForm');
    const postId = form.dataset.postId;
    
    const blogData = {
        title: document.getElementById('blogTitle').value,
        category: document.getElementById('blogCategory').value,
        content: document.getElementById('blogContent').value,
        status: document.getElementById('blogStatus').value,
        date: new Date().toISOString().split('T')[0]
    };

    if (!blogData.title || !blogData.content) {
        showErrorMessage('Vui lòng điền đầy đủ thông tin bài viết');
        return;
    }

    // Handle image upload
    const imageFile = document.getElementById('blogImage').files[0];
    if (imageFile) {
        // In a real application, you would upload the image to a server
        // For now, we'll use a placeholder
        blogData.image = URL.createObjectURL(imageFile);
    }

    if (postId) {
        // Update existing post
        const index = blogPosts.findIndex(p => p.id === parseInt(postId));
        if (index !== -1) {
            blogPosts[index] = { ...blogPosts[index], ...blogData };
        }
    } else {
        // Add new post
        blogData.id = blogPosts.length + 1;
        blogPosts.unshift(blogData);
    }

    // Reload table and close modal
    loadBlogPosts();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addBlogModal'));
    modal.hide();
    showSuccessMessage(postId ? 'Cập nhật bài viết thành công' : 'Thêm bài viết mới thành công');
}

// Delete blog post
function deleteBlogPost(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
        blogPosts = blogPosts.filter(p => p.id !== id);
        loadBlogPosts();
        showSuccessMessage('Đã xóa bài viết thành công');
    }
}

// Reset blog form
function resetBlogForm() {
    const form = document.getElementById('blogForm');
    form.reset();
    delete form.dataset.postId;
    document.getElementById('imagePreview').innerHTML = '';
}

// Utility functions
function formatCategory(category) {
    const categoryMap = {
        'guitar': 'Guitar',
        'piano': 'Piano',
        'drum': 'Trống',
        'violin': 'Violin',
        'news': 'Tin tức'
    };
    return categoryMap[category] || category;
}

function formatStatus(status) {
    const statusMap = {
        'draft': 'Nháp',
        'published': 'Đã đăng',
        'hidden': 'Đã ẩn'
    };
    return statusMap[status] || status;
}

function getStatusBadgeClass(status) {
    const classMap = {
        'draft': 'warning',
        'published': 'success',
        'hidden': 'secondary'
    };
    return classMap[status] || 'info';
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