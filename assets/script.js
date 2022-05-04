const swiper = new Swiper('.featured-collections__slider', {
  slidesPerView: 1.3,
  centeredSlides: true,
  centeredSlidesBounds: true,
  spaceBetween: 10,
  slidesOffsetBefore:10,
  slidesOffsetAfter:10,
  navigation: {
    nextEl: '.slider__arrow-next',
    prevEl: '.slider__arrow-prev',
  },
  breakpoints: {
    900: {
      slidesPerView: 4,
      spaceBetween: 10,
      slidesOffsetBefore:0,
      slidesOffsetAfter:0,
    }
  }
});

const sceneSlider = new Swiper(".featured-scene__slider-container", {
  navigation: {
    nextEl: ".slider-next",
    prevEl: ".slider-prev",
  },
});

const productsSlider = new Swiper(".featured-products__slider", {
  slidesPerView: 1.3,
  spaceBetween: 10,
  centeredSlides: true,
  loop: true,
  navigation: {
    nextEl: '.slider__arrow-next',
    prevEl: '.slider__arrow-prev',
  },
  breakpoints: {
    900: {
      slidesPerView: 3,
      spaceBetween: 2,
    }
  }
});