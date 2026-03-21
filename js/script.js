// Debug mode
console.log('🚀 Script started loading...');

// Load products: спочатку з файлу products-data.js, потім localStorage, потім defaults
function loadProductsData() {
    // 1. Спочатку перевіряємо localStorage (адмін зміни)
    try {
        const savedProducts = localStorage.getItem('ikarden-products');
        if (savedProducts) {
            console.log('📦 Loading products from localStorage');
            return JSON.parse(savedProducts);
        }
    } catch (error) {
        console.error('❌ Error loading products from localStorage:', error);
        localStorage.removeItem('ikarden-products');
    }
    
    // 2. Потім дані з файлу products-data.js
    if (window.IKARDEN_PRODUCTS && window.IKARDEN_PRODUCTS.length > 0) {
        console.log('📦 Loading products from products-data.js file');
        return window.IKARDEN_PRODUCTS;
    }
    
    console.log('📦 Using default products');
    return [
        {
            id: 1,
            name: "Stůl z masivu dubu",
            description: "Robustní jídelní stůl z masivního dubu, ručně vyrobený",
            price: 12000,
            discount: 0,
            category: "stoly",
            isNew: true,
            images: [],
            video: ""
        },
        {
            id: 2,
            name: "Police na knihy",
            description: "Elegantní knihovna z dubového dřeva",
            price: 6500,
            discount: 0,
            category: "police",
            images: [],
            video: ""
        },
        {
            id: 3,
            name: "Židle dubová",
            description: "Pohodlná židle s čalouněným sedákem",
            price: 3500,
            discount: 10,
            category: "ostatni",
            images: [],
            video: ""
        },
        {
            id: 4,
            name: "Konferenční stolek",
            description: "Moderní konferenční stolek s úložným prostorem",
            price: 5800,
            discount: 0,
            category: "stoly",
            images: [],
            video: ""
        },
        {
            id: 5,
            name: "Skříň s posuvnými dveřmi",
            description: "Prostorná masivní skříň do ložnice",
            price: 18000,
            discount: 0,
            category: "skrine",
            images: [],
            video: ""
        },
        {
            id: 6,
            name: "Noční stolek",
            description: "Kompaktní noční stolek se zásuvkami",
            price: 2800,
            discount: 0,
            category: "stoly",
            images: [],
            video: ""
        }
    ];
}

let products = loadProductsData();

// SVG Icons for categories - Hand-drawn minimal style
const categoryIcons = {
    vse: '<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 25 L50 5 L80 25"/><line x1="20" y1="25" x2="20" y2="70"/><line x1="80" y1="25" x2="80" y2="70"/><line x1="35" y1="5" x2="50" y2="15"/><line x1="50" y1="15" x2="65" y2="5"/></svg>',
    stoly: '<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="15" y1="35" x2="85" y2="35"/><line x1="20" y1="35" x2="20" y2="75"/><line x1="80" y1="35" x2="80" y2="75"/></svg>',
    police: '<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="30" y1="15" x2="30" y2="75"/><line x1="70" y1="15" x2="70" y2="75"/><line x1="30" y1="30" x2="70" y2="30"/><line x1="30" y1="45" x2="70" y2="45"/><line x1="30" y1="60" x2="70" y2="60"/></svg>',
    skrine: '<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="15" width="60" height="55" rx="3"/><line x1="20" y1="42" x2="80" y2="42"/><circle cx="45" cy="28" r="2" fill="currentColor"/><circle cx="55" cy="28" r="2" fill="currentColor"/><circle cx="45" cy="56" r="2" fill="currentColor"/><circle cx="55" cy="56" r="2" fill="currentColor"/></svg>',
    kuchyne: '<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="10" width="80" height="25" rx="2"/><line x1="35" y1="10" x2="35" y2="35"/><line x1="60" y1="10" x2="60" y2="35"/><line x1="22" y1="22" x2="30" y2="22"/><line x1="47" y1="22" x2="53" y2="22"/><line x1="72" y1="22" x2="80" y2="22"/><rect x="10" y="45" width="80" height="25" rx="2"/><line x1="35" y1="45" x2="35" y2="70"/><line x1="60" y1="45" x2="60" y2="70"/><circle cx="22" cy="57" r="1.5" fill="currentColor"/><circle cx="47" cy="57" r="1.5" fill="currentColor"/><circle cx="72" cy="57" r="1.5" fill="currentColor"/></svg>',
    ostatni: '<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="40" r="25"/><line x1="50" y1="20" x2="50" y2="60"/><line x1="30" y1="40" x2="70" y2="40"/></svg>'
};

// Categories
const categories = [
    { id: 'vse', name: 'Vše' },
    { id: 'stoly', name: 'Stoly a stolky' },
    { id: 'police', name: 'Police' },
    { id: 'skrine', name: 'Skříně a komody' },
    { id: 'kuchyne', name: 'Kuchyně' },
    { id: 'ostatni', name: 'Ostatní' }
];

// Current filter
let currentCategory = 'vse';

console.log('📦 Products loaded:', products.length);

// Cart Management
let cart = [];

// Load cart from localStorage
function loadCart() {
    try {
        const savedCart = localStorage.getItem('ikarden-cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('🛒 Cart loaded from localStorage:', cart.length, 'items');
        }
    } catch (error) {
        console.error('❌ Error loading cart:', error);
        cart = [];
        localStorage.removeItem('ikarden-cart');
    }
    updateCartBadge();
}

// Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('ikarden-cart', JSON.stringify(cart));
        updateCartBadge();
        console.log('💾 Cart saved:', cart.length, 'items');
    } catch (error) {
        console.error('❌ Error saving cart:', error);
        if (error.name === 'QuotaExceededError') {
            alert('Košík je plný! Máte příliš mnoho položek.');
        }
    }
}

// Calculate final price with discount
function getFinalPrice(product) {
    if (product.discount && product.discount > 0) {
        return Math.round(product.price * (1 - product.discount / 100));
    }
    return product.price;
}

// Lightbox state
let currentLightboxProduct = null;
let currentLightboxImageIndex = 0;

// Open image in lightbox
function openLightbox(imageSrc, productName) {
    // Find product by name
    const product = products.find(p => p.name === productName);
    if (!product) return;
    
    // Determine which image was clicked
    const imageIndex = product.images ? product.images.indexOf(imageSrc) : 0;
    
    currentLightboxProduct = product;
    currentLightboxImageIndex = imageIndex >= 0 ? imageIndex : 0;
    
    updateLightboxContent();
    
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox) {
        console.error('❌ Lightbox element not found!');
        return;
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Update lightbox content
function updateLightboxContent() {
    if (!currentLightboxProduct) return;
    
    const product = currentLightboxProduct;
    const hasImages = product.images && product.images.length > 0;
    const images = hasImages ? product.images : [];
    const currentImage = images[currentLightboxImageIndex] || '';
    
    // Get all required elements
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxProductName = document.getElementById('lightboxProductName');
    const lightboxProductDescription = document.getElementById('lightboxProductDescription');
    const lightboxProductPrice = document.getElementById('lightboxProductPrice');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const dotsContainer = document.getElementById('lightboxDots');
    
    // Check if all elements exist
    if (!lightboxImage || !lightboxProductName || !lightboxProductDescription || !lightboxProductPrice) {
        console.error('❌ Lightbox elements not found!');
        return;
    }
    
    // Update image
    lightboxImage.src = currentImage;
    lightboxImage.alt = product.name;
    
    // Update product info
    lightboxProductName.textContent = product.name;
    lightboxProductDescription.textContent = product.description;
    
    // Update price
    const finalPrice = getFinalPrice(product);
    const hasDiscount = product.discount && product.discount > 0;
    const priceHTML = hasDiscount
        ? `<span class="old-price">${product.price.toLocaleString()} Kč</span>
           ${finalPrice.toLocaleString()} Kč
           <span class="discount-badge">-${product.discount}%</span>`
        : `${finalPrice.toLocaleString()} Kč`;
    
    lightboxProductPrice.innerHTML = priceHTML;
    
    // Update navigation buttons
    if (prevBtn && nextBtn) {
        if (images.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            prevBtn.disabled = currentLightboxImageIndex === 0;
            nextBtn.disabled = currentLightboxImageIndex === images.length - 1;
        }
    }
    
    // Update dots
    if (dotsContainer) {
        updateLightboxDots();
    }
}

// Update dots indicator
function updateLightboxDots() {
    const dotsContainer = document.getElementById('lightboxDots');
    if (!dotsContainer || !currentLightboxProduct) return;
    
    const images = currentLightboxProduct.images || [];
    
    if (images.length <= 1) {
        dotsContainer.innerHTML = '';
        return;
    }
    
    dotsContainer.innerHTML = images.map((_, index) => 
        `<span class="lightbox-dot ${index === currentLightboxImageIndex ? 'active' : ''}" 
               onclick="goToLightboxImage(${index})"></span>`
    ).join('');
}

// Navigate lightbox images
function navigateLightbox(direction) {
    const images = currentLightboxProduct.images || [];
    if (images.length <= 1) return;
    
    currentLightboxImageIndex += direction;
    currentLightboxImageIndex = Math.max(0, Math.min(currentLightboxImageIndex, images.length - 1));
    
    updateLightboxContent();
}

// Go to specific lightbox image
function goToLightboxImage(index) {
    currentLightboxImageIndex = index;
    updateLightboxContent();
}

// Close lightbox
function closeLightbox(event) {
    // Close only if clicked on overlay or close button
    if (event.target.id === 'imageLightbox' || 
        event.target.classList.contains('lightbox-close') ||
        event.target.parentElement.classList.contains('lightbox-close')) {
        const lightbox = document.getElementById('imageLightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        currentLightboxProduct = null;
        currentLightboxImageIndex = 0;
    }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        currentLightboxProduct = null;
        currentLightboxImageIndex = 0;
    } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
    }
});

// Render product image/video
function renderProductMedia(product) {
    const hasImages = product.images && product.images.length > 0;
    const hasVideo = product.video && product.video.length > 0;
    
    if (!hasImages && !hasVideo) {
        // No media - show placeholder
        return `
            <div class="product-media">
                <div class="product-image-placeholder">
                    ${product.name}
                </div>
            </div>
        `;
    }
    
    let html = '<div class="product-media">';
    
    if (hasImages) {
        if (product.images.length === 1) {
            // Single image with click to zoom
            html += `<img src="${product.images[0]}" 
                          alt="${product.name}" 
                          class="product-image-single" 
                          onclick="openLightbox('${product.images[0]}', '${product.name}')"
                          title="Klikněte pro zvětšení">`;
        } else {
            // Multiple images - create slider
            html += `
                <div class="product-slider" data-product-id="${product.id}">
                    <div class="slider-images">
                        ${product.images.map((img, index) => `
                            <img src="${img}" alt="${product.name} ${index + 1}" 
                                 class="slider-image ${index === 0 ? 'active' : ''}" 
                                 data-index="${index}"
                                 onclick="openLightbox('${img}', '${product.name}')"
                                 title="Klikněte pro zvětšení">
                        `).join('')}
                    </div>
                    <button class="slider-btn slider-prev" onclick="changeSlide(${product.id}, -1)">‹</button>
                    <button class="slider-btn slider-next" onclick="changeSlide(${product.id}, 1)">›</button>
                    <div class="slider-dots">
                        ${product.images.map((_, index) => `
                            <span class="slider-dot ${index === 0 ? 'active' : ''}" 
                                  onclick="goToSlide(${product.id}, ${index})"></span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    if (hasVideo) {
        html += `
            <video class="product-video" controls>
                <source src="${product.video}" type="video/mp4">
            </video>
        `;
    }
    
    html += '</div>';
    return html;
}

// Change slide in slider
function changeSlide(productId, direction) {
    const slider = document.querySelector(`[data-product-id="${productId}"]`);
    if (!slider) {
        console.error('❌ Slider not found for product:', productId);
        return;
    }
    
    const images = slider.querySelectorAll('.slider-image');
    const dots = slider.querySelectorAll('.slider-dot');
    
    if (images.length === 0) return;
    
    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    
    images[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    images[newIndex].classList.add('active');
    dots[newIndex].classList.add('active');
}

// Go to specific slide
function goToSlide(productId, index) {
    const slider = document.querySelector(`[data-product-id="${productId}"]`);
    if (!slider) return;
    
    const images = slider.querySelectorAll('.slider-image');
    const dots = slider.querySelectorAll('.slider-dot');
    
    if (images.length === 0 || index >= images.length) return;
    
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    images[index].classList.add('active');
    dots[index].classList.add('active');
}

// Render categories filter
function renderCategories() {
    const categoriesFilter = document.getElementById('categoriesFilter');
    if (!categoriesFilter) return;
    
    categoriesFilter.innerHTML = categories.map(cat => `
        <button 
            class="category-btn ${currentCategory === cat.id ? 'active' : ''}" 
            onclick="filterByCategory('${cat.id}')">
            <span class="category-icon">${categoryIcons[cat.id]}</span>
            <span class="category-name">${cat.name}</span>
        </button>
    `).join('');
    
    console.log('✅ Categories rendered');
}

// Filter products by category
function filterByCategory(categoryId) {
    currentCategory = categoryId;
    console.log('📋 Filtering by category:', categoryId);
    renderCategories();
    renderProducts();
}

// Get filtered products
function getFilteredProducts() {
    if (currentCategory === 'vse') {
        return products;
    }
    return products.filter(p => p.category === currentCategory);
}

// Render products - OPTIMIZED VERSION (no flickering)
function renderProducts() {
    console.log('🎨 Starting to render products...');
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) {
        console.error('❌ Products grid not found!');
        return;
    }
    
    // ✅ Get filtered products
    const filteredProducts = getFilteredProducts();
    
    // Show count
    console.log(`📋 Showing ${filteredProducts.length} products`);
    
    // ✅ Use DocumentFragment to prevent multiple reflows
    const fragment = document.createDocumentFragment();
    
    filteredProducts.forEach((product, index) => {
        console.log(`➕ Adding product ${index + 1}:`, product.name);
        
        const finalPrice = getFinalPrice(product);
        const hasDiscount = product.discount && product.discount > 0;
        
        // Create badges HTML
        let badgesHTML = '';
        if (hasDiscount) {
            badgesHTML += `<div class="sale-badge">-${product.discount}% SLEVA</div>`;
        }
        if (product.isNew) {
            badgesHTML += `<div class="new-badge">NOVINKA</div>`;
        }
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            ${badgesHTML}
            <div class="admin-controls">
                <button class="admin-edit-btn" onclick="openEditProductModal(${product.id})" title="Upravit produkt">Upravit</button>
                <button class="admin-delete-btn" onclick="deleteProductInline(${product.id})" title="Smazat produkt">Smazat</button>
            </div>
            ${renderProductMedia(product)}
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price-block">
                    ${hasDiscount ? `
                        <div class="product-price-old">${product.price.toLocaleString()} Kč</div>
                        <div class="product-price">${finalPrice.toLocaleString()} Kč <span class="discount-badge">-${product.discount}%</span></div>
                    ` : `
                        <div class="product-price">${finalPrice.toLocaleString()} Kč</div>
                    `}
                </div>
                <div class="product-buttons">
                    <button class="btn btn-primary product-btn" onclick="addToCart(${product.id})">
                        Přidat do košíku
                    </button>
                    <button class="btn btn-custom product-btn-custom" onclick="openCustomOrderModal(${product.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 4px; vertical-align: middle;">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="9" y1="15" x2="15" y2="15"/>
                            <line x1="12" y1="12" x2="12" y2="18"/>
                        </svg>
                        Na míru
                    </button>
                </div>
            </div>
        `;
        
        // Add to fragment instead of DOM
        fragment.appendChild(productCard);
    });
    
    // ✅ Clear and add all at once (only 2 reflows instead of 7)
    productsGrid.innerHTML = '';
    productsGrid.appendChild(fragment);
    
    console.log('✅ Products rendered successfully!');
}

// Add to cart
function addToCart(productId) {
    console.log('➕ Adding product to cart:', productId);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('❌ Product not found:', productId);
        return;
    }
    
    const finalPrice = getFinalPrice(product);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
        console.log('📦 Increased quantity for:', product.name);
    } else {
        cart.push({
            ...product,
            price: finalPrice, // Save with final discounted price
            quantity: 1
        });
        console.log('🆕 Added new item:', product.name);
    }
    
    saveCart();
    showNotification('Produkt přidán do košíku!');
}

// Open custom order modal
function openCustomOrderModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('customOrderModal');
    document.getElementById('customProductName').textContent = product.name;
    document.getElementById('customOrderProductId').value = productId;
    modal.classList.add('active');
}

// Close custom order modal
function closeCustomOrderModal() {
    const modal = document.getElementById('customOrderModal');
    modal.classList.remove('active');
    document.getElementById('customOrderForm').reset();
}

// Submit custom order
function submitCustomOrder(event) {
    event.preventDefault();
    
    const productId = parseInt(document.getElementById('customOrderProductId').value);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Produkt nenalezen!');
        return;
    }
    
    const orderData = {
        product: product.name,
        width: document.getElementById('orderWidth').value,
        height: document.getElementById('orderHeight').value,
        depth: document.getElementById('orderDepth').value,
        contact: document.getElementById('orderContact').value,
        email: document.getElementById('orderEmail').value,
        notes: document.getElementById('orderNotes').value,
        date: new Date().toISOString()
    };
    
    // Save to localStorage
    const customOrders = JSON.parse(localStorage.getItem('ikarden-custom-orders') || '[]');
    customOrders.push(orderData);
    localStorage.setItem('ikarden-custom-orders', JSON.stringify(customOrders));
    
    closeCustomOrderModal();
    showNotification('Objednávka odeslána! Brzy vás budeme kontaktovat.');
    
    console.log('📐 Custom order submitted:', orderData);
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return; // Element doesn't exist
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    console.log('🔢 Cart badge updated:', totalItems);
}

// Show cart modal
function showCart() {
    console.log('🛒 Opening cart modal...');
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Košík je prázdný</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} Kč</div>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-item-btn" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="cart-item-btn" onclick="increaseQuantity(${item.id})">+</button>
                    <button class="cart-item-btn remove" onclick="removeFromCart(${item.id})">×</button>
                </div>
            </div>
        `).join('');
    }
    
    updateCartTotal();
    modal.classList.add('active');
}

// Hide cart modal
function hideCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('active');
    console.log('🚪 Cart modal closed');
}

// Increase quantity
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        saveCart();
        showCart();
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity--;
        saveCart();
        showCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    showCart();
    console.log('🗑️ Item removed from cart');
}

// Clear cart
function clearCart() {
    if (confirm('Opravdu chcete vyprázdnit košík?')) {
        cart = [];
        saveCart();
        showCart();
        console.log('🧹 Cart cleared');
    }
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.getElementById('cartTotal');
    if (!totalElement) return;
    totalElement.textContent = `${total.toLocaleString()} Kč`;
}

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        alert('Košík je prázdný!');
        return;
    }
    window.location.href = 'checkout.html';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    console.log('📢 Notification:', message);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize on page load
console.log('⏳ Waiting for DOM to load...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM loaded! Initializing...');
    
    // Render categories
    renderCategories();
    
    // Render products
    renderProducts();
    
    // Load cart
    loadCart();
    
    // Cart icon click
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', showCart);
        console.log('✅ Cart icon listener added');
    }
    
    // Modal close
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', hideCart);
        console.log('✅ Modal close listener added');
    }
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
        console.log('✅ Clear cart listener added');
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', goToCheckout);
        console.log('✅ Checkout listener added');
    }
    
    // Close modal on outside click
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target.id === 'cartModal') {
                hideCart();
            }
        });
        console.log('✅ Modal outside click listener added');
    }
    
    // Custom order modal close
    const customModalClose = document.getElementById('customModalClose');
    if (customModalClose) {
        customModalClose.addEventListener('click', closeCustomOrderModal);
    }
    
    // Close custom modal on outside click
    const customModal = document.getElementById('customOrderModal');
    if (customModal) {
        customModal.addEventListener('click', (e) => {
            if (e.target.id === 'customOrderModal') {
                closeCustomOrderModal();
            }
        });
    }
    
    // Custom order form submit
    const customOrderForm = document.getElementById('customOrderForm');
    if (customOrderForm) {
        customOrderForm.addEventListener('submit', submitCustomOrder);
    }
    
    console.log('🎉 All initialization complete!');
    
    // Initialize additional features
    loadSavedTheme();
    initFAQ();
    loadGallery();
    initScrollTopButton();
});

console.log('✅ Script loaded completely!');

// ========================================
// NEW FUNCTIONALITY
// ========================================

// FAQ Accordion
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            
            // Close other items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current item
            faqItem.classList.toggle('active');
        });
    });
    console.log('✅ FAQ initialized');
}

// ========================================
// VALIDATION FUNCTIONS
// ========================================

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

// Validate phone (Czech format)
function validatePhone(phone) {
    const re = /^(\+?420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Validate number (positive)
function validateNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
}

// Show error on input
function showInputError(input, message) {
    const parent = input.parentElement;
    input.classList.add('input-error');
    input.classList.remove('input-valid');
    
    let errorSpan = parent.querySelector('.error-message');
    if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        parent.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
}

// Show success on input
function showInputSuccess(input) {
    const parent = input.parentElement;
    input.classList.add('input-valid');
    input.classList.remove('input-error');
    
    const errorSpan = parent.querySelector('.error-message');
    if (errorSpan) errorSpan.textContent = '';
}

// Clear validation
function clearInputValidation(input) {
    input.classList.remove('input-error', 'input-valid');
    const parent = input.parentElement;
    const errorSpan = parent.querySelector('.error-message');
    if (errorSpan) errorSpan.textContent = '';
}

// Newsletter Subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const form = event.target;
    const input = form.querySelector('input[type="email"]');
    const email = input.value.trim();
    const btn = form.querySelector('button');
    
    // Clear validation
    clearInputValidation(input);
    
    // Validate
    if (!email) {
        showInputError(input, 'Zadejte e-mail');
        return;
    }
    
    if (!validateEmail(email)) {
        showInputError(input, 'Neplatn\u00fd form\u00e1t e-mailu');
        return;
    }
    
    showInputSuccess(input);
    
    // Disable button
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Odes\u00edl\u00e1m...';
    
    try {
        // Save to localStorage
        const subscribers = JSON.parse(localStorage.getItem('ikarden-subscribers') || '[]');
        
        // Check if already subscribed
        if (subscribers.find(s => s.email === email)) {
            alert('Tento e-mail je již přihlášen k odběru! ✅');
            return;
        }
        
        subscribers.push({
            email: email,
            date: new Date().toISOString()
        });
        
        localStorage.setItem('ikarden-subscribers', JSON.stringify(subscribers));
        
        showNotification('\u2705 D\u011bkujeme za p\u0159ihl\u00e1\u0161en\u00ed k odb\u011bru!');
        form.reset();
        clearInputValidation(input);
        
        console.log('\ud83d\udce7 New subscriber:', email);
    } catch (error) {
        console.error('\u274c Newsletter error:', error);
        showInputError(input, 'Chyba p\u0159i odes\u00edl\u00e1n\u00ed');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

// ============================================
// PROJECTS MANAGEMENT SYSTEM
// ============================================

// Load projects from localStorage
function loadProjectsData() {
    try {
        const saved = localStorage.getItem('ikarden-projects');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('❌ Error loading projects:', error);
    }
    return [];
}

// Save projects to localStorage
function saveProjectsData(projects) {
    try {
        localStorage.setItem('ikarden-projects', JSON.stringify(projects));
        console.log('✅ Projects saved');
        return true;
    } catch (error) {
        console.error('❌ Error saving projects:', error);
        return false;
    }
}

// Add new project
function addProject(projectData) {
    const projects = loadProjectsData();
    const newProject = {
        id: Date.now(),
        title: projectData.title,
        description: projectData.description,
        location: projectData.location,
        date: projectData.date || new Date().toISOString(),
        images: projectData.images || [],
        videos: projectData.videos || [],
        created: new Date().toISOString()
    };
    
    projects.push(newProject);
    saveProjectsData(projects);
    return newProject;
}

// Update project
function updateProject(projectId, updates) {
    const projects = loadProjectsData();
    const index = projects.findIndex(p => p.id === projectId);
    
    if (index !== -1) {
        projects[index] = { ...projects[index], ...updates };
        saveProjectsData(projects);
        return projects[index];
    }
    return null;
}

// Delete project
function deleteProject(projectId) {
    const projects = loadProjectsData();
    const filtered = projects.filter(p => p.id !== projectId);
    saveProjectsData(filtered);
    return true;
}

// Load Gallery
function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    const projects = loadProjectsData();
    
    // КНОПКА ДОДАВАННЯ НОВОГО ПРОЕКТУ (ТІЛЬКИ В ADMIN РЕЖИМІ)
    const addProjectBtn = isAdminMode ? `
        <div class="gallery-item" style="cursor: pointer; border: 3px dashed var(--accent-primary); display: flex; align-items: center; justify-content: center; min-height: 300px; background: var(--bg-secondary);" onclick="window.location.href='admin-project-edit.html'">
            <div style="text-align: center; color: var(--accent-primary);">
                <div style="font-size: 48px; margin-bottom: 10px;">➕</div>
                <div style="font-size: 18px; font-weight: 600;">Nový projekt</div>
                <div style="font-size: 14px; color: var(--text-muted); margin-top: 5px;">Klikněte pro přidání</div>
            </div>
        </div>
    ` : '';
    
    if (projects.length === 0) {
        galleryGrid.innerHTML = addProjectBtn + `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                <p style="font-size: 18px; margin-bottom: 10px;">📸 Zatím nemáme žádné projekty</p>
                <p style="font-size: 14px;">Přidejte první projekt v admin panelu</p>
            </div>
        `;
        return;
    }
    
    galleryGrid.innerHTML = addProjectBtn + projects.map(project => {
        const firstImage = project.images && project.images[0] ? project.images[0] : '';
        const hasVideo = project.videos && project.videos.length > 0;
        
        return `
            <div class="gallery-item" onclick="openProjectDetail(${project.id})">
                <div class="admin-controls" onclick="event.stopPropagation()">
                    <button class="admin-edit-btn" onclick="openEditProjectModal(${project.id}); event.stopPropagation();" title="Upravit projekt">Upravit</button>
                    <button class="admin-delete-btn" onclick="deleteProjectInline(${project.id}); event.stopPropagation();" title="Smazat projekt">Smazat</button>
                </div>
                ${firstImage ? `
                    <img src="${firstImage}" alt="${project.title}">
                ` : `
                    <div class="gallery-placeholder">
                        <span style="font-size: 48px;">📁</span>
                    </div>
                `}
                ${hasVideo ? '<div class="video-badge">🎥</div>' : ''}
                <div class="gallery-overlay">
                    <h3>${project.title}</h3>
                    <p>${project.location || ''}</p>
                    ${project.date ? `<p class="project-date">${new Date(project.date).toLocaleDateString('cs-CZ')}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    console.log('✅ Gallery loaded:', projects.length, 'projects');
}

// Open project detail modal
function openProjectDetail(projectId) {
    const projects = loadProjectsData();
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="project-modal-content">
            <button class="project-modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            <h2>${project.title}</h2>
            <p class="project-meta">${project.location || ''} • ${new Date(project.date).toLocaleDateString('cs-CZ')}</p>
            
            ${project.description ? `<p class="project-description">${project.description}</p>` : ''}
            
            ${project.images && project.images.length > 0 ? `
                <div class="project-images-grid">
                    ${project.images.map((img, i) => `
                        <img src="${img}" alt="${project.title} ${i+1}" onclick="openLightbox('${img}', '${project.title.replace(/'/g, "\\'")}')">
                    `).join('')}
                </div>
            ` : ''}
            
            ${project.videos && project.videos.length > 0 ? `
                <div class="project-videos">
                    ${project.videos.map(video => `
                        <video controls>
                            <source src="${video}" type="video/mp4">
                        </video>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Scroll to Top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
function initScrollTopButton() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    console.log('✅ Scroll to top button initialized');
}

// ============================================
// ADMIN MODE WITH INLINE EDITING
// ============================================

let isAdminMode = false;
let editingProduct = null;
let editingProject = null;

// Admin login - DEVELOPMENT MODE (БЕЗ ПАРОЛЯ)
function showAdminLogin() {
    // Перевірка чи вже в admin режимі
    const isLoggedIn = localStorage.getItem('ikarden-admin-logged-in');
    
    if (isLoggedIn === 'true') {
        // Вже увійшли - переключити режим
        toggleAdminMode();
        return;
    }
    
    // РЕЖИМ РОЗРОБКИ: Одразу активувати admin БЕЗ логіну
    localStorage.setItem('ikarden-admin-logged-in', 'true');
    toggleAdminMode();
    showNotification('🔓 Admin режим активовано (режим розробки)');
    console.log('🔓 Admin mode activated without password (development mode)');
}

// Close admin login
function closeAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.remove();
}

// Login admin
function loginAdmin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    // Simple authentication (in production, use server-side auth)
    // Default credentials: admin / admin123
    if (username === 'admin' && password === 'admin123') {
        // Success
        localStorage.setItem('ikarden-admin-logged-in', 'true');
        closeAdminLogin();
        showNotification('✅ Úspěšně přihlášeno!');
        
        // Activate admin mode
        setTimeout(() => {
            toggleAdminMode();
        }, 500);
    } else {
        // Failed
        errorDiv.textContent = '❌ Nesprávné uživatelské jméno nebo heslo';
        errorDiv.style.display = 'block';
        
        // Clear after 3 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

// Logout admin
function logoutAdmin() {
    if (confirm('Opravdu se chcete odhlásit?')) {
        localStorage.removeItem('ikarden-admin-logged-in');
        isAdminMode = false;
        document.body.classList.remove('admin-mode');
        const adminBtn = document.getElementById('adminBtnText');
        if (adminBtn) adminBtn.textContent = '🔧 Admin';
        showNotification('🚪 Odhlášeno');
        renderProducts();
        loadGallery();
    }
}

// Toggle admin mode
function toggleAdminMode() {
    isAdminMode = !isAdminMode;
    const body = document.body;
    const adminBtn = document.getElementById('adminBtnText');
    
    if (isAdminMode) {
        body.classList.add('admin-mode');
        if (adminBtn) adminBtn.innerHTML = '✅ Admin ON <span style="font-size: 12px; margin-left: 5px; cursor: pointer;" onclick="event.stopPropagation(); logoutAdmin();" title="Odhlásit">🚪</span>';
        showNotification('✅ Admin režim aktivován');
        console.log('🔧 Admin mode: ON');
        // Показати кнопку замовлень
        const ordersBtn = document.getElementById('ordersBtn');
        if (ordersBtn) ordersBtn.style.display = 'inline-flex';
        const sipOrdersBtn = document.getElementById('sipOrdersBtn');
        if (sipOrdersBtn) sipOrdersBtn.style.display = 'inline-flex';
    } else {
        body.classList.remove('admin-mode');
        if (adminBtn) adminBtn.textContent = '🔧 Admin';
        showNotification('❌ Admin režim deaktivován');
        console.log('🔧 Admin mode: OFF');
        // Сховати кнопку замовлень
        const ordersBtn = document.getElementById('ordersBtn');
        if (ordersBtn) ordersBtn.style.display = 'none';
        const sipOrdersBtn = document.getElementById('sipOrdersBtn');
        if (sipOrdersBtn) sipOrdersBtn.style.display = 'none';
    }
    
    // Reload products and gallery to show admin buttons
    renderProducts();
    loadGallery();
}

// Check if in admin mode
function checkAdminMode() {
    return isAdminMode;
}

// Open edit product modal with live preview
function openEditProductModal(productId) {
    // ВІДКРИВАЄМО НОВУ СТОРІНКУ ДЛЯ РЕДАГУВАННЯ
    window.location.href = `admin-panel.html`;
    return; // Exit function
    
    // OLD CODE BELOW (DISABLED)
    // ASK FOR CONFIRMATION FIRST
    if (!confirm('🤔 Chcete upravit tento produkt?')) {
        return; // User cancelled
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    editingProduct = { ...product };
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.id = 'editProductModal';
    modal.innerHTML = `
        <div class="edit-modal-content" style="max-width: 900px;">
            <div class="edit-modal-header">
                <h2>✏️ Upravit produkt</h2>
                <button class="modal-close" onclick="closeEditModal()">&times;</button>
            </div>
            
            <div class="edit-modal-body" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div class="edit-form-section" style="overflow-y: auto; max-height: 600px;">
                    <h3>Editace</h3>
                    
                    <div class="form-group">
                        <label>Název produktu:</label>
                        <input type="text" id="editProductName" value="${product.name}" oninput="updateProductPreview()">
                    </div>
                    
                    <div class="form-group">
                        <label>Popis:</label>
                        <textarea id="editProductDescription" oninput="updateProductPreview()" rows="4">${product.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Cena (Kč):</label>
                        <input type="number" id="editProductPrice" value="${product.price}" oninput="updateProductPreview()">
                    </div>
                    
                    <div class="form-group">
                        <label>Sleva (%):</label>
                        <input type="number" id="editProductDiscount" value="${product.discount || 0}" min="0" max="100" oninput="updateProductPreview()">
                    </div>
                    
                    <div class="form-group">
                        <label>Kategorie:</label>
                        <select id="editProductCategory" onchange="updateProductPreview()">
                            <option value="stoly" ${product.category === 'stoly' ? 'selected' : ''}>Stoly a stolky</option>
                            <option value="police" ${product.category === 'police' ? 'selected' : ''}>Police</option>
                            <option value="skrine" ${product.category === 'skrine' ? 'selected' : ''}>Skříně a komody</option>
                            <option value="kuchyne" ${product.category === 'kuchyne' ? 'selected' : ''}>Kuchyně</option>
                            <option value="ostatni" ${product.category === 'ostatni' ? 'selected' : ''}>Ostatní</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="editProductIsNew" ${product.isNew ? 'checked' : ''} onchange="updateProductPreview()">
                            Označit jako NOVINKA
                        </label>
                    </div>
                    
                    <hr style="margin: 20px 0; border: 1px solid var(--border-color);">
                    
                    <div class="form-group">
                        <label>🖼️ Obrázky produktu:</label>
                        <div id="currentImages" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;">
                            ${(product.images && product.images.length > 0) ? product.images.map((img, index) => `
                                <div style="position: relative; border: 2px solid var(--border-color); border-radius: 8px; overflow: hidden;">
                                    <img src="${img}" style="width: 100%; height: 100px; object-fit: cover;">
                                    <button onclick="removeProductImage(${index})" style="position: absolute; top: 5px; right: 5px; background: var(--accent-danger); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 14px;">&times;</button>
                                </div>
                            `).join('') : '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 20px;">📸 Žádné obrázky</p>'}
                        </div>
                        <input type="file" id="addProductImages" accept="image/*" multiple style="display: block; width: 100%; padding: 10px; border: 2px dashed var(--accent-primary); border-radius: 8px; cursor: pointer;">
                        <small style="color: var(--text-muted); display: block; margin-top: 5px;">📌 Můžete vybrat více obrázků najednou</small>
                    </div>
                </div>
                
                <div class="edit-preview-section">
                    <h3>👁️ Náhled (Jak to bude vypadat)</h3>
                    <div class="preview-container" id="productPreviewContainer">
                        <!-- Preview will be rendered here -->
                    </div>
                </div>
            </div>
            
            <div class="edit-modal-footer">
                <button class="btn btn-secondary" onclick="closeEditModal()">Zrušit</button>
                <button class="btn btn-primary" onclick="saveProductChanges(${productId})">💾 Uložit změny</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    updateProductPreview();
    
    // Add event listener for file input
    const fileInput = document.getElementById('addProductImages');
    if (fileInput) {
        fileInput.addEventListener('change', handleProductImagesUpload);
    }
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeEditModal();
    }, { once: true });
}

// Update product preview in real-time
function updateProductPreview() {
    const name = document.getElementById('editProductName')?.value || '';
    const description = document.getElementById('editProductDescription')?.value || '';
    const price = parseInt(document.getElementById('editProductPrice')?.value) || 0;
    const discount = parseInt(document.getElementById('editProductDiscount')?.value) || 0;
    const isNew = document.getElementById('editProductIsNew')?.checked || false;
    
    const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
    const hasDiscount = discount > 0;
    
    const previewContainer = document.getElementById('productPreviewContainer');
    if (!previewContainer) return;
    
    let badgesHTML = '';
    if (hasDiscount) {
        badgesHTML += `<div class="sale-badge">-${discount}% SLEVA</div>`;
    }
    if (isNew) {
        badgesHTML += `<div class="new-badge">NOVINKA</div>`;
    }
    
    previewContainer.innerHTML = `
        <div class="product-card-preview">
            ${badgesHTML}
            <div class="product-media">
                <div class="product-image-placeholder">${name}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${name}</h3>
                <p class="product-description">${description}</p>
                <div class="product-price-block">
                    ${hasDiscount ? `
                        <div class="product-price-old">${price.toLocaleString()} Kč</div>
                        <div class="product-price">${finalPrice.toLocaleString()} Kč <span class="discount-badge">-${discount}%</span></div>
                    ` : `
                        <div class="product-price">${finalPrice.toLocaleString()} Kč</div>
                    `}
                </div>
                <div class="product-buttons">
                    <button class="btn btn-primary product-btn">Přidat do košíku</button>
                    <button class="btn btn-custom product-btn-custom">Na míru</button>
                </div>
            </div>
        </div>
    `;
}

// Remove product image
function removeProductImage(index) {
    if (!editingProduct) return;
    
    if (!confirm('🗑️ Odstranit tento obrázek?')) return;
    
    // Remove image from array
    if (editingProduct.images && editingProduct.images[index]) {
        editingProduct.images.splice(index, 1);
    }
    
    // Refresh images display
    refreshProductImages();
    updateProductPreview();
}

// Refresh product images display
function refreshProductImages() {
    const container = document.getElementById('currentImages');
    if (!container || !editingProduct) return;
    
    if (editingProduct.images && editingProduct.images.length > 0) {
        container.innerHTML = editingProduct.images.map((img, index) => `
            <div style="position: relative; border: 2px solid var(--border-color); border-radius: 8px; overflow: hidden;">
                <img src="${img}" style="width: 100%; height: 100px; object-fit: cover;">
                <button onclick="removeProductImage(${index})" style="position: absolute; top: 5px; right: 5px; background: var(--accent-danger); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 14px;">&times;</button>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 20px;">📸 Žádné obrázky</p>';
    }
}

// Add product images
function handleProductImagesUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0 || !editingProduct) return;
    
    // Initialize images array if doesn't exist
    if (!editingProduct.images) {
        editingProduct.images = [];
    }
    
    // Convert files to base64 and add to array
    let filesProcessed = 0;
    const totalFiles = files.length;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            editingProduct.images.push(e.target.result);
            filesProcessed++;
            
            // When all files processed, refresh display
            if (filesProcessed === totalFiles) {
                refreshProductImages();
                updateProductPreview();
                showNotification(`✅ Přidáno ${totalFiles} obrázků`);
            }
        };
        
        reader.readAsDataURL(file);
    }
    
    // Clear input
    event.target.value = '';
}

// Save product changes
function saveProductChanges(productId) {
    const name = document.getElementById('editProductName')?.value;
    const description = document.getElementById('editProductDescription')?.value;
    const price = parseInt(document.getElementById('editProductPrice')?.value);
    const discount = parseInt(document.getElementById('editProductDiscount')?.value) || 0;
    const category = document.getElementById('editProductCategory')?.value;
    const isNew = document.getElementById('editProductIsNew')?.checked;
    
    if (!name || !description) {
        alert('Prosím vyplňte všechna povinná pole');
        return;
    }
    
    if (isNaN(price) || price < 0) {
        alert('Prosím zadejte platnou cenu');
        return;
    }
    
    // Find and update product
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            name,
            description,
            price,
            discount,
            category,
            isNew,
            images: editingProduct.images || [],
            video: editingProduct.video || ''
        };
        
        // Save to localStorage
        try {
            localStorage.setItem('ikarden-products', JSON.stringify(products));
            showNotification('✅ Produkt byl úspěšně aktualizován!');
            closeEditModal();
            renderProducts();
        } catch (error) {
            alert('Chyba při ukládání: ' + error.message);
        }
    }
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editProductModal') || document.getElementById('editProjectModal');
    if (modal) {
        modal.remove();
    }
    editingProduct = null;
    editingProject = null;
}

// Delete product with confirmation
function deleteProductInline(productId) {
    const product = products.find(p => p.id === productId);
    const productName = product ? product.name : 'tento produkt';
    
    if (!confirm(`🗑️ POZOR! Opravdu chcete SMAZAT produkt "${productName}"?\n\nTato akce je NEVRATNÁ!`)) return;
    
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products.splice(index, 1);
        localStorage.setItem('ikarden-products', JSON.stringify(products));
        showNotification('✅ Produkt byl smazán');
        renderProducts();
    }
}

// Open edit project modal
function openEditProjectModal(projectId) {
    // ВІДКРИВАЄМО НОВУ СТОРІНКУ ДЛЯ РЕДАГУВАННЯ ПРОЕКТУ
    window.location.href = `admin-project-edit.html?id=${projectId}`;
    return; // Exit function
    
    // OLD CODE BELOW (DISABLED)
    const projectsData = loadProjectsData();
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;
    
    editingProject = { ...project };
    
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.id = 'editProjectModal';
    modal.innerHTML = `
        <div class="edit-modal-content">
            <div class="edit-modal-header">
                <h2>✏️ Upravit projekt</h2>
                <button class="modal-close" onclick="closeEditModal()">&times;</button>
            </div>
            
            <div class="edit-modal-body">
                <div class="edit-form-section">
                    <h3>Editace</h3>
                    
                    <div class="form-group">
                        <label>Název projektu:</label>
                        <input type="text" id="editProjectTitle" value="${project.title}" oninput="updateProjectPreview()">
                    </div>
                    
                    <div class="form-group">
                        <label>Popis:</label>
                        <textarea id="editProjectDescription" oninput="updateProjectPreview()">${project.description || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Lokace:</label>
                        <input type="text" id="editProjectLocation" value="${project.location || ''}" oninput="updateProjectPreview()">
                    </div>
                    
                    <div class="form-group">
                        <label>Datum:</label>
                        <input type="date" id="editProjectDate" value="${project.date ? project.date.split('T')[0] : ''}" onchange="updateProjectPreview()">
                    </div>
                </div>
                
                <div class="edit-preview-section">
                    <h3>👁️ Náhled</h3>
                    <div class="preview-container" id="projectPreviewContainer">
                        <!-- Preview -->
                    </div>
                </div>
            </div>
            
            <div class="edit-modal-footer">
                <button class="btn btn-secondary" onclick="closeEditModal()">Zrušit</button>
                <button class="btn btn-primary" onclick="saveProjectChanges(${projectId})">💾 Uložit změny</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    updateProjectPreview();
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeEditModal();
    }, { once: true });
}

// Update project preview
function updateProjectPreview() {
    const title = document.getElementById('editProjectTitle')?.value || '';
    const description = document.getElementById('editProjectDescription')?.value || '';
    const location = document.getElementById('editProjectLocation')?.value || '';
    const date = document.getElementById('editProjectDate')?.value || '';
    
    const previewContainer = document.getElementById('projectPreviewContainer');
    if (!previewContainer) return;
    
    const dateFormatted = date ? new Date(date).toLocaleDateString('cs-CZ') : '';
    
    previewContainer.innerHTML = `
        <div class="gallery-item-preview">
            <div class="gallery-placeholder">
                <span style="font-size: 48px;">📁</span>
            </div>
            <div class="gallery-overlay">
                <h3>${title}</h3>
                <p>${location}</p>
                ${dateFormatted ? `<p class="project-date">${dateFormatted}</p>` : ''}
            </div>
        </div>
    `;
}

// Save project changes
function saveProjectChanges(projectId) {
    const title = document.getElementById('editProjectTitle')?.value;
    const description = document.getElementById('editProjectDescription')?.value;
    const location = document.getElementById('editProjectLocation')?.value;
    const date = document.getElementById('editProjectDate')?.value;
    
    if (!title) {
        alert('Prosím vyplňte název projektu');
        return;
    }
    
    const updated = updateProject(projectId, {
        title,
        description,
        location,
        date: date || new Date().toISOString()
    });
    
    if (updated) {
        showNotification('✅ Projekt byl úspěšně aktualizován!');
        closeEditModal();
        loadGallery();
    } else {
        alert('❌ Chyba při ukládání projektu!');
    }
}

// Delete project inline
function deleteProjectInline(projectId) {
    if (!confirm('Opravdu chcete smazat tento projekt?')) return;
    
    deleteProject(projectId);
    showNotification('✅ Projekt byl smazán');
    loadGallery();
}

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    body.classList.toggle('light-theme');
    
    if (!themeIcon) return;
    
    // Update icon
    if (body.classList.contains('light-theme')) {
        themeIcon.textContent = '☀️';
        localStorage.setItem('ikarden-theme', 'light');
        console.log('✅ Switched to light theme');
    } else {
        themeIcon.textContent = '🌙';
        localStorage.setItem('ikarden-theme', 'dark');
        console.log('✅ Switched to dark theme');
    }
}

// Load saved theme
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('ikarden-theme');
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        if (themeIcon) themeIcon.textContent = '☀️';
        console.log('✅ Loaded light theme from localStorage');
    } else {
        if (themeIcon) themeIcon.textContent = '🌙';
        console.log('✅ Loaded dark theme (default)');
    }
}

// Make ALL admin functions global for onclick handlers
window.openEditProductModal = openEditProductModal;
window.deleteProductInline = deleteProductInline;
window.closeEditModal = closeEditModal;
window.updateProductPreview = updateProductPreview;
window.saveProductChanges = saveProductChanges;
window.removeProductImage = removeProductImage;
window.refreshProductImages = refreshProductImages;
window.handleProductImagesUpload = handleProductImagesUpload;
window.openEditProjectModal = openEditProjectModal;
window.deleteProjectInline = deleteProjectInline;
window.updateProjectPreview = updateProjectPreview;
window.saveProjectChanges = saveProjectChanges;
window.closeAdminLogin = closeAdminLogin;
window.loginAdmin = loginAdmin;
window.showAdminLogin = showAdminLogin;
window.logoutAdmin = logoutAdmin;

// Initialization is handled in main DOMContentLoaded listener above
