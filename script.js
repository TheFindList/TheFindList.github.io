const content = window.siteContent;
const categoryGrid = document.querySelector('#categoryGrid');
const productGrid = document.querySelector('#productGrid');
const collectionGrid = document.querySelector('#collectionGrid');
const articleGrid = document.querySelector('#articleGrid');
const slugify = value => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
const homepageFeature = {
  titles: ["Light-Up Ceramic Ghost Decorations - 4 Pack", "Jabberin' Jack Talking Animated Pumpkin"],
  expiresAt: Date.parse("2026-08-24T06:00:00Z")
};
const knownImages = {
  "Candle Warmer Lamp with Timer and Dimmer": "https://m.media-amazon.com/images/I/81rmGdz5PJL.jpg",
  "Bedsure Sherpa Fleece Throw Blanket": "https://multimedia.bbycastatic.ca/multimedia/products/1500x1500/173/17399/17399223.jpeg",
  "Stanley Quencher H2.0 FlowState Tumbler": "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/V16813s2.jpg?im=Resize%2Cwidth%3D750",
  "Owala FreeSip Insulated Water Bottle": "https://i5.walmartimages.com/asr/e665821e-1fa3-4c60-aac7-59f9c8d08fd0.c4f999d07f70b51cd541c08cc0037955.jpeg",
  "BAGSMART Travel Toiletry Bag": "https://i5.walmartimages.com/seo/BAGSMART-Toiletry-Bag-Women-Travel-Makeup-Bag-Wide-open-Portable-Make-Bag-Organizer-Women-Travel-Essentials-Travel-Size-Toiletries-Accessories-Bottle_49a802f9-4f49-4932-a5ab-2e2115bb8997.3c1bb306fcb92ac68a6a552f4cafd9b9.jpeg?odnBg=FFFFFF&odnHeight=576&odnWidth=576",
  "Hatch Restore Sound Machine & Sunrise Alarm": "https://hips.hearstapps.com/hmg-prod/images/hatch-restore-alarm-clock-021-1675201774.jpg?crop=0.945xw%3A0.841xh%3B0.0138xw",
  "Clever Fox Premium Weekly Planner": "https://cleverfoxplanner.com/cdn/shop/products/Main-Pearl_56ef05b9-1b90-4cf1-b448-9e6a02d1e60d_1400x.jpg?v=1698391744",
  "MIULEE Burnt-Orange Corduroy Pillow Covers": "https://m.media-amazon.com/images/I/81XHB3Da%2BrL._AC_SL1500_.jpg",
  "Yankee Candle Autumn Wreath Large Jar Candle": "https://yankeecandle.imgix.net/b7433ad0-51cf-36da-9184-c3100cd69ce5/b7433ad0-51cf-36da-9184-c3100cd69ce5.jpg?auto=format%2Ccompress&h=2000&sort=1&w=2000",
  "FEXIA Boho Fall Table Runner": "https://i5.walmartimages.com/asr/6eaf4e27-1f1a-41b1-9ab0-f031fa951c91.cabef7cb222b0f11cd2019e4a4ba48e6.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
  "Pipishell Three-Tier Rolling Utility Cart": "https://m.media-amazon.com/images/I/61RAgsVBn1L.jpg",
  "Kitsch Satin Heatless Curling Set": "https://www.becharmedgifts.com/cdn/shop/files/Kitsch_Satin_Heatless_Curling_Set_Sunset_Tie_Dye_Be_Charmed.jpg?v=1770154855",
  "LATME Ice Roller for Face and Eyes": "https://m.media-amazon.com/images/I/311lx-q6jxL._SL500_.jpg",
  "Tree Hut Tropic Glow Shea Sugar Scrub": "https://digital.loblaws.ca/PCX/21656901_EA/en/1/7537130050_enfr_front_centre_marketing_1_GS1_Ecommerce_800.png",
  "Sol de Janeiro Brazilian Bum Bum Cream": "https://images.beautybay.com/eoaaqxyywn6o/SOJA0018F_1.jpg_s3.lmb_i7mr8k/6e89f38f02d70d3f2da4cc6b56e78628/SOJA0018F_1.jpg",
  "Anker 3-in-1 Cube with MagSafe": "https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/3278/PMP20000428075/full_image-1.jpeg",
  "Fullstar Pro Original Vegetable Chopper & Spiralizer": "https://m.media-amazon.com/images/I/81CWnvUBrrL._UF894%2C1000_QL80_.jpg",
  "4-Pack Fall Scented Soy Candle Set": "https://mobileimages.lowes.com/productimages/4f47bfbb-7d76-446b-9e91-0bdf50b8894d/77618433.jpeg?size=pdhz",
  "Pura Plus Smart Home Fragrance Diffuser": "https://pura.com/cdn/shop/files/PuraPlus-PDP-EC2-V3.png?v=1727116299&width=1200"
};
function weeklyRotation(items, filter) {
  if (items.length < 2) return items;
  const now = new Date();
  const mondayOffset = (now.getUTCDay() + 6) % 7;
  const monday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - mondayOffset);
  const weekNumber = Math.floor(monday / millisecondsPerWeek);
  const weeklyStep = filter === 'All' ? 5 : 1;
  const offset = (weekNumber * weeklyStep) % items.length;
  const rotated = [...items.slice(offset), ...items.slice(0, offset)];
  if (filter !== 'All' || now.getTime() >= homepageFeature.expiresAt) return rotated;
  const featured = homepageFeature.titles.map(title => rotated.find(item => item.title === title)).filter(Boolean);
  return [...featured, ...rotated.filter(item => !homepageFeature.titles.includes(item.title))];
}
function escapeXml(value = '') { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&apos;'); }
function wrapTitle(title, max = 24) { const words = String(title).split(/\s+/); const lines = []; let line = ''; words.forEach(word => { const next = line ? `${line} ${word}` : word; if (next.length > max && line) { lines.push(line); line = word; } else line = next; }); if (line) lines.push(line); return lines.slice(0, 4); }
function productFallback(title, category) { const lines = wrapTitle(title).map((line, index) => `<text x="50%" y="${250 + index * 44}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="30" font-weight="700" fill="#3f352d">${escapeXml(line)}</text>`).join(''); const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#f3eee6"/><circle cx="400" cy="165" r="78" fill="#ded2c2"/><text x="400" y="187" text-anchor="middle" font-family="Georgia,serif" font-size="58" fill="#6f5c4b">✦</text>${lines}<text x="400" y="475" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="22" letter-spacing="3" fill="#8b755f">${escapeXml((category || 'THE FIND LIST').toUpperCase())}</text><line x1="250" y1="520" x2="550" y2="520" stroke="#cabba8" stroke-width="2"/><text x="400" y="575" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#5b4a3d">THE FIND LIST</text><text x="400" y="615" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="#8b755f">Image updating</text></svg>`; return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`; }
function applyImageFallbacks() { document.querySelectorAll('.product-photo').forEach(img => { const fallback = () => { if (img.dataset.fallbackApplied === 'true') return; img.dataset.fallbackApplied = 'true'; const backup = img.dataset.backup; if (backup && img.src !== backup) { img.src = backup; return; } img.src = productFallback(img.dataset.title || img.alt, img.dataset.category || 'The Find List'); }; img.addEventListener('error', fallback); if (img.complete && img.naturalWidth === 0) fallback(); }); }
categoryGrid.innerHTML = content.categories.map(item => `<a class="category-card ${item.color}" href="#trending" data-category="${item.name}"><span class="category-icon">${item.icon}</span><span><strong>${item.name}</strong><small>${item.description}</small></span><b>→</b></a>`).join('');
function renderProducts(filter = 'All', expanded = false) { const filtered = filter === 'All' ? content.products : content.products.filter(product => { const productCategories = product.categories || [product.category]; return productCategories.includes(filter); }); const rotated = weeklyRotation(filtered, filter); const visible = expanded ? rotated : rotated.slice(0, 4); productGrid.innerHTML = visible.map((item, index) => { const primary = knownImages[item.title] || item.image || ''; const backup = item.image && item.image !== primary ? item.image : ''; return `<article class="product-card"><a class="product-image ${item.color}" href="${item.link}" target="_blank" rel="sponsored nofollow noopener" aria-label="View ${item.title} on Amazon"><span class="product-badge">${item.badge}</span><img class="product-photo" src="${primary}" data-backup="${backup}" alt="${item.title}" data-title="${item.title.replace(/\"/g, '&quot;')}" data-category="${item.category}" loading="lazy" decoding="async" /><button class="save-button" aria-label="Save ${item.title}" data-save="${index}">♡</button></a><p class="product-category">${item.category}</p><h3>${item.title}</h3><div class="product-meta"><span>${item.price}</span><a href="blog/${slugify(item.title)}.html">Read guide →</a></div></article>`; }).join(''); applyImageFallbacks(); document.querySelector('#loadMore').hidden = visible.length === rotated.length; }
function selectCategory(filter, shouldScroll = true) {
  document.querySelectorAll('.filter-pills button').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
  renderProducts(filter);
  const loadMore = document.querySelector('#loadMore');
  if (loadMore) loadMore.dataset.filter = filter;
  if (shouldScroll) document.querySelector('#trending')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
renderProducts();
collectionGrid.innerHTML = content.collections.map(item => `<a class="collection-card ${item.color}" href="collections/${item.slug}.html"><span class="collection-number">${item.number}</span><div><p>THE FIND LIST</p><h3>${item.title}</h3><span>${item.subtitle}</span></div><b>Read the story →</b></a>`).join('');
const articleArt = { HALLOWEEN: '👻 🎃', HOME: '⌂ ✦', LIFESTYLE: '☼ ✦', 'THE WEEKLY FIVE': '05' };
articleGrid.innerHTML = content.articles.map(item => { const href = item.link || `blog/${item.slug || slugify(item.title)}.html`; const art = item.art || articleArt[item.tag] || '✦'; return `<article class="article-card"><a href="${href}"><div class="article-image ${item.color || 'terracotta'}"><span>${item.tag || 'THE EDIT'}</span><div class="article-art">${art}</div></div><p>${item.tag || 'THE EDIT'}</p><h3>${item.title}</h3><span>${item.read || 'Read guide'} →</span></a></article>`; }).join('');
document.querySelectorAll('.filter-pills button').forEach(button => button.addEventListener('click', () => selectCategory(button.dataset.filter, false)));
categoryGrid.addEventListener('click', event => {
  const card = event.target.closest('.category-card');
  if (!card) return;
  event.preventDefault();
  selectCategory(card.dataset.category, true);
});
document.querySelector('#loadMore').addEventListener('click', event => renderProducts(event.currentTarget.dataset.filter || 'All', true));
document.querySelector('#productGrid').addEventListener('click', event => { const save = event.target.closest('.save-button'); if (!save) return; event.preventDefault(); save.textContent = save.textContent === '♡' ? '♥' : '♡'; save.classList.toggle('saved'); });
document.querySelector('.menu-toggle').addEventListener('click', event => { const nav = document.querySelector('.nav-links'); const open = nav.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });
document.querySelector('.search-button').addEventListener('click', () => { const query = window.prompt('What are you looking for?'); if (!query) return; const match = content.products.find(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase())); if (match) selectCategory(match.category, true); else window.alert(`No exact match for “${query}” yet. Try Home, Kitchen, Seasonal, Dorm, Beauty, or Tech.`); });

document.querySelector('#year').textContent = new Date().getFullYear();