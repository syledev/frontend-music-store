// Admin Dashboard JavaScript

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltips.length > 0) {
        tooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    }

    // Initialize popovers
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    if (popovers.length > 0) {
        popovers.forEach(popover => {
            new bootstrap.Popover(popover);
        });
    }

    // Toggle sidebar on mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-toggled');
            document.querySelector('.sidebar').classList.toggle('toggled');
        });
    }

    // Close sidebar when window gets small
    function checkWindowSize() {
        if (window.innerWidth < 768) {
            document.querySelector('.sidebar').classList.add('toggled');
        } else {
            document.querySelector('.sidebar').classList.remove('toggled');
        }
    }

    // Check window size on load
    checkWindowSize();
    
    // Check window size on resize
    window.addEventListener('resize', checkWindowSize);
    
    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    document.querySelector('.sidebar').addEventListener('mousewheel', function(e) {
        if (this.classList.contains('toggled')) {
            return;
        }
        if (e.deltaY > 0) {
            e.target.scrollTop += 100;
        } else {
            e.target.scrollTop -= 100;
        }
        e.preventDefault();
    });

    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', function() {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        });
    }

    // Initialize datepickers
    const datepickers = document.querySelectorAll('.datepicker');
    if (datepickers.length > 0 && typeof flatpickr !== 'undefined') {
        datepickers.forEach(datepicker => {
            flatpickr(datepicker, {
                dateFormat: "d/m/Y",
                locale: "vn"
            });
        });
    }

    // Initialize select2 dropdowns
    const selects = document.querySelectorAll('.select2');
    if (selects.length > 0 && typeof $.fn.select2 !== 'undefined') {
        $(selects).select2({
            theme: 'bootstrap-5'
        });
    }

    // Handle confirmation dialogs
    const confirmButtons = document.querySelectorAll('[data-confirm]');
    if (confirmButtons.length > 0) {
        confirmButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (!confirm(this.dataset.confirm)) {
                    e.preventDefault();
                    return false;
                }
            });
        });
    }

    // Handle form validation
    const forms = document.querySelectorAll('.needs-validation');
    if (forms.length > 0) {
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }

    // Custom file input
    const fileInputs = document.querySelectorAll('.custom-file-input');
    if (fileInputs.length > 0) {
        fileInputs.forEach(input => {
            input.addEventListener('change', function() {
                const fileName = this.files[0].name;
                const label = this.nextElementSibling;
                label.innerHTML = fileName;
            });
        });
    }

    // Image preview on file select
    const imageInputs = document.querySelectorAll('.image-input');
    if (imageInputs.length > 0) {
        imageInputs.forEach(input => {
            input.addEventListener('change', function() {
                const file = this.files[0];
                const preview = document.querySelector(this.dataset.preview);

                if (preview && file) {
                    const reader = new FileReader();
                    reader.addEventListener('load', function() {
                        preview.src = reader.result;
                        preview.style.display = 'block';
                    });
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    // Toggle switches handling
    const toggles = document.querySelectorAll('.toggle-switch');
    if (toggles.length > 0) {
        toggles.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const url = this.dataset.url;
                const id = this.dataset.id;
                
                if (url && id) {
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: JSON.stringify({
                            id: id,
                            status: this.checked ? 1 : 0
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Success notification here
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        // Error notification here
                    });
                }
            });
        });
    }

    // Show active page link in the sidebar
    const currentLocation = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    
    sidebarLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (linkPath && currentLocation.includes(linkPath)) {
            link.classList.add('active');
            
            // If link is in a collapse, expand it
            const parentCollapse = link.closest('.collapse');
            if (parentCollapse) {
                parentCollapse.classList.add('show');
                const controlLink = document.querySelector(`[data-bs-target="#${parentCollapse.id}"]`);
                if (controlLink) {
                    controlLink.classList.remove('collapsed');
                    controlLink.setAttribute('aria-expanded', 'true');
                }
            }
        }
    });

    // Dynamic dashboard data loading (example)
    function loadDashboardData() {
        fetch('/api/dashboard/stats')
            .then(response => response.json())
            .then(data => {
                // Update dashboard statistics here
            })
            .catch(error => {
                console.error('Error loading dashboard data:', error);
            });
    }

    // Call only if we're on the dashboard page
    if (currentLocation.includes('dashboard.html') || currentLocation === '/' || currentLocation === '/admin/' || currentLocation === '/admin/dashboard') {
        // loadDashboardData();
    }
}); 