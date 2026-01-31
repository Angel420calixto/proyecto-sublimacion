// ==============================================
// PORSIA.JS - FUNCIONALIDADES DEL HEADER Y CARRUSEL
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Porsia.js - Inicializando funcionalidades del header...');
    
    // ==============================================
    // 1. FUNCIONALIDAD PARA EL MENÚ MÓVIL
    // ==============================================
    function inicializarMenuMovil() {
        console.log('📱 Inicializando menú móvil...');
        
        const menuButton = document.querySelector('.boton-encabezado');
        const navMenu = document.querySelector('.enlaces');
        const body = document.body;
        
        if (!menuButton || !navMenu) {
            console.warn('⚠️ Elementos del menú no encontrados');
            return;
        }
        
        console.log('✅ Elementos del menú encontrados');
        
        menuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            navMenu.classList.toggle('activo');
            body.classList.toggle('prevent-scroll');
            
            // Cambiar ícono del botón
            const icon = menuButton.querySelector('i');
            if (navMenu.classList.contains('activo')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                console.log('📱 Menú abierto');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                console.log('📱 Menú cerrado');
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.enlace-navegacion');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('activo');
                body.classList.remove('prevent-scroll');
                
                const icon = menuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                
                console.log('📱 Menú cerrado (clic en enlace)');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuButton.contains(e.target) && navMenu.classList.contains('activo')) {
                navMenu.classList.remove('activo');
                body.classList.remove('prevent-scroll');
                
                const icon = menuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                
                console.log('📱 Menú cerrado (clic fuera)');
            }
        });
        
        // Cerrar menú con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('activo')) {
                navMenu.classList.remove('activo');
                body.classList.remove('prevent-scroll');
                
                const icon = menuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                
                console.log('📱 Menú cerrado (tecla ESC)');
            }
        });
        
        console.log('✅ Menú móvil inicializado');
    }
    
    // ==============================================
    // 2. FUNCIONALIDAD PARA EL CARRUSEL 3D
    // ==============================================
    function inicializarCarrusel3D() {
        console.log('🎠 Inicializando carrusel 3D...');
        
        const carrusel = document.querySelector('.carrusel-3d');
        const items = document.querySelectorAll('.item-carrusel');
        const indicadores = document.querySelectorAll('.indicador');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const tituloSeccion = document.querySelector('.titulo-seccion');
        
        if (!carrusel || items.length === 0) {
            console.warn('⚠️ Elementos del carrusel no encontrados');
            return;
        }
        
        console.log(`✅ Carrusel encontrado con ${items.length} items`);
        
        // ALINEAR TÍTULO "CUADROS"
        if (tituloSeccion) {
            tituloSeccion.style.textAlign = 'center';
            tituloSeccion.style.marginBottom = '30px';
            tituloSeccion.style.width = '100%';
            console.log('✅ Título "Cuadros" alineado');
        }
        
        let currentIndex = 0;
        let autoPlayInterval;
        const totalItems = items.length;
        const anglePerItem = 360 / totalItems;
        
        // Función para actualizar el carrusel
        function updateCarrusel() {
            // Remover clase activa de todos los items
            items.forEach(item => item.classList.remove('activo'));
            indicadores.forEach(ind => ind.classList.remove('activo'));
            
            // Agregar clase activa al item actual
            if (items[currentIndex]) {
                items[currentIndex].classList.add('activo');
            }
            if (indicadores[currentIndex]) {
                indicadores[currentIndex].classList.add('activo');
            }
            
            // Aplicar transformación 3D a cada item
            items.forEach((item, index) => {
                const rotateY = (index - currentIndex) * anglePerItem;
                const translateZ = window.innerWidth <= 768 ? 180 : 250; // Ajuste para móvil
                item.style.transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
                item.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            console.log(`🔄 Carrusel en posición ${currentIndex + 1}`);
        }
        
        // Función para siguiente slide
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarrusel();
            resetAutoPlay();
        }
        
        // Función para slide anterior
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarrusel();
            resetAutoPlay();
        }
        
        // Event listeners para controles
        if (btnNext) {
            btnNext.addEventListener('click', nextSlide);
        }
        
        if (btnPrev) {
            btnPrev.addEventListener('click', prevSlide);
        }
        
        // Event listeners para indicadores
        indicadores.forEach((indicador, index) => {
            indicador.addEventListener('click', () => {
                currentIndex = index;
                updateCarrusel();
                resetAutoPlay();
            });
        });
        
        // ==============================================
        // NAVEGACIÓN TÁCTIL PARA MÓVIL
        // ==============================================
        const contenedorCarrusel = document.querySelector('.contenedor-carrusel-3d');
        if (contenedorCarrusel) {
            let touchStartX = 0;
            let touchEndX = 0;
            let isSwiping = false;
            const swipeThreshold = 50;
            
            contenedorCarrusel.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                isSwiping = true;
                stopAutoPlay();
                console.log('📱 Touch start');
            }, { passive: true });
            
            contenedorCarrusel.addEventListener('touchmove', (e) => {
                if (!isSwiping) return;
                touchEndX = e.touches[0].clientX;
            }, { passive: true });
            
            contenedorCarrusel.addEventListener('touchend', () => {
                if (!isSwiping) return;
                
                const diff = touchEndX - touchStartX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe derecho -> anterior
                        console.log('➡️ Swipe derecho - Slide anterior');
                        prevSlide();
                    } else {
                        // Swipe izquierdo -> siguiente
                        console.log('⬅️ Swipe izquierdo - Slide siguiente');
                        nextSlide();
                    }
                }
                
                isSwiping = false;
                startAutoPlay();
            }, { passive: true });
            
            // Navegación con mouse para desktop
            let mouseDownX = 0;
            let mouseUpX = 0;
            
            contenedorCarrusel.addEventListener('mousedown', (e) => {
                mouseDownX = e.clientX;
                isSwiping = true;
                stopAutoPlay();
            });
            
            contenedorCarrusel.addEventListener('mousemove', (e) => {
                if (!isSwiping) return;
                mouseUpX = e.clientX;
            });
            
            contenedorCarrusel.addEventListener('mouseup', () => {
                if (!isSwiping) return;
                
                const diff = mouseUpX - mouseDownX;
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        prevSlide();
                    } else {
                        nextSlide();
                    }
                }
                
                isSwiping = false;
                startAutoPlay();
            });
        }
        
        // ==============================================
        // AUTO-PLAY
        // ==============================================
        function startAutoPlay() {
            // Solo auto-play en desktop
            if (window.innerWidth > 768) {
                stopAutoPlay();
                autoPlayInterval = setInterval(nextSlide, 4000);
                console.log('▶️ Auto-play iniciado');
            }
        }
        
        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                console.log('⏸️ Auto-play detenido');
            }
        }
        
        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }
        
        // Controlar auto-play al interactuar
        if (contenedorCarrusel) {
            contenedorCarrusel.addEventListener('mouseenter', stopAutoPlay);
            contenedorCarrusel.addEventListener('mouseleave', startAutoPlay);
        }
        
        // Inicializar
        updateCarrusel();
        startAutoPlay();
        
        // Ajustar para responsive
        window.addEventListener('resize', function() {
            updateCarrusel(); // Recalcular transformaciones
            stopAutoPlay();
            startAutoPlay(); // Reiniciar auto-play según tamaño
        });
        
        console.log('✅ Carrusel 3D inicializado');
    }
    
    // ==============================================
    // 3. SLIDERS CIRCULARES (CATEGORÍAS)
    // ==============================================
    function inicializarSlidersCirculares() {
        console.log('🌀 Inicializando sliders circulares...');
        
        const sliders = document.querySelectorAll('.circular-3d-wrapper');
        
        if (sliders.length === 0) {
            console.warn('⚠️ No hay sliders circulares');
            return;
        }
        
        console.log(`✅ ${sliders.length} sliders encontrados`);
        const rotationAngles = Array(sliders.length).fill(0);
        
        document.querySelectorAll('.categoria-slider').forEach((categoria, index) => {
            const prevBtn = categoria.querySelector('.prev-btn');
            const nextBtn = categoria.querySelector('.next-btn');
            const slider = categoria.querySelector('.circular-3d-wrapper');
            const container = categoria.querySelector('.circular-3d-container');
            
            if (!slider || !prevBtn || !nextBtn) {
                console.warn(`⚠️ Slider ${index + 1} incompleto`);
                return;
            }
            
            // Navegación con botones
            prevBtn.addEventListener('click', () => {
                rotationAngles[index] += 72;
                slider.style.transform = `rotateY(${rotationAngles[index]}deg)`;
                slider.style.transition = 'transform 0.6s ease';
                console.log(`🌀 Slider ${index + 1}: rotación ${rotationAngles[index]}°`);
            });
            
            nextBtn.addEventListener('click', () => {
                rotationAngles[index] -= 72;
                slider.style.transform = `rotateY(${rotationAngles[index]}deg)`;
                slider.style.transition = 'transform 0.6s ease';
                console.log(`🌀 Slider ${index + 1}: rotación ${rotationAngles[index]}°`);
            });
            
            // Navegación táctil
            if (container) {
                let touchStartX = 0;
                let touchEndX = 0;
                
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
                            rotationAngles[sliderIndex] += 72;
                        } else {
                            rotationAngles[sliderIndex] -= 72;
                        }
                        sliders[sliderIndex].style.transform = `rotateY(${rotationAngles[sliderIndex]}deg)`;
                        sliders[sliderIndex].style.transition = 'transform 0.6s ease';
                        console.log(`🌀 Slider ${sliderIndex + 1}: swipe detectado`);
                    }
                }
            }
        });
        
        console.log('✅ Sliders circulares inicializados');
    }
    
    // ==============================================
    // 4. EFECTOS DE HOVER Y MEJORAS VISUALES
    // ==============================================
    function inicializarEfectosVisuales() {
        console.log('🎨 Inicializando efectos visuales...');
        
        // Efectos hover para botones
        const botones = document.querySelectorAll('.boton-gallery, .gallery-btn, .btn-control');
        botones.forEach(boton => {
            boton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                this.style.transition = 'all 0.3s ease';
            });
            
            boton.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
            
            boton.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(1px)';
            });
            
            boton.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-2px)';
            });
        });
        
        // Efectos para imágenes del carrusel
        const itemsCarrusel = document.querySelectorAll('.item-carrusel');
        itemsCarrusel.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform += ' scale(1.05)';
                this.style.zIndex = '10';
                this.style.transition = 'transform 0.3s ease';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = this.style.transform.replace(' scale(1.05)', '');
                this.style.zIndex = '';
            });
        });
        
        console.log('✅ Efectos visuales aplicados');
    }
    
    // ==============================================
    // 5. INICIALIZAR TODO
    // ==============================================
    console.log('🔧 Ejecutando inicializaciones...');
    
    inicializarMenuMovil();
    inicializarCarrusel3D();
    inicializarSlidersCirculares();
    inicializarEfectosVisuales();
    
    console.log('✅ Porsia.js - Todas las funcionalidades inicializadas');
    console.log('==========================================');
});

// ==============================================
// FUNCIONES DE DEBUG (para usar en consola)
// ==============================================
function debugPorsia() {
    console.log('🔍 Debug Porsia.js:');
    console.log('- Botón menú:', document.querySelector('.boton-encabezado'));
    console.log('- Menú:', document.querySelector('.enlaces'));
    console.log('- Carrusel:', document.querySelector('.carrusel-3d'));
    console.log('- Items carrusel:', document.querySelectorAll('.item-carrusel').length);
    console.log('- Sliders circulares:', document.querySelectorAll('.circular-3d-wrapper').length);
    console.log('- Ancho ventana:', window.innerWidth);
    console.log('- Es móvil:', window.innerWidth <= 768);
}

// Exportar para debug
if (typeof window !== 'undefined') {
    window.debugPorsia = debugPorsia;
}


// Agrega esto al final de tu archivo porsia.js o en un nuevo script

document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // 1. RESTAURAR FUNCIONALIDAD DEL CARRUSEL CIRCULAR 3D
    // ===========================================
    
    const circularContainers = document.querySelectorAll('.circular-3d-container');
    const galleryPrevBtns = document.querySelectorAll('.gallery-btn.prev-btn');
    const galleryNextBtns = document.querySelectorAll('.gallery-btn.next-btn');
    
    circularContainers.forEach((container, index) => {
        const wrapper = container.querySelector('.circular-3d-wrapper');
        let currentRotation = 0;
        
        // Inicializar rotación
        wrapper.style.transform = `rotateY(${currentRotation}deg)`;
        
        // Función para rotar el carrusel
        function rotateCarousel(direction) {
            if (direction === 'next') {
                currentRotation -= 72; // 72 grados por slide (360/5)
            } else if (direction === 'prev') {
                currentRotation += 72;
            }
            
            wrapper.style.transform = `rotateY(${currentRotation}deg)`;
        }
        
        // Asignar event listeners a los botones específicos de esta categoría
        if (galleryPrevBtns[index]) {
            galleryPrevBtns[index].addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                rotateCarousel('prev');
            });
        }
        
        if (galleryNextBtns[index]) {
            galleryNextBtns[index].addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                rotateCarousel('next');
            });
        }
        
        // También permitir arrastre con mouse/touch
        let isDragging = false;
        let startX = 0;
        let startRotation = 0;
        
        container.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startRotation = currentRotation;
            container.style.cursor = 'grabbing';
        });
        
        container.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const sensitivity = 0.5;
            currentRotation = startRotation + (deltaX * sensitivity);
            wrapper.style.transform = `rotateY(${currentRotation}deg)`;
        });
        
        container.addEventListener('mouseup', function() {
            isDragging = false;
            container.style.cursor = 'pointer';
            
            // Ajustar a la posición más cercana
            const snapRotation = Math.round(currentRotation / 72) * 72;
            currentRotation = snapRotation;
            
            wrapper.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
            wrapper.style.transform = `rotateY(${currentRotation}deg)`;
            
            setTimeout(() => {
                wrapper.style.transition = '';
            }, 700);
        });
        
        container.addEventListener('mouseleave', function() {
            isDragging = false;
            container.style.cursor = 'pointer';
        });
        
        // Soporte para touch
        container.addEventListener('touchstart', function(e) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startRotation = currentRotation;
            e.preventDefault();
        });
        
        container.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const sensitivity = 0.5;
            currentRotation = startRotation + (deltaX * sensitivity);
            wrapper.style.transform = `rotateY(${currentRotation}deg)`;
            e.preventDefault();
        });
        
        container.addEventListener('touchend', function() {
            isDragging = false;
            
            // Ajustar a la posición más cercana
            const snapRotation = Math.round(currentRotation / 72) * 72;
            currentRotation = snapRotation;
            
            wrapper.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
            wrapper.style.transform = `rotateY(${currentRotation}deg)`;
            
            setTimeout(() => {
                wrapper.style.transition = '';
            }, 700);
        });
    });
    
    // ===========================================
    // 2. FUNCIONALIDAD PARA VIDEOS - USANDO IFRAME
    // ===========================================
    
    // Datos de los videos (reemplaza con tus URLs reales)
    const videosData = {
        1: {
            title: "Amazing Anime Metal Artwork",
            description: "Arte en metal de Dragon Ball - Proceso de sublimación",
            url: "https://www.youtube.com/embed/qwgbuq9XvEg?autoplay=1"
        },
        2: {
            title: "Proceso de Sublimación",
            description: "Cómo transformamos imágenes en arte en metal de alta calidad",
            url: "https://www.youtube.com/embed/0e3GPea1h6w?autoplay=1"
        },
        3: {
            title: "Colección Anime",
            description: "Personajes anime transformados en arte metal",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
        },
        4: {
            title: "Testimonios Clientes",
            description: "Lo que dicen nuestros clientes satisfechos",
            url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1"
        },
        5: {
            title: "Diseño Personalizado",
            description: "Creamos cuadros únicos según tus ideas",
            url: "https://www.youtube.com/embed/LDU_Txk06tM?autoplay=1"
        },
        6: {
            title: "Materiales Premium",
            description: "Usamos solo materiales de la más alta calidad",
            url: "https://www.youtube.com/embed/5yx6BWlEVcY?autoplay=1"
        }
    };
    
    // Elementos del modal
    const videoModal = document.getElementById('videoModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const youtubePlayer = document.getElementById('youtubePlayer');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    
    // Función para abrir el modal de video
    function openVideoModal(videoId) {
        const videoData = videosData[videoId];
        if (!videoData) {
            console.error('Video data not found for ID:', videoId);
            return;
        }
        
        videoTitle.textContent = videoData.title;
        videoDescription.textContent = videoData.description;
        youtubePlayer.src = videoData.url;
        
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Función para cerrar el modal de video
    function closeVideoModal() {
        videoModal.classList.remove('active');
        youtubePlayer.src = ''; // Detener el video
        document.body.style.overflow = 'auto';
    }
    
    // Configurar event listeners para videos del carrusel desktop
    document.querySelectorAll('.video-overlay').forEach(overlay => {
        overlay.addEventListener('click', function() {
            const slide = this.closest('.carrusel-slide');
            if (slide) {
                const videoId = slide.getAttribute('data-video-id');
                openVideoModal(videoId);
            }
        });
    });
    
    // Configurar event listeners para videos del carrusel móvil
    document.querySelectorAll('.video-overlay-mobile').forEach(overlay => {
        overlay.addEventListener('click', function() {
            const slide = this.closest('.carrusel-slide-mobile');
            if (slide) {
                const videoId = slide.getAttribute('data-video-id');
                openVideoModal(videoId);
            }
        });
    });
    
    // También permitir clic en el indicador de play
    document.querySelectorAll('.play-indicator, .play-indicator-mobile').forEach(indicator => {
        indicator.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se active el overlay también
            const slide = this.closest('.carrusel-slide, .carrusel-slide-mobile');
            if (slide) {
                const videoId = slide.getAttribute('data-video-id');
                openVideoModal(videoId);
            }
        });
    });
    
    // Botón cerrar modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeVideoModal);
    }
    
    // Cerrar modal al hacer clic fuera
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    // ===========================================
    // 3. CARRUSEL DE VIDEOS HORIZONTAL
    // ===========================================
    
    // Carrusel desktop
    const carruselTrack = document.querySelector('.carrusel-track');
    const carruselSlides = document.querySelectorAll('.carrusel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (carruselTrack && carruselSlides.length > 0) {
        let currentSlide = 0;
        const slidesToShow = 4; // Cambia según el responsive
        
        function updateCarruselDesktop() {
            const slideWidth = carruselSlides[0].offsetWidth + 25;
            const translateX = -currentSlide * slideWidth;
            carruselTrack.style.transform = `translateX(${translateX}px)`;
            
            // Actualizar indicadores
            const indicators = document.querySelectorAll('.carrusel-indicadores .indicador');
            const currentGroup = Math.floor(currentSlide / slidesToShow);
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentGroup);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateCarruselDesktop();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const maxSlide = carruselSlides.length - slidesToShow;
                if (currentSlide < maxSlide) {
                    currentSlide++;
                    updateCarruselDesktop();
                }
            });
        }
        
        // Actualizar según el tamaño de pantalla
        function updateSlidesToShow() {
            const width = window.innerWidth;
            if (width >= 1200) return 4;
            if (width >= 992) return 3;
            if (width >= 768) return 2;
            return 1;
        }
        
        // Inicializar
        updateCarruselDesktop();
    }
    
    // Carrusel móvil
    const carruselTrackMobile = document.querySelector('.carrusel-track-mobile');
    const carruselSlidesMobile = document.querySelectorAll('.carrusel-slide-mobile');
    const prevBtnMobile = document.querySelector('.prev-btn-mobile');
    const nextBtnMobile = document.querySelector('.next-btn-mobile');
    
    if (carruselTrackMobile && carruselSlidesMobile.length > 0) {
        let currentSlideMobile = 0;
        const slidesToShowMobile = 2;
        
        function updateCarruselMobile() {
            const slideWidth = carruselSlidesMobile[0].offsetWidth + 10;
            const translateX = -currentSlideMobile * slideWidth;
            carruselTrackMobile.style.transform = `translateX(${translateX}px)`;
        }
        
        if (prevBtnMobile) {
            prevBtnMobile.addEventListener('click', () => {
                if (currentSlideMobile > 0) {
                    currentSlideMobile--;
                    updateCarruselMobile();
                }
            });
        }
        
        if (nextBtnMobile) {
            nextBtnMobile.addEventListener('click', () => {
                const maxSlide = carruselSlidesMobile.length - slidesToShowMobile;
                if (currentSlideMobile < maxSlide) {
                    currentSlideMobile++;
                    updateCarruselMobile();
                }
            });
        }
        
        // Inicializar
        updateCarruselMobile();
    }
    
    // ===========================================
    // 4. VIDEO EN SECCIÓN ENCUADRE
    // ===========================================
    
    const videoEncuadre = document.querySelector('.video-encuadre');
    const videoPlayBtn = document.querySelector('.video-play-btn');
    
    if (videoEncuadre && videoPlayBtn) {
        videoPlayBtn.addEventListener('click', function() {
            if (videoEncuadre.paused) {
                videoEncuadre.play();
                videoPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                videoPlayBtn.style.opacity = '0.5';
            } else {
                videoEncuadre.pause();
                videoPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                videoPlayBtn.style.opacity = '0.8';
            }
        });
        
        videoEncuadre.addEventListener('play', function() {
            videoPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            videoPlayBtn.style.opacity = '0.5';
        });
        
        videoEncuadre.addEventListener('pause', function() {
            videoPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            videoPlayBtn.style.opacity = '0.8';
        });
        
        // Ocultar/mostrar controles al pasar el mouse
        const videoContenedor = document.querySelector('.video-contenedor');
        if (videoContenedor) {
            videoContenedor.addEventListener('mouseenter', function() {
                videoPlayBtn.style.opacity = '0.8';
            });
            
            videoContenedor.addEventListener('mouseleave', function() {
                if (!videoEncuadre.paused) {
                    videoPlayBtn.style.opacity = '0.5';
                }
            });
        }
    }
    
    // ===========================================
    // 5. BOTÓN VER MÁS VIDEOS
    // ===========================================
    
    const btnVerMas = document.querySelector('.btn-ver-mas');
    if (btnVerMas) {
        btnVerMas.addEventListener('click', function(e) {
            e.preventDefault();
            // Aquí puedes redirigir a la página de videos
            window.location.href = 'videos.html';
        });
    }
    
    // ===========================================
    // 6. ACTUALIZAR HTML DE VIDEOS (si es necesario)
    // ===========================================
    
    // Esta función actualiza los iframes de video para usar embed correcto
    function actualizarIframesDeVideo() {
        // Para el carrusel desktop
        document.querySelectorAll('.video-iframe-container').forEach(container => {
            const slide = container.closest('.carrusel-slide');
            if (slide) {
                const videoId = slide.getAttribute('data-video-id');
                const videoData = videosData[videoId];
                if (videoData) {
                    // Extraer ID del video de YouTube de la URL
                    const url = new URL(videoData.url);
                    const videoIdFromUrl = url.pathname.split('/').pop().split('?')[0];
                    
                    // Crear iframe con thumbnail de YouTube
                    const iframe = container.querySelector('iframe');
                    if (iframe) {
                        // URL para thumbnail (no autoplay)
                        iframe.src = `https://www.youtube.com/embed/${videoIdFromUrl}?controls=0&modestbranding=1&rel=0&showinfo=0`;
                    }
                }
            }
        });
    }
    
    // Ejecutar cuando el DOM esté listo
    actualizarIframesDeVideo();
});
