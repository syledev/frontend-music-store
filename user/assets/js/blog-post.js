// Blog post functionality
class BlogPost {
    constructor() {
        this.post = this.getPostFromUrl();
        this.comments = JSON.parse(localStorage.getItem(`comments_${this.post?.id}`)) || [];
        this.initializePost();
    }

    // Get post from URL slug
    getPostFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        return posts.find(post => post.slug === slug);
    }

    // Initialize post
    initializePost() {
        if (!this.post) {
            this.showError();
            return;
        }

        this.loadPost();
        this.initializeComments();
        this.initializeShareButtons();
        this.initializeRelatedPosts();
        this.incrementViews();
    }

    // Load post content
    loadPost() {
        // Update breadcrumb
        const breadcrumb = document.getElementById('post-breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="index.html">Trang chủ</a></li>
                        <li class="breadcrumb-item"><a href="blog.html">Blog</a></li>
                        <li class="breadcrumb-item active" aria-current="page">${this.post.title}</li>
                    </ol>
                </nav>
            `;
        }

        // Update post content
        const postContent = document.getElementById('post-content');
        if (postContent) {
            postContent.innerHTML = `
                <div class="post-header mb-4">
                    <h1 class="post-title">${this.post.title}</h1>
                    <div class="post-meta">
                        <span class="me-3">
                            <i class="far fa-calendar-alt"></i> ${this.formatDate(this.post.date)}
                        </span>
                        <span class="me-3">
                            <i class="far fa-user"></i> ${this.post.author}
                        </span>
                        <span class="me-3">
                            <i class="far fa-comment"></i> ${this.comments.length}
                        </span>
                        <span>
                            <i class="far fa-eye"></i> ${this.post.views}
                        </span>
                    </div>
                </div>
                <div class="post-image mb-4">
                    <img src="${this.post.image}" alt="${this.post.title}" class="img-fluid rounded">
                </div>
                <div class="post-body">
                    ${this.post.content}
                </div>
                <div class="post-tags mt-4">
                    ${this.post.content.toLowerCase().match(/\b\w+\b/g).map(tag => `
                        <a href="blog.html?tag=${tag}" class="badge bg-light text-dark text-decoration-none me-2">
                            ${tag}
                        </a>
                    `).join('')}
                </div>
            `;
        }
    }

    // Initialize comments
    initializeComments() {
        const commentsContainer = document.getElementById('post-comments');
        if (!commentsContainer) return;

        // Load comments
        this.loadComments();

        // Initialize comment form
        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCommentSubmit();
            });
        }
    }

    // Load comments
    loadComments() {
        const commentsContainer = document.getElementById('comments-list');
        if (!commentsContainer) return;

        if (this.comments.length === 0) {
            commentsContainer.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                </div>
            `;
            return;
        }

        commentsContainer.innerHTML = this.comments.map(comment => `
            <div class="comment card mb-3">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="comment-avatar me-3">
                            <img src="${comment.avatar || '../assets/images/user-avatar.png'}" alt="User Avatar" class="rounded-circle" width="50" height="50">
                        </div>
                        <div class="comment-content">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 class="card-subtitle mb-1 fw-bold">${comment.author}</h6>
                                <small class="text-muted">${this.formatDate(comment.date)}</small>
                            </div>
                            <p class="card-text">${comment.content}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Cập nhật số lượng bình luận hiển thị
        const commentCount = document.getElementById('comment-count');
        if (commentCount) {
            commentCount.textContent = this.comments.length;
        }
    }

    // Handle comment submit
    handleCommentSubmit() {
        const authorInput = document.getElementById('comment-author');
        const emailInput = document.getElementById('comment-email');
        const contentInput = document.getElementById('comment-content');

        if (!authorInput.value || !contentInput.value) {
            this.showMessage('Vui lòng điền đầy đủ thông tin bắt buộc!', 'danger');
            return;
        }

        // Lấy avatar từ Gravatar hoặc sử dụng avatar mặc định
        const emailHash = emailInput.value ? this.md5(emailInput.value.trim().toLowerCase()) : '';
        const avatarUrl = emailInput.value ? `https://www.gravatar.com/avatar/${emailHash}?d=mp&s=50` : '../assets/images/user-avatar.png';

        const comment = {
            id: Date.now().toString(),
            author: authorInput.value,
            email: emailInput.value,
            avatar: avatarUrl,
            content: contentInput.value,
            date: new Date().toISOString()
        };

        // Thêm bình luận vào đầu mảng để hiển thị mới nhất trước
        this.comments.unshift(comment);
        localStorage.setItem(`comments_${this.post.id}`, JSON.stringify(this.comments));

        // Hiển thị lại danh sách bình luận
        this.loadComments();
        
        // Cuộn đến phần bình luận
        document.getElementById('comments-list').scrollIntoView({ behavior: 'smooth' });
        
        // Hiển thị thông báo thành công
        this.showMessage('Bình luận của bạn đã được đăng thành công!', 'success');

        // Reset form
        authorInput.value = '';
        emailInput.value = '';
        contentInput.value = '';
    }

    // Initialize share buttons
    initializeShareButtons() {
        const shareButtons = document.getElementById('share-buttons');
        if (!shareButtons) return;

        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(this.post.title);

        shareButtons.innerHTML = `
            <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" class="btn btn-outline-primary me-2">
                <i class="fab fa-facebook-f"></i> Facebook
            </a>
            <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" target="_blank" class="btn btn-outline-info me-2">
                <i class="fab fa-twitter"></i> Twitter
            </a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}" target="_blank" class="btn btn-outline-primary">
                <i class="fab fa-linkedin-in"></i> LinkedIn
            </a>
        `;
    }

    // Initialize related posts
    initializeRelatedPosts() {
        const relatedPosts = document.getElementById('related-posts');
        if (!relatedPosts) return;

        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const relatedPostsList = posts
            .filter(post => post.id !== this.post.id)
            .slice(0, 3);

        if (relatedPostsList.length === 0) {
            relatedPosts.style.display = 'none';
            return;
        }

        relatedPosts.innerHTML = `
            <h4 class="mb-4">Bài viết liên quan</h4>
            <div class="row">
                ${relatedPostsList.map(post => `
                    <div class="col-md-4">
                        <div class="card h-100">
                            <img src="${post.image}" class="card-img-top" alt="${post.title}">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <a href="blog-post.html?slug=${post.slug}" class="text-decoration-none text-dark">
                                        ${post.title}
                                    </a>
                                </h5>
                                <p class="card-text">${post.excerpt}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Increment post views
    incrementViews() {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const postIndex = posts.findIndex(post => post.id === this.post.id);
        
        if (postIndex !== -1) {
            posts[postIndex].views += 1;
            localStorage.setItem('blogPosts', JSON.stringify(posts));
        }
    }

    // Show error message
    showError() {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="container py-5">
                    <div class="text-center">
                        <h1 class="display-1">404</h1>
                        <h2>Không tìm thấy bài viết</h2>
                        <p class="lead">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                        <a href="blog.html" class="btn btn-primary">Quay lại trang blog</a>
                    </div>
                </div>
            `;
        }
    }

    // Show message
    showMessage(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        const commentForm = document.getElementById('comment-form');
        commentForm.insertBefore(alertDiv, commentForm.firstChild);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // Format date
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    }

    // MD5 hash function for Gravatar
    md5(string) {
        function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
        return M(V(Y(X(string),8*string.length)));
    }
}

// Initialize blog post
const blogPost = new BlogPost();

// Load header, footer, and initialize auth state
$(document).ready(function() {
    // Load header
    $("#header").load("/user/components/header.html", function() {
        console.log('Header loaded');
        // Call updateAuthUI after header is loaded
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
        
        // Đảm bảo script auth.js được load
        if (typeof updateAuthUI !== 'function') {
            $.getScript('/user/assets/js/auth.js', function() {
                if (typeof updateAuthUI === 'function') {
                    updateAuthUI();
                }
            });
        }
    });
    
    // Load footer
    $("#footer").load("/user/components/footer.html", function() {
        console.log('Footer loaded');
    });
    
    // Initialize blog post after DOM is loaded
    new BlogPost();
}); 