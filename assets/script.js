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

var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = "${{amount}}";
Shopify.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);
 
  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }
 
  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');
 
    if (isNaN(number) || number == null) { return 0; }
 
    number = (number/100.0).toFixed(precision);
 
    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';
 
    return dollars + cents;
  }
 
  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }
 
  return formatString.replace(placeholderRegex, value);
};

const featuredProductElements = document.querySelectorAll('.featured-products__slide');
const sideCartElement = document.querySelector('.sidecart');
const backgroundElement = document.querySelector('.bg-sidecart');
// ---------------------------------------------------------------------------
// Listeners
// ---------------------------------------------------------------------------

featuredProductElements.forEach((product) => product.addEventListener('click', addToCartProduct));
backgroundElement.addEventListener('click', () => closeSideCart(sideCartElement, backgroundElement));

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

function updateMiniCart(itemCount) {
  const miniCartElement = document.querySelector('.header__cart-bubble');
  miniCartElement.textContent = itemCount;
}

function openSideCart(sideCartElement, backgroundElement) {
  sideCartElement.classList.add('active');
  backgroundElement.classList.add('active');
}

function closeSideCart(sideCartElement, backgroundElement) {
  sideCartElement.classList.remove('active');
  backgroundElement.classList.remove('active');
}

function showItemsInSideCart(data) {
  const ulElement = document.querySelector('.sidecart-items');
  ulElement.textContent = '';
  
  data.items.forEach((item) => {
    const liElement = document.createElement('li');
    const textContent = document.createTextNode(`${item.title}, x${item.quantity}, ${Shopify.formatMoney(item.original_line_price, '${{amount}}')}`);
  
    liElement.appendChild(textContent);
    ulElement.appendChild(liElement);
  });
}

function addToCartProduct(e) {
  const productId = e.currentTarget.dataset.variantId;
  const atcData = {
    items: [
      {
        id: productId,
        quantity: 1
      }
    ]    
  }

  axios.post(`${window.Shopify.routes.root}cart/add.js`, atcData)
  .then(({data}) => {
    return axios.get(`${window.Shopify.routes.root}cart.js`)
  })
  .then(({data}) => {
    updateMiniCart(data.item_count);
    showItemsInSideCart(data);
    openSideCart(sideCartElement, backgroundElement);
  })
  .catch(err => {
    console.log(err);
  })
}