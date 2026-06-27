/*
 * Broadcast Theme
 *
 * Use this file to add custom Javascript to Broadcast.  Keeping your custom
 * Javascript in this fill will make it easier to update Broadcast. In order
 * to use this file you will need to open layout/theme.liquid and uncomment
 * the custom.js script import line near the bottom of the file.
 */

(function () {
	// Add custom code below this line

	const enableProductSwatchDebug = true;

	if (enableProductSwatchDebug) {
		const selectors = {
			gridItem: "[data-grid-item]",
			gridSwatch: "grid-swatch",
			swatchButton: "[data-swatch-button]",
			swatchLink: "[data-swatch-link]",
			swatchText: "[data-swatch-text]",
			siblingSwatch: "[data-sibling-link]",
			productImage: "[data-product-image]",
			productImageDefault: "[data-product-image-default]",
			productLink: "[data-product-link]",
			variantImage: "[data-variant-title]",
			visibleVariantImage: "[data-variant-title].is-visible",
		};

		const logPrefix = "[Product swatch debug]";
		const cssEscape = (value) => {
			if (window.CSS && typeof window.CSS.escape === "function") {
				return window.CSS.escape(value);
			}

			return String(value).replace(/["\\]/g, "\\$&");
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
				label: swatchText
					? swatchText.textContent.trim()
					: swatchLink
						? swatchLink.dataset.swatch
						: null,
				variantId: swatchButton.getAttribute("data-swatch-variant"),
				variantName: swatchButton.getAttribute(
					"data-swatch-variant-name",
				),
				swatchImage: swatchButton.getAttribute("data-swatch-image"),
				swatchStyle: swatchButton.style.getPropertyValue("--swatch"),
				tooltip: swatchButton.getAttribute("data-tooltip"),
			};
		};

		const getCardDebugData = (card) => {
			if (!card) return {};

			const productLink = card.querySelector("[data-product-link]");
			const gridSwatch = card.querySelector(selectors.gridSwatch);

			return {
				productId: card.id || null,
				productUrl: productLink
					? productLink.getAttribute("href")
					: null,
				swatchHandle: gridSwatch
					? gridSwatch.getAttribute("data-swatch-handle")
					: null,
				swatchLabel: gridSwatch
					? gridSwatch.getAttribute("data-swatch-label")
					: null,
			};
		};

		const logVariantPreview = (swatchButton, eventName) => {
			const card = swatchButton.closest(selectors.gridItem);
			const productImage = card
				? card.querySelector(selectors.productImage)
				: null;
			const variantName = swatchButton.getAttribute(
				"data-swatch-variant-name",
			);
			const variantImages = productImage
				? productImage.querySelectorAll(selectors.variantImage)
				: [];
			const selectedVariantImage =
				productImage && variantName
					? productImage.querySelector(
							`[data-variant-title="${cssEscape(variantName)}"]`,
						)
					: null;
			const swatchData = getSwatchDebugData(swatchButton);

			console.groupCollapsed(`${logPrefix} ${eventName}`);
			console.log("Product card:", getCardDebugData(card));
			console.log("Swatch:", swatchData);
			console.log("Variant image lookup:", {
				totalVariantImages: variantImages.length,
				selectedByTitle: selectedVariantImage,
				selectedColorHandle: selectedVariantImage
					? selectedVariantImage.getAttribute("data-variant-color")
					: null,
			});
			console.groupEnd();

			requestAnimationFrame(() => {
				const visibleImages = productImage
					? productImage.querySelectorAll(
							selectors.visibleVariantImage,
						)
					: [];
				console.log(
					`${logPrefix} visible variant images after hover:`,
					[...visibleImages].map((image) => ({
						variantTitle: image.getAttribute("data-variant-title"),
						variantColor: image.getAttribute("data-variant-color"),
					})),
				);
			});
		};

		const applySwatchImageToProductCard = (swatchButton) => {
			const card = swatchButton.closest(selectors.gridItem);
			const swatchData = getSwatchDebugData(swatchButton);

			if (!card || !swatchData.swatchImage) return;

			const productImageDefault = card.querySelector(
				selectors.productImageDefault,
			);
			const mainImage = productImageDefault
				? productImageDefault.querySelector("img")
				: null;
			const variantImages = card.querySelectorAll(selectors.variantImage);
			const productLinks = card.querySelectorAll(selectors.productLink);

			variantImages.forEach((image) => {
				image.classList.remove("is-visible");
			});

			if (mainImage) {
				if (!mainImage.dataset.originalSrc) {
					mainImage.dataset.originalSrc =
						mainImage.getAttribute("src") || "";
					mainImage.dataset.originalSrcset =
						mainImage.getAttribute("srcset") || "";
					mainImage.dataset.originalSizes =
						mainImage.getAttribute("sizes") || "";
					mainImage.dataset.originalAlt =
						mainImage.getAttribute("alt") || "";
				}

				mainImage.setAttribute("src", swatchData.swatchImage);
				mainImage.removeAttribute("srcset");
				mainImage.removeAttribute("sizes");
				mainImage.setAttribute(
					"alt",
					swatchData.label ||
						swatchData.variantName ||
						mainImage.dataset.originalAlt,
				);
			}

			productLinks.forEach((productLink) => {
				if (!productLink.dataset.originalProductLink) {
					productLink.dataset.originalProductLink =
						productLink.getAttribute("href") ||
						productLink.getAttribute("data-product-link") ||
						"";
				}

				const variantUrl = getUrlWithVariant(
					productLink.dataset.originalProductLink,
					swatchData.variantId,
				);
				productLink.setAttribute("href", variantUrl);
				productLink.setAttribute("data-product-link", variantUrl);
			});

			card.querySelectorAll(selectors.swatchButton).forEach((button) => {
				button.classList.toggle("is-active", button === swatchButton);
			});

			console.groupCollapsed(`${logPrefix} grid swatch click applied`);
			console.log("Product card:", getCardDebugData(card));
			console.log("Swatch applied:", swatchData);
			console.log(
				"Main image updated from data-swatch-image:",
				mainImage,
			);
			console.groupEnd();
		};

		const logSiblingPreview = (siblingSwatch) => {
			const card = siblingSwatch.closest(selectors.gridItem);

			console.groupCollapsed(`${logPrefix} sibling swatch hover`);
			console.log("Product card:", getCardDebugData(card));
			console.log("Sibling swatch:", {
				link: siblingSwatch.getAttribute("data-sibling-link"),
				price: siblingSwatch.getAttribute("data-sibling-price"),
				cutline: siblingSwatch.getAttribute("data-sibling-cutline"),
				image: siblingSwatch.getAttribute("data-sibling-image"),
				tooltip: siblingSwatch.getAttribute("data-tooltip"),
			});
			console.groupEnd();
		};

		console.log(`${logPrefix} enabled`);

		// Shared helper: show the variant image and update the product card.
		const switchSwatchImage = (swatchButton, eventName) => {
			// Run the src-update approach first; it also removes all is-visible.
			applySwatchImageToProductCard(swatchButton);

			const card = swatchButton.closest(selectors.gridItem);
			const productImage = card?.querySelector(selectors.productImage);
			const variantName = swatchButton
				.getAttribute("data-swatch-variant-name")
				?.replaceAll('"', "'");

			if (productImage && variantName) {
				// Reset z-index on all overlays (in case a previous tap set one).
				productImage
					.querySelectorAll(selectors.variantImage)
					.forEach((img) => {
						img.style.zIndex = "";
					});

				const variantImageSelected = productImage.querySelector(
					`[data-variant-title="${variantName}"]`,
				);
				if (variantImageSelected) {
					// z-index: 2 places the overlay above hover-images (z-index: 1),
					// which is visible on touch/mobile devices and would otherwise
					// cover this overlay entirely.
					variantImageSelected.style.zIndex = "2";
					// Bypass the CSS fade-in transition so the overlay appears
					// at full opacity instantly, preventing the default image
					// from showing through during the 300ms fade.
					variantImageSelected.style.transition = "none";
					variantImageSelected.getBoundingClientRect(); // force reflow
					variantImageSelected.classList.add("is-visible");
					requestAnimationFrame(() => {
						variantImageSelected.style.transition = "";
					});
				}
			}

			logVariantPreview(swatchButton, eventName);
		};

		// Track the swatch button where a touch gesture began and its start coords.
		let swatchTouchStart = null;
		// Flag set by touchend so the subsequent synthesized click is skipped.
		let swatchTouchHandled = false;

		document.addEventListener(
			"touchstart",
			(event) => {
				const swatchButton = event.target.closest(selectors.swatchButton);
				swatchTouchStart =
					swatchButton && event.touches.length === 1
						? {
								button: swatchButton,
								x: event.touches[0].clientX,
								y: event.touches[0].clientY,
							}
						: null;
			},
			{ passive: true },
		);

		document.addEventListener(
			"touchend",
			(event) => {
				if (!swatchTouchStart) return;

				const { button: swatchButton, x: startX, y: startY } =
					swatchTouchStart;
				swatchTouchStart = null;

				// Ignore if the finger moved more than 10 px (scroll gesture).
				const touch = event.changedTouches?.[0];
				if (touch) {
					if (
						Math.abs(touch.clientX - startX) > 10 ||
						Math.abs(touch.clientY - startY) > 10
					) {
						return;
					}
				}

				swatchTouchHandled = true;
				switchSwatchImage(swatchButton, "grid swatch touchend");
			},
			{ passive: true },
		);

		document.addEventListener("click", (event) => {
			const swatchButton = event.target.closest(selectors.swatchButton);
			const siblingSwatch = event.target.closest(selectors.siblingSwatch);

			if (swatchButton) {
				event.preventDefault();

				if (swatchTouchHandled) {
					// Already handled by touchend — skip to avoid double execution.
					swatchTouchHandled = false;
				} else {
					// Desktop click (no preceding touchend).
					switchSwatchImage(swatchButton, "grid swatch click");
				}
			}

			if (siblingSwatch) {
				logSiblingPreview(siblingSwatch);
			}
		});

		document.addEventListener("mouseout", (event) => {
			const card = event.target.closest(selectors.gridItem);

			if (!card || card.contains(event.relatedTarget)) return;

			console.log(
				`${logPrefix} product card mouseleave reset`,
				getCardDebugData(card),
			);
		});
	}

	const alreadySelectedProductSwatches = new WeakSet();

	document.addEventListener(
		"pointerdown",
		(event) => {
			const productSection = event.target.closest(
				'[data-section-type="product"]',
			);
			const swatch = event.target.closest("radio-swatch");

			if (!productSection || !swatch) return;

			const input = swatch.querySelector("[data-single-option-selector]");

			if (input && input.checked) {
				alreadySelectedProductSwatches.add(input);
			}
		},
		true,
	);

	document.addEventListener(
		"click",
		(event) => {
			const productSection = event.target.closest(
				'[data-section-type="product"]',
			);
			const swatch = event.target.closest("radio-swatch");

			if (!productSection || !swatch) return;

			const input = swatch.querySelector("[data-single-option-selector]");

			if (!input || !alreadySelectedProductSwatches.has(input)) return;

			alreadySelectedProductSwatches.delete(input);

			setTimeout(() => {
				input.dispatchEvent(new Event("change", { bubbles: true }));
				console.log(
					"[Product swatch debug] selected PDP swatch clicked, variant image update forced",
					{
						option: input.name,
						value: input.value,
					},
				);
			}, 0);
		},
		true,
	);

	const desktopMenuSelector =
		".header__desktop [data-click-disclosure-toggle]";
	const visibleClass = "is-visible";
	const meganavVisibleClass = "meganav--visible";
	const meganavTransitioningClass = "meganav--is-transitioning";
	let disclosureEventsBound = false;
	let disclosureTransitionTimer = 0;

	const getDesktopMenuItems = () =>
		document.querySelectorAll(desktopMenuSelector);

	const isHomepage = () => {
		const path = window.location.pathname;
		return path === "/" || path === "/index.html";
	};

	// const updateHeaderDropdownState = () => {
	//   const header = document.querySelector('.theme__header');
	//   if (!header) return;

	//   const hasOpenDisclosure = Boolean(document.querySelector(`${desktopMenuSelector}.${visibleClass}`));

	//   if (!isHomepage() || hasOpenDisclosure) {
	//     header.style.backgroundColor = 'white';
	//     header.style.color = 'black';
	//   } else {
	//     header.style.backgroundColor = '';
	//     header.style.color = '';
	//   }
	// };

	// underline add korar jonno add kora hoise

	// const updateHeaderDropdownState = () => {
	//   const header = document.querySelector('.theme__header');
	//   if (!header) return;

	//   const hasOpenDisclosure = Boolean(document.querySelector(`${desktopMenuSelector}.${visibleClass}`));

	//   if (!isHomepage() || hasOpenDisclosure) {
	//     header.classList.add('header-active');
	//   } else {
	//     header.classList.remove('header-active');
	//   }
	// };

	// ১. ফাংশনটি ডিফাইন করা
	const updateHeaderDropdownState = () => {
		const header = document.querySelector(".theme__header");
		if (!header) return;

		const hasOpenDisclosure = Boolean(
			document.querySelector(`${desktopMenuSelector}.${visibleClass}`),
		);

		if (hasOpenDisclosure) {
			header.classList.add("header-active");
		} else {
			header.classList.remove("header-active");
		}
	};

	// ২. ক্লিক ইভেন্টগুলো এখানে সেট করা
	document.querySelectorAll(".menu-item-trigger").forEach((item) => {
		item.addEventListener("click", () => {
			// মেনু খোলার জন্য সামান্য সময় দিয়ে স্টেট আপডেট করা
			setTimeout(updateHeaderDropdownState, 100);
		});
	});

	// underline add korar jonno add kora hoise end

	const getDisclosure = (menuItem) => {
		const disclosureId = menuItem.getAttribute(
			"data-click-disclosure-toggle",
		);
		return disclosureId ? document.getElementById(disclosureId) : null;
	};

	const closeClickDisclosure = (menuItem) => {
		const disclosure = getDisclosure(menuItem);
		const headerWrapper = menuItem.closest("[data-header-wrapper]");

		menuItem.classList.remove(visibleClass);
		menuItem.setAttribute("aria-expanded", "false");

		if (disclosure) {
			disclosure.classList.remove(visibleClass);
		}

		if (
			headerWrapper &&
			!headerWrapper.querySelector(
				`${desktopMenuSelector}.${visibleClass}.grandparent`,
			)
		) {
			headerWrapper.classList.remove(
				meganavVisibleClass,
				meganavTransitioningClass,
			);
		}

		updateHeaderDropdownState();
	};

	const closeAllClickDisclosures = (exceptMenuItem) => {
		getDesktopMenuItems().forEach((menuItem) => {
			if (menuItem !== exceptMenuItem) {
				closeClickDisclosure(menuItem);
			}
		});
	};

	const openClickDisclosure = (menuItem) => {
		const disclosure = getDisclosure(menuItem);
		const headerWrapper = menuItem.closest("[data-header-wrapper]");

		if (!disclosure) return;

		closeAllClickDisclosures(menuItem);

		menuItem.classList.add(visibleClass);
		menuItem.setAttribute("aria-expanded", "true");
		disclosure.classList.add(visibleClass);

		if (headerWrapper) {
			headerWrapper.classList.toggle(
				meganavVisibleClass,
				menuItem.classList.contains("grandparent"),
			);
			headerWrapper.classList.add(meganavTransitioningClass);

			if (disclosureTransitionTimer) {
				clearTimeout(disclosureTransitionTimer);
			}

			disclosureTransitionTimer = setTimeout(() => {
				headerWrapper.classList.remove(meganavTransitioningClass);
			}, 200);
		}

		updateHeaderDropdownState();
	};

	const toggleClickDisclosure = (menuItem) => {
		if (menuItem.classList.contains(visibleClass)) {
			closeClickDisclosure(menuItem);
		} else {
			openClickDisclosure(menuItem);
		}
	};

	const initClickDisclosureMenus = () => {
		getDesktopMenuItems().forEach((menuItem) => {
			if (menuItem.dataset.clickDisclosureReady === "true") return;

			const topLink = menuItem.querySelector("[data-top-link]");
			const disclosure = getDisclosure(menuItem);

			if (!topLink || !disclosure) return;

			menuItem.dataset.clickDisclosureReady = "true";
			menuItem.setAttribute("aria-haspopup", "true");
			menuItem.setAttribute("aria-expanded", "false");
			menuItem.setAttribute("aria-controls", disclosure.id);

			topLink.addEventListener("click", (event) => {
				event.preventDefault();
				toggleClickDisclosure(menuItem);
			});

			topLink.addEventListener("keydown", (event) => {
				if (event.code !== "Space") return;

				event.preventDefault();
				toggleClickDisclosure(menuItem);
			});

			menuItem.addEventListener("focusout", () => {
				requestAnimationFrame(() => {
					if (!menuItem.contains(document.activeElement)) {
						closeClickDisclosure(menuItem);
					}
				});
			});
		});

		if (disclosureEventsBound) return;

		disclosureEventsBound = true;

		document.addEventListener("click", (event) => {
			if (!event.target.closest(".header__desktop")) {
				closeAllClickDisclosures();
			}
		});

		document.addEventListener("keyup", (event) => {
			if (event.code !== "Escape") return;

			const openMenuItem = document.querySelector(
				`${desktopMenuSelector}.${visibleClass}`,
			);
			closeAllClickDisclosures();

			if (openMenuItem) {
				const topLink = openMenuItem.querySelector("[data-top-link]");
				if (topLink) topLink.focus();
			}
		});
	};

	document.addEventListener("DOMContentLoaded", initClickDisclosureMenus);
	document.addEventListener("shopify:section:load", initClickDisclosureMenus);
	document.addEventListener("DOMContentLoaded", updateHeaderDropdownState);

	// Keeps the Vitals "On Image" wishlist button visible across variant changes.
	//
	// Root cause: Vitals injects the button inside a .product__slide. When a
	// variant changes, the theme adds media--hidden/media--hiding to the old slide
	// and filterVariantImages sets display:none — both hide the button with it.
	//
	// Strategy: leave the button in the slide during Vitals' full async
	// initialization (avoids interrupting its animations → no page-load blink).
	// Instead, watch each slide's class/style attributes and rescue the button
	// the instant a slide starts hiding. MutationObserver callbacks fire as
	// microtasks — before the browser repaints — so the button is always moved
	// before it can appear hidden to the user.
	const stabilizeVitalsProductWishlistButton = () => {
		const productImages = document.querySelector("product-images");
		if (!productImages) return;

		const getTarget = () =>
			productImages.querySelector(".product__slides") || productImages;

		// Move the button to .product__slides and lock it at full opacity.
		//
		// appendChild re-parents the element, which restarts any CSS keyframe
		// animation Vitals applied (e.g. a fade-in that plays opacity 0→1).
		// An inline opacity:1 !important beats animation-applied styles in the
		// CSS cascade, so no blink is visible from the restart.
		const moveButton = (button) => {
			getTarget().appendChild(button);
			button.style.setProperty("opacity", "1", "important");
		};

		// Find the button inside any .product__slide — querySelector reaches into
		// display:none subtrees — and move it out.
		const moveFromSlide = () => {
			const button =
				productImages.querySelector(
					".product__slide .Vtl-WishlistButton",
				) ||
				productImages.querySelector(
					'.product__slide [class*="Vtl-Wishlist"]',
				);
			if (button) moveButton(button);
		};

		// Defer setup until after window.load so Vitals' initialization animation
		// plays uninterrupted and causes no page-load blinks.
		window.addEventListener("load", () => {
			moveFromSlide();

			// Catch every Vitals re-injection (variant change, async state update).
			// Each re-injection puts the button back inside a .product__slide;
			// the MO moves it out immediately with opacity locked to 1.
			const observer = new MutationObserver(moveFromSlide);
			observer.observe(productImages, { childList: true, subtree: true });
		});

		// Timeout fallback: rescues the button after filterVariantImages hides
		// the slide, in case the MO and the display:none race each other.
		document.addEventListener("theme:variant:change", () => {
			setTimeout(moveFromSlide, 150);
			setTimeout(moveFromSlide, 400);
		});
	};

	document.addEventListener(
		"DOMContentLoaded",
		stabilizeVitalsProductWishlistButton,
	);

	// ^^ Keep your scripts inside this IIFE function call to
	// avoid leaking your variables into the global scope.
})();
