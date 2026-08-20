const content = window.siteContent;
const categoryGrid = document.querySelector('#categoryGrid');
const productGrid = document.querySelector('#productGrid');
const collectionGrid = document.querySelector('#collectionGrid');
const articleGrid = document.querySelector('#articleGrid');
const slugify = value => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

function weeklyRotation(items, filter) {
  if (items.length < 2) return items;
  const now = new Date();
  const mondayOffset = (now.getUTCDay() + 6) % 7;
  const monday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - mondayOffset);
  const weekNumber = Math.floor(monday / millisecondsPerWeek);
  const weeklyStep = filter === 'All' ? 5 : 1;
  const offset = (weekNumber * weeklyStep) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

categoryGrid.innerHTML = content.categories.map(item => `
  <a class="category-card ${item.color}" href="#trending" data-category="${item.name}">
    <span class="category-icon">${item.icon}</span><span><strong>${item.name}</strong><small>${item.description}</small></span><b>→</b>
  </a>`).join('');

function renderProducts(filter = 'All', expanded = false) {
  const filtered = filter === 'All'
    ? content.products
    : content.products.filter(product => {
        const productCategories = product.categories || [product.category];
        return productCategories.includes(filter);
      });
  const rotated = weeklyRotation(filtered, filter);
  const visible = expanded ? rotated : rotated.slice(0, 4);
  productGrid.innerHTML = visible.map((item, index) => `
    <article class="product-card">
      <a class="product-image ${item.color}" href="${item.link}" target="_blank" rel="sponsored nofollow noopener" aria-label="View ${item.title} on Amazon">
        <span class="product-badge">${item.badge}</span>
        <img class="product-photo" src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" />
        <button class="save-button" aria-label="Save ${item.title}" data-save="${index}">♡</button>
      </a>
      <p class="product-category">${item.category}</p><h3>${item.title}</h3>
      <div class="product-meta"><span>${item.price}</span><a href="blog/${slugify(item.title)}.html">Read guide →</a></div>
    </article>`).join('');
  document.querySelector('#loadMore').hidden = visible.length === rotated.length;
}
renderProducts();

collectionGrid.innerHTML = content.collections.map(item => `
  <a class="collection-card ${item.color}" href="collections/${item.slug}.html"><span class="collection-number">${item.number}</span><div><p>THE FIND LIST</p><h3>${item.title}</h3><span>${item.subtitle}</span></div><b>Read the story →</b></a>`).join('');
articleGrid.innerHTML = content.articles.map(item => `
  <article class="article-card"><a class="article-image ${item.color}" href="#journal"><span>${item.tag}</span></a><p class="article-meta">${item.tag} · ${item.read}</p><h3><a href="#journal">${item.title}</a></h3><a class="text-link" href="#journal">Read story <span>→</span></a></article>`).join('');

let currentFilter = 'All';
let expanded = false;
function selectCategory(category, showAll = false) {
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
  const matchingFilter = Array.from(document.querySelectorAll('[data-filter]'))
    .find(button => button.dataset.filter === category);
  if (matchingFilter) matchingFilter.classList.add('active');
  currentFilter = category;
  expanded = showAll;
  renderProducts(currentFilter, expanded);
}

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  selectCategory(button.dataset.filter);
}));

document.querySelectorAll('[data-category]').forEach(card => card.addEventListener('click', event => {
  event.preventDefault();
  selectCategory(card.dataset.category, true);
  document.querySelector('#trending').scrollIntoView({ behavior: 'smooth', block: 'start' });
}));
document.querySelector('#loadMore').addEventListener('click', () => { expanded = true; renderProducts(currentFilter, true); });
document.addEventListener('click', event => {
  const save = event.target.closest('.save-button');
  if (!save) return;
  event.preventDefault(); save.classList.toggle('saved'); save.textContent = save.classList.contains('saved') ? '♥' : '♡';
});

const menu = document.querySelector('.menu-toggle');
menu.addEventListener('click', () => { const open = document.body.classList.toggle('menu-open'); menu.setAttribute('aria-expanded', open); });
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => { document.body.classList.remove('menu-open'); menu.setAttribute('aria-expanded', 'false'); }));

document.querySelector('#newsletterForm').addEventListener('submit', event => {
  event.preventDefault(); event.currentTarget.querySelector('.form-message').textContent = "You're on the list!"; event.currentTarget.reset();
});
document.querySelector('#year').textContent = new Date().getFullYear();
