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