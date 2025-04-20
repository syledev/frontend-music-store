document.addEventListener('DOMContentLoaded', function() {
    // Load sidebar component
    $("#sidebar-container").load("../components/sidebar.html", function() {
        console.log("Sidebar loaded");
        // Activate the current menu item
        activateMenu();
    });

    // DOM Elements
    const bannerForm = document.getElementById('bannerForm');
    const formContainer = document.querySelector('.form-container');
    const addNewBtn = document.getElementById('addNewBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const bannerTableBody = document.getElementById('bannerTableBody');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');
    
    let editingBannerId = null;
    // Dữ liệu mẫu cho banner
    const defaultBanners = [
        {
            id: 1,
            title: "Khuyến mãi Guitar",
            description: "Giảm giá 20% cho tất cả các loại guitar trong tháng này",
            imageUrl: "../../user/assets/images/banner/banner1.png",
            isActive: true
        },
        {
            id: 2,
            title: "Piano mới về",
            description: "Bộ sưu tập piano cao cấp từ các thương hiệu nổi tiếng",
            imageUrl: "../../user/assets/images/banner/banner2.png",
            isActive: true
        },
        {
            id: 3,
            title: "Học nhạc online",
            description: "Đăng ký khóa học nhạc online - Giảm 30% học phí",
            imageUrl: "../../user/assets/images/banner/banner1.png",
            isActive: false
        }
    ];
    
    const banners = []; // Lưu trữ banner trong mảng local
    let nextId = 1; // ID tự tăng cho banner mới

    // Load banners when page loads
    loadBanners();

    // Event Listeners
    addNewBtn.addEventListener('click', showForm);
    cancelBtn.addEventListener('click', hideForm);
    bannerForm.addEventListener('submit', handleSubmit);
    imageInput.addEventListener('change', handleImagePreview);

    // Functions
    function handleImagePreview(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview" class="img-thumbnail" style="max-width: 200px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    }

    function loadBanners() {
        // Load from localStorage if available
        const savedBanners = localStorage.getItem('banners');
        if (savedBanners) {
            banners.length = 0; // Clear existing banners
            banners.push(...JSON.parse(savedBanners));
        } else {
            // If no saved banners, use default banners
            banners.length = 0;
            banners.push(...defaultBanners);
            saveBanners(); // Save default banners to localStorage
        }
        nextId = Math.max(...banners.map(b => b.id), 0) + 1;
        renderBanners(banners);
    }

    function saveBanners() {
        localStorage.setItem('banners', JSON.stringify(banners));
    }

    function renderBanners(banners) {
        bannerTableBody.innerHTML = '';
        banners.forEach(banner => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${banner.imageUrl}" alt="${banner.title}" class="banner-image" 
                         style="max-width: 150px; height: auto;" 
                         onerror="this.src='../../user/assets/images/noimage.png'">
                </td>
                <td>${banner.title}</td>
                <td>${banner.description}</td>
                <td>
                    <span class="badge ${banner.isActive ? 'bg-success' : 'bg-secondary'}">
                        ${banner.isActive ? 'Đang kích hoạt' : 'Đã vô hiệu'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="handleEdit(${banner.id})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="handleDelete(${banner.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            `;
            bannerTableBody.appendChild(row);
        });
    }

    function showForm() {
        formContainer.style.display = 'block';
        bannerForm.reset();
        imagePreview.innerHTML = '';
        editingBannerId = null;
        submitBtn.textContent = 'Thêm Banner';
    }

    function hideForm() {
        formContainer.style.display = 'none';
        bannerForm.reset();
        imagePreview.innerHTML = '';
        editingBannerId = null;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(bannerForm);
        const imageFile = formData.get('image');
        
        if (imageFile) {
            // Đọc file ảnh và chuyển thành URL
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageUrl = event.target.result;
                
                const bannerData = {
                    id: editingBannerId || nextId++,
                    title: formData.get('title'),
                    description: formData.get('description'),
                    imageUrl: imageUrl,
                    isActive: formData.get('isActive') === 'on'
                };

                if (editingBannerId) {
                    // Cập nhật banner
                    const index = banners.findIndex(b => b.id === editingBannerId);
                    if (index !== -1) {
                        banners[index] = bannerData;
                    }
                } else {
                    // Thêm banner mới
                    banners.push(bannerData);
                }

                saveBanners(); // Lưu vào localStorage
                hideForm();
                loadBanners();
                alert(editingBannerId ? 'Cập nhật banner thành công!' : 'Thêm banner thành công!');
            };
            reader.readAsDataURL(imageFile);
        }
    }

    // Make these functions global so they can be called from HTML
    window.handleEdit = function(id) {
        const banner = banners.find(b => b.id === id);
        if (banner) {
            // Fill form with banner data
            document.getElementById('title').value = banner.title;
            document.getElementById('description').value = banner.description;
            document.getElementById('isActive').checked = banner.isActive;
            imagePreview.innerHTML = `<img src="${banner.imageUrl}" alt="Preview" class="img-thumbnail">`;
            
            // Show form and update state
            formContainer.style.display = 'block';
            editingBannerId = id;
            submitBtn.textContent = 'Cập nhật Banner';
        }
    };

    window.handleDelete = function(id) {
        if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;

        const index = banners.findIndex(b => b.id === id);
        if (index !== -1) {
            banners.splice(index, 1);
            saveBanners(); // Lưu vào localStorage
            loadBanners();
            alert('Xóa banner thành công!');
        }
    };
});