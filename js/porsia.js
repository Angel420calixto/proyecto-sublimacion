// ==============================================
// PORSIA.JS - FUNCIONALIDADES DEL HEADER Y CARRUSEL
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Porsia.js - Inicializando funcionalidades...');
    
    // ==============================================
    // 1. FUNCIONALIDAD PARA EL MENÚ MÓVIL
    // ==============================================
    function inicializarMenuMovil() {
        console.log('📱 Inicializando menú móvil...');
        
        const menuButton = document.querySelector('#menu-toggle');
        const navMenu = document.querySelector('#nav-menu');
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
        
        if (!carrusel || items.length === 0) {
            console.warn('⚠️ Elementos del carrusel no encontrados');
            return;
        }
        
        console.log(`✅ Carrusel encontrado con ${items.length} items`);
        
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
                const translateZ = window.innerWidth <= 768 ? 180 : 250;
                item.style.transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
                item.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // Aplicar clases para posiciones
                item.classList.remove('prev', 'next', 'lejos-izq', 'lejos-der');
                
                const diff = index - currentIndex;
                if (diff === -1 || diff === totalItems - 1) {
                    item.classList.add('prev');
                } else if (diff === 1 || diff === -totalItems + 1) {
                    item.classList.add('next');
                } else if (diff === -2 || diff === totalItems - 2) {
                    item.classList.add('lejos-izq');
                } else if (diff === 2 || diff === -totalItems + 2) {
                    item.classList.add('lejos-der');
                }
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
    // 3. SLIDERS CIRCULARES (CATEGORÍAS) - FUNCIONALIDAD RESTAURADA
    // ==============================================
    function inicializarSlidersCirculares() {
        console.log('🌀 Inicializando sliders circulares...');
        
        const sliders = document.querySelectorAll('.circular-3d-wrapper');
        
        if (sliders.length === 0) {
            console.warn('⚠️ No hay sliders circulares');
            return;
        }
        
        console.log(`✅ ${sliders.length} sliders encontrados`);
        
        // Inicializar cada slider circular
        sliders.forEach((slider, sliderIndex) => {
            let rotation = 0;
            const categoria = slider.closest('.categoria-slider');
            const categoriaId = categoria ? categoria.dataset.categoria : sliderIndex;
            
            // Buscar botones específicos de esta categoría
            const prevBtn = document.querySelector(`.prev-btn[data-categoria="${categoriaId}"]`);
            const nextBtn = document.querySelector(`.next-btn[data-categoria="${categoriaId}"]`);
            
            // Navegación con botones
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    rotation += 72;
                    slider.style.transform = `rotateY(${rotation}deg)`;
                    slider.style.transition = 'transform 0.6s ease';
                    console.log(`🌀 Slider ${categoriaId}: rotación ${rotation}° (prev)`);
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    rotation -= 72;
                    slider.style.transform = `rotateY(${rotation}deg)`;
                    slider.style.transition = 'transform 0.6s ease';
                    console.log(`🌀 Slider ${categoriaId}: rotación ${rotation}° (next)`);
                });
            }
            
            // Navegación táctil
            const container = slider.closest('.circular-3d-container');
            if (container) {
                let touchStartX = 0;
                let touchEndX = 0;
                let isDragging = false;
                
                container.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                    isDragging = true;
                    container.style.cursor = 'grabbing';
                }, { passive: true });
                
                container.addEventListener('touchmove', (e) => {
                    if (!isDragging) return;
                    touchEndX = e.touches[0].clientX;
                }, { passive: true });
                
                container.addEventListener('touchend', () => {
                    if (!isDragging) return;
                    
                    const diff = touchEndX - touchStartX;
                    const swipeThreshold = 50;
                    
                    if (Math.abs(diff) > swipeThreshold) {
                        if (diff > 0) {
                            // Swipe derecho -> anterior
                            rotation += 72;
                        } else {
                            // Swipe izquierdo -> siguiente
                            rotation -= 72;
                        }
                        slider.style.transform = `rotateY(${rotation}deg)`;
                        slider.style.transition = 'transform 0.6s ease';
                        console.log(`🌀 Slider ${categoriaId}: swipe detectado`);
                    }
                    
                    isDragging = false;
                    container.style.cursor = 'pointer';
                }, { passive: true });
                
                // Navegación con mouse para desktop
                container.addEventListener('mousedown', (e) => {
                    touchStartX = e.clientX;
                    isDragging = true;
                    container.style.cursor = 'grabbing';
                });
                
                container.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    touchEndX = e.clientX;
                });
                
                container.addEventListener('mouseup', () => {
                    if (!isDragging) return;
                    
                    const diff = touchEndX - touchStartX;
                    const swipeThreshold = 50;
                    
                    if (Math.abs(diff) > swipeThreshold) {
                        if (diff > 0) {
                            rotation += 72;
                        } else {
                            rotation -= 72;
                        }
                        slider.style.transform = `rotateY(${rotation}deg)`;
                        slider.style.transition = 'transform 0.6s ease';
                        console.log(`🌀 Slider ${categoriaId}: mouse drag detectado`);
                    }
                    
                    isDragging = false;
                    container.style.cursor = 'pointer';
                });
                
                container.addEventListener('mouseleave', () => {
                    isDragging = false;
                    container.style.cursor = 'pointer';
                });
            }
        });
        
        console.log('✅ Sliders circulares inicializados');
    }
    
    // ==============================================
    // 4. FUNCIONALIDAD PARA VIDEOS
    // ==============================================
    function inicializarVideos() {
        console.log('🎥 Inicializando funcionalidad de videos...');
        
        // Datos de los videos
        const videosData = {
            'qwgbuq9XvEg': {
                title: "Amazing Anime Metal Artwork",
                description: "Arte en metal de Dragon Ball - Proceso de sublimación"
            },
            '0e3GPea1h6w': {
                title: "Proceso de Sublimación",
                description: "Cómo transformamos imágenes en arte en metal de alta calidad"
            },
            'dQw4w9WgXcQ': {
                title: "Colección Anime",
                description: "Personajes anime transformados en arte metal"
            },
            'jfKfPfyJRdk': {
                title: "Testimonios Clientes",
                description: "Lo que dicen nuestros clientes satisfechos"
            },
            'LDU_Txk06tM': {
                title: "Diseño Personalizado",
                description: "Creamos cuadros únicos según tus ideas"
            },
            '5yx6BWlEVcY': {
                title: "Materiales Premium",
                description: "Usamos solo materiales de la más alta calidad"
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
            youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
            
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log(`🎬 Abriendo video: ${videoId}`);
        }
        
        // Función para cerrar el modal de video
        function closeVideoModal() {
            videoModal.classList.remove('active');
            youtubePlayer.src = ''; // Detener el video
            document.body.style.overflow = 'auto';
            console.log('🎬 Cerrando modal de video');
        }
        
        // Configurar event listeners para videos del carrusel desktop
        document.querySelectorAll('.video-overlay, .play-indicator').forEach(element => {
            element.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video-id');
                if (videoId) {
                    openVideoModal(videoId);
                }
            });
        });
        
        // Configurar event listeners para videos del carrusel móvil
        document.querySelectorAll('.video-overlay-mobile, .play-indicator-mobile').forEach(element => {
            element.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video-id');
                if (videoId) {
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
        
        console.log('✅ Funcionalidad de videos inicializada');
    }
    
    // ==============================================
    // 5. CARRUSEL DE VIDEOS HORIZONTAL
    // ==============================================
    function inicializarCarruselVideos() {
        console.log('📹 Inicializando carrusel de videos...');
        
        // Carrusel desktop
        const carruselTrack = document.querySelector('.carrusel-track');
        const carruselSlides = document.querySelectorAll('.carrusel-slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (carruselTrack && carruselSlides.length > 0) {
            let currentSlide = 0;
            let slidesToShow = getSlidesToShow();
            
            function getSlidesToShow() {
                const width = window.innerWidth;
                if (width >= 1200) return 4;
                if (width >= 992) return 3;
                if (width >= 768) return 2;
                return 1;
            }
            
            function updateCarruselDesktop() {
                const slideWidth = carruselSlides[0].offsetWidth + 25;
                const translateX = -currentSlide * slideWidth;
                carruselTrack.style.transform = `translateX(${translateX}px)`;
                carruselTrack.style.transition = 'transform 0.5s ease';
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
            window.addEventListener('resize', () => {
                slidesToShow = getSlidesToShow();
                currentSlide = Math.min(currentSlide, carruselSlides.length - slidesToShow);
                updateCarruselDesktop();
            });
            
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
                carruselTrackMobile.style.transition = 'transform 0.5s ease';
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
        
        console.log('✅ Carrusel de videos inicializado');
    }
    
    // ==============================================
    // 6. VIDEO EN SECCIÓN ENCUADRE
    // ==============================================
    function inicializarVideoEncuadre() {
        console.log('📼 Inicializando video de encuadre...');
        
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
        
        console.log('✅ Video de encuadre inicializado');
    }
    
    // ==============================================
    // 7. INICIALIZAR TODO
    // ==============================================
    console.log('🔧 Ejecutando inicializaciones...');
    
    inicializarMenuMovil();
    inicializarCarrusel3D();
    inicializarSlidersCirculares();
    inicializarVideos();
    inicializarCarruselVideos();
    inicializarVideoEncuadre();
    
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