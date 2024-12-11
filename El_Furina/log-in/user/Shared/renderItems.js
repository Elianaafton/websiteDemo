// Function to render items by genre or all items
function renderItemsByGenre(targetContainerId, genreFilter = null) {
    const storedItems = JSON.parse(localStorage.getItem("storeItems")) || [];
    const container = document.getElementById(targetContainerId);
    container.innerHTML = ""; // Clear container

    const filteredItems = genreFilter
        ? storedItems.filter(item => item.genre === genreFilter)
        : storedItems; // Show all items if no filter

    if (filteredItems.length === 0) {
        container.innerHTML = "<p>No items available in this category.</p>";
        return;
    }

    filteredItems.forEach(item => {
        const itemBox = document.createElement("div");
        itemBox.classList.add("box");
        itemBox.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="border-radius: 5px; width: 100%; height: auto;">
            <h3 class="product-name">${item.title}</h3>
            <p>${item.description}</p>
            <div class="price">$${item.price.toFixed(2)}</div>
            <div class="genre">Genre: ${item.genre}</div>
            <button class="add-to-cart-btn" style="padding: 10px 20px; background-color: orange; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Add to Cart
            </button>
        `;

        container.appendChild(itemBox);
    });
}

// For the "New Releases" page, render all items
document.addEventListener("DOMContentLoaded", () => {
    const newReleaseContainer = document.getElementById("new-release-items");
    if (newReleaseContainer) {
        renderItemsByGenre("new-release-items");
    }

    // Example: For genre-specific pages
    const genreContainer = document.getElementById("genre-items");
    if (genreContainer) {
        const genreFilter = genreContainer.getAttribute("data-genre");
        renderItemsByGenre("genre-items", genreFilter);
    }
});











// Function to render items by genre or all items
function renderItemsByGenre(targetContainerId, genreFilter = null, searchQuery = "") {
    const storedItems = JSON.parse(localStorage.getItem("storeItems")) || [];
    const container = document.getElementById(targetContainerId);
    container.innerHTML = ""; // Clear container

    // Filter items by genre and search query
    const filteredItems = storedItems.filter(item => {
        const matchesGenre = genreFilter ? item.genre === genreFilter : true;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGenre && matchesSearch;
    });

    if (filteredItems.length === 0) {
        container.innerHTML = "<p>No items match your search.</p>";
        return;
    }

    // Render filtered items
    filteredItems.forEach(item => {
        const itemBox = document.createElement("div");
        itemBox.classList.add("box");
        itemBox.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="border-radius: 5px; width: 100%; height: auto;">
            <h3 class="product-name">${item.title}</h3>
            <p>${item.description}</p>
            <div class="price">$${item.price.toFixed(2)}</div>
            <div class="genre">Genre: ${item.genre}</div>
            <button class="add-to-cart-btn" style="padding: 10px 20px; background-color: orange; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Add to Cart
            </button>
        `;

        itemBox.querySelector(".add-to-cart-btn").addEventListener("click", () => addToCart(item));

        container.appendChild(itemBox);
    });
}

// Attach search functionality
document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("search-box");

    // For the "New Releases" page
    const newReleaseContainer = document.getElementById("new-release-items");
    if (newReleaseContainer) {
        searchBox.addEventListener("input", () => {
            const searchQuery = searchBox.value;
            renderItemsByGenre("new-release-items", null, searchQuery);
        });
    }

    // For genre-specific pages
    const genreContainer = document.getElementById("genre-items");
    if (genreContainer) {
        const genreFilter = genreContainer.getAttribute("data-genre");
        searchBox.addEventListener("input", () => {
            const searchQuery = searchBox.value;
            renderItemsByGenre("genre-items", genreFilter, searchQuery);
        });
    }

    // Initial rendering
    if (newReleaseContainer) {
        renderItemsByGenre("new-release-items");
    }
    if (genreContainer) {
        const genreFilter = genreContainer.getAttribute("data-genre");
        renderItemsByGenre("genre-items", genreFilter);
    }
});




