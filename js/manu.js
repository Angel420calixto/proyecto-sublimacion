// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const botonMenuMobile = document.querySelector('.boton-menu-mobile');
    const menuPrincipal = document.querySelector('.menu-principal');
    const botonesExpandir = document.querySelectorAll('.boton-expandir');
    const cuerpo = document.body;
    const menuOverlay = document.querySelector('.menu-overlay');
    
    // Función para abrir/cerrar menú móvil
    function toggleMenu() {
        if (menuPrincipal.classList.contains('activo')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    }
    
    // Función para abrir menú
    function abrirMenu() {
        menuPrincipal.classList.add('activo');
        cuerpo.classList.add('menu-abierto');
        menuOverlay.style.display = 'block';
    }
    
    // Función para cerrar menú
    function cerrarMenu() {
        menuPrincipal.classList.remove('activo');
        cuerpo.classList.remove('menu-abierto');
        menuOverlay.style.display = 'none';
    }
    
    // Menú hamburguesa móvil
    if (botonMenuMobile) {
        botonMenuMobile.addEventListener('click', toggleMenu);
    }
    
    // Cerrar menú al hacer clic en overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', cerrarMenu);
    }
    
    // Cerrar menú al hacer clic en un enlace del menú
    const enlacesMenu = document.querySelectorAll('.menu-principal a');
    enlacesMenu.forEach(enlace => {
        enlace.addEventListener('click', cerrarMenu);
    });
    
    // Cerrar menú al presionar ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && menuPrincipal.classList.contains('activo')) {
            cerrarMenu();
        }
    });
    
    // Funcionalidad para menú desplegable en móvil
    const menusDesplegables = document.querySelectorAll('.menu-con-desplegable .enlace-menu');
    menusDesplegables.forEach(menu => {
        menu.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('activo');
            }
        });
    });
    
    // Funcionalidad de expandir contenido en móvil
    botonesExpandir.forEach(boton => {
        boton.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const contenido = document.getElementById(`contenido-${targetId}`);
            const seccion = this.closest('.seccion-productos');
            const productosDesktop = seccion.querySelectorAll('.producto-item');
            
            if (contenido.classList.contains('expandido')) {
                // Contraer contenido
                contenido.classList.remove('expandido');
                this.textContent = 'Ver más';
                
                // Eliminar productos adicionales (mantener solo los primeros 10)
                const productosMovil = contenido.querySelectorAll('.producto-movil');
                productosMovil.forEach((producto, index) => {
                    if (index >= 10) {
                        producto.remove();
                    }
                });
            } else {
                // Expandir contenido
                contenido.classList.add('expandido');
                this.textContent = 'Ver menos';
                
                // Determinar cuántos productos ya hay
                const productosActuales = contenido.querySelectorAll('.producto-movil').length;
                const productosTotales = productosDesktop.length;
                
                // Si hay menos de 10 productos, cargar todos
                if (productosActuales < productosTotales) {
                    cargarProductosMovil(contenido, productosDesktop, productosActuales);
                }
                
                // Ocultar botón si ya se cargaron todos los productos
                if (productosActuales >= productosTotales) {
                    this.style.display = 'none';
                }
            }
        });
    });
    
    // Función para cargar productos móviles
    function cargarProductosMovil(contenedor, productosDesktop, inicio = 0) {
        const limite = Math.min(inicio + 10, productosDesktop.length);
        
        for (let i = inicio; i < limite; i++) {
            const producto = productosDesktop[i];
            const productoMovil = crearProductoMovil(producto);
            contenedor.appendChild(productoMovil);
        }
    }
    
    // Función para crear un producto móvil
    function crearProductoMovil(productoDesktop) {
        const productoMovil = document.createElement('article');
        productoMovil.className = 'producto-movil';
        
        // Obtener datos del producto desktop
        const imagen = productoDesktop.querySelector('img');
        const titulo = productoDesktop.querySelector('.titulo-producto');
        const precio = productoDesktop.querySelector('.precio-producto');
        const medidas = productoDesktop.querySelector('.medidas-producto');
        
        // Crear estructura para móvil
        productoMovil.innerHTML = `
            <figure class="contenedor-imagen-movil">
                <img src="${imagen.src}" alt="${imagen.alt}" loading="lazy">
            </figure>
            <div class="info-producto-movil">
                <h3 class="titulo-producto-movil">${titulo.textContent}</h3>
                <div class="detalles-producto-movil">
                    <span class="precio-producto-movil">${precio.textContent}</span>
                    <span class="medidas-producto-movil">${medidas.textContent}</span>
                </div>
            </div>
        `;
        
        return productoMovil;
    }
    
    // Cargar productos iniciales en móvil
    function cargarProductosInicialesMovil() {
        const secciones = document.querySelectorAll('.seccion-productos');
        
        secciones.forEach(seccion => {
            const contenedorExpandible = seccion.querySelector('.contenido-expandible');
            const botonExpandir = seccion.querySelector('.boton-expandir');
            const productosDesktop = seccion.querySelectorAll('.producto-item');
            
            if (contenedorExpandible && contenedorExpandible.children.length === 0) {
                // Cargar primeros 10 productos
                cargarProductosMovil(contenedorExpandible, productosDesktop, 0);
                
                // Ocultar botón si hay 10 o menos productos
                if (productosDesktop.length <= 10) {
                    botonExpandir.style.display = 'none';
                }
            }
        });
    }
    
    // Ajustar imágenes para que se vean completas
    function ajustarImagenes() {
        const contenedores = document.querySelectorAll('.contenedor-imagen-popular, .contenedor-imagen-producto, .contenedor-imagen-movil');
        
        contenedores.forEach(contenedor => {
            const imagen = contenedor.querySelector('img');
            if (imagen) {
                // Forzar que la imagen se vea completa
                imagen.style.objectFit = 'contain';
                imagen.style.objectPosition = 'center';
            }
        });
    }
    
    // Optimizar espacio de info-popular
    function optimizarInfoPopular() {
        const infoElements = document.querySelectorAll('.info-popular, .info-producto, .info-producto-movil');
        
        infoElements.forEach(info => {
            info.style.padding = '0.5rem';
            info.style.minHeight = 'auto';
        });
    }
    
    // Inicializar todo al cargar la página
    function inicializar() {
        cargarProductosInicialesMovil();
        ajustarImagenes();
        optimizarInfoPopular();
        
        // Ajustar para diferentes tamaños de pantalla
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.galeria-productos.desktop-galeria').forEach(g => {
                g.style.display = 'none';
            });
            document.querySelectorAll('.contenedor-expandible.movil-galeria').forEach(g => {
                g.style.display = 'block';
            });
        }
    }
    
    // Ejecutar inicialización
    inicializar();
    
    // Reajustar al redimensionar la ventana
    window.addEventListener('resize', function() {
        ajustarImagenes();
        optimizarInfoPopular();
        
        // Ajustar visibilidad de galerías
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.galeria-productos.desktop-galeria').forEach(g => {
                g.style.display = 'none';
            });
            document.querySelectorAll('.contenedor-expandible.movil-galeria').forEach(g => {
                g.style.display = 'block';
            });
        } else {
            document.querySelectorAll('.galeria-productos.desktop-galeria').forEach(g => {
                g.style.display = 'grid';
            });
            document.querySelectorAll('.contenedor-expandible.movil-galeria').forEach(g => {
                g.style.display = 'none';
            });
        }
    });
});