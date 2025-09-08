// JavaScript unificado para toda la funcionalidad del sitio
document.addEventListener('DOMContentLoaded', function() {
    // ===== FUNCIONALIDAD DEL MENÚ MÓVIL =====
    const botonMenu = document.querySelector('.boton-encabezado');
    const menu = document.querySelector('.enlaces');

    if (botonMenu && menu) {
        botonMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.toggle('activo');
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', function(event) {
            const esClickDentroMenu = menu.contains(event.target);
            const esClickBotonMenu = botonMenu.contains(event.target);
            
            if (menu.classList.contains('activo') && !esClickDentroMenu && !esClickBotonMenu) {
                menu.classList.remove('activo');
            }
        });
    }

    // ===== FUNCIONALIDAD DEL CARRUSEL 3D PRINCIPAL =====
    const carousel = document.querySelector('.carrusel-3d');
    const items = document.querySelectorAll('.item-carrusel');
    const indicators = document.querySelectorAll('.indicador');
    const prevBtn = document.querySelector('.btn-control:first-child');
    const nextBtn = document.querySelector('.btn-control:last-child');
    const categoryTitle = document.querySelector('.titulo-categoria');
    
    if (carousel && items.length > 0) {
        let currentIndex = 0;
        let autoRotateInterval;
        const totalItems = items.length;
        
        // Inicializar el carrusel
        updateCarousel();
        
        // Configurar event listeners
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
        
        // Navegación con teclado
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
        
        // Configurar eventos táctiles
        setupTouchEvents();
        
        // Iniciar rotación automática
        startAutoRotation();
        
        function navigate(direction) {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % totalItems;
            } else {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            }
            updateCarousel();
        }
        
        function updateCarousel() {
            items.forEach((item, index) => {
                item.classList.remove('activo', 'prev', 'next', 'lejos-izq', 'lejos-der');
                
                let position = index - currentIndex;
                if (position < 0) position += totalItems;
                
                if (position === 0) {
                    item.classList.add('activo');
                } else if (position === 1) {
                    item.classList.add('next');
                } else if (position === totalItems - 1) {
                    item.classList.add('prev');
                } else if (position === 2) {
                    item.classList.add('lejos-der');
                } else if (position === totalItems - 2) {
                    item.classList.add('lejos-izq');
                } else {
                    item.style.opacity = '0.2';
                }
            });
            
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('activo', index === currentIndex);
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
    }

    // ===== FUNCIONALIDAD DE CATEGORÍAS =====
    const categoriaItems = document.querySelectorAll('.categoria-item');
    
    categoriaItems.forEach(item => {
        item.addEventListener('click', () => {
            // Quitar clase active de todos los items
            categoriaItems.forEach(i => i.classList.remove('activa'));
            
            // Añadir clase active al item clickeado
            item.classList.add('activa');
            
            // Actualizar el título si existe
            if (categoryTitle) {
                categoryTitle.textContent = item.textContent;
            }
            
            // Aquí iría la lógica para filtrar las imágenes por categoría
            console.log(`Categoría seleccionada: ${item.textContent}`);
        });
    });
    
    // Smooth scroll para la barra de categorías en móviles
    const listaCategorias = document.querySelector('.lista-categorias');
    
    if (listaCategorias) {
        listaCategorias.addEventListener('wheel', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                listaCategorias.scrollLeft += e.deltaY;
            }
        });
    }

    // ===== FUNCIONALIDAD DE LAS CALCOMANÍAS =====
    const calcomaniaCards = document.querySelectorAll('.calcomania-card');
    
    calcomaniaCards.forEach(card => {
        const botonVerDetalles = card.querySelector('.boton-ver-detalles');
        const info = card.querySelector('.calcomania-info');
        const botonCerrar = card.querySelector('.boton-cerrar');
        
        // Mostrar información al hacer hover (solo desktop)
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', () => {
                if (botonVerDetalles) botonVerDetalles.style.opacity = '1';
            });
            
            card.addEventListener('mouseleave', () => {
                if (botonVerDetalles) botonVerDetalles.style.opacity = '0';
                if (info) info.classList.remove('activa');
            });
        }
        
        // Mostrar/ocultar información al hacer clic (mobile y desktop)
        if (info && botonCerrar) {
            card.addEventListener('click', (e) => {
                if (botonVerDetalles && e.target === botonVerDetalles) {
                    // El botón "Ver Detalles" maneja su propia navegación
                    return;
                }
                
                info.classList.add('activa');
                document.body.style.overflow = 'hidden';
            });
            
            botonCerrar.addEventListener('click', (e) => {
                e.stopPropagation();
                info.classList.remove('activa');
                document.body.style.overflow = '';
            });
        }
    });

    // ===== SCROLL INTERNO PARA GALERÍA =====
    const contenedorGaleria = document.querySelector('.contenedor-galeria');
    
    if (contenedorGaleria) {
        contenedorGaleria.addEventListener('mouseenter', () => {
            document.body.style.overflow = 'hidden';
        });
        
        contenedorGaleria.addEventListener('mouseleave', () => {
            document.body.style.overflow = '';
        });
        
        // Para dispositivos táctiles
        contenedorGaleria.addEventListener('touchstart', () => {
            document.body.style.overflow = 'hidden';
        });
        
        contenedorGaleria.addEventListener('touchend', () => {
            document.body.style.overflow = '';
        });
    }

    // ===== FUNCIONALIDAD RESPONSIVA ADICIONAL =====
    function handleResponsiveChanges() {
        // Aquí puedes añadir cualquier funcionalidad específica para cambios de tamaño
    }
    
    // Ejecutar al cargar y al redimensionar
    handleResponsiveChanges();
    window.addEventListener('resize', handleResponsiveChanges);
});