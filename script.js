const featuredProducts = [
  {
    id: "quantum-headset",
    name: "Auriculares QuantumWave X",
    price: 249.9,
    oldPrice: 289.9,
    category: "audio",
    inStock: true,
  },
  {
    id: "neon-keyboard",
    name: "Teclado mecánico NeonK70",
    price: 189.9,
    oldPrice: 219.9,
    category: "perifericos",
    inStock: true,
  },
  {
    id: "holo-monitor",
    name: "Monitor HoloView 32\"",
    price: 499.0,
    oldPrice: 0,
    category: "setups",
    inStock: true,
  },
  {
    id: "nova-mouse",
    name: "Mouse NovaPro Wireless",
    price: 129.9,
    oldPrice: 149.9,
    category: "perifericos",
    inStock: false,
  },
];

const catalogProducts = [
  ...featuredProducts,
  {
    id: "lumen-strip",
    name: "LumenStrip RGB 2m",
    price: 49.9,
    oldPrice: 59.9,
    category: "setups",
    inStock: true,
  },
  {
    id: "orbit-dock",
    name: "OrbitDock USB-C Pro",
    price: 139.9,
    oldPrice: 0,
    category: "setups",
    inStock: true,
  },
  {
    id: "flux-mic",
    name: "Micrófono FluxCast Studio",
    price: 159.9,
    oldPrice: 179.9,
    category: "audio",
    inStock: true,
  },
  {
    id: "zen-pad",
    name: "Alfombrilla ZenGlide XL",
    price: 39.9,
    oldPrice: 0,
    category: "perifericos",
    inStock: true,
  },
];

const allProducts = catalogProducts;

const catalogState = {
  filter: "all",
  sort: "recommended",
};

const cartState = {
  items: [],
};

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function renderSkeletonCards(container, count = 4) {
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const card = document.createElement("article");
    card.className = "product-card product-card--skeleton";
    card.innerHTML = `
      <div class="product-card__image skeleton"></div>
      <div class="product-card__body">
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--text skeleton--short"></div>
        <div class="skeleton skeleton--pill"></div>
      </div>
    `;
    container.appendChild(card);
  }
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const stockClass = product.inStock ? "product-card__stock--in" : "product-card__stock--out";
  const stockLabel = product.inStock ? "En stock" : "Sin stock";

  card.innerHTML = `
    <div class="product-card__image"></div>
    <div class="product-card__body">
      <h3 class="product-card__title">${product.name}</h3>
      <div class="product-card__meta">
        <div class="product-card__price-group">
          <span class="product-price">${formatPrice(product.price)}</span>
          ${
            hasDiscount
              ? `<span class="product-price product-price--old">${formatPrice(product.oldPrice)}</span>`
              : ""
          }
        </div>
        <span class="product-card__stock ${stockClass}">${stockLabel}</span>
      </div>
      <div class="product-card__actions">
        <button class="btn btn-primary btn--block" type="button" data-add-to-cart data-product-id="${
          product.id
        }" ${product.inStock ? "" : "disabled"}>
          ${product.inStock ? "Añadir al carrito" : "Sin stock"}
        </button>
      </div>
    </div>
  `;

  return card;
}

function renderProductGrid(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  products.forEach((p) => {
    const card = createProductCard(p);
    container.appendChild(card);
  });
}

function getFilteredSortedProducts() {
  let filtered = catalogProducts.filter((p) => {
    if (catalogState.filter === "all") return true;
    return p.category === catalogState.filter;
  });

  if (catalogState.sort === "price-asc") {
    filtered = filtered.slice().sort((a, b) => a.price - b.price);
  } else if (catalogState.sort === "price-desc") {
    filtered = filtered.slice().sort((a, b) => b.price - a.price);
  }

  return filtered;
}

function updateCatalogGrid() {
  const products = getFilteredSortedProducts();
  renderProductGrid("catalog-grid", products);
}

function initProductGrids() {
  const featuredContainer = document.getElementById("featured-grid");
  const catalogContainer = document.getElementById("catalog-grid");

  renderSkeletonCards(featuredContainer, 4);
  renderSkeletonCards(catalogContainer, 8);

  setTimeout(() => {
    renderProductGrid("featured-grid", featuredProducts);
    updateCatalogGrid();
  }, 900);
}

function initCatalogFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const sortButtons = document.querySelectorAll("[data-sort]");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.filter || "all";
      catalogState.filter = value;
      filterButtons.forEach((b) => b.classList.toggle("chip--active", b === btn));
      updateCatalogGrid();
    });
  });

  sortButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.sort || "recommended";
      catalogState.sort = value;
      sortButtons.forEach((b) => b.classList.toggle("chip--active", b === btn));
      updateCatalogGrid();
    });
  });
}

function initScrollAnimations() {
  const animated = document.querySelectorAll("[data-animate]");
  if (!animated.length) return;

  if (!("IntersectionObserver" in window)) {
    animated.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animated.forEach((el) => observer.observe(el));
}

function initParallax() {
  const layers = document.querySelectorAll(".parallax-layer");
  if (!layers.length) return;

  window.addEventListener("scroll", () => {
    const y = window.scrollY || window.pageYOffset || 0;
    layers.forEach((layer) => {
      const depth = parseFloat(layer.dataset.depth || "0.1");
      const translate = y * depth * -0.25;
      layer.style.transform = `translate3d(0, ${translate}px, 0)`;
    });
  });
}

function addToCart(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const existing = cartState.items.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartState.items.push({ ...product, quantity: 1 });
  }

  updateCartUI();
}

function removeFromCart(productId) {
  cartState.items = cartState.items.filter((item) => item.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const cartCountEl = document.querySelector("[data-cart-count]");
  const itemsContainer = document.querySelector("[data-cart-items]");
  const emptyMsg = document.querySelector("[data-cart-empty]");
  const subtotalEl = document.querySelector("[data-cart-subtotal]");
  const totalEl = document.querySelector("[data-cart-total]");
  const checkoutButton = document.querySelector("[data-checkout-button]");

  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartState.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
    if (totalItems > 0) {
      cartCountEl.classList.add("cart-indicator--pulse");
      setTimeout(() => cartCountEl.classList.remove("cart-indicator--pulse"), 500);
    }
  }

  if (itemsContainer) {
    itemsContainer.innerHTML = "";
    cartState.items.forEach((item) => {
      const row = document.createElement("article");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-item__image"></div>
        <div>
          <h3 class="cart-item__title">${item.name}</h3>
          <div class="cart-item__meta">
            <span class="cart-item__quantity">Cantidad: ${item.quantity}</span>
          </div>
        </div>
        <div>
          <div class="cart-item__price">${formatPrice(item.price * item.quantity)}</div>
          <button class="btn btn-ghost" type="button" data-remove-from-cart="${item.id}">
            Quitar
          </button>
        </div>
      `;
      itemsContainer.appendChild(row);
    });
  }

  if (emptyMsg) {
    emptyMsg.style.display = cartState.items.length === 0 ? "block" : "none";
  }

  if (subtotalEl) {
    subtotalEl.textContent = formatPrice(subtotal);
  }
  if (totalEl) {
    totalEl.textContent = formatPrice(subtotal);
  }

  if (checkoutButton) {
    checkoutButton.disabled = cartState.items.length === 0;
  }
}

function initCart() {
  updateCartUI();

  document.addEventListener("click", (event) => {
    const addBtn = event.target.closest("[data-add-to-cart]");
    if (addBtn) {
      const id = addBtn.dataset.productId;
      if (id) addToCart(id);
      return;
    }

    const removeBtn = event.target.closest("[data-remove-from-cart]");
    if (removeBtn) {
      const id = removeBtn.getAttribute("data-remove-from-cart");
      if (id) removeFromCart(id);
    }
  });

  const checkoutButton = document.querySelector("[data-checkout-button]");
  const progressBar = document.querySelector("[data-progress-bar]");

  if (checkoutButton && progressBar) {
    checkoutButton.addEventListener("click", () => {
      if (checkoutButton.disabled) return;
      progressBar.style.width = "100%";
      const originalLabel = checkoutButton.textContent;
      checkoutButton.textContent = "Checkout demo completado";
      setTimeout(() => {
        checkoutButton.textContent = originalLabel;
        progressBar.style.width = "34%";
      }, 2200);
    });
  }
}

function initGallery() {
  const main = document.querySelector("[data-zoom-target]");
  const thumbs = document.querySelectorAll("[data-gallery-src]");
  if (!main || !thumbs.length) return;

  function applyBackground(variant) {
    if (variant === "angle") {
      main.style.background =
        "radial-gradient(circle at 0 0, rgba(57, 255, 20, 0.15), transparent 55%)," +
        "radial-gradient(circle at 80% 0, rgba(0, 168, 232, 0.85), rgba(15, 23, 42, 0.98) 60%)," +
        "radial-gradient(circle at 80% 100%, rgba(15, 23, 42, 1), #020617)";
    } else if (variant === "lighting") {
      main.style.background =
        "radial-gradient(circle at 20% 0, rgba(255, 255, 255, 0.22), transparent 60%)," +
        "radial-gradient(circle at 80% 0, rgba(0, 168, 232, 0.9), rgba(15, 23, 42, 1) 55%)," +
        "radial-gradient(circle at 80% 100%, rgba(15, 23, 42, 1), #020617)";
    } else {
      main.style.background =
        "radial-gradient(circle at 0 0, rgba(57, 255, 20, 0.18), transparent 55%)," +
        "radial-gradient(circle at 80% 0, rgba(0, 168, 232, 0.8), rgba(15, 23, 42, 0.95) 60%)," +
        "radial-gradient(circle at 80% 100%, rgba(15, 23, 42, 1), #020617)";
    }
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbs.forEach((t) => t.classList.remove("product-detail__thumb--active"));
      thumb.classList.add("product-detail__thumb--active");
      const variant = thumb.dataset.gallerySrc || "default";
      applyBackground(variant);
    });
  });
}

function setCurrentYear() {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initProductGrids();
  initCatalogFilters();
  initScrollAnimations();
  initParallax();
  initCart();
  initGallery();
  setCurrentYear();
});
