let allModels = [];
let currentIndex = 0;
let loadingMore = false;
let browseConfig = null;

// Initialize browse section
async function initBrowse() {
    try {
        const response = await fetch('/config-browse.json');
        const data = await response.json();
        
        // Store the configuration
        browseConfig = data;
        
        // Get the grid container
        const grid = document.getElementById('browse-grid');
        if (!grid) return;
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Store all models
        allModels = data.randomizeLayout ? shuffleArray(data.models) : [...data.models];
        
        // Create and append loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'scroll-loader';
        loadingIndicator.style.textAlign = 'center';
        loadingIndicator.style.padding = '20px';
        loadingIndicator.style.color = '#808080';
        loadingIndicator.textContent = 'Loading more...';
        grid.appendChild(loadingIndicator);
        
        // Load initial batch
        loadMoreItems(grid);
        
        // Setup infinite scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !loadingMore && currentIndex < allModels.length) {
                    loadMoreItems(grid);
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        // Observe the loading indicator
        observer.observe(loadingIndicator);
    } catch (error) {
        console.error('Error loading browse section:', error);
    }
}

// Helper function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Load more items
function loadMoreItems(container) {
    if (loadingMore) return;
    loadingMore = true;
    
    const batchSize = currentIndex === 0 ? 
        browseConfig.initialBatchSize : 
        browseConfig.batchSize;
    
    const endIndex = Math.min(currentIndex + batchSize, allModels.length);
    const batch = allModels.slice(currentIndex, endIndex);
    
    batch.forEach(model => {
        const item = document.createElement('div');
        item.className = 'browse-item';
        
        const link = document.createElement('a');
        link.href = model.link;
        link.target = '_blank';
        
        const img = document.createElement('img');
        img.src = model.thumb;
        img.alt = model.title || '';
        img.loading = 'lazy';
        
        const title = document.createElement('div');
        title.className = 'browse-item-title';
        title.textContent = model.title || '';
        
        link.appendChild(img);
        link.appendChild(title);
        item.appendChild(link);
        
        container.insertBefore(item, container.lastChild);
    });
    
    currentIndex = endIndex;
    loadingMore = false;
    
    // Hide loading indicator if we've loaded all items
    if (currentIndex >= allModels.length) {
        const loader = document.getElementById('scroll-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initBrowse); 