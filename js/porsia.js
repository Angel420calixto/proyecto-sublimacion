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

// JavaScript para el funcionamiento de los sliders
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar todos los sliders
    const sliders = document.querySelectorAll('.circular-3d-wrapper');
    const rotationAngles = Array(sliders.length).fill(0);

    // Configurar evento para cada par de botones
    document.querySelectorAll('.categoria-slider').forEach((categoria, index) => {
        const prevBtn = categoria.querySelector('.prev-btn');
        const nextBtn = categoria.querySelector('.next-btn');
        const slider = categoria.querySelector('.circular-3d-wrapper');

        // Navegación con botones
        prevBtn.addEventListener('click', () => {
            rotationAngles[index] += 72;
            slider.style.transform = `rotateY(${rotationAngles[index]}deg)`;
        });

        nextBtn.addEventListener('click', () => {
            rotationAngles[index] -= 72;
            slider.style.transform = `rotateY(${rotationAngles[index]}deg)`;
        });

        // Navegación con touch para móviles
        let touchStartX = 0;
        let touchEndX = 0;
        const container = categoria.querySelector('.circular-3d-container');

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe(index);
        }, { passive: true });

        function handleSwipe(sliderIndex) {
            const swipeThreshold = 50;
            const diff = touchEndX - touchStartX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe derecho - anterior
                    rotationAngles[sliderIndex] += 72;
                } else {
                    // Swipe izquierdo - siguiente
                    rotationAngles[sliderIndex] -= 72;
                }
                sliders[sliderIndex].style.transform = `rotateY(${rotationAngles[sliderIndex]}deg)`;
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
  // Solo agregar partículas de fondo (las animaciones ya no son necesarias)
  const metalFeatures = document.querySelector('.metal-features');
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particlesContainer.appendChild(particle);
  }
  
  metalFeatures.appendChild(particlesContainer);
});







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

// Funcionalidad para el carrusel 3D de categorías
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del carrusel 3D de categorías
    const carrusel3D = document.querySelector('.carrusel-3d-categorias');
    const items3D = document.querySelectorAll('.categoria-3d-item');
    const btnPrev3D = document.getElementById('btn-prev-3d');
    const btnNext3D = document.getElementById('btn-next-3d');
    
    // Elementos de la galería
    const contenedorGaleria = document.querySelector('.contenedor-galeria');
    
    let current3DIndex = 0;
    const total3DItems = items3D.length;
    
    // Configurar posición inicial de los items 3D
    function setup3DCarousel() {
        items3D.forEach((item, index) => {
            item.classList.remove('activa', 'secundaria', 'terciaria');
            
            if (index === current3DIndex) {
                item.classList.add('activa');
            } else if (index === (current3DIndex + 1) % total3DItems || 
                      (current3DIndex === 0 && index === total3DItems - 1)) {
                item.classList.add('secundaria');
            } else if (index === (current3DIndex + 2) % total3DItems || 
                      (current3DIndex === 0 && index === total3DItems - 2) ||
                      (current3DIndex === 1 && index === total3DItems - 1)) {
                item.classList.add('terciaria');
            }
        });
    }
    
    // Navegación del carrusel 3D
    btnNext3D.addEventListener('click', () => {
        current3DIndex = (current3DIndex + 1) % total3DItems;
        setup3DCarousel();
        filtrarPorCategoria(items3D[current3DIndex].textContent);
    });
    
    btnPrev3D.addEventListener('click', () => {
        current3DIndex = (current3DIndex - 1 + total3DItems) % total3DItems;
        setup3DCarousel();
        filtrarPorCategoria(items3D[current3DIndex].textContent);
    });
    
    // Filtrar por categorías al hacer clic en un item
    items3D.forEach(item => {
        item.addEventListener('click', () => {
            const index = Array.from(items3D).indexOf(item);
            current3DIndex = index;
            setup3DCarousel();
            filtrarPorCategoria(item.textContent);
        });
    });
    
    // Simular filtrado por categoría
    function filtrarPorCategoria(categoria) {
        console.log(`Filtrando por categoría: ${categoria}`);
        // Aquí iría la lógica real para filtrar las imágenes
        document.querySelector('.titulo-seccion').textContent = `Calcomanías de ${categoria}`;
    }
    
    // Scroll interno para la galería
    contenedorGaleria.addEventListener('mouseenter', () => {
        document.body.style.overflow = 'hidden';
    });
    
    contenedorGaleria.addEventListener('mouseleave', () => {
        document.body.style.overflow = '';
    });
    
    // Touch events para dispositivos móviles
    contenedorGaleria.addEventListener('touchstart', () => {
        document.body.style.overflow = 'hidden';
    });
    
    contenedorGaleria.addEventListener('touchend', () => {
        document.body.style.overflow = '';
    });
    
    // Mostrar/ocultar información al hacer clic en una calcomanía
    const calcomaniaCards = document.querySelectorAll('.calcomania-card');
    
    calcomaniaCards.forEach(card => {
        const botonCerrar = card.querySelector('.boton-cerrar');
        const info = card.querySelector('.calcomania-info');
        const botonVerDetalles = card.querySelector('.boton-ver-detalles');
        
        card.addEventListener('click', (e) => {
            if (e.target === botonVerDetalles) {
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
    });
    
    // Inicializar
    setup3DCarousel();
});





document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad para filtrar por categoría
    const categorias = document.querySelectorAll('.categoria-item');
    const itemsGaleria = document.querySelectorAll('.item-galeria');
    const botonVerMas = document.querySelector('.boton-vermas');
    const galeria = document.querySelector('.galeria-principal');
    
    categorias.forEach(categoria => {
        categoria.addEventListener('click', function() {
            // Quitar clase activa de todas las categorías
            categorias.forEach(cat => cat.classList.remove('activa'));
            
            // Añadir clase activa a la categoría seleccionada
            this.classList.add('activa');
            
            // Obtener la categoría seleccionada
            const categoriaSeleccionada = this.textContent.trim().toLowerCase();
            
            // Filtrar la galería
            itemsGaleria.forEach(item => {
                const itemCategoria = item.getAttribute('data-categoria');
                
                if (categoriaSeleccionada === 'todos' || itemCategoria === categoriaSeleccionada) {
                    item.style.display = 'block';
                    // Pequeño retraso para la animación
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    // Ocultar después de la animación
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Funcionalidad para el botón "Ver Más"
    if (botonVerMas && galeria) {
        botonVerMas.addEventListener('click', function() {
            galeria.classList.toggle('expandida');
            
            if (galeria.classList.contains('expandida')) {
                this.textContent = 'Ver Menos';
            } else {
                this.textContent = 'Ver Más';
            }
        });
    }
});



// Funcionalidad para filtrar categorías
document.addEventListener('DOMContentLoaded', function() {
    // Filtrado por categorías
    const categorias = document.querySelectorAll('.categoria-item');
    const itemsGaleria = document.querySelectorAll('.item-galeria');
    
    categorias.forEach(categoria => {
        categoria.addEventListener('click', function() {
            // Remover clase activa de todas las categorías
            categorias.forEach(cat => cat.classList.remove('activa'));
            
            // Agregar clase activa a la categoría clickeada
            this.classList.add('activa');
            
            // Obtener la categoría seleccionada
            const categoriaSeleccionada = this.getAttribute('data-categoria');
            
            // Filtrar items
            itemsGaleria.forEach(item => {
                const itemCategoria = item.getAttribute('data-categoria');
                
                if (categoriaSeleccionada === 'todos' || categoriaSeleccionada === itemCategoria) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Funcionalidad para el botón "Ver Más"
    const botonVerMas = document.querySelector('.boton-vermas');
    const galeriaPrincipal = document.querySelector('.galeria-principal');
    
    if (botonVerMas && galeriaPrincipal) {
        botonVerMas.addEventListener('click', function() {
            galeriaPrincipal.classList.toggle('expandida');
            
            if (galeriaPrincipal.classList.contains('expandida')) {
                this.textContent = 'Ver Menos';
            } else {
                this.textContent = 'Ver Más';
            }
        });
    }
    
    // Funcionalidad para ampliar imágenes
    const imagenes = document.querySelectorAll('.item-galeria img, .imagen-mobile img');
    const overlay = document.querySelector('.overlay-imagen');
    const overlayImg = overlay.querySelector('img');
    const cerrarOverlay = overlay.querySelector('.cerrar-overlay');
    
    imagenes.forEach(imagen => {
        imagen.addEventListener('click', function() {
            overlay.classList.add('activo');
            overlayImg.src = this.src;
            overlayImg.alt = this.alt;
            document.body.style.overflow = 'hidden'; // Prevenir scroll
        });
    });
    
    // Cerrar overlay
    cerrarOverlay.addEventListener('click', function() {
        overlay.classList.remove('activo');
        document.body.style.overflow = ''; // Restaurar scroll
    });
    
    // Cerrar overlay al hacer clic fuera de la imagen
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.classList.remove('activo');
            document.body.style.overflow = ''; // Restaurar scroll
        }
    });
    
    // Cerrar overlay con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('activo')) {
            overlay.classList.remove('activo');
            document.body.style.overflow = ''; // Restaurar scroll
        }
    });
});

