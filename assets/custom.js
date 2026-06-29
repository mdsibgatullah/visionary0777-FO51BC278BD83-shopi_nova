/*
* Broadcast Theme
*
* Use this file to add custom Javascript to Broadcast.  Keeping your custom
* Javascript in this fill will make it easier to update Broadcast. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*/


(function() {
  // Add custom code below this line

  const enableProductSwatchDebug = true;

  if (enableProductSwatchDebug) {
    const selectors = {
      gridItem: '[data-grid-item]',
      gridSwatch: 'grid-swatch',
      swatchButton: '[data-swatch-button]',
      swatchLink: '[data-swatch-link]',
      swatchText: '[data-swatch-text]',
      siblingSwatch: '[data-sibling-link]',
      productImage: '[data-product-image]',
      productImageDefault: '[data-product-image-default]',
      productLink: '[data-product-link]',
      variantImage: '[data-variant-title]',
      visibleVariantImage: '[data-variant-title].is-visible',
    };

    const logPrefix = '[Product swatch debug]';
    const cssEscape = (value) => {
      if (window.CSS && typeof window.CSS.escape === 'function') {
        return window.CSS.escape(value);
      }

      return String(value).replace(/["\\]/g, '\\$&');
    };
    const getUrlWithVariant = (url, variantId) => {
      if (!url || !variantId) return url;

      if (/variant=/.test(url)) {
        return url.replace(/(variant=)[^&]+/, `$1${variantId}`);
      }

      if (/\?/.test(url)) {
        return `${url}&variant=${variantId}`;
      }

      return `${url}?variant=${variantId}`;
    };

    const getSwatchDebugData = (swatchButton) => {
      const swatchLink = swatchButton.querySelector(selectors.swatchLink);
      const swatchText = swatchButton.querySelector(selectors.swatchText);

      return {
        label: swatchText ? swatchText.textContent.trim() : swatchLink ? swatchLink.dataset.swatch : null,
        variantId: swatchButton.getAttribute('data-swatch-variant'),
        variantName: swatchButton.getAttribute('data-swatch-variant-name'),
        swatchImage: swatchButton.getAttribute('data-swatch-image'),
        swatchStyle: swatchButton.style.getPropertyValue('--swatch'),
        tooltip: swatchButton.getAttribute('data-tooltip'),
      };
    };

    const getCardDebugData = (card) => {
      if (!card) return {};

      const productLink = card.querySelector('[data-product-link]');
      const gridSwatch = card.querySelector(selectors.gridSwatch);

      return {
        productId: card.id || null,
        productUrl: productLink ? productLink.getAttribute('href') : null,
        swatchHandle: gridSwatch ? gridSwatch.getAttribute('data-swatch-handle') : null,
        swatchLabel: gridSwatch ? gridSwatch.getAttribute('data-swatch-label') : null,
      };
    };

    const logVariantPreview = (swatchButton, eventName) => {
      const card = swatchButton.closest(selectors.gridItem);
      const productImage = card ? card.querySelector(selectors.productImage) : null;
      const variantName = swatchButton.getAttribute('data-swatch-variant-name');
      const variantImages = productImage ? productImage.querySelectorAll(selectors.variantImage) : [];
      const selectedVariantImage = productImage && variantName
        ? productImage.querySelector(`[data-variant-title="${cssEscape(variantName)}"]`)
        : null;
      const swatchData = getSwatchDebugData(swatchButton);

      console.groupCollapsed(`${logPrefix} ${eventName}`);
      console.log('Product card:', getCardDebugData(card));
      console.log('Swatch:', swatchData);
      console.log('Variant image lookup:', {
        totalVariantImages: variantImages.length,
        selectedByTitle: selectedVariantImage,
        selectedColorHandle: selectedVariantImage ? selectedVariantImage.getAttribute('data-variant-color') : null,
      });
      console.groupEnd();

      requestAnimationFrame(() => {
        const visibleImages = productImage ? productImage.querySelectorAll(selectors.visibleVariantImage) : [];
        console.log(`${logPrefix} visible variant images after hover:`, [...visibleImages].map((image) => ({
          variantTitle: image.getAttribute('data-variant-title'),
          variantColor: image.getAttribute('data-variant-color'),
        })));
      });
    };

    const applySwatchImageToProductCard = (swatchButton) => {
      const card = swatchButton.closest(selectors.gridItem);
      const swatchData = getSwatchDebugData(swatchButton);

      if (!card || !swatchData.swatchImage) return;

      const productImageDefault = card.querySelector(selectors.productImageDefault);
      const mainImage = productImageDefault ? productImageDefault.querySelector('img') : null;
      const variantImages = card.querySelectorAll(selectors.variantImage);
      const productLinks = card.querySelectorAll(selectors.productLink);

      variantImages.forEach((image) => {
        image.classList.remove('is-visible');
      });

      if (mainImage) {
        if (!mainImage.dataset.originalSrc) {
          mainImage.dataset.originalSrc = mainImage.getAttribute('src') || '';
          mainImage.dataset.originalSrcset = mainImage.getAttribute('srcset') || '';
          mainImage.dataset.originalSizes = mainImage.getAttribute('sizes') || '';
          mainImage.dataset.originalAlt = mainImage.getAttribute('alt') || '';
        }

        mainImage.setAttribute('src', swatchData.swatchImage);
        mainImage.removeAttribute('srcset');
        mainImage.removeAttribute('sizes');
        mainImage.setAttribute('alt', swatchData.label || swatchData.variantName || mainImage.dataset.originalAlt);
      }

      productLinks.forEach((productLink) => {
        if (!productLink.dataset.originalProductLink) {
          productLink.dataset.originalProductLink = productLink.getAttribute('href') || productLink.getAttribute('data-product-link') || '';
        }

        const variantUrl = getUrlWithVariant(productLink.dataset.originalProductLink, swatchData.variantId);
        productLink.setAttribute('href', variantUrl);
        productLink.setAttribute('data-product-link', variantUrl);
      });

      card.querySelectorAll(selectors.swatchButton).forEach((button) => {
        button.classList.toggle('is-active', button === swatchButton);
      });

      console.groupCollapsed(`${logPrefix} grid swatch click applied`);
      console.log('Product card:', getCardDebugData(card));
      console.log('Swatch applied:', swatchData);
      console.log('Main image updated from data-swatch-image:', mainImage);
      console.groupEnd();
    };

    const logSiblingPreview = (siblingSwatch) => {
      const card = siblingSwatch.closest(selectors.gridItem);

      console.groupCollapsed(`${logPrefix} sibling swatch hover`);
      console.log('Product card:', getCardDebugData(card));
      console.log('Sibling swatch:', {
        link: siblingSwatch.getAttribute('data-sibling-link'),
        price: siblingSwatch.getAttribute('data-sibling-price'),
        cutline: siblingSwatch.getAttribute('data-sibling-cutline'),
        image: siblingSwatch.getAttribute('data-sibling-image'),
        tooltip: siblingSwatch.getAttribute('data-tooltip'),
      });
      console.groupEnd();
    };

    console.log(`${logPrefix} enabled`);

    document.addEventListener('click', (event) => {
      const swatchButton = event.target.closest(selectors.swatchButton);
      const siblingSwatch = event.target.closest(selectors.siblingSwatch);

      if (swatchButton) {
        event.preventDefault();
        applySwatchImageToProductCard(swatchButton);
        logVariantPreview(swatchButton, 'grid swatch click');
      }

      if (siblingSwatch) {
        logSiblingPreview(siblingSwatch);
      }
    });

    document.addEventListener('mouseout', (event) => {
      const card = event.target.closest(selectors.gridItem);

      if (!card || card.contains(event.relatedTarget)) return;

      console.log(`${logPrefix} product card mouseleave reset`, getCardDebugData(card));
    });
  }

  const alreadySelectedProductSwatches = new WeakSet();

  document.addEventListener('pointerdown', (event) => {
    const productSection = event.target.closest('[data-section-type="product"]');
    const swatch = event.target.closest('radio-swatch');

    if (!productSection || !swatch) return;

    const input = swatch.querySelector('[data-single-option-selector]');

    if (input && input.checked) {
      alreadySelectedProductSwatches.add(input);
    }
  }, true);

  document.addEventListener('click', (event) => {
    const productSection = event.target.closest('[data-section-type="product"]');
    const swatch = event.target.closest('radio-swatch');

    if (!productSection || !swatch) return;

    const input = swatch.querySelector('[data-single-option-selector]');

    if (!input || !alreadySelectedProductSwatches.has(input)) return;

    alreadySelectedProductSwatches.delete(input);

    setTimeout(() => {
      input.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('[Product swatch debug] selected PDP swatch clicked, variant image update forced', {
        option: input.name,
        value: input.value,
      });
    }, 0);
  }, true);




  // ^^ Keep your scripts inside this IIFE function call to 
  // avoid leaking your variables into the global scope.
})();
