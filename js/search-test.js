// Test script to verify search functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Search Test Script ===');
    
    // Check if search elements exist
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    console.log('Search input element:', searchInput);
    console.log('Search results element:', searchResults);
    
    if (searchInput) {
        console.log('✓ Search input found');
        console.log('Input placeholder:', searchInput.placeholder);
        console.log('Input type:', searchInput.type);
        
        // Test if we can focus it
        searchInput.addEventListener('focus', function() {
            console.log('✓ Search input can be focused');
        });
        
        // Test typing
        searchInput.addEventListener('input', function() {
            console.log('✓ Search input responds to typing, value:', this.value);
        });
        
    } else {
        console.log('✗ Search input NOT found');
    }
    
    if (searchResults) {
        console.log('✓ Search results element found');
    } else {
        console.log('✗ Search results element NOT found');
    }
    
    // Test if search.js is loaded
    if (typeof performSearch !== 'undefined') {
        console.log('✓ Search functions are available');
    } else {
        console.log('✗ Search functions not available');
    }
    
    console.log('=== End Search Test ===');
});