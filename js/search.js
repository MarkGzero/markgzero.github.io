// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    // Check if search elements exist
    if (!searchInput || !searchResults) {
        console.warn('Search elements not found');
        return;
    }
    
    let searchData = [];
    let searchReady = false;

    // Fetch search data (posts)
    async function loadSearchData() {
        const searchPaths = [
            '/search.json',
            './search.json',
            '../search.json',
            window.location.pathname + 'search.json'
        ];
        
        for (const path of searchPaths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        searchData = data;
                        searchReady = true;
                        console.log('Search data loaded successfully:', data.length, 'posts');
                        return;
                    }
                }
            } catch (error) {
                // Silent fail, try next path
            }
        }
        
        // If JSON loading fails, create fallback search data from the page
        createFallbackSearchData();
    }

    // Create fallback search data from page content (when JSON isn't available)
    function createFallbackSearchData() {
        console.log('Creating fallback search data from page content');
        searchData = [];
        
        // Try to extract post data from the page
        const postLinks = document.querySelectorAll('a[href*="/posts/"], a[href*="/blog/"], .post-preview a, .post-link');
        
        postLinks.forEach(link => {
            const title = link.textContent || link.innerText || '';
            const url = link.getAttribute('href') || '';
            const content = '';
            
            if (title.trim() && url.trim()) {
                searchData.push({
                    title: title.trim(),
                    url: url,
                    content: content,
                    tags: ''
                });
            }
        });
        
        // Add sample data based on your actual posts for immediate testing
        const samplePosts = [
            {
                title: "PowerShell Get-Member Essentials",
                url: "/2025/11/02/powershell-get-member-essentials.html",
                content: "Learn about PowerShell Get-Member cmdlet for exploring object properties and methods. Essential for understanding PowerShell objects.",
                tags: "powershell cmdlet objects get-member"
            },
            {
                title: "Getting Started with mpremote",
                url: "/2025/08/12/getting-started-with-mpremote.html", 
                content: "Introduction to mpremote tool for MicroPython development and device management",
                tags: "micropython development mpremote"
            },
            {
                title: "PSGadget Glyph Usage", 
                url: "/2025/05/04/psgadget-glyph.html",
                content: "Using PSGadget for PowerShell UI components and glyph display",
                tags: "powershell psgadget ui glyph"
            },
            {
                title: "Footpedal Interface Development",
                url: "/2025/05/10/footpedal-interface.html", 
                content: "Creating interfaces for footpedal input devices with PowerShell",
                tags: "powershell interface footpedal hardware"
            },
            {
                title: "List TCP Connections",
                url: "/2025/04/07/list-tcp-connections.html",
                content: "How to list and manage TCP connections using PowerShell networking cmdlets",
                tags: "powershell networking tcp connections"
            },
            {
                title: "Enabling PSRemoting", 
                url: "/2025/03/25/enabling-psremoting.html",
                content: "Step by step guide to enable PowerShell remoting for remote management",
                tags: "powershell remoting psremoting remote"
            },
            {
                title: "Use WinEvent to Check Windows Updates",
                url: "/2025/03/24/Use-WinEvent-Check-WSUpdates.html",
                content: "Using Get-WinEvent cmdlet to check Windows Update history and status",
                tags: "powershell winevent windows updates"
            },
            {
                title: "Get Software List from Registry",
                url: "/2025/03/24/get-software-list-from-registry.html",
                content: "Extract installed software information from Windows registry using PowerShell",
                tags: "powershell registry software list"
            }
        ];
        
        // Merge sample posts with any found links, avoiding duplicates
        samplePosts.forEach(post => {
            const exists = searchData.some(existing => 
                existing.title.toLowerCase() === post.title.toLowerCase() || 
                existing.url === post.url
            );
            if (!exists) {
                searchData.push(post);
            }
        });
        
        searchReady = true;
        console.log('Fallback search data created:', searchData.length, 'items');
    }

    // Perform search
    function performSearch(query) {
        if (!query || query.length < 2) {
            hideSearchResults();
            return;
        }

        if (!searchReady || searchData.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Search initializing...</div>';
            showSearchResults();
            // Try to load search data again
            loadSearchData();
            return;
        }

        const results = searchData.filter(post => {
            const searchText = `${post.title} ${post.content} ${post.tags}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        }).slice(0, 5); // Limit to 5 results

        displaySearchResults(results, query);
    }
    }

    // Display search results
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No posts found for "' + query + '"</div>';
        } else {
            const resultsHtml = results.map(post => {
                return `
                    <div class="search-result-item">
                        <a href="${post.url}" class="search-result-link">
                            <div class="search-result-title">${highlightText(post.title, query)}</div>
                            <div class="search-result-excerpt">${highlightText(truncateText(post.content, 100), query)}</div>
                        </a>
                    </div>
                `;
            }).join('');
            searchResults.innerHTML = resultsHtml;
        }
        showSearchResults();
    }

    // Highlight search terms
    function highlightText(text, query) {
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Escape regex special characters
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Truncate text
    function truncateText(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    // Show/hide search results
    function showSearchResults() {
        searchResults.style.display = 'block';
    }

    function hideSearchResults() {
        searchResults.style.display = 'none';
    }

    // Event listeners
    if (searchInput) {
        // Add a visual indicator that search is working
        searchInput.addEventListener('input', debounce(function(e) {
            const query = e.target.value;
            console.log('Search input detected:', query); // Temporary debug
            performSearch(query);
        }, 300));

        searchInput.addEventListener('focus', function() {
            console.log('Search field focused'); // Temporary debug
            if (this.value.length >= 2) {
                showSearchResults();
            }
        });
        
        // Add keydown handler for immediate feedback
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    } else {
        console.error('Search input element not found');
    }

    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-box')) {
            hideSearchResults();
        }
    });

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Load search data on page load and set up search
    console.log('Initializing search functionality...');
    loadSearchData();
    
    // Also try to initialize search after a short delay in case DOM isn't fully ready
    setTimeout(function() {
        if (!searchReady) {
            console.log('Retrying search data load...');
            loadSearchData();
        }
    }, 1000);
});