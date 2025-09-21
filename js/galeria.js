// Funcionalidad para el menú móvil
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.boton-encabezado');
    const navMenu = document.querySelector('.enlaces');
    const body = document.body;
    
    menuButton.addEventListener('click', function() {
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
    const navLinks = document.querySelectorAll('.enlace-navegacion');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('activo');
            body.classList.remove('prevent-scroll');
            
            const icon = menuButton.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
});

// Funcionalidad para el carrusel 3D
document.addEventListener('DOMContentLoaded', function() {
    const carrusel = document.querySelector('.carrusel-3d');
    const items = document.querySelectorAll('.item-carrusel');
    const indicadores = document.querySelectorAll('.indicador');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    let currentIndex = 0;
    let autoPlayInterval;

    // Función para actualizar el carrusel
    function updateCarrusel() {
        // Remover clase activa de todos los items
        items.forEach(item => item.classList.remove('activo'));
        indicadores.forEach(ind => ind.classList.remove('activo'));
        
        // Agregar clase activa al item actual
        items[currentIndex].classList.add('activo');
        indicadores[currentIndex].classList.add('activo');
        
        // Aplicar transformación 3D
        const angle = 360 / items.length;
        items.forEach((item, index) => {
            const rotateY = (index - currentIndex) * angle;
            item.style.transform = `rotateY(${rotateY}deg) translateZ(250px)`;
        });
    }

    // Función para siguiente slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarrusel();
    }

    // Función para slide anterior
    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarrusel();
    }

    // Event listeners para controles
    btnNext.addEventListener('click', nextSlide);
    btnPrev.addEventListener('click', prevSlide);

    // Event listeners para indicadores
    indicadores.forEach((indicador, index) => {
        indicador.addEventListener('click', () => {
            currentIndex = index;
            updateCarrusel();
        });
    });

    // Auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Iniciar auto-play y detenerlo al interactuar
    startAutoPlay();
    carrusel.addEventListener('mouseenter', stopAutoPlay);
    carrusel.addEventListener('mouseleave', startAutoPlay);

    // Inicializar carrusel
    updateCarrusel();
});

// Funcionalidad para el filtrado por categorías
document.addEventListener('DOMContentLoaded', function() {
    const categoriaItems = document.querySelectorAll('.categoria-item');
    const galeriaItems = document.querySelectorAll('.item-galeria');
    const productosMobile = document.querySelectorAll('.producto-mobile');
    
    // Filtrado por categorías
    categoriaItems.forEach(item => {
        item.addEventListener('click', function() {
            // Quitar clase activa de todos los items
            categoriaItems.forEach(i => i.classList.remove('activa'));
            
            // Agregar clase activa al item clickeado
            this.classList.add('activa');
            
            // Obtener la categoría seleccionada
            const categoria = this.getAttribute('data-categoria');
            
            // Filtrar elementos de la galería
            filtrarGaleria(categoria);
        });
    });
    
    // Función para filtrar la galería
    function filtrarGaleria(categoria) {
        galeriaItems.forEach(item => {
            if (categoria === 'todos' || item.getAttribute('data-categoria') === categoria) {
                item.style.display = 'flex';
                item.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
        
        productosMobile.forEach(item => {
            if (categoria === 'todos') {
                item.style.display = 'flex';
                item.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Reiniciar contador del botón "Ver Más"
        itemsVisibles = 8;
        document.querySelector('.boton-vermas').style.display = 'block';
    }
});

// Funcionalidad para el botón "Ver Más"
let itemsVisibles = 8; // Número inicial de items visibles

function inicializarBotonVerMas() {
    const botonVerMas = document.querySelector('.boton-vermas');
    if (!botonVerMas) return;
    
    botonVerMas.addEventListener('click', function() {
        const categoriaActiva = document.querySelector('.categoria-item.activa').getAttribute('data-categoria');
        const todosItems = document.querySelectorAll('.item-galeria, .producto-mobile');
        let itemsFiltrados = [];
        
        // Filtrar items según la categoría activa
        if (categoriaActiva === 'todos') {
            itemsFiltrados = Array.from(todosItems);
        } else {
            itemsFiltrados = Array.from(todosItems).filter(item => 
                item.getAttribute('data-categoria') === categoriaActiva
            );
        }
        
        // Mostrar más items
        for (let i = itemsVisibles; i < itemsVisibles + 4 && i < itemsFiltrados.length; i++) {
            itemsFiltrados[i].style.display = 'flex';
            itemsFiltrados[i].style.animation = 'fadeIn 0.5s ease forwards';
        }
        
        itemsVisibles += 4;
        
        // Ocultar botón si no hay más items por mostrar
        if (itemsVisibles >= itemsFiltrados.length) {
            botonVerMas.style.display = 'none';
        }
    });
}

// Funcionalidad para el overlay de imagen ampliada y botón "Ver Detalles"
function inicializarOverlay() {
    const overlay = document.querySelector('.overlay-imagen');
    const overlayImg = overlay.querySelector('img');
    const botonDetalles = overlay.querySelector('.boton-detalles');
    const cerrarOverlay = overlay.querySelector('.cerrar-overlay');
    
    // Función para abrir el overlay
    function abrirOverlay(src, producto) {
        overlayImg.src = src;
        overlay.classList.add('activo');
        document.body.style.overflow = 'hidden';
        
        // Obtener información del producto para construir la URL
        const titulo = producto.querySelector('.titulo-galeria, .nombre-mobile').textContent;
        const precio = producto.querySelector('.precio-galeria, .precio-mobile').textContent;
        
        // Codificar los parámetros para la URL
        const params = new URLSearchParams({
            producto: encodeURIComponent(titulo),
            precio: encodeURIComponent(precio),
            imagen: encodeURIComponent(src),
            categoria: producto.getAttribute('data-categoria') || 'todos'
        });
        
        // Actualizar el href del botón
        botonDetalles.href = `detalles-producto.html?${params.toString()}`;
    }
    
    // Event listeners para abrir overlay al hacer clic en imágenes
    document.querySelectorAll('.item-galeria img, .contenedor-imagen-mobile img').forEach(imagen => {
        imagen.addEventListener('click', function() {
            const producto = this.closest('.item-galeria, .producto-mobile');
            abrirOverlay(this.src, producto);
        });
    });
    
    // Cerrar overlay
    cerrarOverlay.addEventListener('click', function() {
        overlay.classList.remove('activo');
        document.body.style.overflow = '';
    });
    
    // Cerrar overlay al hacer clic fuera de la imagen
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.classList.remove('activo');
            document.body.style.overflow = '';
        }
    });
    
    // Cerrar overlay con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('activo')) {
            overlay.classList.remove('activo');
            document.body.style.overflow = '';
        }
    });
}

// Inicializar todas las funcionalidades cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    inicializarBotonVerMas();
    inicializarOverlay();
    
    // Asegurarse de que solo se muestren los items iniciales
    const categoriaActiva = document.querySelector('.categoria-item.activa').getAttribute('data-categoria');
    filtrarGaleria(categoriaActiva);
});

// Efectos de partículas para el footer (opcional)
document.addEventListener('DOMContentLoaded', function() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
        // Posición aleatoria
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Tamaño aleatorio
        const size = Math.random() * 5 + 2;
        
        // Duración aleatoria
        const duration = Math.random() * 10 + 10;
        
        // Aplicar estilos
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
    });
});