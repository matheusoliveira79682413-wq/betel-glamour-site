const DEFAULT_CATEGORIES = [
  { nome: "Roupas", grupo: "Roupas", categoria: "Roupas" },
  { nome: "Perfumes Femininos", grupo: "Perfumes", categoria: "Perfumes Femininos" },
  { nome: "Perfumes Masculinos", grupo: "Perfumes", categoria: "Perfumes Masculinos" },
];

const state = {
  categories: [{ nome: "Todos", categoria: "todos" }, ...DEFAULT_CATEGORIES],
  products: [],
  filter: { nome: "Todos", categoria: "todos" },
};

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const productsContainer = document.querySelector("[data-products]");
const filterBar = document.querySelector("[data-filter-bar]");
const productCount = document.querySelector("[data-product-count]");
const year = document.querySelector("[data-year]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const instagramLinks = document.querySelectorAll("[data-instagram-link]");

if (year) {
  year.textContent = new Date().getFullYear();
}

function closeMenu() {
  nav?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
});

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function productMatchesFilter(product) {
  if (state.filter.categoria === "todos") {
    return true;
  }

  return product.categoria === state.filter.categoria;
}

function renderFilters() {
  if (!filterBar) {
    return;
  }

  filterBar.innerHTML = state.categories.map((category, index) => {
    const isActive = category.categoria === state.filter.categoria;
    return `
      <button
        class="filter-button${isActive ? " is-active" : ""}"
        type="button"
        data-filter-index="${index}"
        aria-pressed="${isActive}"
      >
        ${escapeHtml(category.nome)}
      </button>
    `;
  }).join("");
}

function createProductCard(product) {
  const photos = Array.isArray(product.fotos) && product.fotos.length > 0
    ? product.fotos
    : ["assets/produtos/placeholder.png"];
  const safeId = slugify(product.id || product.nome);
  const firstPhoto = photos[0];
  const hasCarousel = photos.length > 1;
  const hasLongDescription = product.descricao.length > 280;
  const categoryLabel = product.grupo === product.categoria
    ? product.grupo
    : `${product.grupo} / ${product.categoria}`;
  const dots = photos
    .map((_, index) => `
      <button
        class="carousel-dot${index === 0 ? " is-active" : ""}"
        type="button"
        aria-label="Ver foto ${index + 1} de ${photos.length}"
        data-carousel-dot="${index}"
      ></button>
    `)
    .join("");

  return `
    <article class="product-card" data-product-card data-photos='${escapeHtml(JSON.stringify(photos))}'>
      <div class="product-media">
        <img
          src="${escapeHtml(firstPhoto)}"
          alt="${escapeHtml(product.nome)}"
          loading="lazy"
          data-carousel-image
        />
        ${hasCarousel ? `
          <button class="carousel-button prev" type="button" aria-label="Foto anterior" data-carousel-prev>‹</button>
          <button class="carousel-button next" type="button" aria-label="Próxima foto" data-carousel-next>›</button>
          <div class="carousel-dots" aria-label="Fotos do produto ${escapeHtml(product.nome)}">
            ${dots}
          </div>
        ` : ""}
      </div>
      <div class="product-content">
        <p class="product-kicker">${escapeHtml(categoryLabel)}</p>
        <h3 id="produto-${safeId}">${escapeHtml(product.nome)}</h3>
        <p class="product-description${hasLongDescription ? " is-collapsed" : ""}" data-description>
          ${escapeHtml(product.descricao)}
        </p>
        ${hasLongDescription ? `
          <button
            class="description-toggle"
            type="button"
            aria-expanded="false"
            data-description-toggle
          >
            Ler mais
          </button>
        ` : ""}
        <a class="button outline" href="#contato" aria-describedby="produto-${safeId}">
          Consultar no WhatsApp
        </a>
      </div>
    </article>
  `;
}

function attachCarousels() {
  document.querySelectorAll("[data-product-card]").forEach((card) => {
    const image = card.querySelector("[data-carousel-image]");
    const previous = card.querySelector("[data-carousel-prev]");
    const next = card.querySelector("[data-carousel-next]");
    const dots = [...card.querySelectorAll("[data-carousel-dot]")];
    const photos = JSON.parse(card.dataset.photos || "[]");
    let currentIndex = 0;

    function setPhoto(index) {
      if (!image || photos.length === 0) {
        return;
      }

      currentIndex = (index + photos.length) % photos.length;
      image.src = photos[currentIndex];
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === currentIndex);
      });
    }

    previous?.addEventListener("click", () => setPhoto(currentIndex - 1));
    next?.addEventListener("click", () => setPhoto(currentIndex + 1));
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        setPhoto(Number(dot.dataset.carouselDot));
      });
    });
  });
}

function renderProducts() {
  if (!productsContainer) {
    return;
  }

  const filteredProducts = state.products.filter(productMatchesFilter);

  productCount.textContent = filteredProducts.length === 1
    ? "1 produto encontrado"
    : `${filteredProducts.length} produtos encontrados`;

  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = `
      <p class="empty-message">
        Nenhum produto cadastrado nesta categoria ainda.
      </p>
    `;
    return;
  }

  productsContainer.innerHTML = filteredProducts.map(createProductCard).join("");
  attachCarousels();
}

function applySiteInfo(siteInfo) {
  document.querySelectorAll("[data-site-field]").forEach((element) => {
    const key = element.dataset.siteField;

    if (siteInfo[key]) {
      element.textContent = siteInfo[key];
    }
  });

  whatsappLinks.forEach((link) => {
    if (siteInfo.whatsappUrl) {
      link.href = siteInfo.whatsappUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
    }
  });

  instagramLinks.forEach((link) => {
    if (siteInfo.instagramUrl) {
      link.href = siteInfo.instagramUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
    }
  });
}

async function loadSiteInfo() {
  try {
    const response = await fetch("data/site.json");

    if (!response.ok) {
      return;
    }

    const siteInfo = await response.json();
    applySiteInfo(siteInfo);
  } catch {
    // Keep static fallback content when site info is unavailable.
  }
}

filterBar?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter-index]");

  if (!button) {
    return;
  }

  state.filter = state.categories[Number(button.dataset.filterIndex)];
  renderFilters();
  renderProducts();
});

productsContainer?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-description-toggle]");

  if (!button) {
    return;
  }

  const description = button
    .closest("[data-product-card]")
    ?.querySelector("[data-description]");
  const isExpanded = button.getAttribute("aria-expanded") === "true";

  description?.classList.toggle("is-collapsed", isExpanded);
  button.setAttribute("aria-expanded", String(!isExpanded));
  button.textContent = isExpanded ? "Ler mais" : "Mostrar menos";
});

async function loadProducts() {
  try {
    const response = await fetch("data/produtos.json");

    if (!response.ok) {
      throw new Error("Arquivo de produtos não encontrado.");
    }

    const data = await response.json();
    state.products = Array.isArray(data) ? data : data.produtos || [];
  } catch (error) {
    productsContainer.innerHTML = `
      <p class="empty-message">
        Não foi possível carregar <code>data/produtos.json</code>.
        Para visualizar localmente, use um servidor local em vez de abrir o HTML direto.
      </p>
    `;
    productCount.textContent = "";
    return;
  }

  renderFilters();
  renderProducts();
}

async function loadCategories() {
  try {
    const response = await fetch("data/categorias.json");

    if (!response.ok) {
      throw new Error("Arquivo de categorias não encontrado.");
    }

    const data = await response.json();
    const categories = Array.isArray(data) ? data : data.categorias || [];
    state.categories = [
      { nome: "Todos", categoria: "todos" },
      ...categories.filter((category) => category.nome && category.categoria),
    ];
    state.filter = state.categories[0];
  } catch {
    state.categories = [{ nome: "Todos", categoria: "todos" }, ...DEFAULT_CATEGORIES];
    state.filter = state.categories[0];
  }

  renderFilters();
}

loadSiteInfo();
loadCategories().then(loadProducts);
