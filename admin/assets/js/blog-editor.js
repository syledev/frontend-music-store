// Initialize Quill editor
const quill = new Quill('#editor-container', {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false
        }
    },
    placeholder: 'Bắt đầu viết bài...'
});

// Load sidebar
$(document).ready(function() {
    $("#sidebar-container").load("../components/sidebar.html", function() {
        // Activate current menu item
        $('.sidebar-menu a[href*="blog"]').addClass('active');
    });

    // Initialize components
    setupImageUpload();
    setupTagsInput();
    setupAutoSlug();
    setupPreview();
    setupPublish();
});

// Handle featured image upload
function setupImageUpload() {
    const featuredImage = document.getElementById('featuredImage');
    const preview = document.getElementById('featuredImagePreview');

    featuredImage.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" class="img-fluid">`;
            }
            reader.readAsDataURL(file);
        }
    });

    // Custom image handler for Quill editor
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', e.target.result);
                }
                reader.readAsDataURL(file);
            }
        };
    });
}

// Handle tags input
function setupTagsInput() {
    const tagsInput = document.getElementById('blogTags');
    let tags = new Set();

    tagsInput.addEventListener('keydown', function(e) {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const tag = this.value.trim();
            if (tag && !tags.has(tag)) {
                tags.add(tag);
                renderTags();
            }
            this.value = '';
        }
    });

    function renderTags() {
        const container = document.createElement('div');
        container.className = 'tags-container mt-2';
        
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag-item';
            tagElement.innerHTML = `
                ${tag}
                <span class="remove-tag" onclick="removeTag('${tag}')">&times;</span>
            `;
            container.appendChild(tagElement);
        });

        const existingContainer = document.querySelector('.tags-container');
        if (existingContainer) {
            existingContainer.replaceWith(container);
        } else {
            tagsInput.parentNode.appendChild(container);
        }
    }

    window.removeTag = function(tag) {
        tags.delete(tag);
        renderTags();
    }
}

// Auto-generate URL slug from title
function setupAutoSlug() {
    const titleInput = document.getElementById('blogTitle');
    const slugInput = document.getElementById('urlSlug');

    titleInput.addEventListener('input', function(e) {
        const slug = generateSlug(e.target.value);
        slugInput.value = slug;
    });

    function generateSlug(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
}

// Handle preview
function setupPreview() {
    const previewBtn = document.getElementById('btnPreview');
    const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
    const previewContent = document.getElementById('previewContent');

    previewBtn.addEventListener('click', function() {
        const title = document.getElementById('blogTitle').value;
        const content = quill.root.innerHTML;
        
        previewContent.innerHTML = `
            <h1 class="mb-4">${title}</h1>
            <div class="blog-content">
                ${content}
            </div>
        `;
        
        previewModal.show();
    });
}

// Handle publish/save
function setupPublish() {
    const publishBtn = document.getElementById('btnPublish');

    publishBtn.addEventListener('click', async function() {
        // Validate required fields
        const title = document.getElementById('blogTitle').value;
        const content = quill.root.innerHTML;
        
        if (!title || !content) {
            alert('Vui lòng điền đầy đủ tiêu đề và nội dung bài viết');
            return;
        }

        // Show loading state
        publishBtn.classList.add('loading');
        publishBtn.disabled = true;

        try {
            const blogData = {
                title: title,
                content: content,
                category: document.getElementById('blogCategory').value,
                status: document.getElementById('blogStatus').value,
                tags: Array.from(document.querySelectorAll('.tag-item'))
                    .map(tag => tag.textContent.trim()),
                metaTitle: document.getElementById('metaTitle').value,
                metaDescription: document.getElementById('metaDescription').value,
                urlSlug: document.getElementById('urlSlug').value,
                featuredImage: document.querySelector('#featuredImagePreview img')?.src
            };

            // Here you would normally send the data to your backend
            console.log('Blog data ready for submission:', blogData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            alert('Bài viết đã được lưu thành công!');
            
            // Redirect to blog list
            window.location.href = 'blog.html';

        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.');
        } finally {
            // Remove loading state
            publishBtn.classList.remove('loading');
            publishBtn.disabled = false;
        }
    });
}

// Handle unsaved changes
window.addEventListener('beforeunload', function(e) {
    const title = document.getElementById('blogTitle').value;
    const content = quill.root.innerHTML;
    
    if (title || content.length > 30) {
        e.preventDefault();
        e.returnValue = '';
    }
}); 