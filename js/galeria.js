  document.addEventListener('DOMContentLoaded', function() {
            // Datos de las categorías
            const categories = [
                { id: 'all', name: 'Todos', icon: 'fas fa-border-all' },
                { id: 'anime', name: 'Animes', icon: 'fas fa-gamepad' },
                { id: 'retratos', name: 'Retratos', icon: 'fas fa-user' },
                { id: 'animales', name: 'Animales', icon: 'fas fa-paw' },
                { id: 'paisajes', name: 'Paisajes', icon: 'fas fa-mountain' },
                { id: 'personalizados', name: 'Personalizados', icon: 'fas fa-paint-brush' }
            ];

            // Datos de los cuadros (con categorías)
            const cuadros = [
                {
                    id: 1,
                    title: "Naturaleza Viva",
                    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    description: "Paisaje natural con colores vibrantes",
                    category: "paisajes"
                },
                {
                    id: 2,
                    title: "Retrato Abstracto",
                    image: "https://images.unsplash.com/photo-1578321272177-6c6cb8cac66f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    description: "Arte abstracto en tonos azules",
                    category: "retratos"
                },
                {
                    id: 3,
                    title: "Ciudad Futurista",
                    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    description: "Visión futurista de una metrópolis",
                    category: "paisajes"
                },
                {
                    id: 4,
                    title: "Universo Digital",
                    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    description: "Representación del espacio digital",
                    category: "personalizados"
                },
                {
                    id: 5,
                    title: "Geometría Sagrada",
                    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    description: "Patrones geométricos armónicos",
                    category: "personalizados"
                },
                {
                    id: 6,
                    title: "Gato Elegante",
                    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    description: "Retrato felino con estilo",
                    category: "animales"
                },
                {
                    id: 7,
                    title: "Personaje Anime",
                    image: "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    description: "Personaje de anime colorido",
                    category: "anime"
                },
                {
                    id: 8,
                    title: "Lobo Solitario",
                    image: "https://images.unsplash.com/photo-1568162603661-5fc3c9b67c60?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    description: "Lobo en su habitat natural",
                    category: "animales"
                }
            ];

            // Variables globales
            const categoriesList = document.getElementById('categories-list');
            const carousel = document.getElementById('carousel');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const indicatorsContainer = document.getElementById('indicators');
            const galleryTitle = document.getElementById('gallery-title');
            
            let currentIndex = 0;
            let currentCategory = 'all';
            let currentItems = [];
            
            // Crear elementos de categorías
            function createCategories() {
                categoriesList.innerHTML = '';
                
                categories.forEach(category => {
                    const categoryItem = document.createElement('li');
                    categoryItem.className = 'category-item';
                    
                    const categoryBtn = document.createElement('button');
                    categoryBtn.className = 'category-btn';
                    if (category.id === currentCategory) {
                        categoryBtn.classList.add('active');
                    }
                    categoryBtn.innerHTML = `
                        <i class="${category.icon}"></i>
                        <span>${category.name}</span>
                    `;
                    categoryBtn.addEventListener('click', () => {
                        filterByCategory(category.id);
                    });
                    
                    categoryItem.appendChild(categoryBtn);
                    categoriesList.appendChild(categoryItem);
                });
            }
            
            // Filtrar por categoría
            function filterByCategory(categoryId) {
                currentCategory = categoryId;
                currentIndex = 0;
                
                // Actualizar botones de categoría
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelectorAll('.category-btn')[categories.findIndex(c => c.id === categoryId)].classList.add('active');
                
                // Filtrar elementos
                currentItems = categoryId === 'all' 
                    ? [...cuadros] 
                    : cuadros.filter(cuadro => cuadro.category === categoryId);
                
                // Actualizar carrusel
                updateCarousel();
                
                // Actualizar título
                const categoryName = categories.find(c => c.id === categoryId).name;
                galleryTitle.textContent = categoryId === 'all' ? 'Todos los cuadros' : `Cuadros de ${categoryName}`;
            }
            
            // Crear elementos del carrusel
            function createCarousel() {
                carousel.innerHTML = '';
                indicatorsContainer.innerHTML = '';
                
                if (currentItems.length === 0) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'empty-message';
                    emptyMessage.innerHTML = `
                        <h3>No hay elementos en esta categoría</h3>
                        <p>Selecciona otra categoría para ver más cuadros</p>
                    `;
                    carousel.appendChild(emptyMessage);
                    return;
                }
                
                // Crear elementos del carrusel
                currentItems.forEach((item, index) => {
                    const carouselItem = document.createElement('div');
                    carouselItem.className = 'carousel-item';
                    carouselItem.innerHTML = `
                        <img src="${item.image}" alt="${item.title}">
                        <div class="carousel-content">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    `;
                    
                    carouselItem.addEventListener('click', () => {
                        // Redireccionar a página de detalles
                        window.location.href = `detalle.html?id=${item.id}&category=${item.category}`;
                    });
                    
                    carousel.appendChild(carouselItem);
                    
                    // Crear indicadores
                    const indicator = document.createElement('div');
                    indicator.className = 'indicator';
                    if (index === 0) indicator.classList.add('active');
                    indicator.addEventListener('click', () => {
                        goToItem(index);
                    });
                    indicatorsContainer.appendChild(indicator);
                });
                
                updateCarouselPosition();
            }
            
            // Actualizar posición del carrusel
            function updateCarouselPosition() {
                const items = document.querySelectorAll('.carousel-item');
                const indicators = document.querySelectorAll('.indicator');
                
                if (items.length === 0) return;
                
                items.forEach((item, index) => {
                    item.classList.remove('active', 'prev', 'next', 'far-left', 'far-right');
                    
                    if (index === currentIndex) {
                        item.classList.add('active');
                    } else if (index === currentIndex - 1) {
                        item.classList.add('prev');
                    } else if (index === currentIndex + 1) {
                        item.classList.add('next');
                    } else if (index === currentIndex - 2) {
                        item.classList.add('far-left');
                    } else if (index === currentIndex + 2) {
                        item.classList.add('far-right');
                    } else if (currentIndex === 0 && index === items.length - 1) {
                        item.classList.add('far-left');
                    } else if (currentIndex === items.length - 1 && index === 0) {
                        item.classList.add('far-right');
                    }
                });
                
                indicators.forEach((indicator, index) => {
                    indicator.classList.remove('active');
                    if (index === currentIndex) {
                        indicator.classList.add('active');
                    }
                });
            }
            
            // Navegación
            function goToNext() {
                if (currentItems.length === 0) return;
                currentIndex = (currentIndex + 1) % currentItems.length;
                updateCarouselPosition();
            }
            
            function goToPrev() {
                if (currentItems.length === 0) return;
                currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
                updateCarouselPosition();
            }
            
            function goToItem(index) {
                if (currentItems.length === 0) return;
                currentIndex = index;
                updateCarouselPosition();
            }
            
            // Event listeners
            prevBtn.addEventListener('click', goToPrev);
            nextBtn.addEventListener('click', goToNext);
            
            // Inicializar
            createCategories();
            filterByCategory('all');
            
            // Auto-rotación
            let autoRotate = setInterval(goToNext, 5000);
            
            // Pausar auto-rotación al interactuar
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoRotate);
            });
            
            carousel.addEventListener('mouseleave', () => {
                autoRotate = setInterval(goToNext, 5000);
            });
        });