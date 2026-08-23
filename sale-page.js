document.addEventListener('DOMContentLoaded', () => {
  const products = (window.siteContent && window.siteContent.products) || [];
  const saleData = window.saleData || {};
  const saleProducts = products
    .map(product => ({ ...product, ...(saleData[product.title] || {}) }))
    .filter(product => product.onSale === true);

  const container = document.getElementById('saleProducts');
  const empty = document.getElementById('noSales');
  if (!container || !empty) return;

  if (!saleProducts.length) {
    empty.hidden = false;
    return;
  }

  saleProducts.forEach(product => {
    const card = document.createElement('article');
    card.className = 'sale-card';
    const badge = product.discount || 'ON SALE';
    const pricing = product.salePrice
      ? `<p class="sale-price"><strong>${product.salePrice}</strong>${product.regularPrice ? ` <s>${product.regularPrice}</s>` : ''}</p>`
      : `<p class="sale-price">${product.price || 'Sale find'}</p>`;
    const checked = product.checked ? `<p class="sale-checked">Price checked ${product.checked}</p>` : '';

    card.innerHTML = `
      <span class="sale-badge">${badge}</span>
      <h2>${product.title}</h2>
      ${pricing}
      <p class="sale-category">${product.category || ''}</p>
      ${checked}
      <a class="sale-button" href="${product.link}" target="_blank" rel="nofollow sponsored noopener">Check current price ↗</a>
    `;
    container.appendChild(card);
  });
});
