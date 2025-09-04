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
  // Agregar partículas de fondo
  const metalFeatures = document.querySelector('.metal-features');
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particlesContainer.appendChild(particle);
  }
  
  metalFeatures.appendChild(particlesContainer);
  
  // Animación al hacer scroll
  const featureItems = document.querySelectorAll('.feature-item');
  const conclusion = document.querySelector('.conclusion');
  
  function checkVisibility() {
    featureItems.forEach((item, index) => {
      const position = item.getBoundingClientRect();
      
      if(position.top < window.innerHeight - 100) {
        setTimeout(() => {
          item.classList.add('animate');
        }, index * 200);
      }
    });
    
    const conclusionPos = conclusion.getBoundingClientRect();
    if(conclusionPos.top < window.innerHeight - 100) {
      conclusion.classList.add('animate');
    }
  }
  
  checkVisibility();
  window.addEventListener('scroll', checkVisibility);
});