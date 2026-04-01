// [A/B] Bundles & Routines Upsell

(() => {
  if (window.abBundlesRoutinesUpsellApplied) return;
  window.abBundlesRoutinesUpsellApplied = true;

  const STYLE_ID = "ab-bundles-routines-upsell-style";
  const ROOT_CLASS = "ab-bundles-upsell-root";
  const DISCOUNT_RATE = 0.15;

  const PRODUCT_HANDLES = {
    serum:         "professional-serum-5ml-us",
    mac:           "multi-action-cream-us",
    rhc:           "restorative-hydration-cream-us",
    eye:           "eye-contour-lifting-cream-15ml",
    rnc:           "recovery-night-complex-us",
    starterBundle: "starter-bundle-kit-us",
    starterMac:    "multi-action-cream-us",
    starterRhc:    "restorative-hydration-cream-us",
  };

  const STARTER_VARIANT_KEYWORDS = {
    starterMac: ["20g", "starter"],
    starterRhc: ["20g", "starter"],
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
      "multi-action-cream-50g-sg",
      "multi-action-cream-sale",
    ],
    rhc: [
      "restorative-hydration-cream",
      "restorative-hydration-cream-us",
      "restorative-hydration-cream-50g-sg",
      "restorative-hydration-cream-sale",
    ],
    eye: [
      "eye-contour-lifting-cream-15ml",
      "eye-contour-lifting-cream-15g",
      "eye-contour-lifting-cream",
      "eye-contour-lifting-cream-us",
      "eye-contour-lifting-cream-sg",
      "eye-contour-lifting-cream-sale",
    ],
    rnc: [
      "recovery-night-complex",
      "recovery-night-complex-us",
      "recovery-night-complex-5-x-3g-sachet",
      "recovery-night-complex-60g-sg",
      "recovery-night-complex-sale",
    ],
    // Starter sizes share the same product handle as full-size MAC/RHC.
    // They are identified by variant title fragment instead — see hasStarterCartItem().
    starterMac: {
      handles: ["multi-action-cream-us", "multi-action-cream-20g", "multi-action-cream-20g-starter-size-kit-us"],
      variantTitles: ["20g", "starter"],
    },
    starterRhc: {
      handles: ["restorative-hydration-cream-us", "restorative-hydration-cream-20g", "restorative-hydration-cream-20g-starter-size-kit-us"],
      variantTitles: ["20g", "starter"],
    },
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
  let suppressObserver = false;

  // ---------------------------------------------------------------------------
  // Styles
  // ---------------------------------------------------------------------------

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = CSS;
    document.head.appendChild(style);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

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

  function hasStarterCartItem(items, def) {
    return items.some((item) => {
      const handle = normaliseHandle(item.handle);
      if (!def.handles.includes(handle)) return false;
      const title = String(item.variant_title || "").toLowerCase();
      return def.variantTitles.some((keyword) => title.includes(keyword));
    });
  }

  function cartHasSubscription(items) {
    return items.some((item) => item.selling_plan_allocation != null);
  }

  function getFirstAvailableVariant(product) {
    if (!product?.variants?.length) return null;
    return product.variants.find((v) => v.available) || product.variants[0];
  }

  function getVariantById(product, variantId) {
    if (!product?.variants?.length || !variantId) return null;
    return product.variants.find((v) => Number(v.id) === Number(variantId)) || null;
  }

  function getVariantLabel(variant) {
    const label = String(variant?.title || "").trim();
    if (!label || label.toLowerCase() === "default title") return "";
    return label;
  }

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  function fetchProduct(handle, attempt) {
    if (!handle) return Promise.resolve(null);

    if (productCache[handle]) return productCache[handle];

    const attemptNumber = attempt || 1;

    productCache[handle] = fetch(
      `${window.Shopify.routes.root}products/${handle}.js`,
      { credentials: "same-origin" }
    )
      .then((response) => {
        if (response.status === 404) {
          console.warn("[A/B] Upsell: product not found:", handle);
          return null;
        }
        if (!response.ok) throw new Error(`Failed to load ${handle}: ${response.status}`);
        return response.json();
      })
      .catch((err) => {
        delete productCache[handle];
        if (attemptNumber < 3) {
          const delay = 300 * attemptNumber;
          return new Promise((resolve) => window.setTimeout(resolve, delay))
            .then(() => fetchProduct(handle, attemptNumber + 1));
        }
        console.warn("[A/B] Upsell: product fetch failed after retries:", handle, err);
        return null;
      });

    return productCache[handle];
  }

  let cartJsFetchInFlight = null;

  function fetchCart() {
    if (cartJsFetchInFlight) return cartJsFetchInFlight;

    const url = `${window.Shopify.routes.root}cart.js`;

    function attemptFetch(retryIndex) {
      return fetch(url, { credentials: "same-origin" }).then((response) => {
        if (response.status === 429 && retryIndex < 3) {
          const delayMs = 700 * Math.pow(2, retryIndex);
          return new Promise((resolve) => window.setTimeout(resolve, delayMs))
            .then(() => attemptFetch(retryIndex + 1));
        }
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || `cart.js ${response.status}`);
          });
        }
        return response.json();
      });
    }

    cartJsFetchInFlight = attemptFetch(0)
      .catch((err) => {
        console.warn("Cart fetch error:", err);
        return { items: [] };
      })
      .finally(() => {
        cartJsFetchInFlight = null;
      });

    return cartJsFetchInFlight;
  }

  // ---------------------------------------------------------------------------
  // Card building
  // ---------------------------------------------------------------------------

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

  function getStarterVariant(product, keywords) {
    if (!product?.variants?.length || !keywords?.length) return null;
    return product.variants.find((v) => {
      const title = String(v.title || "").toLowerCase();
      return keywords.some((kw) => title.includes(kw));
    }) || null;
  }

  function buildComboCard(id, triggerProduct, missingProduct, options) {
    if (!triggerProduct) { console.warn("[A/B] Upsell: trigger product not found for combo", id); return null; }
    if (!missingProduct) { console.warn("[A/B] Upsell: missing product not found for combo", id); return null; }
    const triggerVariant =
      (options?.triggerKeywords && getStarterVariant(triggerProduct, options.triggerKeywords)) ||
      getFirstAvailableVariant(triggerProduct);
    const missingVariant =
      (options?.missingKeywords && getStarterVariant(missingProduct, options.missingKeywords)) ||
      getFirstAvailableVariant(missingProduct);

    if (!triggerVariant || !missingVariant) return null;

    const normalTotal =
      Number(triggerVariant.price || 0) + Number(missingVariant.price || 0);
    const discountedTotal = Math.round(normalTotal * (1 - DISCOUNT_RATE));

    return createButtonCardData({
      id,
      action: "add-missing",
      products: [triggerProduct, missingProduct],
      selectedVariantIds: [triggerVariant.id, missingVariant.id],
      variantProductIndex: null,
      missingVariantId: missingVariant.id,
      priceLabel: money(discountedTotal),
      compareLabel: money(normalTotal),
    });
  }

  function buildEligibleCards(cart) {
    const items = cart.items || [];

    if (cartHasSubscription(items)) return Promise.resolve([]);

    const hasSerum         = hasCartItem(items, HANDLE_ALIASES.serum);
    const hasStarterMac    = hasStarterCartItem(items, HANDLE_ALIASES.starterMac);
    const hasStarterRhc    = hasStarterCartItem(items, HANDLE_ALIASES.starterRhc);
    const hasMac           = !hasStarterMac && hasCartItem(items, HANDLE_ALIASES.mac);
    const hasRhc           = !hasStarterRhc && hasCartItem(items, HANDLE_ALIASES.rhc);
    const hasEye           = hasCartItem(items, HANDLE_ALIASES.eye);
    const hasStarterBundle = hasCartItem(items, HANDLE_ALIASES.starterBundle);

    const hasBundledPair =
      (hasSerum && hasMac) ||
      (hasEye   && hasSerum) ||
      (hasRhc   && hasSerum) ||
      (hasStarterMac && hasStarterRhc);

    if (hasStarterBundle || hasBundledPair) return Promise.resolve([]);

    const combos = [
      {
        condition:     hasStarterMac && !hasStarterRhc,
        id:            "startermac-starterrhc",
        triggerHandle: PRODUCT_HANDLES.starterMac,
        missingHandle: PRODUCT_HANDLES.starterRhc,
        triggerKeywords: STARTER_VARIANT_KEYWORDS.starterMac,
        missingKeywords: STARTER_VARIANT_KEYWORDS.starterRhc,
      },
      {
        condition:     hasStarterRhc && !hasStarterMac,
        id:            "starterrhc-startermac",
        triggerHandle: PRODUCT_HANDLES.starterRhc,
        missingHandle: PRODUCT_HANDLES.starterMac,
        triggerKeywords: STARTER_VARIANT_KEYWORDS.starterRhc,
        missingKeywords: STARTER_VARIANT_KEYWORDS.starterMac,
      },
      {
        condition:     hasSerum && !hasMac && !hasStarterMac,
        id:            "serum-mac",
        triggerHandle: PRODUCT_HANDLES.serum,
        missingHandle: PRODUCT_HANDLES.mac,
      },
      {
        condition:     hasMac && !hasSerum && !hasStarterMac,
        id:            "mac-serum",
        triggerHandle: PRODUCT_HANDLES.mac,
        missingHandle: PRODUCT_HANDLES.serum,
      },
      {
        condition:     hasEye && !hasSerum,
        id:            "eye-serum",
        triggerHandle: PRODUCT_HANDLES.eye,
        missingHandle: PRODUCT_HANDLES.serum,
      },
      {
        condition:     hasRhc && !hasSerum && !hasStarterRhc,
        id:            "rhc-serum",
        triggerHandle: PRODUCT_HANDLES.rhc,
        missingHandle: PRODUCT_HANDLES.serum,
      },
    ];

    const eligible = combos.filter((c) => c.condition);
    if (!eligible.length) return Promise.resolve([]);

    const first = eligible[0];

    return Promise.all([
      fetchProduct(first.triggerHandle),
      fetchProduct(first.missingHandle),
    ]).then(([triggerProduct, missingProduct]) => {
      const card = buildComboCard(first.id, triggerProduct, missingProduct, {
        triggerKeywords: first.triggerKeywords || null,
        missingKeywords: first.missingKeywords || null,
      });
      return card ? [card] : [];
    });
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------


  function resizedImageUrl(url, size) {
    if (!url) return url;
    return url.replace(/(\.[^.?]+)(\?|$)/, `_${size}x$1$2`);
  }

  function renderProduct(product, options) {
    const selectedVariantId = options?.selectedVariantId;
    const productIndex      = options?.productIndex;
    const variant =
      getVariantById(product, selectedVariantId) || getFirstAvailableVariant(product);
    if (!product || !variant) return "";

    const variantLabel  = getVariantLabel(variant);
    const variantMarkup = variantLabel
      ? `<div class="${ROOT_CLASS}__product-variant">${escapeHtml(variantLabel)}</div>`
      : "";

    return `
      <div
        class="${ROOT_CLASS}__product"
        data-product-index="${escapeHtml(productIndex)}"
        data-selected-variant-id="${escapeHtml(variant.id)}"
        data-selected-price="${escapeHtml(Number(variant.price || 0))}"
      >
        <div class="${ROOT_CLASS}__product-image">
          ${product.featured_image
            ? `<img src="${escapeHtml(resizedImageUrl(product.featured_image, 240))}" alt="${escapeHtml(product.title)}" loading="lazy" width="240" height="240">`
            : ""}
        </div>
        <div class="${ROOT_CLASS}__product-title">${escapeHtml(product.title)}</div>
        ${variantMarkup}
      </div>
    `;
  }

  function renderCard(card) {
    return `
      <div class="${ROOT_CLASS}__card" data-card-id="${escapeHtml(card.id)}">
        <div class="${ROOT_CLASS}__visuals">
          ${renderProduct(card.products[0], {
            productIndex: 0,
            selectedVariantId: card.selectedVariantIds?.[0],
          })}
          <div class="${ROOT_CLASS}__plus" aria-hidden="true">+</div>
          ${renderProduct(card.products[1], {
            productIndex: 1,
            selectedVariantId: card.selectedVariantIds?.[1],
          })}
        </div>
        <button
          type="button"
          class="${ROOT_CLASS}__button"
          data-action="${escapeHtml(card.action || "")}"
        >
          <span class="${ROOT_CLASS}__button-label">${escapeHtml(card.buttonLabel)}</span>
          ${card.priceLabel   ? `<span class="${ROOT_CLASS}__price">${escapeHtml(card.priceLabel)}</span>`     : ""}
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

  // ---------------------------------------------------------------------------
  // Interaction
  // ---------------------------------------------------------------------------

  function setButtonLoading(button, isLoading) {
    if (!(button instanceof HTMLButtonElement)) return;
    button.disabled = isLoading;
    button.setAttribute("aria-busy", String(isLoading));
  }

  function getVariantIdsForCard(button) {
    const cardElement = button.closest(`.${ROOT_CLASS}__card`);
    if (!cardElement) return [];

    const missingProductElement = cardElement.querySelector(
      `.${ROOT_CLASS}__product[data-product-index="1"]`
    );
    const variantId = Number(
      missingProductElement?.getAttribute("data-selected-variant-id") || 0
    );
    return variantId ? [variantId] : [];
  }

  // ---------------------------------------------------------------------------
  // Cart mutation
  // ---------------------------------------------------------------------------

  function addVariantIdsToCart(variantIds) {
    const normalizedIds = variantIds.map(Number).filter(Boolean);
    const items = normalizedIds.map((id) => ({ id, quantity: 1 }));
    if (!items.length) return Promise.resolve(null);

    if (window.$360?.addToCartMultiple) {
      return new Promise((resolve, reject) => {
        try {
          window.$360.addToCartMultiple(
            { products: normalizedIds.map((id) => ({ varId: String(id), qty: 1 })) },
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

  // ---------------------------------------------------------------------------
  // Cart UI refresh
  // ---------------------------------------------------------------------------

  function refreshVisibleCartPage() {
    if (document.querySelector(".cart-page-wrapper") && window.$360?.refreshCartPage) {
      window.$360.refreshCartPage();
    }
  }

  function getPromoController() {
    if (typeof $360_gwp !== "undefined") return $360_gwp;
    return window.$360_gwp || null;
  }

  function clearCartLoadingState() {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        document.querySelectorAll(".header-cart-loading").forEach((el) => {
          el.classList.remove("active");
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
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = script.textContent || "";
      script.parentNode?.replaceChild(newScript, script);
    });
  }

  function updateCartBadge(cart) {
    const itemCount  = Number(cart?.item_count || 0);
    const cartNumber = document.querySelector(".header-cart-number");
    const cartCount  = cartNumber?.querySelector(".cart-count");
    const nav        = document.querySelector("ul.nav");

    if (cartCount)  cartCount.textContent = String(itemCount);
    if (cartNumber) {
      cartNumber.classList.toggle("flex",   itemCount > 0);
      cartNumber.classList.toggle("ml-5",   itemCount > 0);
      cartNumber.classList.toggle("hide-m", itemCount === 0);
    }
    if (nav) nav.classList.toggle("has-item", itemCount > 0);
  }

  function updateCartObject(cart) {
    const cartObj = document.getElementById("cart_obj");
    if (cartObj) cartObj.value = JSON.stringify(cart || {});
  }

  function replaceDrawerMarkup(cartHtml) {
    const headerCart = document.getElementById("header-cart");
    if (!headerCart) return;
    headerCart.innerHTML = cartHtml;
    replaceScripts(headerCart);
  }

  function fallbackRefreshCartUi() {
    refreshVisibleCartPage();
    return clearCartLoadingState();
  }

  function getCartSignature(cart) {
    return JSON.stringify(
      (cart?.items || []).map((item) => ({
        key:        item.key,
        quantity:   item.quantity,
        variantId:  item.variant_id,
        properties: item.properties || null,
      }))
    );
  }

  function waitForCartChange(previousSignature, attemptsLeft = 5) {
    return fetchCart().then((cart) => {
      if (getCartSignature(cart) !== previousSignature || attemptsLeft <= 0) {
        return cart;
      }
      return new Promise((resolve) => window.setTimeout(resolve, 450))
        .then(() => waitForCartChange(previousSignature, attemptsLeft - 1));
    });
  }

  function applyCartPromotions() {
    const promoController = getPromoController();
    if (!promoController?.checkGWP) return Promise.resolve();

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
          clearCartLoadingState().then(() => resolve(null));
        };

        window.setTimeout(finish, 700);

        try {
          window.$360.showHeaderCart({ update: true, pull_drawer: false }, finish);
        } catch (error) {
          console.error("[A/B] Bundles & Routines Upsell native cart refresh failed", error);
          finish();
        }
      });
    }

    const cartViewUrl     = `${window.Shopify.routes.root}cart?view=json&_=${Date.now()}`;
    const cartJsonPromise =
      prefetchedCart != null && typeof prefetchedCart === "object"
        ? Promise.resolve(prefetchedCart)
        : fetchCart();

    return Promise.all([
      fetch(cartViewUrl, {
        credentials: "same-origin",
        headers: { Accept: "text/html" },
      }).then((response) => {
        if (!response.ok) throw new Error("Failed to refresh cart drawer");
        return response.text();
      }),
      cartJsonPromise,
    ])
      .then(([cartHtml, cart]) => {
        replaceDrawerMarkup(cartHtml);
        updateCartBadge(cart);
        updateCartObject(cart);
        refreshVisibleCartPage();
        return clearCartLoadingState().then(() => cart);
      })
      .catch((error) => {
        return fallbackRefreshCartUi().then(() => { throw error; });
      });
  }

  // ---------------------------------------------------------------------------
  // Click handling
  // ---------------------------------------------------------------------------

  function handleCardButtonClick(button) {
    const variantIds = getVariantIdsForCard(button);
    if (!variantIds.length) return;

    setButtonLoading(button, true);
    suppressObserver = true;

    const safetyTimeoutId = window.setTimeout(() => {
      suppressObserver = false;
      clearCartLoadingState().finally(() => {
        setButtonLoading(button, false);
        scheduleRender();
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
        suppressObserver = false;
        scheduleRender();
      });
  }

  function handleRootClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest(`.${ROOT_CLASS}__button`);
    if (button instanceof HTMLButtonElement) {
      handleCardButtonClick(button);
    }
  }

  // ---------------------------------------------------------------------------
  // Render loop
  // ---------------------------------------------------------------------------

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
      if (suppressObserver) return;

      const hasExternalChange = mutations.some((mutation) => {
        const target = mutation.target;
        return !(target instanceof Element) || !target.closest(`.${ROOT_CLASS}`);
      });

      if (!hasExternalChange) return;
      if (!renderInFlight) scheduleRender();
    });

    observer.observe(drawer, { childList: true, subtree: true });
    scheduleRender();
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------

  function init() {
    addStyles();
    document.addEventListener("click", handleRootClick);
    observeDrawer();
  }

  init();
})();
