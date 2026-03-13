// ===== PASSWORD PROTECTION =====

// Check password on page load
window.addEventListener('DOMContentLoaded', () => {
    initializePassword();
});

function initializePassword() {
    const savedPassword = localStorage.getItem('ikarden-admin-password');
    
    if (!savedPassword) {
        // First time - set password
        showSetPasswordPrompt();
    } else {
        // Show login
        document.getElementById('loginOverlay').style.display = 'flex';
        document.getElementById('passwordInput').focus();
    }
}

function showSetPasswordPrompt() {
    document.querySelector('.login-title').textContent = '🔐 Nastavit heslo';
    document.querySelector('.login-subtitle').textContent = 'Vytvořte nové heslo pro admin panel';
    document.querySelector('.login-btn').textContent = '✓ Nastavit heslo';
}

function checkPassword(event) {
    event.preventDefault();
    
    const enteredPassword = document.getElementById('passwordInput').value;
    const savedPassword = localStorage.getItem('ikarden-admin-password');
    const loginError = document.getElementById('loginError');
    
    if (!savedPassword) {
        // Setting password for first time
        if (enteredPassword.length < 4) {
            loginError.textContent = 'Heslo musí mít alespoň 4 znaky!';
            loginError.classList.add('show');
            setTimeout(() => loginError.classList.remove('show'), 3000);
            return;
        }
        
        localStorage.setItem('ikarden-admin-password', enteredPassword);
        showLoginSuccess();
    } else {
        // Checking password
        if (enteredPassword === savedPassword) {
            showLoginSuccess();
        } else {
            loginError.textContent = 'Nesprávné heslo!';
            loginError.classList.add('show');
            document.getElementById('passwordInput').value = '';
            document.getElementById('passwordInput').focus();
            
            // Shake animation
            setTimeout(() => loginError.classList.remove('show'), 3000);
        }
    }
}

function showLoginSuccess() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
    
    // Initialize admin panel
    renderProductsList();
    
    // Додаємо кнопку експорту
    addExportButton();
}

function changePassword() {
    const oldPassword = prompt('Zadejte staré heslo:');
    const savedPassword = localStorage.getItem('ikarden-admin-password');
    
    if (oldPassword !== savedPassword) {
        alert('Nesprávné staré heslo!');
        return;
    }
    
    const newPassword = prompt('Zadejte nové heslo (min. 4 znaky):');
    
    if (!newPassword || newPassword.length < 4) {
        alert('Heslo musí mít alespoň 4 znaky!');
        return;
    }
    
    const confirmPassword = prompt('Potvrďte nové heslo:');
    
    if (newPassword !== confirmPassword) {
        alert('Hesla se neshodují!');
        return;
    }
    
    localStorage.setItem('ikarden-admin-password', newPassword);
    alert('✅ Heslo bylo úspěšně změněno!');
}

// ===== PRODUCTS MANAGEMENT =====

// Load products from localStorage or use defaults
function loadProducts() {
    const savedProducts = localStorage.getItem('ikarden-products');
    if (savedProducts) {
        return JSON.parse(savedProducts);
    }
    
    // Default products with images array
    return [
        {
            id: 1,
            name: "Stůl z masivu dubu",
            description: "Robustní jídelní stůl z masivního dubu, ručně vyrobený",
            price: 12000,
            discount: 0,
            images: [],
            video: ""
        },
        {
            id: 2,
            name: "Police na knihy",
            description: "Elegantní knihovna z dubového dřeva",
            price: 6500,
            discount: 0,
            images: [],
            video: ""
        },
        {
            id: 3,
            name: "Židle dubová",
            description: "Pohodlná židle s čalouněným sedákem",
            price: 3500,
            discount: 10,
            images: [],
            video: ""
        },
        {
            id: 4,
            name: "Konferenční stolek",
            description: "Moderní konferenční stolek s úložným prostorem",
            price: 5800,
            discount: 0,
            images: [],
            video: ""
        },
        {
            id: 5,
            name: "Skříň s posuvnými dveřmi",
            description: "Prostorná masivní skříň do ložnice",
            price: 18000,
            discount: 0,
            images: [],
            video: ""
        },
        {
            id: 6,
            name: "Noční stolek",
            description: "Kompaktní noční stolek se zásuvkami",
            price: 2800,
            discount: 0,
            images: [],
            video: ""
        }
    ];
}

let products = loadProducts();
let selectedProductId = null;
let draggedImageIndex = null;

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('ikarden-products', JSON.stringify(products));
    console.log('✅ Products saved to localStorage');
}

// Render products list
function renderProductsList() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = products.map(product => {
        const finalPrice = product.discount > 0 
            ? Math.round(product.price * (1 - product.discount / 100))
            : product.price;
        
        return `
            <div class="product-list-item ${selectedProductId === product.id ? 'active' : ''}" 
                 onclick="selectProduct(${product.id})">
                <button class="btn-delete-product" onclick="event.stopPropagation(); deleteProduct(${product.id})" title="Smazat produkt">×</button>
                <div class="product-list-name">${product.name}</div>
                <div class="product-list-price">
                    ${finalPrice.toLocaleString()} Kč
                    ${product.discount > 0 ? `<span class="product-discount">-${product.discount}%</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Add new product
function addNewProduct() {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct = {
        id: newId,
        name: "Nový produkt",
        description: "Popis nového produktu",
        price: 1000,
        discount: 0,
        images: [],
        video: ""
    };
    
    products.push(newProduct);
    saveProducts();
    renderProductsList();
    selectProduct(newId);
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Opravdu chcete smazat tento produkt?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        renderProductsList();
        
        if (selectedProductId === productId) {
            selectedProductId = null;
            document.getElementById('editorContent').innerHTML = `
                <div class="placeholder-message">
                    ← Vyberte produkt pro úpravu<br>nebo klikněte ➕ pro přidání nového
                </div>
            `;
        }
    }
}

// Select product for editing
function selectProduct(productId) {
    selectedProductId = productId;
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Ensure images array exists
    if (!product.images) product.images = [];
    if (!product.video) product.video = "";
    
    renderProductsList();
    renderEditor(product);
}

// Render editor form
function renderEditor(product) {
    const editorContent = document.getElementById('editorContent');
    const finalPrice = product.discount > 0 
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;
    
    editorContent.innerHTML = `
        <h2 class="editor-title">Upravit produkt</h2>
        
        <form id="productForm" onsubmit="saveProduct(event)">
            <div class="form-group">
                <label class="form-label">Název produktu</label>
                <input type="text" class="form-input" id="productName" 
                       value="${product.name}" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Popis</label>
                <textarea class="form-textarea" id="productDescription" 
                          required>${product.description}</textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Původní cena (Kč)</label>
                    <input type="number" class="form-input" id="productPrice" 
                           value="${product.price}" min="0" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Sleva (%)</label>
                    <input type="number" class="form-input" id="productDiscount" 
                           value="${product.discount}" min="0" max="100" 
                           oninput="updatePricePreview()">
                    <div class="discount-info" id="pricePreview">
                        ${product.discount > 0 ? `Konečná cena: ${finalPrice.toLocaleString()} Kč` : ''}
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Galerie obrázků (přetáhněte pro změnu pořadí)</label>
                <div class="image-gallery" id="imageGallery">
                    ${renderImageGallery(product.images)}
                </div>
                <div class="image-upload-area" id="uploadArea" 
                     onclick="document.getElementById('fileInput').click()">
                    <div class="upload-icon">📁</div>
                    <div class="upload-text">Klikněte nebo přetáhněte obrázky sem<br>(můžete vybrat více souborů najednou)</div>
                </div>
                <input type="file" id="fileInput" class="file-input" 
                       accept="image/*" multiple onchange="handleFileSelect(event)">
            </div>
            
            <div class="form-group">
                <label class="form-label">Video (volitelné)</label>
                ${product.video ? `
                    <video src="${product.video}" class="video-preview" controls></video>
                    <button type="button" class="video-remove" onclick="removeVideo()">🗑️ Odebrat video</button>
                ` : `
                    <div class="image-upload-area" id="videoUploadArea" 
                         onclick="document.getElementById('videoInput').click()">
                        <div class="upload-icon">🎥</div>
                        <div class="upload-text">Klikněte pro nahrání videa</div>
                    </div>
                    <input type="file" id="videoInput" class="file-input" 
                           accept="video/*" onchange="handleVideoSelect(event)">
                `}
            </div>
            
            <button type="submit" class="btn-save">💾 Uložit změny</button>
        </form>
    `;
    
    setupDragAndDrop();
    setupImageDragAndDrop();
}

// Render image gallery
function renderImageGallery(images) {
    if (!images || images.length === 0) {
        return '';
    }
    
    return images.map((image, index) => `
        <div class="gallery-item" draggable="true" data-index="${index}"
             ondragstart="handleImageDragStart(event, ${index})"
             ondragover="handleImageDragOver(event)"
             ondrop="handleImageDrop(event, ${index})"
             ondragend="handleImageDragEnd(event)">
            <img src="${image}" alt="Product image ${index + 1}">
            <button class="gallery-item-delete" onclick="deleteImage(${index})" type="button">×</button>
            <div class="gallery-item-order">${index + 1}</div>
        </div>
    `).join('');
}

// Handle multiple file selection
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    const product = products.find(p => p.id === selectedProductId);
    
    if (!product.images) product.images = [];
    
    let filesProcessed = 0;
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            product.images.push(e.target.result);
            filesProcessed++;
            
            if (filesProcessed === files.length) {
                renderEditor(product);
            }
        };
        reader.readAsDataURL(file);
    });
}

// Delete image
function deleteImage(index) {
    const product = products.find(p => p.id === selectedProductId);
    product.images.splice(index, 1);
    renderEditor(product);
}

// Image drag and drop for reordering
function handleImageDragStart(event, index) {
    draggedImageIndex = index;
    event.currentTarget.classList.add('dragging');
}

function handleImageDragOver(event) {
    event.preventDefault();
}

function handleImageDrop(event, dropIndex) {
    event.preventDefault();
    
    if (draggedImageIndex === null || draggedImageIndex === dropIndex) return;
    
    const product = products.find(p => p.id === selectedProductId);
    const draggedImage = product.images[draggedImageIndex];
    
    // Remove from old position
    product.images.splice(draggedImageIndex, 1);
    
    // Insert at new position
    product.images.splice(dropIndex, 0, draggedImage);
    
    renderEditor(product);
}

function handleImageDragEnd(event) {
    event.currentTarget.classList.remove('dragging');
    draggedImageIndex = null;
}

// Handle video selection
function handleVideoSelect(event) {
    const file = event.target.files[0];
    if (file) {
        // Check file size (limit to 50MB)
        if (file.size > 50 * 1024 * 1024) {
            alert('Video je příliš velké! Maximální velikost je 50MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const product = products.find(p => p.id === selectedProductId);
            product.video = e.target.result;
            renderEditor(product);
        };
        reader.readAsDataURL(file);
    }
}

// Remove video
function removeVideo() {
    const product = products.find(p => p.id === selectedProductId);
    product.video = "";
    renderEditor(product);
}

// Update price preview
function updatePricePreview() {
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const discount = parseFloat(document.getElementById('productDiscount').value) || 0;
    const finalPrice = Math.round(price * (1 - discount / 100));
    
    const preview = document.getElementById('pricePreview');
    if (discount > 0) {
        preview.textContent = `Konečná cena: ${finalPrice.toLocaleString()} Kč`;
    } else {
        preview.textContent = '';
    }
}

// Setup drag and drop for image upload area
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    if (!uploadArea) return;
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        const product = products.find(p => p.id === selectedProductId);
        
        if (!product.images) product.images = [];
        
        let filesProcessed = 0;
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(event) {
                product.images.push(event.target.result);
                filesProcessed++;
                
                if (filesProcessed === files.length) {
                    renderEditor(product);
                }
            };
            reader.readAsDataURL(file);
        });
    });
}

// Setup image drag and drop
function setupImageDragAndDrop() {
    const gallery = document.getElementById('imageGallery');
    if (!gallery) return;
    
    // Already handled by inline handlers
}

// Save product changes
function saveProduct(event) {
    event.preventDefault();
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    
    product.name = document.getElementById('productName').value;
    product.description = document.getElementById('productDescription').value;
    product.price = parseInt(document.getElementById('productPrice').value);
    product.discount = parseInt(document.getElementById('productDiscount').value) || 0;
    
    saveProducts();
    renderProductsList();
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
    
    console.log('✅ Product saved:', product);
}

// ============================================================
// ЕКСПОРТ У ФАЙЛ - ЗБЕРЕЖЕННЯ НА GITHUB
// ============================================================

function exportProductsToFile() {
    const currentProducts = products;
    
    const fileContent = `// ============================================================
// IKARDEN - ДАНІ ТОВАРІВ
// Цей файл редагується через адмін панель
// Останнє оновлення: ${new Date().toLocaleString('uk-UA')}
// ============================================================

window.IKARDEN_PRODUCTS = ${JSON.stringify(currentProducts, null, 4)};
`;
    
    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show instructions
    alert(`✅ Файл products-data.js завантажено!\n\nТепер зроби:\n1. Перемісти цей файл в \u043fапку:\n   C:\\Users\\ivank\\muscle-diary\\ikarden-website\\js\\\n\n2. Відкрити Git Bash і ввести 3 команди:\n   cd /c/Users/ivank/muscle-diary/ikarden-website\n   git add .\n   git commit -m "Update products"\n   git push\n\n3. Через 2-3 хвилини сайт оновиться!`);
}

// Кнопка експорту - додаємо в інтерфейс
function addExportButton() {
    const header = document.querySelector('.admin-header-content');
    if (!header || document.getElementById('exportBtn')) return;
    
    const btn = document.createElement('button');
    btn.id = 'exportBtn';
    btn.onclick = exportProductsToFile;
    btn.style.cssText = 'background: #22c55e; color: #000; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-left: 10px;';
    btn.innerHTML = '💾 Зберегти на сайт';
    header.appendChild(btn);
}

// Викликаємо addExportButton після успішного входу
// Note: renderProductsList() is called after successful login in showLoginSuccess()
