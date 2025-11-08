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
        // First try to load the processed search.json
        const searchPaths = [
            '/search.json',
            './search.json',
            '../search.json',
            'search.json'
        ];
        
        for (const path of searchPaths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        searchData = data;
                        searchReady = true;
                        console.log('Search data loaded from JSON:', data.length, 'posts');
                        return;
                    }
                }
            } catch (error) {
                console.log(`Failed to load from ${path}:`, error.message);
            }
        }
        
        console.log('JSON loading failed, using fallback search data');
        // If JSON loading fails, use our comprehensive fallback data
        searchData = [
            {
                "title": "Getting Started with mpremote",
                "url": "/2025/08/12/getting-started-with-mpremote.html",
                "date": "2025-08-12",
                "content": "A comprehensive guide to using mpremote for MicroPython development. Learn how to connect, run scripts, and manage files on your MicroPython devices remotely.",
                "excerpt": "mpremote is a powerful command-line tool for working with MicroPython devices. This post covers installation, basic usage, and advanced features for remote MicroPython development."
            },
            {
                "title": "PowerShell Get-Member Essentials",
                "url": "/2025/11/02/powershell-get-member-essentials.html", 
                "date": "2025-11-02",
                "content": "Master the Get-Member cmdlet in PowerShell to explore object properties and methods effectively.",
                "excerpt": "Learn how to use PowerShell's Get-Member cmdlet to discover object properties, methods, and structure for better scripting."
            },
            {
                "title": "PSGadget Glyph Development",
                "url": "/2025/05/04/psgadget-glyph.html",
                "date": "2025-05-04", 
                "content": "Creating custom glyph interfaces for PowerShell gadgets and visual elements.",
                "excerpt": "Develop custom glyphs and visual elements for PowerShell tools and interfaces."
            },
            {
                "title": "Footpedal Interface Development",
                "url": "/2025/05/10/footpedal-interface.html",
                "date": "2025-05-10",
                "content": "Building custom footpedal interfaces for enhanced productivity and accessibility.",
                "excerpt": "Learn to create footpedal interfaces for hands-free control and improved workflow efficiency."
            },
            {
                "title": "List TCP Connections with PowerShell", 
                "url": "/2025/04/07/list-tcp-connections.html",
                "date": "2025-04-07",
                "content": "How to enumerate and monitor TCP network connections using PowerShell cmdlets and techniques.",
                "excerpt": "Discover PowerShell methods for listing, monitoring, and analyzing TCP network connections."
            },
            {
                "title": "Enabling PSRemoting for Remote Management",
                "url": "/2025/03/25/enabling-psremoting.html", 
                "date": "2025-03-25",
                "content": "Configure PowerShell remoting for secure remote Windows management and automation.",
                "excerpt": "Step-by-step guide to enable and configure PowerShell remoting for remote Windows administration."
            },
            {
                "title": "Use WinEvent to Check Windows Updates",
                "url": "/2025/03/24/Use-WinEvent-Check-WSUpdates.html",
                "date": "2025-03-24", 
                "content": "Monitor Windows Update status and history using Get-WinEvent PowerShell cmdlet.",
                "excerpt": "Learn to track Windows Update installation status and troubleshoot update issues with PowerShell."
            },
            {
                "title": "Get Software List from Registry", 
                "url": "/2025/03/24/get-software-list-from-registry.html",
                "date": "2025-03-24",
                "content": "Extract installed software information directly from Windows registry using PowerShell.",
                "excerpt": "Query the Windows registry to retrieve comprehensive installed software lists with PowerShell."
            },
            {
                "title": "First Step - Blog Launch",
                "url": "/2025/03/23/first-step.html",
                "date": "2025-03-23",
                "content": "Welcome to my technical blog! This inaugural post covers the setup and goals for this development-focused blog.",
                "excerpt": "Introduction to the blog, covering topics like PowerShell, automation, and development tools."
            }
        ];
        searchReady = true;
        console.log('Using fallback search data:', searchData.length, 'posts');
    }

    // Search function
    function performSearch(query) {
        if (!searchReady || !query.trim()) {
            return [];
        }
        
        const searchTerm = query.toLowerCase();
        console.log('Searching for:', searchTerm);
        
        const results = searchData.filter(post => {
            const title = (post.title || '').toLowerCase();
            const content = (post.content || '').toLowerCase();
            const excerpt = (post.excerpt || '').toLowerCase();
            
            return title.includes(searchTerm) || 
                   content.includes(searchTerm) || 
                   excerpt.includes(searchTerm);
        });
        
        console.log('Search results:', results.length);
        return results.slice(0, 10); // Limit to 10 results
    }

    // Display search results
    function displaySearchResults(results, query) {
        const container = searchResults;
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-no-results">
                    <i class="fa fa-search"></i>
                    <p>No results found for "${escapeHtml(query)}"</p>
                </div>
            `;
            return;
        }
        
        const resultsHTML = results.map(post => `
            <div class="search-result-item">
                <h4><a href="${escapeHtml(post.url)}">${highlightText(escapeHtml(post.title), query)}</a></h4>
                <p class="search-result-excerpt">${highlightText(truncateText(escapeHtml(post.content || post.excerpt || ''), 150), query)}</p>
                <small class="search-result-date">${escapeHtml(post.date || '')}</small>
            </div>
        `).join('');
        
        container.innerHTML = resultsHTML;
    }

    // Helper functions
    function highlightText(text, query) {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function truncateText(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    function showSearchResults() {
        searchResults.style.display = 'block';
    }

    function hideSearchResults() {
        searchResults.style.display = 'none';
    }

    // Event handlers
    if (searchInput) {
        // Search on input
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length >= 2) {
                const results = performSearch(query);
                displaySearchResults(results, query);
                showSearchResults();
            } else {
                hideSearchResults();
            }
        });

        // Search on Enter key
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const query = this.value.trim();
                if (query) {
                    const results = performSearch(query);
                    displaySearchResults(results, query);
                    showSearchResults();
                }
            }
        });
    }

    // Search button handler
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function(event) {
            event.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                const results = performSearch(query);
                displaySearchResults(results, query);
                showSearchResults();
            }
        });
    }

    // Hide results when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.search-container')) {
            hideSearchResults();
        }
    });

    // Load search data when page loads
    loadSearchData();
});