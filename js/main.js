// Fetch products and render dynamically
fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const grid = document.querySelectorAll('#product-grid');
    grid.forEach(container => {
      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>₦${product.price}</p>
          <a href="${product.paymentLink}" class="buy-button" target="_blank">Buy Now</a>
        `;
        container.appendChild(card);
      });
    });
  })
  .catch(err => console.error('Error loading products:', err));
