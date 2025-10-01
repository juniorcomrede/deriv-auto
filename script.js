// =======================================================
// CSV URL (Use the link provided from 'Publish to the web' as CSV)
// =======================================================
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRiruKcaG_uOrw4Jopnd120308aLmHeOvJEVLuNHtqwYVGGYy3D_FGTilfu8KFGq5A4Hqc_9Jh5e-hY/pub?gid=771466171&single=true&output=csv"; 

// =======================================================
// Data Fetching and Rendering (Using PapaParse for CSV)
// =======================================================

document.addEventListener('DOMContentLoaded', fetchProducts);

/**
 * Fetches product data using PapaParse to handle the published CSV URL.
 */
function fetchProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '<p class="loading">Loading products...</p>';

    Papa.parse(CSV_URL, {
        download: true, // Fetch the URL
        header: true,   // Convert first row to object keys (headers)
        skipEmptyLines: true,
        complete: function(results) {
            // Filter out any rows where the product name is missing
            const products = results.data.filter(p => p['Product Name'] && p['Product Name'].trim() !== '');
            
            if (products.length === 0) {
                productList.innerHTML = '<p class="error">No products found in the sheet or the data is empty.</p>';
                return;
            }

            productList.innerHTML = ''; // Clear the loading message
            
            // OPTIONAL: Temporary log to verify data structure
            // console.log("Fetched Products:", products[0]); 

            products.forEach(product => {
                // The object properties now match your column headers (e.g., product['Product Name'])
                productList.appendChild(createProductCard(product));
            });
        },
        error: function(error) {
            console.error("Failed to fetch product data:", error);
            productList.innerHTML = `<p class="error">Error loading products. Check console for details. </p>`;
        }
    });
}


/**
 * Creates the HTML card element for a single product.
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Access properties directly by the column header name (e.g., product['Price'])
    const priceDisplay = product['Price']
        ? `<span class="price">₹${product['Price']}</span>`
        : '';
    const cutOffDisplay = (product['Cut-Off Price'] && product['Cut-Off Price'] !== product['Price'])
        ? `<span class="cut-off-price">₹${product['Cut-Off Price']}</span>`
        : '';

    // Features (take the first one for the short info)
    const shortInfo = product['Features'] ? product['Features'].split(';')[0].trim() : '';

    // Offer Tag
    const offerTag = product['Offer Tag'] ? `<div class="offer-tag">${product['Offer Tag']}</div>` : '';
    
    // ⬇️ 🚨 FIX APPLIED HERE 🚨 ⬇️
    // Use the link from the 'Buy Link' column to match your Google Sheet header.
    const detailLink = product['Buy Link'] || '#';

    card.innerHTML = `
        <div class="card-image-container">
            <img src="${product['Image URL'] || 'placeholder.png'}" alt="${product['Product Name']}" class="product-image">
            ${offerTag}
        </div>
        <div class="card-details">
            <h3 class="product-name">${product['Product Name']}</h3>
            <p class="product-short-info">${shortInfo}</p>
            <div class="price-section">
                ${priceDisplay}
                ${cutOffDisplay}
            </div>
            <a href="${detailLink}" class="buy-button">View / Buy</a>
        </div>
    `;
    return card;
}