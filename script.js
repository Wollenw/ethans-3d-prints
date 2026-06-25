const filters = document.querySelectorAll('.filter-btn');
const products = document.querySelectorAll('.product-card');
const orderModal = document.getElementById('order-modal');
const orderClose = document.getElementById('order-close');
const buyButtons = document.querySelectorAll('[data-action="buy"]');
const orderProductInput = document.getElementById('order-product');
const orderNameInput = document.getElementById('order-name');
const orderEmailInput = document.getElementById('order-email');
const orderNoteInput = document.getElementById('order-note');
const orderFeedback = document.getElementById('order-feedback');
const toast = document.getElementById('toast');
const estimateValue = document.getElementById('estimate-value');
const sizeInput = document.getElementById('size');
const materialInput = document.getElementById('material');
const orderForm = document.getElementById('order-form');
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');
const BUY_EMAIL = 'ethanlucasw6@gmail.com';

function showToast(message) {
  toast.textContent = message;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => (toast.style.display = 'none'), 300);
  }, 2200);
}

filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const category = button.dataset.filter;
    products.forEach(card => {
      card.style.display = category === 'all' || card.dataset.category === category ? 'grid' : 'none';
    });
  });
});

function openOrderModal(productName) {
  orderProductInput.value = productName;
  orderModal.classList.add('show');
  orderModal.setAttribute('aria-hidden', 'false');
  orderNameInput.focus();
}

buyButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productName = button.dataset.product || 'Custom Print';
    openOrderModal(productName);
  });
});

orderClose.addEventListener('click', () => {
  orderModal.classList.remove('show');
  orderModal.setAttribute('aria-hidden', 'true');
});

orderModal.addEventListener('click', event => {
  if (event.target === orderModal) {
    orderModal.classList.remove('show');
    orderModal.setAttribute('aria-hidden', 'true');
  }
});

function calculateEstimate() {
  const size = sizeInput.value;
  const material = materialInput.value;
  let base = 30;
  if (size === 'medium') base += 18;
  if (size === 'large') base += 34;
  if (material === 'PETG') base += 10;
  if (material === 'ABS') base += 16;
  estimateValue.textContent = `$${base}`;
}

sizeInput.addEventListener('change', calculateEstimate);
materialInput.addEventListener('change', calculateEstimate);

orderForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('builder-name').value.trim();
  const email = document.getElementById('builder-email').value.trim();
  const description = document.getElementById('description').value.trim();
  if (!name || !email) {
    showToast('Please add your name and email.');
    return;
  }
  showToast('Request submitted! Ethan will follow up soon.');
  orderForm.reset();
  calculateEstimate();
});

const buyOrderForm = document.getElementById('buy-order-form');
if (buyOrderForm) {
  buyOrderForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = orderNameInput.value.trim();
    const email = orderEmailInput.value.trim();
    const product = orderProductInput.value.trim();
    const note = orderNoteInput.value.trim();
    if (!name || !email || !product) {
      orderFeedback.textContent = 'Please provide your name, email, and chosen product.';
      return;
    }
    const subject = encodeURIComponent(`Instant buy request: ${product}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProduct: ${product}\nOrder Notes: ${note}\n\nPayment will be arranged offline.`
    );
    window.location.href = `mailto:${BUY_EMAIL}?subject=${subject}&body=${body}`;
    orderFeedback.textContent = 'Opening email draft...';
    showToast('Email draft opened. Send it to complete your request.');
  });
}

contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('client-name').value.trim();
  const email = document.getElementById('client-email').value.trim();
  const request = document.getElementById('client-request').value.trim();
  if (!name || !email || !request) {
    contactMessage.textContent = 'Please fill in your name, email and project details.';
    return;
  }
  contactMessage.textContent = 'Thanks! Your order request has been sent.';
  contactForm.reset();
  setTimeout(() => (contactMessage.textContent = ''), 4200);
});

calculateEstimate();

// Fill gallery captions from image filenames / alt text
document.querySelectorAll('.gallery-card').forEach(card => {
  const img = card.querySelector('img');
  const nameEl = card.querySelector('.g-name');
  if (!img || !nameEl) return;
  // derive a friendly name from alt or filename
  let name = img.alt && img.alt !== 'Example Print' ? img.alt : img.src.split('/').pop().split('.')[0];
  name = name.replace(/[-_\d]+/g, ' ').replace(/\b( jpg| jpeg| png)\b/gi, '').trim();
  name = name.replace(/\b(guitarpick)\b/i, 'Guitar Pick');
  name = name.replace(/carrotsword/i, 'Carrot Prop');
  name = name.replace(/flexi rex/i, 'Articulated Rex');
  name = name.replace(/dragon/i, 'Dragon Figurine');
  name = name.replace(/fidget/i, 'Fidget Spinner');
  name = name.replace(/wallet/i, 'Sliding Wallet');
  name = name.replace(/jar/i, 'Jar Topper Spout');
  nameEl.textContent = name;
});

// Quick view modal handling
const previewModal = document.getElementById('preview-modal');
const previewImg = document.getElementById('preview-img');
const previewTitle = document.getElementById('preview-title');
const previewDesc = document.getElementById('preview-desc');
const previewClose = document.getElementById('preview-close');

document.querySelectorAll('[data-action="quickview"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const image = btn.dataset.image;
    const product = btn.dataset.product || 'Preview';
    previewImg.src = image || '';
    previewTitle.textContent = product;
    previewDesc.textContent = '';
    previewModal.classList.add('show');
    previewModal.setAttribute('aria-hidden', 'false');
  });
});

// Open preview when clicking a gallery image
document.querySelectorAll('.gallery-card img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    if (!previewModal) return;
    const card = img.closest('.gallery-card');
    const title = card ? (card.querySelector('.g-name')?.textContent || img.alt) : img.alt;
    const meta = card ? (card.querySelector('.g-meta')?.textContent || '') : '';
    previewImg.src = img.src;
    previewTitle.textContent = title || 'Preview';
    previewDesc.textContent = meta;
    previewModal.classList.add('show');
    previewModal.setAttribute('aria-hidden', 'false');
  });
});

if (previewClose) {
  previewClose.addEventListener('click', () => {
    previewModal.classList.remove('show');
    previewModal.setAttribute('aria-hidden', 'true');
    previewImg.src = '';
  });
}

if (previewModal) {
  previewModal.addEventListener('click', event => {
    if (event.target === previewModal) {
      previewModal.classList.remove('show');
      previewModal.setAttribute('aria-hidden', 'true');
      previewImg.src = '';
    }
  });
}
