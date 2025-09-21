// admin.js - Sistema completo de administración con gestión de imágenes
class LocalStorageManager {
    constructor() {
        this.categoriesKey = 'product_categories';
        this.productsKey = 'gallery_products';
        this.sectionsKey = 'page_sections';
        this.settingsKey = 'page_settings';
        this.init();
    }

    // Inicializar datos si no existen
    init() {
        // Inicializar categorías
        if (!localStorage.getItem(this.categoriesKey)) {
            const defaultCategories = [
                { id: 1, name: 'Animales', color: '#6a0dad', description: 'Cuadros de animales', productCount: 0 },
                { id: 2, name: 'Anime', color: '#00ffff', description: 'Personajes de anime', productCount: 0 },
                { id: 3, name: 'DC', color: '#ff36ab', description: 'Personajes de DC Comics', productCount: 0 },
                { id: 4, name: 'Cartoons', color: '#00cc66', description: 'Dibujos animados', productCount: 0 },
                { id: 5, name: 'Arte', color: '#ff9900', description: 'Obras de arte', productCount: 0 },
                { id: 6, name: 'Artistas', color: '#cc66ff', description: 'Artistas famosos', productCount: 0 }
            ];
            localStorage.setItem(this.categoriesKey, JSON.stringify(defaultCategories));
        }

        // Inicializar productos
        if (!localStorage.getItem(this.productsKey)) {
            localStorage.setItem(this.productsKey, JSON.stringify([]));
        }

        // Inicializar secciones
        if (!localStorage.getItem(this.sectionsKey)) {
            const defaultSections = [
                {
                    id: 1,
                    title: 'Galería Principal',
                    position: 'gallery',
                    status: 'active',
                    content: '',
                    order: 1
                },
                {
                    id: 2,
                    title: 'Carrusel 3D',
                    position: 'header',
                    status: 'active',
                    content: '',
                    order: 2
                },
                {
                    id: 3,
                    title: 'Footer Información',
                    position: 'footer',
                    status: 'active',
                    content: '',
                    order: 3
                }
            ];
            localStorage.setItem(this.sectionsKey, JSON.stringify(defaultSections));
        }

        // Inicializar configuraciones
        if (!localStorage.getItem(this.settingsKey)) {
            const defaultSettings = {
                siteTitle: 'Mundo de Fantasía Animal',
                adminEmail: 'admin@example.com',
                maxFileSize: 2, // MB
                allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
                itemsPerPage: 12,
                maintenanceMode: false
            };
            localStorage.setItem(this.settingsKey, JSON.stringify(defaultSettings));
        }
    }

    // CATEGORÍAS
    getCategories() {
        return JSON.parse(localStorage.getItem(this.categoriesKey)) || [];
    }

    addCategory(category) {
        const categories = this.getCategories();
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;

        const newCategory = {
            id: newId,
            name: category.name,
            color: category.color,
            description: category.description,
            productCount: 0
        };

        categories.push(newCategory);
        localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
        return newCategory;
    }

    updateCategory(id, updatedCategory) {
        const categories = this.getCategories();
        const index = categories.findIndex(c => c.id === id);

        if (index !== -1) {
            categories[index] = { ...categories[index], ...updatedCategory };
            localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
            return categories[index];
        }

        return null;
    }

    deleteCategory(id) {
        const categories = this.getCategories();
        const filteredCategories = categories.filter(c => c.id !== id);
        localStorage.setItem(this.categoriesKey, JSON.stringify(filteredCategories));

        // Mover productos de esta categoría a "todos"
        const products = this.getProducts();
        const updatedProducts = products.map(p => {
            if (p.category === id.toString()) {
                return { ...p, category: 'todos' };
            }
            return p;
        });
        localStorage.setItem(this.productsKey, JSON.stringify(updatedProducts));

        return true;
    }

    // PRODUCTOS
    getProducts() {
        return JSON.parse(localStorage.getItem(this.productsKey)) || [];
    }

    getProduct(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    }

    getProductsByCategory(categoryId) {
        const products = this.getProducts();
        if (categoryId === 'todos') return products;
        return products.filter(p => p.category === categoryId.toString());
    }

    async addProduct(product) {
        const products = this.getProducts();
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

        // Convertir imagen a Base64 si es un archivo
        let imageBase64 = product.image;
        if (product.imageFile) {
            try {
                imageBase64 = await this.convertImageToBase64(product.imageFile);
            } catch (error) {
                console.error('Error converting image:', error);
                throw new Error('Error al procesar la imagen: ' + error.message);
            }
        }

        const newProduct = {
            id: newId,
            name: product.name,
            category: product.category,
            price: product.price,
            size: product.size,
            image: imageBase64,
            description: product.description,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        products.push(newProduct);
        localStorage.setItem(this.productsKey, JSON.stringify(products));

        // Actualizar contador de productos en la categoría
        this.updateCategoryProductCount(product.category);

        return newProduct;
    }

    async updateProduct(id, updatedProduct) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index !== -1) {
            // Convertir imagen a Base64 si es un archivo nuevo
            if (updatedProduct.imageFile) {
                try {
                    updatedProduct.image = await this.convertImageToBase64(updatedProduct.imageFile);
                    delete updatedProduct.imageFile;
                } catch (error) {
                    console.error('Error converting image:', error);
                    throw new Error('Error al procesar la imagen: ' + error.message);
                }
            }

            // Guardar la categoría anterior para actualizar contadores
            const oldCategory = products[index].category;

            products[index] = {
                ...products[index],
                ...updatedProduct,
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(this.productsKey, JSON.stringify(products));

            // Actualizar contadores de categorías si cambió
            if (updatedProduct.category && updatedProduct.category !== oldCategory) {
                this.updateCategoryProductCount(updatedProduct.category);
                this.updateCategoryProductCount(oldCategory);
            }

            return products[index];
        }

        return null;
    }

    deleteProduct(id) {
        const products = this.getProducts();
        const product = products.find(p => p.id === id);
        const filteredProducts = products.filter(p => p.id !== id);
        localStorage.setItem(this.productsKey, JSON.stringify(filteredProducts));

        // Actualizar contador de productos en la categoría
        if (product) {
            this.updateCategoryProductCount(product.category);
        }

        return true;
    }

    // SECCIONES
    getSections() {
        return JSON.parse(localStorage.getItem(this.sectionsKey)) || [];
    }

    addSection(section) {
        const sections = this.getSections();
        const newId = sections.length > 0 ? Math.max(...sections.map(s => s.id)) + 1 : 1;

        const newSection = {
            id: newId,
            title: section.title,
            position: section.position,
            status: section.status,
            content: section.content,
            order: section.order || sections.length + 1
        };

        sections.push(newSection);
        localStorage.setItem(this.sectionsKey, JSON.stringify(sections));
        return newSection;
    }

    updateSection(id, updatedSection) {
        const sections = this.getSections();
        const index = sections.findIndex(s => s.id === id);

        if (index !== -1) {
            sections[index] = { ...sections[index], ...updatedSection };
            localStorage.setItem(this.sectionsKey, JSON.stringify(sections));
            return sections[index];
        }

        return null;
    }

    deleteSection(id) {
        const sections = this.getSections();
        const filteredSections = sections.filter(s => s.id !== id);
        localStorage.setItem(this.sectionsKey, JSON.stringify(filteredSections));
        return true;
    }

    // CONFIGURACIONES
    getSettings() {
        return JSON.parse(localStorage.getItem(this.settingsKey)) || {};
    }

    updateSettings(updatedSettings) {
        const currentSettings = this.getSettings();
        const newSettings = { ...currentSettings, ...updatedSettings };
        localStorage.setItem(this.settingsKey, JSON.stringify(newSettings));
        return newSettings;
    }

    // UTILIDADES
    updateCategoryProductCount(categoryId) {
        const categories = this.getCategories();
        const products = this.getProducts();

        const category = categories.find(c => c.id.toString() === categoryId.toString());
        if (category) {
            const productCount = products.filter(p => p.category === categoryId.toString()).length;
            category.productCount = productCount;
            localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
        }
    }

    convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            // Verificar que es una imagen
            if (!file || !file.type.match('image.*')) {
                reject(new Error('No es un archivo de imagen válido'));
                return;
            }

            // Verificar tamaño máximo (2MB por defecto)
            const settings = this.getSettings();
            const maxSize = (settings.maxFileSize || 2) * 1024 * 1024; // Convertir a bytes

            if (file.size > maxSize) {
                reject(new Error(`La imagen es demasiado grande. Tamaño máximo: ${settings.maxFileSize || 2}MB`));
                return;
            }

            // Verificar formato permitido
            const allowedFormats = settings.allowedFormats || ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedFormats.includes(file.type)) {
                reject(new Error(`Formato no permitido. Formatos aceptados: ${allowedFormats.join(', ')}`));
                return;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                resolve(e.target.result);
            };

            reader.onerror = function (error) {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    }

    // Exportar e importar datos
    exportData() {
        const data = {
            categories: this.getCategories(),
            products: this.getProducts(),
            sections: this.getSections(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        return JSON.stringify(data);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            if (data.categories) localStorage.setItem(this.categoriesKey, JSON.stringify(data.categories));
            if (data.products) localStorage.setItem(this.productsKey, JSON.stringify(data.products));
            if (data.sections) localStorage.setItem(this.sectionsKey, JSON.stringify(data.sections));
            if (data.settings) localStorage.setItem(this.settingsKey, JSON.stringify(data.settings));

            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            throw new Error('Error al importar los datos: Formato inválido');
        }
    }

    // Estadísticas
    getStats() {
        const categories = this.getCategories();
        const products = this.getProducts();
        const sections = this.getSections();

        return {
            totalCategories: categories.length,
            totalProducts: products.length,
            totalSections: sections.length,
            activeSections: sections.filter(s => s.status === 'active').length,
            recentProducts: products.filter(p => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(p.createdAt) > weekAgo;
            }).length
        };
    }
}

// Inicializar el gestor de almacenamiento
const storageManager = new LocalStorageManager();

// Funcionalidad para la interfaz de administración
document.addEventListener('DOMContentLoaded', function () {
    // Cargar datos en las tablas
    loadCategoriesTable();
    loadProductsTable();
    loadSectionsTable();
    loadSettingsForm();

    // Actualizar estadísticas
    updateDashboardStats();

    // Configurar event listeners para formularios
    setupFormListeners();

    // Configurar botones de exportar/importar
    setupDataButtons();

    // Configurar navegación
    setupNavigation();

    // Inicializar tooltips
    initTooltips();

    // Verificar almacenamiento
    checkStorageUsage();
});

// ===== FUNCIONES DE INTERFAZ =====

function loadCategoriesTable() {
    const categories = storageManager.getCategories();
    const tbody = document.querySelector('#categoriesTable tbody');

    if (!tbody) return;

    tbody.innerHTML = '';

    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay categorías</td></tr>';
        return;
    }

    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td><div style="width:20px; height:20px; background:${category.color}; border-radius:3px;"></div></td>
            <td>${category.productCount}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${category.id}" data-type="category" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${category.id}" data-type="category" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    addTableActionListeners();
}

function loadProductsTable() {
    const products = storageManager.getProducts();
    const tbody = document.querySelector('#productsTable tbody');

    if (!tbody) return;

    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${product.price}</td>
            <td>${product.size}</td>
            <td>
                <button class="action-btn view-btn" data-id="${product.id}" data-type="product" title="Ver">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-btn" data-id="${product.id}" data-type="product" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${product.id}" data-type="product" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    addTableActionListeners();
}

function loadSectionsTable() {
    const sections = storageManager.getSections();
    const tbody = document.querySelector('#sectionsTable tbody');

    if (!tbody) return;

    tbody.innerHTML = '';

    if (sections.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay secciones</td></tr>';
        return;
    }

    // Ordenar secciones por orden
    sections.sort((a, b) => a.order - b.order).forEach(section => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${section.id}</td>
            <td>${section.title}</td>
            <td>${section.position}</td>
            <td><span class="status-badge ${section.status}">${section.status === 'active' ? 'Activa' : 'Inactiva'}</span></td>
            <td>
                <button class="action-btn edit-btn" data-id="${section.id}" data-type="section" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${section.id}" data-type="section" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="action-btn order-btn" data-id="${section.id}" data-type="section" data-direction="up" title="Mover arriba">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button class="action-btn order-btn" data-id="${section.id}" data-type="section" data-direction="down" title="Mover abajo">
                    <i class="fas fa-arrow-down"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    addTableActionListeners();
}

function loadSettingsForm() {
    const settings = storageManager.getSettings();
    const form = document.getElementById('settingsForm');

    if (!form) return;

    // Llenar el formulario con los valores actuales
    Object.keys(settings).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = settings[key];
            } else {
                input.value = settings[key];
            }
        }
    });
}

function addTableActionListeners() {
    // Botones de eliminar
    document.querySelectorAll('.action-btn.delete-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const id = parseInt(this.getAttribute('data-id'));
            const type = this.getAttribute('data-type');

            if (confirm(`¿Estás seguro de que quieres eliminar este ${type}?`)) {
                try {
                    if (type === 'category') {
                        storageManager.deleteCategory(id);
                        loadCategoriesTable();
                    } else if (type === 'product') {
                        storageManager.deleteProduct(id);
                        loadProductsTable();
                    } else if (type === 'section') {
                        storageManager.deleteSection(id);
                        loadSectionsTable();
                    }

                    updateDashboardStats();
                    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} eliminado correctamente`, 'success');
                } catch (error) {
                    showNotification('Error al eliminar: ' + error.message, 'error');
                }
            }
        });
    });

    // Botones de editar
    document.querySelectorAll('.action-btn.edit-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const id = parseInt(this.getAttribute('data-id'));
            const type = this.getAttribute('data-type');
            openEditModal(type, id);
        });
    });

    // Botones de ver
    document.querySelectorAll('.action-btn.view-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const id = parseInt(this.getAttribute('data-id'));
            const product = storageManager.getProduct(id);
            if (product) {
                openImageModal(product.image, product.name);
            }
        });
    });

    // Botones de ordenar
    document.querySelectorAll('.action-btn.order-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const id = parseInt(this.getAttribute('data-id'));
            const direction = this.getAttribute('data-direction');
            changeSectionOrder(id, direction);
        });
    });
}

function updateDashboardStats() {
    const stats = storageManager.getStats();

    document.querySelector('#categoriesCount').textContent = stats.totalCategories;
    document.querySelector('#productsCount').textContent = stats.totalProducts;
    document.querySelector('#sectionsCount').textContent = stats.totalSections;
    document.querySelector('#activeSectionsCount').textContent = stats.activeSections;

    // Actualizar gráfico simple
    updateSimpleChart();
}

function setupFormListeners() {
    // Formulario de categorías
    const categoryForm = document.querySelector('#categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const categoryData = {
                name: document.getElementById('categoryName').value,
                color: document.getElementById('categoryColor').value,
                description: document.getElementById('categoryDescription').value
            };

            try {
                storageManager.addCategory(categoryData);
                loadCategoriesTable();
                updateDashboardStats();

                this.reset();
                showNotification('Categoría añadida correctamente', 'success');
            } catch (error) {
                showNotification('Error al añadir categoría: ' + error.message, 'error');
            }
        });
    }

    // Formulario de productos
    const productForm = document.querySelector('#productForm');
    if (productForm) {
        productForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const productData = {
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                price: document.getElementById('productPrice').value,
                size: document.getElementById('productSize').value,
                description: document.getElementById('productDescription').value,
                imageFile: document.getElementById('productImage').files[0]
            };

            // Validaciones
            if (!productData.imageFile) {
                showNotification('Por favor, selecciona una imagen', 'error');
                return;
            }

            if (!productData.name || !productData.category || !productData.price || !productData.size) {
                showNotification('Por favor, completa todos los campos obligatorios', 'error');
                return;
            }

            try {
                const result = await storageManager.addProduct(productData);
                if (result) {
                    loadProductsTable();
                    updateDashboardStats();
                    this.reset();
                    document.getElementById('imagePreview').innerHTML = '<span>Vista previa de la imagen</span>';
                    showNotification('Producto añadido correctamente', 'success');
                }
            } catch (error) {
                showNotification('Error al añadir producto: ' + error.message, 'error');
            }
        });
    }

    // Formulario de secciones
    const sectionForm = document.querySelector('#sectionForm');
    if (sectionForm) {
        sectionForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const sectionData = {
                title: document.getElementById('sectionTitle').value,
                position: document.getElementById('sectionPosition').value,
                status: document.getElementById('sectionStatus').value,
                content: document.getElementById('sectionContent').value,
                order: document.getElementById('sectionOrder').value || 99
            };

            try {
                storageManager.addSection(sectionData);
                loadSectionsTable();
                updateDashboardStats();

                this.reset();
                showNotification('Sección añadida correctamente', 'success');
            } catch (error) {
                showNotification('Error al añadir sección: ' + error.message, 'error');
            }
        });
    }

    // Formulario de configuraciones
    const settingsForm = document.querySelector('#settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const settingsData = {};

            for (let [key, value] of formData.entries()) {
                if (this.elements[key].type === 'checkbox') {
                    settingsData[key] = this.elements[key].checked;
                } else if (this.elements[key].type === 'number') {
                    settingsData[key] = parseInt(value);
                } else {
                    settingsData[key] = value;
                }
            }

            try {
                storageManager.updateSettings(settingsData);
                showNotification('Configuraciones guardadas correctamente', 'success');
            } catch (error) {
                showNotification('Error al guardar configuraciones: ' + error.message, 'error');
            }
        });
    }
}

function setupDataButtons() {
    // Botón de exportar
    const exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            try {
                const dataStr = storageManager.exportData();
                const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                const exportLink = document.createElement('a');

                exportLink.href = dataUri;
                exportLink.download = 'backup_datos_' + new Date().toISOString().split('T')[0] + '.json';
                exportLink.click();

                showNotification('Datos exportados correctamente', 'success');
            } catch (error) {
                showNotification('Error al exportar datos: ' + error.message, 'error');
            }
        });
    }

    // Botón de importar
    const importBtn = document.getElementById('importDataBtn');
    const importInput = document.getElementById('importDataInput');

    if (importBtn && importInput) {
        importBtn.addEventListener('click', function () {
            importInput.click();
        });

        importInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                if (!confirm('¿Estás seguro? Esto sobrescribirá todos los datos actuales.')) {
                    this.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        const success = storageManager.importData(e.target.result);
                        if (success) {
                            loadCategoriesTable();
                            loadProductsTable();
                            loadSectionsTable();
                            loadSettingsForm();
                            updateDashboardStats();
                            showNotification('Datos importados correctamente', 'success');
                        }
                    } catch (error) {
                        showNotification('Error al importar datos: ' + error.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // Botón de limpiar datos
    const clearBtn = document.getElementById('clearDataBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            if (confirm('¿ESTÁS ABSOLUTAMENTE SEGURO? Esto eliminará TODOS los datos y no se puede deshacer.')) {
                localStorage.clear();
                storageManager.init();

                loadCategoriesTable();
                loadProductsTable();
                loadSectionsTable();
                loadSettingsForm();
                updateDashboardStats();

                showNotification('Todos los datos han sido reseteados', 'success');
            }
        });
    }
}

function setupNavigation() {
    // Navegación por tabs
    const tabLinks = document.querySelectorAll('.admin-menu a');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remover clase active de todos los tabs
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Añadir clase active al tab clickeado
            this.classList.add('active');
            const targetTab = this.getAttribute('href');
            document.querySelector(targetTab).classList.add('active');
        });
    });
}

function initTooltips() {
    // Inicializar tooltips simples
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', function (e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'admin-tooltip';
            tooltip.textContent = this.getAttribute('title');
            document.body.appendChild(tooltip);

            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';

            this.addEventListener('mouseleave', function () {
                tooltip.remove();
            }, { once: true });
        });
    });
}

function checkStorageUsage() {
    // Verificar uso de almacenamiento
    let totalSize = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length * 2; // Aproximación en bytes
        }
    }

    const totalMB = (totalSize / 1024 / 1024).toFixed(2);
    const maxMB = 5; // Límite aproximado de localStorage

    if (totalMB > maxMB * 0.8) {
        showNotification(`Almacenamiento casi lleno (${totalMB}MB/${maxMB}MB). Considera exportar y limpiar datos.`, 'warning');
    }
}

// ===== FUNCIONES AUXILIARES =====

function getCategoryName(categoryId) {
    const categories = storageManager.getCategories();
    const category = categories.find(c => c.id.toString() === categoryId.toString());
    return category ? category.name : 'Sin categoría';
}

function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    document.body.appendChild(notification);

    // Animación de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Cerrar notificación
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function openEditModal(type, id) {
    // Implementar modal de edición según el tipo
    alert(`Editar ${type} con ID ${id} - Esta funcionalidad está en desarrollo`);
}

function openImageModal(imageSrc, title) {
    // Implementar modal de visualización de imagen
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <img src="${imageSrc}" alt="${title}">
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Cerrar modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function changeSectionOrder(id, direction) {
    const sections = storageManager.getSections();
    const sectionIndex = sections.findIndex(s => s.id === id);

    if (sectionIndex === -1) return;

    if (direction === 'up' && sectionIndex > 0) {
        // Intercambiar con la sección anterior
        [sections[sectionIndex].order, sections[sectionIndex - 1].order] =
            [sections[sectionIndex - 1].order, sections[sectionIndex].order];
    } else if (direction === 'down' && sectionIndex < sections.length - 1) {
        // Intercambiar con la sección siguiente
        [sections[sectionIndex].order, sections[sectionIndex + 1].order] =
            [sections[sectionIndex + 1].order, sections[sectionIndex].order];
    }

    // Reordenar basado en el orden
    sections.sort((a, b) => a.order - b.order);

    // Reasignar órdenes secuenciales
    sections.forEach((section, index) => {
        section.order = index + 1;
    });

    localStorage.setItem(storageManager.sectionsKey, JSON.stringify(sections));
    loadSectionsTable();
}

function updateSimpleChart() {
    // Actualizar gráfico simple de estadísticas
    const stats = storageManager.getStats();
    const chart = document.getElementById('statsChart');

    if (!chart) return;

    // Aquí iría la lógica para actualizar un gráfico visual
    // Por ahora, solo actualizamos texto
    chart.innerHTML = `
        <div class="chart-bar" style="height: ${(stats.totalProducts / Math.max(stats.totalProducts, 1)) * 100}%">
            <span>${stats.totalProducts} Productos</span>
        </div>
        <div class="chart-bar" style="height: ${(stats.totalCategories / Math.max(stats.totalCategories, 1)) * 100}%">
            <span>${stats.totalCategories} Categorías</span>
        </div>
    `;
}

// Añadir estilos inline al documento
document.head.insertAdjacentHTML('beforeend', inlineStyles);

// Exportar para uso global
window.StorageManager = storageManager;
window.adminHelpers = {
    loadCategoriesTable,
    loadProductsTable,
    loadSectionsTable,
    updateDashboardStats,
    showNotification
};