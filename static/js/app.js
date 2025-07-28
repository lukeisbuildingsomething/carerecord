// Health Tracker App JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips if Bootstrap tooltips are available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Active navigation state management
    function setActiveNavigation() {
        var currentPath = window.location.pathname;
        var navLinks = document.querySelectorAll('.main-nav .nav-link:not(.dropdown-toggle)');
        var dropdownItems = document.querySelectorAll('.main-nav .dropdown-item');
        
        // Remove all active classes
        navLinks.forEach(function(link) {
            link.classList.remove('active');
        });
        
        // Check dropdown items first
        dropdownItems.forEach(function(item) {
            var href = item.getAttribute('href');
            if (href && currentPath === href) {
                // Add active class to dropdown parent
                var dropdown = item.closest('.dropdown');
                if (dropdown) {
                    var dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                    if (dropdownToggle) {
                        dropdownToggle.classList.add('active');
                    }
                }
                return;
            }
        });
        
        // Check main nav links
        navLinks.forEach(function(link) {
            var href = link.getAttribute('href');
            if (href && currentPath === href) {
                link.classList.add('active');
            }
        });
    }
    
    // Set active navigation on page load
    setActiveNavigation();

    // Enhanced dropdown behavior
    var dropdowns = document.querySelectorAll('.main-nav .dropdown');
    dropdowns.forEach(function(dropdown) {
        var toggle = dropdown.querySelector('.dropdown-toggle');
        var menu = dropdown.querySelector('.dropdown-menu');
        
        // Add hover effects for desktop
        if (window.innerWidth > 991) {
            dropdown.addEventListener('mouseenter', function() {
                toggle.classList.add('show');
                menu.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
            });
            
            dropdown.addEventListener('mouseleave', function() {
                toggle.classList.remove('show');
                menu.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Smooth scroll for navigation links
    var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            var targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll effects for navigation
    let lastScrollTop = 0;
    const mainNav = document.querySelector('.main-nav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for enhanced shadow
        if (scrollTop > 10) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Auto-focus first input in modals
    var modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
        modal.addEventListener('shown.bs.modal', function() {
            var firstInput = modal.querySelector('input[type="text"], input[type="email"], textarea, select');
            if (firstInput) {
                firstInput.focus();
            }
        });
    });

    // Form validation enhancement
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            var requiredFields = form.querySelectorAll('[required]');
            var isValid = true;
            
            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                event.preventDefault();
                event.stopPropagation();
                
                // Show first invalid field
                var firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });

    // Real-time validation feedback
    var inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
    inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    });

    // Auto-dismiss alerts after 5 seconds
    var alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            var bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Smooth scrolling for anchor links
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            var targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // File input enhancement
    var fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(function(input) {
        input.addEventListener('change', function() {
            var fileName = this.files[0] ? this.files[0].name : '';
            var label = this.nextElementSibling;
            
            if (label && label.classList.contains('form-text')) {
                if (fileName) {
                    label.textContent = 'Selected: ' + fileName;
                    label.classList.add('text-success');
                } else {
                    label.textContent = 'Supported formats: PDF, JPG, PNG, DOC, DOCX, TXT (max 16MB)';
                    label.classList.remove('text-success');
                }
            }
        });
    });

    // Card hover effects
    var cards = document.querySelectorAll('.health-card');
    cards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Loading states for forms
    var submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var form = this.closest('form');
            if (form && form.checkValidity()) {
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Saving...';
                this.disabled = true;
                
                // Re-enable after 5 seconds as fallback
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = this.getAttribute('data-original-text') || 'Submit';
                }, 5000);
            }
        });
    });

    // Store original button text
    submitButtons.forEach(function(button) {
        button.setAttribute('data-original-text', button.innerHTML);
    });

    // Search functionality (if needed)
    var searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            var searchTerm = this.value.toLowerCase();
            var searchTargets = document.querySelectorAll('[data-searchable]');
            
            searchTargets.forEach(function(target) {
                var text = target.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    target.style.display = '';
                } else {
                    target.style.display = 'none';
                }
            });
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + K to focus search (if search exists)
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            var searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                event.preventDefault();
                searchInput.focus();
            }
        }

        // Escape to close modals
        if (event.key === 'Escape') {
            var openModal = document.querySelector('.modal.show');
            if (openModal) {
                var bsModal = bootstrap.Modal.getInstance(openModal);
                if (bsModal) {
                    bsModal.hide();
                }
            }
        }
    });

    // Print functionality
    window.printSummary = function() {
        window.print();
    };

    // Date input defaults
    var dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(function(input) {
        if (!input.value && input.hasAttribute('data-default-today')) {
            input.value = new Date().toISOString().split('T')[0];
        }
    });

    // Initialize Feather icons if available
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Tab navigation with arrow keys
    var tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
    tabButtons.forEach(function(button, index) {
        button.addEventListener('keydown', function(event) {
            var currentIndex = Array.from(tabButtons).indexOf(this);
            var nextIndex;

            if (event.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % tabButtons.length;
                event.preventDefault();
            } else if (event.key === 'ArrowLeft') {
                nextIndex = currentIndex === 0 ? tabButtons.length - 1 : currentIndex - 1;
                event.preventDefault();
            }

            if (nextIndex !== undefined) {
                tabButtons[nextIndex].focus();
                tabButtons[nextIndex].click();
            }
        });
    });

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                var loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log('Page load time:', loadTime + 'ms');
            }, 0);
        });
    }

    // Error handling for images
    var images = document.querySelectorAll('img');
    images.forEach(function(img) {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });

    console.log('Health Tracker app initialized successfully');
});

// Utility functions
window.HealthTracker = {
    // Format date for display
    formatDate: function(dateString) {
        var date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Show notification
    showNotification: function(message, type = 'info') {
        var alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        var container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
            
            // Auto-dismiss after 5 seconds
            setTimeout(function() {
                if (alertDiv.parentNode) {
                    var bsAlert = new bootstrap.Alert(alertDiv);
                    bsAlert.close();
                }
            }, 5000);
        }
    },

    // Validate form data
    validateForm: function(form) {
        var isValid = true;
        var requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(function(field) {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        return isValid;
    }
};
