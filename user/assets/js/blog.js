// Load header and footer
$(document).ready(function() {
    $("#header").load("../components/header.html", function() {
        // After header is loaded, check login status and update UI
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
    });
    $("#footer").load("../components/footer.html");
});

// Blog functionality
class Blog {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('blogPosts')) || this.getDefaultPosts();
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.initializeBlog();
    }

    // Get default blog posts
    getDefaultPosts() {
        const posts = [
            {
                id: '1',
                title: 'Cách chọn đàn guitar phù hợp với người mới bắt đầu',
                slug: 'cach-chon-dan-guitar-phu-hop-voi-nguoi-moi-bat-dau',
                excerpt: 'Hướng dẫn chi tiết cách chọn đàn guitar phù hợp với người mới bắt đầu học...',
                content: 'Nội dung chi tiết về cách chọn đàn guitar...',
                image: 'images/blog/guitar-beginner.jpg',
                category: 'Hướng dẫn',
                author: 'Nguyễn Văn A',
                date: '2024-03-15',
                comments: 5,
                views: 120
            },
            {
                id: '2',
                title: 'Top 10 nhạc cụ phổ biến nhất năm 2024',
                slug: 'top-10-nhac-cu-pho-bien-nhat-nam-2024',
                excerpt: 'Khám phá danh sách 10 nhạc cụ được yêu thích nhất trong năm 2024...',
                content: 'Chi tiết về top 10 nhạc cụ phổ biến...',
                image: 'images/blog/popular-instruments.jpg',
                category: 'Tin tức',
                author: 'Trần Thị B',
                date: '2024-03-10',
                comments: 8,
                views: 250
            }
        ];
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        return posts;
    }

    // Initialize blog
    initializeBlog() {
        this.loadPosts();
        this.initializeSearch();
        this.initializeCategories();
        this.initializeTags();
    }

    // Load blog posts
    loadPosts() {
        const postsContainer = document.getElementById('blog-posts');
        if (!postsContainer) return;

        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const currentPosts = this.posts.slice(startIndex, endIndex);

        if (currentPosts.length === 0) {
            postsContainer.innerHTML = `
                <div class="text-center py-5">
                    <h4>Không tìm thấy bài viết nào</h4>
                    <p>Vui lòng thử lại với từ khóa khác</p>
                </div>
            `;
            return;
        }

        postsContainer.innerHTML = currentPosts.map(post => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <img src="${post.image}" class="card-img-top" alt="${post.title}">
                    <div class="card-body">
                        <div class="mb-2">
                            <span class="badge bg-primary">${post.category}</span>
                            <small class="text-muted ms-2">
                                <i class="far fa-calendar-alt"></i> ${this.formatDate(post.date)}
                            </small>
                        </div>
                        <h5 class="card-title">
                            <a href="blog-post.html?slug=${post.slug}" class="text-decoration-none text-dark">
                                ${post.title}
                            </a>
                        </h5>
                        <p class="card-text">${post.excerpt}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="far fa-user"></i> ${post.author}
                            </small>
                            <div>
                                <small class="text-muted me-3">
                                    <i class="far fa-comment"></i> ${post.comments}
                                </small>
                                <small class="text-muted">
                                    <i class="far fa-eye"></i> ${post.views}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        this.updatePagination();
    }

    // Update pagination
    updatePagination() {
        const pagination = document.getElementById('blog-pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.posts.length / this.postsPerPage);
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        let paginationHTML = `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}">Trước</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${this.currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}">Sau</a>
            </li>
        `;

        pagination.innerHTML = paginationHTML;

        // Add click event listeners
        pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                if (page >= 1 && page <= totalPages) {
                    this.currentPage = page;
                    this.loadPosts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    // Initialize search
    initializeSearch() {
        const searchForm = document.getElementById('blog-search');
        if (!searchForm) return;

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('search-input').value.toLowerCase();
            
            this.posts = this.getDefaultPosts().filter(post => 
                post.title.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query)
            );
            
            this.currentPage = 1;
            this.loadPosts();
        });
    }

    // Initialize categories
    initializeCategories() {
        const categoriesContainer = document.getElementById('blog-categories');
        if (!categoriesContainer) return;

        const categories = [...new Set(this.posts.map(post => post.category))];
        
        categoriesContainer.innerHTML = categories.map(category => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <a href="#" class="text-decoration-none text-dark" data-category="${category}">
                    ${category}
                </a>
                <span class="badge bg-primary rounded-pill">
                    ${this.posts.filter(post => post.category === category).length}
                </span>
            </li>
        `).join('');

        // Add click event listeners
        categoriesContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                
                this.posts = this.getDefaultPosts().filter(post => 
                    post.category === category
                );
                
                this.currentPage = 1;
                this.loadPosts();
            });
        });
    }

    // Initialize tags
    initializeTags() {
        const tagsContainer = document.getElementById('blog-tags');
        if (!tagsContainer) return;

        const tags = [...new Set(this.posts.map(post => 
            post.content.toLowerCase().match(/\b\w+\b/g) || []
        ).flat())];

        tagsContainer.innerHTML = tags.map(tag => `
            <a href="#" class="badge bg-light text-dark text-decoration-none me-2 mb-2" data-tag="${tag}">
                ${tag}
            </a>
        `).join('');

        // Add click event listeners
        tagsContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tag = e.target.dataset.tag;
                
                this.posts = this.getDefaultPosts().filter(post => 
                    post.content.toLowerCase().includes(tag)
                );
                
                this.currentPage = 1;
                this.loadPosts();
            });
        });
    }

    // Format date
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    }
}

// Initialize blog
const blog = new Blog(); 