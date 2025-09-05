document.addEventListener('DOMContentLoaded', function() {
        // Elementos del DOM
        const carousel = document.querySelector('.carrusel-3d');
        const items = document.querySelectorAll('.item-carrusel');
        const indicators = document.querySelectorAll('.indicador');
        const prevBtn = document.querySelector('.btn-control:first-child');
        const nextBtn = document.querySelector('.btn-control:last-child');
        const categoryItems = document.querySelectorAll('.categoria-item');
        const categoryTitle = document.querySelector('.titulo-categoria');
        
        // Estado del carrusel
        let currentIndex = 0;
        let autoRotateInterval;
        const totalItems = items.length;
        
        // Inicializar el carrusel
        initCarousel();
        
        // Configurar event listeners
        setupEventListeners();
        
        function initCarousel() {
            // Posicionar inicialmente los items
            updateCarousel();
        }
        
        function setupEventListeners() {
            // Botones de navegación
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => {
                    navigate('prev');
                    resetAutoRotation();
                });
                
                nextBtn.addEventListener('click', () => {
                    navigate('next');
                    resetAutoRotation();
                });
            }
            
            // Indicadores
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                    resetAutoRotation();
                });
            });
            
            // Categorías
            categoryItems.forEach((item) => {
                item.addEventListener('click', () => {
                    // Quitar clase active de todos los items
                    categoryItems.forEach(i => i.classList.remove('activa'));
                    // Añadir clase active al item clickeado
                    item.classList.add('activa');
                    
                    // Actualizar el título de la categoría
                    if (categoryTitle) {
                        categoryTitle.textContent = item.textContent;
                    }
                    
                    // Reiniciar el carrusel
                    currentIndex = 0;
                    updateCarousel();
                    resetAutoRotation();
                });
            });
            
            // Event listeners para navegación con teclado
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    navigate('prev');
                    resetAutoRotation();
                } else if (e.key === 'ArrowRight') {
                    navigate('next');
                    resetAutoRotation();
                }
            });
            
            // Pausar la rotación automática al hacer hover
            const carouselContainer = document.querySelector('.contenedor-carrusel-3d');
            if (carouselContainer) {
                carouselContainer.addEventListener('mouseenter', () => {
                    clearInterval(autoRotateInterval);
                });
                
                carouselContainer.addEventListener('mouseleave', () => {
                    startAutoRotation();
                });
            }
        }
        
        function navigate(direction) {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % totalItems;
            } else {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            }
            updateCarousel();
        }
        
        function updateCarousel() {
            // Actualizar clases de los items - MÉTODO SIMPLIFICADO
            items.forEach((item, index) => {
                // Resetear todas las clases primero
                item.classList.remove('activo', 'prev', 'next', 'lejos-izq', 'lejos-der');
                
                // Calcular la posición relativa
                let position = index - currentIndex;
                if (position < 0) position += totalItems;
                if (position >= totalItems) position -= totalItems;
                
                // Asignar clases según la posición
                if (position === 0) {
                    item.classList.add('activo');
                } else if (position === 1) {
                    item.classList.add('next');
                } else if (position === totalItems - 1) {
                    item.classList.add('prev');
                } else if (position === 2 || position === totalItems - 2) {
                    item.classList.add(position === 2 ? 'lejos-der' : 'lejos-izq');
                } else if (position > 2 && position < totalItems - 2) {
                    // Elementos muy lejanos - ocultarlos
                    item.style.opacity = '0';
                    item.style.zIndex = '0';
                } else {
                    item.style.opacity = '';
                    item.style.zIndex = '';
                }
            });
            
            // Actualizar indicadores
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('activo');
                } else {
                    indicator.classList.remove('activo');
                }
            });
        }
        
        function startAutoRotation() {
            autoRotateInterval = setInterval(() => {
                navigate('next');
            }, 4000);
        }
        
        function resetAutoRotation() {
            clearInterval(autoRotateInterval);
            startAutoRotation();
        }
        
        // Iniciar rotación automática
        startAutoRotation();
        
        // Función para manejar el gesto de deslizamiento en dispositivos táctiles
        function setupTouchEvents() {
            let touchStartX = 0;
            let touchEndX = 0;
            const carouselContainer = document.querySelector('.contenedor-carrusel-3d');
            
            if (carouselContainer) {
                carouselContainer.addEventListener('touchstart', e => {
                    touchStartX = e.changedTouches[0].screenX;
                    clearInterval(autoRotateInterval);
                }, { passive: true });
                
                carouselContainer.addEventListener('touchend', e => {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe();
                    resetAutoRotation();
                }, { passive: true });
            }
            
            function handleSwipe() {
                const minSwipeDistance = 50;
                const distance = touchStartX - touchEndX;
                
                if (Math.abs(distance) < minSwipeDistance) return;
                
                if (distance > 0) {
                    navigate('next');
                } else {
                    navigate('prev');
                }
            }
        }
        
        // Configurar eventos táctiles
        setupTouchEvents();
    });

    // JavaScript para el menú móvil
document.addEventListener('DOMContentLoaded', function () {
    const botonMenu = document.querySelector('.boton-encabezado');
    const menu = document.querySelector('.enlaces');

    botonMenu.addEventListener('click', function () {
        menu.classList.toggle('activo');
    });

    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function (event) {
        const esClickDentroMenu = menu.contains(event.target);
        const esClickBotonMenu = botonMenu.contains(event.target);
        const esMenuActivo = menu.classList.contains('activo');

        if (esMenuActivo && !esClickDentroMenu && !esClickBotonMenu) {
            menu.classList.remove('activo');
        }
    });
});