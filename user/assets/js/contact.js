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

// Contact form functionality
class Contact {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.initializeForm();
    }

    // Initialize contact form
    initializeForm() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    // Handle form submission
    handleSubmit() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validate form data
        if (!this.validateForm(formData)) {
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Đang gửi...
        `;

        // Simulate API call
        setTimeout(() => {
            // Save message to localStorage (for demo)
            const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            messages.push({
                ...formData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('contactMessages', JSON.stringify(messages));

            // Show success message
            this.showMessage('Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi sớm nhất có thể.', 'success');

            // Reset form
            this.form.reset();

            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    }

    // Validate form data
    validateForm(data) {
        // Validate name
        if (!data.name.trim()) {
            this.showMessage('Vui lòng nhập họ tên', 'error');
            return false;
        }

        // Validate email
        if (!this.validateEmail(data.email)) {
            this.showMessage('Vui lòng nhập email hợp lệ', 'error');
            return false;
        }

        // Validate subject
        if (!data.subject.trim()) {
            this.showMessage('Vui lòng nhập tiêu đề', 'error');
            return false;
        }

        // Validate message
        if (!data.message.trim()) {
            this.showMessage('Vui lòng nhập nội dung tin nhắn', 'error');
            return false;
        }

        return true;
    }

    // Validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Show message
    showMessage(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        this.form.insertBefore(alertDiv, this.form.firstChild);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Initialize contact form
const contact = new Contact();

// Initialize map
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Replace with your actual coordinates
    const location = { lat: 10.762622, lng: 106.660172 };
    const map = new google.maps.Map(mapContainer, {
        zoom: 15,
        center: location
    });

    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Music Store'
    });
}

// Load Google Maps API
function loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Load map when page loads
if (document.getElementById('map')) {
    loadGoogleMaps();
} 