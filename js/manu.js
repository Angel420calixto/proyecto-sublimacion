// manu.js - DESDE CERO, PENSADO EN EL HTML Y CSS EXISTENTES

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ANIMETAL JS - INICIANDO...');
    
    // ===========================================
    // 1. VARIABLES GLOBALES
    // ===========================================
    const body = document.body;
    
    // ===========================================
    // 2. MENÚ MÓVIL - PROBLEMA: No se abre
    // ===========================================
    console.log('🔧 Configurando menú móvil...');
    
    const botonMenu = document.querySelector('.boton-menu-mobile');
    const menuPrincipal = document.querySelector('.menu-principal');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    // Verificar que existen los elementos
    console.log('Boton menu:', botonMenu ? 'ENCONTRADO' : 'NO ENCONTRADO');
    console.log('Menu principal:', menuPrincipal ? 'ENCONTRADO' : 'NO ENCONTRADO');
    console.log('Overlay:', menuOverlay ? 'ENCONTRADO' : 'NO ENCONTRADO');
    
    if (botonMenu && menuPrincipal) {
        botonMenu.addEventListener('click', function(e) {
            console.log('📱 Botón menú CLICKEADO');
            e.stopPropagation();
            
            // Agregar clase activa al menú
            menuPrincipal.classList.add('activo');
            
            // Mostrar overlay
            if (menuOverlay) {
                menuOverlay.style.display = 'block';
                menuOverlay.classList.add('activo');
            }
            
            // Bloquear scroll del body
            body.classList.add('menu-abierto');
        });
        
        // Cerrar menú con overlay
        if (menuOverlay) {
            menuOverlay.addEventListener('click', function() {
                console.log('❌ Overlay clickeado - cerrando menú');
                menuPrincipal.classList.remove('activo');
                this.style.display = 'none';
                this.classList.remove('activo');
                body.classList.remove('menu-abierto');
            });
        }
        
        // Cerrar menú al hacer clic en enlaces (solo en móvil)
        const enlacesMenu = menuPrincipal.querySelectorAll('a');
        enlacesMenu.forEach(enlace => {
            enlace.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    console.log('🔗 Enlace clickeado - cerrando menú');
                    menuPrincipal.classList.remove('activo');
                    if (menuOverlay) {
                        menuOverlay.style.display = 'none';
                        menuOverlay.classList.remove('activo');
                    }
                    body.classList.remove('menu-abierto');
                }
            });
        });
    }
    
    // ===========================================
    // 3. SUBMENÚ MÓVIL - PROBLEMA: No se despliega
    // ===========================================
    console.log('🔧 Configurando submenú móvil...');
    
    const menuDesplegable = document.querySelector('.menu-con-desplegable');
    
    if (menuDesplegable) {
        console.log('Menu desplegable: ENCONTRADO');
        
        const enlaceDesplegable = menuDesplegable.querySelector('.enlace-menu-desplegable');
        
        if (enlaceDesplegable) {
            enlaceDesplegable.addEventListener('click', function(e) {
                // Solo en móvil
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('📱 Submenú clickeado');
                    menuDesplegable.classList.toggle('activo');
                }
            });
        }
        
        // Cerrar submenú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                menuDesplegable.classList.contains('activo') &&
                !menuDesplegable.contains(e.target)) {
                console.log('❌ Clic fuera - cerrando submenú');
                menuDesplegable.classList.remove('activo');
            }
        });
    }
    
    // ===========================================
    // 4. BOTONES "VER MÁS" - PROBLEMA: No funcionan
    // ===========================================
    console.log('🔧 Configurando botones "Ver más"...');
    
    // Botón principal de Anime Popular
    const botonPopular = document.getElementById('boton-expandir-popular');
    const gridPopular = document.getElementById('grid-popular');
    
    console.log('Botón popular:', botonPopular ? 'ENCONTRADO' : 'NO ENCONTRADO');
    console.log('Grid popular:', gridPopular ? 'ENCONTRADO' : 'NO ENCONTRADO');
    
    if (botonPopular && gridPopular) {
        botonPopular.addEventListener('click', function() {
            console.log('🔼 Botón "Ver más" popular clickeado');
            
            // Toggle de la clase expandido
            const estaExpandido = gridPopular.classList.toggle('expandido');
            
            // Cambiar texto del botón
            this.textContent = estaExpandido ? 'Ver menos' : 'Ver más';
            
            // Forzar visibilidad de elementos adicionales
            const elementosAdicionales = gridPopular.querySelectorAll('.adicional');
            elementosAdicionales.forEach(elemento => {
                if (estaExpandido) {
                    elemento.style.display = 'flex';
                    elemento.style.animation = 'mostrarElementos 0.5s ease forwards';
                } else {
                    elemento.style.display = 'none';
                }
            });
            
            console.log(`Elementos adicionales: ${elementosAdicionales.length} - Estado: ${estaExpandido ? 'VISIBLES' : 'OCULTOS'}`);
        });
        
        // Ocultar elementos adicionales al inicio
        setTimeout(() => {
            const adicionales = gridPopular.querySelectorAll('.adicional');
            adicionales.forEach(el => {
                el.style.display = 'none';
            });
            console.log('📦 Elementos adicionales OCULTOS al inicio');
        }, 100);
    }
    
    // Botones de otras secciones
    const botonesVerMas = document.querySelectorAll('.boton-ver-mas[data-target]');
    console.log('Botones "Ver más" encontrados:', botonesVerMas.length);
    
    botonesVerMas.forEach(boton => {
        boton.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const galeria = document.getElementById(`galeria-${target}`);
            
            if (galeria) {
                console.log(`🔼 Botón ${target} clickeado`);
                
                const estaExpandido = galeria.classList.toggle('expandido');
                this.textContent = estaExpandido ? 'Ver menos' : 'Ver más';
                
                // Forzar visibilidad
                const elementosAdicionales = galeria.querySelectorAll('.adicional');
                elementosAdicionales.forEach(elemento => {
                    if (estaExpandido) {
                        elemento.style.display = 'flex';
                        elemento.style.animation = 'mostrarElementos 0.5s ease forwards';
                    } else {
                        elemento.style.display = 'none';
                    }
                });
                
                console.log(`Galería ${target}: ${elementosAdicionales.length} elementos - ${estaExpandido ? 'EXPANDIDA' : 'CONTR AÍDA'}`);
            }
        });
        
        // Ocultar elementos adicionales al inicio
        setTimeout(() => {
            const target = boton.getAttribute('data-target');
            const galeria = document.getElementById(`galeria-${target}`);
            if (galeria) {
                const adicionales = galeria.querySelectorAll('.adicional');
                adicionales.forEach(el => {
                    el.style.display = 'none';
                });
            }
        }, 100);
    });
    
    // ===========================================
    // 5. MODAL DE IMÁGENES - PROBLEMA: No se amplían
    // ===========================================
    console.log('🔧 Configurando modal de imágenes...');
    
    const modal = document.getElementById('modal-imagen');
    const imagenAmpliada = document.getElementById('imagen-ampliada');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMedida = document.getElementById('modal-medida');
    const modalPrecio = document.getElementById('modal-precio');
    const cerrarModal = document.querySelector('.cerrar-modal');
    const botonSeleccionar = document.getElementById('boton-seleccionar');
    
    console.log('Modal:', modal ? 'ENCONTRADO' : 'NO ENCONTRADO');
    console.log('Imagen ampliada:', imagenAmpliada ? 'ENCONTRADO' : 'NO ENCONTRADO');
    
    // Función para abrir el modal
    function abrirModal(imagenSrc, titulo, medida, precio) {
        console.log('🖼️ Abriendo modal con imagen:', titulo);
        
        // Actualizar contenido del modal
        imagenAmpliada.src = imagenSrc;
        imagenAmpliada.alt = titulo;
        modalTitulo.textContent = titulo;
        modalMedida.textContent = `Medida: ${medida}`;
        modalPrecio.textContent = precio;
        
        // Mostrar modal
        modal.classList.add('mostrar');
        modal.style.display = 'flex';
        body.style.overflow = 'hidden';
    }
    
    // Función para cerrar el modal
    function cerrarModalFunc() {
        console.log('❌ Cerrando modal');
        modal.classList.remove('mostrar');
        modal.style.display = 'none';
        body.style.overflow = '';
    }
    
    // Asignar eventos a TODAS las imágenes con data attributes
    const imagenesProductos = document.querySelectorAll('img[data-titulo]');
    console.log('Imágenes con data-titulo encontradas:', imagenesProductos.length);
    
    imagenesProductos.forEach(imagen => {
        // Hacer la imagen clickeable
        imagen.style.cursor = 'pointer';
        
        // Agregar evento click
        imagen.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Obtener datos
            const src = this.src;
            const titulo = this.getAttribute('data-titulo');
            const medida = this.getAttribute('data-medida');
            const precio = this.getAttribute('data-precio');
            
            console.log('📸 Imagen clickeada:', { src, titulo, medida, precio });
            
            // Abrir modal
            abrirModal(src, titulo, medida, precio);
        });
    });
    
    // También permitir clic en los artículos (por si acaso)
    const articulosProducto = document.querySelectorAll('.item-popular, .producto-item');
    articulosProducto.forEach(articulo => {
        articulo.style.cursor = 'pointer';
        
        articulo.addEventListener('click', function(e) {
            // No hacer nada si se hizo clic en un botón
            if (e.target.tagName === 'BUTTON') return;
            
            // Buscar imagen dentro del artículo
            const imagen = this.querySelector('img[data-titulo]');
            if (imagen) {
                e.preventDefault();
                
                const src = imagen.src;
                const titulo = imagen.getAttribute('data-titulo');
                const medida = imagen.getAttribute('data-medida');
                const precio = imagen.getAttribute('data-precio');
                
                console.log('📦 Artículo clickeado, abriendo imagen:', titulo);
                abrirModal(src, titulo, medida, precio);
            }
        });
    });
    
    // Cerrar modal con botón X
    if (cerrarModal) {
        cerrarModal.addEventListener('click', function(e) {
            e.stopPropagation();
            cerrarModalFunc();
        });
    }
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarModalFunc();
        }
    });
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('mostrar')) {
            cerrarModalFunc();
        }
    });
    
    // Botón de seleccionar
    if (botonSeleccionar) {
        botonSeleccionar.addEventListener('click', function() {
            const titulo = modalTitulo.textContent;
            const precio = modalPrecio.textContent;
            const medida = modalMedida.textContent;
            
            alert(`✅ Producto seleccionado:\n\n${titulo}\n${medida}\n${precio}\n\nAgregado a tu carrito.`);
            cerrarModalFunc();
        });
    }
    
    // ===========================================
    // 6. SCROLL SUAVE
    // ===========================================
    console.log('🔧 Configurando scroll suave...');
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '') {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Cerrar menú móvil si está abierto
                    if (menuPrincipal && menuPrincipal.classList.contains('activo')) {
                        menuPrincipal.classList.remove('activo');
                        if (menuOverlay) {
                            menuOverlay.style.display = 'none';
                            menuOverlay.classList.remove('activo');
                        }
                        body.classList.remove('menu-abierto');
                    }
                    
                    // Scroll suave
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===========================================
    // 7. REDIMENSIONAMIENTO
    // ===========================================
    window.addEventListener('resize', function() {
        console.log('📱 Redimensionando ventana:', window.innerWidth);
        
        // Cerrar menú móvil al cambiar a escritorio
        if (window.innerWidth > 768) {
            if (menuPrincipal && menuPrincipal.classList.contains('activo')) {
                menuPrincipal.classList.remove('activo');
                if (menuOverlay) {
                    menuOverlay.style.display = 'none';
                    menuOverlay.classList.remove('activo');
                }
                body.classList.remove('menu-abierto');
            }
            
            // Cerrar submenú si está abierto
            if (menuDesplegable && menuDesplegable.classList.contains('activo')) {
                menuDesplegable.classList.remove('activo');
            }
        }
    });
    
    // ===========================================
    // 8. INICIALIZACIÓN FINAL
    // ===========================================
    console.log('=========================================');
    console.log('✅ ANIMETAL JS - CONFIGURACIÓN COMPLETA');
    console.log('=========================================');
    console.log('📊 RESUMEN:');
    console.log('- Menú móvil:', botonMenu && menuPrincipal ? 'CONFIGURADO' : 'ERROR');
    console.log('- Submenú:', menuDesplegable ? 'CONFIGURADO' : 'NO ENCONTRADO');
    console.log('- Botón Popular:', botonPopular ? 'CONFIGURADO' : 'NO ENCONTRADO');
    console.log('- Botones Ver Más:', botonesVerMas.length, 'CONFIGURADOS');
    console.log('- Modal:', modal ? 'CONFIGURADO' : 'NO ENCONTRADO');
    console.log('- Imágenes clickeables:', imagenesProductos.length);
    console.log('- Artículos clickeables:', articulosProducto.length);
    console.log('=========================================');
    console.log('🚀 ¡SITIO LISTO PARA USAR!');
    console.log('=========================================');
    
    // Asegurar que todo esté configurado correctamente
    setTimeout(() => {
        // Verificar que elementos adicionales estén ocultos
        const todosAdicionales = document.querySelectorAll('.adicional');
        console.log(`🔍 Verificando ${todosAdicionales.length} elementos adicionales...`);
        
        todosAdicionales.forEach((el, index) => {
            const contenedor = el.closest('.grid-popular, .galeria-productos');
            if (contenedor && !contenedor.classList.contains('expandido')) {
                el.style.display = 'none';
                console.log(`  ${index + 1}. Oculto ✓`);
            } else {
                console.log(`  ${index + 1}. Visible (expandido) ✓`);
            }
        });
        
        // Verificar que imágenes sean clickeables
        imagenesProductos.forEach((img, index) => {
            if (img.style.cursor === 'pointer') {
                console.log(`  📸 Imagen ${index + 1}: Clickeable ✓`);
            }
        });
    }, 500);
});