// Admin Edit Page JavaScript
console.log('🎨 Admin Edit Page loaded!');

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));

let currentProduct = null;
let mediaItems = []; // Array to store media with order

// Load product data
function loadProduct() {
    const products = JSON.parse(localStorage.getItem('ikarden-products') || '[]');
    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) {
        alert('Produkt nenalezen!');
        goBack();
        return;
    }
    
    // Fill form
    document.getElementById('productName').value = currentProduct.name || '';
    document.getElementById('productDescription').value = currentProduct.description || '';
    document.getElementById('productPrice').value = currentProduct.price || 0;
    document.getElementById('productDiscount').value = currentProduct.discount || 0;
    document.getElementById('productCategory').value = currentProduct.category || 'stoly';
    document.getElementById('productIsNew').checked = currentProduct.isNew || false;
    
    // Load media
    mediaItems = [];
    
    // Add images
    if (currentProduct.images && currentProduct.images.length > 0) {
        currentProduct.images.forEach((img, index) => {
            mediaItems.push({
                type: 'image',
                src: img,
                order: index
            });
        });
    }
    
    // Add video if exists
    if (currentProduct.video) {
        mediaItems.push({
            type: 'video',
            src: currentProduct.video,
            order: mediaItems.length
        });
    }
    
    renderMediaGrid();
    updatePreview();
    
    console.log('✅ Product loaded:', currentProduct);
}

// Render media grid
function renderMediaGrid() {
    const grid = document.getElementById('mediaGrid');
    
    if (mediaItems.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">📸 Zatím žádné soubory</p>';
        return;
    }
    
    grid.innerHTML = mediaItems.map((item, index) => `
        <div class="media-item" draggable="true" data-index="${index}">
            ${item.type === 'image' 
                ? `<img src="${item.src}" alt="Media ${index + 1}">` 
                : `<video src="${item.src}" muted></video>`}
            
            <div class="media-item-actions">
                <button class="media-item-btn" onclick="removeMedia(${index})" title="Odstranit">
                    ×
                </button>
            </div>
            
            <div class="media-badge">
                ${item.type === 'image' ? '📷' : '🎥'} ${index + 1}
            </div>
        </div>
    `).join('');
    
    // Add drag & drop event listeners
    initDragAndDrop();
}

// Initialize Drag & Drop
function initDragAndDrop() {
    const items = document.querySelectorAll('.media-item');
    
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}

let draggedIndex = null;

function handleDragStart(e) {
    draggedIndex = parseInt(this.dataset.index);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    const dropIndex = parseInt(this.dataset.index);
    
    if (draggedIndex !== dropIndex) {
        // Swap items
        const draggedItem = mediaItems[draggedIndex];
        mediaItems.splice(draggedIndex, 1);
        mediaItems.splice(dropIndex, 0, draggedItem);
        
        // Re-render
        renderMediaGrid();
        updatePreview();
        
        console.log('✅ Media reordered:', draggedIndex, '→', dropIndex);
    }
    
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// File upload zone
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');

uploadZone.addEventListener('click', () => {
    fileInput.click();
});

// Drag & drop on upload zone
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files);
});

// Handle file uploads
function handleFiles(files) {
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const type = file.type.startsWith('image/') ? 'image' : 'video';
            
            mediaItems.push({
                type: type,
                src: e.target.result,
                order: mediaItems.length
            });
            
            renderMediaGrid();
            updatePreview();
            
            console.log(`✅ ${type} added:`, file.name);
        };
        
        reader.readAsDataURL(file);
    });
    
    // Clear input
    fileInput.value = '';
}

// Remove media
function removeMedia(index) {
    if (!confirm('🗑️ Odstranit tento soubor?')) return;
    
    mediaItems.splice(index, 1);
    renderMediaGrid();
    updatePreview();
    
    console.log('✅ Media removed:', index);
}

// Update preview
function updatePreview() {
    const name = document.getElementById('productName').value || 'Název produktu';
    const description = document.getElementById('productDescription').value || 'Popis produktu';
    const price = parseInt(document.getElementById('productPrice').value) || 0;
    const discount = parseInt(document.getElementById('productDiscount').value) || 0;
    const isNew = document.getElementById('productIsNew').checked;
    
    // Update preview text
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewDescription').textContent = description;
    
    // Update price
    const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
    const priceHTML = discount > 0
        ? `<span class="preview-price-old">${price.toLocaleString()} Kč</span>${finalPrice.toLocaleString()} Kč`
        : `${finalPrice.toLocaleString()} Kč`;
    
    document.getElementById('previewPrice').innerHTML = priceHTML;
    
    // Update preview media
    const previewMedia = document.getElementById('previewMedia');
    
    if (mediaItems.length === 0) {
        previewMedia.innerHTML = '<span>📦 Žádné obrázky</span>';
        previewMedia.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else {
        const firstMedia = mediaItems[0];
        if (firstMedia.type === 'image') {
            previewMedia.innerHTML = `<img src="${firstMedia.src}" alt="${name}">`;
        } else {
            previewMedia.innerHTML = `<video src="${firstMedia.src}" muted loop autoplay></video>`;
        }
        previewMedia.style.background = 'none';
    }
    
    // Update badges
    let badgesHTML = '';
    if (discount > 0) {
        badgesHTML += `<div class="preview-badge sale">-${discount}% SLEVA</div>`;
    }
    if (isNew) {
        badgesHTML += `<div class="preview-badge new">NOVINKA</div>`;
    }
    
    // Add badges container if doesn't exist
    let badgesContainer = previewMedia.querySelector('.preview-badges');
    if (!badgesContainer) {
        badgesContainer = document.createElement('div');
        badgesContainer.className = 'preview-badges';
        previewMedia.appendChild(badgesContainer);
    }
    badgesContainer.innerHTML = badgesHTML;
}

// Listen to form changes
document.getElementById('productName').addEventListener('input', updatePreview);
document.getElementById('productDescription').addEventListener('input', updatePreview);
document.getElementById('productPrice').addEventListener('input', updatePreview);
document.getElementById('productDiscount').addEventListener('input', updatePreview);
document.getElementById('productIsNew').addEventListener('change', updatePreview);

// Save product
function saveProduct() {
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const discount = parseInt(document.getElementById('productDiscount').value) || 0;
    const category = document.getElementById('productCategory').value;
    const isNew = document.getElementById('productIsNew').checked;
    
    // Validation
    if (!name || !description) {
        alert('❌ Prosím vyplňte všechna povinná pole');
        return;
    }
    
    if (isNaN(price) || price < 0) {
        alert('❌ Prosím zadejte platnou cenu');
        return;
    }
    
    // Separate images and videos
    const images = mediaItems.filter(m => m.type === 'image').map(m => m.src);
    const videos = mediaItems.filter(m => m.type === 'video');
    const video = videos.length > 0 ? videos[0].src : '';
    
    // Update product
    const products = JSON.parse(localStorage.getItem('ikarden-products') || '[]');
    const index = products.findIndex(p => p.id === productId);
    
    if (index !== -1) {
        products[index] = {
            ...products[index],
            name,
            description,
            price,
            discount,
            category,
            isNew,
            images,
            video
        };
        
        try {
            localStorage.setItem('ikarden-products', JSON.stringify(products));
            alert('✅ Produkt byl úspěšně uložen!');
            console.log('✅ Product saved:', products[index]);
            
            // Go back to main page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        } catch (error) {
            alert('❌ Chyba při ukládání: ' + error.message);
        }
    }
}

// Delete product
function deleteProduct() {
    if (!confirm(`🗑️ POZOR! Opravdu chcete SMAZAT produkt "${currentProduct.name}"?\n\nTato akce je NEVRATNÁ!`)) {
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('ikarden-products') || '[]');
    const filtered = products.filter(p => p.id !== productId);
    
    localStorage.setItem('ikarden-products', JSON.stringify(filtered));
    alert('✅ Produkt byl smazán');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Go back
function goBack() {
    if (confirm('Máte neuložené změny. Opravdu chcete odejít?')) {
        window.location.href = 'index.html';
    }
}

// Initialize
loadProduct();
