// Enhanced UX features
document.addEventListener('DOMContentLoaded', function() {
    initScrollToTop();
    initReadingProgress();
    initSmoothScrolling();
    initKeyboardShortcuts();
    initLazyLoading();
});

// Scroll to top functionality
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.id = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="fa fa-arrow-up"></i>';
    scrollButton.title = 'Back to top';
    scrollButton.style.display = 'none';
    document.body.appendChild(scrollButton);

    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    });
}

// Reading progress indicator
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', updateReadingProgress);
    window.addEventListener('resize', updateReadingProgress);
}

function updateReadingProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl/Cmd + B to toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
        
        // Home key to scroll to top
        if (e.key === 'Home' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Show keyboard shortcuts help with ?
        if (e.key === '?' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            showKeyboardShortcuts();
        }
    });
}

// Show keyboard shortcuts modal
function showKeyboardShortcuts() {
    const modal = document.createElement('div');
    modal.className = 'shortcuts-modal';
    modal.innerHTML = `
        <div class="shortcuts-content">
            <div class="shortcuts-header">
                <h3><i class="fa fa-keyboard-o"></i> Keyboard Shortcuts</h3>
                <button class="shortcuts-close" onclick="this.closest('.shortcuts-modal').remove()">&times;</button>
            </div>
            <div class="shortcuts-body">
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>K</kbd>
                    <span>Focus search</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>B</kbd>
                    <span>Toggle sidebar</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>Home</kbd>
                    <span>Scroll to top</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Esc</kbd>
                    <span>Close sidebar/search</span>
                </div>
                <div class="shortcut-item">
                    <kbd>?</kbd>
                    <span>Show this help</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }
}

// Enhanced mobile menu handling
function enhanceMobileMenu() {
    const navbar = document.querySelector('.navbar-collapse');
    const navbarToggle = document.querySelector('.navbar-toggle');
    
    if (navbar && navbarToggle) {
        // Close mobile menu when clicking on a link
        const navLinks = navbar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 768) {
                    navbar.classList.remove('in');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 768 && 
                !navbar.contains(e.target) && 
                !navbarToggle.contains(e.target) && 
                navbar.classList.contains('in')) {
                navbar.classList.remove('in');
            }
        });
    }
}

// Initialize enhanced mobile menu
document.addEventListener('DOMContentLoaded', enhanceMobileMenu);

// Sidebar functionality
function toggleSidebar() {
    const sidebar = document.getElementById('left-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('left-sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
}

// Archive month toggle
document.addEventListener('DOMContentLoaded', function() {
    const archiveLinks = document.querySelectorAll('.archive-link');
    archiveLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const monthId = 'month-' + this.dataset.month;
            const monthPosts = document.getElementById(monthId);
            if (monthPosts) {
                monthPosts.style.display = monthPosts.style.display === 'none' ? 'block' : 'none';
                this.parentElement.classList.toggle('expanded');
            }
        });
    });
});

// Sidebar search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('sidebar-search-input');
    const searchResults = document.getElementById('sidebar-search-results');
    
    if (!searchInput) return;
    
    // Search data will be populated by Jekyll template
    const searchData = [
        {% for post in site.posts %}
        {
            title: {{ post.title | jsonify }},
            url: {{ post.url | relative_url | jsonify }},
            date: {{ post.date | date: "%B %d, %Y" | jsonify }},
            content: {{ post.content | strip_html | downcase | jsonify }}
        }
        {% endfor %}
    ];
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query.length < 3) {
            searchResults.innerHTML = '';
            return;
        }
        
        const results = searchData.filter(post => 
            post.title.toLowerCase().includes(query) || 
            post.content.includes(query)
        ).slice(0, 8);
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No posts found</div>';
            return;
        }
        
        searchResults.innerHTML = results.map(post => `
            <a href="${post.url}" class="search-result-item">
                <div class="result-title">${post.title}</div>
                <div class="result-date">${post.date}</div>
            </a>
        `).join('');
    });
});