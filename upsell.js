// [A/B] Bundles & Routines Upsell (core)

(() => {
  const existing = window.abBundlesRoutinesUpsell;
  if (existing && typeof existing.init === "function") return;

  const api = (existing && typeof existing === "object") ? existing : {};

  const STYLE_ID = "ab-bundles-routines-upsell-style";
  const ROOT_CLASS = "ab-bundles-upsell-root";
  const DISCOUNT_RATE = 0.15;

  const PRODUCT_HANDLES = {
    serum: "professional-serum-5ml-us",
    mac: "multi-action-cream-us",
    rhc: "restorative-hydration-cream-us",
    eye: "eye-contour-lifting-cream-15ml",
    rnc: "recovery-night-complex-us",
    starterBundle: "starter-bundle-kit-us",
    starterMac: "multi-action-cream-20g",
    starterRhc: "restorative-hydration-cream-20g",
  };

  const HANDLE_ALIASES = {
    serum: [
      "professional-serum-sale",
      "professional-serum-5ml-us",
      "professional-serum-5ml-au",
      "professional-serum-sg",
      "professional-serum-5ml-sg",
    ],
    mac: [
      "multi-action-cream",
      "multi-action-cream-us",
      "multi-action-cream-20g",
      "multi-action-cream-50g-sg",
      "multi-action-cream-sale",
    ],
    rhc: [
      "restorative-hydration-cream",
      "restorative-hydration-cream-us",
      "restorative-hydration-cream-20g",
      "restorative-hydration-cream-50g-sg",
      "restorative-hydration-cream-sale",
    ],
    eye: ["eye-contour-lifting-cream-15ml", "eye-contour-lifting-cream-15g"],
    rnc: [
      "recovery-night-complex",
      "recovery-night-complex-us",
      "recovery-night-complex-5-x-3g-sachet",
      "recovery-night-complex-60g-sg",
      "recovery-night-complex-sale",
    ],
    starterMac: [
      "multi-action-cream-20g",
      "multi-action-cream-20g-starter-size-kit-us",
    ],
    starterRhc: [
      "restorative-hydration-cream-20g",
      "restorative-hydration-cream-20g-starter-size-kit-us",
    ],
    starterBundle: [
      "starter-bundle-kit",
      "starter-bundle-kit-us",
      "starter-bundle-kit-sg",
    ],
  };

  const CSS = `
    .${ROOT_CLASS} {
      padding: 0 0 20px;
      margin-bottom: 20px;
      background: #f5f5f5;
    }

    .${ROOT_CLASS}__title {
      margin: 0 0 14px;
      font-family: inherit;
      line-height: inherit;
      color: #231d1d;
    }

    .${ROOT_CLASS}__list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .${ROOT_CLASS}__card {
      box-sizing: border-box;
      width: 100%;
      padding: 14px;
      border: 1px solid #e7e7e7;
      background: #fff;
    }

    .${ROOT_CLASS}__visuals {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      width: 100%;
      margin-bottom: 12px;
    }

    .${ROOT_CLASS}__product {
      flex: 1 1 0;
      min-width: 0;
    }

    .${ROOT_CLASS}__product-image {
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      margin-bottom: 8px;
      overflow: hidden;
      background: #f5f5f5;
    }

    .${ROOT_CLASS}__product-image img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .${ROOT_CLASS}__product-title {
      font-size: 12px;
      line-height: 1.3;
      font-weight: 600;
      letter-spacing: 0.01em;
      text-transform: uppercase;
      color: #231d1d;
    }

    .${ROOT_CLASS}__product-variant {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
      margin-top: 8px;
      padding: 4px 10px;
      border: 1px solid #d8d2d2;
      border-radius: 999px;
      background: #f7f4f4;
      font-size: 10px;
      line-height: 1.2;
      color: #4f4747;
    }

    .${ROOT_CLASS}__variant-options {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .${ROOT_CLASS}__variant-option {
      appearance: none;
      padding: 4px 10px;
      border: 1px solid #d8d2d2;
      border-radius: 999px;
      background: #fff;
      color: #4f4747;
      font-size: 10px;
      line-height: 1.2;
      cursor: pointer;
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease;
    }

    .${ROOT_CLASS}__variant-option.is-active {
      border-color: #231d1d;
      background: #231d1d;
      color: #fff;
    }

    .${ROOT_CLASS}__plus {
      display: flex;
      flex: 0 0 22px;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      margin-top: calc(50% - 26px);
      border-radius: 50%;
      background: #231d1d;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      line-height: 1;
    }

    .${ROOT_CLASS}__button {
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 4px;
      width: 100%;
      min-height: 52px;
      padding: 14px 18px;
      border: 0;
      border-radius: 999px;
      background: #231d1d;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.015em;
      text-transform: uppercase;
      text-align: center;
      white-space: normal;
      cursor: pointer;
      transition:
        opacity 0.15s ease,
        transform 0.15s ease;
    }

    .${ROOT_CLASS}__button[disabled] {
      opacity: 0.65;
      cursor: wait;
    }

    .${ROOT_CLASS}__button-label,
    .${ROOT_CLASS}__price {
      display: inline-block;
      line-height: 1;
    }

    .${ROOT_CLASS}__compare {
      display: inline-block;
      flex: 0 0 auto;
      opacity: 0.5;
      font-size: 10px;
      line-height: 1;
      text-decoration: line-through;
    }

    .${ROOT_CLASS}__note {
      margin-top: 8px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      text-align: center;
      color: #231d1d;
    }

    @media (min-width: 768px) {
      .${ROOT_CLASS} {
        padding-left: 0;
        padding-right: 0;
      }
    }
  `;

  const productCache = {};
  let renderQueued = false;
  let renderInFlight = false;

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = CSS;
    document.head.appendChild(style);
  }

  function money(cents) {
    if (window.Shopify && typeof window.Shopify.formatMoney === "function") {
      return window.Shopify.formatMoney(
        cents,
        window.$360Shop?.money_with_currency_format || "${{amount}}"
      );
    }

    return "$" + (cents / 100).toFixed(2);
  }

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normaliseHandle(value) {
    return String(value || "").trim().toLowerCase();
  }

  function hasCartItem(items, aliases) {
    return items.some((item) => aliases.includes(normaliseHandle(item.handle)));
  }

  function getFirstAvailableVariant(product) {
    if (!product?.variants?.length) return null;
    return product.variants.find((variant) => variant.available) || product.variants[0];
  }

  function getVariantById(product, variantId) {
    if (!product?.variants?.length || !variantId) return null;
    return product.variants.find((variant) => Number(variant.id) === Number(variantId)) || null;
  }

  function getVariantLabel(variant) {
    const label = String(variant?.title || "").trim();

    if (!label || label.toLowerCase() === "default title") {
      return "";
    }

    return label;
  }

  function getSelectableVariants(product) {
    if (!product?.variants?.length) return [];

    return product.variants.filter((variant) => variant.available && getVariantLabel(variant));
  }

  function fetchProduct(handle) {
    if (!handle) return Promise.resolve(null);
    if (productCache[handle]) return productCache[handle];

    productCache[handle] = fetch(
      `${window.Shopify.routes.root}products/${handle}.js`,
      { credentials: "same-origin" }
    )
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${handle}`);
        return response.json();
      })
      .catch(() => {
        delete productCache[handle];
        return null;
      });

    return productCache[handle];
  }

  let cartJsFetchInFlight = null;

  function fetchCart() {
    if (cartJsFetchInFlight) {
      return cartJsFetchInFlight;
    }

    const url = `${window.Shopify.routes.root}cart.js`;

    function attemptFetch(retryIndex) {
      return fetch(url, { credentials: "same-origin" }).then((response) => {
        if (response.status === 429 && retryIndex < 3) {
          const delayMs = 700 * Math.pow(2, retryIndex);
          return new Promise((resolve) => window.setTimeout(resolve, delayMs)).then(() =>
            attemptFetch(retryIndex + 1)
          );
        }

        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || `cart.js ${response.status}`);
          });
        }

        return response.json();
      });
    }

    cartJsFetchInFlight = attemptFetch(0).finally(() => {
      cartJsFetchInFlight = null;
    });

    return cartJsFetchInFlight;
  }

  function getDrawerMount() {
    return document.querySelector(
      "#header-cart .header-cart-wrapper .cart-items-wrapper"
    );
  }

  function removeExistingRoot(mount) {
    if (!mount) return;
    mount.querySelector(`.${ROOT_CLASS}`)?.remove();
  }

  function createButtonCardData(base) {
    return {
      buttonLabel: "ADD BOTH TO CART -",
      note: "15% off with Power Bundle",
      ...base,
    };
  }

  function buildComboCard(definition, products) {
    const firstVariant = getFirstAvailableVariant(products[0]);
    const secondVariant = getFirstAvailableVariant(products[1]);

    if (!firstVariant || !secondVariant) return null;

    const normalTotal =
      Number(firstVariant.price || 0) + Number(secondVariant.price || 0);
    const discountedTotal = Math.round(normalTotal * (1 - DISCOUNT_RATE));

    return createButtonCardData({
      id: definition.id,
      action: "add-missing",
      products,
      selectedVariantIds: [firstVariant.id, secondVariant.id],
      variantProductIndex: definition.missing === "first" ? 0 : 1,
      missingVariantId:
        definition.missing === "first" ? firstVariant.id : secondVariant.id,
      priceLabel: money(discountedTotal),
      compareLabel: money(normalTotal),
    });
  }

  function buildStarterBundleCard(products, bundleProduct) {
    const starterVariant = getFirstAvailableVariant(bundleProduct);
    const firstVariant = getFirstAvailableVariant(products[0]);
    const secondVariant = getFirstAvailableVariant(products[1]);

    if (!starterVariant || !firstVariant || !secondVariant) return null;

    const compareTotal =
      Number(starterVariant.compare_at_price || 0) ||
      Number(firstVariant.price || 0) + Number(secondVariant.price || 0);

    return {
      id: "starter-bundle",
      action: "upgrade-starter",
      products,
      bundleVariantId: starterVariant.id,
      buttonLabel: "ADD BOTH TO CART -",
      priceLabel: money(Number(starterVariant.price || 0)),
      compareLabel:
        compareTotal > starterVariant.price ? money(compareTotal) : "",
      note: "Starter bundle savings",
    };
  }

  function buildEligibleCards(cart) {
    const cards = [];

    const hasSerum = hasCartItem(cart.items, HANDLE_ALIASES.serum);
    const hasMac = hasCartItem(cart.items, HANDLE_ALIASES.mac);
    const hasEye = hasCartItem(cart.items, HANDLE_ALIASES.eye);
    const hasRnc = hasCartItem(cart.items, HANDLE_ALIASES.rnc);
    const hasStarterMac = hasCartItem(cart.items, HANDLE_ALIASES.starterMac);
    const hasStarterRhc = hasCartItem(cart.items, HANDLE_ALIASES.starterRhc);
    const hasStarterBundle = hasCartItem(cart.items, HANDLE_ALIASES.starterBundle);

    if (hasStarterBundle) return Promise.resolve(cards);

    const requests = [];

    if (hasStarterMac || hasStarterRhc) {
      requests.push(
        Promise.all([
          fetchProduct(PRODUCT_HANDLES.starterMac),
          fetchProduct(PRODUCT_HANDLES.starterRhc),
          fetchProduct(PRODUCT_HANDLES.starterBundle),
        ]).then((results) => {
          const starterCard = buildStarterBundleCard(
            [results[0], results[1]],
            results[2]
          );
          if (starterCard) cards.push(starterCard);
        })
      );
    }

    const comboDefinitions = [
      {
        condition: hasSerum !== hasMac,
        id: "serum-mac",
        handles: [PRODUCT_HANDLES.serum, PRODUCT_HANDLES.mac],
        missing: hasSerum ? "second" : "first",
      },
      {
        condition: hasSerum !== hasEye,
        id: "serum-eye",
        handles: [PRODUCT_HANDLES.serum, PRODUCT_HANDLES.eye],
        missing: hasSerum ? "second" : "first",
      },
      {
        condition: hasSerum !== hasRnc,
        id: "serum-rnc",
        handles: [PRODUCT_HANDLES.serum, PRODUCT_HANDLES.rnc],
        missing: hasSerum ? "second" : "first",
      },
    ];

    comboDefinitions.forEach((definition) => {
      if (!definition.condition) return;

      requests.push(
        Promise.all(definition.handles.map(fetchProduct)).then((results) => {
          const card = buildComboCard(
            { id: definition.id, missing: definition.missing },
            results
          );
          if (card) cards.push(card);
        })
      );
    });

    return Promise.all(requests).then(() => (cards.length ? [cards[0]] : []));
  }

  function renderVariantOptions(product, selectedVariantId, productIndex) {
    const variants = getSelectableVariants(product);

    if (variants.length <= 1) return "";

    return `
      <div class="${ROOT_CLASS}__variant-options">
        ${variants
          .map((variant) => {
            const isActive = Number(variant.id) === Number(selectedVariantId);
            return `
              <button
                type="button"
                class="${ROOT_CLASS}__variant-option${isActive ? " is-active" : ""}"
                data-product-index="${productIndex}"
                data-variant-id="${escapeHtml(variant.id)}"
                data-price="${escapeHtml(Number(variant.price || 0))}"
              >
                ${escapeHtml(getVariantLabel(variant))}
              </button>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderProduct(product, options) {
    const selectedVariantId = options?.selectedVariantId;
    const productIndex = options?.productIndex;
    const isVariantSelectable = !!options?.isVariantSelectable;
    const variant =
      getVariantById(product, selectedVariantId) || getFirstAvailableVariant(product);
    if (!product || !variant) return "";

    const variantLabel = getVariantLabel(variant);
    const variantOptions = isVariantSelectable
      ? renderVariantOptions(product, variant.id, productIndex)
      : "";
    const variantMarkup =
      variantOptions ||
      (variantLabel
        ? `<div class="${ROOT_CLASS}__product-variant">${escapeHtml(variantLabel)}</div>`
        : "");

    return `
      <div
        class="${ROOT_CLASS}__product"
        data-product-index="${escapeHtml(productIndex)}"
        data-selected-variant-id="${escapeHtml(variant.id)}"
        data-selected-price="${escapeHtml(Number(variant.price || 0))}"
      >
        <div class="${ROOT_CLASS}__product-image">
          ${
            product.featured_image
              ? `<img src="${escapeHtml(product.featured_image)}" alt="${escapeHtml(
                  product.title
                )}" loading="lazy">`
              : ""
          }
        </div>
        <div class="${ROOT_CLASS}__product-title">${escapeHtml(product.title)}</div>
        ${variantMarkup}
      </div>
    `;
  }

  function renderCard(card) {
    return `
      <div
        class="${ROOT_CLASS}__card"
        data-card-id="${escapeHtml(card.id)}"
      >
        <div class="${ROOT_CLASS}__visuals">
          ${renderProduct(card.products[0], {
            productIndex: 0,
            selectedVariantId: card.selectedVariantIds?.[0],
            isVariantSelectable: card.variantProductIndex === 0,
          })}
          <div class="${ROOT_CLASS}__plus" aria-hidden="true">+</div>
          ${renderProduct(card.products[1], {
            productIndex: 1,
            selectedVariantId: card.selectedVariantIds?.[1],
            isVariantSelectable: card.variantProductIndex === 1,
          })}
        </div>
        <button
          type="button"
          class="${ROOT_CLASS}__button"
          data-action="${escapeHtml(card.action || "")}"
          data-variant-product-index="${escapeHtml(card.variantProductIndex ?? "")}"
          data-bundle-variant-id="${escapeHtml(card.bundleVariantId || "")}"
        >
          <span class="${ROOT_CLASS}__button-label">${escapeHtml(card.buttonLabel)}</span>
          ${card.priceLabel ? `<span class="${ROOT_CLASS}__price">${escapeHtml(card.priceLabel)}</span>` : ""}
          ${card.compareLabel ? `<span class="${ROOT_CLASS}__compare">${escapeHtml(card.compareLabel)}</span>` : ""}
        </button>
        <div class="${ROOT_CLASS}__note">${escapeHtml(card.note)}</div>
      </div>
    `;
  }

  function renderCards(mount, cards) {
    removeExistingRoot(mount);
    if (!cards.length) return;

    const root = document.createElement("div");
    root.className = ROOT_CLASS;
    root.innerHTML = `
      <div class="${ROOT_CLASS}__title h5 uppercase">Upgrade to a bundle deal</div>
      <div class="${ROOT_CLASS}__list">${cards.map(renderCard).join("")}</div>
    `;

    mount.appendChild(root);
  }

  function setButtonLoading(button, isLoading) {
    if (!(button instanceof HTMLButtonElement)) return;
    button.disabled = isLoading;
    button.setAttribute("aria-busy", String(isLoading));
  }

  function updateCardPricing(cardElement) {
    if (!(cardElement instanceof Element)) return;

    const action = cardElement
      .querySelector(`.${ROOT_CLASS}__button`)
      ?.getAttribute("data-action");

    if (action !== "add-missing") return;

    const prices = Array.from(
      cardElement.querySelectorAll(`.${ROOT_CLASS}__product`)
    )
      .map((productElement) =>
        Number(productElement.getAttribute("data-selected-price") || 0)
      )
      .filter((value) => value > 0);

    if (prices.length !== 2) return;

    const total = prices[0] + prices[1];
    const discountedTotal = Math.round(total * (1 - DISCOUNT_RATE));
    const priceElement = cardElement.querySelector(`.${ROOT_CLASS}__price`);
    const compareElement = cardElement.querySelector(`.${ROOT_CLASS}__compare`);

    if (priceElement) priceElement.textContent = money(discountedTotal);
    if (compareElement) compareElement.textContent = money(total);
  }

  function updateSelectedVariant(optionElement) {
    if (!(optionElement instanceof Element)) return;

    const productIndex = optionElement.getAttribute("data-product-index");
    const variantId = optionElement.getAttribute("data-variant-id");
    const price = optionElement.getAttribute("data-price");
    const cardElement = optionElement.closest(`.${ROOT_CLASS}__card`);

    if (!productIndex || !variantId || !cardElement) return;

    const productElement = cardElement.querySelector(
      `.${ROOT_CLASS}__product[data-product-index="${productIndex}"]`
    );

    if (!productElement) return;

    productElement.setAttribute("data-selected-variant-id", variantId);
    productElement.setAttribute("data-selected-price", String(Number(price || 0)));

    cardElement
      .querySelectorAll(
        `.${ROOT_CLASS}__variant-option[data-product-index="${productIndex}"]`
      )
      .forEach((element) => {
        element.classList.toggle("is-active", element === optionElement);
      });

    updateCardPricing(cardElement);
  }

  function getVariantIdsForCard(button) {
    const cardElement = button.closest(`.${ROOT_CLASS}__card`);
    if (!cardElement) return [];

    const action = button.getAttribute("data-action");

    if (action === "upgrade-starter") {
      const bundleVariantId = Number(button.getAttribute("data-bundle-variant-id"));
      return bundleVariantId ? [bundleVariantId] : [];
    }

    if (action === "add-missing") {
      const productIndex = button.getAttribute("data-variant-product-index");
      const productElement = cardElement.querySelector(
        `.${ROOT_CLASS}__product[data-product-index="${productIndex}"]`
      );
      const variantId = Number(
        productElement?.getAttribute("data-selected-variant-id") || 0
      );
      return variantId ? [variantId] : [];
    }

    return [];
  }

  function addVariantIdsToCart(variantIds) {
    const normalizedVariantIds = variantIds
      .map((variantId) => Number(variantId))
      .filter(Boolean);

    const items = normalizedVariantIds
      .map((id) => ({
        id,
        quantity: 1,
      }));

    if (!items.length) return Promise.resolve(null);

    if (window.$360?.addToCartMultiple) {
      return new Promise((resolve, reject) => {
        try {
          window.$360.addToCartMultiple(
            {
              products: normalizedVariantIds.map((id) => ({
                varId: String(id),
                qty: 1,
              })),
            },
            () => resolve(null)
          );
        } catch (error) {
          reject(error);
        }
      });
    }

    return fetch(`${window.Shopify.routes.root}cart/add.js`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text || "Failed to add upsell item to cart");
        });
      }

      return response.json();
    });
  }

  function refreshVisibleCartPage() {
    if (document.querySelector(".cart-page-wrapper") && window.$360?.refreshCartPage) {
      window.$360.refreshCartPage();
    }
  }

  function getPromoController() {
    if (typeof $360_gwp !== "undefined") {
      return $360_gwp;
    }

    return window.$360_gwp || null;
  }

  function clearCartLoadingState() {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        document.querySelectorAll(".header-cart-loading").forEach((element) => {
          element.classList.remove("active");
        });
        document.querySelector(".page-loading")?.classList.remove("active");
        getPromoController()?.removeCartLoading?.();
        window.$360?.adjustCartHeight?.();
        resolve();
      }, 80);
    });
  }

  function replaceScripts(container) {
    container.querySelectorAll("script").forEach((script) => {
      const newScript = document.createElement("script");

      Array.from(script.attributes).forEach((attribute) => {
        newScript.setAttribute(attribute.name, attribute.value);
      });

      newScript.textContent = script.textContent || "";
      script.parentNode?.replaceChild(newScript, script);
    });
  }

  function updateCartBadge(cart) {
    const itemCount = Number(cart?.item_count || 0);
    const currentCartNumber = document.querySelector(".header-cart-number");
    const currentCartCount = currentCartNumber?.querySelector(".cart-count");
    const currentNav = document.querySelector("ul.nav");

    if (currentCartCount) {
      currentCartCount.textContent = String(itemCount);
    }

    if (currentCartNumber) {
      currentCartNumber.classList.toggle("flex", itemCount > 0);
      currentCartNumber.classList.toggle("ml-5", itemCount > 0);
      currentCartNumber.classList.toggle("hide-m", itemCount === 0);
    }

    if (currentNav) {
      currentNav.classList.toggle("has-item", itemCount > 0);
    }
  }

  function updateCartObject(cart) {
    const currentCartObj = document.getElementById("cart_obj");
    if (currentCartObj) {
      currentCartObj.value = JSON.stringify(cart || {});
    }
  }

  function replaceDrawerMarkup(cartHtml) {
    const currentHeaderCart = document.getElementById("header-cart");
    if (!currentHeaderCart) return;

    currentHeaderCart.innerHTML = cartHtml;
    replaceScripts(currentHeaderCart);
  }

  function fallbackRefreshCartUi() {
    refreshVisibleCartPage();
    return clearCartLoadingState().then(() => {
      scheduleRender();
    });
  }

  function getCartSignature(cart) {
    return JSON.stringify(
      (cart?.items || []).map((item) => ({
        key: item.key,
        quantity: item.quantity,
        variantId: item.variant_id,
        properties: item.properties || null,
      }))
    );
  }

  function waitForCartChange(previousSignature, attemptsLeft = 5) {
    return fetchCart().then((cart) => {
      if (getCartSignature(cart) !== previousSignature || attemptsLeft <= 0) {
        return cart;
      }

      return new Promise((resolve) => {
        window.setTimeout(resolve, 450);
      }).then(() => waitForCartChange(previousSignature, attemptsLeft - 1));
    });
  }

  function applyCartPromotions() {
    const promoController = getPromoController();

    if (!promoController?.checkGWP) {
      return Promise.resolve();
    }

    return fetchCart()
      .then((cartBeforePromo) => {
        const previousSignature = getCartSignature(cartBeforePromo);

        try {
          promoController.checkGWP({ pull_drawer: false });
        } catch (error) {
          console.error("[A/B] Bundles & Routines Upsell promo check failed", error);
          return null;
        }

        return waitForCartChange(previousSignature);
      })
      .catch((error) => {
        console.error("[A/B] Bundles & Routines Upsell promo wait failed", error);
        return null;
      });
  }

  function refreshCartUi(prefetchedCart) {
    if (window.$360?.showHeaderCart) {
      return new Promise((resolve) => {
        let settled = false;

        const finish = () => {
          if (settled) return;
          settled = true;

          refreshVisibleCartPage();
          clearCartLoadingState().then(() => {
            scheduleRender();
            resolve(null);
          });
        };

        window.setTimeout(finish, 700);

        try {
          window.$360.showHeaderCart(
            { update: true, pull_drawer: false },
            finish
          );
        } catch (error) {
          console.error("[A/B] Bundles & Routines Upsell native cart refresh failed", error);
          finish();
        }
      });
    }

    const cartViewUrl = `${window.Shopify.routes.root}cart?view=json&_=${Date.now()}`;
    const cartJsonPromise =
      prefetchedCart != null && typeof prefetchedCart === "object"
        ? Promise.resolve(prefetchedCart)
        : fetchCart();

    return Promise.all([
      fetch(cartViewUrl, {
        credentials: "same-origin",
        headers: {
          Accept: "text/html",
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to refresh cart drawer");
        }

        return response.text();
      }),
      cartJsonPromise,
    ])
      .then(([cartHtml, cart]) => {
        replaceDrawerMarkup(cartHtml);
        updateCartBadge(cart);
        updateCartObject(cart);
        refreshVisibleCartPage();
        return clearCartLoadingState().then(() => {
          scheduleRender();
          return cart;
        });
      })
      .catch((error) => {
        return fallbackRefreshCartUi().then(() => {
          throw error;
        });
      });
  }

  function handleCardButtonClick(button) {
    const variantIds = getVariantIdsForCard(button);
    if (!variantIds.length) return;

    setButtonLoading(button, true);

    const safetyTimeoutId = window.setTimeout(() => {
      clearCartLoadingState().finally(() => {
        setButtonLoading(button, false);
      });
    }, 5000);

    addVariantIdsToCart(variantIds)
      .then(() => applyCartPromotions())
      .then((cartAfterPromo) => refreshCartUi(cartAfterPromo))
      .catch((error) => {
        console.error("[A/B] Bundles & Routines Upsell add failed", error);
      })
      .finally(() => {
        window.clearTimeout(safetyTimeoutId);
        setButtonLoading(button, false);
      });
  }

  function handleRootClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const variantOption = target.closest(`.${ROOT_CLASS}__variant-option`);
    if (variantOption) {
      updateSelectedVariant(variantOption);
      return;
    }

    const button = target.closest(`.${ROOT_CLASS}__button`);
    if (button instanceof HTMLButtonElement) {
      handleCardButtonClick(button);
    }
  }

  function render() {
    if (renderInFlight) return;

    const mount = getDrawerMount();
    if (!mount) return;

    renderInFlight = true;

    fetchCart()
      .then((cart) => {
        if (!cart?.items?.length) {
          removeExistingRoot(mount);
          return [];
        }

        return buildEligibleCards(cart);
      })
      .then((cards) => {
        renderCards(mount, cards || []);
      })
      .finally(() => {
        renderInFlight = false;
      });
  }

  function scheduleRender() {
    if (renderQueued) return;
    renderQueued = true;

    window.setTimeout(() => {
      renderQueued = false;
      render();
    }, 120);
  }

  function observeDrawer() {
    const drawer = document.getElementById("header-cart");
    if (!drawer) {
      window.setTimeout(observeDrawer, 150);
      return;
    }

    const observer = new MutationObserver((mutations) => {
      const hasExternalChange = mutations.some((mutation) => {
        const target = mutation.target;
        return !(target instanceof Element) || !target.closest(`.${ROOT_CLASS}`);
      });

      if (!hasExternalChange) return;

      if (!renderInFlight) scheduleRender();
    });

    observer.observe(drawer, {
      childList: true,
      subtree: true,
    });

    scheduleRender();
  }

  function init() {
    if (window.abBundlesRoutinesUpsellApplied) return;
    window.abBundlesRoutinesUpsellApplied = true;

    addStyles();
    document.addEventListener("click", handleRootClick);
    observeDrawer();
  }

  api.init = init;
  window.abBundlesRoutinesUpsell = api;
})();

