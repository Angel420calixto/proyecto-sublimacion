document.addEventListener('DOMContentLoaded', function () {
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

document.addEventListener('DOMContentLoaded', function () {
    // =============================================
    // FUNCIONALIDAD DEL MENÚ DE NAVEGACIÓN MÓVIL
    // =============================================
    const botonMenu = document.querySelector('.boton-encabezado');
    const menu = document.querySelector('.enlaces');

    if (botonMenu && menu) {
        botonMenu.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('activo');

            // Cambiar icono de hamburguesa a X y viceversa
            const icono = this.querySelector('i');
            if (icono.classList.contains('fa-bars')) {
                icono.classList.replace('fa-bars', 'fa-times');
            } else {
                icono.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', function (event) {
            const esClickDentroMenu = menu.contains(event.target);
            const esClickBotonMenu = botonMenu.contains(event.target);
            const esMenuActivo = menu.classList.contains('activo');

            if (esMenuActivo && !esClickDentroMenu && !esClickBotonMenu) {
                menu.classList.remove('activo');
                const icono = botonMenu.querySelector('i');
                if (icono.classList.contains('fa-times')) {
                    icono.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    }

    // =============================================
    // FUNCIONALIDAD DE FILTRADO POR CATEGORÍAS
    // =============================================
    const categorias = document.querySelectorAll('.categoria-item');
    const itemsGaleria = document.querySelectorAll('.item-galeria');
    const galeriaMobile = document.querySelector('.minigaleria-mobile');
    const botonVerMas = document.querySelector('.boton-vermas');
    const galeriaPrincipal = document.querySelector('.galeria-principal');

    if (categorias.length > 0 && itemsGaleria.length > 0) {
        categorias.forEach(categoria => {
            categoria.addEventListener('click', function () {
                // Remover clase activa de todas las categorías
                categorias.forEach(cat => cat.classList.remove('activa'));

                // Agregar clase activa a la categoría clickeada
                this.classList.add('activa');

                // Obtener la categoría seleccionada
                const categoriaSeleccionada = this.getAttribute('data-categoria');

                // Filtrar items de la galería principal
                itemsGaleria.forEach(item => {
                    const itemCategoria = item.getAttribute('data-categoria');

                    if (categoriaSeleccionada === 'todos' || categoriaSeleccionada === itemCategoria) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });

                // Filtrar galería móvil (si existe)
                if (galeriaMobile) {
                    if (categoriaSeleccionada === 'todos' || galeriaMobile.getAttribute('data-categoria') === categoriaSeleccionada) {
                        galeriaMobile.style.display = 'block';
                    } else {
                        galeriaMobile.style.display = 'none';
                    }
                }
            });
        });
    }

    // =============================================
    // FUNCIONALIDAD DEL BOTÓN "VER MÁS"
    // =============================================
    if (botonVerMas && galeriaPrincipal) {
        // Inicialmente ocultar algunos elementos si hay más de 8
        const items = galeriaPrincipal.querySelectorAll('.item-galeria');
        if (items.length > 8) {
            for (let i = 8; i < items.length; i++) {
                items[i].style.display = 'none';
            }
        }

        botonVerMas.addEventListener('click', function () {
            const items = galeriaPrincipal.querySelectorAll('.item-galeria');
            let todosVisibles = true;

            // Comprobar si todos los elementos están visibles
            items.forEach(item => {
                if (item.style.display === 'none') {
                    todosVisibles = false;
                }
            });

            if (todosVisibles) {
                // Ocultar elementos excepto los primeros 8
                for (let i = 8; i < items.length; i++) {
                    items[i].style.display = 'none';
                }
                this.textContent = 'Ver Más';
            } else {
                // Mostrar todos los elementos
                items.forEach(item => {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                });
                this.textContent = 'Ver Menos';
            }
        });
    }

    // =============================================
    // FUNCIONALIDAD PARA AMPLIAR IMÁGENES
    // =============================================
    const imagenes = document.querySelectorAll('.item-galeria img, .producto-mobile img');
    const overlay = document.querySelector('.overlay-imagen');

    if (overlay) {
        const overlayImg = overlay.querySelector('img');
        const cerrarOverlay = overlay.querySelector('.cerrar-overlay');

        // Abrir overlay al hacer clic en una imagen
        imagenes.forEach(imagen => {
            imagen.addEventListener('click', function () {
                overlay.classList.add('activo');
                overlayImg.src = this.src;
                overlayImg.alt = this.alt;
                document.body.style.overflow = 'hidden';
            });
        });

        // Cerrar overlay
        if (cerrarOverlay) {
            cerrarOverlay.addEventListener('click', function () {
                overlay.classList.remove('activo');
                document.body.style.overflow = '';
            });
        }

        // Cerrar overlay al hacer clic fuera de la imagen
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.classList.remove('activo');
                document.body.style.overflow = '';
            }
        });

        // Cerrar overlay con la tecla Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('activo')) {
                overlay.classList.remove('activo');
                document.body.style.overflow = '';
            }
        });
    }

    // =============================================
    // FUNCIONALIDAD DEL FORMULARIO DE NEWSLETTER
    // =============================================
    const formularioNewsletter = document.querySelector('.newsletter-form');

    if (formularioNewsletter) {
        formularioNewsletter.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            // Validación simple de email
            if (!email || !email.includes('@')) {
                alert('Por favor, introduce un email válido.');
                return;
            }

            // Simular envío
            alert(`¡Gracias por suscribirte con el email: ${email}!`);
            emailInput.value = '';
        });
    }

    // =============================================
    // ANIMACIONES AL HACER SCROLL
    // =============================================
    function animarAlScroll() {
        const elementos = document.querySelectorAll('.item-galeria, .producto-mobile, .footer-section');

        elementos.forEach(elemento => {
            const posicion = elemento.getBoundingClientRect().top;
            const alturaVentana = window.innerHeight;

            if (posicion < alturaVentana * 0.85) {
                elemento.style.opacity = '1';
                elemento.style.transform = 'translateY(0)';
            }
        });
    }

    // Configurar elementos para animación
    const elementosAnimables = document.querySelectorAll('.item-galeria, .producto-mobile, .footer-section');
    elementosAnimables.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        elemento.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Ejecutar al cargar y al hacer scroll
    window.addEventListener('load', animarAlScroll);
    window.addEventListener('scroll', animarAlScroll);
});