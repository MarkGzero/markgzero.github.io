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

    // Fetch search data (posts)
    async function loadSearchData() {
        try {
            const response = await fetch('/search.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            searchData = await response.json();
        } catch (error) {
            console.warn('Search data not available:', error);
            // Try alternative path
            try {
                const altResponse = await fetch('./search.json');
                if (altResponse.ok) {
                    searchData = await altResponse.json();
                }
            } catch (altError) {
                console.warn('Alternative search path also failed:', altError);
            }
        }
    }

    // Perform search
    function performSearch(query) {
        if (!query || query.length < 2) {
            hideSearchResults();
            return;
        }

        if (searchData.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Search data loading...</div>';
            showSearchResults();
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
            searchResults.innerHTML = '<div class="search-no-results">No posts found</div>';
        } else {
            searchResults.innerHTML = results.map(post => `
                <div class="search-result-item">
                    <a href="${post.url}" class="search-result-link">
                        <div class="search-result-title">${highlightText(post.title, query)}</div>
                        <div class="search-result-excerpt">${highlightText(truncateText(post.content, 100), query)}</div>
                    </a>
                </div>
            `).join('');
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
        searchInput.addEventListener('input', debounce(function(e) {
            performSearch(e.target.value);
        }, 300));

        searchInput.addEventListener('focus', function() {
            if (this.value.length >= 2) {
                showSearchResults();
            }
        });
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

    // Load search data on page load
    loadSearchData();
});