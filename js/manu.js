// manu.js - VERSIÓN COMPLETA Y FUNCIONAL
document.addEventListener('DOMContentLoaded', function() {
    console.log('ANIMETAL - Iniciando...');
    
    // ====================================
    // 1. CARGAR IMÁGENES EN MÓVIL INMEDIATAMENTE
    // ====================================
    function cargarImagenesMovil() {
        console.log('Cargando imágenes para móvil...');
        
        // GALERÍA JUJUTSU KAISEN
        const galeriaJujutsuMovil = document.getElementById('galeria-jujutsu-movil');
        const galeriaJujutsuDesktop = document.getElementById('galeria-jujutsu-desktop');
        
        if (galeriaJujutsuMovil && galeriaJujutsuDesktop) {
            console.log('Cargando Jujutsu Kaisen...');
            const productosJujutsu = galeriaJujutsuDesktop.querySelectorAll('.producto-item');
            
            productosJujutsu.forEach(producto => {
                const img = producto.querySelector('img');
                if (img) {
                    const productoMovil = document.createElement('article');
                    productoMovil.className = 'producto-movil';
                    productoMovil.innerHTML = `
                        <figure class="contenedor-imagen-movil">
                            <img src="${img.src}" alt="${img.alt}" loading="lazy">
                        </figure>
                    `;
                    galeriaJujutsuMovil.appendChild(productoMovil);
                }
            });
        }
        
        // GALERÍA NARUTO
        const galeriaNarutoMovil = document.getElementById('galeria-naruto-movil');
        const galeriaNarutoDesktop = document.getElementById('galeria-naruto-desktop');
        
        if (galeriaNarutoMovil && galeriaNarutoDesktop) {
            console.log('Cargando Naruto...');
            const productosNaruto = galeriaNarutoDesktop.querySelectorAll('.producto-item');
            
            productosNaruto.forEach(producto => {
                const img = producto.querySelector('img');
                if (img) {
                    const productoMovil = document.createElement('article');
                    productoMovil.className = 'producto-movil';
                    productoMovil.innerHTML = `
                        <figure class="contenedor-imagen-movil">
                            <img src="${img.src}" alt="${img.alt}" loading="lazy">
                        </figure>
                    `;
                    galeriaNarutoMovil.appendChild(productoMovil);
                }
            });
        }
        
        console.log('Imágenes cargadas en móvil');
    }
    
    // ====================================
    // 2. MENÚ MÓVIL COMPLETO
    // ====================================
    const botonMenuMobile = document.querySelector('.boton-menu-mobile');
    const menuPrincipal = document.querySelector('.menu-principal');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    function toggleMenu() {
        if (menuPrincipal.classList.contains('activo')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    }
    
    function abrirMenu() {
        menuPrincipal.classList.add('activo');
        document.body.classList.add('menu-abierto');
        menuOverlay.style.display = 'block';
    }
    
    function cerrarMenu() {
        menuPrincipal.classList.remove('activo');
        document.body.classList.remove('menu-abierto');
        menuOverlay.style.display = 'none';
        
        // Cerrar también los submenús desplegables
        const menusDesplegables = document.querySelectorAll('.menu-con-desplegable');
        menusDesplegables.forEach(menu => {
            menu.classList.remove('activo');
        });
    }
    
    if (botonMenuMobile) {
        botonMenuMobile.addEventListener('click', toggleMenu);
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', cerrarMenu);
    }
    
    // ====================================
    // 3. MENÚ DESPLEGABLE EN MÓVIL
    // ====================================
    const enlacesDesplegables = document.querySelectorAll('.menu-con-desplegable > a');
    
    enlacesDesplegables.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const parent = this.parentElement;
                const estaActivo = parent.classList.contains('activo');
                
                // Cerrar otros menús desplegables
                const todosLosMenus = document.querySelectorAll('.menu-con-desplegable');
                todosLosMenus.forEach(menu => {
                    if (menu !== parent) {
                        menu.classList.remove('activo');
                    }
                });
                
                // Alternar el menú actual
                if (estaActivo) {
                    parent.classList.remove('activo');
                } else {
                    parent.classList.add('activo');
                }
            }
        });
    });
    
    // Cerrar menú desplegable al hacer clic fuera (solo en móvil)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const target = e.target;
            
            // Si se hace clic fuera del menú desplegable
            if (!target.closest('.menu-con-desplegable')) {
                const menusDesplegables = document.querySelectorAll('.menu-con-desplegable');
                menusDesplegables.forEach(menu => {
                    menu.classList.remove('activo');
                });
            }
        }
    });
    
    // ====================================
    // 4. ANIME POPULAR - VER MÁS
    // ====================================
    const botonPopular = document.getElementById('boton-expandir-popular');
    const gridPopular = document.getElementById('grid-popular');
    
    if (botonPopular && gridPopular) {
        botonPopular.addEventListener('click', function() {
            const itemsAdicionales = gridPopular.querySelectorAll('.item-popular.adicional');
            const estaExpandido = gridPopular.classList.contains('expandido');
            
            if (estaExpandido) {
                // Contraer
                gridPopular.classList.remove('expandido');
                this.textContent = 'Ver más';
                itemsAdicionales.forEach(item => {
                    item.style.display = 'none';
                });
            } else {
                // Expandir
                gridPopular.classList.add('expandido');
                this.textContent = 'Ver menos';
                itemsAdicionales.forEach(item => {
                    item.style.display = 'flex';
                });
            }
        });
    }
    
    // ====================================
    // 5. JUJUTSU Y NARUTO - VER MÁS
    // ====================================
    const botonesVerMas = document.querySelectorAll('.boton-ver-mas[data-target]');
    
    botonesVerMas.forEach(boton => {
        boton.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const galeriaMovil = document.getElementById(`galeria-${target}-movil`);
            
            if (galeriaMovil) {
                if (galeriaMovil.classList.contains('expandido')) {
                    // Contraer
                    galeriaMovil.classList.remove('expandido');
                    this.textContent = 'Ver más';
                } else {
                    // Expandir
                    galeriaMovil.classList.add('expandido');
                    this.textContent = 'Ver menos';
                }
            }
        });
    });
    
    // ====================================
    // 6. CERRAR MENÚ AL HACER CLIC EN ENLACES
    // ====================================
    const enlacesMenu = document.querySelectorAll('.menu-principal a');
    enlacesMenu.forEach(enlace => {
        enlace.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // Solo cerrar si no es un enlace desplegable
                if (!this.parentElement.classList.contains('menu-con-desplegable')) {
                    cerrarMenu();
                }
            }
        });
    });
    
    // ====================================
    // 7. CERRAR CON TECLA ESC
    // ====================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (menuPrincipal.classList.contains('activo')) {
                cerrarMenu();
            }
        }
    });
    
    // ====================================
    // 8. AJUSTES RESPONSIVOS
    // ====================================
    function ajustarParaResponsivo() {
        // En móvil, cargar imágenes si no están cargadas
        if (window.innerWidth <= 768) {
            cargarImagenesMovil();
            
            // Asegurar que las galerías móviles sean visibles
            document.querySelectorAll('.galeria-movil.movil-galeria').forEach(galeria => {
                galeria.style.display = 'grid';
            });
        }
        
        // En desktop, cerrar menú móvil si está abierto
        if (window.innerWidth > 768 && menuPrincipal.classList.contains('activo')) {
            cerrarMenu();
        }
    }
    
    // Ejecutar al cargar
    ajustarParaResponsivo();
    
    // Ejecutar al redimensionar
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(ajustarParaResponsivo, 250);
    });
    
    // ====================================
    // 9. INICIALIZAR
    // ====================================
    console.log('ANIMETAL - Configuración completada');
});