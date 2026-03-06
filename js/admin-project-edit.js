// Admin Project Edit Page JavaScript
console.log('🎨 Admin Project Edit Page loaded!');

// Get project ID from URL (if editing existing)
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id') ? parseInt(urlParams.get('id')) : null;
const isNewProject = !projectId;

let currentProject = null;
let mediaItems = []; // Array to store media with order

// Load project data (if editing)
function loadProject() {
    if (isNewProject) {
        // New project
        document.getElementById('pageTitle').textContent = '📸 Nový projekt';
        document.getElementById('deleteBtn').style.display = 'none';
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('projectDate').value = today;
        
        updatePreview();
        console.log('✅ Creating new project');
        return;
    }
    
    // Editing existing project
    const projects = loadProjectsData();
    currentProject = projects.find(p => p.id === projectId);
    
    if (!currentProject) {
        alert('Projekt nenalezen!');
        goBack();
        return;
    }
    
    document.getElementById('pageTitle').textContent = '✏️ Upravit projekt';
    document.getElementById('deleteBtn').style.display = 'block';
    
    // Fill form
    document.getElementById('projectTitle').value = currentProject.title || '';
    document.getElementById('projectDescription').value = currentProject.description || '';
    document.getElementById('projectLocation').value = currentProject.location || '';
    
    if (currentProject.date) {
        const date = new Date(currentProject.date).toISOString().split('T')[0];
        document.getElementById('projectDate').value = date;
    }
    
    // Load media
    mediaItems = [];
    
    // Add images
    if (currentProject.images && currentProject.images.length > 0) {
        currentProject.images.forEach((img, index) => {
            mediaItems.push({
                type: 'image',
                src: img,
                order: index
            });
        });
    }
    
    // Add videos
    if (currentProject.videos && currentProject.videos.length > 0) {
        currentProject.videos.forEach((video, index) => {
            mediaItems.push({
                type: 'video',
                src: video,
                order: mediaItems.length
            });
        });
    }
    
    renderMediaGrid();
    updatePreview();
    
    console.log('✅ Project loaded:', currentProject);
}

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
    const title = document.getElementById('projectTitle').value || 'Název projektu';
    const description = document.getElementById('projectDescription').value || 'Popis projektu se zobrazí zde...';
    const location = document.getElementById('projectLocation').value || 'Lokace';
    const dateStr = document.getElementById('projectDate').value;
    
    const dateFormatted = dateStr 
        ? new Date(dateStr).toLocaleDateString('cs-CZ')
        : 'Datum';
    
    // Update preview text
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewMeta').textContent = `${location} • ${dateFormatted}`;
    document.getElementById('previewDescription').textContent = description;
    
    // Update preview media
    const previewGrid = document.getElementById('previewMediaGrid');
    
    if (mediaItems.length === 0) {
        previewGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                📸 Zatím žádné obrázky
            </div>
        `;
    } else {
        // Show first 4 media items
        const displayItems = mediaItems.slice(0, 4);
        previewGrid.innerHTML = displayItems.map((item, index) => {
            if (item.type === 'image') {
                return `<img src="${item.src}" alt="Preview ${index + 1}" class="preview-media-item">`;
            } else {
                return `<video src="${item.src}" class="preview-media-item" muted></video>`;
            }
        }).join('');
        
        // Add "more" indicator if there are more than 4
        if (mediaItems.length > 4) {
            previewGrid.innerHTML += `
                <div style="grid-column: 1/-1; text-align: center; padding: 10px; color: var(--text-muted); font-size: 14px;">
                    +${mediaItems.length - 4} dalších
                </div>
            `;
        }
    }
}

// Listen to form changes
document.getElementById('projectTitle').addEventListener('input', updatePreview);
document.getElementById('projectDescription').addEventListener('input', updatePreview);
document.getElementById('projectLocation').addEventListener('input', updatePreview);
document.getElementById('projectDate').addEventListener('change', updatePreview);

// Save project
function saveProject() {
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const location = document.getElementById('projectLocation').value;
    const date = document.getElementById('projectDate').value;
    
    // Validation
    if (!title) {
        alert('❌ Prosím vyplňte název projektu');
        return;
    }
    
    // Separate images and videos
    const images = mediaItems.filter(m => m.type === 'image').map(m => m.src);
    const videos = mediaItems.filter(m => m.type === 'video').map(m => m.src);
    
    const projects = loadProjectsData();
    
    if (isNewProject) {
        // Create new project
        const newProject = {
            id: Date.now(),
            title,
            description,
            location,
            date: date || new Date().toISOString(),
            images,
            videos,
            created: new Date().toISOString()
        };
        
        projects.push(newProject);
        console.log('✅ New project created:', newProject);
    } else {
        // Update existing project
        const index = projects.findIndex(p => p.id === projectId);
        
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                title,
                description,
                location,
                date: date || projects[index].date,
                images,
                videos
            };
            console.log('✅ Project updated:', projects[index]);
        }
    }
    
    // Save to localStorage
    if (saveProjectsData(projects)) {
        alert('✅ Projekt byl úspěšně uložen!');
        
        // Go back to main page
        setTimeout(() => {
            window.location.href = 'index.html#galerie';
        }, 500);
    } else {
        alert('❌ Chyba při ukládání projektu!');
    }
}

// Delete project
function deleteProject() {
    if (!currentProject) return;
    
    if (!confirm(`🗑️ POZOR! Opravdu chcete SMAZAT projekt "${currentProject.title}"?\n\nTato akce je NEVRATNÁ!`)) {
        return;
    }
    
    const projects = loadProjectsData();
    const filtered = projects.filter(p => p.id !== projectId);
    
    if (saveProjectsData(filtered)) {
        alert('✅ Projekt byl smazán');
        setTimeout(() => {
            window.location.href = 'index.html#galerie';
        }, 500);
    }
}

// Go back
function goBack() {
    if (confirm('Máte neuložené změny. Opravdu chcete odejít?')) {
        window.location.href = 'index.html#galerie';
    }
}

// Initialize
loadProject();
