// ==============================================
// SCRIPT PRINCIPAL - FUNCIONALIDAD ORIGINAL RESTAURADA
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando sitio web...');
    
    // ==============================================
    // 1. MENÚ MÓVIL RESPONSIVE
    // ==============================================
    
    function inicializarMenuMovil() {
        const menuButton = document.querySelector('.boton-encabezado');
        const navMenu = document.querySelector('.enlaces');
        const body = document.body;
        
        if (!menuButton || !navMenu) return;
        
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
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.enlace-navegacion').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('activo');
                body.classList.remove('prevent-scroll');
                const icon = menuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && 
                !menuButton.contains(e.target) && 
                navMenu.classList.contains('activo')) {
                navMenu.classList.remove('activo');
                body.classList.remove('prevent-scroll');
                const icon = menuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
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
            }
        });
    }
    
    // ==============================================
    // 2. CARRUSEL 3D PRINCIPAL - FUNCIONALIDAD ORIGINAL
    // ==============================================
    
    function inicializarCarruselPrincipal() {
        const carrusel = document.querySelector('.carrusel-3d');
        const items = document.querySelectorAll('.item-carrusel');
        const indicadores = document.querySelectorAll('.indicador');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        
        if (!carrusel || items.length === 0) return;
        
        let currentIndex = 0;
        let autoPlayInterval;
        const totalItems = items.length;
        
        // RESTAURAR: Volver a object-fit: cover para mantener diseño original
        items.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                img.style.objectFit = 'cover'; // ORIGINAL: cover
                img.style.objectPosition = 'center';
                img.style.backgroundColor = 'transparent'; // ORIGINAL
            }
        });
        
        function actualizarCarrusel() {
            // Remover todas las clases de posición
            items.forEach(item => {
                item.classList.remove('activo', 'prev', 'next', 'lejos-izq', 'lejos-der');
            });
            
            // Remover clase activa de indicadores
            indicadores.forEach(ind => ind.classList.remove('activo'));
            
            // Agregar clases según posición (funcionalidad original)
            items.forEach((item, index) => {
                const diff = index - currentIndex;
                
                if (diff === 0) {
                    item.classList.add('activo');
                } else if (diff === -1 || diff === totalItems - 1) {
                    item.classList.add('prev');
                } else if (diff === 1 || diff === -totalItems + 1) {
                    item.classList.add('next');
                } else if (diff === -2 || diff === totalItems - 2) {
                    item.classList.add('lejos-izq');
                } else if (diff === 2 || diff === -totalItems + 2) {
                    item.classList.add('lejos-der');
                } else {
                    // Items fuera de vista
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(1000px) translateZ(-300px) scale(0.5)';
                }
            });
            
            // Activar indicador correspondiente
            if (indicadores[currentIndex]) {
                indicadores[currentIndex].classList.add('activo');
            }
        }
        
        function siguienteSlide() {
            currentIndex = (currentIndex + 1) % totalItems;
            actualizarCarrusel();
            reiniciarAutoPlay();
        }
        
        function anteriorSlide() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            actualizarCarrusel();
            reiniciarAutoPlay();
        }
        
        // Event listeners para controles
        if (btnNext) btnNext.addEventListener('click', siguienteSlide);
        if (btnPrev) btnPrev.addEventListener('click', anteriorSlide);
        
        // Event listeners para indicadores
        indicadores.forEach((indicador, index) => {
            indicador.addEventListener('click', () => {
                currentIndex = index;
                actualizarCarrusel();
                reiniciarAutoPlay();
            });
        });
        
        // Navegación táctil (mantener funcionalidad original)
        const contenedorCarrusel = document.querySelector('.contenedor-carrusel-3d');
        if (contenedorCarrusel) {
            let touchStartX = 0;
            let isSwiping = false;
            const swipeThreshold = 50;
            
            contenedorCarrusel.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                isSwiping = true;
                detenerAutoPlay();
            }, { passive: true });
            
            contenedorCarrusel.addEventListener('touchend', (e) => {
                if (!isSwiping) return;
                
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchEndX - touchStartX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        anteriorSlide();
                    } else {
                        siguienteSlide();
                    }
                }
                
                isSwiping = false;
                iniciarAutoPlay();
            }, { passive: true });
            
            // Navegación con mouse
            let mouseDownX = 0;
            
            contenedorCarrusel.addEventListener('mousedown', (e) => {
                mouseDownX = e.clientX;
                isSwiping = true;
                detenerAutoPlay();
            });
            
            contenedorCarrusel.addEventListener('mouseup', (e) => {
                if (!isSwiping) return;
                
                const mouseUpX = e.clientX;
                const diff = mouseUpX - mouseDownX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        anteriorSlide();
                    } else {
                        siguienteSlide();
                    }
                }
                
                isSwiping = false;
                iniciarAutoPlay();
            });
        }
        
        // Auto-play (funcionalidad original)
        function iniciarAutoPlay() {
            if (window.innerWidth > 768) {
                detenerAutoPlay();
                autoPlayInterval = setInterval(siguienteSlide, 4000);
            }
        }
        
        function detenerAutoPlay() {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        }
        
        function reiniciarAutoPlay() {
            detenerAutoPlay();
            iniciarAutoPlay();
        }
        
        // Controlar auto-play al interactuar
        if (contenedorCarrusel) {
            contenedorCarrusel.addEventListener('mouseenter', detenerAutoPlay);
            contenedorCarrusel.addEventListener('mouseleave', iniciarAutoPlay);
        }
        
        // Inicializar
        actualizarCarrusel();
        iniciarAutoPlay();
        
        // Responsive
        window.addEventListener('resize', function() {
            actualizarCarrusel();
            detenerAutoPlay();
            iniciarAutoPlay();
        });
    }
    
    // ==============================================
    // 3. SLIDERS CIRCULARES - FUNCIONALIDAD ORIGINAL RESTAURADA
    // ==============================================
    
    function inicializarSlidersCirculares() {
        const categorias = document.querySelectorAll('.categoria-slider');
        
        categorias.forEach((categoria, index) => {
            const prevBtn = categoria.querySelector('.prev-btn');
            const nextBtn = categoria.querySelector('.next-btn');
            const slider = categoria.querySelector('.circular-3d-wrapper');
            const slides = categoria.querySelectorAll('.circular-slide img');
            
            if (!slider || !prevBtn || !nextBtn) return;
            
            // RESTAURAR: Volver a object-fit: cover
            slides.forEach(img => {
                img.style.objectFit = 'cover'; // ORIGINAL: cover
                img.style.objectPosition = 'center';
                img.style.backgroundColor = 'transparent';
                img.style.padding = '0'; // ORIGINAL: sin padding
            });
            
            let currentRotation = 0;
            
            // Inicializar rotación
            slider.style.transform = `rotateY(${currentRotation}deg)`;
            
            function rotarSlider(direction) {
                if (direction === 'next') {
                    currentRotation -= 72; // 72 grados por slide (360/5)
                } else if (direction === 'prev') {
                    currentRotation += 72;
                }
                
                slider.style.transform = `rotateY(${currentRotation}deg)`;
                slider.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
            }
            
            // Event listeners para botones (funcionalidad original)
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                rotarSlider('prev');
            });
            
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                rotarSlider('next');
            });
            
            // Navegación táctil para móvil
            const container = categoria.querySelector('.circular-3d-container');
            if (container) {
                let touchStartX = 0;
                
                container.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                }, { passive: true });
                
                container.addEventListener('touchend', (e) => {
                    const touchEndX = e.changedTouches[0].clientX;
                    const diff = touchEndX - touchStartX;
                    
                    if (Math.abs(diff) > 30) {
                        if (diff > 0) {
                            rotarSlider('prev');
                        } else {
                            rotarSlider('next');
                        }
                    }
                }, { passive: true });
            }
        });
    }
    
    // ==============================================
    // 4. CARRUSEL DE VIDEOS HORIZONTAL - FUNCIONALIDAD ORIGINAL
    // ==============================================
    
    function inicializarCarruselVideos() {
        // Carrusel desktop
        const carruselTrack = document.querySelector('.carrusel-track');
        const carruselSlides = document.querySelectorAll('.carrusel-slide');
        const prevBtn = document.querySelector('[data-carousel-prev="videos-desktop"]');
        const nextBtn = document.querySelector('[data-carousel-next="videos-desktop"]');
        
        if (carruselTrack && carruselSlides.length > 0) {
            let currentSlide = 0;
            let slidesToShow = 4; // Valor por defecto para desktop
            
            function actualizarCarruselDesktop() {
                const slideWidth = carruselSlides[0].offsetWidth + 25;
                const translateX = -currentSlide * slideWidth;
                carruselTrack.style.transform = `translateX(${translateX}px)`;
                carruselTrack.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            }
            
            function calcularSlidesParaMostrar() {
                const width = window.innerWidth;
                if (width >= 1200) return 4;
                if (width >= 992) return 3;
                if (width >= 768) return 2;
                return 1;
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (currentSlide > 0) {
                        currentSlide--;
                        actualizarCarruselDesktop();
                    }
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    slidesToShow = calcularSlidesParaMostrar();
                    const maxSlide = Math.max(0, carruselSlides.length - slidesToShow);
                    if (currentSlide < maxSlide) {
                        currentSlide++;
                        actualizarCarruselDesktop();
                    }
                });
            }
            
            // Inicializar
            actualizarCarruselDesktop();
            
            // Actualizar en resize
            window.addEventListener('resize', () => {
                actualizarCarruselDesktop();
            });
        }
        
        // Carrusel móvil
        const carruselTrackMobile = document.querySelector('.carrusel-track-mobile');
        const carruselSlidesMobile = document.querySelectorAll('.carrusel-slide-mobile');
        const prevBtnMobile = document.querySelector('[data-carousel-prev="videos-mobile"]');
        const nextBtnMobile = document.querySelector('[data-carousel-next="videos-mobile"]');
        
        if (carruselTrackMobile && carruselSlidesMobile.length > 0) {
            let currentSlideMobile = 0;
            
            function actualizarCarruselMobile() {
                if (carruselSlidesMobile.length === 0) return;
                
                const slideWidth = carruselSlidesMobile[0].offsetWidth + 10;
                const translateX = -currentSlideMobile * slideWidth;
                carruselTrackMobile.style.transform = `translateX(${translateX}px)`;
                carruselTrackMobile.style.transition = 'transform 0.5s ease';
            }
            
            if (prevBtnMobile) {
                prevBtnMobile.addEventListener('click', () => {
                    if (currentSlideMobile > 0) {
                        currentSlideMobile--;
                        actualizarCarruselMobile();
                    }
                });
            }
            
            if (nextBtnMobile) {
                nextBtnMobile.addEventListener('click', () => {
                    const maxSlide = Math.max(0, carruselSlidesMobile.length - 2);
                    if (currentSlideMobile < maxSlide) {
                        currentSlideMobile++;
                        actualizarCarruselMobile();
                    }
                });
            }
            
            // Inicializar
            actualizarCarruselMobile();
        }
    }
    
    // ==============================================
    // 5. MODAL DE VIDEOS - FUNCIONALIDAD SIMPLIFICADA
    // ==============================================
    
    function inicializarModalVideos() {
        const videoModal = document.getElementById('videoModal');
        const closeModalBtn = document.querySelector('.close-modal');
        const youtubePlayer = document.getElementById('youtubePlayer');
        
        if (!videoModal || !youtubePlayer) return;
        
        // Datos básicos de videos
        const videosData = {
            1: "https://www.youtube.com/embed/qwgbuq9XvEg?autoplay=1",
            2: "https://www.youtube.com/embed/0e3GPea1h6w?autoplay=1",
            3: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
            4: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1",
            5: "https://www.youtube.com/embed/LDU_Txk06tM?autoplay=1",
            6: "https://www.youtube.com/embed/5yx6BWlEVcY?autoplay=1"
        };
        
        function abrirModalVideo(videoId) {
            const videoUrl = videosData[videoId];
            if (!videoUrl) return;
            
            youtubePlayer.src = videoUrl;
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function cerrarModalVideo() {
            videoModal.classList.remove('active');
            youtubePlayer.src = '';
            document.body.style.overflow = 'auto';
        }
        
        // Configurar event listeners para miniaturas de video
        document.querySelectorAll('.play-indicator, .play-indicator-mobile').forEach(playBtn => {
            playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const slide = this.closest('.carrusel-slide, .carrusel-slide-mobile');
                if (slide) {
                    const videoId = slide.getAttribute('data-video-id');
                    if (videoId) abrirModalVideo(parseInt(videoId));
                }
            });
        });
        
        // También permitir clic en la miniatura completa
        document.querySelectorAll('.video-thumbnail-carrusel, .video-miniatura-mobile').forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const slide = this.closest('.carrusel-slide, .carrusel-slide-mobile');
                if (slide) {
                    const videoId = slide.getAttribute('data-video-id');
                    if (videoId) abrirModalVideo(parseInt(videoId));
                }
            });
        });
        
        // Botón cerrar modal
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', cerrarModalVideo);
        }
        
        // Cerrar modal al hacer clic fuera
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                cerrarModalVideo();
            }
        });
        
        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                cerrarModalVideo();
            }
        });
    }
    
    // ==============================================
    // 6. VIDEO EN SECCIÓN ENCUADRE - FUNCIONALIDAD ORIGINAL
    // ==============================================
    
    function inicializarVideoEncuadre() {
        const videoEncuadre = document.querySelector('.video-encuadre');
        const videoPlayBtn = document.querySelector('.video-play-btn');
        const videoContenedor = document.querySelector('.video-contenedor');
        
        if (!videoEncuadre || !videoPlayBtn || !videoContenedor) return;
        
        // RESTAURAR: Mantener object-fit original
        videoEncuadre.style.objectFit = 'cover';
        
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
        
        // Ocultar/mostrar controles al pasar el mouse (funcionalidad original)
        videoContenedor.addEventListener('mouseenter', function() {
            videoPlayBtn.style.opacity = '0.8';
        });
        
        videoContenedor.addEventListener('mouseleave', function() {
            if (!videoEncuadre.paused) {
                videoPlayBtn.style.opacity = '0.5';
            }
        });
    }
    
    // ==============================================
    // 7. CORRECCIÓN DE IMÁGENES QUE SE SALEN DEL CONTENEDOR
    // ==============================================
    
    function corregirImagenesDesbordadas() {
        // Solucionar imágenes que se salen de su contenedor
        const imagenesProblema = document.querySelectorAll('.item-carrusel img, .circular-slide img');
        
        imagenesProblema.forEach(img => {
            // RESTAURAR: Mantener object-fit: cover para diseño original
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
            
            // Prevenir desbordamiento manteniendo dentro del contenedor
            const contenedor = img.parentElement;
            if (contenedor) {
                contenedor.style.overflow = 'hidden';
                contenedor.style.position = 'relative';
                
                // Asegurar que la imagen no exceda el contenedor
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.display = 'block';
            }
        });
        
        // También corregir imágenes en otras secciones si es necesario
        const otrasImagenes = document.querySelectorAll('.imagen-destacada, .thumbnail-carrusel');
        otrasImagenes.forEach(img => {
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });
    }
    
    // ==============================================
    // 8. EFECTOS HOVER - FUNCIONALIDAD ORIGINAL MEJORADA
    // ==============================================
    
    function inicializarEfectosHover() {
        // Efectos para botones (funcionalidad original mejorada)
        const botones = document.querySelectorAll('.boton-gallery, .gallery-btn, .btn-control, .btn-ver-mas');
        
        botones.forEach(boton => {
            boton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.transition = 'all 0.3s ease';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            });
            
            boton.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
        
        // Efectos para items del carrusel principal (mejorado)
        document.querySelectorAll('.item-carrusel').forEach(item => {
            item.addEventListener('mouseenter', function() {
                if (this.classList.contains('activo')) {
                    this.style.transform = this.style.transform.replace('scale(1.05)', 'scale(1.08)');
                    this.style.boxShadow = '0 20px 40px rgba(106, 64, 191, 0.6)';
                }
                this.style.zIndex = '20';
            });
            
            item.addEventListener('mouseleave', function() {
                if (this.classList.contains('activo')) {
                    this.style.transform = this.style.transform.replace('scale(1.08)', 'scale(1.05)');
                    this.style.boxShadow = '0 15px 35px rgba(106, 64, 191, 0.4)';
                }
                this.style.zIndex = '';
            });
        });
        
        // Efectos para slides circulares (mejorado)
        document.querySelectorAll('.circular-slide').forEach(slide => {
            slide.addEventListener('mouseenter', function() {
                this.style.transform = 'translate(-50%, -50%) scale(1.1)';
                this.style.boxShadow = '0 10px 25px rgba(106, 64, 191, 0.5)';
                this.style.borderColor = 'rgba(106, 64, 191, 0.8)';
            });
            
            slide.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(-50%, -50%) scale(1)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            });
        });
    }
    
    // ==============================================
    // 9. FUNCIONALIDADES ADICIONALES
    // ==============================================
    
    function inicializarBotonVerMas() {
        const btnVerMas = document.querySelector('.btn-ver-mas');
        if (btnVerMas) {
            btnVerMas.addEventListener('click', function(e) {
                e.preventDefault();
                // Redirigir a la página de videos
                if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                    window.location.href = 'videos.html';
                } else {
                    window.location.href = 'videos.html';
                }
            });
        }
    }
    
    function inicializarNewsletter() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                if (email) {
                    alert('¡Gracias por suscribirte! Te mantendremos informado.');
                    this.reset();
                }
            });
        }
    }
    
    // ==============================================
    // 10. INICIALIZACIÓN PRINCIPAL
    // ==============================================
    
    function inicializarTodasLasFunciones() {
        console.log('🔧 Ejecutando inicializaciones...');
        
        // 1. Funcionalidades principales
        inicializarMenuMovil();
        inicializarCarruselPrincipal();
        inicializarSlidersCirculares();
        
        // 2. Funcionalidades multimedia
        inicializarCarruselVideos();
        inicializarModalVideos();
        inicializarVideoEncuadre();
        
        // 3. Correcciones y mejoras
        corregirImagenesDesbordadas();
        inicializarEfectosHover();
        
        // 4. Funcionalidades adicionales
        inicializarBotonVerMas();
        inicializarNewsletter();
        
        console.log('✅ Todas las funcionalidades inicializadas');
    }
    
    // Inicializar cuando el DOM esté listo
    inicializarTodasLasFunciones();
    
    // Reajustar en resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Re-inicializar solo funciones que necesitan ajuste
            corregirImagenesDesbordadas();
            
            // Forzar reflow en carruseles
            const carrusel = document.querySelector('.carrusel-3d');
            if (carrusel) {
                carrusel.style.display = 'none';
                carrusel.offsetHeight; // Trigger reflow
                carrusel.style.display = '';
            }
        }, 250);
    });
    
    // ==============================================
    // 11. FUNCIONES DE DEBUG Y UTILIDAD
    // ==============================================
    
    window.debugSitio = function() {
        console.log('🔍 Debug del sitio:');
        console.log('- Ancho ventana:', window.innerWidth);
        console.log('- Alto ventana:', window.innerHeight);
        console.log('- Carrusel items:', document.querySelectorAll('.item-carrusel').length);
        console.log('- Sliders circulares:', document.querySelectorAll('.circular-3d-wrapper').length);
        console.log('- Imágenes con problemas:', document.querySelectorAll('img').length);
        
        // Verificar imágenes desbordadas
        document.querySelectorAll('img').forEach((img, index) => {
            const contenedor = img.parentElement;
            if (contenedor) {
                const imgWidth = img.offsetWidth;
                const contenedorWidth = contenedor.offsetWidth;
                if (imgWidth > contenedorWidth + 10) {
                    console.warn(`⚠️ Imagen ${index} se sale del contenedor:`, img.src);
                }
            }
        });
    };
    
    // Función para restaurar diseño original
    window.restaurarDisenioOriginal = function() {
        console.log('🔄 Restaurando diseño original...');
        
        // Restaurar todas las imágenes a object-fit: cover
        document.querySelectorAll('img').forEach(img => {
            if (!img.closest('.logo') && 
                !img.closest('.social-icon') && 
                !img.closest('.feature-icon')) {
                img.style.objectFit = 'cover';
                img.style.objectPosition = 'center';
                img.style.backgroundColor = 'transparent';
                img.style.padding = '0';
            }
        });
        
        // Restaurar videos
        document.querySelectorAll('video').forEach(video => {
            video.style.objectFit = 'cover';
        });
        
        console.log('✅ Diseño original restaurado');
    };
    
    // Función para forzar reflow y corregir visualmente
    window.forzarReflow = function() {
        const elementos = document.querySelectorAll('.carrusel-3d, .circular-3d-wrapper, .item-carrusel');
        elementos.forEach(el => {
            el.style.display = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.display = '';
        });
        console.log('✅ Reflow forzado');
    };
});

// ==============================================
// POLYFILLS Y COMPATIBILIDAD
// ==============================================

// Polyfill para requestAnimationFrame
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        return window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               function(callback) {
                   window.setTimeout(callback, 1000 / 60);
               };
    })();
}

// Polyfill para Object-fit en IE
if ('objectFit' in document.documentElement.style === false) {
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img[data-object-fit]');
        images.forEach(function(img) {
            (img.runtimeStyle || img.style).background = 'url("' + img.src + '") no-repeat 50%/' + (img.currentStyle ? img.currentStyle['object-fit'] : img.getAttribute('data-object-fit'));
            img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='" + img.width + "' height='" + img.height + "'%3E%3C/svg%3E";
        });
    });
}

// Inicialización cuando la página esté completamente cargada
window.addEventListener('load', function() {
    console.log('📄 Página completamente cargada');
    
    // Forzar una verificación final
    setTimeout(function() {
        if (window.debugSitio) window.debugSitio();
        if (window.restaurarDisenioOriginal) window.restaurarDisenioOriginal();
        if (window.forzarReflow) window.forzarReflow();
    }, 500);
});

// Exportar funciones útiles
window.utils = {
    debug: window.debugSitio,
    restaurar: window.restaurarDisenioOriginal,
    reflow: window.forzarReflow
};