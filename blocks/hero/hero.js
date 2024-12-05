import { fetchPlaceholders } from '../../scripts/aem.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach(link => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  block.querySelector('.carousel-navigation-buttons .carousel-slide-number').textContent = slideIndex + 1;
}

function bindEvents(block) {
  let autoplay;

  window.setTimeout(() => {
    autoplay = setInterval(() => {
      showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
    }, 8000);
  }, 3000);

  block.querySelector('.slide-pause').addEventListener('click', e => {
    const isPlaying = e.target.textContent === '||';

    if (isPlaying) {
      e.target.textContent = '>';
      clearInterval(autoplay);
      autoplay = null;
    } else {
      e.target.textContent = '||';
      autoplay = setInterval(() => {
        showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
      }, 8000);
    }
  });
  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) updateActiveSlide(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  block.querySelectorAll('.carousel-slide').forEach(slide => {
    slideObserver.observe(slide);
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach(link => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth'
  });
}

export default async function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');
  const slides = block.querySelectorAll(':scope > div div:first-child');
  const featured = block.querySelectorAll(':scope > div div + div');
  const placeholders = await fetchPlaceholders();

  const isSingleSlide = slides.length < 2;

  block.textContent = '';

  if (!isSingleSlide) {
    const container = document.createElement('div');
    const slidesList = document.createElement('ul');
    const slideNavButtons = document.createElement('div');
    container.classList.add('carousel-slides-container');
    slidesList.classList.add('carousel-slides');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-pause" aria-label="${
        placeholders.pauseSlide || 'Pause Slide'
      }">||</button>
      <button type="button" class="slide-prev" aria-label="${
        placeholders.previousSlide || 'Previous Slide'
      }"></button>
      <span><span class="carousel-slide-number">1</span> / ${rows.length}</span>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;

    slides.forEach((slide, index) => {
      const LI = document.createElement('li');
      LI.classList.add('carousel-slide');
      LI.dataset.slideIndex = index;
      LI.append(slide.firstElementChild);
      slidesList.append(LI);
    });

    container.append(slidesList);
    container.append(slideNavButtons);

    block.classList.add('carousel');
    block.setAttribute('role', 'region');
    block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');
    block.append(container);

    bindEvents(block);
  }

  const container = document.createElement('div');
  container.classList.add('hero-cards');
  featured.forEach(feature => {
    feature.classList.add('hero-card');
    container.append(feature);
  });

  block.append(container);
}
