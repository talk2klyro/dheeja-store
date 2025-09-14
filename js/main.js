let productsData = [];

// Fetch products JSON
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    productsData = data;

    // Render featured products on homepage
    const featuredGrid = document.getElementById('product-grid');
    if(featuredGrid) {
      renderProducts(productsData.slice(0,4), featuredGrid);
    }

    // Render shop products if on shop page
    const shopGrid = document.getElementById('shop-products-grid');
    if(shopGrid) {
      renderProducts(productsData, shopGrid);
      attachFilterSort(); // Initialize filter/sort for shop page
    }
  })
  .catch(err => console.error('Error loading products:', err));

/* -----------------------
   FUNCTION: Render Products
------------------------*/
function renderProducts(products, container) {
  container.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img data-src="${product.image}" alt="${product.name}" class="lazy">
      <h3>${product.name}</h3>
      <p>₦${product.price}</p>
      <button class="buy-button" data-id="${product.id}">Buy Now</button>
    `;
    container.appendChild(card);
  });
  lazyLoadImages();
  attachModalEvents();
}

/* -----------------------
   FUNCTION: Filter & Sort
------------------------*/
function attachFilterSort() {
  const categoryFilter = document.getElementById('category-filter');
  const priceSort = document.getElementById('price-sort');
  const shopGrid = document.getElementById('shop-products-grid');

  if(categoryFilter && priceSort && shopGrid) {
    categoryFilter.addEventListener('change', applyFilters);
    priceSort.addEventListener('change', applyFilters);

    function applyFilters() {
      let filtered = [...productsData];
      const category = categoryFilter.value;
      if(category !== 'all') filtered = filtered.filter(p => p.category === category);

      const sort = priceSort.value;
      if(sort === 'asc') filtered.sort((a,b) => a.price - b.price);
      if(sort === 'desc') filtered.sort((a,b) => b.price - a.price);

      renderProducts(filtered, shopGrid);
    }
  }
}

/* -----------------------
   FUNCTION: Modal Product View
------------------------*/
const modal = document.getElementById('product-modal');
const modalImg = document.getElementById('modal-image');
const modalName = document.getElementById('modal-name');
const modalDesc = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const modalBuy = document.getElementById('modal-buy');
const modalClose = document.querySelector('.modal .close');

function attachModalEvents() {
  const buttons = document.querySelectorAll('.buy-button');
  buttons.forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id;
      const product = productsData.find(p => p.id == id);
      if(product) {
        modalImg.src = product.image;
        modalName.textContent = product.name;
        modalDesc.textContent = product.description;
        modalPrice.textContent = `₦${product.price}`;
        modalBuy.href = product.paymentLink;
        modal.style.display = 'block';
      }
    });
  });
}

if(modalClose){
  modalClose.onclick = () => modal.style.display = 'none';
  window.onclick = e => { if(e.target == modal) modal.style.display = 'none'; };
}

/* -----------------------
   FUNCTION: Lazy Load Images
------------------------*/
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('.lazy');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        obs.unobserve(img);
      }
    });
  }, { threshold: 0.1 });

  lazyImages.forEach(img => observer.observe(img));
    }
