
/*
* @license
* Broadcast Theme (c) Invisible Themes
*
* This file is included for advanced development by
* Shopify Agencies.  Modified versions of the theme
* code are not supported by Shopify or Invisible Themes.
*
* In order to use this file you will need to change
* theme.js to theme.dev.js in /layout/theme.liquid
*
*/

(function (scrollLock, Rellax, Flickity, FlickityFade, themeImages) {
    'use strict';

    (function() {
        const env = {"NODE_ENV":"production"};
        try {
            if (process) {
                process.env = Object.assign({}, process.env);
                Object.assign(process.env, env);
                return;
            }
        } catch (e) {} // avoid ReferenceError: process is not defined
        globalThis.process = { env:env };
    })();

    window.theme = window.theme || {};

    window.theme.sizes = {
      mobile: 480,
      small: 750,
      large: 990,
      widescreen: 1400,
    };

    window.theme.focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function floatLabels(container) {
      const floats = container.querySelectorAll('.form-field');
      floats.forEach((element) => {
        const label = element.querySelector('label');
        const input = element.querySelector('input, textarea');
        if (label && input) {
          input.addEventListener('keyup', (event) => {
            if (event.target.value !== '') {
              label.classList.add('label--float');
            } else {
              label.classList.remove('label--float');
            }
          });
          if (input.value && input.value.length) {
            label.classList.add('label--float');
          }
        }
      });
    }

    let screenOrientation = getScreenOrientation();
    window.initialWindowHeight = Math.min(window.screen.height, window.innerHeight);

    function readHeights() {
      const h = {};
      h.windowHeight = Math.min(window.screen.height, window.innerHeight);
      h.footerHeight = getHeight('[data-section-type*="footer"]');
      h.headerHeight = getHeight('[data-header-height]');
      h.stickyHeaderHeight = document.querySelector('[data-header-sticky]') ? h.headerHeight : 0;
      h.collectionNavHeight = getHeight('[data-collection-nav]');
      h.logoHeight = getFooterLogoWithPadding();

      return h;
    }

    function setVarsOnResize() {
      document.addEventListener('theme:resize', resizeVars);
      setVars();
    }

    function setVars() {
      const {windowHeight, headerHeight, logoHeight, footerHeight, collectionNavHeight} = readHeights();

      document.documentElement.style.setProperty('--full-height', `${windowHeight}px`);
      document.documentElement.style.setProperty('--three-quarters', `${windowHeight * (3 / 4)}px`);
      document.documentElement.style.setProperty('--two-thirds', `${windowHeight * (2 / 3)}px`);
      document.documentElement.style.setProperty('--one-half', `${windowHeight / 2}px`);
      document.documentElement.style.setProperty('--one-third', `${windowHeight / 3}px`);

      document.documentElement.style.setProperty('--collection-nav-height', `${collectionNavHeight}px`);
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
      document.documentElement.style.setProperty('--content-full', `${windowHeight - headerHeight - logoHeight / 2}px`);
      document.documentElement.style.setProperty('--content-min', `${windowHeight - headerHeight - footerHeight}px`);

      if (document.querySelector('[data-tracking-consent].popup-cookies--bottom')) {
        document.documentElement.style.setProperty('--cookie-bar-height', `${document.querySelector('[data-tracking-consent].popup-cookies--bottom').offsetHeight}px`);
      }
    }

    function resizeVars() {
      // restrict the heights that are changed on resize to avoid iOS jump when URL bar is shown and hidden
      const {windowHeight, headerHeight, logoHeight, footerHeight, collectionNavHeight} = readHeights();
      const currentScreenOrientation = getScreenOrientation();

      if (currentScreenOrientation !== screenOrientation || window.innerWidth > window.theme.sizes.mobile) {
        // Only update the heights on screen orientation change or larger than mobile devices
        document.documentElement.style.setProperty('--full-height', `${windowHeight}px`);
        document.documentElement.style.setProperty('--three-quarters', `${windowHeight * (3 / 4)}px`);
        document.documentElement.style.setProperty('--two-thirds', `${windowHeight * (2 / 3)}px`);
        document.documentElement.style.setProperty('--one-half', `${windowHeight / 2}px`);
        document.documentElement.style.setProperty('--one-third', `${windowHeight / 3}px`);

        // Update the screen orientation state
        screenOrientation = currentScreenOrientation;
      }

      document.documentElement.style.setProperty('--collection-nav-height', `${collectionNavHeight}px`);

      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
      document.documentElement.style.setProperty('--content-full', `${windowHeight - headerHeight - logoHeight / 2}px`);
      document.documentElement.style.setProperty('--content-min', `${windowHeight - headerHeight - footerHeight}px`);

      if (document.querySelector('[data-tracking-consent].popup-cookies--bottom')) {
        document.documentElement.style.setProperty('--cookie-bar-height', `${document.querySelector('[data-tracking-consent].popup-cookies--bottom').offsetHeight}px`);
      }
    }

    function getScreenOrientation() {
      if (window.matchMedia('(orientation: portrait)').matches) {
        return 'portrait';
      }

      if (window.matchMedia('(orientation: landscape)').matches) {
        return 'landscape';
      }
    }

    function getHeight(selector) {
      const el = document.querySelector(selector);
      if (el) {
        return el.offsetHeight;
      } else {
        return 0;
      }
    }

    function getFooterLogoWithPadding() {
      const height = getHeight('[data-footer-logo]');
      if (height > 0) {
        return height + 20;
      } else {
        return 0;
      }
    }

    function debounce(fn, time) {
      let timeout;
      return function () {
        // eslint-disable-next-line prefer-rest-params
        if (fn) {
          const functionCall = () => fn.apply(this, arguments);
          clearTimeout(timeout);
          timeout = setTimeout(functionCall, time);
        }
      };
    }

    function getWindowWidth() {
      return document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
    }

    function getWindowHeight() {
      return document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
    }

    function isDesktop() {
      return getWindowWidth() >= window.theme.sizes.small;
    }

    function isMobile() {
      return getWindowWidth() < window.theme.sizes.small;
    }

    let lastWindowWidth = getWindowWidth();
    let lastWindowHeight = getWindowHeight();

    function dispatch$1() {
      document.dispatchEvent(
        new CustomEvent('theme:resize', {
          bubbles: true,
        })
      );

      if (lastWindowWidth !== getWindowWidth()) {
        document.dispatchEvent(
          new CustomEvent('theme:resize:width', {
            bubbles: true,
          })
        );

        lastWindowWidth = getWindowWidth();
      }

      if (lastWindowHeight !== getWindowHeight()) {
        document.dispatchEvent(
          new CustomEvent('theme:resize:height', {
            bubbles: true,
          })
        );

        lastWindowHeight = getWindowHeight();
      }
    }

    function resizeListener() {
      window.addEventListener(
        'resize',
        debounce(function () {
          dispatch$1();
        }, 50)
      );
    }

    let prev = window.scrollY;
    let up = null;
    let down = null;
    let wasUp = null;
    let wasDown = null;
    let scrollLockTimer = 0;

    function dispatch() {
      const position = window.scrollY;
      if (position > prev) {
        down = true;
        up = false;
      } else if (position < prev) {
        down = false;
        up = true;
      } else {
        up = null;
        down = null;
      }
      prev = position;
      document.dispatchEvent(
        new CustomEvent('theme:scroll', {
          detail: {
            up,
            down,
            position,
          },
          bubbles: false,
        })
      );
      if (up && !wasUp) {
        document.dispatchEvent(
          new CustomEvent('theme:scroll:up', {
            detail: {position},
            bubbles: false,
          })
        );
      }
      if (down && !wasDown) {
        document.dispatchEvent(
          new CustomEvent('theme:scroll:down', {
            detail: {position},
            bubbles: false,
          })
        );
      }
      wasDown = down;
      wasUp = up;
    }

    function lock(e) {
      // Prevent body scroll lock race conditions
      setTimeout(() => {
        if (scrollLockTimer) {
          clearTimeout(scrollLockTimer);
        }

        scrollLock.disablePageScroll(e.detail, {
          allowTouchMove: (el) => el.tagName === 'TEXTAREA',
        });

        document.documentElement.setAttribute('data-scroll-locked', '');
      });
    }

    function unlock(e) {
      const timeout = e.detail;

      if (timeout) {
        scrollLockTimer = setTimeout(removeScrollLock, timeout);
      } else {
        removeScrollLock();
      }
    }

    function removeScrollLock() {
      scrollLock.clearQueueScrollLocks();
      scrollLock.enablePageScroll();
      document.documentElement.removeAttribute('data-scroll-locked');
    }

    function scrollListener() {
      let timeout;
      window.addEventListener(
        'scroll',
        function () {
          if (timeout) {
            window.cancelAnimationFrame(timeout);
          }
          timeout = window.requestAnimationFrame(function () {
            dispatch();
          });
        },
        {passive: true}
      );

      window.addEventListener('theme:scroll:lock', lock);
      window.addEventListener('theme:scroll:unlock', unlock);
    }

    const wrap = (toWrap, wrapperClass = '', wrapperOption) => {
      const wrapper = wrapperOption || document.createElement('div');
      wrapper.classList.add(wrapperClass);
      toWrap.parentNode.insertBefore(wrapper, toWrap);
      return wrapper.appendChild(toWrap);
    };

    function wrapElements(container) {
      // Target tables to make them scrollable
      const tableSelectors = '.rte table';
      const tables = container.querySelectorAll(tableSelectors);
      tables.forEach((table) => {
        wrap(table, 'rte__table-wrapper');
        table.setAttribute('data-scroll-lock-scrollable', '');
      });

      // Target iframes to make them responsive
      const iframeSelectors = '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"], .rte iframe#admin_bar_iframe';
      const frames = container.querySelectorAll(iframeSelectors);
      frames.forEach((frame) => {
        wrap(frame, 'rte__video-wrapper');
      });
    }

    function isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

    function isTouch() {
      if (isTouchDevice()) {
        document.documentElement.className = document.documentElement.className.replace('no-touch', 'supports-touch');
        window.theme.touch = true;
      } else {
        window.theme.touch = false;
      }
    }

    function ariaToggle(container) {
      const toggleButtons = container.querySelectorAll('[data-aria-toggle]');
      if (toggleButtons.length) {
        toggleButtons.forEach((element) => {
          element.addEventListener('click', function (event) {
            event.preventDefault();
            const currentTarget = event.currentTarget;
            currentTarget.setAttribute('aria-expanded', currentTarget.getAttribute('aria-expanded') == 'false' ? 'true' : 'false');
            const toggleID = currentTarget.getAttribute('aria-controls');
            const toggleElement = document.querySelector(`#${toggleID}`);
            const removeExpandingClass = () => {
              toggleElement.classList.remove('expanding');
              toggleElement.removeEventListener('transitionend', removeExpandingClass);
            };
            const addExpandingClass = () => {
              toggleElement.classList.add('expanding');
              toggleElement.removeEventListener('transitionstart', addExpandingClass);
            };

            toggleElement.addEventListener('transitionstart', addExpandingClass);
            toggleElement.addEventListener('transitionend', removeExpandingClass);

            toggleElement.classList.toggle('expanded');
          });
        });
      }
    }

    function loading() {
      document.body.classList.add('is-loaded');
    }

    const classes$H = {
      loading: 'is-loading',
    };

    const selectors$X = {
      img: 'img.is-loading',
    };

    /*
      Catch images loaded events and add class "is-loaded" to them and their containers
    */
    function loadedImagesEventHook() {
      document.addEventListener(
        'load',
        (e) => {
          if (e.target.tagName.toLowerCase() == 'img' && e.target.classList.contains(classes$H.loading)) {
            e.target.classList.remove(classes$H.loading);
            e.target.parentNode.classList.remove(classes$H.loading);

            if (e.target.parentNode.parentNode.classList.contains(classes$H.loading)) {
              e.target.parentNode.parentNode.classList.remove(classes$H.loading);
            }
          }
        },
        true
      );
    }

    /*
      Remove "is-loading" class to the loaded images and their containers
    */
    function removeLoadingClassFromLoadedImages(container) {
      container.querySelectorAll(selectors$X.img).forEach((img) => {
        if (img.complete) {
          img.classList.remove(classes$H.loading);
          img.parentNode.classList.remove(classes$H.loading);

          if (img.parentNode.parentNode.classList.contains(classes$H.loading)) {
            img.parentNode.parentNode.classList.remove(classes$H.loading);
          }
        }
      });
    }

    function isVisible(el) {
      var style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }

    /**
     * Moves focus to an HTML element
     * eg for In-page links, after scroll, focus shifts to content area so that
     * next `tab` is where user expects. Used in bindInPageLinks()
     * eg move focus to a modal that is opened. Used in trapFocus()
     *
     * @param {Element} container - Container DOM element to trap focus inside of
     * @param {Object} options - Settings unique to your theme
     * @param {string} options.className - Class name to apply to element on focus.
     */
    function forceFocus(element, options) {
      options = options || {};

      var savedTabIndex = element.tabIndex;

      element.tabIndex = -1;
      element.dataset.tabIndex = savedTabIndex;
      element.focus();
      if (typeof options.className !== 'undefined') {
        element.classList.add(options.className);
      }
      element.addEventListener('blur', callback);

      function callback(event) {
        event.target.removeEventListener(event.type, callback);

        element.tabIndex = savedTabIndex;
        delete element.dataset.tabIndex;
        if (typeof options.className !== 'undefined') {
          element.classList.remove(options.className);
        }
      }
    }

    /**
     * If there's a hash in the url, focus the appropriate element
     * This compensates for older browsers that do not move keyboard focus to anchor links.
     * Recommendation: To be called once the page in loaded.
     *
     * @param {Object} options - Settings unique to your theme
     * @param {string} options.className - Class name to apply to element on focus.
     * @param {string} options.ignore - Selector for elements to not include.
     */

    function focusHash(options) {
      options = options || {};
      var hash = window.location.hash;
      var element = document.getElementById(hash.slice(1));

      // if we are to ignore this element, early return
      if (element && options.ignore && element.matches(options.ignore)) {
        return false;
      }

      if (hash && element) {
        forceFocus(element, options);
      }
    }

    /**
     * When an in-page (url w/hash) link is clicked, focus the appropriate element
     * This compensates for older browsers that do not move keyboard focus to anchor links.
     * Recommendation: To be called once the page in loaded.
     *
     * @param {Object} options - Settings unique to your theme
     * @param {string} options.className - Class name to apply to element on focus.
     * @param {string} options.ignore - CSS selector for elements to not include.
     */

    function bindInPageLinks(options) {
      options = options || {};
      var links = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));

      function queryCheck(selector) {
        return document.getElementById(selector) !== null;
      }

      return links.filter(function (link) {
        if (link.hash === '#' || link.hash === '') {
          return false;
        }

        if (options.ignore && link.matches(options.ignore)) {
          return false;
        }

        if (!queryCheck(link.hash.substr(1))) {
          return false;
        }

        var element = document.querySelector(link.hash);

        if (!element) {
          return false;
        }

        link.addEventListener('click', function () {
          forceFocus(element, options);
        });

        return true;
      });
    }

    function focusable(container) {
      var elements = Array.prototype.slice.call(
        container.querySelectorAll('[tabindex],' + '[draggable],' + 'a[href],' + 'area,' + 'button:enabled,' + 'input:not([type=hidden]):enabled,' + 'object,' + 'select:enabled,' + 'textarea:enabled')
      );

      // Filter out elements that are not visible.
      // Copied from jQuery https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/src/css/hiddenVisibleSelectors.js
      return elements.filter(function (element) {
        return !!((element.offsetWidth || element.offsetHeight || element.getClientRects().length) && isVisible(element));
      });
    }

    /**
     * Traps the focus in a particular container
     *
     * @param {Element} container - Container DOM element to trap focus inside of
     * @param {Element} elementToFocus - Element to be focused on first
     * @param {Object} options - Settings unique to your theme
     * @param {string} options.className - Class name to apply to element on focus.
     */

    var trapFocusHandlers = {};

    function trapFocus(container, options) {
      options = options || {};
      var elements = focusable(container);
      var elementToFocus = options.elementToFocus || container;
      var first = elements[0];
      var last = elements[elements.length - 1];

      removeTrapFocus();

      trapFocusHandlers.focusin = function (event) {
        if (container !== event.target && !container.contains(event.target) && first && first === event.target) {
          first.focus();
        }

        if (event.target !== container && event.target !== last && event.target !== first) return;
        document.addEventListener('keydown', trapFocusHandlers.keydown);
      };

      trapFocusHandlers.focusout = function () {
        document.removeEventListener('keydown', trapFocusHandlers.keydown);
      };

      trapFocusHandlers.keydown = function (event) {
        if (event.code !== 'Tab') return; // If not TAB key

        // On the last focusable element and tab forward, focus the first element.
        if (event.target === last && !event.shiftKey) {
          event.preventDefault();
          first.focus();
        }

        //  On the first focusable element and tab backward, focus the last element.
        if ((event.target === container || event.target === first) && event.shiftKey) {
          event.preventDefault();
          last.focus();
        }
      };

      document.addEventListener('focusout', trapFocusHandlers.focusout);
      document.addEventListener('focusin', trapFocusHandlers.focusin);

      forceFocus(elementToFocus, options);
    }

    /**
     * Removes the trap of focus from the page
     */
    function removeTrapFocus() {
      document.removeEventListener('focusin', trapFocusHandlers.focusin);
      document.removeEventListener('focusout', trapFocusHandlers.focusout);
      document.removeEventListener('keydown', trapFocusHandlers.keydown);
    }

    /**
     * Auto focus the last element
     */
    function autoFocusLastElement() {
      if (window.accessibility.lastElement && document.body.classList.contains('is-focused')) {
        setTimeout(() => {
          window.accessibility.lastElement?.focus();
        });
      }
    }

    /**
     * Add a preventive message to external links and links that open to a new window.
     * @param {string} elements - Specific elements to be targeted
     * @param {object} options.messages - Custom messages to overwrite with keys: newWindow, external, newWindowExternal
     * @param {string} options.messages.newWindow - When the link opens in a new window (e.g. target="_blank")
     * @param {string} options.messages.external - When the link is to a different host domain.
     * @param {string} options.messages.newWindowExternal - When the link is to a different host domain and opens in a new window.
     * @param {object} options.prefix - Prefix to namespace "id" of the messages
     */
    function accessibleLinks(elements, options) {
      if (typeof elements !== 'string') {
        throw new TypeError(elements + ' is not a String.');
      }

      elements = document.querySelectorAll(elements);

      if (elements.length === 0) {
        return;
      }

      options = options || {};
      options.messages = options.messages || {};

      var messages = {
        newWindow: options.messages.newWindow || 'Opens in a new window.',
        external: options.messages.external || 'Opens external website.',
        newWindowExternal: options.messages.newWindowExternal || 'Opens external website in a new window.',
      };

      var prefix = options.prefix || 'a11y';

      var messageSelectors = {
        newWindow: prefix + '-new-window-message',
        external: prefix + '-external-message',
        newWindowExternal: prefix + '-new-window-external-message',
      };

      function generateHTML(messages) {
        var container = document.createElement('ul');
        var htmlMessages = Object.keys(messages).reduce(function (html, key) {
          return (html += '<li id=' + messageSelectors[key] + '>' + messages[key] + '</li>');
        }, '');

        container.setAttribute('hidden', true);
        container.innerHTML = htmlMessages;

        document.body.appendChild(container);
      }

      function externalSite(link) {
        return link.hostname !== window.location.hostname;
      }

      elements.forEach(function (link) {
        var target = link.getAttribute('target');
        var rel = link.getAttribute('rel');
        var isExternal = externalSite(link);
        var isTargetBlank = target === '_blank';
        var missingRelNoopener = rel === null || rel.indexOf('noopener') === -1;

        if (isTargetBlank && missingRelNoopener) {
          var relValue = rel === null ? 'noopener' : rel + ' noopener';
          link.setAttribute('rel', relValue);
        }

        if (isExternal && isTargetBlank) {
          link.setAttribute('aria-describedby', messageSelectors.newWindowExternal);
        } else if (isExternal) {
          link.setAttribute('aria-describedby', messageSelectors.external);
        } else if (isTargetBlank) {
          link.setAttribute('aria-describedby', messageSelectors.newWindow);
        }
      });

      generateHTML(messages);
    }

    var a11y = /*#__PURE__*/Object.freeze({
        __proto__: null,
        forceFocus: forceFocus,
        focusHash: focusHash,
        bindInPageLinks: bindInPageLinks,
        focusable: focusable,
        trapFocus: trapFocus,
        removeTrapFocus: removeTrapFocus,
        autoFocusLastElement: autoFocusLastElement,
        accessibleLinks: accessibleLinks
    });

    const selectors$W = {
      inputSearch: 'input[type="search"]',
      focusedElements: '[aria-selected="true"] a',
      resetButton: 'button[type="reset"]',
    };

    const classes$G = {
      hidden: 'hidden',
    };

    class HeaderSearchForm extends HTMLElement {
      constructor() {
        super();

        this.input = this.querySelector(selectors$W.inputSearch);
        this.resetButton = this.querySelector(selectors$W.resetButton);

        if (this.input) {
          this.input.form.addEventListener('reset', this.onFormReset.bind(this));
          this.input.addEventListener(
            'input',
            debounce((event) => {
              this.onChange(event);
            }, 300).bind(this)
          );
        }
      }

      toggleResetButton() {
        const resetIsHidden = this.resetButton.classList.contains(classes$G.hidden);
        if (this.input.value.length > 0 && resetIsHidden) {
          this.resetButton.classList.remove(classes$G.hidden);
        } else if (this.input.value.length === 0 && !resetIsHidden) {
          this.resetButton.classList.add(classes$G.hidden);
        }
      }

      onChange() {
        this.toggleResetButton();
      }

      shouldResetForm() {
        return !document.querySelector(selectors$W.focusedElements);
      }

      onFormReset(event) {
        // Prevent default so the form reset doesn't set the value gotten from the url on page load
        event.preventDefault();
        // Don't reset if the user has selected an element on the predictive search dropdown
        if (this.shouldResetForm()) {
          this.input.value = '';
          this.toggleResetButton();
          event.target.querySelector(selectors$W.inputSearch).focus();
        }
      }
    }

    customElements.define('header-search-form', HeaderSearchForm);

    const selectors$V = {
      allVisibleElements: '[role="option"]',
      ariaSelected: '[aria-selected="true"]',
      popularSearches: '[data-popular-searches]',
      predictiveSearch: 'predictive-search',
      predictiveSearchResults: '[data-predictive-search-results]',
      predictiveSearchStatus: '[data-predictive-search-status]',
      searchInput: 'input[type="search"]',
      searchPopdown: '[data-popdown]',
      searchResultsLiveRegion: '[data-predictive-search-live-region-count-value]',
      searchResultsGroupsWrapper: '[data-search-results-groups-wrapper]',
      searchForText: '[data-predictive-search-search-for-text]',
      sectionPredictiveSearch: '#shopify-section-predictive-search',
      selectedLink: '[aria-selected="true"] a',
      selectedOption: '[aria-selected="true"] a, button[aria-selected="true"]',
    };

    class PredictiveSearch extends HeaderSearchForm {
      constructor() {
        super();
        this.a11y = a11y;
        this.abortController = new AbortController();
        this.allPredictiveSearchInstances = document.querySelectorAll(selectors$V.predictiveSearch);
        this.cachedResults = {};
        this.input = this.querySelector(selectors$V.searchInput);
        this.isOpen = false;
        this.predictiveSearchResults = this.querySelector(selectors$V.predictiveSearchResults);
        this.searchPopdown = this.closest(selectors$V.searchPopdown);
        this.popularSearches = this.searchPopdown?.querySelector(selectors$V.popularSearches);
        this.searchTerm = '';
      }

      connectedCallback() {
        this.input.addEventListener('focus', this.onFocus.bind(this));
        this.input.form.addEventListener('submit', this.onFormSubmit.bind(this));

        this.addEventListener('focusout', this.onFocusOut.bind(this));
        this.addEventListener('keyup', this.onKeyup.bind(this));
        this.addEventListener('keydown', this.onKeydown.bind(this));
      }

      getQuery() {
        return this.input.value.trim();
      }

      onChange() {
        super.onChange();
        const newSearchTerm = this.getQuery();

        if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
          // Remove the results when they are no longer relevant for the new search term
          // so they don't show up when the dropdown opens again
          this.querySelector(selectors$V.searchResultsGroupsWrapper)?.remove();
        }

        // Update the term asap, don't wait for the predictive search query to finish loading
        this.updateSearchForTerm(this.searchTerm, newSearchTerm);

        this.searchTerm = newSearchTerm;

        if (!this.searchTerm.length) {
          this.reset();
          return;
        }

        this.getSearchResults(this.searchTerm);
      }

      onFormSubmit(event) {
        if (!this.getQuery().length || this.querySelector(selectors$V.selectedLink)) event.preventDefault();
      }

      onFormReset(event) {
        super.onFormReset(event);
        if (super.shouldResetForm()) {
          this.searchTerm = '';
          this.abortController.abort();
          this.abortController = new AbortController();
          this.closeResults(true);
        }
      }

      shouldResetForm() {
        return !document.querySelector(selectors$V.selectedLink);
      }

      onFocus() {
        const currentSearchTerm = this.getQuery();

        if (!currentSearchTerm.length) return;

        if (this.searchTerm !== currentSearchTerm) {
          // Search term was changed from other search input, treat it as a user change
          this.onChange();
        } else if (this.getAttribute('results') === 'true') {
          this.open();
        } else {
          this.getSearchResults(this.searchTerm);
        }
      }

      onFocusOut() {
        setTimeout(() => {
          if (!this.contains(document.activeElement)) this.close();
        });
      }

      onKeyup(event) {
        if (!this.getQuery().length) this.close(true);
        event.preventDefault();

        switch (event.code) {
          case 'ArrowUp':
            this.switchOption('up');
            break;
          case 'ArrowDown':
            this.switchOption('down');
            break;
          case 'Enter':
            this.selectOption();
            break;
        }
      }

      onKeydown(event) {
        // Prevent the cursor from moving in the input when using the up and down arrow keys
        if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
          event.preventDefault();
        }
      }

      updateSearchForTerm(previousTerm, newTerm) {
        const searchForTextElement = this.querySelector(selectors$V.searchForText);
        const currentButtonText = searchForTextElement?.innerText;

        if (currentButtonText) {
          if (currentButtonText.match(new RegExp(previousTerm, 'g'))?.length > 1) {
            // The new term matches part of the button text and not just the search term, do not replace to avoid mistakes
            return;
          }
          const newButtonText = currentButtonText.replace(previousTerm, newTerm);
          searchForTextElement.innerText = newButtonText;
        }
      }

      switchOption(direction) {
        if (!this.getAttribute('open')) return;

        const moveUp = direction === 'up';
        const selectedElement = this.querySelector(selectors$V.ariaSelected);

        // Filter out hidden elements (duplicated page and article resources) thanks
        // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
        const allVisibleElements = Array.from(this.querySelectorAll(selectors$V.allVisibleElements)).filter((element) => element.offsetParent !== null);

        let activeElementIndex = 0;

        if (moveUp && !selectedElement) return;

        let selectedElementIndex = -1;
        let i = 0;

        while (selectedElementIndex === -1 && i <= allVisibleElements.length) {
          if (allVisibleElements[i] === selectedElement) {
            selectedElementIndex = i;
          }
          i++;
        }

        this.statusElement.textContent = '';

        if (!moveUp && selectedElement) {
          activeElementIndex = selectedElementIndex === allVisibleElements.length - 1 ? 0 : selectedElementIndex + 1;
        } else if (moveUp) {
          activeElementIndex = selectedElementIndex === 0 ? allVisibleElements.length - 1 : selectedElementIndex - 1;
        }

        if (activeElementIndex === selectedElementIndex) return;

        const activeElement = allVisibleElements[activeElementIndex];

        activeElement.setAttribute('aria-selected', true);
        if (selectedElement) selectedElement.setAttribute('aria-selected', false);

        this.input.setAttribute('aria-activedescendant', activeElement.id);
      }

      selectOption() {
        const selectedOption = this.querySelector(selectors$V.selectedOption);

        if (selectedOption) selectedOption.click();
      }

      getSearchResults(searchTerm) {
        const queryKey = searchTerm.replace(' ', '-').toLowerCase();
        this.setLiveRegionLoadingState();

        if (this.cachedResults[queryKey]) {
          this.renderSearchResults(this.cachedResults[queryKey]);
          return;
        }

        fetch(`${theme.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&section_id=predictive-search`, {signal: this.abortController.signal})
          .then((response) => {
            if (!response.ok) {
              var error = new Error(response.status);
              this.close();
              throw error;
            }

            return response.text();
          })
          .then((text) => {
            const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector(selectors$V.sectionPredictiveSearch).innerHTML;
            // Save bandwidth keeping the cache in all instances synced
            this.allPredictiveSearchInstances.forEach((predictiveSearchInstance) => {
              predictiveSearchInstance.cachedResults[queryKey] = resultsMarkup;
            });
            this.renderSearchResults(resultsMarkup);
          })
          .catch((error) => {
            if (error?.code === 20) {
              // Code 20 means the call was aborted
              return;
            }
            this.close();
            throw error;
          });
      }

      setLiveRegionLoadingState() {
        this.statusElement = this.statusElement || this.querySelector(selectors$V.predictiveSearchStatus);
        this.loadingText = this.loadingText || this.getAttribute('data-loading-text');

        this.setLiveRegionText(this.loadingText);
        this.setAttribute('loading', true);
      }

      setLiveRegionText(statusText) {
        this.statusElement.setAttribute('aria-hidden', 'false');
        this.statusElement.textContent = statusText;

        setTimeout(() => {
          this.statusElement.setAttribute('aria-hidden', 'true');
        }, 1000);
      }

      renderSearchResults(resultsMarkup) {
        this.predictiveSearchResults.innerHTML = resultsMarkup;

        this.setAttribute('results', true);

        this.setLiveRegionResults();
        this.open();
      }

      setLiveRegionResults() {
        this.removeAttribute('loading');
        this.setLiveRegionText(this.querySelector(selectors$V.searchResultsLiveRegion).textContent);
      }

      open() {
        this.setAttribute('open', true);
        this.input.setAttribute('aria-expanded', true);
        this.isOpen = true;
        this.predictiveSearchResults.style.setProperty('--full-screen', `${window.visualViewport.height}px`);
      }

      close(clearSearchTerm = false) {
        this.closeResults(clearSearchTerm);
        this.isOpen = false;
        this.predictiveSearchResults.style.removeProperty('--full-screen');
      }

      closeResults(clearSearchTerm = false) {
        if (clearSearchTerm) {
          this.input.value = '';
          this.removeAttribute('results');
        }
        const selected = this.querySelector(selectors$V.ariaSelected);

        if (selected) selected.setAttribute('aria-selected', false);

        this.input.setAttribute('aria-activedescendant', '');
        this.removeAttribute('loading');
        this.removeAttribute('open');
        this.input.setAttribute('aria-expanded', false);
        this.predictiveSearchResults?.removeAttribute('style');
      }

      reset() {
        this.predictiveSearchResults.innerHTML = '';

        this.input.val = '';
        this.a11y.removeTrapFocus();

        if (this.popularSearches) {
          this.input.dispatchEvent(new Event('blur', {bubbles: false}));
          this.a11y.trapFocus(this.searchPopdown, {
            elementToFocus: this.input,
          });
        }
      }
    }

    const selectors$U = {
      popoutList: '[data-popout-list]',
      popoutToggle: '[data-popout-toggle]',
      popoutToggleText: '[data-popout-toggle-text]',
      popoutInput: '[data-popout-input]',
      popoutOptions: '[data-popout-option]',
      productGridImage: '[data-product-image]',
      productGridItem: '[data-grid-item]',
      section: '[data-section-type]',
    };

    const classes$F = {
      listVisible: 'popout-list--visible',
      visible: 'is-visible',
      active: 'is-active',
      selectPopoutTop: 'select-popout--top',
    };

    const attributes$x = {
      ariaExpanded: 'aria-expanded',
      ariaCurrent: 'aria-current',
      dataValue: 'data-value',
      popoutToggleText: 'data-popout-toggle-text',
      submit: 'submit',
    };

    class Popout extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.popoutList = this.querySelector(selectors$U.popoutList);
        this.popoutToggle = this.querySelector(selectors$U.popoutToggle);
        this.popoutToggleText = this.querySelector(selectors$U.popoutToggleText);
        this.popoutInput = this.querySelector(selectors$U.popoutInput);
        this.popoutOptions = this.querySelectorAll(selectors$U.popoutOptions);
        this.productGridItem = this.popoutList.closest(selectors$U.productGridItem);
        this.fireSubmitEvent = this.hasAttribute(attributes$x.submit);

        this.popupToggleFocusoutEvent = (evt) => this.onPopupToggleFocusout(evt);
        this.popupListFocusoutEvent = (evt) => this.onPopupListFocusout(evt);
        this.popupToggleClickEvent = (evt) => this.onPopupToggleClick(evt);
        this.keyUpEvent = (evt) => this.onKeyUp(evt);
        this.bodyClickEvent = (evt) => this.onBodyClick(evt);

        this._connectOptions();
        this._connectToggle();
        this._onFocusOut();
        this.popupListMaxWidth();
      }

      onPopupToggleClick(evt) {
        const button = evt.currentTarget;
        const ariaExpanded = button.getAttribute(attributes$x.ariaExpanded) === 'true';

        if (this.productGridItem) {
          const productGridItemImage = this.productGridItem.querySelector(selectors$U.productGridImage);

          if (productGridItemImage) {
            productGridItemImage.classList.toggle(classes$F.visible, !ariaExpanded);
          }

          this.popoutList.style.maxHeight = `${Math.abs(this.popoutToggle.getBoundingClientRect().bottom - this.productGridItem.getBoundingClientRect().bottom)}px`;
        }

        evt.currentTarget.setAttribute(attributes$x.ariaExpanded, !ariaExpanded);
        this.popoutList.classList.toggle(classes$F.listVisible);
        this.popupListMaxWidth();
        this.toggleListPosition();

        document.body.addEventListener('click', this.bodyClickEvent);
      }

      onPopupToggleFocusout(evt) {
        const popoutLostFocus = this.contains(evt.relatedTarget);

        if (!popoutLostFocus) {
          this._hideList();
        }
      }

      onPopupListFocusout(evt) {
        const childInFocus = evt.currentTarget.contains(evt.relatedTarget);
        const isVisible = this.popoutList.classList.contains(classes$F.listVisible);

        if (isVisible && !childInFocus) {
          this._hideList();
        }
      }

      toggleListPosition() {
        const button = this.querySelector(selectors$U.popoutToggle);
        const ariaExpanded = button.getAttribute(attributes$x.ariaExpanded) === 'true';
        const windowHeight = window.innerHeight;
        const bottom = this.popoutList.getBoundingClientRect().bottom;

        const removeTopClass = () => {
          this.classList.remove(classes$F.selectPopoutTop);
          this.popoutList.removeEventListener('transitionend', removeTopClass);
        };

        if (ariaExpanded) {
          if (windowHeight < bottom) {
            this.classList.add(classes$F.selectPopoutTop);
          }
        } else {
          this.popoutList.addEventListener('transitionend', removeTopClass);
        }
      }

      popupListMaxWidth() {
        this.popoutList.style.setProperty('--max-width', '100vw');
        requestAnimationFrame(() => {
          this.popoutList.style.setProperty('--max-width', `${parseInt(document.body.clientWidth - this.popoutList.getBoundingClientRect().left)}px`);
        });
      }

      popupOptionsClick(evt) {
        const link = evt.target.closest(selectors$U.popoutOptions);
        if (link.attributes.href.value === '#') {
          evt.preventDefault();

          const attrValue = evt.currentTarget.hasAttribute(attributes$x.dataValue) ? evt.currentTarget.getAttribute(attributes$x.dataValue) : '';

          this.popoutInput.value = attrValue;

          if (this.popoutInput.disabled) {
            this.popoutInput.removeAttribute('disabled');
          }

          if (this.fireSubmitEvent) {
            this._submitForm(attrValue);
          } else {
            const currentTarget = evt.currentTarget.parentElement;
            const listTargetElement = this.popoutList.querySelector(`.${classes$F.active}`);
            const targetAttribute = this.popoutList.querySelector(`[${attributes$x.ariaCurrent}]`);

            this.popoutInput.dispatchEvent(new Event('change'));

            if (listTargetElement) {
              listTargetElement.classList.remove(classes$F.active);
              currentTarget.classList.add(classes$F.active);
            }

            if (this.popoutInput.name == 'quantity' && !currentTarget.nextSibling) {
              this.classList.add(classes$F.active);
            }

            if (targetAttribute && targetAttribute.hasAttribute(`${attributes$x.ariaCurrent}`)) {
              targetAttribute.removeAttribute(`${attributes$x.ariaCurrent}`);
              evt.currentTarget.setAttribute(`${attributes$x.ariaCurrent}`, 'true');
            }

            if (attrValue !== '') {
              this.popoutToggleText.innerHTML = attrValue;

              if (this.popoutToggleText.hasAttribute(attributes$x.popoutToggleText) && this.popoutToggleText.getAttribute(attributes$x.popoutToggleText) !== '') {
                this.popoutToggleText.setAttribute(attributes$x.popoutToggleText, attrValue);
              }
            }
            this.onPopupToggleFocusout(evt);
            this.onPopupListFocusout(evt);
          }
        }
      }

      onKeyUp(evt) {
        if (evt.code !== 'Escape') {
          return;
        }
        this._hideList();
        this.popoutToggle.focus();
      }

      onBodyClick(evt) {
        const isOption = this.contains(evt.target);
        const isVisible = this.popoutList.classList.contains(classes$F.listVisible);

        if (isVisible && !isOption) {
          this._hideList();
        }
      }

      _connectToggle() {
        this.popoutToggle.addEventListener('click', this.popupToggleClickEvent);
      }

      _connectOptions() {
        if (this.popoutOptions.length) {
          this.popoutOptions.forEach((element) => {
            element.addEventListener('click', (evt) => this.popupOptionsClick(evt));
          });
        }
      }

      _onFocusOut() {
        this.addEventListener('keyup', this.keyUpEvent);
        this.popoutToggle.addEventListener('focusout', this.popupToggleFocusoutEvent);
        this.popoutList.addEventListener('focusout', this.popupListFocusoutEvent);
      }

      _submitForm() {
        const form = this.closest('form');
        if (form) {
          form.submit();
        }
      }

      _hideList() {
        this.popoutList.classList.remove(classes$F.listVisible);
        this.popoutToggle.setAttribute(attributes$x.ariaExpanded, false);
        this.toggleListPosition();
        document.body.removeEventListener('click', this.bodyClickEvent);
      }
    }

    class QuantityCounter extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.input = this.querySelector('input');
        this.changeEvent = new Event('change', {bubbles: true});
        this.buttonClickEvent = this.onButtonClick.bind(this);
        this.onQuantityChangeEvent = this.onQuantityChange.bind(this);

        this.input.addEventListener('change', this.onQuantityChangeEvent);
        this.querySelectorAll('button').forEach((button) => button.addEventListener('click', this.buttonClickEvent));
      }

      onButtonClick(event) {
        event.preventDefault();
        const previousValue = this.input.value;
        const button = event.target.nodeName == 'BUTTON' ? event.target : event.target.closest('button');

        if (button.name === 'increase') this.input.stepUp();
        if (button.name === 'decrease') this.input.stepDown();
        if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
      }

      onQuantityChange() {
        // Trigger cart update event if line item quantity is changed
        if (this.input.name == 'updates[]') {
          this.updateCart();
        }
      }

      updateCart() {
        if (this.quantityValue === '') return;

        this.dispatchEvent(
          new CustomEvent('theme:cart:update', {
            bubbles: true,
            detail: {
              id: this.input.dataset.id,
              quantity: this.input.value,
            },
          })
        );
      }
    }

    const selectors$T = {
      aos: '[data-aos]:not(.aos-animate)',
      aosAnchor: '[data-aos-anchor]',
      aosIndividual: '[data-aos]:not([data-aos-anchor]):not(.aos-animate)',
    };

    const classes$E = {
      aosAnimate: 'aos-animate',
    };

    const observerConfig = {
      attributes: false,
      childList: true,
      subtree: true,
    };

    let anchorContainers = [];

    const mutationCallback = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          const element = mutation.target;
          const elementsToAnimate = element.querySelectorAll(selectors$T.aos);
          const anchors = element.querySelectorAll(selectors$T.aosAnchor);

          if (elementsToAnimate.length) {
            elementsToAnimate.forEach((element) => {
              aosItemObserver.observe(element);
            });
          }

          if (anchors.length) {
            // Get all anchors and attach observers
            initAnchorObservers(anchors);
          }
        }
      }
    };

    /*
      Observe each element that needs to be animated
    */
    const aosItemObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(classes$E.aosAnimate);

            // Stop observing element after it was animated
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    /*
      Observe anchor elements
    */
    const aosAnchorObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio) {
            const elementsToAnimate = entry.target.querySelectorAll(selectors$T.aos);

            if (elementsToAnimate.length) {
              elementsToAnimate.forEach((item) => {
                item.classList.add(classes$E.aosAnimate);
              });
            }

            // Stop observing anchor element after inner elements were animated
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    /*
      Watch for mutations in the body and start observing the newly added animated elements and anchors
    */
    function bodyMutationObserver() {
      const bodyObserver = new MutationObserver(mutationCallback);
      bodyObserver.observe(document.body, observerConfig);
    }

    /*
      Observe animated elements that have attribute [data-aos]
    */
    function elementsIntersectionObserver() {
      const elementsToAnimate = document.querySelectorAll(selectors$T.aosIndividual);

      if (elementsToAnimate.length) {
        elementsToAnimate.forEach((element) => {
          aosItemObserver.observe(element);
        });
      }
    }

    /*
      Observe animated elements that have attribute [data-aos]
    */
    function anchorsIntersectionObserver() {
      const anchors = document.querySelectorAll(selectors$T.aosAnchor);

      if (anchors.length) {
        // Get all anchors and attach observers
        initAnchorObservers(anchors);
      }
    }

    function initAnchorObservers(anchors) {
      if (!anchors.length) return;

      anchors.forEach((anchor) => {
        const containerId = anchor.dataset.aosAnchor;

        // Avoid adding multiple observers to the same element
        if (containerId && anchorContainers.indexOf(containerId) === -1) {
          const container = document.querySelector(containerId);

          if (container) {
            aosAnchorObserver.observe(container);
            anchorContainers.push(containerId);
          }
        }
      });
    }

    function initAnimations() {
      elementsIntersectionObserver();
      anchorsIntersectionObserver();
      bodyMutationObserver();

      // Remove unloaded section from the anchors array on section:unload event
      document.addEventListener('shopify:section:unload', (e) => {
        const sectionId = '#' + e.target.querySelector('[data-section-id]')?.id;
        const sectionIndex = anchorContainers.indexOf(sectionId);

        if (sectionIndex !== -1) {
          anchorContainers.splice(sectionIndex, 1);
        }
      });
    }

    const selectors$S = {
      deferredMediaButton: '[data-deferred-media-button]',
      media: 'video, model-viewer, iframe',
      youtube: '[data-host="youtube"]',
      vimeo: '[data-host="vimeo"]',
      productGridItem: '[data-grid-item]',
      section: '.shopify-section',
      template: 'template',
      video: 'video',
      productModel: 'product-model',
    };

    const attributes$w = {
      loaded: 'loaded',
      autoplay: 'autoplay',
    };

    class DeferredMedia extends HTMLElement {
      constructor() {
        super();
        const poster = this.querySelector(selectors$S.deferredMediaButton);
        poster?.addEventListener('click', this.loadContent.bind(this));
        this.section = this.closest(selectors$S.section);
        this.productGridItem = this.closest(selectors$S.productGridItem);
        this.hovered = false;

        this.mouseEnterEvent = () => this.mouseEnterActions();
        this.mouseLeaveEvent = () => this.mouseLeaveActions();
      }

      connectedCallback() {
        if (this.productGridItem) {
          this.section.addEventListener('mouseover', this.mouseOverEvent, {once: true});

          this.addEventListener('mouseenter', this.mouseEnterEvent);

          this.addEventListener('mouseleave', this.mouseLeaveEvent);
        }
      }

      disconnectedCallback() {
        if (this.productGridItem) {
          this.section.removeEventListener('mouseover', this.mouseOverEvent, {once: true});

          this.removeEventListener('mouseenter', this.mouseEnterEvent);

          this.removeEventListener('mouseleave', this.mouseLeaveEvent);
        }
      }

      mouseEnterActions() {
        this.hovered = true;

        this.videoActions();

        if (!this.getAttribute(attributes$w.loaded)) {
          this.loadContent();
        }
      }

      mouseLeaveActions() {
        this.hovered = false;

        this.videoActions();
      }

      videoActions() {
        if (this.getAttribute(attributes$w.loaded)) {
          const youtube = this.querySelector(selectors$S.youtube);
          const vimeo = this.querySelector(selectors$S.vimeo);
          const mediaExternal = youtube || vimeo;
          const mediaNative = this.querySelector(selectors$S.video);
          if (mediaExternal) {
            let action = this.hovered ? 'playVideo' : 'pauseVideo';
            let string = `{"event":"command","func":"${action}","args":""}`;

            if (vimeo) {
              action = this.hovered ? 'play' : 'pause';
              string = `{"method":"${action}"}`;
            }

            mediaExternal.contentWindow.postMessage(string, '*');

            mediaExternal.addEventListener('load', (e) => {
              // Call videoActions() again when iframe is loaded to prevent autoplay being triggered if it loads after the "mouseleave" event
              this.videoActions();
            });
          } else if (mediaNative) {
            if (this.hovered) {
              mediaNative.play();
            } else {
              mediaNative.pause();
            }
          }
        }
      }

      loadContent(focus = true) {
        this.pauseAllMedia();

        if (!this.getAttribute(attributes$w.loaded)) {
          const content = document.createElement('div');
          const templateContent = this.querySelector(selectors$S.template).content.firstElementChild.cloneNode(true);
          content.appendChild(templateContent);
          this.setAttribute(attributes$w.loaded, true);

          const mediaElement = this.appendChild(content.querySelector(selectors$S.media));
          if (focus) mediaElement.focus();
          if (mediaElement.nodeName == 'VIDEO' && mediaElement.getAttribute(attributes$w.autoplay)) {
            // Force autoplay on Safari browsers
            mediaElement.play();
          }

          if (this.productGridItem) {
            this.videoActions();
          }
        }
      }

      pauseAllMedia() {
        document.querySelectorAll(selectors$S.youtube).forEach((video) => {
          video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        });
        document.querySelectorAll(selectors$S.vimeo).forEach((video) => {
          video.contentWindow.postMessage('{"method":"pause"}', '*');
        });
        document.querySelectorAll(selectors$S.video).forEach((video) => video.pause());
        document.querySelectorAll(selectors$S.productModel).forEach((model) => {
          if (model.modelViewerUI) model.modelViewerUI.pause();
        });
      }
    }

    /*
      Observe whether or not elements are visible in their container.
      Used for sections with horizontal sliders built by native scrolling
    */

    const classes$D = {
      visible: 'is-visible',
    };

    class IsInView {
      constructor(container, itemSelector) {
        if (!container || !itemSelector) return;

        this.observer = null;
        this.container = container;
        this.itemSelector = itemSelector;

        this.init();
      }

      init() {
        const options = {
          root: this.container,
          threshold: [0.01, 0.5, 0.75, 0.99],
        };

        this.observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio >= 0.99) {
              entry.target.classList.add(classes$D.visible);
            } else {
              entry.target.classList.remove(classes$D.visible);
            }
          });
        }, options);

        this.container.querySelectorAll(this.itemSelector)?.forEach((item) => {
          this.observer.observe(item);
        });
      }

      destroy() {
        this.observer.disconnect();
      }
    }

    const classes$C = {
      dragging: 'is-dragging',
      enabled: 'is-enabled',
      scrolling: 'is-scrolling',
      visible: 'is-visible',
    };

    const selectors$R = {
      image: 'img, svg',
      productImage: '[data-product-image]',
      slide: '[data-grid-item]',
      slider: '[data-grid-slider]',
    };

    class DraggableSlider {
      constructor(sliderElement) {
        this.slider = sliderElement;
        this.isDown = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.velX = 0;
        this.scrollAnimation = null;
        this.isScrolling = false;
        this.duration = 800; // Change this value if you want to increase or decrease the velocity

        this.scrollStep = this.scrollStep.bind(this);
        this.scrollToSlide = this.scrollToSlide.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);

        this.slider.addEventListener('mousedown', this.handleMouseDown);
        this.slider.addEventListener('mouseleave', this.handleMouseLeave);
        this.slider.addEventListener('mouseup', this.handleMouseUp);
        this.slider.addEventListener('mousemove', this.handleMouseMove);
        this.slider.addEventListener('wheel', this.handleMouseWheel, {passive: true});

        this.slider.classList.add(classes$C.enabled);
      }

      handleMouseDown(e) {
        e.preventDefault();
        this.isDown = true;
        this.startX = e.pageX - this.slider.offsetLeft;
        this.scrollLeft = this.slider.scrollLeft;
        this.cancelMomentumTracking();
      }

      handleMouseLeave() {
        if (!this.isDown) return;
        this.isDown = false;
        this.beginMomentumTracking();
      }

      handleMouseUp() {
        this.isDown = false;
        this.beginMomentumTracking();
      }

      handleMouseMove(e) {
        if (!this.isDown) return;
        e.preventDefault();

        const x = e.pageX - this.slider.offsetLeft;
        const ratio = 1; // Increase the number to make it scroll-fast
        const walk = (x - this.startX) * ratio;
        const prevScrollLeft = this.slider.scrollLeft;
        const direction = walk > 0 ? 1 : -1;

        this.slider.classList.add(classes$C.dragging, classes$C.scrolling);
        this.slider.scrollLeft = this.scrollLeft - walk;

        if (this.slider.scrollLeft !== prevScrollLeft) {
          this.velX = this.slider.scrollLeft - prevScrollLeft || direction;
        }
      }

      handleMouseWheel() {
        this.cancelMomentumTracking();
        this.slider.classList.remove(classes$C.scrolling);
      }

      beginMomentumTracking() {
        this.isScrolling = false;
        this.slider.classList.remove(classes$C.dragging);
        this.cancelMomentumTracking();
        this.scrollToSlide();
      }

      cancelMomentumTracking() {
        cancelAnimationFrame(this.scrollAnimation);
      }

      scrollToSlide() {
        if (!this.velX && !this.isScrolling) return;

        const slide = this.slider.querySelector(`${selectors$R.slide}.${classes$C.visible}`);
        if (!slide) return;

        const gap = parseInt(window.getComputedStyle(slide).marginRight) || 0;
        const slideWidth = slide.offsetWidth + gap;
        const targetPosition = slide.offsetLeft;
        const direction = this.velX > 0 ? 1 : -1;
        const slidesToScroll = Math.floor(Math.abs(this.velX) / 100) || 1;

        this.startPosition = this.slider.scrollLeft;
        this.distance = targetPosition - this.startPosition;
        this.startTime = performance.now();
        this.isScrolling = true;

        // Make sure it will move to the next slide if you don't drag far enough
        if (direction < 0 && this.velX < slideWidth) {
          this.distance -= slideWidth * slidesToScroll;
        }

        // Make sure it will move to the previous slide if you don't drag far enough
        if (direction > 0 && this.velX < slideWidth) {
          this.distance += slideWidth * slidesToScroll;
        }

        // Run scroll animation
        this.scrollAnimation = requestAnimationFrame(this.scrollStep);
      }

      scrollStep() {
        const currentTime = performance.now() - this.startTime;
        const scrollPosition = parseFloat(this.easeOutCubic(Math.min(currentTime, this.duration))).toFixed(1);

        this.slider.scrollLeft = scrollPosition;

        if (currentTime < this.duration) {
          this.scrollAnimation = requestAnimationFrame(this.scrollStep);
        } else {
          this.slider.classList.remove(classes$C.scrolling);

          // Reset velocity
          this.velX = 0;
          this.isScrolling = false;
        }
      }

      easeOutCubic(t) {
        t /= this.duration;
        t--;
        return this.distance * (t * t * t + 1) + this.startPosition;
      }

      destroy() {
        this.slider.classList.remove(classes$C.enabled);
        this.slider.removeEventListener('mousedown', this.handleMouseDown);
        this.slider.removeEventListener('mouseleave', this.handleMouseLeave);
        this.slider.removeEventListener('mouseup', this.handleMouseUp);
        this.slider.removeEventListener('mousemove', this.handleMouseMove);
        this.slider.removeEventListener('wheel', this.handleMouseWheel);
      }
    }

    /*
      Trigger event after all animations complete in a specific section
    */
    function waitForAllAnimationsEnd(section) {
      return new Promise((resolve) => {
        const animatedElements = section.querySelectorAll('[data-aos]');
        let animationCount = 0;

        function onAnimationEnd(event) {
          animationCount++;

          if (animationCount === animatedElements.length) {
            // All animations have ended
            resolve();
          }

          event.target.removeEventListener('animationend', onAnimationEnd);
        }

        animatedElements.forEach((element) => {
          element.addEventListener('animationend', onAnimationEnd);
        });
      });
    }

    const selectors$Q = {
      buttonArrow: '[data-button-arrow]',
      collectionImage: '[data-collection-image]',
      columnImage: '[data-column-image]',
      productImage: '[data-product-image]',
      slide: '[data-grid-item]',
      slider: '[data-grid-slider]',
    };

    const attributes$v = {
      buttonPrev: 'data-button-prev',
      buttonNext: 'data-button-next',
      alignArrows: 'align-arrows',
    };

    const classes$B = {
      arrows: 'slider__arrows',
      visible: 'is-visible',
      scrollSnapDisabled: 'scroll-snap-disabled',
    };

    class GridSlider extends HTMLElement {
      constructor() {
        super();

        this.isInitialized = false;
        this.draggableSlider = null;
        this.positionArrows = this.positionArrows.bind(this);
        this.onButtonArrowClick = (e) => this.buttonArrowClickEvent(e);
        this.slidesObserver = null;
        this.firstLastSlidesObserver = null;
        this.isDragging = false;
        this.toggleSlider = this.toggleSlider.bind(this);
      }

      connectedCallback() {
        this.init();
        this.addEventListener('theme:grid-slider:init', this.init);
      }

      init() {
        this.slider = this.querySelector(selectors$Q.slider);
        this.slides = this.querySelectorAll(selectors$Q.slide);
        this.buttons = this.querySelectorAll(selectors$Q.buttonArrow);
        this.slider.classList.add(classes$B.scrollSnapDisabled);
        this.toggleSlider();
        document.addEventListener('theme:resize:width', this.toggleSlider);

        waitForAllAnimationsEnd(this).then(() => {
          this.slider.classList.remove(classes$B.scrollSnapDisabled);
        });
      }

      toggleSlider() {
        const sliderWidth = this.slider.clientWidth;
        const slidesWidth = this.getSlidesWidth();
        const isEnabled = sliderWidth < slidesWidth;

        if (isEnabled && (isDesktop() || !window.theme.touch)) {
          if (this.isInitialized) return;

          this.slidesObserver = new IsInView(this.slider, selectors$Q.slide);

          this.initArrows();
          this.isInitialized = true;

          // Create an instance of DraggableSlider
          this.draggableSlider = new DraggableSlider(this.slider);
        } else {
          this.destroy();
        }
      }

      initArrows() {
        // Create arrow buttons if don't exist
        if (!this.buttons.length) {
          const buttonsWrap = document.createElement('div');
          buttonsWrap.classList.add(classes$B.arrows);
          buttonsWrap.innerHTML = theme.sliderArrows.prev + theme.sliderArrows.next;

          // Append buttons outside the slider element
          this.append(buttonsWrap);
          this.buttons = this.querySelectorAll(selectors$Q.buttonArrow);
          this.buttonPrev = this.querySelector(`[${attributes$v.buttonPrev}]`);
          this.buttonNext = this.querySelector(`[${attributes$v.buttonNext}]`);
        }

        this.toggleArrowsObserver();

        if (this.hasAttribute(attributes$v.alignArrows)) {
          this.positionArrows();
          this.arrowsResizeObserver();
        }

        this.buttons.forEach((buttonArrow) => {
          buttonArrow.addEventListener('click', this.onButtonArrowClick);
        });
      }

      buttonArrowClickEvent(e) {
        e.preventDefault();

        const firstVisibleSlide = this.slider.querySelector(`${selectors$Q.slide}.${classes$B.visible}`);
        let slide = null;

        if (e.target.hasAttribute(attributes$v.buttonPrev)) {
          slide = firstVisibleSlide?.previousElementSibling;
        }

        if (e.target.hasAttribute(attributes$v.buttonNext)) {
          slide = firstVisibleSlide?.nextElementSibling;
        }

        this.goToSlide(slide);
      }

      removeArrows() {
        this.querySelector(`.${classes$B.arrows}`)?.remove();
      }

      // Go to prev/next slide on arrow click
      goToSlide(slide) {
        if (!slide) return;

        this.slider.scrollTo({
          top: 0,
          left: slide.offsetLeft,
          behavior: 'smooth',
        });
      }

      getSlidesWidth() {
        return this.slider.querySelector(selectors$Q.slide)?.clientWidth * this.slider.querySelectorAll(selectors$Q.slide).length;
      }

      toggleArrowsObserver() {
        // Add disable class/attribute on prev/next button

        if (this.buttonPrev && this.buttonNext) {
          const slidesCount = this.slides.length;
          const firstSlide = this.slides[0];
          const lastSlide = this.slides[slidesCount - 1];

          const config = {
            attributes: true,
            childList: false,
            subtree: false,
          };

          const callback = (mutationList) => {
            for (const mutation of mutationList) {
              if (mutation.type === 'attributes') {
                const slide = mutation.target;
                const isDisabled = Boolean(slide.classList.contains(classes$B.visible));

                if (slide == firstSlide) {
                  this.buttonPrev.disabled = isDisabled;
                }

                if (slide == lastSlide) {
                  this.buttonNext.disabled = isDisabled;
                }
              }
            }
          };

          if (firstSlide && lastSlide) {
            this.firstLastSlidesObserver = new MutationObserver(callback);
            this.firstLastSlidesObserver.observe(firstSlide, config);
            this.firstLastSlidesObserver.observe(lastSlide, config);
          }
        }
      }

      positionArrows() {
        const targetElement = this.slider.querySelector(selectors$Q.productImage) || this.slider.querySelector(selectors$Q.collectionImage) || this.slider.querySelector(selectors$Q.columnImage) || this.slider;

        if (!targetElement) return;

        this.style.setProperty('--button-position', `${targetElement.clientHeight / 2}px`);
      }

      arrowsResizeObserver() {
        document.addEventListener('theme:resize:width', this.positionArrows);
      }

      disconnectedCallback() {
        this.destroy();
        document.removeEventListener('theme:resize:width', this.toggleSlider);
      }

      destroy() {
        this.isInitialized = false;
        this.draggableSlider?.destroy();
        this.draggableSlider = null;
        this.slidesObserver?.destroy();
        this.slidesObserver = null;
        this.removeArrows();

        document.removeEventListener('theme:resize:width', this.positionArrows);
      }
    }

    const selectors$P = {
      time: 'time',
      days: '[data-days]',
      hours: '[data-hours]',
      minutes: '[data-minutes]',
      seconds: '[data-seconds]',
      shopifySection: '.shopify-section',
      countdownBlock: '[data-countdown-block]',
      tickerText: '[data-ticker-text]',
    };

    const attributes$u = {
      expirationBehavior: 'data-expiration-behavior',
      clone: 'data-clone',
    };

    const classes$A = {
      showMessage: 'show-message',
      hideCountdown: 'hidden',
    };

    const settings$3 = {
      hideSection: 'hide-section',
      showMessage: 'show-message',
    };

    class CountdownTimer extends HTMLElement {
      constructor() {
        super();

        this.section = this.closest(selectors$P.shopifySection);
        this.countdownParent = this.closest(selectors$P.countdownBlock) || this.section;
        this.expirationBehavior = this.getAttribute(attributes$u.expirationBehavior);

        this.time = this.querySelector(selectors$P.time);
        this.days = this.querySelector(selectors$P.days);
        this.hours = this.querySelector(selectors$P.hours);
        this.minutes = this.querySelector(selectors$P.minutes);
        this.seconds = this.querySelector(selectors$P.seconds);

        // Get the current and expiration dates in Unix timestamp format (milliseconds)
        this.endDate = Date.parse(this.time.dateTime);
        this.daysInMs = 1000 * 60 * 60 * 24;
        this.hoursInMs = this.daysInMs / 24;
        this.minutesInMs = this.hoursInMs / 60;
        this.secondsInMs = this.minutesInMs / 60;

        this.shouldHideOnComplete = this.expirationBehavior === settings$3.hideSection;
        this.shouldShowMessage = this.expirationBehavior === settings$3.showMessage;

        this.update = this.update.bind(this);
      }

      connectedCallback() {
        if (isNaN(this.endDate)) {
          this.onComplete();
          return;
        }

        if (this.endDate <= Date.now()) {
          this.onComplete();
          return;
        }
        // Initial update to avoid showing old time
        this.update();
        // Update the countdown every second
        this.interval = setInterval(this.update, 1000);
      }

      disconnectedCallback() {
        this.stopTimer();
      }

      convertTime(timeInMs) {
        const days = this.formatDigits(parseInt(timeInMs / this.daysInMs, 10));
        timeInMs -= days * this.daysInMs;

        const hours = this.formatDigits(parseInt(timeInMs / this.hoursInMs, 10));
        timeInMs -= hours * this.hoursInMs;

        const minutes = this.formatDigits(parseInt(timeInMs / this.minutesInMs, 10));
        timeInMs -= minutes * this.minutesInMs;

        const seconds = this.formatDigits(parseInt(timeInMs / this.secondsInMs, 10));

        return {
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        };
      }

      // Make numbers less than 10 to appear with a leading zero like 01, 02, 03
      formatDigits(number) {
        if (number < 10) number = '0' + number;
        return number;
      }

      render(timer) {
        this.days.textContent = timer.days;
        this.hours.textContent = timer.hours;
        this.minutes.textContent = timer.minutes;
        this.seconds.textContent = timer.seconds;
      }

      stopTimer() {
        clearInterval(this.interval);
      }

      onComplete() {
        this.render({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        if (this.shouldHideOnComplete) {
          this.countdownParent?.classList.add(classes$A.hideCountdown);
          this.countdownParent?.dispatchEvent(
            new CustomEvent('theme:countdown:hide', {
              detail: {
                element: this,
              },
              bubbles: true,
            })
          );
        }

        if (this.shouldShowMessage) {
          this.classList?.add(classes$A.showMessage);

          // Prevent cloned elements to dispatch events multiple times as it causes call stack
          if (this.closest(selectors$P.tickerText).hasAttribute(attributes$u.clone)) return;

          this.countdownParent?.dispatchEvent(
            new CustomEvent('theme:countdown:expire', {
              bubbles: true,
            })
          );
        }
      }

      // Function to update the countdown
      update() {
        const timeNow = new Date().getTime();
        const timeDiff = this.endDate - timeNow;

        if (timeDiff < 1000) {
          this.stopTimer();
          this.onComplete();
        }

        const timeRemaining = this.convertTime(timeDiff);
        this.render(timeRemaining);
      }
    }

    // Safari requestIdleCallback polyfill
    window.requestIdleCallback =
      window.requestIdleCallback ||
      function (cb) {
        var start = Date.now();
        return setTimeout(function () {
          cb({
            didTimeout: false,
            timeRemaining: function () {
              return Math.max(0, 50 - (Date.now() - start));
            },
          });
        }, 1);
      };
    window.cancelIdleCallback =
      window.cancelIdleCallback ||
      function (id) {
        clearTimeout(id);
      };

    if (window.theme.settings.enableAnimations) {
      initAnimations();
    }

    resizeListener();
    scrollListener();
    isTouch();
    setVars();
    loadedImagesEventHook();

    window.addEventListener('DOMContentLoaded', () => {
      setVarsOnResize();
      ariaToggle(document);
      floatLabels(document);
      wrapElements(document);
      removeLoadingClassFromLoadedImages(document);
      loading();

      requestIdleCallback(() => {
        if (Shopify.visualPreviewMode) {
          document.documentElement.classList.add('preview-mode');
        }
      });
    });

    document.addEventListener('shopify:section:load', (e) => {
      const container = e.target;
      floatLabels(container);
      wrapElements(container);
      ariaToggle(document);
      setVarsOnResize();
    });

    if (!customElements.get('popout-select')) {
      customElements.define('popout-select', Popout);
    }

    if (!customElements.get('quantity-counter')) {
      customElements.define('quantity-counter', QuantityCounter);
    }

    if (!customElements.get('predictive-search')) {
      customElements.define('predictive-search', PredictiveSearch);
    }

    if (!customElements.get('deferred-media')) {
      customElements.define('deferred-media', DeferredMedia);
    }

    if (!customElements.get('grid-slider')) {
      customElements.define('grid-slider', GridSlider);
    }

    if (!customElements.get('countdown-timer')) {
      customElements.define('countdown-timer', CountdownTimer);
    }

    const showElement = (elem, removeProp = false, prop = 'block') => {
      if (elem) {
        if (removeProp) {
          elem.style.removeProperty('display');
        } else {
          elem.style.display = prop;
        }
      }
    };

    Shopify.Products = (function () {
      const config = {
        howManyToShow: 4,
        howManyToStoreInMemory: 10,
        wrapperId: 'recently-viewed-products',
        section: null,
        target: 'api-product-grid-item',
        onComplete: null,
      };

      let productHandleQueue = [];
      let wrapper = null;
      let howManyToShowItems = null;

      const today = new Date();
      const expiresDate = new Date();
      const daysToExpire = 90;
      expiresDate.setTime(today.getTime() + 3600000 * 24 * daysToExpire);

      const cookie = {
        configuration: {
          expires: expiresDate.toGMTString(),
          path: '/',
          domain: window.location.hostname,
          sameSite: 'none',
          secure: true,
        },
        name: 'shopify_recently_viewed',
        write: function (recentlyViewed) {
          const recentlyViewedString = encodeURIComponent(recentlyViewed.join(' '));
          document.cookie = `${this.name}=${recentlyViewedString}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}; sameSite=${this.configuration.sameSite}; secure=${this.configuration.secure}`;
        },
        read: function () {
          let recentlyViewed = [];
          let cookieValue = null;

          if (document.cookie.indexOf('; ') !== -1 && document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
            cookieValue = document.cookie
              .split('; ')
              .find((row) => row.startsWith(this.name))
              .split('=')[1];
          }

          if (cookieValue !== null) {
            recentlyViewed = decodeURIComponent(cookieValue).split(' ');
          }

          return recentlyViewed;
        },
        destroy: function () {
          const cookieVal = null;
          document.cookie = `${this.name}=${cookieVal}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
        },
        remove: function (productHandle) {
          const recentlyViewed = this.read();
          const position = recentlyViewed.indexOf(productHandle);
          if (position !== -1) {
            recentlyViewed.splice(position, 1);
            this.write(recentlyViewed);
          }
        },
      };

      const finalize = (wrapper, section) => {
        showElement(wrapper, true);
        const cookieItemsLength = cookie.read().length;

        if (Shopify.recentlyViewed && howManyToShowItems && cookieItemsLength && cookieItemsLength < howManyToShowItems && wrapper.children.length) {
          let allClassesArr = [];
          let addClassesArr = [];
          let objCounter = 0;
          for (const property in Shopify.recentlyViewed) {
            objCounter += 1;
            const objString = Shopify.recentlyViewed[property];
            const objArr = objString.split(' ');
            const propertyIdx = parseInt(property.split('_')[1]);
            allClassesArr = [...allClassesArr, ...objArr];

            if (cookie.read().length === propertyIdx || (objCounter === Object.keys(Shopify.recentlyViewed).length && !addClassesArr.length)) {
              addClassesArr = [...addClassesArr, ...objArr];
            }
          }

          for (let i = 0; i < wrapper.children.length; i++) {
            const element = wrapper.children[i];
            if (allClassesArr.length) {
              element.classList.remove(...allClassesArr);
            }

            if (addClassesArr.length) {
              element.classList.add(...addClassesArr);
            }
          }
        }

        // If we have a callback.
        if (config.onComplete) {
          try {
            config.onComplete(wrapper, section);
          } catch (error) {
            console.log(error);
          }
        }
      };

      const moveAlong = (shown, productHandleQueue, wrapper, section, target, howManyToShow) => {
        if (productHandleQueue.length && shown < howManyToShow) {
          fetch(`${window.theme.routes.root}products/${productHandleQueue[0]}?section_id=${target}`)
            .then((response) => response.text())
            .then((product) => {
              const aosDelay = shown * 100;
              const aosAnchor = wrapper.id ? `#${wrapper.id}` : '';
              const fresh = document.createElement('div');
              let productReplaced = product;
              productReplaced = productReplaced.includes('||itemAnimationDelay||') ? productReplaced.replaceAll('||itemAnimationDelay||', aosDelay) : productReplaced;
              productReplaced = productReplaced.includes('||itemAnimationAnchor||') ? productReplaced.replaceAll('||itemAnimationAnchor||', aosAnchor) : productReplaced;
              fresh.innerHTML = productReplaced;

              wrapper.innerHTML += fresh.querySelector('[data-api-content]').innerHTML;

              productHandleQueue.shift();
              shown++;
              moveAlong(shown, productHandleQueue, wrapper, section, target, howManyToShow);
            })
            .catch(() => {
              cookie.remove(productHandleQueue[0]);
              productHandleQueue.shift();
              moveAlong(shown, productHandleQueue, wrapper, section, target, howManyToShow);
            });
        } else {
          finalize(wrapper, section);
        }
      };

      return {
        showRecentlyViewed: function (params) {
          const paramsNew = params || {};
          const shown = 0;

          // Update defaults.
          Object.assign(config, paramsNew);

          // Read cookie.
          productHandleQueue = cookie.read();

          // Element where to insert.
          wrapper = document.querySelector(`#${config.wrapperId}`);

          // How many products to show.
          howManyToShowItems = config.howManyToShow;
          config.howManyToShow = Math.min(productHandleQueue.length, config.howManyToShow);

          // If we have any to show.
          if (config.howManyToShow && wrapper) {
            // Getting each product with an Ajax call and rendering it on the page.
            moveAlong(shown, productHandleQueue, wrapper, config.section, config.target, howManyToShowItems);
          }
        },

        getConfig: function () {
          return config;
        },

        clearList: function () {
          cookie.destroy();
        },

        recordRecentlyViewed: function (params) {
          const paramsNew = params || {};

          // Update defaults.
          Object.assign(config, paramsNew);

          // Read cookie.
          let recentlyViewed = cookie.read();

          // If we are on a product page.
          if (window.location.pathname.indexOf('/products/') !== -1) {
            // What is the product handle on this page.
            let productHandle = decodeURIComponent(window.location.pathname)
              .match(
                /\/products\/([a-z0-9\-]|[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|[\u203B]|[\w\u0430-\u044f]|[\u0400-\u04FF]|[\u0900-\u097F]|[\u0590-\u05FF\u200f\u200e]|[\u0621-\u064A\u0660-\u0669 ])+/
              )[0]
              .split('/products/')[1];

            if (config.handle) {
              productHandle = config.handle;
            }

            // In what position is that product in memory.
            const position = recentlyViewed.indexOf(productHandle);

            // If not in memory.
            if (position === -1) {
              // Add product at the start of the list.
              recentlyViewed.unshift(productHandle);
              // Only keep what we need.
              recentlyViewed = recentlyViewed.splice(0, config.howManyToStoreInMemory);
            } else {
              // Remove the product and place it at start of list.
              recentlyViewed.splice(position, 1);
              recentlyViewed.unshift(productHandle);
            }

            // Update cookie.
            cookie.write(recentlyViewed);
          }
        },

        hasProducts: cookie.read().length > 0,
      };
    })();

    const classes$z = {
      focus: 'is-focused',
    };

    const selectors$O = {
      inPageLink: '[data-skip-content]',
      linkesWithOnlyHash: 'a[href="#"]',
    };

    class Accessibility {
      constructor() {
        this.init();
      }

      init() {
        this.a11y = a11y;

        // DOM Elements
        this.html = document.documentElement;
        this.body = document.body;
        this.inPageLink = document.querySelector(selectors$O.inPageLink);
        this.linkesWithOnlyHash = document.querySelectorAll(selectors$O.linkesWithOnlyHash);

        // A11Y init methods
        this.a11y.focusHash();
        this.a11y.bindInPageLinks();

        // Events
        this.clickEvents();
        this.focusEvents();
      }

      /**
       * Clicked events accessibility
       *
       * @return  {Void}
       */

      clickEvents() {
        if (this.inPageLink) {
          this.inPageLink.addEventListener('click', (event) => {
            event.preventDefault();
          });
        }

        if (this.linkesWithOnlyHash) {
          this.linkesWithOnlyHash.forEach((item) => {
            item.addEventListener('click', (event) => {
              event.preventDefault();
            });
          });
        }
      }

      /**
       * Focus events
       *
       * @return  {Void}
       */

      focusEvents() {
        document.addEventListener('mousedown', () => {
          this.body.classList.remove(classes$z.focus);
        });

        document.addEventListener('keyup', (event) => {
          if (event.code !== 'Tab') {
            return;
          }

          this.body.classList.add(classes$z.focus);
        });
      }
    }

    window.accessibility = new Accessibility();

    /**
     * Currency Helpers
     * -----------------------------------------------------------------------------
     * A collection of useful functions that help with currency formatting
     *
     * Current contents
     * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
     *
     */

    const moneyFormat = '${{amount}}';

    /**
     * Format money values based on your shop currency settings
     * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
     * or 3.00 dollars
     * @param  {String} format - shop money_format setting
     * @return {String} value - formatted value
     */
    function formatMoney(cents, format) {
      if (typeof cents === 'string') {
        cents = cents.replace('.', '');
      }
      let value = '';
      const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      const formatString = format || moneyFormat;

      function formatWithDelimiters(number, precision = 2, thousands = ',', decimal = '.') {
        if (isNaN(number) || number == null) {
          return 0;
        }

        number = (number / 100.0).toFixed(precision);

        const parts = number.split('.');
        const dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousands}`);
        const centsAmount = parts[1] ? decimal + parts[1] : '';

        return dollarsAmount + centsAmount;
      }

      switch (formatString.match(placeholderRegex)[1]) {
        case 'amount':
          value = formatWithDelimiters(cents, 2);
          break;
        case 'amount_no_decimals':
          value = formatWithDelimiters(cents, 0);
          break;
        case 'amount_with_comma_separator':
          value = formatWithDelimiters(cents, 2, '.', ',');
          break;
        case 'amount_no_decimals_with_comma_separator':
          value = formatWithDelimiters(cents, 0, '.', ',');
          break;
        case 'amount_with_apostrophe_separator':
          value = formatWithDelimiters(cents, 2, "'", '.');
          break;
        case 'amount_no_decimals_with_space_separator':
          value = formatWithDelimiters(cents, 0, ' ', '');
          break;
        case 'amount_with_space_separator':
          value = formatWithDelimiters(cents, 2, ' ', ',');
          break;
        case 'amount_with_period_and_space_separator':
          value = formatWithDelimiters(cents, 2, ' ', '.');
          break;
      }

      return formatString.replace(placeholderRegex, value);
    }

    const throttle = (fn, wait) => {
      let prev, next;
      return function invokeFn(...args) {
        const now = Date.now();
        next = clearTimeout(next);
        if (!prev || now - prev >= wait) {
          // eslint-disable-next-line prefer-spread
          fn.apply(null, args);
          prev = now;
        } else {
          next = setTimeout(invokeFn.bind(null, ...args), wait - (now - prev));
        }
      };
    };

    function FetchError(object) {
      this.status = object.status || null;
      this.headers = object.headers || null;
      this.json = object.json || null;
      this.body = object.body || null;
    }
    FetchError.prototype = Error.prototype;

    const classes$y = {
      animated: 'is-animated',
      active: 'is-active',
      added: 'is-added',
      disabled: 'is-disabled',
      empty: 'is-empty',
      error: 'has-error',
      headerStuck: 'js__header__stuck',
      hidden: 'is-hidden',
      hiding: 'is-hiding',
      loading: 'is-loading',
      open: 'is-open',
      removed: 'is-removed',
      success: 'is-success',
      visible: 'is-visible',
      expanded: 'is-expanded',
      updated: 'is-updated',
      variantSoldOut: 'variant--soldout',
      variantUnavailable: 'variant--unavailable',
    };

    const selectors$N = {
      apiContent: '[data-api-content]',
      apiLineItems: '[data-api-line-items]',
      apiUpsellItems: '[data-api-upsell-items]',
      apiCartPrice: '[data-api-cart-price]',
      animation: '[data-animation]',
      additionalCheckoutButtons: '.additional-checkout-buttons',
      buttonSkipUpsellProduct: '[data-skip-upsell-product]',
      cartBarAdd: '[data-add-to-cart-bar]',
      cartCloseError: '[data-cart-error-close]',
      cartDrawer: 'cart-drawer',
      cartDrawerClose: '[data-cart-drawer-close]',
      cartEmpty: '[data-cart-empty]',
      cartErrors: '[data-cart-errors]',
      cartItemRemove: '[data-item-remove]',
      cartPage: '[data-cart-page]',
      cartForm: '[data-cart-form]',
      cartTermsCheckbox: '[data-cart-acceptance-checkbox]',
      cartCheckoutButtonWrapper: '[data-cart-checkout-buttons]',
      cartCheckoutButton: '[data-cart-checkout-button]',
      cartTotal: '[data-cart-total]',
      checkoutButtons: '[data-checkout-buttons]',
      errorMessage: '[data-error-message]',
      formCloseError: '[data-close-error]',
      formErrorsContainer: '[data-cart-errors-container]',
      formWrapper: '[data-form-wrapper]',
      freeShipping: '[data-free-shipping]',
      freeShippingGraph: '[data-progress-graph]',
      freeShippingProgress: '[data-progress-bar]',
      headerWrapper: '[data-header-wrapper]',
      item: '[data-item]',
      itemsHolder: '[data-items-holder]',
      leftToSpend: '[data-left-to-spend]',
      navDrawer: '[data-drawer]',
      outerSection: '[data-section-id]',
      priceHolder: '[data-cart-price-holder]',
      quickAddHolder: '[data-quick-add-holder]',
      quickAddModal: '[data-quick-add-modal]',
      qtyInput: 'input[name="updates[]"]',
      upsellProductsHolder: '[data-upsell-products]',
      upsellWidget: '[data-upsell-widget]',
      termsErrorMessage: '[data-terms-error-message]',
      collapsibleBody: '[data-collapsible-body]',
      recentlyViewedHolderId: 'recently-viewed-products-cart',
    };

    const attributes$t = {
      cartTotal: 'data-cart-total',
      disabled: 'disabled',
      freeShipping: 'data-free-shipping',
      freeShippingLimit: 'data-free-shipping-limit',
      item: 'data-item',
      itemIndex: 'data-item-index',
      itemTitle: 'data-item-title',
      open: 'open',
      quickAddHolder: 'data-quick-add-holder',
      quickAddVariant: 'data-quick-add-variant',
      scrollLocked: 'data-scroll-locked',
      upsellAutoOpen: 'data-upsell-auto-open',
    };

    class CartItems extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        // DOM Elements
        this.cartPage = document.querySelector(selectors$N.cartPage);
        this.cartForm = document.querySelector(selectors$N.cartForm);
        this.cartDrawer = document.querySelector(selectors$N.cartDrawer);

        this.cartEmpty = document.querySelector(selectors$N.cartEmpty);
        this.cartTermsCheckbox = document.querySelector(selectors$N.cartTermsCheckbox);
        this.cartCheckoutButtonWrapper = document.querySelector(selectors$N.cartCheckoutButtonWrapper);
        this.cartCheckoutButton = document.querySelector(selectors$N.cartCheckoutButton);
        this.checkoutButtons = document.querySelector(selectors$N.checkoutButtons);
        this.itemsHolder = document.querySelector(selectors$N.itemsHolder);
        this.priceHolder = document.querySelector(selectors$N.priceHolder);
        this.items = document.querySelectorAll(selectors$N.item);
        this.cartTotal = document.querySelector(selectors$N.cartTotal);
        this.freeShipping = document.querySelectorAll(selectors$N.freeShipping);
        this.cartErrorHolder = document.querySelector(selectors$N.cartErrors);
        this.cartCloseErrorMessage = document.querySelector(selectors$N.cartCloseError);
        this.headerWrapper = document.querySelector(selectors$N.headerWrapper);
        this.navDrawer = document.querySelector(selectors$N.navDrawer);
        this.upsellProductsHolder = document.querySelector(selectors$N.upsellProductsHolder);
        this.subtotal = window.theme.subtotal;

        // Define Cart object depending on if we have cart drawer or cart page
        this.cart = this.cartDrawer || this.cartPage;

        // Cart events
        this.animateItems = this.animateItems.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.cartAddEvent = this.cartAddEvent.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.onCartDrawerClose = this.onCartDrawerClose.bind(this);

        // Set global event listeners for "Add to cart" and Announcement bar wheel progress
        document.addEventListener('theme:cart:add', this.cartAddEvent);
        document.addEventListener('theme:cart-drawer:open', this.animateItems);
        document.addEventListener('theme:cart-drawer:close', this.onCartDrawerClose);
        document.addEventListener('theme:announcement:init', this.updateProgress);

        // Upsell products
        this.skipUpsellProductsArray = [];
        this.skipUpsellProductEvent();
        this.checkSkippedUpsellProductsFromStorage();
        this.toggleCartUpsellWidgetVisibility();

        // Free Shipping values
        this.circumference = 28 * Math.PI; // radius - stroke * 4 * PI
        this.freeShippingLimit = this.freeShipping.length ? Number(this.freeShipping[0].getAttribute(attributes$t.freeShippingLimit)) * 100 * window.Shopify.currency.rate : 0;

        this.freeShippingMessageHandle(this.subtotal);
        this.updateProgress();

        // Don't run any cart JS if Cart drawer is disabled and you are not on the Cart page
        if (!this.cart) return;

        this.build = this.build.bind(this);
        this.updateCart = this.updateCart.bind(this);
        this.productAddCallback = this.productAddCallback.bind(this);
        this.formSubmitHandler = throttle(this.formSubmitHandler.bind(this), 50);

        if (this.cartPage) {
          this.animateItems();
        }

        // Recently viewed products
        this.recentlyViewedProducts();

        // Checking
        this.hasItemsInCart = this.hasItemsInCart.bind(this);
        this.cartCount = this.getCartItemCount();

        // Set classes
        this.toggleClassesOnContainers = this.toggleClassesOnContainers.bind(this);

        // Flags
        this.totalItems = this.items.length;

        this.cartUpdateFailed = false;

        // Cart Events
        this.cartEvents();
        this.cartRemoveEvents();
        this.cartUpdateEvents();

        document.addEventListener('theme:product:add', this.productAddCallback);
        document.addEventListener('theme:product:add-error', this.productAddCallback);

        document.dispatchEvent(new CustomEvent('theme:cart:load', {bubbles: true}));
      }

      disconnectedCallback() {
        document.removeEventListener('theme:cart:add', this.cartAddEvent);
        document.removeEventListener('theme:announcement:init', this.updateProgress);
        document.removeEventListener('theme:product:add', this.productAddCallback);
        document.removeEventListener('theme:product:add-error', this.productAddCallback);

        document.dispatchEvent(new CustomEvent('theme:cart:unload', {bubbles: true}));

        if (document.documentElement.hasAttribute(attributes$t.scrollLocked)) {
          document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
        }
      }

      onCartDrawerClose() {
        this.resetAnimatedItems();

        if (this.cartDrawer?.classList.contains(classes$y.open)) {
          this.cart.classList.remove(classes$y.updated);
        }

        this.cartEmpty.classList.remove(classes$y.updated);
        this.cartErrorHolder.classList.remove(classes$y.expanded);
        this.cart.querySelectorAll(selectors$N.animation).forEach((item) => {
          const removeHidingClass = () => {
            item.classList.remove(classes$y.hiding);
            item.removeEventListener('animationend', removeHidingClass);
          };

          item.classList.add(classes$y.hiding);
          item.addEventListener('animationend', removeHidingClass);
        });
      }

      /**
       * Cart update event hook
       *
       * @return  {Void}
       */

      cartUpdateEvents() {
        this.items = document.querySelectorAll(selectors$N.item);

        this.items.forEach((item) => {
          item.addEventListener('theme:cart:update', (event) => {
            this.updateCart(
              {
                id: event.detail.id,
                quantity: event.detail.quantity,
              },
              item
            );
          });
        });
      }

      /**
       * Cart events
       *
       * @return  {Void}
       */

      cartRemoveEvents() {
        const cartItemRemove = document.querySelectorAll(selectors$N.cartItemRemove);

        cartItemRemove.forEach((button) => {
          const item = button.closest(selectors$N.item);
          button.addEventListener('click', (event) => {
            event.preventDefault();

            if (button.classList.contains(classes$y.disabled)) return;

            this.updateCart(
              {
                id: button.dataset.id,
                quantity: 0,
              },
              item
            );
          });
        });

        if (this.cartCloseErrorMessage) {
          this.cartCloseErrorMessage.addEventListener('click', (event) => {
            event.preventDefault();

            this.cartErrorHolder.classList.remove(classes$y.expanded);
          });
        }
      }

      /**
       * Cart event add product to cart
       *
       * @return  {Void}
       */

      cartAddEvent(event) {
        let formData = '';
        let button = event.detail.button;

        if (button.hasAttribute('disabled')) return;
        const form = button.closest('form');
        // Validate form
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        formData = new FormData(form);
        if (form !== null && form.querySelector('[type="file"]')) {
          return;
        }
        event.preventDefault();
        this.addToCart(formData, button);
      }

      /**
       * Cart events
       *
       * @return  {Void}
       */

      cartEvents() {
        if (this.cartTermsCheckbox) {
          this.cartTermsCheckbox.removeEventListener('change', this.formSubmitHandler);
          this.cartCheckoutButtonWrapper.removeEventListener('click', this.formSubmitHandler);
          this.cartForm.removeEventListener('submit', this.formSubmitHandler);

          this.cartTermsCheckbox.addEventListener('change', this.formSubmitHandler);
          this.cartCheckoutButtonWrapper.addEventListener('click', this.formSubmitHandler);
          this.cartForm.addEventListener('submit', this.formSubmitHandler);
        }
      }

      formSubmitHandler() {
        const termsAccepted = document.querySelector(selectors$N.cartTermsCheckbox).checked;
        const termsError = document.querySelector(selectors$N.termsErrorMessage);

        // Disable form submit if terms and conditions are not accepted
        if (!termsAccepted) {
          if (document.querySelector(selectors$N.termsErrorMessage).length > 0) {
            return;
          }

          termsError.innerText = theme.strings.cartAcceptanceError;
          this.cartCheckoutButton.setAttribute(attributes$t.disabled, true);
          termsError.classList.add(classes$y.expanded);
        } else {
          termsError.classList.remove(classes$y.expanded);
          this.cartCheckoutButton.removeAttribute(attributes$t.disabled);
        }
      }

      /**
       * Cart event remove out of stock error
       *
       * @return  {Void}
       */

      formErrorsEvents(errorContainer) {
        const buttonErrorClose = errorContainer.querySelector(selectors$N.formCloseError);
        buttonErrorClose?.addEventListener('click', (e) => {
          e.preventDefault();

          if (errorContainer) {
            errorContainer.classList.remove(classes$y.visible);
          }
        });
      }

      /**
       * Get response from the cart
       *
       * @return  {Void}
       */

      getCart() {
        fetch(theme.routes.cart_url + '?section_id=api-cart-items')
          .then(this.cartErrorsHandler)
          .then((response) => response.text())
          .then((response) => {
            const element = document.createElement('div');
            element.innerHTML = response;

            const cleanResponse = element.querySelector(selectors$N.apiContent);
            this.build(cleanResponse);
          })
          .catch((error) => console.log(error));
      }

      /**
       * Add item(s) to the cart and show the added item(s)
       *
       * @param   {String}  formData
       * @param   {DOM Element}  button
       *
       * @return  {Void}
       */

      addToCart(formData, button) {
        if (this.cart) {
          this.cart.classList.add(classes$y.loading);
        }

        const quickAddHolder = button?.closest(selectors$N.quickAddHolder);

        if (button) {
          button.classList.add(classes$y.loading);
          button.disabled = true;
        }

        if (quickAddHolder) {
          quickAddHolder.classList.add(classes$y.visible);
        }

        fetch(theme.routes.cart_add_url, {
          method: 'POST',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/javascript',
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              this.addToCartError(response, button);

              if (button) {
                button.classList.remove(classes$y.loading);
                button.disabled = false;
              }

              return;
            }

            if (this.cart) {
              if (button) {
                button.classList.remove(classes$y.loading);
                button.classList.add(classes$y.added);

                button.dispatchEvent(
                  new CustomEvent('theme:product:add', {
                    detail: {
                      response: response,
                      button: button,
                    },
                    bubbles: true,
                  })
                );
              }

              this.getCart();
            } else {
              // Redirect to cart page if "Add to cart" is successful
              window.location = theme.routes.cart_url;
            }
          })
          .catch((error) => {
            this.addToCartError(error, button);
            this.enableCartButtons();
          });
      }

      /**
       * Update cart
       *
       * @param   {Object}  updateData
       *
       * @return  {Void}
       */

      updateCart(updateData = {}, currentItem = null) {
        this.cart.classList.add(classes$y.loading);

        let updatedQuantity = updateData.quantity;
        if (currentItem !== null) {
          if (updatedQuantity) {
            currentItem.classList.add(classes$y.loading);
          } else {
            currentItem.classList.add(classes$y.removed);
          }
        }
        this.disableCartButtons();

        const newItem = this.cart.querySelector(`[${attributes$t.item}="${updateData.id}"]`) || currentItem;
        const lineIndex = newItem?.hasAttribute(attributes$t.itemIndex) ? parseInt(newItem.getAttribute(attributes$t.itemIndex)) : 0;
        const itemTitle = newItem?.hasAttribute(attributes$t.itemTitle) ? newItem.getAttribute(attributes$t.itemTitle) : null;

        if (lineIndex === 0) return;

        const data = {
          line: lineIndex,
          quantity: updatedQuantity,
        };

        fetch(theme.routes.cart_change_url, {
          method: 'post',
          headers: {'Content-Type': 'application/json', Accept: 'application/json'},
          body: JSON.stringify(data),
        })
          .then((response) => {
            return response.text();
          })
          .then((state) => {
            const parsedState = JSON.parse(state);

            if (parsedState.errors) {
              this.cartUpdateFailed = true;
              this.updateErrorText(itemTitle);
              this.toggleErrorMessage();
              this.resetLineItem(currentItem);
              this.enableCartButtons();

              return;
            }

            this.getCart();
          })
          .catch((error) => {
            console.log(error);
            this.enableCartButtons();
          });
      }

      /**
       * Reset line item initial state
       *
       * @return  {Void}
       */
      resetLineItem(item) {
        const qtyInput = item.querySelector(selectors$N.qtyInput);
        const qty = qtyInput.getAttribute('value');
        qtyInput.value = qty;
        item.classList.remove(classes$y.loading);
      }

      /**
       * Disable cart buttons and inputs
       *
       * @return  {Void}
       */
      disableCartButtons() {
        const inputs = this.cart.querySelectorAll('input');
        const buttons = this.cart.querySelectorAll(`button, ${selectors$N.cartItemRemove}`);

        if (inputs.length) {
          inputs.forEach((item) => {
            item.classList.add(classes$y.disabled);
            item.blur();
            item.disabled = true;
          });
        }

        if (buttons.length) {
          buttons.forEach((item) => {
            item.setAttribute(attributes$t.disabled, true);
          });
        }
      }

      /**
       * Enable cart buttons and inputs
       *
       * @return  {Void}
       */
      enableCartButtons() {
        const inputs = this.cart.querySelectorAll('input');
        const buttons = this.cart.querySelectorAll(`button, ${selectors$N.cartItemRemove}`);

        if (inputs.length) {
          inputs.forEach((item) => {
            item.classList.remove(classes$y.disabled);
            item.disabled = false;
          });
        }

        if (buttons.length) {
          buttons.forEach((item) => {
            item.removeAttribute(attributes$t.disabled);
          });
        }

        this.cart.classList.remove(classes$y.loading);
      }

      /**
       * Update error text
       *
       * @param   {String}  itemTitle
       *
       * @return  {Void}
       */

      updateErrorText(itemTitle) {
        this.cartErrorHolder.querySelector(selectors$N.errorMessage).innerText = itemTitle;
      }

      /**
       * Toggle error message
       *
       * @return  {Void}
       */

      toggleErrorMessage() {
        if (!this.cartErrorHolder) return;

        this.cartErrorHolder.classList.toggle(classes$y.expanded, this.cartUpdateFailed);

        // Reset cart error events flag
        this.cartUpdateFailed = false;
      }

      /**
       * Handle errors
       *
       * @param   {Object}  response
       *
       * @return  {Object}
       */

      cartErrorsHandler(response) {
        if (!response.ok) {
          return response.json().then(function (json) {
            const e = new FetchError({
              status: response.statusText,
              headers: response.headers,
              json: json,
            });
            throw e;
          });
        }
        return response;
      }

      /**
       * Add to cart error handle
       *
       * @param   {Object}  data
       * @param   {DOM Element/Null} button
       *
       * @return  {Void}
       */

      addToCartError(data, button) {
        if (button !== null) {
          const outerContainer = button.closest(selectors$N.outerSection) || button.closest(selectors$N.quickAddHolder) || button.closest(selectors$N.quickAddModal);
          let errorContainer = outerContainer?.querySelector(selectors$N.formErrorsContainer);
          const buttonUpsellHolder = button.closest(selectors$N.quickAddHolder);

          if (buttonUpsellHolder && buttonUpsellHolder.querySelector(selectors$N.formErrorsContainer)) {
            errorContainer = buttonUpsellHolder.querySelector(selectors$N.formErrorsContainer);
          }

          if (errorContainer) {
            let errorMessage = `${data.message}: ${data.description}`;

            if (data.message == data.description) {
              errorMessage = data.message;
            }

            errorContainer.innerHTML = `<div class="errors">${errorMessage}<button type="button" class="errors__close" data-close-error><svg aria-hidden="true" focusable="false" role="presentation" width="24px" height="24px" stroke-width="1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" class="icon icon-cancel"><path d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div>`;
            errorContainer.classList.add(classes$y.visible);
            this.formErrorsEvents(errorContainer);
          }

          button.dispatchEvent(
            new CustomEvent('theme:product:add-error', {
              detail: {
                response: data,
                button: button,
              },
              bubbles: true,
            })
          );
        }

        const quickAddHolder = button?.closest(selectors$N.quickAddHolder);

        if (quickAddHolder) {
          quickAddHolder.dispatchEvent(
            new CustomEvent('theme:cart:error', {
              bubbles: true,
              detail: {
                message: data.message,
                description: data.description,
                holder: quickAddHolder,
              },
            })
          );
        }

        this.cart?.classList.remove(classes$y.loading);
      }

      /**
       * Add product to cart events
       *
       * @return  {Void}
       */
      productAddCallback(event) {
        let buttons = [];
        let quickAddHolder = null;
        const hasError = event.type == 'theme:product:add-error';
        const buttonATC = event.detail.button;
        const cartBarButtonATC = document.querySelector(selectors$N.cartBarAdd);

        buttons.push(buttonATC);
        quickAddHolder = buttonATC.closest(selectors$N.quickAddHolder);

        if (cartBarButtonATC) {
          buttons.push(cartBarButtonATC);
        }

        buttons.forEach((button) => {
          button.classList.remove(classes$y.loading);
          if (!hasError) {
            button.classList.add(classes$y.added);
          }
        });

        setTimeout(() => {
          buttons.forEach((button) => {
            button.classList.remove(classes$y.added);
            const isVariantUnavailable =
              button.closest(selectors$N.formWrapper)?.classList.contains(classes$y.variantSoldOut) || button.closest(selectors$N.formWrapper)?.classList.contains(classes$y.variantUnavailable);

            if (!isVariantUnavailable) {
              button.disabled = false;
            }
          });

          quickAddHolder?.classList.remove(classes$y.visible);
        }, 1000);
      }

      /**
       * Toggle classes on different containers and messages
       *
       * @return  {Void}
       */

      toggleClassesOnContainers() {
        const hasItemsInCart = this.hasItemsInCart();

        this.cart.classList.toggle(classes$y.empty, !hasItemsInCart);

        if (!hasItemsInCart) {
          setTimeout(() => {
            trapFocus(this.cartDrawer, {
              elementToFocus: this.cartDrawer.querySelector(selectors$N.cartDrawerClose),
            });
          }, 100);
        }
      }

      /**
       * Build cart depends on results
       *
       * @param   {Object}  data
       *
       * @return  {Void}
       */

      build(data) {
        const cartItemsData = data.querySelector(selectors$N.apiLineItems);
        const upsellItemsData = data.querySelector(selectors$N.apiUpsellItems);
        const cartEmptyData = Boolean(cartItemsData === null && upsellItemsData === null);
        const priceData = data.querySelector(selectors$N.apiCartPrice);
        const cartTotal = data.querySelector(selectors$N.cartTotal);

        if (this.priceHolder && priceData) {
          this.priceHolder.innerHTML = priceData.innerHTML;
        }

        if (cartEmptyData) {
          this.itemsHolder.innerHTML = data.innerHTML;

          if (this.upsellProductsHolder) {
            this.upsellProductsHolder.innerHTML = '';
          }
        } else {
          this.itemsHolder.innerHTML = cartItemsData.innerHTML;

          if (this.upsellProductsHolder) {
            this.upsellProductsHolder.innerHTML = upsellItemsData.innerHTML;
          }

          this.skipUpsellProductEvent();
          this.checkSkippedUpsellProductsFromStorage();
          this.toggleCartUpsellWidgetVisibility();
        }

        this.newTotalItems = cartItemsData && cartItemsData.querySelectorAll(selectors$N.item).length ? cartItemsData.querySelectorAll(selectors$N.item).length : 0;
        this.subtotal = cartTotal && cartTotal.hasAttribute(attributes$t.cartTotal) ? parseInt(cartTotal.getAttribute(attributes$t.cartTotal)) : 0;
        this.cartCount = this.getCartItemCount();

        document.dispatchEvent(
          new CustomEvent('theme:cart:change', {
            bubbles: true,
            detail: {
              cartCount: this.cartCount,
            },
          })
        );

        // Update cart total price
        this.cartTotal.innerHTML = this.subtotal === 0 ? window.theme.strings.free : formatMoney(this.subtotal, theme.moneyWithCurrencyFormat);

        if (this.totalItems !== this.newTotalItems) {
          this.totalItems = this.newTotalItems;

          this.toggleClassesOnContainers();
        }

        // Add class "is-updated" line items holder to reduce cart items animation delay via CSS variables
        if (this.cartDrawer?.classList.contains(classes$y.open)) {
          this.cart.classList.add(classes$y.updated);
        }

        // Remove cart loading class
        this.cart.classList.remove(classes$y.loading);

        // Prepare empty cart buttons for animation
        if (!this.hasItemsInCart()) {
          this.cartEmpty.querySelectorAll(selectors$N.animation).forEach((item) => {
            item.classList.remove(classes$y.animated);
          });
        }

        this.freeShippingMessageHandle(this.subtotal);
        this.cartRemoveEvents();
        this.cartUpdateEvents();
        this.toggleErrorMessage();
        this.enableCartButtons();
        this.updateProgress();
        this.animateItems();

        document.dispatchEvent(
          new CustomEvent('theme:product:added', {
            bubbles: true,
          })
        );
      }

      /**
       * Get cart item count
       *
       * @return  {Void}
       */

      getCartItemCount() {
        return Array.from(this.cart.querySelectorAll(selectors$N.qtyInput)).reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
      }

      /**
       * Check for items in the cart
       *
       * @return  {Void}
       */

      hasItemsInCart() {
        return this.totalItems > 0;
      }

      /**
       * Show/hide free shipping message
       *
       * @param   {Number}  total
       *
       * @return  {Void}
       */

      freeShippingMessageHandle(total) {
        if (!this.freeShipping.length) return;

        this.freeShipping.forEach((message) => {
          const hasQualifiedShippingMessage = message.hasAttribute(attributes$t.freeShipping) && message.getAttribute(attributes$t.freeShipping) === 'true' && total >= 0;
          message.classList.toggle(classes$y.success, hasQualifiedShippingMessage && total >= this.freeShippingLimit);
        });
      }

      /**
       * Update progress when update cart
       *
       * @return  {Void}
       */

      updateProgress() {
        this.freeShipping = document.querySelectorAll(selectors$N.freeShipping);

        if (!this.freeShipping.length) return;

        const percentValue = isNaN(this.subtotal / this.freeShippingLimit) ? 100 : this.subtotal / this.freeShippingLimit;
        const percent = Math.min(percentValue * 100, 100);
        const dashoffset = this.circumference - ((percent / 100) * this.circumference) / 2;
        const leftToSpend = formatMoney(this.freeShippingLimit - this.subtotal, theme.moneyFormat);

        this.freeShipping.forEach((item) => {
          const progressBar = item.querySelector(selectors$N.freeShippingProgress);
          const progressGraph = item.querySelector(selectors$N.freeShippingGraph);
          const leftToSpendMessage = item.querySelector(selectors$N.leftToSpend);

          if (leftToSpendMessage) {
            leftToSpendMessage.innerHTML = leftToSpend.replace('.00', '');
          }

          // Set progress bar value
          if (progressBar) {
            progressBar.value = percent;
          }

          // Set circle progress
          if (progressGraph) {
            progressGraph.style.setProperty('--stroke-dashoffset', `${dashoffset}`);
          }
        });
      }

      /**
       * Skip upsell product
       */
      skipUpsellProductEvent() {
        if (this.upsellProductsHolder === null) {
          return;
        }
        const skipButtons = this.upsellProductsHolder.querySelectorAll(selectors$N.buttonSkipUpsellProduct);

        if (skipButtons.length) {
          skipButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
              event.preventDefault();
              const productID = button.closest(selectors$N.quickAddHolder).getAttribute(attributes$t.quickAddHolder);

              if (!this.skipUpsellProductsArray.includes(productID)) {
                this.skipUpsellProductsArray.push(productID);
              }

              // Add skipped upsell product to session storage
              window.sessionStorage.setItem('skip_upsell_products', this.skipUpsellProductsArray);

              // Remove upsell product from cart
              this.removeUpsellProduct(productID);
              this.toggleCartUpsellWidgetVisibility();
            });
          });
        }
      }

      /**
       * Check for skipped upsell product added to session storage
       */
      checkSkippedUpsellProductsFromStorage() {
        const skippedUpsellItemsFromStorage = window.sessionStorage.getItem('skip_upsell_products');
        if (!skippedUpsellItemsFromStorage) return;

        const skippedUpsellItemsFromStorageArray = skippedUpsellItemsFromStorage.split(',');

        skippedUpsellItemsFromStorageArray.forEach((productID) => {
          if (!this.skipUpsellProductsArray.includes(productID)) {
            this.skipUpsellProductsArray.push(productID);
          }

          this.removeUpsellProduct(productID);
        });
      }

      removeUpsellProduct(productID) {
        if (!this.upsellProductsHolder) return;

        // Remove skipped upsell product from Cart
        const upsellProduct = this.upsellProductsHolder.querySelector(`[${attributes$t.quickAddHolder}="${productID}"]`);

        if (upsellProduct) {
          upsellProduct.parentNode.remove();
        }
      }

      /**
       * Show or hide cart upsell products widget visibility
       */
      toggleCartUpsellWidgetVisibility() {
        if (!this.upsellProductsHolder) return;

        // Hide upsell container if no items
        const upsellItems = this.upsellProductsHolder.querySelectorAll(selectors$N.quickAddHolder);
        const upsellWidget = this.upsellProductsHolder.closest(selectors$N.upsellWidget);

        if (!upsellWidget) return;

        upsellWidget.classList.toggle(classes$y.hidden, !upsellItems.length);

        if (upsellItems.length && !upsellWidget.hasAttribute(attributes$t.open) && upsellWidget.hasAttribute(attributes$t.upsellAutoOpen)) {
          upsellWidget.setAttribute(attributes$t.open, true);
          const upsellWidgetBody = upsellWidget.querySelector(selectors$N.collapsibleBody);

          if (upsellWidgetBody) {
            upsellWidgetBody.style.height = 'auto';
          }
        }
      }

      /**
       * Remove initially added AOS classes to allow animation on cart drawer open
       *
       * @return  {Void}
       */
      resetAnimatedItems() {
        this.cart.querySelectorAll(selectors$N.animation).forEach((item) => {
          item.classList.remove(classes$y.animated);
          item.classList.remove(classes$y.hiding);
        });
      }

      /**
       * Cart elements opening animation
       *
       * @return  {Void}
       */
      animateItems(e) {
        requestAnimationFrame(() => {
          let cart = this.cart;

          if (e && e.detail && e.detail.target) {
            cart = e.detail.target;
          }

          cart?.querySelectorAll(selectors$N.animation).forEach((item) => {
            item.classList.add(classes$y.animated);
          });
        });
      }

      recentlyViewedProducts() {
        const recentlyViewedHolder = this.cart.querySelector(`#${selectors$N.recentlyViewedHolderId}`);
        if (recentlyViewedHolder) {
          Shopify.Products.showRecentlyViewed({
            howManyToShow: 3,
            wrapperId: selectors$N.recentlyViewedHolderId,
            section: this,
            target: 'api-upsell-product',
          });
        }
      }
    }

    if (!customElements.get('cart-items')) {
      customElements.define('cart-items', CartItems);
    }

    const attributes$s = {
      count: 'data-cart-count',
      limit: 'data-limit',
    };

    class CartCount extends HTMLElement {
      constructor() {
        super();

        this.cartCount = null;
        this.limit = this.getAttribute(attributes$s.limit);
        this.onCartChangeCallback = this.onCartChange.bind(this);
      }

      connectedCallback() {
        document.addEventListener('theme:cart:change', this.onCartChangeCallback);
      }

      disconnectedCallback() {
        document.addEventListener('theme:cart:change', this.onCartChangeCallback);
      }

      onCartChange(event) {
        this.cartCount = event.detail.cartCount;
        this.update();
      }

      update() {
        if (this.cartCount !== null) {
          this.setAttribute(attributes$s.count, this.cartCount);
          let countValue = this.cartCount;

          if (this.limit && this.cartCount >= this.limit) {
            countValue = '9+';
          }

          this.innerText = countValue;
        }
      }
    }

    if (!customElements.get('cart-count')) {
      customElements.define('cart-count', CartCount);
    }

    /*
      Trigger event after animation completes
    */
    function waitForAnimationEnd(element) {
      return new Promise((resolve) => {
        function onAnimationEnd(event) {
          if (event.target != element) return;

          element.removeEventListener('animationend', onAnimationEnd);
          resolve();
        }

        element?.addEventListener('animationend', onAnimationEnd);
      });
    }

    const classes$x = {
      open: 'is-open',
      closing: 'is-closing',
      duplicate: 'drawer--duplicate',
      drawerEditorError: 'drawer-editor-error',
    };

    const selectors$M = {
      cartDrawer: 'cart-drawer',
      cartDrawerClose: '[data-cart-drawer-close]',
      cartDrawerSection: '[data-section-type="cart-drawer"]',
      cartDrawerInner: '[data-cart-drawer-inner]',
      shopifySection: '.shopify-section',
    };

    const attributes$r = {
      drawerUnderlay: 'data-drawer-underlay',
    };

    class CartDrawer extends HTMLElement {
      constructor() {
        super();

        this.cartDrawerIsOpen = false;

        this.cartDrawerClose = this.querySelector(selectors$M.cartDrawerClose);
        this.cartDrawerInner = this.querySelector(selectors$M.cartDrawerInner);
        this.openCartDrawer = this.openCartDrawer.bind(this);
        this.closeCartDrawer = this.closeCartDrawer.bind(this);
        this.toggleCartDrawer = this.toggleCartDrawer.bind(this);
        this.openCartDrawerOnProductAdded = this.openCartDrawerOnProductAdded.bind(this);
        this.openCartDrawerOnSelect = this.openCartDrawerOnSelect.bind(this);
        this.closeCartDrawerOnDeselect = this.closeCartDrawerOnDeselect.bind(this);
        this.cartDrawerSection = this.closest(selectors$M.shopifySection);

        this.closeCartEvents();
      }

      connectedCallback() {
        const drawerSection = this.closest(selectors$M.shopifySection);

        /* Prevent duplicated cart drawers */
        if (window.theme.hasCartDrawer) {
          if (!window.Shopify.designMode) {
            drawerSection.remove();
            return;
          } else {
            const errorMessage = document.createElement('div');
            errorMessage.classList.add(classes$x.drawerEditorError);
            errorMessage.innerText = 'Cart drawer section already exists.';

            if (!this.querySelector(`.${classes$x.drawerEditorError}`)) {
              this.querySelector(selectors$M.cartDrawerInner).append(errorMessage);
            }

            this.classList.add(classes$x.duplicate);
          }
        }

        window.theme.hasCartDrawer = true;

        this.addEventListener('theme:cart-drawer:show', this.openCartDrawer);
        document.addEventListener('theme:cart:toggle', this.toggleCartDrawer);
        document.addEventListener('theme:quick-add:open', this.closeCartDrawer);
        document.addEventListener('theme:product:added', this.openCartDrawerOnProductAdded);
        document.addEventListener('shopify:block:select', this.openCartDrawerOnSelect);
        document.addEventListener('shopify:section:select', this.openCartDrawerOnSelect);
        document.addEventListener('shopify:section:deselect', this.closeCartDrawerOnDeselect);
      }

      disconnectedCallback() {
        document.removeEventListener('theme:product:added', this.openCartDrawerOnProductAdded);
        document.removeEventListener('theme:cart:toggle', this.toggleCartDrawer);
        document.removeEventListener('theme:quick-add:open', this.closeCartDrawer);
        document.removeEventListener('shopify:block:select', this.openCartDrawerOnSelect);
        document.removeEventListener('shopify:section:select', this.openCartDrawerOnSelect);
        document.removeEventListener('shopify:section:deselect', this.closeCartDrawerOnDeselect);

        if (document.querySelectorAll(selectors$M.cartDrawer).length <= 1) {
          window.theme.hasCartDrawer = false;
        }
      }

      /**
       * Open cart drawer when product is added to cart
       *
       * @return  {Void}
       */
      openCartDrawerOnProductAdded() {
        if (!this.cartDrawerIsOpen) {
          this.openCartDrawer();
        }
      }

      /**
       * Open cart drawer on block or section select
       *
       * @return  {Void}
       */
      openCartDrawerOnSelect(e) {
        const cartDrawerSection = e.target.querySelector(selectors$M.shopifySection) || e.target.closest(selectors$M.shopifySection) || e.target;

        if (cartDrawerSection === this.cartDrawerSection) {
          this.openCartDrawer(true);
        }
      }

      /**
       * Close cart drawer on section deselect
       *
       * @return  {Void}
       */
      closeCartDrawerOnDeselect() {
        if (this.cartDrawerIsOpen) {
          this.closeCartDrawer();
        }
      }

      /**
       * Open cart drawer and add class on body
       *
       * @return  {Void}
       */

      openCartDrawer(forceOpen = false) {
        if (!forceOpen && this.classList.contains(classes$x.duplicate)) return;

        this.cartDrawerIsOpen = true;
        this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
        document.body.addEventListener('click', this.onBodyClickEvent);

        document.dispatchEvent(
          new CustomEvent('theme:cart-drawer:open', {
            detail: {
              target: this,
            },
            bubbles: true,
          })
        );
        document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));

        this.classList.add(classes$x.open);

        // Observe Additional Checkout Buttons
        this.observeAdditionalCheckoutButtons();

        waitForAnimationEnd(this.cartDrawerInner).then(() => {
          trapFocus(this, {
            elementToFocus: this.querySelector(selectors$M.cartDrawerClose),
          });
        });
      }

      /**
       * Close cart drawer and remove class on body
       *
       * @return  {Void}
       */

      closeCartDrawer() {
        if (!this.classList.contains(classes$x.open)) return;

        this.classList.add(classes$x.closing);
        this.classList.remove(classes$x.open);

        this.cartDrawerIsOpen = false;

        document.dispatchEvent(
          new CustomEvent('theme:cart-drawer:close', {
            bubbles: true,
          })
        );

        removeTrapFocus();
        autoFocusLastElement();

        document.body.removeEventListener('click', this.onBodyClickEvent);
        document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));

        waitForAnimationEnd(this.cartDrawerInner).then(() => {
          this.classList.remove(classes$x.closing);
        });
      }

      /**
       * Toggle cart drawer
       *
       * @return  {Void}
       */

      toggleCartDrawer() {
        if (!this.cartDrawerIsOpen) {
          this.openCartDrawer();
        } else {
          this.closeCartDrawer();
        }
      }

      /**
       * Event click to element to close cart drawer
       *
       * @return  {Void}
       */

      closeCartEvents() {
        this.cartDrawerClose.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeCartDrawer();
        });

        this.addEventListener('keyup', (e) => {
          if (e.code === 'Escape') {
            this.closeCartDrawer();
          }
        });
      }

      onBodyClick(e) {
        if (e.target.hasAttribute(attributes$r.drawerUnderlay)) this.closeCartDrawer();
      }

      observeAdditionalCheckoutButtons() {
        // identify an element to observe
        const additionalCheckoutButtons = this.querySelector(selectors$M.additionalCheckoutButtons);
        if (additionalCheckoutButtons) {
          // create a new instance of `MutationObserver` named `observer`,
          // passing it a callback function
          const observer = new MutationObserver(() => {
            trapFocus(this, {
              elementToFocus: this.querySelector(selectors$M.cartDrawerClose),
            });
            observer.disconnect();
          });

          // call `observe()` on that MutationObserver instance,
          // passing it the element to observe, and the options object
          observer.observe(additionalCheckoutButtons, {subtree: true, childList: true});
        }
      }
    }

    if (!customElements.get('cart-drawer')) {
      customElements.define('cart-drawer', CartDrawer);
    }

    const selectors$L = {
      collapsible: '[data-collapsible]',
      trigger: '[data-collapsible-trigger]',
      body: '[data-collapsible-body]',
      content: '[data-collapsible-content]',
    };

    const attributes$q = {
      desktop: 'desktop',
      disabled: 'disabled',
      mobile: 'mobile',
      open: 'open',
      single: 'single',
    };

    class CollapsibleElements extends HTMLElement {
      constructor() {
        super();

        this.collapsibles = this.querySelectorAll(selectors$L.collapsible);
        this.single = this.hasAttribute(attributes$q.single);
        this.toggle = this.toggle.bind(this);
      }

      connectedCallback() {
        this.toggle();
        document.addEventListener('theme:resize:width', this.toggle);

        this.collapsibles.forEach((collapsible) => {
          const trigger = collapsible.querySelector(selectors$L.trigger);
          const body = collapsible.querySelector(selectors$L.body);

          trigger?.addEventListener('click', (event) => this.onCollapsibleClick(event));

          body.addEventListener('transitionend', (event) => {
            if (event.target !== body) return;

            if (collapsible.getAttribute(attributes$q.open) == 'true') {
              this.setBodyHeight(body, 'auto');
            }

            if (collapsible.getAttribute(attributes$q.open) == 'false') {
              collapsible.removeAttribute(attributes$q.open);
              this.setBodyHeight(body, '');
            }
          });
        });
      }

      disconnectedCallback() {
        document.removeEventListener('theme:resize:width', this.toggle);
      }

      toggle() {
        const isDesktopView = isDesktop();

        this.collapsibles.forEach((collapsible) => {
          const enableDesktop = collapsible.hasAttribute(attributes$q.desktop) ? collapsible.getAttribute(attributes$q.desktop) : 'true';
          const enableMobile = collapsible.hasAttribute(attributes$q.mobile) ? collapsible.getAttribute(attributes$q.mobile) : 'true';
          const body = collapsible.querySelector(selectors$L.body);

          if ((isDesktopView && enableDesktop == 'true') || (!isDesktopView && enableMobile == 'true')) {
            collapsible.querySelector(selectors$L.trigger).removeAttribute('tabindex');
            collapsible.removeAttribute(attributes$q.open);
            collapsible.removeAttribute(attributes$q.disabled);
            this.setBodyHeight(body, '');
          } else {
            collapsible.setAttribute(attributes$q.disabled, '');
            collapsible.setAttribute('open', true);
            collapsible.querySelector(selectors$L.trigger).setAttribute('tabindex', -1);
          }
        });
      }

      open(collapsible) {
        if (collapsible.getAttribute('open') == 'true') return;

        const body = collapsible.querySelector(selectors$L.body);
        const content = collapsible.querySelector(selectors$L.content);

        collapsible.setAttribute('open', true);

        this.setBodyHeight(body, content.offsetHeight);
      }

      close(collapsible) {
        if (!collapsible.hasAttribute('open')) return;

        const body = collapsible.querySelector(selectors$L.body);
        const content = collapsible.querySelector(selectors$L.content);

        this.setBodyHeight(body, content.offsetHeight);

        collapsible.setAttribute('open', false);

        setTimeout(() => {
          requestAnimationFrame(() => {
            this.setBodyHeight(body, 0);
          });
        });
      }

      setBodyHeight(body, contentHeight) {
        body.style.height = contentHeight !== 'auto' && contentHeight !== '' ? `${contentHeight}px` : contentHeight;
      }

      onCollapsibleClick(event) {
        event.preventDefault();

        const trigger = event.target;
        const collapsible = trigger.closest(selectors$L.collapsible);

        // When we want only one item expanded at the same time
        if (this.single) {
          this.collapsibles.forEach((otherCollapsible) => {
            // if otherCollapsible has attribute open and it's not the one we clicked on, remove the open attribute
            if (otherCollapsible.hasAttribute(attributes$q.open) && otherCollapsible != collapsible) {
              requestAnimationFrame(() => {
                this.close(otherCollapsible);
              });
            }
          });
        }

        if (collapsible.hasAttribute(attributes$q.open)) {
          this.close(collapsible);
        } else {
          this.open(collapsible);
        }

        collapsible.dispatchEvent(
          new CustomEvent('theme:form:sticky', {
            bubbles: true,
            detail: {
              element: 'accordion',
            },
          })
        );
      }
    }

    if (!customElements.get('collapsible-elements')) {
      customElements.define('collapsible-elements', CollapsibleElements);
    }

    const selectors$K = {
      details: 'details',
      popdown: '[data-popdown]',
      popdownClose: '[data-popdown-close]',
      input: 'input:not([type="hidden"])',
    };

    const attributes$p = {
      popdownUnderlay: 'data-popdown-underlay',
    };

    const classes$w = {
      open: 'is-open',
    };
    class SearchPopdown extends HTMLElement {
      constructor() {
        super();
        this.popdown = this.querySelector(selectors$K.popdown);
        this.popdownContainer = this.querySelector(selectors$K.details);
        this.popdownClose = this.querySelector(selectors$K.popdownClose);
        this.popdownTransitionCallback = this.popdownTransitionCallback.bind(this);
        this.detailsToggleCallback = this.detailsToggleCallback.bind(this);
        this.a11y = a11y;
      }

      connectedCallback() {
        this.popdown.addEventListener('transitionend', this.popdownTransitionCallback);
        this.popdownContainer.addEventListener('keyup', (event) => event.code.toUpperCase() === 'ESCAPE' && this.close());
        this.popdownContainer.addEventListener('toggle', this.detailsToggleCallback);
        this.popdownClose.addEventListener('click', this.close.bind(this));
      }

      detailsToggleCallback(event) {
        if (event.target.hasAttribute('open')) {
          this.open();
        }
      }

      popdownTransitionCallback(event) {
        if (event.target !== this.popdown) return;

        if (!this.classList.contains(classes$w.open)) {
          this.popdownContainer.removeAttribute('open');
          this.a11y.removeTrapFocus();
        } else if (event.propertyName === 'transform') {
          // Wait for the 'transform' transition to complete in order to prevent jumping content issues because of the trapFocus
          this.a11y.trapFocus(this.popdown, {
            elementToFocus: this.popdown.querySelector(selectors$K.input),
          });
        }
      }

      onBodyClick(event) {
        if (!this.contains(event.target) || event.target.hasAttribute(attributes$p.popdownUnderlay)) this.close();
      }

      open() {
        this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);

        document.body.addEventListener('click', this.onBodyClickEvent);
        document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));

        requestAnimationFrame(() => {
          this.classList.add(classes$w.open);
        });
      }

      close() {
        this.classList.remove(classes$w.open);

        document.body.removeEventListener('click', this.onBodyClickEvent);
        document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
      }
    }

    customElements.define('header-search-popdown', SearchPopdown);

    const selectors$J = {
      inputSearch: 'input[type="search"]',
    };

    class MainSearch extends HeaderSearchForm {
      constructor() {
        super();

        this.allSearchInputs = document.querySelectorAll(selectors$J.inputSearch);
        this.setupEventListeners();
      }

      setupEventListeners() {
        let allSearchForms = [];
        this.allSearchInputs.forEach((input) => allSearchForms.push(input.form));
        this.input.addEventListener('focus', this.onInputFocus.bind(this));
        if (allSearchForms.length < 2) return;
        allSearchForms.forEach((form) => form.addEventListener('reset', this.onFormReset.bind(this)));
        this.allSearchInputs.forEach((input) => input.addEventListener('input', this.onInput.bind(this)));
      }

      onFormReset(event) {
        super.onFormReset(event);
        if (super.shouldResetForm()) {
          this.keepInSync('', this.input);
        }
      }

      onInput(event) {
        const target = event.target;
        this.keepInSync(target.value, target);
      }

      onInputFocus() {
        if (!isDesktop()) {
          this.scrollIntoView({behavior: 'smooth'});
        }
      }

      keepInSync(value, target) {
        this.allSearchInputs.forEach((input) => {
          if (input !== target) {
            input.value = value;
          }
        });
      }
    }

    customElements.define('main-search', MainSearch);

    const selectors$I = {
      actions: '[data-actions]',
      content: '[data-content]',
      trigger: '[data-button]',
    };

    const attributes$o = {
      height: 'data-height',
    };

    const classes$v = {
      open: 'is-open',
      enabled: 'is-enabled',
    };

    class ToggleEllipsis extends HTMLElement {
      constructor() {
        super();

        this.initialHeight = this.getAttribute(attributes$o.height);
        this.content = this.querySelector(selectors$I.content);
        this.trigger = this.querySelector(selectors$I.trigger);
        this.actions = this.querySelector(selectors$I.actions);
        this.toggleActions = this.toggleActions.bind(this);
      }

      connectedCallback() {
        // Make sure the data attribute height value matches the CSS value
        this.setHeight(this.initialHeight);

        this.trigger.addEventListener('click', () => {
          this.setHeight(this.content.offsetHeight);
          this.classList.add(classes$v.open);
        });

        this.setHeight(this.initialHeight);
        this.toggleActions();

        document.addEventListener('theme:resize', this.toggleActions);
      }

      disconnectedCallback() {
        document.removeEventListener('theme:resize', this.toggleActions);
      }

      setHeight(contentHeight) {
        this.style.setProperty('--height', `${contentHeight}px`);
      }

      toggleActions() {
        this.classList.toggle(classes$v.enabled, this.content.offsetHeight + this.actions.offsetHeight > this.initialHeight);
      }
    }

    if (!customElements.get('toggle-ellipsis')) {
      customElements.define('toggle-ellipsis', ToggleEllipsis);
    }

    const selectors$H = {
      templateAddresses: '.template-addresses',
      addressNewForm: '#AddressNewForm',
      btnNew: '.address-new-toggle',
      btnEdit: '.address-edit-toggle',
      btnDelete: '.address-delete',
      dataFormId: 'data-form-id',
      dataConfirmMessage: 'data-confirm-message',
      editAddress: '#EditAddress',
      addressCountryNew: 'AddressCountryNew',
      addressProvinceNew: 'AddressProvinceNew',
      addressProvinceContainerNew: 'AddressProvinceContainerNew',
      addressCountryOption: '.address-country-option',
      addressCountry: 'AddressCountry',
      addressProvince: 'AddressProvince',
      addressProvinceContainer: 'AddressProvinceContainer',
    };

    const classes$u = {
      hidden: 'hidden',
    };

    class Addresses {
      constructor(section) {
        this.section = section;
        this.addressNewForm = this.section.querySelector(selectors$H.addressNewForm);

        this.init();
      }

      init() {
        if (this.addressNewForm) {
          const section = this.section;
          const newAddressForm = this.addressNewForm;
          this.customerAddresses();

          const newButtons = section.querySelectorAll(selectors$H.btnNew);
          if (newButtons.length) {
            newButtons.forEach((element) => {
              element.addEventListener('click', function () {
                newAddressForm.classList.toggle(classes$u.hidden);
              });
            });
          }

          const editButtons = section.querySelectorAll(selectors$H.btnEdit);
          if (editButtons.length) {
            editButtons.forEach((element) => {
              element.addEventListener('click', function () {
                const formId = this.getAttribute(selectors$H.dataFormId);
                section.querySelector(`${selectors$H.editAddress}_${formId}`).classList.toggle(classes$u.hidden);
              });
            });
          }

          const deleteButtons = section.querySelectorAll(selectors$H.btnDelete);
          if (deleteButtons.length) {
            deleteButtons.forEach((element) => {
              element.addEventListener('click', function () {
                const formId = this.getAttribute(selectors$H.dataFormId);
                const confirmMessage = this.getAttribute(selectors$H.dataConfirmMessage);
                if (confirm(confirmMessage)) {
                  Shopify.postLink(window.theme.routes.addresses_url + '/' + formId, {parameters: {_method: 'delete'}});
                }
              });
            });
          }
        }
      }

      customerAddresses() {
        // Initialize observers on address selectors, defined in shopify_common.js
        if (Shopify.CountryProvinceSelector) {
          new Shopify.CountryProvinceSelector(selectors$H.addressCountryNew, selectors$H.addressProvinceNew, {
            hideElement: selectors$H.addressProvinceContainerNew,
          });
        }

        // Initialize each edit form's country/province selector
        const countryOptions = this.section.querySelectorAll(selectors$H.addressCountryOption);
        countryOptions.forEach((element) => {
          const formId = element.getAttribute(selectors$H.dataFormId);
          const countrySelector = `${selectors$H.addressCountry}_${formId}`;
          const provinceSelector = `${selectors$H.addressProvince}_${formId}`;
          const containerSelector = `${selectors$H.addressProvinceContainer}_${formId}`;

          new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
            hideElement: containerSelector,
          });
        });
      }
    }

    const template$1 = document.querySelector(selectors$H.templateAddresses);
    if (template$1) {
      new Addresses(template$1);
    }

    const selectors$G = {
      accountTemplateLogged: '.customer-logged-in',
      account: '.account',
      accountSidebarMobile: '.account-sidebar--mobile',
    };

    class Account {
      constructor(section) {
        this.section = section;

        this.init();
      }

      init() {
        if (this.section.querySelector(selectors$G.account)) {
          this.accountMobileSidebar();
        }
      }

      accountMobileSidebar() {
        if (this.section.querySelector(selectors$G.accountSidebarMobile)) {
          this.section.querySelector(selectors$G.accountSidebarMobile).addEventListener('click', function () {
            const nextElem = this.nextElementSibling;

            if (nextElem && nextElem.tagName === 'UL') {
              nextElem.classList.toggle('visible');
            }
          });
        }
      }
    }

    const template = document.querySelector(selectors$G.accountTemplateLogged);
    if (template) {
      new Account(template);
    }

    const selectors$F = {
      form: '[data-account-form]',
      showReset: '[data-show-reset]',
      hideReset: '[data-hide-reset]',
      recover: '[data-recover-password]',
      recoverSuccess: '[data-recover-success]',
      login: '[data-login-form]',
      recoverHash: '#recover',
      hideClass: 'is-hidden',
    };

    class Login {
      constructor(form) {
        this.form = form;
        this.showButton = form.querySelector(selectors$F.showReset);
        this.hideButton = form.querySelector(selectors$F.hideReset);
        this.recover = form.querySelector(selectors$F.recover);
        this.recoverSuccess = form.querySelector(selectors$F.recoverSuccess);
        this.login = form.querySelector(selectors$F.login);
        this.init();
      }

      init() {
        if (window.location.hash == selectors$F.recoverHash || this.recoverSuccess) {
          this.showRecoverPasswordForm();
        } else {
          this.hideRecoverPasswordForm();
        }
        this.showButton.addEventListener(
          'click',
          function (e) {
            e.preventDefault();
            this.showRecoverPasswordForm();
          }.bind(this),
          false
        );
        this.hideButton.addEventListener(
          'click',
          function (e) {
            e.preventDefault();
            this.hideRecoverPasswordForm();
          }.bind(this),
          false
        );
      }

      showRecoverPasswordForm() {
        this.login.classList.add(selectors$F.hideClass);
        this.recover.classList.remove(selectors$F.hideClass);
        window.location.hash = selectors$F.recoverHash;
        return false;
      }

      hideRecoverPasswordForm() {
        this.recover.classList.add(selectors$F.hideClass);
        this.login.classList.remove(selectors$F.hideClass);
        window.location.hash = '';
        return false;
      }
    }

    const loginForm = document.querySelector(selectors$F.form);
    if (loginForm) {
      new Login(loginForm);
    }

    window.Shopify = window.Shopify || {};
    window.Shopify.theme = window.Shopify.theme || {};
    window.Shopify.theme.sections = window.Shopify.theme.sections || {};

    window.Shopify.theme.sections.registered = window.Shopify.theme.sections.registered || {};
    window.Shopify.theme.sections.instances = window.Shopify.theme.sections.instances || [];
    const registered = window.Shopify.theme.sections.registered;
    const instances = window.Shopify.theme.sections.instances;

    const selectors$E = {
      id: 'data-section-id',
      type: 'data-section-type',
    };

    class Registration {
      constructor(type = null, components = []) {
        this.type = type;
        this.components = validateComponentsArray(components);
        this.callStack = {
          onLoad: [],
          onUnload: [],
          onSelect: [],
          onDeselect: [],
          onBlockSelect: [],
          onBlockDeselect: [],
          onReorder: [],
        };
        components.forEach((comp) => {
          for (const [key, value] of Object.entries(comp)) {
            const arr = this.callStack[key];
            if (Array.isArray(arr) && typeof value === 'function') {
              arr.push(value);
            } else {
              console.warn(`Unregisted function: '${key}' in component: '${this.type}'`);
              console.warn(value);
            }
          }
        });
      }

      getStack() {
        return this.callStack;
      }
    }

    class Section {
      constructor(container, registration) {
        this.container = validateContainerElement(container);
        this.id = container.getAttribute(selectors$E.id);
        this.type = registration.type;
        this.callStack = registration.getStack();

        try {
          this.onLoad();
        } catch (e) {
          console.warn(`Error in section: ${this.id}`);
          console.warn(this);
          console.warn(e);
        }
      }

      callFunctions(key, e = null) {
        this.callStack[key].forEach((func) => {
          const props = {
            id: this.id,
            type: this.type,
            container: this.container,
          };
          if (e) {
            func.call(props, e);
          } else {
            func.call(props);
          }
        });
      }

      onLoad() {
        this.callFunctions('onLoad');
      }

      onUnload() {
        this.callFunctions('onUnload');
      }

      onSelect(e) {
        this.callFunctions('onSelect', e);
      }

      onDeselect(e) {
        this.callFunctions('onDeselect', e);
      }

      onBlockSelect(e) {
        this.callFunctions('onBlockSelect', e);
      }

      onBlockDeselect(e) {
        this.callFunctions('onBlockDeselect', e);
      }

      onReorder(e) {
        this.callFunctions('onReorder', e);
      }
    }

    function validateContainerElement(container) {
      if (!(container instanceof Element)) {
        throw new TypeError('Theme Sections: Attempted to load section. The section container provided is not a DOM element.');
      }
      if (container.getAttribute(selectors$E.id) === null) {
        throw new Error('Theme Sections: The section container provided does not have an id assigned to the ' + selectors$E.id + ' attribute.');
      }

      return container;
    }

    function validateComponentsArray(value) {
      if ((typeof value !== 'undefined' && typeof value !== 'object') || value === null) {
        throw new TypeError('Theme Sections: The components object provided is not a valid');
      }

      return value;
    }

    /*
     * @shopify/theme-sections
     * -----------------------------------------------------------------------------
     *
     * A framework to provide structure to your Shopify sections and a load and unload
     * lifecycle. The lifecycle is automatically connected to theme editor events so
     * that your sections load and unload as the editor changes the content and
     * settings of your sections.
     */

    function register(type, components) {
      if (typeof type !== 'string') {
        throw new TypeError('Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered');
      }

      if (typeof registered[type] !== 'undefined') {
        throw new Error('Theme Sections: A section of type "' + type + '" has already been registered. You cannot register the same section type twice');
      }

      if (!Array.isArray(components)) {
        components = [components];
      }

      const section = new Registration(type, components);
      registered[type] = section;

      return registered;
    }

    function load(types, containers) {
      types = normalizeType(types);

      if (typeof containers === 'undefined') {
        containers = document.querySelectorAll('[' + selectors$E.type + ']');
      }

      containers = normalizeContainers(containers);

      types.forEach(function (type) {
        const registration = registered[type];

        if (typeof registration === 'undefined') {
          return;
        }

        containers = containers.filter(function (container) {
          // Filter from list of containers because container already has an instance loaded
          if (isInstance(container)) {
            return false;
          }

          // Filter from list of containers because container doesn't have data-section-type attribute
          if (container.getAttribute(selectors$E.type) === null) {
            return false;
          }

          // Keep in list of containers because current type doesn't match
          if (container.getAttribute(selectors$E.type) !== type) {
            return true;
          }

          instances.push(new Section(container, registration));

          // Filter from list of containers because container now has an instance loaded
          return false;
        });
      });
    }

    function reorder(selector) {
      var instancesToReorder = getInstances(selector);

      instancesToReorder.forEach(function (instance) {
        instance.onReorder();
      });
    }

    function unload(selector) {
      var instancesToUnload = getInstances(selector);

      instancesToUnload.forEach(function (instance) {
        var index = instances
          .map(function (e) {
            return e.id;
          })
          .indexOf(instance.id);
        instances.splice(index, 1);
        instance.onUnload();
      });
    }

    function getInstances(selector) {
      var filteredInstances = [];

      // Fetch first element if its an array
      if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) {
        var firstElement = selector[0];
      }

      // If selector element is DOM element
      if (selector instanceof Element || firstElement instanceof Element) {
        var containers = normalizeContainers(selector);

        containers.forEach(function (container) {
          filteredInstances = filteredInstances.concat(
            instances.filter(function (instance) {
              return instance.container === container;
            })
          );
        });

        // If select is type string
      } else if (typeof selector === 'string' || typeof firstElement === 'string') {
        var types = normalizeType(selector);

        types.forEach(function (type) {
          filteredInstances = filteredInstances.concat(
            instances.filter(function (instance) {
              return instance.type === type;
            })
          );
        });
      }

      return filteredInstances;
    }

    function getInstanceById(id) {
      var instance;

      for (var i = 0; i < instances.length; i++) {
        if (instances[i].id === id) {
          instance = instances[i];
          break;
        }
      }
      return instance;
    }

    function isInstance(selector) {
      return getInstances(selector).length > 0;
    }

    function normalizeType(types) {
      // If '*' then fetch all registered section types
      if (types === '*') {
        types = Object.keys(registered);

        // If a single section type string is passed, put it in an array
      } else if (typeof types === 'string') {
        types = [types];

        // If single section constructor is passed, transform to array with section
        // type string
      } else if (types.constructor === Section) {
        types = [types.prototype.type];

        // If array of typed section constructors is passed, transform the array to
        // type strings
      } else if (Array.isArray(types) && types[0].constructor === Section) {
        types = types.map(function (Section) {
          return Section.type;
        });
      }

      types = types.map(function (type) {
        return type.toLowerCase();
      });

      return types;
    }

    function normalizeContainers(containers) {
      // Nodelist with entries
      if (NodeList.prototype.isPrototypeOf(containers) && containers.length > 0) {
        containers = Array.prototype.slice.call(containers);

        // Empty Nodelist
      } else if (NodeList.prototype.isPrototypeOf(containers) && containers.length === 0) {
        containers = [];

        // Handle null (document.querySelector() returns null with no match)
      } else if (containers === null) {
        containers = [];

        // Single DOM element
      } else if (!Array.isArray(containers) && containers instanceof Element) {
        containers = [containers];
      }

      return containers;
    }

    if (window.Shopify.designMode) {
      document.addEventListener('shopify:section:load', function (event) {
        var id = event.detail.sectionId;
        var container = event.target.querySelector('[' + selectors$E.id + '="' + id + '"]');

        if (container !== null) {
          load(container.getAttribute(selectors$E.type), container);
        }
      });

      document.addEventListener('shopify:section:reorder', function (event) {
        var id = event.detail.sectionId;
        var container = event.target.querySelector('[' + selectors$E.id + '="' + id + '"]');
        var instance = getInstances(container)[0];

        if (typeof instance === 'object') {
          reorder(container);
        }
      });

      document.addEventListener('shopify:section:unload', function (event) {
        var id = event.detail.sectionId;
        var container = event.target.querySelector('[' + selectors$E.id + '="' + id + '"]');
        var instance = getInstances(container)[0];

        if (typeof instance === 'object') {
          unload(container);
        }
      });

      document.addEventListener('shopify:section:select', function (event) {
        var instance = getInstanceById(event.detail.sectionId);

        if (typeof instance === 'object') {
          instance.onSelect(event);
        }
      });

      document.addEventListener('shopify:section:deselect', function (event) {
        var instance = getInstanceById(event.detail.sectionId);

        if (typeof instance === 'object') {
          instance.onDeselect(event);
        }
      });

      document.addEventListener('shopify:block:select', function (event) {
        var instance = getInstanceById(event.detail.sectionId);

        if (typeof instance === 'object') {
          instance.onBlockSelect(event);
        }
      });

      document.addEventListener('shopify:block:deselect', function (event) {
        var instance = getInstanceById(event.detail.sectionId);

        if (typeof instance === 'object') {
          instance.onBlockDeselect(event);
        }
      });
    }

    const selectors$D = {
      tooltip: 'data-tooltip',
      tooltipStopMouseEnter: 'data-tooltip-stop-mouseenter',
    };

    const classes$t = {
      tooltipDefault: 'tooltip-default',
      visible: 'is-visible',
      hiding: 'is-hiding',
    };

    let sections$m = {};

    class Tooltip {
      constructor(el, options = {}) {
        this.tooltip = el;
        if (!this.tooltip.hasAttribute(selectors$D.tooltip)) return;
        this.label = this.tooltip.getAttribute(selectors$D.tooltip);
        this.class = options.class || classes$t.tooltipDefault;
        this.transitionSpeed = options.transitionSpeed || 200;
        this.hideTransitionTimeout = 0;
        this.addPinEvent = () => this.addPin();
        this.addPinMouseEvent = () => this.addPin(true);
        this.removePinEvent = (event) => throttle(this.removePin(event), 50);
        this.removePinMouseEvent = (event) => this.removePin(event, true, true);
        this.init();
      }

      init() {
        if (!document.querySelector(`.${this.class}`)) {
          const tooltipTemplate = `<div class="${this.class}__arrow"></div><div class="${this.class}__inner"><div class="${this.class}__text"></div></div>`;
          const tooltipElement = document.createElement('div');
          tooltipElement.className = this.class;
          tooltipElement.innerHTML = tooltipTemplate;
          document.body.appendChild(tooltipElement);
        }

        this.tooltip.addEventListener('mouseenter', this.addPinMouseEvent);
        this.tooltip.addEventListener('mouseleave', this.removePinMouseEvent);
        this.tooltip.addEventListener('theme:tooltip:init', this.addPinEvent);
        document.addEventListener('theme:tooltip:close', this.removePinEvent);
      }

      addPin(stopMouseEnter = false) {
        const tooltipTarget = document.querySelector(`.${this.class}`);

        if (this.label && tooltipTarget && ((stopMouseEnter && !this.tooltip.hasAttribute(selectors$D.tooltipStopMouseEnter)) || !stopMouseEnter)) {
          const tooltipTargetArrow = tooltipTarget.querySelector(`.${this.class}__arrow`);
          const tooltipTargetInner = tooltipTarget.querySelector(`.${this.class}__inner`);
          const tooltipTargetText = tooltipTarget.querySelector(`.${this.class}__text`);
          tooltipTargetText.innerHTML = this.label;

          const tooltipTargetWidth = tooltipTargetInner.offsetWidth;
          const tooltipRect = this.tooltip.getBoundingClientRect();
          const tooltipTop = tooltipRect.top;
          const tooltipWidth = tooltipRect.width;
          const tooltipHeight = tooltipRect.height;
          const tooltipTargetPositionTop = tooltipTop + tooltipHeight + window.scrollY;
          let tooltipTargetPositionLeft = tooltipRect.left - tooltipTargetWidth / 2 + tooltipWidth / 2;
          const tooltipLeftWithWidth = tooltipTargetPositionLeft + tooltipTargetWidth;
          const sideOffset = 24;
          const tooltipTargetWindowDifference = tooltipLeftWithWidth - getWindowWidth() + sideOffset;

          if (tooltipTargetWindowDifference > 0) {
            tooltipTargetPositionLeft -= tooltipTargetWindowDifference;
          }

          if (tooltipTargetPositionLeft < 0) {
            tooltipTargetPositionLeft = 0;
          }

          tooltipTargetArrow.style.left = `${tooltipRect.left + tooltipWidth / 2}px`;
          tooltipTarget.style.setProperty('--tooltip-top', `${tooltipTargetPositionTop}px`);

          tooltipTargetInner.style.transform = `translateX(${tooltipTargetPositionLeft}px)`;
          tooltipTarget.classList.remove(classes$t.hiding);
          tooltipTarget.classList.add(classes$t.visible);

          document.addEventListener('theme:scroll', this.removePinEvent);
        }
      }

      removePin(event, stopMouseEnter = false, hideTransition = false) {
        const tooltipTarget = document.querySelector(`.${this.class}`);
        const tooltipVisible = tooltipTarget.classList.contains(classes$t.visible);

        if (tooltipTarget && ((stopMouseEnter && !this.tooltip.hasAttribute(selectors$D.tooltipStopMouseEnter)) || !stopMouseEnter)) {
          if (tooltipVisible && (hideTransition || event.detail.hideTransition)) {
            tooltipTarget.classList.add(classes$t.hiding);

            if (this.hideTransitionTimeout) {
              clearTimeout(this.hideTransitionTimeout);
            }

            this.hideTransitionTimeout = setTimeout(() => {
              tooltipTarget.classList.remove(classes$t.hiding);
            }, this.transitionSpeed);
          }

          tooltipTarget.classList.remove(classes$t.visible);

          document.removeEventListener('theme:scroll', this.removePinEvent);
        }
      }

      unload() {
        this.tooltip.removeEventListener('mouseenter', this.addPinMouseEvent);
        this.tooltip.removeEventListener('mouseleave', this.removePinMouseEvent);
        this.tooltip.removeEventListener('theme:tooltip:init', this.addPinEvent);
        document.removeEventListener('theme:tooltip:close', this.removePinEvent);
        document.removeEventListener('theme:scroll', this.removePinEvent);
      }
    }

    const tooltipSection = {
      onLoad() {
        sections$m[this.id] = [];
        const els = this.container.querySelectorAll(`[${selectors$D.tooltip}]`);
        els.forEach((el) => {
          sections$m[this.id].push(new Tooltip(el));
        });
      },
      onUnload: function () {
        sections$m[this.id].forEach((el) => {
          if (typeof el.unload === 'function') {
            el.unload();
          }
        });
      },
    };

    var sections$l = {};

    const parallaxHero = {
      onLoad() {
        sections$l[this.id] = [];
        const frames = this.container.querySelectorAll('[data-parallax-wrapper]');
        frames.forEach((frame) => {
          const inner = frame.querySelector('[data-parallax-img]');

          sections$l[this.id].push(
            new Rellax(inner, {
              center: true,
              round: true,
              frame: frame,
            })
          );
        });

        window.addEventListener('load', () => {
          sections$l[this.id].forEach((image) => {
            if (typeof image.refresh === 'function') {
              image.refresh();
            }
          });
        });
      },
      onUnload: function () {
        sections$l[this.id].forEach((image) => {
          if (typeof image.destroy === 'function') {
            image.destroy();
          }
        });
      },
    };

    register('article', [tooltipSection, parallaxHero]);

    const selectors$C = {
      aos: '[data-aos]',
      collectionImage: '.collection-item__image',
      columnImage: '[data-column-image]',
      flickityNextArrow: '.flickity-button.next',
      flickityPrevArrow: '.flickity-button.previous',
      link: 'a:not(.btn)',
      productItemImage: '.product-item__image',
      slide: '[data-slide]',
      slideValue: 'data-slide',
      slider: '[data-slider]',
      sliderThumb: '[data-slider-thumb]',
    };

    const attributes$n = {
      arrowPositionMiddle: 'data-arrow-position-middle',
      slideIndex: 'data-slide-index',
      sliderOptions: 'data-options',
      slideTextColor: 'data-slide-text-color',
    };

    const classes$s = {
      aosAnimate: 'aos-animate',
      desktop: 'desktop',
      focused: 'is-focused',
      flickityEnabled: 'flickity-enabled',
      heroContentTransparent: 'hero__content--transparent',
      initialized: 'is-initialized',
      isLoading: 'is-loading',
      isSelected: 'is-selected',
      mobile: 'mobile',
      singleSlide: 'single-slide',
      sliderInitialized: 'js-slider--initialized',
    };

    const sections$k = {};

    class Slider {
      constructor(container, slideshow = null) {
        this.container = container;
        this.slideshow = slideshow || this.container.querySelector(selectors$C.slider);

        if (!this.slideshow) return;

        this.slideshowSlides = this.slideshow.querySelectorAll(selectors$C.slide);

        if (this.slideshowSlides.length <= 1) return;

        this.sliderThumbs = this.container.querySelectorAll(selectors$C.sliderThumb);
        this.multipleSlides = this.slideshow.hasAttribute(attributes$n.slidesLargeDesktop);

        if (this.slideshow.hasAttribute(attributes$n.sliderOptions)) {
          this.customOptions = JSON.parse(decodeURIComponent(this.slideshow.getAttribute(attributes$n.sliderOptions)));
        }

        this.flkty = null;

        this.init();
      }

      init() {
        this.slideshow.classList.add(classes$s.isLoading);

        let slideSelector = selectors$C.slide;
        const isDesktopView = isDesktop();
        const slideMobile = `${selectors$C.slide}:not(.${classes$s.mobile})`;
        const slideDesktop = `${selectors$C.slide}:not(.${classes$s.desktop})`;
        const hasDeviceSpecificSelectors = this.slideshow.querySelectorAll(slideDesktop).length || this.slideshow.querySelectorAll(slideMobile).length;

        if (hasDeviceSpecificSelectors) {
          if (isDesktopView) {
            slideSelector = slideMobile;
          } else {
            slideSelector = slideDesktop;
          }
        }

        if (this.slideshow.querySelectorAll(slideSelector).length <= 1) {
          this.slideshow.classList.add(classes$s.singleSlide);
          this.slideshow.classList.remove(classes$s.isLoading);
        }

        this.sliderOptions = {
          cellSelector: slideSelector,
          contain: true,
          wrapAround: true,
          adaptiveHeight: true,
          ...this.customOptions,
          on: {
            ready: () => {
              requestAnimationFrame(() => {
                this.slideshow.classList.add(classes$s.initialized);
                this.slideshow.classList.remove(classes$s.isLoading);
                this.slideshow.parentNode.dispatchEvent(
                  new CustomEvent('theme:slider:loaded', {
                    bubbles: true,
                    detail: {
                      slider: this,
                    },
                  })
                );
              });

              this.slideActions();

              if (this.sliderOptions.prevNextButtons) {
                this.positionArrows();
              }
            },
            change: (index) => {
              const slide = this.slideshowSlides[index];
              if (!slide || this.sliderOptions.groupCells) return;

              const elementsToAnimate = slide.querySelectorAll(selectors$C.aos);
              if (elementsToAnimate.length) {
                elementsToAnimate.forEach((el) => {
                  el.classList.remove(classes$s.aosAnimate);
                  requestAnimationFrame(() => {
                    // setTimeout with `0` delay fixes functionality on Mobile and Firefox
                    setTimeout(() => {
                      el.classList.add(classes$s.aosAnimate);
                    }, 0);
                  });
                });
              }
            },
            resize: () => {
              if (this.sliderOptions.prevNextButtons) {
                this.positionArrows();
              }
            },
          },
        };

        if (this.sliderOptions.fade) {
          this.flkty = new FlickityFade(this.slideshow, this.sliderOptions);
        }

        if (!this.sliderOptions.fade) {
          this.flkty = new Flickity(this.slideshow, this.sliderOptions);
        }

        this.flkty.on('change', () => this.slideActions(true));

        if (this.sliderThumbs.length) {
          this.sliderThumbs.forEach((element) => {
            element.addEventListener('click', (e) => {
              e.preventDefault();
              const slideIndex = [...element.parentElement.children].indexOf(element);
              this.flkty.select(slideIndex);
            });
          });
        }

        if (!this.flkty || !this.flkty.isActive) {
          this.slideshow.classList.remove(classes$s.isLoading);
        }
      }

      slideActions(changeEvent = false) {
        const currentSlide = this.slideshow.querySelector(`.${classes$s.isSelected}`);
        if (!currentSlide) return;
        const currentSlideTextColor = currentSlide.hasAttribute(attributes$n.slideTextColor) ? currentSlide.getAttribute(attributes$n.slideTextColor) : '';
        const currentSlideLink = currentSlide.querySelector(selectors$C.link);
        const buttons = this.slideshow.querySelectorAll(`${selectors$C.slide} a, ${selectors$C.slide} button`);

        if (document.body.classList.contains(classes$s.focused) && currentSlideLink && this.sliderOptions.groupCells && changeEvent) {
          currentSlideLink.focus();
        }

        if (buttons.length) {
          buttons.forEach((button) => {
            const slide = button.closest(selectors$C.slide);
            if (slide) {
              const tabIndex = slide.classList.contains(classes$s.isSelected) ? 0 : -1;
              button.setAttribute('tabindex', tabIndex);
            }
          });
        }

        if (currentSlideTextColor !== 'rgba(0,0,0,0)' && currentSlideTextColor !== '') {
          this.slideshow.style.setProperty('--text', currentSlideTextColor);
        }

        if (this.sliderThumbs.length && this.sliderThumbs.length === this.slideshowSlides.length && currentSlide.hasAttribute(attributes$n.slideIndex)) {
          const slideIndex = parseInt(currentSlide.getAttribute(attributes$n.slideIndex));
          const currentThumb = this.container.querySelector(`${selectors$C.sliderThumb}.${classes$s.isSelected}`);
          if (currentThumb) {
            currentThumb.classList.remove(classes$s.isSelected);
          }
          this.sliderThumbs[slideIndex].classList.add(classes$s.isSelected);
        }
      }

      positionArrows() {
        if (this.slideshow.hasAttribute(attributes$n.arrowPositionMiddle) && this.sliderOptions.prevNextButtons) {
          const itemImage = this.slideshow.querySelector(selectors$C.collectionImage) || this.slideshow.querySelector(selectors$C.productItemImage) || this.slideshow.querySelector(selectors$C.columnImage);

          // Prevent 'clientHeight' of null error if no image
          if (!itemImage) return;

          this.slideshow.querySelector(selectors$C.flickityPrevArrow).style.top = itemImage.clientHeight / 2 + 'px';
          this.slideshow.querySelector(selectors$C.flickityNextArrow).style.top = itemImage.clientHeight / 2 + 'px';
        }
      }

      onUnload() {
        if (this.slideshow && this.flkty) {
          this.flkty.options.watchCSS = false;
          this.flkty.destroy();
        }
      }

      onBlockSelect(evt) {
        if (!this.slideshow) return;
        // Ignore the cloned version
        const slide = this.slideshow.querySelector(`[${selectors$C.slideValue}="${evt.detail.blockId}"]`);

        if (!slide) return;
        let slideIndex = parseInt(slide.getAttribute(attributes$n.slideIndex));

        if (this.multipleSlides && !this.slideshow.classList.contains(classes$s.sliderInitialized)) {
          slideIndex = 0;
        }

        this.slideshow.classList.add(classes$s.isSelected);

        // Go to selected slide, pause autoplay
        if (this.flkty && this.slideshow.classList.contains(classes$s.flickityEnabled)) {
          this.flkty.selectCell(slideIndex);
          this.flkty.stopPlayer();
        }
      }

      onBlockDeselect() {
        if (!this.slideshow) return;
        this.slideshow.classList.remove(classes$s.isSelected);

        if (this.flkty && this.sliderOptions.hasOwnProperty('autoPlay') && this.sliderOptions.autoPlay) {
          this.flkty.playPlayer();
        }
      }
    }

    const slider = {
      onLoad() {
        sections$k[this.id] = [];
        const els = this.container.querySelectorAll(selectors$C.slider);
        els.forEach((el) => {
          sections$k[this.id].push(new Slider(this.container, el));
        });
      },
      onUnload() {
        sections$k[this.id].forEach((el) => {
          if (typeof el.onUnload === 'function') {
            el.onUnload();
          }
        });
      },
      onBlockSelect(e) {
        sections$k[this.id].forEach((el) => {
          if (typeof el.onBlockSelect === 'function') {
            el.onBlockSelect(e);
          }
        });
      },
      onBlockDeselect(e) {
        sections$k[this.id].forEach((el) => {
          if (typeof el.onBlockDeselect === 'function') {
            el.onBlockDeselect(e);
          }
        });
      },
    };

    register('blog-section', [slider]);

    register('hero', parallaxHero);

    register('double', slider);

    const scrollTo = (elementTop) => {
      /* Sticky header check */
      let {stickyHeaderHeight} = readHeights();

      window.scrollTo({
        top: elementTop + window.scrollY - stickyHeaderHeight,
        left: 0,
        behavior: 'smooth',
      });
    };

    class PopupCookie {
      constructor(name, value, daysToExpire = 7) {
        const today = new Date();
        const expiresDate = new Date();
        expiresDate.setTime(today.getTime() + 3600000 * 24 * daysToExpire);

        this.configuration = {
          expires: expiresDate.toGMTString(), // session cookie
          path: '/',
          domain: window.location.hostname,
          sameSite: 'none',
          secure: true,
        };
        this.name = name;
        this.value = value;
      }

      write() {
        const hasCookie = document.cookie.indexOf('; ') !== -1 && !document.cookie.split('; ').find((row) => row.startsWith(this.name));

        if (hasCookie || document.cookie.indexOf('; ') === -1) {
          document.cookie = `${this.name}=${this.value}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}; sameSite=${this.configuration.sameSite}; secure=${this.configuration.secure}`;
        }
      }

      read() {
        if (document.cookie.indexOf('; ') !== -1 && document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
          const returnCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(this.name))
            .split('=')[1];

          return returnCookie;
        } else {
          return false;
        }
      }

      destroy() {
        if (document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
          document.cookie = `${this.name}=null; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
        }
      }
    }

    const selectors$B = {
      newsletterForm: '[data-newsletter-form]',
      newsletterHeading: '[data-newsletter-heading]',
      newsletterPopup: '[data-newsletter]',
    };

    const classes$r = {
      success: 'has-success',
      error: 'has-error',
      hidden: 'hidden',
    };

    const attributes$m = {
      cookieNameAttribute: 'data-cookie-name',
    };

    const sections$j = {};

    class NewsletterCheckForResult {
      constructor(newsletter) {
        this.sessionStorage = window.sessionStorage;
        this.newsletter = newsletter;
        this.popup = this.newsletter.closest(selectors$B.newsletterPopup);
        if (this.popup) {
          this.cookie = new PopupCookie(this.popup.getAttribute(attributes$m.cookieNameAttribute), 'user_has_closed', null);
        }

        this.stopSubmit = true;
        this.isChallengePage = false;
        this.formID = null;

        this.checkForChallengePage();

        this.newsletterSubmit = (e) => this.newsletterSubmitEvent(e);

        if (!this.isChallengePage) {
          this.init();
        }
      }

      init() {
        this.newsletter.addEventListener('submit', this.newsletterSubmit);

        this.showMessage();
      }

      newsletterSubmitEvent(e) {
        if (this.stopSubmit) {
          e.preventDefault();
          e.stopImmediatePropagation();

          this.removeStorage();
          this.writeStorage();
          this.stopSubmit = false;
          this.newsletter.submit();
        }
      }

      checkForChallengePage() {
        this.isChallengePage = window.location.pathname === '/challenge';
      }

      writeStorage() {
        if (this.sessionStorage !== undefined) {
          this.sessionStorage.setItem('newsletter_form_id', this.newsletter.id);
        }
      }

      readStorage() {
        this.formID = this.sessionStorage.getItem('newsletter_form_id');
      }

      removeStorage() {
        this.sessionStorage.removeItem('newsletter_form_id');
      }

      showMessage() {
        this.readStorage();

        if (this.newsletter.id === this.formID) {
          const newsletter = document.getElementById(this.formID);
          const newsletterHeading = newsletter.parentElement.querySelector(selectors$B.newsletterHeading);
          const submissionSuccess = window.location.search.indexOf('?customer_posted=true') !== -1;
          const submissionFailure = window.location.search.indexOf('accepts_marketing') !== -1;

          if (submissionSuccess) {
            newsletter.classList.remove(classes$r.error);
            newsletter.classList.add(classes$r.success);

            if (newsletterHeading) {
              newsletterHeading.classList.add(classes$r.hidden);
              newsletter.classList.remove(classes$r.hidden);
            }

            if (this.popup) {
              this.cookie.write();
            }
          } else if (submissionFailure) {
            newsletter.classList.remove(classes$r.success);
            newsletter.classList.add(classes$r.error);

            if (newsletterHeading) {
              newsletterHeading.classList.add(classes$r.hidden);
              newsletter.classList.remove(classes$r.hidden);
            }
          }

          if (submissionSuccess || submissionFailure) {
            window.addEventListener('load', () => {
              this.scrollToForm(newsletter);
            });
          }
        }
      }

      scrollToForm(newsletter) {
        const rect = newsletter.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.left >= 0 && rect.bottom <= getWindowHeight() && rect.right <= getWindowWidth();

        if (!isVisible) {
          setTimeout(() => {
            scrollTo(newsletter.getBoundingClientRect().top);
          }, 500);
        }
      }

      unload() {
        this.newsletter.removeEventListener('submit', this.newsletterSubmit);
      }
    }

    const newsletterCheckForResultSection = {
      onLoad() {
        sections$j[this.id] = [];
        const newsletters = this.container.querySelectorAll(selectors$B.newsletterForm);
        newsletters.forEach((form) => {
          sections$j[this.id].push(new NewsletterCheckForResult(form));
        });
      },
      onUnload() {
        sections$j[this.id].forEach((form) => {
          if (typeof form.unload === 'function') {
            form.unload();
          }
        });
      },
    };

    register('footer', [parallaxHero, newsletterCheckForResultSection]);

    const selectors$A = {
      collectionSidebar: '[data-collection-sidebar]',
      collectionSidebarSlideOut: '[data-collection-sidebar-slide-out]',
      collectionSidebarCloseButton: '[data-collection-sidebar-close]',
      groupTagsButton: '[data-aria-toggle]',
      animation: '[data-animation]',
    };

    const classes$q = {
      animated: 'drawer--animated',
      hiding: 'is-hiding',
      expanded: 'expanded',
      noMobileAnimation: 'no-mobile-animation',
      focused: 'is-focused',
    };

    let sections$i = {};
    class Collection {
      constructor(section) {
        this.container = section.container;
        this.collectionSidebar = this.container.querySelector(selectors$A.collectionSidebar);
        this.groupTagsButton = this.container.querySelector(selectors$A.groupTagsButton);
        this.a11y = a11y;

        this.groupTagsButtonClickEvent = (evt) => this.groupTagsButtonClick(evt);
        this.sidebarResizeEvent = () => this.toggleSidebarSlider();
        this.collectionSidebarCloseEvent = (evt) => this.collectionSidebarClose(evt);

        this.init();
      }

      init() {
        if (this.groupTagsButton !== null) {
          document.addEventListener('theme:resize:width', this.sidebarResizeEvent);

          this.groupTagsButton.addEventListener('click', this.groupTagsButtonClickEvent);

          // Prevent filters closing animation on page load
          if (this.collectionSidebar) {
            setTimeout(() => {
              this.collectionSidebar.classList.remove(classes$q.noMobileAnimation);
            }, 1000);
          }

          const toggleFiltersObserver = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
              if (mutation.type === 'attributes') {
                const expanded = mutation.target.getAttribute('aria-expanded') == 'true';

                if (expanded) {
                  this.showSidebarCallback();
                }
              }
            }
          });

          toggleFiltersObserver.observe(this.groupTagsButton, {
            attributes: true,
            childList: false,
            subtree: false,
          });
        }

        // Hide filters sidebar on ESC keypress
        this.container.addEventListener(
          'keyup',
          function (evt) {
            if (evt.code !== 'Escape') {
              return;
            }
            this.hideSidebar();
          }.bind(this)
        );

        if (this.collectionSidebar) {
          this.collectionSidebar.addEventListener('transitionend', () => {
            if (!this.collectionSidebar.classList.contains(classes$q.expanded)) {
              this.collectionSidebar.classList.remove(classes$q.animated);
            }
          });

          this.toggleSidebarSlider();

          this.container.addEventListener('theme:filter:close', this.collectionSidebarCloseEvent);
        }
      }

      showSidebarCallback() {
        const collectionSidebarSlideOut = this.container.querySelector(selectors$A.collectionSidebarSlideOut);
        const isScrollLocked = document.documentElement.hasAttribute('data-scroll-locked');

        const isMobileView = isMobile();
        this.collectionSidebar.classList.add(classes$q.animated);

        if (collectionSidebarSlideOut === null) {
          if (!isMobileView && isScrollLocked) {
            this.a11y.removeTrapFocus();
            document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
          }
        }

        if (isMobileView || collectionSidebarSlideOut !== null) {
          if (collectionSidebarSlideOut) {
            this.a11y.trapFocus(this.collectionSidebar, {
              elementToFocus: this.collectionSidebar.querySelector(selectors$A.collectionSidebarCloseButton),
            });
          }
          document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
        }
      }

      hideSidebar() {
        const collectionSidebarSlideOut = this.container.querySelector(selectors$A.collectionSidebarSlideOut);
        const isScrollLocked = document.documentElement.hasAttribute('data-scroll-locked');

        this.groupTagsButton.setAttribute('aria-expanded', 'false');
        this.collectionSidebar.classList.remove(classes$q.expanded);

        if (collectionSidebarSlideOut) {
          this.a11y.removeTrapFocus();
        }

        if (isScrollLocked) {
          document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
        }
      }

      toggleSidebarSlider() {
        if (isMobile()) {
          this.hideSidebar();
        } else if (this.collectionSidebar.classList.contains(classes$q.expanded)) {
          this.showSidebarCallback();
        }
      }

      collectionSidebarClose(evt) {
        evt.preventDefault();
        this.hideSidebar();
        if (document.body.classList.contains(classes$q.focused) && this.groupTagsButton) {
          this.groupTagsButton.focus();
        }
      }

      groupTagsButtonClick() {
        const isScrollLocked = document.documentElement.hasAttribute('data-scroll-locked');

        if (isScrollLocked) {
          document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
        }
      }

      onUnload() {
        if (this.groupTagsButton !== null) {
          document.removeEventListener('theme:resize:width', this.sidebarResizeEvent);
          this.groupTagsButton.removeEventListener('click', this.groupTagsButtonClickEvent);
        }

        if (this.collectionSidebar) {
          this.container.removeEventListener('theme:filter:close', this.collectionSidebarCloseEvent);
        }
      }
    }

    const collectionSection = {
      onLoad() {
        sections$i[this.id] = new Collection(this);
      },
      onUnload() {
        sections$i[this.id].onUnload();
      },
    };

    register('collection', [slider, parallaxHero, collectionSection, tooltipSection]);

    const selectors$z = {
      frame: '[data-ticker-frame]',
      scale: '[data-ticker-scale]',
      text: '[data-ticker-text]',
      clone: 'data-clone',
    };

    const attributes$l = {
      autoplay: 'autoplay',
      speed: 'speed',
    };

    const classes$p = {
      animation: 'ticker--animated',
      unloaded: 'ticker--unloaded',
      comparitor: 'ticker__comparitor',
    };

    const settings$2 = {
      speed: 1.63, // 100px going to move for 1.63s
      space: 100, // 100px
    };

    class Ticker extends HTMLElement {
      constructor() {
        super();

        this.autoplay = this.hasAttribute(attributes$l.autoplay);
        this.scale = this.querySelector(selectors$z.scale);
        this.text = this.querySelector(selectors$z.text);
        this.speed = this.hasAttribute(attributes$l.speed) ? this.getAttribute(attributes$l.speed) : settings$2.speed;
        this.comparitor = this.text.cloneNode(true);
        this.comparitor.classList.add(classes$p.comparitor);
        this.appendChild(this.comparitor);
        this.scale.classList.remove(classes$p.unloaded);
        this.checkWidthEvent = this.checkWidth.bind(this);
      }

      connectedCallback() {
        this.checkWidth();
        this.addEventListener(
          'theme:ticker:refresh',
          debounce(() => this.checkWidthEvent(), 50)
        );

        screen.orientation.addEventListener('change', this.checkWidthEvent);
        document.addEventListener('theme:resize:width', this.checkWidthEvent);
      }

      disconnectedCallback() {
        document.removeEventListener('theme:resize:width', this.checkWidthEvent);
      }

      checkWidth() {
        this.text = this.querySelector(selectors$z.text);

        const padding = window.getComputedStyle(this).paddingLeft.replace('px', '') * 2;
        const isOverflowing = this.clientWidth - padding < this.comparitor.clientWidth;

        if (isOverflowing || this.autoplay) {
          this.text.classList.remove(classes$p.animation);

          const clones = this.scale.querySelectorAll(`[${selectors$z.clone}]`);
          const limitClones = this.autoplay ? parseInt((window.innerWidth - padding) / this.text.clientWidth) : 2;

          // Remove old clones
          clones?.forEach((item) => {
            item.remove();
          });

          if (this.autoplay || isOverflowing) {
            for (let index = 0; index <= limitClones; index++) {
              const cloneSecond = this.text.cloneNode(true);
              cloneSecond.setAttribute(selectors$z.clone, '');
              this.scale.appendChild(cloneSecond);
            }
          }

          const animationTimeFrame = ((this.text.clientWidth / settings$2.space) * Number(this.speed)).toFixed(2);

          this.scale.style.removeProperty('--animation-time');
          this.scale.style.setProperty('--animation-time', `${animationTimeFrame}s`);

          this.scale.querySelectorAll(selectors$z.text)?.forEach((text) => {
            text.classList.add(classes$p.animation);
          });
        } else {
          this.text.classList.add(classes$p.animation);
          const clones = this.scale.querySelectorAll(`[${selectors$z.clone}]`);

          clones.forEach((clone) => {
            clone.parentNode.removeChild(clone);
          });

          this.text.classList.remove(classes$p.animation);
        }
      }
    }

    const selectors$y = {
      marquee: '.announcement__bar-holder--marquee',
      slide: '[data-slide]',
      slider: '[data-slider]',
      ticker: 'ticker-bar',
      tickerSlide: '.announcement__slide',
    };

    const classes$o = {
      hidden: 'hidden',
    };

    class AnnouncementBar extends HTMLElement {
      constructor() {
        super();

        this.slider = this.querySelector(selectors$y.slider);
        this.enableSlider = isDesktop();
        this.slidesCount = this.querySelectorAll(selectors$y.tickerSlide).length;
        this.initSliderEvent = (event) => this.initSlider(event);
      }

      connectedCallback() {
        if (this.slider) {
          this.initSliders();
        }

        this.addEventListener('theme:block:select', (e) => {
          this.onBlockSelect(e);
        });

        this.addEventListener('theme:block:deselect', (e) => {
          this.onBlockDeselect(e);
        });

        this.addEventListener('theme:countdown:hide', (e) => {
          if (window.Shopify.designMode) return;

          const isMarquee = e.target.closest(selectors$y.marquee);

          if (this.slidesCount === 1) {
            const tickerBar = this.querySelector(selectors$y.ticker);
            tickerBar.style.display = 'none';
          }

          if (isMarquee) {
            const tickerText = e.target.closest(selectors$y.tickerSlide);
            this.removeTickerText(tickerText);
          } else {
            const slide = e.target.closest(selectors$y.slide);
            this.removeSlide(slide);
          }
        });

        this.addEventListener('theme:countdown:expire', () => {
          this.querySelectorAll(selectors$y.ticker)?.forEach((ticker) => {
            ticker.dispatchEvent(new CustomEvent('theme:ticker:refresh'));
          });
        });

        document.dispatchEvent(new CustomEvent('theme:announcement:init', {bubbles: true}));
      }

      /**
       * Init slider
       */
      initSliders() {
        this.initSlider();
        document.addEventListener('theme:resize:width', this.initSliderEvent);

        this.addEventListener('theme:slider:loaded', () => {
          this.querySelectorAll(selectors$y.tickerBar)?.forEach((ticker) => {
            ticker.dispatchEvent(new CustomEvent('theme:ticker:refresh'));
          });
        });
      }

      initSlider() {
        const isDesktopView = isDesktop();
        const isMobileView = !isDesktopView;

        if ((isDesktopView && this.enableSlider) || (isMobileView && !this.enableSlider)) {
          this.slider.flkty?.destroy();

          if (isDesktopView && this.enableSlider) {
            this.enableSlider = false;
          } else if (isMobileView && !this.enableSlider) {
            this.enableSlider = true;
          }

          this.slider = new Slider(this, this.querySelector(selectors$y.slider));
          this.slider.flkty?.reposition();
        }
      }

      removeSlide(slide) {
        this.slider.flkty?.remove(slide);

        if (this.slider.flkty?.cells.length === 0) {
          this.section.classList.add(classes$o.hidden);
        }
      }

      removeTickerText(tickerText) {
        const ticker = tickerText.closest(selectors$y.ticker);
        tickerText.remove();
        ticker.dispatchEvent(new CustomEvent('theme:ticker:refresh'));
      }

      onBlockSelect(e) {
        if (this.slider) {
          this.slider.onBlockSelect(e);
        }
      }

      onBlockDeselect(e) {
        if (this.slider) {
          this.slider.onBlockDeselect(e);
        }
      }

      disconnectedCallback() {
        document.removeEventListener('theme:resize:width', this.initSliderEvent);
        document.removeEventListener('theme:resize:width', this.tickerResizeEvent);

        this.removeEventListener('theme:block:select', (e) => {
          this.onBlockSelect(e);
        });

        this.removeEventListener('theme:block:deselect', (e) => {
          this.onBlockDeselect(e);
        });
      }
    }

    if (!customElements.get('announcement-bar')) {
      customElements.define('announcement-bar', AnnouncementBar);
    }

    if (!customElements.get('ticker-bar')) {
      customElements.define('ticker-bar', Ticker);
    }

    const selectors$x = {
      body: 'body',
      drawerWrappper: '[data-drawer]',
      drawerInner: '[data-drawer-inner]',
      underlay: '[data-drawer-underlay]',
      stagger: '[data-stagger-animation]',
      wrapper: '[data-header-wrapper]',
      drawerToggle: 'data-drawer-toggle',
      focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
    };

    const classes$n = {
      animated: 'drawer--animated',
      open: 'is-open',
      closing: 'is-closing',
      isFocused: 'is-focused',
      headerStuck: 'js__header__stuck',
    };

    let sections$h = {};

    class Drawer {
      constructor(el) {
        this.isAnimating = false;
        this.drawer = el;
        this.drawerWrapper = this.drawer.closest(selectors$x.drawerWrappper);
        this.drawerInner = this.drawer.querySelector(selectors$x.drawerInner);
        this.underlay = this.drawer.querySelector(selectors$x.underlay);
        this.wrapper = this.drawer.closest(selectors$x.wrapper);
        this.key = this.drawer.dataset.drawer;
        this.btnSelector = `[${selectors$x.drawerToggle}='${this.key}']`;
        this.buttons = document.querySelectorAll(this.btnSelector);
        this.staggers = this.drawer.querySelectorAll(selectors$x.stagger);
        this.body = document.querySelector(selectors$x.body);
        this.showDrawer = this.showDrawer.bind(this);
        this.hideDrawer = this.hideDrawer.bind(this);

        this.connectToggle();
        this.connectDrawer();
        this.closers();
      }

      connectToggle() {
        this.buttons.forEach((btn) => {
          btn.addEventListener('click', () => {
            this.drawer.dispatchEvent(
              new CustomEvent('theme:drawer:toggle', {
                bubbles: false,
              })
            );
          });
        });
      }

      connectDrawer() {
        this.drawer.addEventListener('theme:drawer:toggle', () => {
          if (this.drawer.classList.contains(classes$n.open)) {
            this.drawer.dispatchEvent(
              new CustomEvent('theme:drawer:close', {
                bubbles: true,
              })
            );
          } else {
            this.drawer.dispatchEvent(
              new CustomEvent('theme:drawer:open', {
                bubbles: true,
              })
            );
          }
        });

        document.addEventListener('theme:cart-drawer:open', this.hideDrawer);
        document.addEventListener('theme:drawer:close', this.hideDrawer);
        document.addEventListener('theme:drawer:open', this.showDrawer);
      }

      closers() {
        this.wrapper.addEventListener('keyup', (event) => {
          if (event.code !== 'Escape') {
            return;
          }

          this.hideDrawer();
        });

        this.underlay.addEventListener('click', () => {
          this.hideDrawer();
        });
      }

      showDrawer() {
        if (this.isAnimating) return;

        this.isAnimating = true;

        this.buttons.forEach((el) => {
          el.setAttribute('aria-expanded', true);
        });

        this.drawer.classList.add(classes$n.open, classes$n.animated);

        document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));

        if (this.drawerInner && this.drawerInner.querySelector(this.btnSelector)) {
          removeTrapFocus();

          waitForAnimationEnd(this.drawerInner).then(() => {
            this.drawer.querySelector(selectors$x.focusable).focus();
            this.isAnimating = false;

            trapFocus(this.drawerInner, {
              elementToFocus: this.drawerInner.querySelector(this.btnSelector),
            });
          });
        }
      }

      hideDrawer() {
        if (!this.drawer.classList.contains(classes$n.open) || this.isAnimating) {
          return;
        }
        this.isAnimating = true;

        this.drawer.classList.add(classes$n.closing);
        this.drawer.classList.remove(classes$n.open);

        removeTrapFocus();

        if (this.body.classList.contains(classes$n.isFocused) && this.buttons.length) {
          this.buttons[0].focus();
        }

        this.buttons.forEach((el) => {
          el.setAttribute('aria-expanded', false);
        });

        document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));

        waitForAnimationEnd(this.drawerInner).then(() => {
          this.drawer.classList.remove(classes$n.closing, classes$n.animated);

          this.isAnimating = false;

          // Reset menu items state after drawer hiding animation completes
          document.dispatchEvent(new CustomEvent('theme:sliderule:close', {bubbles: false}));
        });
      }

      onUnload() {
        document.removeEventListener('theme:cart-drawer:open', this.hideDrawer);
        document.removeEventListener('theme:drawer:close', this.hideDrawer);
        document.removeEventListener('theme:drawer:open', this.showDrawer);
      }
    }

    const drawer = {
      onLoad() {
        sections$h[this.id] = [];
        const els = this.container.querySelectorAll(selectors$x.drawerWrappper);
        els.forEach((el) => {
          sections$h[this.id].push(new Drawer(el));
        });
      },
      onUnload() {
        sections$h[this.id].forEach((el) => {
          if (typeof el.onUnload === 'function') {
            el.onUnload();
          }
        });
      },
    };

    const selectors$w = {
      pageHeader: '.page-header',
    };

    const classes$m = {
      stuck: 'js__header__stuck',
      sticky: 'has-header-sticky',
      headerGroup: 'shopify-section-group-header-group',
    };

    const attributes$k = {
      stickyHeader: 'data-header-sticky',
      scrollLock: 'data-scroll-locked',
    };

    let sections$g = {};

    class Sticky {
      constructor(el) {
        this.wrapper = el;
        this.sticks = this.wrapper.hasAttribute(attributes$k.stickyHeader);

        document.body.classList.toggle(classes$m.sticky, this.sticks);

        if (!this.sticks) return;

        this.isStuck = false;
        this.cls = this.wrapper.classList;
        this.headerOffset = document.querySelector(selectors$w.pageHeader)?.offsetTop;
        this.updateHeaderOffset = this.updateHeaderOffset.bind(this);
        this.scrollEvent = (e) => this.onScroll(e);

        this.listen();
        this.stickOnLoad();
      }

      listen() {
        document.addEventListener('theme:scroll', this.scrollEvent);
        document.addEventListener('shopify:section:load', this.updateHeaderOffset);
        document.addEventListener('shopify:section:unload', this.updateHeaderOffset);
      }

      onScroll(e) {
        if (e.detail.down) {
          if (!this.isStuck && e.detail.position > this.headerOffset) {
            this.stickSimple();
          }
        } else if (e.detail.position <= this.headerOffset) {
          this.unstickSimple();
        }
      }

      updateHeaderOffset(event) {
        if (!event.target.classList.contains(classes$m.headerGroup)) return;

        // Update header offset after any "Header group" section has been changed
        setTimeout(() => {
          this.headerOffset = document.querySelector(selectors$w.pageHeader)?.offsetTop;
        });
      }

      stickOnLoad() {
        if (window.scrollY > this.headerOffset) {
          this.stickSimple();
        }
      }

      stickSimple() {
        this.cls.add(classes$m.stuck);
        this.isStuck = true;
      }

      unstickSimple() {
        if (!document.documentElement.hasAttribute(attributes$k.scrollLock)) {
          // check for scroll lock
          this.cls.remove(classes$m.stuck);
          this.isStuck = false;
        }
      }

      unload() {
        document.removeEventListener('theme:scroll', this.scrollEvent);
        document.removeEventListener('shopify:section:load', this.updateHeaderOffset);
        document.removeEventListener('shopify:section:unload', this.updateHeaderOffset);
      }
    }

    const stickyHeader = {
      onLoad() {
        sections$g = new Sticky(this.container);
      },
      onUnload: function () {
        if (typeof sections$g.unload === 'function') {
          sections$g.unload();
        }
      },
    };

    const selectors$v = {
      disclosureToggle: 'data-hover-disclosure-toggle',
      disclosureWrappper: '[data-hover-disclosure]',
      link: '[data-top-link]',
      wrapper: '[data-header-wrapper]',
      stagger: '[data-stagger]',
      staggerPair: '[data-stagger-first]',
      staggerAfter: '[data-stagger-second]',
      focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    };

    const classes$l = {
      isVisible: 'is-visible',
      meganavVisible: 'meganav--visible',
      meganavIsTransitioning: 'meganav--is-transitioning',
    };

    let sections$f = {};
    let disclosures = {};
    class HoverDisclosure {
      constructor(el) {
        this.disclosure = el;
        this.wrapper = el.closest(selectors$v.wrapper);
        this.key = this.disclosure.id;
        this.trigger = document.querySelector(`[${selectors$v.disclosureToggle}='${this.key}']`);
        this.link = this.trigger.querySelector(selectors$v.link);
        this.grandparent = this.trigger.classList.contains('grandparent');
        this.transitionTimeout = 0;

        this.trigger.setAttribute('aria-haspopup', true);
        this.trigger.setAttribute('aria-expanded', false);
        this.trigger.setAttribute('aria-controls', this.key);

        this.connectHoverToggle();
        this.handleTablets();
        this.staggerChildAnimations();
      }

      onBlockSelect(evt) {
        if (this.disclosure.contains(evt.target)) {
          this.showDisclosure(evt);
        }
      }

      onBlockDeselect(evt) {
        if (this.disclosure.contains(evt.target)) {
          this.hideDisclosure();
        }
      }

      showDisclosure(e) {
        if (e && e.type && e.type === 'mouseenter') {
          this.wrapper.classList.add(classes$l.meganavIsTransitioning);
        }

        if (this.grandparent) {
          this.wrapper.classList.add(classes$l.meganavVisible);
        } else {
          this.wrapper.classList.remove(classes$l.meganavVisible);
        }
        this.trigger.setAttribute('aria-expanded', true);
        this.trigger.classList.add(classes$l.isVisible);
        this.disclosure.classList.add(classes$l.isVisible);

        if (this.transitionTimeout) {
          clearTimeout(this.transitionTimeout);
        }

        this.transitionTimeout = setTimeout(() => {
          this.wrapper.classList.remove(classes$l.meganavIsTransitioning);
        }, 200);
      }

      hideDisclosure() {
        this.disclosure.classList.remove(classes$l.isVisible);
        this.trigger.classList.remove(classes$l.isVisible);
        this.trigger.setAttribute('aria-expanded', false);
        this.wrapper.classList.remove(classes$l.meganavVisible, classes$l.meganavIsTransitioning);
      }

      staggerChildAnimations() {
        const simple = this.disclosure.querySelectorAll(selectors$v.stagger);
        simple.forEach((el, index) => {
          el.style.transitionDelay = `${index * 50 + 10}ms`;
        });

        const pairs = this.disclosure.querySelectorAll(selectors$v.staggerPair);
        pairs.forEach((child, i) => {
          const d1 = i * 100;
          child.style.transitionDelay = `${d1}ms`;
          child.parentElement.querySelectorAll(selectors$v.staggerAfter).forEach((grandchild, i2) => {
            const di1 = i2 + 1;
            const d2 = di1 * 20;
            grandchild.style.transitionDelay = `${d1 + d2}ms`;
          });
        });
      }

      handleTablets() {
        // first click opens the popup, second click opens the link
        this.trigger.addEventListener(
          'touchstart',
          function (e) {
            const isOpen = this.disclosure.classList.contains(classes$l.isVisible);
            if (!isOpen) {
              e.preventDefault();
              this.showDisclosure(e);
            }
          }.bind(this),
          {passive: true}
        );
      }

      connectHoverToggle() {
        this.trigger.addEventListener('mouseenter', (e) => this.showDisclosure(e));
        this.link.addEventListener('focus', (e) => this.showDisclosure(e));

        this.trigger.addEventListener('mouseleave', () => this.hideDisclosure());
        this.trigger.addEventListener('focusout', (e) => {
          const inMenu = this.trigger.contains(e.relatedTarget);
          if (!inMenu) {
            this.hideDisclosure();
          }
        });
        this.disclosure.addEventListener('keyup', (evt) => {
          if (evt.code !== 'Escape') {
            return;
          }
          this.hideDisclosure();
        });
      }
    }

    const hoverDisclosure = {
      onLoad() {
        sections$f[this.id] = [];
        disclosures = this.container.querySelectorAll(selectors$v.disclosureWrappper);
        disclosures.forEach((el) => {
          sections$f[this.id].push(new HoverDisclosure(el));
        });
      },
      onBlockSelect(evt) {
        sections$f[this.id].forEach((el) => {
          if (typeof el.onBlockSelect === 'function') {
            el.onBlockSelect(evt);
          }
        });
      },
      onBlockDeselect(evt) {
        sections$f[this.id].forEach((el) => {
          if (typeof el.onBlockDeselect === 'function') {
            el.onBlockDeselect(evt);
          }
        });
      },
    };

    const selectors$u = {
      slideruleOpen: 'data-sliderule-open',
      slideruleClose: 'data-sliderule-close',
      sliderulePane: 'data-sliderule-pane',
      slideruleWrappper: '[data-sliderule]',
      drawerContent: '[data-drawer-content]',
      focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      dataAnimates: 'data-animates',
      children: `:scope > [data-animates],
             :scope > * > [data-animates],
             :scope > * > * >[data-animates],
             :scope > * > .sliderule-grid  > *`,
    };

    const classes$k = {
      isVisible: 'is-visible',
      isHiding: 'is-hiding',
      isHidden: 'is-hidden',
      focused: 'is-focused',
      scrolling: 'is-scrolling',
    };

    let sections$e = {};

    class HeaderMobileSliderule {
      constructor(el) {
        this.sliderule = el;
        this.key = this.sliderule.id;
        const btnSelector = `[${selectors$u.slideruleOpen}='${this.key}']`;
        this.exitSelector = `[${selectors$u.slideruleClose}='${this.key}']`;
        this.trigger = document.querySelector(btnSelector);
        this.exit = document.querySelectorAll(this.exitSelector);
        this.pane = document.querySelector(`[${selectors$u.sliderulePane}]`);
        this.children = this.sliderule.querySelectorAll(selectors$u.children);
        this.drawerContent = document.querySelector(selectors$u.drawerContent);
        this.cachedButton = null;
        this.accessibility = a11y;

        this.trigger.setAttribute('aria-haspopup', true);
        this.trigger.setAttribute('aria-expanded', false);
        this.trigger.setAttribute('aria-controls', this.key);
        this.closeSliderule = this.closeSliderule.bind(this);

        this.clickEvents();
        this.keyboardEvents();

        document.addEventListener('theme:sliderule:close', this.closeSliderule);
      }

      clickEvents() {
        this.trigger.addEventListener('click', () => {
          this.cachedButton = this.trigger;
          this.showSliderule();
        });
        this.exit.forEach((element) => {
          element.addEventListener('click', () => {
            this.hideSliderule();
          });
        });
      }

      keyboardEvents() {
        this.sliderule.addEventListener('keyup', (evt) => {
          evt.stopPropagation();
          if (evt.code !== 'Escape') {
            return;
          }

          this.hideSliderule();
        });
      }

      trapFocusSliderule(showSliderule = true) {
        const trapFocusButton = showSliderule ? this.sliderule.querySelector(this.exitSelector) : this.cachedButton;

        this.accessibility.removeTrapFocus();

        if (trapFocusButton && this.drawerContent) {
          this.accessibility.trapFocus(this.drawerContent, {
            elementToFocus: document.body.classList.contains(classes$k.focused) ? trapFocusButton : null,
          });
        }
      }

      hideSliderule(close = false) {
        const newPosition = parseInt(this.pane.dataset.sliderulePane, 10) - 1;
        this.pane.setAttribute(selectors$u.sliderulePane, newPosition);
        this.pane.classList.add(classes$k.isHiding);
        this.sliderule.classList.add(classes$k.isHiding);
        const hiddenSelector = close ? `[${selectors$u.dataAnimates}].${classes$k.isHidden}` : `[${selectors$u.dataAnimates}="${newPosition}"]`;
        const hiddenItems = this.pane.querySelectorAll(hiddenSelector);
        if (hiddenItems.length) {
          hiddenItems.forEach((element) => {
            element.classList.remove(classes$k.isHidden);
          });
        }

        const children = close ? this.pane.querySelectorAll(`.${classes$k.isVisible}, .${classes$k.isHiding}`) : this.children;
        children.forEach((element, index) => {
          const lastElement = children.length - 1 == index;
          element.classList.remove(classes$k.isVisible);
          if (close) {
            element.classList.remove(classes$k.isHiding);
            this.pane.classList.remove(classes$k.isHiding);
          }
          const removeHidingClass = () => {
            if (parseInt(this.pane.getAttribute(selectors$u.sliderulePane)) === newPosition) {
              this.sliderule.classList.remove(classes$k.isVisible);
            }
            this.sliderule.classList.remove(classes$k.isHiding);
            this.pane.classList.remove(classes$k.isHiding);

            if (lastElement) {
              this.accessibility.removeTrapFocus();
              if (!close) {
                this.trapFocusSliderule(false);
              }
            }

            element.removeEventListener('animationend', removeHidingClass);
          };

          if (window.theme.settings.enableAnimations) {
            element.addEventListener('animationend', removeHidingClass);
          } else {
            removeHidingClass();
          }
        });
      }

      showSliderule() {
        let lastScrollableFrame = null;
        const parent = this.sliderule.closest(`.${classes$k.isVisible}`);
        let lastScrollableElement = this.pane;

        if (parent) {
          lastScrollableElement = parent;
        }

        lastScrollableElement.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });

        lastScrollableElement.classList.add(classes$k.scrolling);

        const lastScrollableIsScrolling = () => {
          if (lastScrollableElement.scrollTop <= 0) {
            lastScrollableElement.classList.remove(classes$k.scrolling);
            if (lastScrollableFrame) {
              cancelAnimationFrame(lastScrollableFrame);
            }
          } else {
            lastScrollableFrame = requestAnimationFrame(lastScrollableIsScrolling);
          }
        };

        lastScrollableFrame = requestAnimationFrame(lastScrollableIsScrolling);

        this.sliderule.classList.add(classes$k.isVisible);
        const oldPosition = parseInt(this.pane.dataset.sliderulePane, 10);
        const newPosition = oldPosition + 1;
        this.pane.setAttribute(selectors$u.sliderulePane, newPosition);

        const hiddenItems = this.pane.querySelectorAll(`[${selectors$u.dataAnimates}="${oldPosition}"]`);
        if (hiddenItems.length) {
          hiddenItems.forEach((element, index) => {
            const lastElement = hiddenItems.length - 1 == index;
            element.classList.add(classes$k.isHiding);
            const removeHidingClass = () => {
              element.classList.remove(classes$k.isHiding);
              if (parseInt(this.pane.getAttribute(selectors$u.sliderulePane)) !== oldPosition) {
                element.classList.add(classes$k.isHidden);
              }

              if (lastElement) {
                this.trapFocusSliderule();
              }
              element.removeEventListener('animationend', removeHidingClass);
            };

            if (window.theme.settings.enableAnimations) {
              element.addEventListener('animationend', removeHidingClass);
            } else {
              removeHidingClass();
            }
          });
        }
      }

      closeSliderule() {
        if (this.pane && this.pane.hasAttribute(selectors$u.sliderulePane) && parseInt(this.pane.getAttribute(selectors$u.sliderulePane)) > 0) {
          this.hideSliderule(true);
          if (parseInt(this.pane.getAttribute(selectors$u.sliderulePane)) > 0) {
            this.pane.setAttribute(selectors$u.sliderulePane, 0);
          }
        }
      }

      onUnload() {
        document.removeEventListener('theme:sliderule:close', this.closeSliderule);
      }
    }

    const headerMobileSliderule = {
      onLoad() {
        sections$e[this.id] = [];
        const els = this.container.querySelectorAll(selectors$u.slideruleWrappper);
        els.forEach((el) => {
          sections$e[this.id].push(new HeaderMobileSliderule(el));
        });
      },
      onUnload() {
        sections$e[this.id].forEach((el) => {
          if (typeof el.onUnload === 'function') {
            el.onUnload();
          }
        });
      },
    };

    const selectors$t = {
      wrapper: '[data-header-wrapper]',
      style: 'data-header-style',
      widthContentWrapper: '[data-takes-space-wrapper]',
      widthContent: '[data-child-takes-space]',
      desktop: '[data-header-desktop]',
      deadLink: '.navlink[href="#"]',
      cartDrawer: 'cart-drawer',
      cartToggleButton: '[data-cart-toggle]',
      firstSectionOverlayHeader: '.main-content > .shopify-section.section-overlay-header:first-of-type',
    };

    const classes$j = {
      clone: 'js__header__clone',
      firstSectionOverlayHeader: 'has-first-section-overlay-header',
      showMobileClass: 'js__show__mobile',
      transparent: 'has-header-transparent',
    };

    const attributes$j = {
      transparent: 'data-header-transparent',
    };

    let sections$d = {};

    class Header {
      constructor(el) {
        this.wrapper = el;
        this.style = this.wrapper.dataset.style;
        this.desktop = this.wrapper.querySelector(selectors$t.desktop);
        this.deadLinks = document.querySelectorAll(selectors$t.deadLink);
        this.resizeObserver = null;
        this.checkWidth = this.checkWidth.bind(this);

        this.killDeadLinks();
        if (this.style !== 'drawer' && this.desktop) {
          this.minWidth = this.getMinWidth();
          this.listenWidth();
        }

        this.cartToggleEvent();

        // Fallback for CSS :has() selectors
        const firstSectionOverlayHeader = document.querySelector(selectors$t.firstSectionOverlayHeader);
        document.body.classList.toggle(classes$j.transparent, this.wrapper.hasAttribute(attributes$j.transparent));
        document.body.classList.toggle(classes$j.firstSectionOverlayHeader, firstSectionOverlayHeader);
      }

      initTicker(stopClone = false) {
        this.tickerFrames.forEach((frame) => {
          new Ticker(frame, stopClone);
        });

        this.tickerResizeEvent = (event) => this.onTickerResize(event);

        document.addEventListener('theme:resize:width', this.tickerResizeEvent);
      }

      listenWidth() {
        if ('ResizeObserver' in window) {
          this.resizeObserver = new ResizeObserver(this.checkWidth);
          this.resizeObserver.observe(this.wrapper);
        } else {
          document.addEventListener('theme:resize', this.checkWidth);
        }
      }

      killDeadLinks() {
        this.deadLinks.forEach((el) => {
          el.onclick = (e) => {
            e.preventDefault();
          };
        });
      }

      checkWidth() {
        if (document.body.clientWidth < this.minWidth) {
          this.wrapper.classList.add(classes$j.showMobileClass);

          // Update --header-height CSS variable when switching to a mobile nav
          const {headerHeight} = readHeights();
          document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        } else {
          this.wrapper.classList.remove(classes$j.showMobileClass);
        }
      }

      getMinWidth() {
        const comparitor = this.wrapper.cloneNode(true);
        comparitor.classList.add(classes$j.clone);
        document.body.appendChild(comparitor);
        const widthWrappers = comparitor.querySelectorAll(selectors$t.widthContentWrapper);
        let minWidth = 0;
        let spaced = 0;

        widthWrappers.forEach((context) => {
          const wideElements = context.querySelectorAll(selectors$t.widthContent);
          let thisWidth = 0;
          if (wideElements.length === 3) {
            thisWidth = _sumSplitWidths(wideElements);
          } else {
            thisWidth = _sumWidths(wideElements);
          }
          if (thisWidth > minWidth) {
            minWidth = thisWidth;
            spaced = wideElements.length * 20;
          }
        });

        document.body.removeChild(comparitor);
        return minWidth + spaced;
      }

      cartToggleEvent() {
        if (theme.settings.cartType !== 'drawer') return;

        this.wrapper.querySelectorAll(selectors$t.cartToggleButton)?.forEach((button) => {
          button.addEventListener('click', (e) => {
            const cartDrawer = document.querySelector(selectors$t.cartDrawer);

            if (cartDrawer) {
              e.preventDefault();
              cartDrawer.dispatchEvent(new CustomEvent('theme:cart-drawer:show'));
              window.accessibility.lastElement = button;
            }
          });
        });
      }

      toggleButtonClick(e) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('theme:cart:toggle', {bubbles: true}));
      }

      unload() {
        if ('ResizeObserver' in window) {
          this.resizeObserver?.unobserve(this.wrapper);
        } else {
          document.removeEventListener('theme:resize', this.checkWidth);
        }
      }
    }

    function _sumSplitWidths(nodes) {
      let arr = [];
      nodes.forEach((el) => {
        if (el.firstElementChild) {
          arr.push(el.firstElementChild.clientWidth);
        }
      });
      if (arr[0] > arr[2]) {
        arr[2] = arr[0];
      } else {
        arr[0] = arr[2];
      }
      const width = arr.reduce((a, b) => a + b);
      return width;
    }
    function _sumWidths(nodes) {
      let width = 0;
      nodes.forEach((el) => {
        width += el.clientWidth;
      });
      return width;
    }

    const header = {
      onLoad() {
        sections$d = new Header(this.container);
      },
      onUnload() {
        if (typeof sections$d.unload === 'function') {
          sections$d.unload();
        }
      },
    };

    register('header', [header, drawer, headerMobileSliderule, stickyHeader, hoverDisclosure]);

    if (!customElements.get('ticker-bar')) {
      customElements.define('ticker-bar', Ticker);
    }

    const selectors$s = {
      scrollElement: '[data-block-scroll]',
      flickityEnabled: 'flickity-enabled',
    };

    const sections$c = {};

    class BlockScroll {
      constructor(el) {
        this.container = el.container;
      }

      onBlockSelect(evt) {
        const scrollElement = this.container.querySelector(selectors$s.scrollElement);
        if (scrollElement && !scrollElement.classList.contains(selectors$s.flickityEnabled)) {
          const currentElement = evt.srcElement;
          if (currentElement) {
            scrollElement.scrollTo({
              top: 0,
              left: currentElement.offsetLeft,
              behavior: 'smooth',
            });
          }
        }
      }
    }

    const blockScroll = {
      onLoad() {
        sections$c[this.id] = new BlockScroll(this);
      },
      onBlockSelect(e) {
        sections$c[this.id].onBlockSelect(e);
      },
    };

    const selectors$r = {
      slider: '[data-slider-mobile]',
      slide: '[data-slide]',
      thumb: '[data-slider-thumb]',
      sliderContainer: '[data-slider-container]',
      popupContainer: '[data-popup-container]',
      popupClose: '[data-popup-close]',
    };

    const classes$i = {
      isAnimating: 'is-animating',
      isSelected: 'is-selected',
      isOpen: 'is-open',
    };

    const attributes$i = {
      thumbValue: 'data-slider-thumb',
    };

    const sections$b = {};

    class Look {
      constructor(section) {
        this.container = section.container;
        this.slider = this.container.querySelector(selectors$r.slider);
        this.slides = this.container.querySelectorAll(selectors$r.slide);
        this.thumbs = this.container.querySelectorAll(selectors$r.thumb);
        this.popupContainer = this.container.querySelector(selectors$r.popupContainer);
        this.popupClose = this.container.querySelectorAll(selectors$r.popupClose);
        this.popupCloseByEvent = this.popupCloseByEvent.bind(this);

        this.init();
      }

      init() {
        if (this.slider && this.slides.length && this.thumbs.length) {
          this.popupContainer.addEventListener('transitionend', (e) => {
            if (e.target != this.popupContainer) return;

            this.popupContainer.classList.remove(classes$i.isAnimating);
            if (e.target.classList.contains(classes$i.isOpen)) {
              this.popupOpenCallback();
            } else {
              this.popupCloseCallback();
            }
          });

          this.popupContainer.addEventListener('transitionstart', (e) => {
            if (e.target != this.popupContainer) return;

            this.popupContainer.classList.add(classes$i.isAnimating);
          });

          this.popupClose.forEach((button) => {
            button.addEventListener('click', () => {
              this.popupContainer.classList.remove(classes$i.isOpen);
              document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
            });
          });

          this.thumbs.forEach((thumb, i) => {
            thumb.addEventListener('click', (e) => {
              e.preventDefault();
              const idx = thumb.hasAttribute(attributes$i.thumbValue) && thumb.getAttribute(attributes$i.thumbValue) !== '' ? parseInt(thumb.getAttribute(attributes$i.thumbValue)) : i;
              const slide = this.slides[idx];
              if (isMobile()) {
                const parentPadding = parseInt(window.getComputedStyle(this.slider).paddingLeft);
                this.slider.scrollTo({
                  top: 0,
                  left: slide.offsetLeft - parentPadding,
                  behavior: 'auto',
                });
                document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
                this.popupContainer.classList.add(classes$i.isAnimating, classes$i.isOpen);
              } else {
                let {stickyHeaderHeight} = readHeights();
                const slideTop = slide.getBoundingClientRect().top;
                const slideHeightHalf = slide.offsetHeight / 2;
                const windowHeight = window.innerHeight;
                const windowHeightHalf = windowHeight / 2;
                const sliderContainer = this.container.querySelector(selectors$r.sliderContainer);
                let scrollTarget = slideTop + slideHeightHalf - windowHeightHalf + window.scrollY;

                if (sliderContainer) {
                  const sliderContainerTop = sliderContainer.getBoundingClientRect().top + window.scrollY;
                  const sliderContainerHeight = sliderContainer.offsetHeight;
                  const sliderContainerBottom = sliderContainerTop + sliderContainerHeight;

                  if (scrollTarget < sliderContainerTop) {
                    scrollTarget = sliderContainerTop - stickyHeaderHeight;
                  } else if (scrollTarget + windowHeight > sliderContainerBottom) {
                    scrollTarget = sliderContainerBottom - windowHeight;
                  }
                }

                window.scrollTo({
                  top: scrollTarget,
                  left: 0,
                  behavior: 'smooth',
                });
              }
            });
          });
        }
      }

      popupCloseByEvent() {
        this.popupContainer.classList.remove(classes$i.isOpen);
      }

      popupOpenCallback() {
        document.addEventListener('theme:quick-add:open', this.popupCloseByEvent, {once: true});
        document.addEventListener('theme:product:added', this.popupCloseByEvent, {once: true});
      }

      popupCloseCallback() {
        document.removeEventListener('theme:quick-add:open', this.popupCloseByEvent, {once: true});
        document.removeEventListener('theme:product:added', this.popupCloseByEvent, {once: true});
      }
    }

    const lookSection = {
      onLoad() {
        sections$b[this.id] = new Look(this);
      },
    };

    register('look', [lookSection, blockScroll]);

    function Listeners() {
      this.entries = [];
    }

    Listeners.prototype.add = function (element, event, fn) {
      this.entries.push({element: element, event: event, fn: fn});
      element.addEventListener(event, fn);
    };

    Listeners.prototype.removeAll = function () {
      this.entries = this.entries.filter(function (listener) {
        listener.element.removeEventListener(listener.event, listener.fn);
        return false;
      });
    };

    /**
     * Convert the Object (with 'name' and 'value' keys) into an Array of values, then find a match & return the variant (as an Object)
     * @param {Object} product Product JSON object
     * @param {Object} collection Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
     * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
     */
    function getVariantFromSerializedArray(product, collection) {
      _validateProductStructure(product);

      // If value is an array of options
      var optionArray = _createOptionArrayFromOptionCollection(product, collection);
      return getVariantFromOptionArray(product, optionArray);
    }

    /**
     * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
     * @param {Object} product Product JSON object
     * @param {Array} options List of submitted values (e.g. ['36', 'Black'])
     * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
     */
    function getVariantFromOptionArray(product, options) {
      _validateProductStructure(product);
      _validateOptionsArray(options);

      var result = product.variants.filter(function (variant) {
        return options.every(function (option, index) {
          return variant.options[index] === option;
        });
      });

      return result[0] || null;
    }

    /**
     * Creates an array of selected options from the object
     * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
     * @param {Object} product Product JSON object
     * @param {Array} collection Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
     * @returns {Array} The result of the matched values. (e.g. ['36', 'Black'])
     */
    function _createOptionArrayFromOptionCollection(product, collection) {
      _validateProductStructure(product);
      _validateSerializedArray(collection);

      var optionArray = [];

      collection.forEach(function (option) {
        for (var i = 0; i < product.options.length; i++) {
          var name = product.options[i].name || product.options[i];
          if (name.toLowerCase() === option.name.toLowerCase()) {
            optionArray[i] = option.value;
            break;
          }
        }
      });

      return optionArray;
    }

    /**
     * Check if the product data is a valid JS object
     * Error will be thrown if type is invalid
     * @param {object} product Product JSON object
     */
    function _validateProductStructure(product) {
      if (typeof product !== 'object') {
        throw new TypeError(product + ' is not an object.');
      }

      if (Object.keys(product).length === 0 && product.constructor === Object) {
        throw new Error(product + ' is empty.');
      }
    }

    /**
     * Validate the structure of the array
     * It must be formatted like jQuery's serializeArray()
     * @param {Array} collection Array of object [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }]
     */
    function _validateSerializedArray(collection) {
      if (!Array.isArray(collection)) {
        throw new TypeError(collection + ' is not an array.');
      }

      if (collection.length === 0) {
        throw new Error(collection + ' is empty.');
      }

      if (collection[0].hasOwnProperty('name')) {
        if (typeof collection[0].name !== 'string') {
          throw new TypeError('Invalid value type passed for name of option ' + collection[0].name + '. Value should be string.');
        }
      } else {
        throw new Error(collection[0] + 'does not contain name key.');
      }
    }

    /**
     * Validate the structure of the array
     * It must be formatted as list of values
     * @param {Array} collection Array of object (e.g. ['36', 'Black'])
     */
    function _validateOptionsArray(options) {
      if (Array.isArray(options) && typeof options[0] === 'object') {
        throw new Error(options + 'is not a valid array of options.');
      }
    }

    var selectors$q = {
      idInput: '[name="id"]',
      planInput: '[name="selling_plan"]',
      optionInput: '[name^="options"]',
      quantityInput: '[name="quantity"]',
      propertyInput: '[name^="properties"]',
    };

    // Public Methods
    // -----------------------------------------------------------------------------

    /**
     * Returns a URL with a variant ID query parameter. Useful for updating window.history
     * with a new URL based on the currently select product variant.
     * @param {string} url - The URL you wish to append the variant ID to
     * @param {number} id  - The variant ID you wish to append to the URL
     * @returns {string} - The new url which includes the variant ID query parameter
     */

    function getUrlWithVariant(url, id) {
      if (/variant=/.test(url)) {
        return url.replace(/(variant=)[^&]+/, '$1' + id);
      } else if (/\?/.test(url)) {
        return url.concat('&variant=').concat(id);
      }

      return url.concat('?variant=').concat(id);
    }

    /**
     * Constructor class that creates a new instance of a product form controller.
     *
     * @param {Element} element - DOM element which is equal to the <form> node wrapping product form inputs
     * @param {Object} product - A product object
     * @param {Object} options - Optional options object
     * @param {Function} options.onOptionChange - Callback for whenever an option input changes
     * @param {Function} options.onPlanChange - Callback for changes to name=selling_plan
     * @param {Function} options.onQuantityChange - Callback for whenever an quantity input changes
     * @param {Function} options.onPropertyChange - Callback for whenever a property input changes
     * @param {Function} options.onFormSubmit - Callback for whenever the product form is submitted
     */
    class ProductFormReader {
      constructor(element, product, options) {
        this.element = element;
        this.product = this._validateProductObject(product);
        this.variantElement = this.element.querySelector(selectors$q.idInput);

        options = options || {};

        this._listeners = new Listeners();
        this._listeners.add(this.element, 'submit', this._onSubmit.bind(this, options));

        this.optionInputs = this._initInputs(selectors$q.optionInput, options.onOptionChange);

        this.planInputs = this._initInputs(selectors$q.planInput, options.onPlanChange);

        this.quantityInputs = this._initInputs(selectors$q.quantityInput, options.onQuantityChange);

        this.propertyInputs = this._initInputs(selectors$q.propertyInput, options.onPropertyChange);
      }

      /**
       * Cleans up all event handlers that were assigned when the Product Form was constructed.
       * Useful for use when a section needs to be reloaded in the theme editor.
       */
      destroy() {
        this._listeners.removeAll();
      }

      /**
       * Getter method which returns the array of currently selected option values
       *
       * @returns {Array} An array of option values
       */
      options() {
        return this._serializeInputValues(this.optionInputs, function (item) {
          var regex = /(?:^(options\[))(.*?)(?:\])/;
          item.name = regex.exec(item.name)[2]; // Use just the value between 'options[' and ']'
          return item;
        });
      }

      /**
       * Getter method which returns the currently selected variant, or `null` if variant
       * doesn't exist.
       *
       * @returns {Object|null} Variant object
       */
      variant() {
        const opts = this.options();
        if (opts.length) {
          return getVariantFromSerializedArray(this.product, opts);
        } else {
          return this.product.variants[0];
        }
      }

      /**
       * Getter method which returns the current selling plan, or `null` if plan
       * doesn't exist.
       *
       * @returns {Object|null} Variant object
       */
      plan(variant) {
        let plan = {
          allocation: null,
          group: null,
          detail: null,
        };
        const sellingPlanChecked = this.element.querySelector(`${selectors$q.planInput}:checked`);
        if (!sellingPlanChecked) return null;
        const sellingPlanCheckedValue = sellingPlanChecked.value;
        const id = sellingPlanCheckedValue && sellingPlanCheckedValue !== '' ? sellingPlanCheckedValue : null;

        if (id && variant) {
          plan.allocation = variant.selling_plan_allocations.find(function (item) {
            return item.selling_plan_id.toString() === id.toString();
          });
        }
        if (plan.allocation) {
          plan.group = this.product.selling_plan_groups.find(function (item) {
            return item.id.toString() === plan.allocation.selling_plan_group_id.toString();
          });
        }
        if (plan.group) {
          plan.detail = plan.group.selling_plans.find(function (item) {
            return item.id.toString() === id.toString();
          });
        }

        if (plan && plan.allocation && plan.detail && plan.allocation) {
          return plan;
        } else return null;
      }

      /**
       * Getter method which returns a collection of objects containing name and values
       * of property inputs
       *
       * @returns {Array} Collection of objects with name and value keys
       */
      properties() {
        return this._serializeInputValues(this.propertyInputs, function (item) {
          var regex = /(?:^(properties\[))(.*?)(?:\])/;
          item.name = regex.exec(item.name)[2]; // Use just the value between 'properties[' and ']'
          return item;
        });
      }

      /**
       * Getter method which returns the current quantity or 1 if no quantity input is
       * included in the form
       *
       * @returns {Array} Collection of objects with name and value keys
       */
      quantity() {
        return this.quantityInputs[0] ? Number.parseInt(this.quantityInputs[0].value, 10) : 1;
      }

      getFormState() {
        const variant = this.variant();
        return {
          options: this.options(),
          variant: variant,
          properties: this.properties(),
          quantity: this.quantity(),
          plan: this.plan(variant),
        };
      }

      // Private Methods
      // -----------------------------------------------------------------------------
      _setIdInputValue(variant) {
        if (variant && variant.id) {
          this.variantElement.value = variant.id.toString();
        } else {
          this.variantElement.value = '';
        }

        this.variantElement.dispatchEvent(new Event('change'));
      }

      _onSubmit(options, event) {
        event.dataset = this.getFormState();
        if (options.onFormSubmit) {
          options.onFormSubmit(event);
        }
      }

      _onOptionChange(event) {
        this._setIdInputValue(event.dataset.variant);
      }

      _onFormEvent(cb) {
        if (typeof cb === 'undefined') {
          return Function.prototype.bind();
        }

        return function (event) {
          event.dataset = this.getFormState();
          this._setIdInputValue(event.dataset.variant);
          cb(event);
        }.bind(this);
      }

      _initInputs(selector, cb) {
        var elements = Array.prototype.slice.call(this.element.querySelectorAll(selector));

        return elements.map(
          function (element) {
            this._listeners.add(element, 'change', this._onFormEvent(cb));
            return element;
          }.bind(this)
        );
      }

      _serializeInputValues(inputs, transform) {
        return inputs.reduce(function (options, input) {
          if (
            input.checked || // If input is a checked (means type radio or checkbox)
            (input.type !== 'radio' && input.type !== 'checkbox') // Or if its any other type of input
          ) {
            options.push(transform({name: input.name, value: input.value}));
          }

          return options;
        }, []);
      }

      _validateProductObject(product) {
        if (typeof product !== 'object') {
          throw new TypeError(product + ' is not an object.');
        }

        if (typeof product.variants[0].options === 'undefined') {
          throw new TypeError('Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route');
        }
        return product;
      }
    }

    function fetchProduct(handle) {
      const requestRoute = `${window.theme.routes.root}products/${handle}.js`;

      return window
        .fetch(requestRoute)
        .then((response) => {
          return response.json();
        })
        .catch((e) => {
          console.error(e);
        });
    }

    const selectors$p = {
      scrollbarAttribute: 'data-scrollbar',
      scrollbar: 'data-scrollbar-slider',
      scrollbarSlideFullWidth: 'data-scrollbar-slide-fullwidth',
      scrollbarArrowPrev: '[data-scrollbar-arrow-prev]',
      scrollbarArrowNext: '[data-scrollbar-arrow-next]',
    };
    const classes$h = {
      hidden: 'is-hidden',
    };
    const settings$1 = {
      delay: 200,
    };

    class NativeScrollbar {
      constructor(scrollbar) {
        this.scrollbar = scrollbar;

        this.arrowNext = this.scrollbar.parentNode.querySelector(selectors$p.scrollbarArrowNext);
        this.arrowPrev = this.scrollbar.parentNode.querySelector(selectors$p.scrollbarArrowPrev);

        if (this.scrollbar.hasAttribute(selectors$p.scrollbarAttribute)) {
          this.init();
          this.listen();
        }

        if (this.scrollbar.hasAttribute(selectors$p.scrollbar)) {
          this.scrollToVisibleElement();
        }
      }

      init() {
        if (this.arrowNext && this.arrowPrev) {
          this.toggleNextArrow();

          this.events();
        }
      }

      listen() {
        document.addEventListener('theme:modal:open', () => {
          this.toggleNextArrow();
        });

        document.addEventListener('theme:resize', () => {
          this.toggleNextArrow();
        });
      }

      events() {
        this.arrowNext.addEventListener('click', (event) => {
          event.preventDefault();

          this.goToNext();
        });

        this.arrowPrev.addEventListener('click', (event) => {
          event.preventDefault();

          this.goToPrev();
        });

        this.scrollbar.addEventListener('scroll', () => {
          this.togglePrevArrow();
          this.toggleNextArrow();
        });
      }

      goToNext() {
        const moveWith = this.scrollbar.hasAttribute(selectors$p.scrollbarSlideFullWidth) ? this.scrollbar.getBoundingClientRect().width : this.scrollbar.getBoundingClientRect().width / 2;
        const position = moveWith + this.scrollbar.scrollLeft;

        this.move(position);

        this.arrowPrev.classList.remove(classes$h.hidden);

        this.toggleNextArrow();
      }

      goToPrev() {
        const moveWith = this.scrollbar.hasAttribute(selectors$p.scrollbarSlideFullWidth) ? this.scrollbar.getBoundingClientRect().width : this.scrollbar.getBoundingClientRect().width / 2;
        const position = this.scrollbar.scrollLeft - moveWith;

        this.move(position);

        this.arrowNext.classList.remove(classes$h.hidden);

        this.togglePrevArrow();
      }

      toggleNextArrow() {
        setTimeout(() => {
          this.arrowNext?.classList.toggle(classes$h.hidden, Math.round(this.scrollbar.scrollLeft + this.scrollbar.getBoundingClientRect().width + 1) >= this.scrollbar.scrollWidth);
        }, settings$1.delay);
      }

      togglePrevArrow() {
        setTimeout(() => {
          this.arrowPrev.classList.toggle(classes$h.hidden, this.scrollbar.scrollLeft <= 0);
        }, settings$1.delay);
      }

      scrollToVisibleElement() {
        [].forEach.call(this.scrollbar.children, (element) => {
          element.addEventListener('click', (event) => {
            event.preventDefault();

            this.move(element.offsetLeft - element.clientWidth);
          });
        });
      }

      move(offsetLeft) {
        this.scrollbar.scrollTo({
          top: 0,
          left: offsetLeft,
          behavior: 'smooth',
        });
      }
    }

    const selectors$o = {
      gridSwatchForm: '[data-grid-swatch-form]',
      input: '[data-swatch-input]',
      productItem: '[data-grid-item]',
      productInfo: '[data-product-information]',
      sectionId: '[data-section-id]',
      productImage: '[data-product-image]',
      swatchButton: '[data-swatch-button]',
      swatchLink: '[data-swatch-link]',
      swatchText: '[data-swatch-text]',
      template: '[data-swatch-template]',
    };

    const classes$g = {
      visible: 'is-visible',
      hidden: 'hidden',
      stopEvents: 'no-events',
      swatch: 'swatch',
    };

    const attributes$h = {
      image: 'data-swatch-image',
      handle: 'data-swatch-handle',
      label: 'data-swatch-label',
      scrollbar: 'data-scrollbar',
      swatchCount: 'data-swatch-count',
      tooltip: 'data-tooltip',
      variant: 'data-swatch-variant',
      variantName: 'data-swatch-variant-name',
      variantTitle: 'data-variant-title',
      swatchValues: 'data-swatch-values',
    };

    class RadioSwatch extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        if (this.hasAttribute(attributes$h.tooltip)) {
          new Tooltip(this);
        }
      }
    }

    class GridSwatch extends HTMLElement {
      constructor() {
        super();

        this.productItemMouseLeaveEvent = () => this.hideVariantImages();
        this.showVariantImageEvent = (swatchButton) => this.showVariantImage(swatchButton);
      }

      connectedCallback() {
        this.handle = this.getAttribute(attributes$h.handle);
        this.productItem = this.closest(selectors$o.productItem);
        this.productInfo = this.closest(selectors$o.productInfo);
        this.productImage = this.productItem.querySelector(selectors$o.productImage);
        this.template = document.querySelector(selectors$o.template).innerHTML;
        this.swatchesJSON = this.getSwatchesJSON();
        this.swatchesStyle = theme.settings.collectionSwatchStyle;

        const label = this.getAttribute(attributes$h.label).trim().toLowerCase();

        fetchProduct(this.handle).then((product) => {
          this.product = product;
          this.colorOption = product.options.find(function (element) {
            return element.name.toLowerCase() === label || null;
          });

          if (this.colorOption) {
            this.swatches = this.colorOption.values;
            this.init();
          }
        });
      }

      init() {
        this.innerHTML = '';
        this.count = 0;
        this.limitedCount = 0;

        this.swatches.forEach((swatch) => {
          let variant = null;
          let variantAvailable = false;
          let image = '';

          for (const productVariant of this.product.variants) {
            const optionWithSwatch = productVariant.options.includes(swatch);

            if (!variant && optionWithSwatch) {
              variant = productVariant;
            }

            // Use a variant with image if exists
            if (optionWithSwatch && productVariant.featured_media) {
              image = productVariant.featured_media.preview_image.src;
              variant = productVariant;
              break;
            }
          }

          for (const productVariant of this.product.variants) {
            const optionWithSwatch = productVariant.options.includes(swatch);

            if (optionWithSwatch && productVariant.available) {
              variantAvailable = true;
              break;
            }
          }

          if (variant) {
            const swatchTemplate = document.createElement('div');
            swatchTemplate.innerHTML = this.template;
            const swatchButton = swatchTemplate.querySelector(selectors$o.swatchButton);
            const swatchLink = swatchTemplate.querySelector(selectors$o.swatchLink);
            const swatchText = swatchTemplate.querySelector(selectors$o.swatchText);
            const swatchHandle = this.swatchesJSON[swatch];
            const swatchStyle = theme.settings.swatchesType == 'native' ? swatchHandle : `var(--${swatchHandle})`;
            const variantTitle = variant.title.replaceAll('"', "'");

            swatchButton.style = `--animation-delay: ${(100 * this.count) / 1250}s`;
            swatchButton.classList.add(`${classes$g.swatch}-${swatchHandle}`);
            swatchButton.dataset.tooltip = swatch;
            swatchButton.dataset.swatchVariant = variant.id;
            swatchButton.dataset.swatchVariantName = variantTitle;
            swatchButton.dataset.swatchImage = image;
            swatchButton.dataset.variant = variant.id;
            swatchButton.style.setProperty('--swatch', swatchStyle);
            swatchLink.href = getUrlWithVariant(this.product.url, variant.id);
            swatchLink.dataset.swatch = swatch;
            swatchLink.disabled = !variantAvailable;
            swatchText.innerText = swatch;

            if (this.swatchesStyle != 'limited') {
              this.innerHTML += swatchTemplate.innerHTML;
            } else if (this.count <= 4) {
              this.innerHTML += swatchTemplate.innerHTML;
              this.limitedCount++;
            }
            this.count++;
          }
        });

        this.swatchCount = this.productInfo.querySelector(`[${attributes$h.swatchCount}]`);
        this.swatchElements = this.querySelectorAll(selectors$o.swatchLink);
        this.swatchForm = this.productInfo.querySelector(selectors$o.gridSwatchForm);
        this.hideSwatchesTimer = 0;

        if (this.swatchCount.hasAttribute(attributes$h.swatchCount)) {
          if (this.swatchesStyle == 'text' || this.swatchesStyle == 'text-slider') {
            this.swatchCount.innerText = `${this.count} ${this.count > 1 ? theme.strings.otherColor : theme.strings.oneColor}`;

            if (this.swatchesStyle == 'text') return;

            this.swatchCount.addEventListener('mouseenter', () => {
              if (this.hideSwatchesTimer) clearTimeout(this.hideSwatchesTimer);

              this.productInfo.classList.add(classes$g.stopEvents);
              this.swatchForm.classList.add(classes$g.visible);
            });

            // Prevent color swatches blinking on mouse move
            this.productInfo.addEventListener('mouseleave', () => {
              this.hideSwatchesTimer = setTimeout(() => {
                this.productInfo.classList.remove(classes$g.stopEvents);
                this.swatchForm.classList.remove(classes$g.visible);
              }, 100);
            });
          }

          if (this.swatchesStyle == 'slider' || this.swatchesStyle == 'grid') {
            this.swatchForm.classList.add(classes$g.visible);
          }

          if (this.swatchesStyle == 'limited') {
            const swatchesLeft = this.count - this.limitedCount;

            this.swatchForm.classList.add(classes$g.visible);

            if (swatchesLeft > 0) {
              this.innerHTML += `<div class="swatch-limited">+${swatchesLeft}</div>`;
            }
          }
        }

        if (this.swatchesStyle == 'text-slider' || this.swatchesStyle == 'slider') {
          if (this.hasAttribute(attributes$h.scrollbar)) {
            new NativeScrollbar(this);
          }
        }

        this.bindSwatchButtonEvents();
      }

      bindSwatchButtonEvents() {
        this.querySelectorAll(selectors$o.swatchButton)?.forEach((swatchButton) => {
          // Show variant image when hover on color swatch
          swatchButton.addEventListener('mouseenter', this.showVariantImageEvent);

          // Init Tooltips
          if (swatchButton.hasAttribute(attributes$h.tooltip)) {
            new Tooltip(swatchButton);
          }
        });

        this.productItem.addEventListener('mouseleave', this.productItemMouseLeaveEvent);
      }

      showVariantImage(event) {
        const swatchButton = event.target;
        const variantName = swatchButton.getAttribute(attributes$h.variantName)?.replaceAll('"', "'");
        const variantImages = this.productImage.querySelectorAll(`[${attributes$h.variantTitle}]`);
        const variantImageSelected = this.productImage.querySelector(`[${attributes$h.variantTitle}="${variantName}"]`);

        // Hide all variant images
        variantImages?.forEach((image) => {
          image.classList.remove(classes$g.visible);
        });

        // Show selected variant image
        variantImageSelected?.classList.add(classes$g.visible);
      }

      hideVariantImages() {
        // Hide all variant images
        this.productImage.querySelectorAll(`[${attributes$h.variantTitle}].${classes$g.visible}`)?.forEach((image) => {
          image.classList.remove(classes$g.visible);
        });
      }

      getSwatchesJSON() {
        if (!this.hasAttribute(attributes$h.swatchValues)) return {};

        // Splitting the string by commas to get individual key-value pairs
        const pairs = this.getAttribute(attributes$h.swatchValues).split(',');

        // Creating an empty object to store the key-value pairs
        const jsonObject = {};

        // Iterating through the pairs and constructing the JSON object
        pairs?.forEach((pair) => {
          const [key, value] = pair.split(':');
          jsonObject[key.trim()] = value.trim();
        });

        return jsonObject;
      }
    }

    const selectors$n = {
      productCutline: '[data-product-cutline]',
      productLink: '[data-product-link]',
      productGridItem: '[data-grid-item]',
      productInfo: '[data-product-information]',
      productImage: '[data-product-image-default]',
      productImageSibling: '[data-product-image-sibling]',
      productPrice: '[data-product-price]',
      siblingsInnerHolder: '[data-sibling-inner]',
      siblingCount: '[data-sibling-count]',
      siblingFieldset: '[data-sibling-fieldset]',
      siblingLink: '[data-sibling-link]',
      tooltip: '[data-tooltip]',
    };

    const classes$f = {
      visible: 'is-visible',
      fade: 'is-fade',
      stopEvents: 'no-events',
      active: 'is-active',
    };

    const attributes$g = {
      siblingAddedImage: 'data-sibling-added-image',
      siblingCutline: 'data-sibling-cutline',
      siblingImage: 'data-sibling-image',
      siblingLink: 'data-sibling-link',
      siblingPrice: 'data-sibling-price',
      productLink: 'data-product-link',
    };

    class SiblingSwatches {
      constructor(swatches, product) {
        this.swatches = swatches;
        this.product = product;
        this.productLinks = this.product.querySelectorAll(selectors$n.productLink);
        this.productCutline = this.product.querySelector(selectors$n.productCutline);
        this.productPrice = this.product.querySelector(selectors$n.productPrice);
        this.productImage = this.product.querySelector(selectors$n.productImage);
        this.productImageSibling = this.product.querySelector(selectors$n.productImageSibling);

        this.init();
      }

      init() {
        this.cacheDefaultValues();

        this.product.addEventListener('mouseleave', () => this.resetProductValues());

        this.swatches.forEach((swatch) => {
          swatch.addEventListener('mouseenter', (event) => this.showSibling(event));
        });

        if (this.productLinks.length) {
          this.swatches.forEach((swatch) => {
            swatch.addEventListener('click', () => {
              this.productLinks[0].click();
            });
          });
        }
      }

      cacheDefaultValues() {
        this.productLinkValue = this.productLinks[0].hasAttribute(attributes$g.productLink) ? this.productLinks[0].getAttribute(attributes$g.productLink) : '';
        this.productPriceValue = this.productPrice.innerHTML;

        if (this.productCutline) {
          this.productCutlineValue = this.productCutline.innerHTML;
        }
      }

      resetProductValues() {
        this.product.classList.remove(classes$f.active);

        if (this.productLinkValue) {
          this.productLinks.forEach((productLink) => {
            productLink.href = this.productLinkValue;
          });
        }

        if (this.productPrice) {
          this.productPrice.innerHTML = this.productPriceValue;
        }

        if (this.productCutline && this.productCutline) {
          this.productCutline.innerHTML = this.productCutlineValue;
          this.productCutline.title = this.productCutlineValue;
        }

        this.hideSiblingImage();
      }

      showSibling(event) {
        const swatch = event.target;
        const siblingLink = swatch.hasAttribute(attributes$g.siblingLink) ? swatch.getAttribute(attributes$g.siblingLink) : '';
        const siblingPrice = swatch.hasAttribute(attributes$g.siblingPrice) ? swatch.getAttribute(attributes$g.siblingPrice) : '';
        const siblingCutline = swatch.hasAttribute(attributes$g.siblingCutline) ? swatch.getAttribute(attributes$g.siblingCutline) : '';
        const siblingImage = swatch.hasAttribute(attributes$g.siblingImage) ? swatch.getAttribute(attributes$g.siblingImage) : '';

        if (siblingLink) {
          this.productLinks.forEach((productLink) => {
            productLink.href = siblingLink;
          });
        }

        if (siblingPrice) {
          this.productPrice.innerHTML = `<span class="price">${siblingPrice}</span>`;
        }

        if (this.productCutline) {
          if (siblingCutline) {
            this.productCutline.innerHTML = siblingCutline;
            this.productCutline.title = siblingCutline;
          } else {
            this.productCutline.innerHTML = '';
            this.productCutline.title = '';
          }
        }

        if (siblingImage) {
          this.showSiblingImage(siblingImage);
        }
      }

      showSiblingImage(siblingImage) {
        if (!this.productImageSibling) return;

        // Add current sibling swatch image to PGI image
        const ratio = window.devicePixelRatio || 1;
        const pixels = this.productImage.offsetWidth * ratio;
        const widthRounded = Math.ceil(pixels / 180) * 180;
        const imageSrc = themeImages.getSizedImageUrl(siblingImage, `${widthRounded}x`);
        const imageExists = this.productImageSibling.querySelector(`[src="${imageSrc}"]`);
        const showCurrentImage = () => {
          this.productImageSibling.classList.add(classes$f.visible);
          this.productImageSibling.querySelector(`[src="${imageSrc}"]`).classList.add(classes$f.fade);
        };
        const swapImages = () => {
          this.productImageSibling.querySelectorAll('img').forEach((image) => {
            image.classList.remove(classes$f.fade);
          });
          requestAnimationFrame(showCurrentImage);
        };

        if (imageExists) {
          swapImages();
        } else {
          const imageTag = document.createElement('img');

          imageTag.src = imageSrc;

          if (this.productCutline) {
            imageTag.alt = this.productCutline.innerText;
          }

          imageTag.addEventListener('load', () => {
            this.productImageSibling.append(imageTag);

            swapImages();
          });
        }
      }

      hideSiblingImage() {
        if (!this.productImageSibling) return;

        this.productImageSibling.classList.remove(classes$f.visible);
        this.productImageSibling.querySelectorAll('img').forEach((image) => {
          image.classList.remove(classes$f.fade);
        });
      }
    }

    class ProductSiblings extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.product = this.closest(selectors$n.productGridItem);
        this.siblingScrollbar = this.querySelector(selectors$n.siblingsInnerHolder);
        this.siblingCount = this.querySelector(selectors$n.siblingCount);
        this.siblingFieldset = this.querySelector(selectors$n.siblingFieldset);
        this.siblingLinks = this.querySelectorAll(selectors$n.siblingLink);
        this.productInfo = this.closest(selectors$n.productInfo);
        this.productLink = this.closest(selectors$n.link);
        this.hideSwatchesTimer = 0;
        this.swatchesStyle = theme.settings.collectionSwatchStyle;

        this.initScrollbar();

        if (this.siblingFieldset && this.productInfo) {
          if (this.swatchesStyle == 'grid' || this.swatchesStyle == 'slider' || this.swatchesStyle == 'limited') {
            this.siblingFieldset.classList.add(classes$f.visible);
          }

          if (this.siblingCount) {
            this.siblingCount.addEventListener('mouseenter', () => this.showSiblings());

            // Prevent color swatches blinking on mouse move
            this.productInfo.addEventListener('mouseleave', () => this.hideSiblings());
          }
        }

        if (this.siblingLinks.length) {
          new SiblingSwatches(this.siblingLinks, this.product);
        }

        // Init Tooltips
        this.querySelectorAll(selectors$n.tooltip).forEach((tooltip) => {
          new Tooltip(tooltip);
        });
      }

      showSiblings() {
        if (this.hideSwatchesTimer) clearTimeout(this.hideSwatchesTimer);

        if (this.productLink) {
          this.productLink.classList.add(classes$f.stopEvents);
        }

        if (this.swatchesStyle == 'text') return;

        this.siblingFieldset.classList.add(classes$f.visible);
      }

      hideSiblings() {
        this.hideSwatchesTimer = setTimeout(() => {
          if (this.productLink) {
            this.productLink.classList.remove(classes$f.stopEvents);
          }

          this.siblingFieldset.classList.remove(classes$f.visible);
        }, 100);
      }

      initScrollbar() {
        if (this.siblingScrollbar) {
          new NativeScrollbar(this.siblingScrollbar);
        }
      }
    }

    const selectors$m = {
      slide: '[data-hover-slide]',
      slideTouch: '[data-hover-slide-touch]',
      slider: '[data-hover-slider]',
      productLink: '[data-product-link]',
      flickityButton: '.flickity-prev-next-button',
    };

    class HoverImages extends HTMLElement {
      constructor() {
        super();

        this.flkty = null;
        this.slider = this.querySelector(selectors$m.slider);
        this.handleScroll = this.handleScroll.bind(this);
      }

      connectedCallback() {
        if (window.theme.touch) {
          this.initTouch();
        } else {
          this.initFlickity();
        }
      }

      disconnectedCallback() {
        if (this.flkty) {
          this.flkty.options.watchCSS = false;
          this.flkty.destroy();
        }
      }

      initTouch() {
        this.style.setProperty('--slides-count', this.querySelectorAll(selectors$m.slideTouch).length);
        this.slider.addEventListener('scroll', this.handleScroll);
      }

      handleScroll() {
        const slideIndex = this.slider.scrollLeft / this.slider.clientWidth;
        this.style.setProperty('--slider-index', slideIndex);
      }

      initFlickity() {
        if (this.querySelectorAll(selectors$m.slide).length < 2) return;

        this.flkty = new Flickity(this.slider, {
          cellSelector: selectors$m.slide,
          contain: true,
          wrapAround: true,
          watchCSS: true,
          autoPlay: false,
          draggable: false,
          pageDots: false,
          prevNextButtons: true,
        });

        this.flkty.pausePlayer();

        this.addEventListener('mouseenter', () => {
          this.flkty.unpausePlayer();
        });

        this.addEventListener('mouseleave', () => {
          this.flkty.pausePlayer();
        });

        // Prevent page redirect on Flickity arrow click
        this.closest(selectors$m.productLink).addEventListener('click', (e) => {
          if (e.target.matches(selectors$m.flickityButton)) {
            e.preventDefault();
          }
        });
      }
    }

    const selectors$l = {
      body: 'body',
      dataRelatedSectionElem: '[data-related-section]',
      dataTabsHolder: '[data-tabs-holder]',
      dataTab: 'data-tab',
      dataTabIndex: 'data-tab-index',
      dataAos: '[data-aos]',
      blockId: 'data-block-id',
      tabsLi: '[data-tab]',
      tabLink: '.tab-link',
      tabLinkRecent: '.tab-link__recent',
      tabContent: '.tab-content',
      scrollbarHolder: '[data-scrollbar]',
    };

    const classes$e = {
      current: 'current',
      hidden: 'hidden',
      aosAnimate: 'aos-animate',
      aosNoTransition: 'aos-no-transition',
      focused: 'is-focused',
    };

    const sections$a = {};

    class GlobalTabs {
      constructor(holder) {
        this.container = holder;
        this.body = document.querySelector(selectors$l.body);
        this.accessibility = window.accessibility;

        if (this.container) {
          this.scrollbarHolder = this.container.querySelectorAll(selectors$l.scrollbarHolder);

          this.init();

          // Init native scrollbar
          this.initNativeScrollbar();
        }
      }

      init() {
        const tabsNavList = this.container.querySelectorAll(selectors$l.tabsLi);

        this.container.addEventListener('theme:tab:check', () => this.checkRecentTab());
        this.container.addEventListener('theme:tab:hide', () => this.hideRelatedTab());

        if (tabsNavList.length) {
          tabsNavList.forEach((element) => {
            const tabId = parseInt(element.getAttribute(selectors$l.dataTab));
            const tab = this.container.querySelector(`${selectors$l.tabContent}-${tabId}`);

            element.addEventListener('click', () => {
              this.tabChange(element, tab);
            });

            element.addEventListener('keyup', (event) => {
              if ((event.code === 'Space' || event.code === 'Enter') && this.body.classList.contains(classes$e.focused)) {
                this.tabChange(element, tab);
              }
            });
          });
        }
      }

      tabChange(element, tab) {
        if (element.classList.contains(classes$e.current)) {
          return;
        }

        const currentTab = this.container.querySelector(`${selectors$l.tabsLi}.${classes$e.current}`);
        const currentTabContent = this.container.querySelector(`${selectors$l.tabContent}.${classes$e.current}`);

        currentTab?.classList.remove(classes$e.current);
        currentTabContent?.classList.remove(classes$e.current);

        element.classList.add(classes$e.current);
        tab.classList.add(classes$e.current);

        if (element.classList.contains(classes$e.hidden)) {
          tab.classList.add(classes$e.hidden);
        }

        this.accessibility.a11y.removeTrapFocus();

        this.container.dispatchEvent(new CustomEvent('theme:tab:change', {bubbles: true}));

        element.dispatchEvent(
          new CustomEvent('theme:form:sticky', {
            bubbles: true,
            detail: {
              element: 'tab',
            },
          })
        );

        this.animateItems(tab);
      }

      animateItems(tab, animated = true) {
        const animatedItems = tab.querySelectorAll(selectors$l.dataAos);

        if (animatedItems.length) {
          animatedItems.forEach((animatedItem) => {
            animatedItem.classList.remove(classes$e.aosAnimate);

            if (animated) {
              animatedItem.classList.add(classes$e.aosNoTransition);

              requestAnimationFrame(() => {
                animatedItem.classList.remove(classes$e.aosNoTransition);
                animatedItem.classList.add(classes$e.aosAnimate);
              });
            }
          });
        }
      }

      initNativeScrollbar() {
        if (this.scrollbarHolder.length) {
          this.scrollbarHolder.forEach((scrollbar) => {
            new NativeScrollbar(scrollbar);
          });
        }
      }

      checkRecentTab() {
        const tabLink = this.container.querySelector(selectors$l.tabLinkRecent);

        if (tabLink) {
          tabLink.classList.remove(classes$e.hidden);
          const tabLinkIdx = parseInt(tabLink.getAttribute(selectors$l.dataTab));
          const tabContent = this.container.querySelector(`${selectors$l.tabContent}[${selectors$l.dataTabIndex}="${tabLinkIdx}"]`);

          if (tabContent) {
            tabContent.classList.remove(classes$e.hidden);

            this.animateItems(tabContent, false);
          }

          this.initNativeScrollbar();
        }
      }

      hideRelatedTab() {
        const relatedSection = this.container.querySelector(selectors$l.dataRelatedSectionElem);
        if (!relatedSection) {
          return;
        }

        const parentTabContent = relatedSection.closest(`${selectors$l.tabContent}.${classes$e.current}`);
        if (!parentTabContent) {
          return;
        }
        const parentTabContentIdx = parseInt(parentTabContent.getAttribute(selectors$l.dataTabIndex));
        const tabsNavList = this.container.querySelectorAll(selectors$l.tabsLi);

        if (tabsNavList.length > parentTabContentIdx) {
          const nextTabsNavLink = tabsNavList[parentTabContentIdx].nextSibling;

          if (nextTabsNavLink) {
            tabsNavList[parentTabContentIdx].classList.add(classes$e.hidden);
            nextTabsNavLink.dispatchEvent(new Event('click'));
            this.initNativeScrollbar();
          }
        }
      }

      onBlockSelect(evt) {
        const element = this.container.querySelector(`${selectors$l.tabLink}[${selectors$l.blockId}="${evt.detail.blockId}"]`);
        if (element) {
          element.dispatchEvent(new Event('click'));

          element.parentNode.scrollTo({
            top: 0,
            left: element.offsetLeft - element.clientWidth,
            behavior: 'smooth',
          });
        }
      }
    }

    const tabs = {
      onLoad() {
        sections$a[this.id] = [];
        const tabHolders = this.container.querySelectorAll(selectors$l.dataTabsHolder);

        tabHolders.forEach((holder) => {
          sections$a[this.id].push(new GlobalTabs(holder));
        });
      },
      onBlockSelect(e) {
        sections$a[this.id].forEach((el) => {
          if (typeof el.onBlockSelect === 'function') {
            el.onBlockSelect(e);
          }
        });
      },
    };

    /*
      Observe whether or not there are open modals that require scroll lock
    */

    function hasOpenModals() {
      const openModals = Boolean(document.querySelectorAll('dialog[open][data-scroll-lock-required]').length);
      const openDrawers = Boolean(document.querySelectorAll('.drawer.is-open').length);

      return openModals || openDrawers;
    }

    const classes$d = {
      added: 'is-added',
      animated: 'is-animated',
      disabled: 'is-disabled',
      error: 'has-error',
      loading: 'is-loading',
      open: 'is-open',
      overlayText: 'product-item--overlay-text',
      visible: 'is-visible',
      siblingLinkCurrent: 'sibling__link--current',
    };

    const settings = {
      errorDelay: 3000,
    };

    const selectors$k = {
      animation: '[data-animation]',
      apiContent: '[data-api-content]',
      buttonQuickAdd: '[data-quick-add-btn]',
      buttonAddToCart: '[data-add-to-cart]',
      cartDrawer: 'cart-drawer',
      cartPage: '[data-cart-page]',
      cartLineItems: '[data-line-items]',
      dialog: 'dialog',
      focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
      messageError: '[data-message-error]',
      modalButton: '[data-quick-add-modal-handle]',
      modalContainer: '[data-product-upsell-container]',
      modalContent: '[data-product-upsell-ajax]',
      modalClose: '[data-quick-add-modal-close]',
      productGridItem: 'data-grid-item',
      productInformationHolder: '[data-product-information]',
      quickAddHolder: '[data-quick-add-holder]',
      quickAddModal: '[data-quick-add-modal]',
      quickAddModalTemplate: '[data-quick-add-modal-template]',
      tooltip: '[data-tooltip]',
    };

    const attributes$f = {
      closing: 'closing',
      productId: 'data-product-id',
      modalHandle: 'data-quick-add-modal-handle',
      siblingSwapper: 'data-sibling-swapper',
      quickAddHolder: 'data-quick-add-holder',
    };

    class QuickAddProduct extends HTMLElement {
      constructor() {
        super();

        this.container = this;
        this.cart = document.querySelector(selectors$k.cartDrawer) || document.querySelector(selectors$k.cartPage);
        this.quickAddHolder = this.container.querySelector(selectors$k.quickAddHolder);

        if (this.quickAddHolder) {
          this.modal = null;
          this.currentModal = null;
          this.productId = this.quickAddHolder.getAttribute(attributes$f.quickAddHolder);
          this.modalButton = this.quickAddHolder.querySelector(selectors$k.modalButton);
          this.handle = this.modalButton?.getAttribute(attributes$f.modalHandle);
          this.cartDrawer = document.querySelector(selectors$k.cartDrawer);
          this.buttonQuickAdd = this.quickAddHolder.querySelector(selectors$k.buttonQuickAdd);
          this.buttonATC = this.quickAddHolder.querySelector(selectors$k.buttonAddToCart);
          this.button = this.modalButton || this.buttonATC;
          this.modalClose = this.modalClose.bind(this);
          this.modalCloseOnProductAdded = this.modalCloseOnProductAdded.bind(this);
          this.a11y = a11y;
          this.isAnimating = false;

          this.modalButtonClickEvent = this.modalButtonClickEvent.bind(this);
          this.quickAddLoadingToggle = this.quickAddLoadingToggle.bind(this);
        }
      }

      connectedCallback() {
        /**
         * Modal button works for multiple variants products
         */
        if (this.modalButton) {
          this.modalButton.addEventListener('click', this.modalButtonClickEvent);
        }

        /**
         * Quick add button works for single variant products
         */
        if (this.buttonATC && this.cart) {
          this.buttonATC.addEventListener('click', (e) => {
            e.preventDefault();

            window.accessibility.lastElement = this.buttonATC;

            document.dispatchEvent(
              new CustomEvent('theme:cart:add', {
                detail: {
                  button: this.buttonATC,
                },
              })
            );
          });
        }

        if (this.quickAddHolder) {
          this.quickAddHolder.addEventListener('animationend', this.quickAddLoadingToggle);
          this.errorHandler();
        }
      }

      modalButtonClickEvent(e) {
        e.preventDefault();

        const isSiblingSwapper = this.modalButton.hasAttribute(attributes$f.siblingSwapper);
        const isSiblingLinkCurrent = this.modalButton.classList.contains(classes$d.siblingLinkCurrent);

        if (isSiblingLinkCurrent) return;

        this.modalButton.classList.add(classes$d.loading);
        this.modalButton.disabled = true;

        // Siblings product modal swapper
        if (isSiblingSwapper && !isSiblingLinkCurrent) {
          this.currentModal = e.target.closest(selectors$k.quickAddModal);
          this.currentModal.classList.add(classes$d.loading);
        }

        this.renderModal();
      }

      modalCreate(response) {
        const cachedModal = document.querySelector(`${selectors$k.quickAddModal}[${attributes$f.productId}="${this.productId}"]`);

        if (cachedModal) {
          this.modal = cachedModal;
          this.modalOpen();
        } else {
          const modalTemplate = this.quickAddHolder.querySelector(selectors$k.quickAddModalTemplate);
          if (!modalTemplate) return;

          const htmlObject = document.createElement('div');
          htmlObject.innerHTML = modalTemplate.innerHTML;

          // Add dialog to the body
          document.body.appendChild(htmlObject.querySelector(selectors$k.quickAddModal));
          modalTemplate.remove();

          this.modal = document.querySelector(`${selectors$k.quickAddModal}[${attributes$f.productId}="${this.productId}"]`);
          this.modal.querySelector(selectors$k.modalContent).innerHTML = new DOMParser().parseFromString(response, 'text/html').querySelector(selectors$k.apiContent).innerHTML;

          // Init Tooltips
          this.modal.querySelectorAll(selectors$k.tooltip).forEach((tooltip) => {
            new Tooltip(tooltip);
          });

          this.modalCreatedCallback();
        }
      }

      modalOpen() {
        if (this.currentModal) {
          this.currentModal.dispatchEvent(new CustomEvent('theme:modal:close', {bubbles: false}));
        }

        // Check if browser supports Dialog tags
        if (typeof this.modal.show === 'function') {
          this.modal.show();
        }

        this.modal.setAttribute('open', true);
        this.modal.removeAttribute('inert');

        this.quickAddHolder.classList.add(classes$d.disabled);

        if (this.modalButton) {
          this.modalButton.classList.remove(classes$d.loading);
          this.modalButton.disabled = false;
          window.accessibility.lastElement = this.modalButton;
        }

        // Animate items
        requestAnimationFrame(() => {
          this.modal.querySelectorAll(selectors$k.animation).forEach((item) => {
            item.classList.add(classes$d.animated);
          });
        });

        document.dispatchEvent(new CustomEvent('theme:quick-add:open', {bubbles: true}));
        document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
        document.addEventListener('theme:product:added', this.modalCloseOnProductAdded, {once: true});
      }

      modalClose() {
        if (this.isAnimating) {
          return;
        }

        if (!this.modal.hasAttribute(attributes$f.closing)) {
          this.modal.setAttribute(attributes$f.closing, '');
          this.isAnimating = true;
          return;
        }

        // Check if browser supports Dialog tags
        if (typeof this.modal.close === 'function') {
          this.modal.close();
        } else {
          this.modal.removeAttribute('open');
        }

        this.modal.removeAttribute(attributes$f.closing);
        this.modal.setAttribute('inert', '');
        this.modal.classList.remove(classes$d.loading);

        if (this.modalButton) {
          this.modalButton.disabled = false;
        }

        if (this.quickAddHolder && this.quickAddHolder.classList.contains(classes$d.disabled)) {
          this.quickAddHolder.classList.remove(classes$d.disabled);
        }

        this.resetAnimatedItems();

        // Unlock scroll if no other drawers & modals are open
        if (!hasOpenModals()) {
          document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
        }

        document.removeEventListener('theme:product:added', this.modalCloseOnProductAdded);

        this.a11y.removeTrapFocus();
        this.a11y.autoFocusLastElement();
      }

      modalEvents() {
        // Close button click event
        this.modal.querySelector(selectors$k.modalClose)?.addEventListener('click', (e) => {
          e.preventDefault();
          this.modalClose();
        });

        // Close dialog on click outside content
        this.modal.addEventListener('click', (event) => {
          if (event.target.nodeName === 'DIALOG' && event.type === 'click') {
            this.modalClose();
          }
        });

        // Close dialog on click ESC key pressed
        this.modal.addEventListener('keydown', (event) => {
          if (event.code == 'Escape') {
            event.preventDefault();
            this.modalClose();
          }
        });

        this.modal.addEventListener('theme:modal:close', () => {
          this.modalClose();
        });

        // Close dialog after animation completes
        this.modal.addEventListener('animationend', (event) => {
          if (event.target !== this.modal) return;
          this.isAnimating = false;

          if (this.modal.hasAttribute(attributes$f.closing)) {
            this.modalClose();
          } else {
            setTimeout(() => {
              this.a11y.trapFocus(this.modal);
              const focusTarget = this.modal.querySelector('[autofocus]') || this.modal.querySelector(selectors$k.focusable);
              focusTarget?.focus();
            }, 50);
          }
        });
      }

      modalCloseOnProductAdded() {
        this.resetQuickAddButtons();
        if (this.modal && this.modal.hasAttribute('open')) {
          this.modalClose();
        }
      }

      quickAddLoadingToggle(e) {
        if (e.target != this.quickAddHolder) return;

        this.quickAddHolder.classList.remove(classes$d.disabled);
      }

      /**
       * Handle error cart response
       */
      errorHandler() {
        this.quickAddHolder.addEventListener('theme:cart:error', (event) => {
          const holder = event.detail.holder;
          const parentProduct = holder.closest(`[${selectors$k.productGridItem}]`);
          if (!parentProduct) return;

          const errorMessageHolder = holder.querySelector(selectors$k.messageError);
          const hasOverlayText = parentProduct.classList.contains(classes$d.overlayText);
          const productInfo = parentProduct.querySelector(selectors$k.productInformationHolder);
          const button = holder.querySelector(selectors$k.buttonAddToCart);

          if (button) {
            button.classList.remove(classes$d.added, classes$d.loading);
            holder.classList.add(classes$d.error);
          }

          if (errorMessageHolder) {
            errorMessageHolder.innerText = event.detail.description;
          }

          if (hasOverlayText) {
            productInfo.classList.add(classes$d.hidden);
          }

          setTimeout(() => {
            this.resetQuickAddButtons();

            if (hasOverlayText) {
              productInfo.classList.remove(classes$d.hidden);
            }
          }, settings.errorDelay);
        });
      }

      /**
       * Reset buttons to default states
       */
      resetQuickAddButtons() {
        if (this.quickAddHolder) {
          this.quickAddHolder.classList.remove(classes$d.visible, classes$d.error);
        }

        if (this.buttonQuickAdd) {
          this.buttonQuickAdd.classList.remove(classes$d.added);
          this.buttonQuickAdd.disabled = false;
        }
      }

      renderModal() {
        if (this.modal) {
          this.modalOpen();
        } else {
          window
            .fetch(`${window.theme.routes.root}products/${this.handle}?section_id=api-product-upsell`)
            .then(this.upsellErrorsHandler)
            .then((response) => {
              return response.text();
            })
            .then((response) => {
              this.modalCreate(response);
            });
        }
      }

      modalCreatedCallback() {
        this.modalEvents();
        this.modalOpen();

        wrapElements(this.modal);
      }

      upsellErrorsHandler(response) {
        if (!response.ok) {
          return response.json().then(function (json) {
            const e = new FetchError({
              status: response.statusText,
              headers: response.headers,
              json: json,
            });
            throw e;
          });
        }
        return response;
      }

      resetAnimatedItems() {
        this.modal?.querySelectorAll(selectors$k.animation).forEach((item) => {
          item.classList.remove(classes$d.animated);
        });
      }
    }

    register('product-grid', [tabs]);

    if (!customElements.get('quick-add-product')) {
      customElements.define('quick-add-product', QuickAddProduct);
    }

    if (!customElements.get('radio-swatch')) {
      customElements.define('radio-swatch', RadioSwatch);
    }

    if (!customElements.get('grid-swatch')) {
      customElements.define('grid-swatch', GridSwatch);
    }

    if (!customElements.get('product-siblings')) {
      customElements.define('product-siblings', ProductSiblings);
    }

    if (!customElements.get('hover-images')) {
      customElements.define('hover-images', HoverImages);
    }

    const selectors$j = {
      fields: 'input:not([type="checkbox"]):not([type="hidden"]), textarea',
      fieldEmail: 'input[type="email"]',
      fieldCheckbox: 'input[type="checkbox"]',
      form: '[data-form-wrapper]',
    };

    class RecipientForm extends HTMLElement {
      constructor() {
        super();
        this.fieldCheckbox = this.querySelector(selectors$j.fieldCheckbox);
        this.fieldEmail = this.querySelector(selectors$j.fieldEmail);
        this.fields = this.querySelectorAll(selectors$j.fields);
        this.form = this.closest(selectors$j.form);
        this.onChangeEvent = (event) => this.onChange(event);
      }

      connectedCallback() {
        if (this.fieldCheckbox) {
          this.fieldCheckbox.addEventListener('change', this.onChangeEvent);

          if (this.form) {
            this.form.addEventListener('theme:product:add', () => {
              this.fieldCheckbox.checked = false;
              this.fieldCheckbox.dispatchEvent(new Event('change'));
            });
          }
        }
      }

      clearInputValues() {
        if (this.fields.length) {
          this.fields.forEach((field) => {
            field.value = '';
          });
        }
      }

      onChange(event) {
        this.fieldEmail.required = Boolean(event.target.checked);

        if (!event.target.checked) {
          this.clearInputValues();
        }
      }

      disconnectedCallback() {
        this.fieldCheckbox.removeEventListener('change', this.onChangeEvent);
      }
    }

    const selectors$i = {
      productPage: '.product__page',
      formWrapper: '[data-form-wrapper]',
      headerSticky: '[data-header-sticky]',
      productMediaList: '[data-product-media-list]',
    };

    const classes$c = {
      sticky: 'is-sticky',
    };

    const attributes$e = {
      stickyEnabled: 'data-sticky-enabled',
    };

    window.theme.variables = {
      productPageSticky: false,
    };

    const sections$9 = {};

    class ProductSticky {
      constructor(section) {
        this.section = section;
        this.container = section.container;
        this.stickyEnabled = this.container.getAttribute(attributes$e.stickyEnabled) === 'true';
        this.formWrapper = this.container.querySelector(selectors$i.formWrapper);
        this.stickyScrollTop = 0;
        this.scrollLastPosition = 0;
        this.stickyDefaultTop = 0;
        this.currentPoint = 0;
        this.defaultTopBottomSpacings = 30;
        this.scrollTop = window.scrollY;
        this.scrollDirectionDown = true;
        this.requestAnimationSticky = null;
        this.stickyFormLoad = true;
        this.stickyFormLastHeight = null;
        this.onChangeCounter = 0;
        this.scrollEvent = (e) => this.scrollEvents(e);
        this.resizeEvent = (e) => this.resizeEvents(e);
        this.stickyFormEvent = (e) => this.stickyFormEvents(e);

        // The code should execute after truncate text in product.js - 50ms
        setTimeout(() => {
          this.init();
        }, 50);
      }

      init() {
        if (this.stickyEnabled) {
          this.stickyScrollCheck();

          document.addEventListener('theme:resize', this.resizeEvent);
        }

        this.initSticky();
      }

      initSticky() {
        if (theme.variables.productPageSticky) {
          this.requestAnimationSticky = requestAnimationFrame(() => this.calculateStickyPosition());

          this.formWrapper.addEventListener('theme:form:sticky', this.stickyFormEvent);

          document.addEventListener('theme:scroll', this.scrollEvent);
        }
      }

      stickyFormEvents(e) {
        this.removeAnimationFrameSticky();

        this.requestAnimationSticky = requestAnimationFrame(() => this.calculateStickyPosition(e));
      }

      scrollEvents(e) {
        this.scrollTop = e.detail.position;
        this.scrollDirectionDown = e.detail.down;

        if (!this.requestAnimationSticky) {
          this.requestAnimationSticky = requestAnimationFrame(() => this.calculateStickyPosition());
        }
      }

      resizeEvents(e) {
        this.stickyScrollCheck();

        document.removeEventListener('theme:scroll', this.scrollEvent);

        this.formWrapper.removeEventListener('theme:form:sticky', this.stickyFormEvent);

        this.initSticky();
      }

      stickyScrollCheck() {
        const targetFormWrapper = this.container.querySelector(`${selectors$i.productPage} ${selectors$i.formWrapper}`);

        if (!targetFormWrapper) return;

        if (isDesktop()) {
          const form = this.container.querySelector(selectors$i.formWrapper);
          const productMediaList = this.container.querySelector(selectors$i.productMediaList);

          if (!form || !productMediaList) return;

          const productCopyHeight = form.offsetHeight;
          const productImagesHeight = productMediaList.offsetHeight;

          // Is the product description and form taller than window space
          // Is also shorter than the window and images
          if (productCopyHeight < productImagesHeight) {
            theme.variables.productPageSticky = true;
            targetFormWrapper.classList.add(classes$c.sticky);
          } else {
            theme.variables.productPageSticky = false;
            targetFormWrapper.classList.remove(classes$c.sticky);
          }
        } else {
          theme.variables.productPageSticky = false;
          targetFormWrapper.classList.remove(classes$c.sticky);
        }
      }

      calculateStickyPosition(e = null) {
        const isScrollLocked = document.documentElement.hasAttribute('data-scroll-locked');
        if (isScrollLocked) {
          this.removeAnimationFrameSticky();
          return;
        }

        const eventExist = Boolean(e && e.detail);
        const isAccordion = Boolean(eventExist && e.detail.element && e.detail.element === 'accordion');
        const formWrapperHeight = this.formWrapper.offsetHeight;
        const heightDifference = window.innerHeight - formWrapperHeight - this.defaultTopBottomSpacings;
        const scrollDifference = Math.abs(this.scrollTop - this.scrollLastPosition);

        if (this.scrollDirectionDown) {
          this.stickyScrollTop -= scrollDifference;
        } else {
          this.stickyScrollTop += scrollDifference;
        }

        if (this.stickyFormLoad) {
          if (document.querySelector(selectors$i.headerSticky)) {
            let {headerHeight} = readHeights();
            this.stickyDefaultTop = headerHeight;
          } else {
            this.stickyDefaultTop = this.defaultTopBottomSpacings;
          }

          this.stickyScrollTop = this.stickyDefaultTop;
        }

        this.stickyScrollTop = Math.min(Math.max(this.stickyScrollTop, heightDifference), this.stickyDefaultTop);

        const differencePoint = this.stickyScrollTop - this.currentPoint;
        this.currentPoint = this.stickyFormLoad ? this.stickyScrollTop : this.currentPoint + differencePoint * 0.5;

        this.formWrapper.style.setProperty('--sticky-top', `${this.currentPoint}px`);

        this.scrollLastPosition = this.scrollTop;
        this.stickyFormLoad = false;

        if (
          (isAccordion && this.onChangeCounter <= 10) ||
          (isAccordion && this.stickyFormLastHeight !== formWrapperHeight) ||
          (this.stickyScrollTop !== this.currentPoint && this.requestAnimationSticky)
        ) {
          if (isAccordion) {
            this.onChangeCounter += 1;
          }

          if (isAccordion && this.stickyFormLastHeight !== formWrapperHeight) {
            this.onChangeCounter = 11;
          }

          this.requestAnimationSticky = requestAnimationFrame(() => this.calculateStickyPosition(e));
        } else if (this.requestAnimationSticky) {
          this.removeAnimationFrameSticky();
        }

        this.stickyFormLastHeight = formWrapperHeight;
      }

      removeAnimationFrameSticky() {
        if (this.requestAnimationSticky) {
          cancelAnimationFrame(this.requestAnimationSticky);
          this.requestAnimationSticky = null;
          this.onChangeCounter = 0;
        }
      }

      onUnload() {
        if (this.stickyEnabled) {
          document.removeEventListener('theme:resize', this.resizeEvent);
        }

        if (theme.variables.productPageSticky) {
          document.removeEventListener('theme:scroll', this.scrollEvent);
        }
      }
    }

    const productStickySection = {
      onLoad() {
        sections$9[this.id] = new ProductSticky(this);
      },
      onUnload() {
        sections$9[this.id].onUnload();
      },
    };

    const selectors$h = {
      buttonArrow: '[data-button-arrow]',
      deferredMediaButton: '[data-deferred-media-button]',
      focusedElement: 'model-viewer, video, iframe, button, [href], input, [tabindex]',
      productMedia: '[data-image-id]',
      productMediaList: '[data-product-media-list]',
      section: '[data-section-type]',
    };

    const classes$b = {
      arrows: 'slider__arrows',
      dragging: 'is-dragging',
      hidden: 'hidden',
      isFocused: 'is-focused',
      mediaActive: 'media--active',
      mediaHidden: 'media--hidden',
      mediaHiding: 'media--hiding',
    };

    const attributes$d = {
      activeMedia: 'data-active-media',
      buttonPrev: 'data-button-prev',
      buttonNext: 'data-button-next',
      imageId: 'data-image-id',
      mediaId: 'data-media-id',
      faderDesktop: 'data-fader-desktop',
      faderMobile: 'data-fader-mobile',
    };

    class ProductImages extends HTMLElement {
      constructor() {
        super();

        this.initialized = false;
        this.buttons = false;
        this.isDown = false;
        this.startX = 0;
        this.startY = 0;
        this.scrollLeft = 0;
        this.onButtonArrowClick = (e) => this.buttonArrowClickEvent(e);
        this.container = this.closest(selectors$h.section);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.productMediaItems = this.querySelectorAll(selectors$h.productMedia);
        this.productMediaList = this.querySelector(selectors$h.productMediaList);
        this.setHeight = this.setHeight.bind(this);
        this.toggleEvents = this.toggleEvents.bind(this);
        this.selectMediaEvent = (e) => this.showMediaOnVariantSelect(e);
      }

      connectedCallback() {
        if (Object.keys(this.productMediaItems).length === 1) return;

        this.productMediaObserver();
        this.toggleEvents();
        this.listen();
        this.setHeight();
      }

      disconnectedCallback() {
        this.unlisten();
      }

      listen() {
        document.addEventListener('theme:resize:width', this.toggleEvents);
        document.addEventListener('theme:resize:width', this.setHeight);
        this.addEventListener('theme:media:select', this.selectMediaEvent);
      }

      unlisten() {
        document.removeEventListener('theme:resize:width', this.toggleEvents);
        document.removeEventListener('theme:resize:width', this.setHeight);
        this.removeEventListener('theme:media:select', this.selectMediaEvent);
      }

      toggleEvents() {
        const isMobileView = isMobile();

        if ((isMobileView && this.hasAttribute(attributes$d.faderMobile)) || (!isMobileView && this.hasAttribute(attributes$d.faderDesktop))) {
          this.bindEventListeners();
        } else {
          this.unbindEventListeners();
        }
      }

      bindEventListeners() {
        if (this.initialized) return;

        this.productMediaList.addEventListener('mousedown', this.handleMouseDown);
        this.productMediaList.addEventListener('mouseleave', this.handleMouseLeave);
        this.productMediaList.addEventListener('mouseup', this.handleMouseUp);
        this.productMediaList.addEventListener('mousemove', this.handleMouseMove);
        this.productMediaList.addEventListener('touchstart', this.handleMouseDown, {passive: true});
        this.productMediaList.addEventListener('touchend', this.handleMouseUp, {passive: true});
        this.productMediaList.addEventListener('touchmove', this.handleMouseMove, {passive: true});
        this.productMediaList.addEventListener('keyup', this.handleKeyUp);
        this.initArrows();
        this.resetScrollPosition();

        this.initialized = true;
      }

      unbindEventListeners() {
        if (!this.initialized) return;

        this.productMediaList.removeEventListener('mousedown', this.handleMouseDown);
        this.productMediaList.removeEventListener('mouseleave', this.handleMouseLeave);
        this.productMediaList.removeEventListener('mouseup', this.handleMouseUp);
        this.productMediaList.removeEventListener('mousemove', this.handleMouseMove);
        this.productMediaList.removeEventListener('touchstart', this.handleMouseDown);
        this.productMediaList.removeEventListener('touchend', this.handleMouseUp);
        this.productMediaList.removeEventListener('touchmove', this.handleMouseMove);
        this.productMediaList.removeEventListener('keyup', this.handleKeyUp);
        this.removeArrows();

        this.initialized = false;
      }

      handleMouseDown(e) {
        this.isDown = true;
        this.startX = (e.pageX || e.changedTouches[0].screenX) - this.offsetLeft;
        this.startY = (e.pageY || e.changedTouches[0].screenY) - this.offsetTop;
      }

      handleMouseLeave() {
        if (!this.isDown) return;
        this.isDown = false;
      }

      handleMouseUp(e) {
        const x = (e.pageX || e.changedTouches[0].screenX) - this.offsetLeft;
        const y = (e.pageY || e.changedTouches[0].screenY) - this.offsetTop;
        const distanceX = x - this.startX;
        const distanceY = y - this.startY;
        const direction = distanceX > 0 ? 1 : -1;

        if (Math.abs(distanceX) > 10 && Math.abs(distanceX) > Math.abs(distanceY)) {
          direction < 0 ? this.showNextImage() : this.showPreviousImage();
        }

        this.isDown = false;

        requestAnimationFrame(() => {
          this.classList.remove(classes$b.dragging);
        });
      }

      handleMouseMove() {
        if (!this.isDown) return;

        this.classList.add(classes$b.dragging);
      }

      handleKeyUp(e) {
        if (e.code === 'ArrowLeft') {
          this.showPreviousImage();
        }

        if (e.code === 'ArrowRight') {
          this.showNextImage();
        }
      }

      handleArrowsClickEvent() {
        this.querySelectorAll(selectors$h.buttonArrow)?.forEach((button) => {
          button.addEventListener('click', (e) => {
            e.preventDefault();

            if (e.target.hasAttribute(attributes$d.buttonPrev)) {
              this.showPreviousImage();
            }

            if (e.target.hasAttribute(attributes$d.buttonNext)) {
              this.showNextImage();
            }
          });
        });
      }

      // When changing from Mobile do Desktop view
      resetScrollPosition() {
        if (this.productMediaList.scrollLeft !== 0) {
          this.productMediaList.scrollLeft = 0;
        }
      }

      initArrows() {
        // Create arrow buttons if don't exist
        if (!this.buttons.length) {
          const buttonsWrap = document.createElement('div');
          buttonsWrap.classList.add(classes$b.arrows);
          buttonsWrap.innerHTML = theme.sliderArrows.prev + theme.sliderArrows.next;

          // Append buttons outside the slider element
          this.productMediaList.append(buttonsWrap);
          this.buttons = this.querySelectorAll(selectors$h.buttonArrow);
          this.buttonPrev = this.querySelector(`[${attributes$d.buttonPrev}]`);
          this.buttonNext = this.querySelector(`[${attributes$d.buttonNext}]`);
        }

        this.handleArrowsClickEvent();
        this.preloadImageOnArrowHover();
      }

      removeArrows() {
        this.querySelector(`.${classes$b.arrows}`)?.remove();
      }

      preloadImageOnArrowHover() {
        this.buttonPrev?.addEventListener('mouseover', () => {
          const id = this.getPreviousMediaId();
          this.preloadImage(id);
        });

        this.buttonNext?.addEventListener('mouseover', () => {
          const id = this.getNextMediaId();
          this.preloadImage(id);
        });
      }

      preloadImage(id) {
        this.querySelector(`[${attributes$d.mediaId}="${id}"] img`)?.setAttribute('loading', 'eager');
      }

      showMediaOnVariantSelect(e) {
        const id = e.detail.id;
        this.setActiveMedia(id);
      }

      getCurrentMedia() {
        return this.querySelector(`${selectors$h.productMedia}.${classes$b.mediaActive}`);
      }

      getNextMediaId() {
        const currentMedia = this.getCurrentMedia();
        const nextMedia = currentMedia?.nextElementSibling.hasAttribute(attributes$d.imageId) ? currentMedia?.nextElementSibling : this.querySelector(selectors$h.productMedia);

        return nextMedia?.getAttribute(attributes$d.mediaId);
      }

      getPreviousMediaId() {
        const currentMedia = this.getCurrentMedia();
        const lastIndex = this.productMediaItems.length - 1;
        const previousMedia = currentMedia?.previousElementSibling || this.productMediaItems[lastIndex];

        return previousMedia?.getAttribute(attributes$d.mediaId);
      }

      showNextImage() {
        const id = this.getNextMediaId();
        this.selectMedia(id);
      }

      showPreviousImage() {
        const id = this.getPreviousMediaId();
        this.selectMedia(id);
      }

      selectMedia(id) {
        this.dispatchEvent(
          new CustomEvent('theme:media:select', {
            detail: {
              id: id,
            },
          })
        );
      }

      setActiveMedia(id) {
        if (!id) return;

        this.setAttribute(attributes$d.activeMedia, id);

        const activeImage = this.querySelector(`${selectors$h.productMedia}.${classes$b.mediaActive}`);
        const selectedImage = this.querySelector(`[${attributes$d.mediaId}="${id}"]`);
        const selectedImageFocus = selectedImage?.querySelector(selectors$h.focusedElement);
        const deferredMedia = selectedImage.querySelector('deferred-media');

        activeImage?.classList.add(classes$b.mediaHiding);
        activeImage?.classList.remove(classes$b.mediaActive);

        selectedImage?.classList.remove(classes$b.mediaHiding, classes$b.mediaHidden);
        selectedImage?.classList.add(classes$b.mediaActive);

        // Force media loading if slide becomes visible
        if (deferredMedia && deferredMedia.getAttribute('loaded') !== true) {
          selectedImage.querySelector(selectors$h.deferredMediaButton)?.dispatchEvent(new Event('click', {bubbles: false}));
        }

        requestAnimationFrame(() => {
          this.setHeight();

          // Move focus to the selected media
          if (document.body.classList.contains(classes$b.isFocused)) {
            selectedImageFocus?.focus();
          }
        });
      }

      // Set current product image height variable to product images container
      setHeight() {
        const mediaHeight = this.querySelector(`${selectors$h.productMedia}.${classes$b.mediaActive}`)?.offsetHeight || this.productMediaItems[0]?.offsetHeight;
        this.style.setProperty('--height', `${mediaHeight}px`);
      }

      productMediaObserver() {
        this.productMediaItems.forEach((media) => {
          media.addEventListener('transitionend', (e) => {
            if (e.target == media && media.classList.contains(classes$b.mediaHiding)) {
              media.classList.remove(classes$b.mediaHiding);
              media.classList.add(classes$b.mediaHidden);
            }
          });
          media.addEventListener('transitioncancel', (e) => {
            if (e.target == media && media.classList.contains(classes$b.mediaHiding)) {
              media.classList.remove(classes$b.mediaHiding);
              media.classList.add(classes$b.mediaHidden);
            }
          });
        });
      }
    }

    const hideElement = (elem) => {
      if (elem) {
        elem.style.display = 'none';
      }
    };

    const selectors$g = {
      optionPosition: 'data-option-position',
      optionInput: '[name^="options"], [data-popout-option]',
      optionInputCurrent: '[name^="options"]:checked, [name^="options"][type="hidden"]',
      selectOptionValue: 'data-value',
      popout: '[data-popout]',
    };

    const classes$a = {
      soldOut: 'sold-out',
      unavailable: 'unavailable',
      sale: 'sale',
    };

    /**
     * Variant Sellout Precrime Click Preview
     * I think of this like the precrime machine in Minority report.  It gives a preview
     * of every possible click action, given the current form state.  The logic is:
     *
     * for each clickable name=options[] variant selection element
     * find the value of the form if the element were clicked
     * lookup the variant with those value in the product json
     * clear the classes, add .unavailable if it's not found,
     * and add .sold-out if it is out of stock
     *
     * Caveat: we rely on the option position so we don't need
     * to keep a complex map of keys and values.
     */

    class SelloutVariants {
      constructor(section, productJSON) {
        this.container = section;
        this.productJSON = productJSON;
        this.optionElements = this.container.querySelectorAll(selectors$g.optionInput);

        if (this.productJSON && this.optionElements.length) {
          this.init();
        }
      }

      init() {
        this.update();
      }

      update() {
        this.getCurrentState();

        this.optionElements.forEach((el) => {
          const parent = el.closest(`[${selectors$g.optionPosition}]`);
          if (!parent) return;
          const val = el.value || el.getAttribute(selectors$g.selectOptionValue);
          const positionString = parent.getAttribute(selectors$g.optionPosition);
          // subtract one because option.position in liquid does not count form zero, but JS arrays do
          const position = parseInt(positionString, 10) - 1;
          const selectPopout = el.closest(selectors$g.popout);

          let newVals = [...this.selections];
          newVals[position] = val;

          const found = this.productJSON.variants.find((element) => {
            // only return true if every option matches our hypothetical selection
            let perfectMatch = true;
            for (let index = 0; index < newVals.length; index++) {
              if (element.options[index] !== newVals[index]) {
                perfectMatch = false;
              }
            }
            return perfectMatch;
          });

          el.classList.remove(classes$a.soldOut, classes$a.unavailable);
          el.parentNode.classList.remove(classes$a.sale);

          if (selectPopout) {
            selectPopout.classList.remove(classes$a.soldOut, classes$a.unavailable, classes$a.sale);
          }

          if (typeof found === 'undefined') {
            el.classList.add(classes$a.unavailable);

            if (selectPopout) {
              selectPopout.classList.add(classes$a.unavailable);
            }
          } else if (found && found.available === false) {
            el.classList.add(classes$a.soldOut);

            if (selectPopout) {
              selectPopout.classList.add(classes$a.soldOut);
            }
          }

          if (found && found.compare_at_price > found.price && theme.settings.variantOnSale) {
            el.parentNode.classList.add(classes$a.sale);
          }
        });
      }

      getCurrentState() {
        this.selections = [];

        const options = this.container.querySelectorAll(selectors$g.optionInputCurrent);
        if (options.length) {
          options.forEach((element) => {
            const elemValue = element.value;
            if (elemValue && elemValue !== '') {
              this.selections.push(elemValue);
            }
          });
        }
      }
    }

    const selectors$f = {
      product: '[data-product]',
      productForm: '[data-product-form]',
      productNotification: 'product-notification',
      variantTitle: '[data-variant-title]',
      notificationProduct: '[data-notification-product]',
      addToCart: '[data-add-to-cart]',
      addToCartText: '[data-add-to-cart-text]',
      cartDrawer: 'cart-drawer',
      cartPage: '[data-cart-page]',
      comparePrice: '[data-compare-price]',
      comparePriceText: '[data-compare-text]',
      formWrapper: '[data-form-wrapper]',
      originalSelectorId: '[data-product-select]',
      priceWrapper: '[data-price-wrapper]',
      productImages: 'product-images',
      productImage: '[data-product-image]',
      productMediaList: '[data-product-media-list]',
      productJson: '[data-product-json]',
      productPrice: '[data-product-price]',
      unitPrice: '[data-product-unit-price]',
      unitBase: '[data-product-base]',
      unitWrapper: '[data-product-unit]',
      isPreOrder: '[data-product-preorder]',
      productSlide: '.product__slide',
      subPrices: '[data-subscription-watch-price]',
      subSelectors: '[data-subscription-selectors]',
      subsToggle: '[data-toggles-group]',
      subsChild: 'data-group-toggle',
      subDescription: '[data-plan-description]',
      section: '[data-section-type]',
      variantSku: '[data-variant-sku]',
      variantFinalSaleMeta: '[data-variant-final-sale-metafield]',
      variantButtons: '[data-variant-buttons]',
      variantOptionImage: '[data-variant-option-image]',
      quickAddModal: '[data-quick-add-modal]',
      priceOffWrap: '[data-price-off]',
      priceOffType: '[data-price-off-type]',
      priceOffAmount: '[data-price-off-amount]',
      remainingCount: '[data-remaining-count]',
      remainingMax: '[data-remaining-max]',
      remainingWrapper: '[data-remaining-wrapper]',
      remainingJSON: '[data-product-remaining-json]',
      optionValue: '[data-option-value]',
      optionPosition: '[data-option-position]',
      installment: '[data-product-form-installment]',
      inputId: 'input[name="id"]',
    };

    const classes$9 = {
      hidden: 'hidden',
      variantSoldOut: 'variant--soldout',
      variantUnavailable: 'variant--unavailable',
      productPriceSale: 'product__price--sale',
      remainingLow: 'count-is-low',
      remainingIn: 'count-is-in',
      remainingOut: 'count-is-out',
      remainingUnavailable: 'count-is-unavailable',
    };

    const attributes$c = {
      remainingMaxAttr: 'data-remaining-max',
      enableHistoryState: 'data-enable-history-state',
      notificationPopup: 'data-notification-popup',
      faderDesktop: 'data-fader-desktop',
      faderMobile: 'data-fader-mobile',
      optionPosition: 'data-option-position',
      imageId: 'data-image-id',
      mediaId: 'data-media-id',
      quickAddButton: 'data-quick-add-btn',
      finalSale: 'data-final-sale',
      variantImageScroll: 'data-variant-image-scroll',
    };

    class ProductForm extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.cartAddEvents();

        this.container = this.closest(selectors$f.section) || this.closest(selectors$f.quickAddModal);
        if (!this.container) return;

        this.sectionId = this.container.dataset.sectionId;
        this.product = this.container.querySelector(selectors$f.product);
        this.productForm = this.container.querySelector(selectors$f.productForm);
        this.productNotification = this.container.querySelector(selectors$f.productNotification);
        this.productImages = this.container.querySelector(selectors$f.productImages);
        this.productMediaList = this.container.querySelector(selectors$f.productMediaList);
        this.installmentForm = this.container.querySelector(selectors$f.installment);
        this.skuWrapper = this.container.querySelector(selectors$f.variantSku);
        this.sellout = null;
        this.variantImageScroll = this.container.getAttribute(attributes$c.variantImageScroll) === 'true';

        this.priceOffWrap = this.container.querySelector(selectors$f.priceOffWrap);
        this.priceOffAmount = this.container.querySelector(selectors$f.priceOffAmount);
        this.priceOffType = this.container.querySelector(selectors$f.priceOffType);
        this.planDescription = this.container.querySelector(selectors$f.subDescription);

        this.remainingWrapper = this.container.querySelector(selectors$f.remainingWrapper);

        if (this.remainingWrapper) {
          const remainingMaxWrap = this.container.querySelector(selectors$f.remainingMax);
          if (remainingMaxWrap) {
            this.remainingMaxInt = parseInt(remainingMaxWrap.getAttribute(attributes$c.remainingMaxAttr), 10);
            this.remainingCount = this.container.querySelector(selectors$f.remainingCount);
            this.remainingJSONWrapper = this.container.querySelector(selectors$f.remainingJSON);
            this.remainingJSON = null;

            if (this.remainingJSONWrapper && this.remainingJSONWrapper.innerHTML !== '') {
              this.remainingJSON = JSON.parse(this.remainingJSONWrapper.innerHTML);
            } else {
              console.warn('Missing product quantity JSON');
            }
          }
        }

        this.enableHistoryState = this.container.getAttribute(attributes$c.enableHistoryState) === 'true';
        this.hasUnitPricing = this.container.querySelector(selectors$f.unitWrapper);
        this.subSelectors = this.container.querySelector(selectors$f.subSelectors);
        this.subPrices = this.container.querySelector(selectors$f.subPrices);
        this.isPreOrder = this.container.querySelector(selectors$f.isPreOrder);

        let productJSON = null;
        const productElemJSON = this.container.querySelector(selectors$f.productJson);
        if (productElemJSON) {
          productJSON = productElemJSON.innerHTML;
        }
        if (productJSON) {
          this.productJSON = JSON.parse(productJSON);
          this.linkForm();
          this.sellout = new SelloutVariants(this.container, this.productJSON);
        } else {
          console.error('Missing product JSON');
        }

        this.variantOptionImages = this.container.querySelectorAll(selectors$f.variantOptionImage);
        this.variantButtons = this.container.querySelectorAll(selectors$f.variantButtons);
        if (this.variantOptionImages.length > 1) {
          this.optionImagesWidth();
        }
      }

      cartAddEvents() {
        this.buttonATC = this.querySelector(selectors$f.addToCart);
        const ajaxCartEnabled = document.querySelector(selectors$f.cartDrawer) || document.querySelector(selectors$f.cartPage);

        if (!this.buttonATC || !ajaxCartEnabled) return;

        this.buttonATC.addEventListener('click', (e) => {
          e.preventDefault();

          document.dispatchEvent(
            new CustomEvent('theme:cart:add', {
              detail: {
                button: this.buttonATC,
              },
              bubbles: false,
            })
          );

          if (!this.closest(selectors$f.quickAddModal)) {
            window.accessibility.lastElement = this.buttonATC;
          }
        });
      }

      destroy() {
        this.productForm.destroy();
      }

      linkForm() {
        this.productForm = new ProductFormReader(this.container, this.productJSON, {
          onOptionChange: this.onOptionChange.bind(this),
          onPlanChange: this.onPlanChange.bind(this),
        });
        this.pushState(this.productForm.getFormState(), true);
        this.subsToggleListeners();
      }

      onOptionChange(evt) {
        this.pushState(evt.dataset);
        this.updateProductImage(evt);
      }

      onPlanChange(evt) {
        if (this.subPrices) {
          this.pushState(evt.dataset);
        }
      }

      pushState(formState, init = false) {
        this.productState = this.setProductState(formState);
        this.updateAddToCartState(formState);
        this.updateNotificationForm(formState);
        this.updateProductPrices(formState);
        this.updateSaleText(formState);
        this.updateSku(formState);
        this.updateSubscriptionText(formState);
        this.updateRemaining(formState);
        this.updateLegend(formState);
        this.fireHookEvent(formState);
        this.sellout?.update(formState);

        if (this.enableHistoryState && !init) {
          this.updateHistoryState(formState);
        }
      }

      updateAddToCartState(formState) {
        const variant = formState.variant;
        let addText = theme.strings.addToCart;
        const priceWrapper = this.container.querySelectorAll(selectors$f.priceWrapper);
        const addToCart = this.container.querySelectorAll(selectors$f.addToCart);
        const addToCartText = this.container.querySelectorAll(selectors$f.addToCartText);
        const formWrapper = this.container.querySelectorAll(selectors$f.formWrapper);

        if (this.installmentForm && variant) {
          const installmentInput = this.installmentForm.querySelector(selectors$f.inputId);
          installmentInput.value = variant.id;
          installmentInput.dispatchEvent(new Event('change', {bubbles: true}));
        }

        if (this.isPreOrder) {
          addText = theme.strings.preOrder;
        }

        if (priceWrapper.length && variant) {
          priceWrapper.forEach((element) => {
            element.classList.remove(classes$9.hidden);
          });
        }

        addToCart?.forEach((button) => {
          if (button.hasAttribute(attributes$c.quickAddButton)) return;

          if (variant) {
            if (variant.available) {
              button.disabled = false;
            } else {
              button.disabled = true;
            }
          } else {
            button.disabled = true;
          }
        });

        addToCartText?.forEach((element) => {
          let btnText = addText;
          if (variant) {
            if (!variant.available) {
              btnText = theme.strings.soldOut;
            }
          } else {
            btnText = theme.strings.unavailable;
          }

          element.textContent = btnText;
        });

        if (formWrapper.length) {
          formWrapper.forEach((element) => {
            if (variant) {
              if (variant.available) {
                element.classList.remove(classes$9.variantSoldOut, classes$9.variantUnavailable);
              } else {
                element.classList.add(classes$9.variantSoldOut);
                element.classList.remove(classes$9.variantUnavailable);
              }

              const formSelect = element.querySelector(selectors$f.originalSelectorId);
              if (formSelect) {
                formSelect.value = variant.id;
              }

              const inputId = element.querySelector(`${selectors$f.inputId}[form]`);
              if (inputId) {
                inputId.value = variant.id;
                inputId.dispatchEvent(new Event('change'));
              }
            } else {
              element.classList.add(classes$9.variantUnavailable);
              element.classList.remove(classes$9.variantSoldOut);
            }
          });
        }
      }

      updateNotificationForm(formState) {
        if (!this.productNotification) return;

        const variantTitle = this.productNotification.querySelector(selectors$f.variantTitle);
        const notificationProduct = this.productNotification.querySelector(selectors$f.notificationProduct);
        if (variantTitle != null) {
          variantTitle.textContent = formState.variant.title;
          notificationProduct.value = formState.variant.name;
        }
      }

      updateHistoryState(formState) {
        const variant = formState.variant;
        const plan = formState.plan;
        const location = window.location.href;
        if (variant && location.includes('/product')) {
          const url = new window.URL(location);
          const params = url.searchParams;
          params.set('variant', variant.id);
          if (plan && plan.detail && plan.detail.id && this.productState.hasPlan) {
            params.set('selling_plan', plan.detail.id);
          } else {
            params.delete('selling_plan');
          }
          url.search = params.toString();
          const urlString = url.toString();
          window.history.replaceState({path: urlString}, '', urlString);
        }
      }

      updateRemaining(formState) {
        const variant = formState.variant;

        this.remainingWrapper?.classList.remove(classes$9.remainingIn, classes$9.remainingOut, classes$9.remainingUnavailable, classes$9.remainingLow);

        if (variant && this.remainingWrapper && this.remainingJSON) {
          const remaining = this.remainingJSON[variant.id];

          if (remaining === 'out' || remaining < 1) {
            this.remainingWrapper.classList.add(classes$9.remainingOut);
          }

          if (remaining === 'in' || remaining >= this.remainingMaxInt) {
            this.remainingWrapper.classList.add(classes$9.remainingIn);
          }
          if (remaining === 'low' || (remaining > 0 && remaining < this.remainingMaxInt)) {
            this.remainingWrapper.classList.add(classes$9.remainingLow);

            if (this.remainingCount) {
              this.remainingCount.innerHTML = remaining;
            }
          }
        } else if (!variant && this.remainingWrapper) {
          this.remainingWrapper.classList.add(classes$9.remainingUnavailable);
        }
      }

      optionImagesWidth() {
        if (!this.variantButtons) return;

        let maxItemWidth = 0;

        for (const item of this.variantOptionImages) {
          const itemWidth = item.offsetWidth;
          if (itemWidth > maxItemWidth) {
            maxItemWidth = itemWidth;
          }
        }

        this.variantButtons.style?.setProperty('--option-image-width', maxItemWidth + 'px');
      }

      getBaseUnit(variant) {
        return variant.unit_price_measurement.reference_value === 1
          ? variant.unit_price_measurement.reference_unit
          : variant.unit_price_measurement.reference_value + variant.unit_price_measurement.reference_unit;
      }

      subsToggleListeners() {
        const toggles = this.container.querySelectorAll(selectors$f.subsToggle);

        toggles.forEach((toggle) => {
          toggle.addEventListener(
            'change',
            function (e) {
              const val = e.target.value.toString();
              const selected = this.container.querySelector(`[${selectors$f.subsChild}="${val}"]`);
              const groups = this.container.querySelectorAll(`[${selectors$f.subsChild}]`);
              if (selected) {
                selected.classList.remove(classes$9.hidden);
                const first = selected.querySelector(`[name="selling_plan"]`);
                first.checked = true;
                first.dispatchEvent(new Event('change'));
              }
              groups.forEach((group) => {
                if (group !== selected) {
                  group.classList.add(classes$9.hidden);
                  const plans = group.querySelectorAll(`[name="selling_plan"]`);
                  plans.forEach((plan) => {
                    plan.checked = false;
                    plan.dispatchEvent(new Event('change'));
                  });
                }
              });
            }.bind(this)
          );
        });
      }

      updateSaleText(formState) {
        if (this.productState.planSale) {
          this.updateSaleTextSubscription(formState);
        } else if (this.productState.onSale) {
          this.updateSaleTextStandard(formState);
        } else if (this.priceOffWrap) {
          this.priceOffWrap.classList.add(classes$9.hidden);
        }
      }

      isVariantFinalSale(variant) {
        const metafieldsData = document.querySelector(selectors$f.variantFinalSaleMeta).textContent;
        const variantsMetafields = JSON.parse(metafieldsData);
        let variantIsFinalSale = false;

        variantsMetafields.forEach((variantMetafield) => {
          if (Number(variantMetafield.variant_id) === variant.id) {
            variantIsFinalSale = variantMetafield.metafield_value === 'true';
          }
        });

        return variantIsFinalSale;
      }

      updateSaleTextStandard(formState) {
        const variant = formState.variant;

        if (this.priceOffType) {
          this.priceOffType.innerHTML = window.theme.strings.sale || 'sale';
        }

        if (this.priceOffAmount && this.priceOffWrap) {
          const discountFloat = (variant.compare_at_price - variant.price) / variant.compare_at_price;
          const discountInt = Math.floor(discountFloat * 100);
          this.priceOffAmount.innerHTML = `${discountInt}%`;
          this.priceOffWrap.classList.remove(classes$9.hidden);
        }

        if (this.priceOffWrap.hasAttribute(attributes$c.finalSale) || this.isVariantFinalSale(variant)) {
          this.priceOffWrap.classList.remove(classes$9.hidden);
        } else {
          this.priceOffWrap.classList.add(classes$9.hidden);
        }
      }

      updateSubscriptionText(formState) {
        if (formState.plan && this.planDescription) {
          this.planDescription.innerHTML = formState.plan.detail.description;
          this.planDescription.classList.remove(classes$9.hidden);
        } else if (this.planDescription) {
          this.planDescription.classList.add(classes$9.hidden);
        }
      }

      updateSaleTextSubscription(formState) {
        if (this.priceOffType) {
          this.priceOffType.innerHTML = window.theme.strings.subscription || 'subscripton';
        }

        if (this.priceOffAmount && this.priceOffWrap) {
          const adjustment = formState.plan.detail.price_adjustments[0];
          const discount = adjustment.value;
          if (adjustment && adjustment.value_type === 'percentage') {
            this.priceOffAmount.innerHTML = `${discount}%`;
          } else {
            this.priceOffAmount.innerHTML = formatMoney(discount, theme.moneyFormat);
          }
          this.priceOffWrap.classList.remove(classes$9.hidden);
        }
      }

      updateProductPrices(formState) {
        const variant = formState.variant;
        const plan = formState.plan;
        const priceWrappers = this.container.querySelectorAll(selectors$f.priceWrapper);

        priceWrappers.forEach((wrap) => {
          const comparePriceEl = wrap.querySelector(selectors$f.comparePrice);
          const productPriceEl = wrap.querySelector(selectors$f.productPrice);
          const comparePriceText = wrap.querySelector(selectors$f.comparePriceText);

          let comparePrice = '';
          let price = '';

          if (this.productState.available) {
            comparePrice = variant.compare_at_price;
            price = variant.price;
          }

          if (this.productState.hasPlan) {
            price = plan.allocation.price;
          }

          if (this.productState.planSale) {
            comparePrice = plan.allocation.compare_at_price;
            price = plan.allocation.price;
          }

          if (comparePriceEl) {
            if (this.productState.onSale || this.productState.planSale) {
              comparePriceEl.classList.remove(classes$9.hidden);
              comparePriceText.classList.remove(classes$9.hidden);
              productPriceEl.classList.add(classes$9.productPriceSale);
            } else {
              comparePriceEl.classList.add(classes$9.hidden);
              comparePriceText.classList.add(classes$9.hidden);
              productPriceEl.classList.remove(classes$9.productPriceSale);
            }
            comparePriceEl.innerHTML = formatMoney(comparePrice, theme.moneyFormat);
          }

          productPriceEl.innerHTML = price === 0 ? window.theme.strings.free : formatMoney(price, theme.moneyFormat);
        });

        if (this.hasUnitPricing) {
          this.updateProductUnits(formState);
        }
      }

      updateProductUnits(formState) {
        const variant = formState.variant;
        const plan = formState.plan;
        let unitPrice = null;

        if (variant && variant.unit_price) {
          unitPrice = variant.unit_price;
        }
        if (plan && plan.allocation && plan.allocation.unit_price) {
          unitPrice = plan.allocation.unit_price;
        }

        if (unitPrice) {
          const base = this.getBaseUnit(variant);
          const formattedPrice = formatMoney(unitPrice, theme.moneyFormat);
          this.container.querySelector(selectors$f.unitPrice).innerHTML = formattedPrice;
          this.container.querySelector(selectors$f.unitBase).innerHTML = base;
          showElement(this.container.querySelector(selectors$f.unitWrapper));
        } else {
          hideElement(this.container.querySelector(selectors$f.unitWrapper));
        }
      }

      updateSku(formState) {
        if (!this.skuWrapper) return;

        this.skuWrapper.innerHTML = `${theme.strings.sku}: ${formState.variant.sku}`;
      }

      fireHookEvent(formState) {
        const variant = formState.variant;
        this.container.dispatchEvent(
          new CustomEvent('theme:variant:change', {
            detail: {
              variant: variant,
            },
            bubbles: true,
          })
        );
      }

      /**
       * Tracks aspects of the product state that are relevant to UI updates
       * @param {object} evt - variant change event
       * @return {object} productState - represents state of variant + plans
       *  productState.available - current variant and selling plan options result in valid offer
       *  productState.soldOut - variant is sold out
       *  productState.onSale - variant is on sale
       *  productState.showUnitPrice - variant has unit price
       *  productState.requiresPlan - all the product variants requires a selling plan
       *  productState.hasPlan - there is a valid selling plan
       *  productState.planSale - plan has a discount to show next to price
       *  productState.planPerDelivery - plan price does not equal per_delivery_price - a prepaid subscription
       */
      setProductState(dataset) {
        const variant = dataset.variant;
        const plan = dataset.plan;

        const productState = {
          available: true,
          soldOut: false,
          onSale: false,
          showUnitPrice: false,
          requiresPlan: false,
          hasPlan: false,
          planPerDelivery: false,
          planSale: false,
        };

        if (!variant || (variant.requires_selling_plan && !plan)) {
          productState.available = false;
        } else {
          if (!variant.available) {
            productState.soldOut = true;
          }

          if (variant.compare_at_price > variant.price) {
            productState.onSale = true;
          }

          if (variant.unit_price) {
            productState.showUnitPrice = true;
          }

          if (this.product && this.product.requires_selling_plan) {
            productState.requiresPlan = true;
          }

          if (plan && this.subPrices) {
            productState.hasPlan = true;
            if (plan.allocation.per_delivery_price !== plan.allocation.price) {
              productState.planPerDelivery = true;
            }
            if (variant.price > plan.allocation.price) {
              productState.planSale = true;
            }
          }
        }
        return productState;
      }

      updateProductImage(evt) {
        const variant = evt.dataset.variant;

        if (variant) {
          // Update variant image, if one is set
          if (variant.featured_media) {
            const selectedImage = this.container.querySelector(`[${attributes$c.imageId}="${variant.featured_media.id}"]`);
            // If we have a mobile breakpoint or the tall layout is disabled,
            // just switch the slideshow.

            if (selectedImage) {
              const selectedImageId = selectedImage.getAttribute(attributes$c.mediaId);
              const isDesktopView = isDesktop();

              selectedImage.dispatchEvent(
                new CustomEvent('theme:media:select', {
                  bubbles: true,
                  detail: {
                    id: selectedImageId,
                  },
                })
              );

              if (isDesktopView && !this.productImages.hasAttribute(attributes$c.faderDesktop) && this.variantImageScroll) {
                const selectedImageTop = selectedImage.getBoundingClientRect().top;

                // Scroll to variant image
                document.dispatchEvent(
                  new CustomEvent('theme:tooltip:close', {
                    bubbles: false,
                    detail: {
                      hideTransition: false,
                    },
                  })
                );

                scrollTo(selectedImageTop);
              }

              if (!isDesktopView && !this.productImages.hasAttribute(attributes$c.faderMobile)) {
                this.productMediaList.scrollTo({
                  left: selectedImage.offsetLeft,
                });
              }
            }
          }
        }
      }

      updateLegend(formState) {
        const variant = formState.variant;
        if (variant) {
          const optionValues = this.container.querySelectorAll(selectors$f.optionValue);
          if (optionValues.length) {
            optionValues.forEach((optionValue) => {
              const selectorWrapper = optionValue.closest(selectors$f.optionPosition);
              if (selectorWrapper) {
                const optionPosition = selectorWrapper.getAttribute(attributes$c.optionPosition);
                const optionIndex = parseInt(optionPosition, 10) - 1;
                const selectedOptionValue = variant.options[optionIndex];
                optionValue.innerHTML = selectedOptionValue;
              }
            });
          }
        }
      }
    }

    const selectors$e = {
      open: '[data-popup-open]',
      close: '[data-popup-close]',
      focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
    };

    const attributes$b = {
      closing: 'closing',
    };

    class PopupActions {
      constructor(popup, holder, showModal = true, scrollLock = true) {
        this.popup = popup;
        this.holder = holder;
        this.a11y = a11y;
        this.isAnimating = false;
        this.showModal = showModal;
        this.enableScrollLock = scrollLock;
        this.buttonPopupOpen = this.holder?.querySelector(selectors$e.open);

        this.popupEvents();
      }

      popupOpen() {
        if (!this.popup) return;

        this.isAnimating = true;

        // Check if browser supports Dialog tags
        if (this.showModal && typeof this.popup.showModal === 'function') {
          this.popup.showModal();
        } else if (!this.showModal && typeof this.popup.show === 'function') {
          this.popup.show();
        } else {
          this.popup.setAttribute('open', '');
        }

        this.popup.removeAttribute('inert');
        this.popup.focus(); // Focus <dialog> tag element to prevent immediate closing on Escape keypress

        if (this.enableScrollLock) {
          document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
        }

        waitForAnimationEnd(this.popup).then(() => {
          this.isAnimating = false;

          if (this.enableScrollLock) {
            this.a11y.trapFocus(this.popup);
          }

          const focusTarget = this.popup.querySelector('[autofocus]') || this.popup.querySelector(selectors$e.focusable);
          focusTarget?.focus();
        });
      }

      popupClose() {
        if (this.isAnimating || !this.popup || this.popup.hasAttribute('inert')) {
          return;
        }

        if (!this.popup.hasAttribute(attributes$b.closing)) {
          this.popup.setAttribute(attributes$b.closing, '');
          this.isAnimating = true;

          waitForAnimationEnd(this.popup).then(() => {
            this.isAnimating = false;
            this.popupClose();
          });

          return;
        }

        // Check if browser supports Dialog tags
        if (typeof this.popup.close === 'function') {
          this.popup.close();
        } else {
          this.popup.removeAttribute('open');
        }

        this.popupCloseActions();
      }

      popupCloseActions() {
        if (this.popup.hasAttribute('inert')) return;

        this.popup.setAttribute('inert', '');
        this.popup.removeAttribute(attributes$b.closing);

        // Unlock scroll if no other popups & modals are open
        if (!hasOpenModals() && this.enableScrollLock) {
          document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
        }

        this.popup.dispatchEvent(new CustomEvent('theme:popup:onclose', {bubbles: false}));

        if (this.enableScrollLock) {
          this.a11y.removeTrapFocus();
          this.a11y.autoFocusLastElement();
        }
      }

      popupEvents() {
        if (!this.popup) return;

        // Open button click event
        this.buttonPopupOpen?.addEventListener('click', (e) => {
          e.preventDefault();
          this.popupOpen();
          window.accessibility.lastElement = this.buttonPopupOpen;
        });

        // Close button click event
        const closeButtons = this.popup.querySelectorAll(selectors$e.close);
        if (closeButtons.length) {
          closeButtons.forEach((closeButton) => {
            closeButton.addEventListener('click', (e) => {
              e.preventDefault();
              this.popupClose();
            });
          });
        }

        // Close dialog on click outside content
        if (this.showModal) {
          this.popup.addEventListener('click', (event) => {
            if (event.target.nodeName === 'DIALOG' && event.type === 'click') {
              this.popupClose();
            }
          });
        }

        // Close dialog on click ESC key pressed
        this.popup.addEventListener('keydown', (event) => {
          if (event.code === 'Escape') {
            event.preventDefault();
            this.popupClose();
          }
        });

        this.popup.addEventListener('close', () => this.popupCloseActions());
      }
    }

    const selectors$d = {
      dialog: 'dialog',
    };

    class ProductModal extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        new PopupActions(this.querySelector(selectors$d.dialog), this, true, true);
      }
    }

    class ProductModel extends DeferredMedia {
      constructor() {
        super();
      }

      loadContent() {
        super.loadContent();

        Shopify.loadFeatures([
          {
            name: 'model-viewer-ui',
            version: '1.0',
            onLoad: this.setupModelViewerUI.bind(this),
          },
        ]);
      }

      setupModelViewerUI(errors) {
        if (errors) return;

        this.modelViewerUI = new Shopify.ModelViewerUI(this.querySelector('model-viewer'));
      }
    }

    window.ProductModel = {
      loadShopifyXR() {
        Shopify.loadFeatures([
          {
            name: 'shopify-xr',
            version: '1.0',
            onLoad: this.setupShopifyXR.bind(this),
          },
        ]);
      },

      setupShopifyXR(errors) {
        if (errors) return;

        if (!window.ShopifyXR) {
          document.addEventListener('shopify_xr_initialized', () => this.setupShopifyXR());
          return;
        }

        document.querySelectorAll('[id^="ModelJSON-"]').forEach((modelJSON) => {
          window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
          modelJSON.remove();
        });
        window.ShopifyXR.setupXRElements();
      },
    };

    window.addEventListener('DOMContentLoaded', () => {
      if (window.ProductModel) window.ProductModel.loadShopifyXR();
    });

    const selectors$c = {
      addToCart: '[data-add-to-cart]',
      productImage: '[data-product-image]',
      productJson: '[data-product-json]',
      form: '[data-product-form]',
      cartBar: '#cart-bar',
      productNotificationPopupButton: '[data-popup-open]',
      productSubmitAdd: '.product__submit__add',
      formWrapper: '[data-form-wrapper]',
      productVariants: '[data-product-variants]',
      slider: '[data-slider]',
    };

    const classes$8 = {
      expanded: 'is-expanded',
      visible: 'is-visible',
      loading: 'is-loading',
      added: 'is-added',
    };

    const attributes$a = {
      cartBarEnabled: 'data-cart-bar-enabled',
      cartBarAdd: 'data-add-to-cart-bar',
      cartBarScroll: 'data-cart-bar-scroll',
      cartBarProductNotification: 'data-cart-bar-product-notification',
      sectionId: 'data-section-id',
      sliderIndex: 'data-slider-index',
    };

    const sections$8 = {};

    /**
     * Product section constructor.
     * @param {string} container - selector for the section container DOM element
     */
    class Product {
      constructor(section) {
        this.section = section;
        this.container = section.container;
        this.id = this.container.getAttribute(attributes$a.sectionId);
        this.sliders = this.container.querySelectorAll(selectors$c.slider);
        this.slider = [];
        this.formWrapper = this.container.querySelector(selectors$c.formWrapper);
        this.cartBarEnabled = this.container.hasAttribute(attributes$a.cartBarEnabled);
        this.cartBar = this.container.querySelector(selectors$c.cartBar);
        this.setCartBarHeight = this.setCartBarHeight.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.toggleCartBarOnScroll = this.toggleCartBarOnScroll.bind(this);
        this.unlockTimer = 0;
        this.accessibility = a11y;

        // Stop parsing if we don't have the product json script tag when loading
        // section in the Theme Editor
        const productJson = this.container.querySelector(selectors$c.productJson);
        if ((productJson && !productJson.innerHTML) || !productJson) {
          return;
        }

        const productJsonHandle = JSON.parse(productJson.innerHTML).handle;
        let recentObj = {};
        if (productJsonHandle) {
          recentObj = {
            handle: productJsonHandle,
          };
        }

        // Record recently viewed products when the product page is loading
        Shopify.Products.recordRecentlyViewed(recentObj);

        this.form = this.container.querySelector(selectors$c.form);

        if (this.sliders.length) {
          this.sliders.forEach((slider, index) => {
            slider.setAttribute(attributes$a.sliderIndex, index);
            this.slider.push(new Slider(this.container, slider));
          });
        }

        if (this.cartBarEnabled) {
          this.initCartBar();
          this.setCartBarHeight();

          document.addEventListener('theme:scroll', this.toggleCartBarOnScroll);
          document.addEventListener('theme:resize', this.setCartBarHeight);
        }
      }

      initCartBar() {
        // Submit product form on cart bar button click
        this.cartBarBtns = this.cartBar.querySelectorAll(selectors$c.productSubmitAdd);
        if (this.cartBarBtns.length > 0) {
          this.cartBarBtns.forEach((button) => {
            button.addEventListener('click', (e) => {
              e.preventDefault();

              if (e.currentTarget.hasAttribute(attributes$a.cartBarAdd)) {
                if (this.cartBarEnabled) {
                  e.currentTarget.classList.add(classes$8.loading);
                  e.currentTarget.setAttribute('disabled', 'disabled');
                }

                this.form.querySelector(selectors$c.addToCart).dispatchEvent(
                  new Event('click', {
                    bubbles: true,
                  })
                );
              } else if (e.currentTarget.hasAttribute(attributes$a.cartBarScroll)) {
                this.scrollToTop();
              } else if (e.currentTarget.hasAttribute(attributes$a.cartBarProductNotification)) {
                this.container.querySelector(selectors$c.productNotificationPopupButton).dispatchEvent(new Event('click'));
              }
            });

            if (button.hasAttribute(attributes$a.cartBarAdd)) {
              document.addEventListener('theme:product:add-error', this.scrollToTop);
            }
          });
        }

        this.setCartBarHeight();
      }

      scrollToTop() {
        const productVariants = this.container.querySelector(selectors$c.productVariants);
        const scrollTarget = isDesktop() ? this.container : productVariants ? productVariants : this.form;
        const scrollTargetTop = scrollTarget.getBoundingClientRect().top;

        scrollTo(isDesktop() ? scrollTargetTop : scrollTargetTop - 10);
      }

      toggleCartBarOnScroll() {
        const scrolled = window.scrollY;
        const element = theme.variables.productPageSticky && this.formWrapper ? this.formWrapper : this.form;

        if (element && this.cartBar) {
          const formOffset = element.offsetTop;
          const formHeight = element.offsetHeight;
          const checkPosition = scrolled > formOffset + formHeight;

          this.cartBar.classList.toggle(classes$8.visible, checkPosition);
        }
      }

      setCartBarHeight() {
        const cartBarHeight = this.cartBar.offsetHeight;

        document.documentElement.style.setProperty('--cart-bar-height', `${cartBarHeight}px`);
      }

      onUnload() {
        document.removeEventListener('theme:product:add-error', this.scrollToTop);

        if (this.cartBarEnabled) {
          document.removeEventListener('theme:scroll', this.toggleCartBarOnScroll);
          document.removeEventListener('theme:resize', this.setCartBarHeight);
        }
      }

      onBlockSelect(e) {
        const slider = e.srcElement.closest(selectors$c.slider);
        if (slider && this.slider.length) {
          const sliderIndex = slider.hasAttribute(attributes$a.sliderIndex) ? slider.getAttribute(attributes$a.sliderIndex) : 0;
          if (!this.slider[sliderIndex]) return;
          this.slider[sliderIndex].onBlockSelect(e);
        }
      }

      onBlockDeselect(e) {
        const slider = e.srcElement.closest(selectors$c.slider);
        if (slider && this.slider.length) {
          const sliderIndex = slider.hasAttribute(attributes$a.sliderIndex) ? slider.getAttribute(attributes$a.sliderIndex) : 0;
          if (!this.slider[sliderIndex]) return;
          this.slider[sliderIndex].onBlockDeselect(e);
        }
      }
    }

    const productSection = {
      onLoad() {
        sections$8[this.id] = new Product(this);
      },
      onUnload(e) {
        sections$8[this.id].onUnload(e);
      },
      onBlockSelect(e) {
        sections$8[this.id].onBlockSelect(e);
      },
      onBlockDeselect(e) {
        sections$8[this.id].onBlockDeselect(e);
      },
    };

    register('product', [productSection, tooltipSection, tabs, productStickySection]);

    if (!customElements.get('product-form')) {
      customElements.define('product-form', ProductForm);
    }

    if (!customElements.get('product-images')) {
      customElements.define('product-images', ProductImages);
    }

    if (!customElements.get('product-modal')) {
      customElements.define('product-modal', ProductModal);
    }

    if (!customElements.get('product-model')) {
      customElements.define('product-model', ProductModel);
    }

    if (!customElements.get('product-siblings')) {
      customElements.define('product-siblings', ProductSiblings);
    }

    if (!customElements.get('radio-swatch')) {
      customElements.define('radio-swatch', RadioSwatch);
    }

    if (!customElements.get('recipient-form')) {
      customElements.define('recipient-form', RecipientForm);
    }

    const selectors$b = {
      apiRelatedProductsTemplate: '[data-api-related-template]',
      relatedSection: '[data-related-section]',
      relatedProduct: '[data-grid-item]',
      recentlyViewed: '[data-recent-wrapper]',
      recentlyViewedWrapper: '[data-recently-viewed-wrapper]',
      productItem: '.product-item',
      slider: 'grid-slider',
    };

    const attributes$9 = {
      limit: 'data-limit',
      minimum: 'data-minimum',
      productId: 'data-product-id',
    };

    const classes$7 = {
      isHidden: 'is-hidden',
      gridMobileSlider: 'grid--mobile-slider',
    };

    const sections$7 = {};
    class Related {
      constructor(section) {
        this.section = section;
        this.sectionId = section.id;
        this.container = section.container;

        this.related();
        this.recent();
      }

      related() {
        const relatedSection = this.container.querySelector(selectors$b.relatedSection);

        if (!relatedSection) {
          return;
        }

        const productId = relatedSection.getAttribute(attributes$9.productId);
        const limit = relatedSection.getAttribute(attributes$9.limit);
        const requestUrl = `${window.theme.routes.product_recommendations_url}?section_id=api-product-recommendation&limit=${limit}&product_id=${productId}&intent=related`;

        fetch(requestUrl)
          .then((response) => {
            return response.text();
          })
          .then((data) => {
            const relatedContent = document.createElement('div');
            relatedContent.innerHTML = new DOMParser().parseFromString(data, 'text/html').querySelector(selectors$b.apiRelatedProductsTemplate).innerHTML;
            const hasProducts = relatedContent.querySelector(selectors$b.relatedProduct);

            if (hasProducts) {
              relatedSection.innerHTML = relatedContent.innerHTML;
              const styleMobile = parseInt(relatedSection.style.getPropertyValue('--COLUMNS-MOBILE'));

              if (styleMobile === 0) {
                const addedProduct = relatedSection.querySelector(selectors$b.relatedProduct);
                addedProduct.parentElement.classList.add(classes$7.gridMobileSlider);
              }
            } else {
              relatedSection.dispatchEvent(
                new CustomEvent('theme:tab:hide', {
                  bubbles: true,
                })
              );
            }
          })
          .catch(function () {
            relatedSection.dispatchEvent(
              new CustomEvent('theme:tab:hide', {
                bubbles: true,
              })
            );
          });
      }

      recent() {
        const recentlyViewed = this.container.querySelector(selectors$b.recentlyViewed);
        const howManyToshow = recentlyViewed ? parseInt(recentlyViewed.getAttribute(attributes$9.limit)) : 4;

        Shopify.Products.showRecentlyViewed({
          howManyToShow: howManyToshow,
          wrapperId: `recently-viewed-products-${this.sectionId}`,
          section: this.section,
          target: 'api-product-grid-item',
          onComplete: (wrapper, section) => {
            const container = section.container;
            if (!container) return;
            const recentlyViewedHolder = container.querySelector(selectors$b.recentlyViewed);
            const recentlyViewedWrapper = container.querySelector(selectors$b.recentlyViewedWrapper);
            const recentProducts = wrapper.querySelectorAll(selectors$b.productItem);
            const slider = recentlyViewedHolder.querySelector(selectors$b.slider);
            const minimumNumberProducts = recentlyViewedHolder.hasAttribute(attributes$9.minimum) ? parseInt(recentlyViewedHolder.getAttribute(attributes$9.minimum)) : 4;
            const checkRecentInRelated = !recentlyViewedWrapper && recentProducts.length > 0;
            const checkRecentOutsideRelated = recentlyViewedWrapper && recentProducts.length >= minimumNumberProducts;

            if (checkRecentInRelated || checkRecentOutsideRelated) {
              if (checkRecentOutsideRelated) {
                recentlyViewedWrapper.classList.remove(classes$7.isHidden);
              }

              recentlyViewedHolder.classList.remove('is-hidden');

              recentlyViewedHolder.dispatchEvent(
                new CustomEvent('theme:tab:check', {
                  bubbles: true,
                })
              );

              if (slider) {
                slider.dispatchEvent(new CustomEvent('theme:grid-slider:init', {bubbles: true}));
              }
            }
          },
        });
      }
    }

    const relatedSection = {
      onLoad() {
        sections$7[this.id] = new Related(this);
      },
    };

    register('related', [relatedSection, tabs]);

    register('reviews', [slider, blockScroll]);

    const sections$6 = {};

    const selectors$a = {
      sliderLogos: '[data-slider-logos]',
      sliderText: '[data-slider-text]',
      slide: '[data-slide]',
    };

    const classes$6 = {
      isSelected: 'is-selected',
      isInitialized: 'is-initialized',
      flickityEnabled: 'flickity-enabled',
    };

    const attributes$8 = {
      slideData: 'data-slide',
      slideIndex: 'data-slide-index',
    };

    class LogoList {
      constructor(section) {
        this.container = section.container;
        this.slideshowNav = this.container.querySelector(selectors$a.sliderLogos);
        this.slideshowText = this.container.querySelector(selectors$a.sliderText);
        this.setSlideshowNavStateOnResize = () => this.setSlideshowNavState();
        this.flkty = null;
        this.flktyNav = null;
        this.logoSlides = this.slideshowNav.querySelectorAll(selectors$a.slide);
        this.logoSlidesWidth = this.getSlidesWidth();

        this.initSlideshowText();
        this.initSlideshowNav();
      }

      getSlidesWidth() {
        const slidesCount = this.logoSlides.length;
        const slideWidth = 200; // 200px fixed width

        return slidesCount * slideWidth;
      }

      initSlideshowText() {
        if (!this.slideshowText) return;

        this.flkty = new FlickityFade(this.slideshowText, {
          fade: true,
          autoPlay: false,
          prevNextButtons: false,
          cellAlign: 'left', // Prevents blurry text on Safari
          contain: true,
          pageDots: false,
          wrapAround: false,
          selectedAttraction: 0.2,
          friction: 0.6,
          draggable: false,
          accessibility: false,
          on: {
            ready: () => this.sliderAccessibility(),
            change: () => this.sliderAccessibility(),
          },
        });
      }

      sliderAccessibility() {
        const buttons = this.slideshowText.querySelectorAll(`${selectors$a.slide} a, ${selectors$a.slide} button`);

        if (buttons.length) {
          buttons.forEach((button) => {
            const slide = button.closest(selectors$a.slide);
            if (slide) {
              const tabIndex = slide.classList.contains(classes$6.isSelected) ? 0 : -1;
              button.setAttribute('tabindex', tabIndex);
            }
          });
        }
      }

      initSlideshowNav() {
        if (!this.slideshowNav) return;

        if (this.logoSlides.length) {
          this.logoSlides.forEach((logoItem) => {
            logoItem.addEventListener('click', () => {
              const index = parseInt(logoItem.getAttribute(attributes$8.slideIndex));
              const hasSlider = this.slideshowNav.classList.contains(classes$6.flickityEnabled);

              if (this.flkty) {
                this.flkty.select(index);
              }

              if (hasSlider) {
                this.flktyNav.select(index);
                if (!this.slideshowNav.classList.contains(classes$6.isSelected)) {
                  this.flktyNav.playPlayer();
                }
              } else {
                const selectedSlide = this.slideshowNav.querySelector(`.${classes$6.isSelected}`);
                if (selectedSlide) {
                  selectedSlide.classList.remove(classes$6.isSelected);
                }
                logoItem.classList.add(classes$6.isSelected);
              }
            });
          });
        }

        this.setSlideshowNavState();

        document.addEventListener('theme:resize', this.setSlideshowNavStateOnResize);
      }

      setSlideshowNavState() {
        const sliderInitialized = this.slideshowNav.classList.contains(classes$6.flickityEnabled);

        if (this.logoSlidesWidth > getWindowWidth()) {
          if (!sliderInitialized) {
            this.slideshowNav.classList.add(classes$6.isInitialized);

            const selectedSlide = this.slideshowNav.querySelector(`.${classes$6.isSelected}`);

            if (selectedSlide) {
              selectedSlide.classList.remove(classes$6.isSelected);
            }
            this.logoSlides[0].classList.add(classes$6.isSelected);

            // Init slider only once and then listen for watchCSS events
            if (!this.flktyNav) {
              this.flktyNav = new Flickity(this.slideshowNav, {
                autoPlay: 4000,
                prevNextButtons: false,
                contain: false,
                pageDots: false,
                wrapAround: true,
                watchCSS: true,
                selectedAttraction: 0.05,
                friction: 0.8,
                initialIndex: 0,
              });

              this.flktyNav.on('deactivate', () => {
                this.slideshowNav.querySelector(selectors$a.slide).classList.add(classes$6.isSelected);

                if (this.flkty) {
                  this.flkty.select(0);
                }
              });

              if (this.flkty) {
                this.flkty.select(0);
                this.flktyNav.on('change', (index) => this.flkty.select(index));
              }
            }
          }
        } else if (sliderInitialized) {
          // This will deactivate the Logos slider without actually destroying it
          this.slideshowNav.classList.remove(classes$6.isInitialized);
        }
      }

      onBlockSelect(evt) {
        if (!this.slideshowNav) return;
        const slide = this.slideshowNav.querySelector(`[${attributes$8.slideData}="${evt.detail.blockId}"]`);
        const slideIndex = parseInt(slide.getAttribute(attributes$8.slideIndex));

        if (this.slideshowNav.classList.contains(classes$6.flickityEnabled)) {
          this.flktyNav.select(slideIndex);
          this.flktyNav.stopPlayer();
          this.slideshowNav.classList.add(classes$6.isSelected);
        } else {
          slide.dispatchEvent(new Event('click'));
        }
      }

      onBlockDeselect() {
        if (this.slideshowNav && this.slideshowNav.classList.contains(classes$6.flickityEnabled)) {
          this.flktyNav.playPlayer();
          this.slideshowNav.classList.remove(classes$6.isSelected);
        }
      }

      onUnload() {
        document.removeEventListener('theme:resize', this.setSlideshowNavStateOnResize);
      }
    }

    const LogoListSection = {
      onLoad() {
        sections$6[this.id] = new LogoList(this);
      },
      onUnload(e) {
        sections$6[this.id].onUnload(e);
      },
      onBlockSelect(e) {
        sections$6[this.id].onBlockSelect(e);
      },
      onBlockDeselect(e) {
        sections$6[this.id].onBlockDeselect(e);
      },
    };

    register('logos', [LogoListSection, blockScroll]);

    function getScript(url, callback, callbackError) {
      let head = document.getElementsByTagName('head')[0];
      let done = false;
      let script = document.createElement('script');
      script.src = url;

      // Attach handlers for all browsers
      script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
          done = true;
          callback();
        } else {
          callbackError();
        }
      };

      head.appendChild(script);
    }

    const loaders = {};
    window.isYoutubeAPILoaded = false;
    window.isVimeoAPILoaded = false;

    function loadScript(options = {}) {
      if (!options.type) {
        options.type = 'json';
      }

      if (options.url) {
        if (loaders[options.url]) {
          return loaders[options.url];
        } else {
          return getScriptWithPromise(options.url, options.type);
        }
      } else if (options.json) {
        if (loaders[options.json]) {
          return Promise.resolve(loaders[options.json]);
        } else {
          return window
            .fetch(options.json)
            .then((response) => {
              return response.json();
            })
            .then((response) => {
              loaders[options.json] = response;
              return response;
            });
        }
      } else if (options.name) {
        const key = ''.concat(options.name, options.version);
        if (loaders[key]) {
          return loaders[key];
        } else {
          return loadShopifyWithPromise(options);
        }
      } else {
        return Promise.reject();
      }
    }

    function getScriptWithPromise(url, type) {
      const loader = new Promise((resolve, reject) => {
        if (type === 'text') {
          fetch(url)
            .then((response) => response.text())
            .then((data) => {
              resolve(data);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          getScript(
            url,
            function () {
              resolve();
            },
            function () {
              reject();
            }
          );
        }
      });

      loaders[url] = loader;
      return loader;
    }

    function loadShopifyWithPromise(options) {
      const key = ''.concat(options.name, options.version);
      const loader = new Promise((resolve, reject) => {
        try {
          window.Shopify.loadFeatures([
            {
              name: options.name,
              version: options.version,
              onLoad: (err) => {
                onLoadFromShopify(resolve, reject, err);
              },
            },
          ]);
        } catch (err) {
          reject(err);
        }
      });
      loaders[key] = loader;
      return loader;
    }

    function onLoadFromShopify(resolve, reject, err) {
      if (err) {
        return reject(err);
      } else {
        return resolve();
      }
    }

    const selectors$9 = {
      popupContainer: '.pswp',
      popupCloseBtn: '.pswp__custom-close',
      popupIframe: 'iframe, video',
      popupThumbs: '.pswp__thumbs',
      popupButtons: '.pswp__button, .pswp__caption-close',
    };

    const classes$5 = {
      current: 'is-current',
      customLoader: 'pswp--custom-loader',
      customOpen: 'pswp--custom-opening',
      loader: 'pswp__loader',
      popupCloseButton: 'pswp__button--close',
      isFocused: 'is-focused',
    };

    const attributes$7 = {
      dataOptionClasses: 'data-pswp-option-classes',
      ariaCurrent: 'aria-current',
    };

    const loaderHTML = `<div class="${classes$5.loader}"><div class="loader pswp__loader-line"><div class="loader-indeterminate"></div></div></div>`;

    class LoadPhotoswipe {
      constructor(items, options = '') {
        this.items = items;
        this.pswpElement = document.querySelectorAll(selectors$9.popupContainer)[0];
        this.popup = null;
        this.popupThumbs = null;
        this.popupThumbsContainer = this.pswpElement.querySelector(selectors$9.popupThumbs);
        this.closeBtn = this.pswpElement.querySelector(selectors$9.popupCloseBtn);
        this.keyupCloseEvent = (e) => this.keyupClose(e);
        this.a11y = a11y;

        const defaultOptions = {
          history: false,
          focus: false,
          mainClass: '',
        };
        this.options = options !== '' ? options : defaultOptions;

        this.init();
      }

      init() {
        this.pswpElement.classList.add(classes$5.customOpen);

        this.initLoader();

        loadScript({url: window.theme.assets.photoswipe})
          .then(() => this.loadPopup())
          .catch((e) => console.error(e));
      }

      initLoader() {
        if (this.pswpElement.classList.contains(classes$5.customLoader) && this.options !== '' && this.options.mainClass) {
          this.pswpElement.setAttribute(attributes$7.dataOptionClasses, this.options.mainClass);
          let loaderElem = document.createElement('div');
          loaderElem.innerHTML = loaderHTML;
          loaderElem = loaderElem.firstChild;
          this.pswpElement.appendChild(loaderElem);
        } else {
          this.pswpElement.setAttribute(attributes$7.dataOptionClasses, '');
        }
      }

      loadPopup() {
        const PhotoSwipe = window.themePhotoswipe.PhotoSwipe.default;
        const PhotoSwipeUI = window.themePhotoswipe.PhotoSwipeUI.default;

        if (this.pswpElement.classList.contains(classes$5.customLoader)) {
          this.pswpElement.classList.remove(classes$5.customLoader);
        }

        this.pswpElement.classList.remove(classes$5.customOpen);

        this.popup = new PhotoSwipe(this.pswpElement, PhotoSwipeUI, this.items, this.options);
        this.popup.init();

        this.thumbsActions();

        if (document.body.classList.contains(classes$5.isFocused)) {
          setTimeout(() => {
            this.a11y.trapFocus(this.pswpElement, {
              elementToFocus: this.closeBtn,
            });
          }, 200);
        }

        this.popup.listen('close', () => this.onClose());

        if (this.options && this.options.closeElClasses && this.options.closeElClasses.length) {
          this.options.closeElClasses.forEach((closeClass) => {
            const closeElement = this.pswpElement.querySelector(`.pswp__${closeClass}`);
            if (closeElement) {
              closeElement.addEventListener('keyup', this.keyupCloseEvent);
            }
          });
        }
      }

      thumbsActions() {
        if (!this.popupThumbsContainer || !this.popupThumbsContainer.children.length) return;

        this.popupThumbsContainer.addEventListener('wheel', (e) => this.stopDisabledScroll(e));
        this.popupThumbsContainer.addEventListener('mousewheel', (e) => this.stopDisabledScroll(e));
        this.popupThumbsContainer.addEventListener('DOMMouseScroll', (e) => this.stopDisabledScroll(e));

        this.popupThumbs = this.pswpElement.querySelectorAll(`${selectors$9.popupThumbs} > *`);
        this.popupThumbs.forEach((element, i) => {
          element.addEventListener('click', (e) => {
            e.preventDefault();
            const lastCurrentElement = element.parentElement.querySelector(`.${classes$5.current}`);
            lastCurrentElement.classList.remove(classes$5.current);
            lastCurrentElement.setAttribute(attributes$7.ariaCurrent, false);
            element.classList.add(classes$5.current);
            element.setAttribute(attributes$7.ariaCurrent, true);
            this.popup.goTo(i);
          });
        });

        this.popup.listen('imageLoadComplete', () => this.setCurrentThumb());
        this.popup.listen('beforeChange', () => this.setCurrentThumb());
      }

      stopDisabledScroll(e) {
        e.stopPropagation();
      }

      keyupClose(e) {
        if (e.code === 'Enter') {
          this.popup.close();
        }
      }

      onClose() {
        const popupIframe = this.pswpElement.querySelector(selectors$9.popupIframe);
        if (popupIframe) {
          popupIframe.parentNode.removeChild(popupIframe);
        }

        if (this.popupThumbsContainer && this.popupThumbsContainer.firstChild) {
          while (this.popupThumbsContainer.firstChild) this.popupThumbsContainer.removeChild(this.popupThumbsContainer.firstChild);
        }

        this.pswpElement.setAttribute(attributes$7.dataOptionClasses, '');
        const loaderElem = this.pswpElement.querySelector(`.${classes$5.loader}`);
        if (loaderElem) {
          this.pswpElement.removeChild(loaderElem);
        }

        if (this.options && this.options.closeElClasses && this.options.closeElClasses.length) {
          this.options.closeElClasses.forEach((closeClass) => {
            const closeElement = this.pswpElement.querySelector(`.pswp__${closeClass}`);
            if (closeElement) {
              closeElement.removeEventListener('keyup', this.keyupCloseEvent);
            }
          });
        }

        this.a11y.removeTrapFocus();
        this.a11y.autoFocusLastElement();
      }

      setCurrentThumb() {
        const lastCurrentThumb = this.pswpElement.querySelector(`${selectors$9.popupThumbs} > .${classes$5.current}`);
        if (lastCurrentThumb) {
          lastCurrentThumb.classList.remove(classes$5.current);
          lastCurrentThumb.setAttribute(attributes$7.ariaCurrent, false);
        }

        if (!this.popupThumbs) return;
        const currentThumb = this.popupThumbs[this.popup.getCurrentIndex()];
        currentThumb.classList.add(classes$5.current);
        currentThumb.setAttribute(attributes$7.ariaCurrent, true);
        this.scrollThumbs(currentThumb);
      }

      scrollThumbs(currentThumb) {
        const thumbsContainerLeft = this.popupThumbsContainer.scrollLeft;
        const thumbsContainerWidth = this.popupThumbsContainer.offsetWidth;
        const thumbsContainerPos = thumbsContainerLeft + thumbsContainerWidth;
        const currentThumbLeft = currentThumb.offsetLeft;
        const currentThumbWidth = currentThumb.offsetWidth;
        const currentThumbPos = currentThumbLeft + currentThumbWidth;

        if (thumbsContainerPos <= currentThumbPos || thumbsContainerPos > currentThumbLeft) {
          const currentThumbMarginLeft = parseInt(window.getComputedStyle(currentThumb).marginLeft);
          this.popupThumbsContainer.scrollTo({
            top: 0,
            left: currentThumbLeft - currentThumbMarginLeft,
            behavior: 'smooth',
          });
        }
      }
    }

    const attributes$6 = {
      videoPlay: 'data-video-play',
    };

    class VideoPopup extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.videoPlay = this.querySelectorAll(`[${attributes$6.videoPlay}]`);

        this.videoPlay?.forEach((button) => {
          button.addEventListener('click', (e) => {
            const button = e.currentTarget;
            if (button.getAttribute(attributes$6.videoPlay).trim() !== '') {
              e.preventDefault();

              const items = [
                {
                  html: button.getAttribute(attributes$6.videoPlay),
                },
              ];

              const options = {
                mainClass: 'pswp--video',
              };

              new LoadPhotoswipe(items, options);
              window.accessibility.lastElement = button;
            }
          });
        });
      }
    }

    const selectors$8 = {
      videoTemplate: '[data-video-template]',
    };

    const classes$4 = {
      loading: 'is-loading',
    };

    const attributes$5 = {
      videoId: 'data-video-id',
    };

    class VideoBackground extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.videoId = this.getAttribute(attributes$5.videoId);
        this.videoTemplate = this.querySelector(selectors$8.videoTemplate);
        this.video = null;
        this.powerSaverVideoPlay = this.powerSaverVideoPlay.bind(this);

        if (this.videoId) {
          this.renderVideo();
        }
      }

      powerSaverVideoPlay() {
        this.video?.play();
      }

      renderVideo() {
        /*
          Observe video element and pull it out from its template tag
        */
        this.videoTemplateObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const content = this.videoTemplate.innerHTML;

                this.innerHTML = content;
                this.classList.remove(classes$4.loading);
                this.video = this.querySelector('video');
                this.observeVideoPlayToggle();

                // Detect low power mode
                this.video
                  .play()
                  .then(() => {})
                  .catch(() => {
                    // Force video autoplay on iOS when Low Power Mode is On
                    document.addEventListener('click', this.powerSaverVideoPlay, {passive: true, bubbles: true, once: true});
                    document.addEventListener('touchstart', this.powerSaverVideoPlay, {passive: true, bubbles: true, once: true});
                  });

                // Stop observing element after it was animated
                observer.unobserve(entry.target);
              }
            });
          },
          {
            root: null,
            rootMargin: '300px',
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
          }
        );

        this.videoTemplateObserver.observe(this);
      }

      observeVideoPlayToggle() {
        if (!this.video) return;

        const options = {
          rootMargin: '0px',
          threshold: [0, 1.0],
        };

        this.videoPlayObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const isVisible = entry.isIntersecting;
            if (isVisible && typeof this.video.play === 'function') {
              const playPromise = this.video.play();
              if (playPromise !== undefined) {
                playPromise
                  .then((_) => {
                    // Automatic playback started!
                    // Show playing UI.
                  })
                  .catch((error) => {
                    // Auto-play was prevented
                    // Show paused UI.
                  });
              }
            }
            if (!isVisible && typeof this.video.pause === 'function') {
              this.video.pause();
            }
          });
        }, options);

        this.videoPlayObserver.observe(this.video);
      }

      disconnectedCallback() {
        if (this.videoTemplateObserver) {
          this.videoTemplateObserver.disconnect();
        }

        if (this.videoPlayObserver) {
          this.videoPlayObserver.disconnect();
        }

        if (this.videoId) {
          document.removeEventListener('click', this.powerSaverVideoPlay);
          document.removeEventListener('touchstart', this.powerSaverVideoPlay);
        }
      }
    }

    register('featured-video', [parallaxHero]);

    if (!customElements.get('video-background')) {
      customElements.define('video-background', VideoBackground);
    }

    if (!customElements.get('video-popup')) {
      customElements.define('video-popup', VideoPopup);
    }

    register('slideshow', [slider, parallaxHero]);

    const selectors$7 = {
      imagesContainer: '[data-images-container]',
      imageHolder: '[data-image-holder]',
      imageElement: '[data-image-element]',
      rangeButton: '[data-range-button]',
      rangeInput: '[data-range-input]',
    };

    class CompareImages extends HTMLElement {
      constructor() {
        super();

        this.imageHolder = this.querySelector(selectors$7.imageHolder);
        this.imageElement = this.querySelector(selectors$7.imageElement);
        this.rangeButton = this.querySelector(selectors$7.rangeButton);
        this.rangeInput = this.querySelector(selectors$7.rangeInput);
        this.setOverlapImageSize = this.setOverlapImageSize.bind(this);
      }

      connectedCallback() {
        this.setOverlapImageSize();
        this.setImagePosition();
        this.rangeInput.addEventListener('input', () => this.setImagePosition());

        document.addEventListener('theme:resize', this.setOverlapImageSize);
      }

      disconnectedCallback() {
        document.removeEventListener('theme:resize', this.setOverlapImageSize);
      }

      setImagePosition() {
        const value = this.rangeInput.value;
        const imageWidth = this.imageElement.offsetWidth;
        const buttonWidth = this.rangeButton.offsetWidth;

        this.rangeButton.style.left = `${value}%`;
        this.imageHolder.style.width = `${((imageWidth - buttonWidth) * (100 - value)) / 100 + buttonWidth / 2}px`;
      }

      setOverlapImageSize() {
        const containerWidth = this.offsetWidth;
        this.imageElement.style.width = `${containerWidth}px`;
        this.setImagePosition();
      }
    }

    register('custom-content', [slider, parallaxHero, newsletterCheckForResultSection]);

    if (!customElements.get('video-background')) {
      customElements.define('video-background', VideoBackground);
    }

    if (!customElements.get('video-popup')) {
      customElements.define('video-popup', VideoPopup);
    }

    if (!customElements.get('compare-images')) {
      customElements.define('compare-images', CompareImages);
    }

    var styles = {};
    styles.basic = [];

    styles.light = [
      {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'simplified'}, {lightness: '64'}, {hue: '#ff0000'}]},
      {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#bdbdbd'}]},
      {featureType: 'administrative', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
      {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f0f0f0'}, {visibility: 'simplified'}]},
      {featureType: 'landscape.natural.landcover', elementType: 'all', stylers: [{visibility: 'off'}]},
      {featureType: 'landscape.natural.terrain', elementType: 'all', stylers: [{visibility: 'off'}]},
      {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
      {featureType: 'poi', elementType: 'geometry.fill', stylers: [{visibility: 'off'}]},
      {featureType: 'poi', elementType: 'labels', stylers: [{lightness: '100'}]},
      {featureType: 'poi.park', elementType: 'all', stylers: [{visibility: 'on'}]},
      {featureType: 'poi.park', elementType: 'geometry', stylers: [{saturation: '-41'}, {color: '#e8ede7'}]},
      {featureType: 'poi.park', elementType: 'labels', stylers: [{visibility: 'off'}]},
      {featureType: 'road', elementType: 'all', stylers: [{saturation: '-100'}]},
      {featureType: 'road', elementType: 'labels', stylers: [{lightness: '25'}, {gamma: '1.06'}, {saturation: '-100'}]},
      {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
      {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{gamma: '10.00'}]},
      {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}, {visibility: 'simplified'}]},
      {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
      {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.01'}]},
      {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
      {featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
      {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
      {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
      {featureType: 'road.local', elementType: 'geometry.fill', stylers: [{weight: '0.01'}]},
      {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{gamma: '10.00'}, {lightness: '100'}, {weight: '0.4'}]},
      {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'simplified'}, {weight: '0.01'}, {lightness: '39'}]},
      {featureType: 'road.local', elementType: 'labels.text.stroke', stylers: [{weight: '0.50'}, {gamma: '10.00'}, {lightness: '100'}]},
      {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
      {featureType: 'water', elementType: 'all', stylers: [{color: '#cfe5ee'}, {visibility: 'on'}]},
    ];

    styles.white_label = [
      {featureType: 'all', elementType: 'all', stylers: [{visibility: 'simplified'}]},
      {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'simplified'}]},
      {featureType: 'administrative', elementType: 'labels', stylers: [{gamma: '3.86'}, {lightness: '100'}]},
      {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#cccccc'}]},
      {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f2f2f2'}]},
      {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
      {featureType: 'road', elementType: 'all', stylers: [{saturation: -100}, {lightness: 45}]},
      {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
      {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
      {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.8'}]},
      {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
      {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.8'}]},
      {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
      {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0'}]},
      {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
      {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
      {featureType: 'road.local', elementType: 'labels.text', stylers: [{visibility: 'off'}]},
      {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
      {featureType: 'water', elementType: 'all', stylers: [{color: '#e4e4e4'}, {visibility: 'on'}]},
    ];

    styles.dark_label = [
      {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'off'}]},
      {featureType: 'all', elementType: 'labels.text.fill', stylers: [{saturation: 36}, {color: '#000000'}, {lightness: 40}]},
      {featureType: 'all', elementType: 'labels.text.stroke', stylers: [{visibility: 'on'}, {color: '#000000'}, {lightness: 16}]},
      {featureType: 'all', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
      {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 20}]},
      {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 17}, {weight: 1.2}]},
      {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'simplified'}, {lightness: '-82'}]},
      {featureType: 'administrative', elementType: 'labels.text.stroke', stylers: [{invert_lightness: true}, {weight: '7.15'}]},
      {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 20}]},
      {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: 'off'}]},
      {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
      {featureType: 'poi', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 21}]},
      {featureType: 'road', elementType: 'labels', stylers: [{visibility: 'simplified'}]},
      {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 17}, {weight: '0.8'}]},
      {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 29}, {weight: '0.01'}]},
      {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
      {featureType: 'road.arterial', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 18}]},
      {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
      {featureType: 'road.local', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 16}]},
      {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
      {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'off'}]},
      {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
      {featureType: 'transit', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 19}]},
      {featureType: 'water', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 17}]},
    ];

    function mapStyle(key) {
      return styles[key];
    }

    window.theme.allMaps = window.theme.allMaps || {};
    let allMaps = window.theme.allMaps;

    window.theme.mapAPI = window.theme.mapAPI || null;

    /* global google */

    class Map {
      constructor(section) {
        this.container = section.container;
        this.mapContainer = this.container.querySelector('[data-map-container]');
        this.key = this.container.getAttribute('data-api-key');
        this.styleString = this.container.getAttribute('data-style') || '';
        this.zoomString = this.container.getAttribute('data-zoom') || 14;
        this.address = this.container.getAttribute('data-address');
        this.enableCorrection = this.container.getAttribute('data-latlong-correction');
        this.lat = this.container.getAttribute('data-lat');
        this.long = this.container.getAttribute('data-long');

        if (this.key) {
          this.initMaps();
        }
      }

      initMaps() {
        const apiLoaded = loadAPI(this.key);
        apiLoaded
          .then(() => {
            return this.enableCorrection === 'true' && this.lat !== '' && this.long !== '' ? new google.maps.LatLng(this.lat, this.long) : geocodeAddressPromise(this.address);
          })
          .then((center) => {
            const zoom = parseInt(this.zoomString, 10);
            const styles = mapStyle(this.styleString);
            const mapOptions = {
              zoom,
              styles,
              center,
              draggable: true,
              clickableIcons: false,
              scrollwheel: false,
              zoomControl: false,
              disableDefaultUI: true,
            };
            const map = createMap(this.mapContainer, mapOptions);

            return map;
          })
          .then((map) => {
            this.map = map;
            allMaps[this.id] = map;
          })
          .catch((e) => {
            console.log('Failed to load Google Map');
            console.log(e);
          });
      }

      unload() {
        if (typeof window.google !== 'undefined') {
          google.maps.event.clearListeners(this.map, 'resize');
        }
      }
    }

    const mapSection = {
      onLoad() {
        allMaps[this.id] = new Map(this);
      },
      onUnload() {
        if (typeof allMaps[this.id].unload === 'function') {
          allMaps[this.id].unload();
        }
      },
    };

    register('map', mapSection);

    function loadAPI(key) {
      if (window.theme.mapAPI === null) {
        const urlKey = `https://maps.googleapis.com/maps/api/js?key=${key}`;
        window.theme.mapAPI = loadScript({url: urlKey});
      }
      return window.theme.mapAPI;
    }

    function createMap(container, options) {
      var map = new google.maps.Map(container, options);
      var center = map.getCenter();

      // eslint-disable-next-line no-unused-vars
      new google.maps.Marker({
        map: map,
        position: center,
      });

      google.maps.event.addDomListener(window, 'resize', function () {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(center);
      });
      return map;
    }

    function geocodeAddressPromise(address) {
      return new Promise((resolve, reject) => {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: address}, function (results, status) {
          if (status == 'OK') {
            var latLong = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            };
            resolve(latLong);
          } else {
            reject(status);
          }
        });
      });
    }

    const selectors$6 = {
      largePromo: '[data-large-promo]',
      largePromoInner: '[data-large-promo-inner]',
      trackingInner: '[data-tracking-consent-inner]',
      tracking: '[data-tracking-consent]',
      trackingAccept: '[data-confirm-cookies]',
      cartBar: 'cart-bar',
      newsletterPopup: '[data-newsletter]',
      newsletterPopupHolder: '[data-newsletter-holder]',
      newsletterHeading: '[data-newsletter-heading]',
      newsletterField: '[data-newsletter-field]',
      promoPopup: '[data-promo-text]',
      newsletterForm: '[data-newsletter-form]',
      delayAttribite: 'data-popup-delay',
      cookieNameAttribute: 'data-cookie-name',
      dataTargetReferrer: 'data-target-referrer',
    };

    const classes$3 = {
      hidden: 'hidden',
      hasValue: 'has-value',
      cartBarVisible: 'cart-bar-visible',
      isVisible: 'is-visible',
      success: 'has-success',
      selected: 'selected',
      hasBlockSelected: 'has-block-selected',
      mobile: 'mobile',
      desktop: 'desktop',
      bottom: 'bottom',
    };

    const attributes$4 = {
      enable: 'data-enable',
    };

    let sections$5 = {};

    class DelayShow {
      constructor(holder, element, popupEvents) {
        this.element = element;
        this.delay = holder.getAttribute(selectors$6.delayAttribite);
        this.isSubmitted = window.location.href.indexOf('accepts_marketing') !== -1 || window.location.href.indexOf('customer_posted=true') !== -1;
        this.popupActions = popupEvents;
        this.showPopupOnScrollEvent = () => this.showPopupOnScroll();

        if (this.delay === 'always' || this.isSubmitted) {
          this.always();
        }

        if (this.delay && this.delay.includes('delayed') && !this.isSubmitted) {
          const seconds = this.delay.includes('_') ? parseInt(this.delay.split('_')[1]) : 10;
          this.delayed(seconds);
        }

        if (this.delay === 'bottom' && !this.isSubmitted) {
          this.bottom();
        }

        if (this.delay === 'idle' && !this.isSubmitted) {
          this.idle();
        }
      }

      always() {
        this.popupActions.popupOpen();
      }

      delayed(seconds = 10) {
        // Show popup after specific seconds
        setTimeout(() => {
          this.popupActions.popupOpen();
        }, seconds * 1000);
      }

      // Idle for 1 min
      idle() {
        let timer = 0;
        let idleTime = 60000;
        const documentEvents = ['mousemove', 'mousedown', 'click', 'touchmove', 'touchstart', 'touchend', 'keydown', 'keypress'];
        const windowEvents = ['load', 'resize', 'scroll'];

        const startTimer = () => {
          timer = setTimeout(() => {
            timer = 0;
            this.popupActions.popupOpen();
          }, idleTime);

          documentEvents.forEach((eventType) => {
            document.addEventListener(eventType, resetTimer);
          });

          windowEvents.forEach((eventType) => {
            window.addEventListener(eventType, resetTimer);
          });
        };

        const resetTimer = () => {
          if (timer) {
            clearTimeout(timer);
          }

          documentEvents.forEach((eventType) => {
            document.removeEventListener(eventType, resetTimer);
          });

          windowEvents.forEach((eventType) => {
            window.removeEventListener(eventType, resetTimer);
          });

          startTimer();
        };

        startTimer();
      }

      // Scroll to the bottom of the page
      bottom() {
        document.addEventListener('theme:scroll', this.showPopupOnScrollEvent);
      }

      showPopupOnScroll() {
        if (window.scrollY + window.innerHeight >= document.body.clientHeight) {
          this.popupActions.popupOpen();
          document.removeEventListener('theme:scroll', this.showPopupOnScrollEvent);
        }
      }

      onUnload() {
        document.removeEventListener('theme:scroll', this.showPopupOnScrollEvent);
      }
    }

    class TargetReferrer {
      constructor(el) {
        this.el = el;
        this.locationPath = location.href;

        if (!this.el.hasAttribute(selectors$6.dataTargetReferrer)) {
          return false;
        }

        this.init();
      }

      init() {
        if (this.locationPath.indexOf(this.el.getAttribute(selectors$6.dataTargetReferrer)) === -1 && !window.Shopify.designMode) {
          this.el.parentNode.removeChild(this.el);
        }
      }
    }

    class LargePopup {
      constructor(el) {
        this.popup = el;
        this.modal = this.popup.querySelector(selectors$6.largePromoInner);
        this.form = this.popup.querySelector(selectors$6.newsletterForm);
        this.cookie = new PopupCookie(this.popup.getAttribute(selectors$6.cookieNameAttribute), 'user_has_closed');
        this.isTargeted = new TargetReferrer(this.popup);
        this.popupActions = new PopupActions(this.modal, this.modal, true, true);
        this.a11y = a11y;

        this.init();
      }

      init() {
        const cookieExists = this.cookie.read() !== false;
        const targetMobile = this.popup.classList.contains(classes$3.mobile);
        const targetDesktop = this.popup.classList.contains(classes$3.desktop);
        const isMobileView = !isDesktop();
        let targetMatches = true;

        if ((targetMobile && !isMobileView) || (targetDesktop && isMobileView)) {
          targetMatches = false;
        }

        if (!targetMatches) {
          this.a11y.removeTrapFocus();
          document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
          return;
        }

        if (!cookieExists || window.Shopify.designMode) {
          if (!window.Shopify.designMode && !window.location.pathname.endsWith('/challenge')) {
            new DelayShow(this.popup, this.modal, this.popupActions);
          }

          if (this.form && this.form.classList.contains(classes$3.success)) {
            this.checkForSuccess();
          }

          this.modal.addEventListener('theme:popup:onclose', () => this.cookie.write());
        }
      }

      checkForSuccess() {
        this.popupActions.popupOpen();
        this.cookie.write();
      }

      onBlockSelect(evt) {
        if (this.popup.contains(evt.target)) {
          this.popupActions.popupOpen();
          this.popup.classList.add(classes$3.selected);
          this.popup.parentNode.classList.add(classes$3.hasBlockSelected);
        }
      }

      onBlockDeselect(evt) {
        if (this.popup.contains(evt.target)) {
          this.popupActions.popupClose();
          this.popup.classList.remove(classes$3.selected);
          this.popup.parentNode.classList.remove(classes$3.hasBlockSelected);
        }
      }
    }

    class Tracking {
      constructor(el) {
        this.popup = el;
        this.modal = document.querySelector(selectors$6.tracking);
        this.acceptButton = this.modal.querySelector(selectors$6.trackingAccept);
        this.enable = this.modal.getAttribute(attributes$4.enable) === 'true';
        this.showPopup = false;
        this.popupActions = new PopupActions(this.popup, this.popup, false, false);

        window.Shopify.loadFeatures(
          [
            {
              name: 'consent-tracking-api',
              version: '0.1',
            },
          ],
          (error) => {
            if (error) {
              throw error;
            }

            const userCanBeTracked = window.Shopify.customerPrivacy.userCanBeTracked();
            const userTrackingConsent = window.Shopify.customerPrivacy.getTrackingConsent();

            this.showPopup = !userCanBeTracked && userTrackingConsent === 'no_interaction' && this.enable;

            if (window.Shopify.designMode) {
              this.showPopup = true;
            }

            this.init();
          }
        );
      }

      init() {
        if (this.showPopup) {
          this.popupActions.popupOpen();
        }

        this.clickEvents();
      }

      clickEvents() {
        this.acceptButton.addEventListener('click', (event) => {
          event.preventDefault();

          window.Shopify.customerPrivacy.setTrackingConsent(true, () => this.popupActions.popupClose());

          document.documentElement.style.setProperty('--cookie-bar-height', '0px');
        });

        document.addEventListener('trackingConsentAccepted', () => {
          // trackingConsentAccepted event fired
        });
      }

      onSelect() {
        if (this.showPopup) {
          this.popupActions.popupOpen();
          this.popup.classList.add(classes$3.selected);
          this.popup.parentNode.classList.add(classes$3.hasBlockSelected);
        }
      }

      onDeselect() {
        if (this.showPopup) {
          this.popupActions.popupClose();
          this.popup.classList.remove(classes$3.selected);
          this.popup.parentNode.classList.remove(classes$3.hasBlockSelected);
        }
      }
    }

    class PromoText {
      constructor(el) {
        this.popup = el;
        this.cookie = new PopupCookie(this.popup.getAttribute(selectors$6.cookieNameAttribute), 'user_has_closed');
        this.isTargeted = new TargetReferrer(this.popup);
        this.popupActions = new PopupActions(this.popup, this.popup, false, false);

        this.init();
      }

      init() {
        const cookieExists = this.cookie.read() !== false;

        if (!cookieExists || window.Shopify.designMode) {
          if (!window.Shopify.designMode) {
            new DelayShow(this.popup, this.popup, this.popupActions);
          } else {
            this.popupActions.popupOpen();
          }

          this.popup.addEventListener('theme:popup:onclose', () => this.cookie.write());
        }
      }

      onSelect() {
        this.popupActions.popupOpen();
        this.popup.classList.add(classes$3.selected);
        this.popup.parentNode.classList.add(classes$3.hasBlockSelected);
      }

      onDeselect() {
        this.popupActions.popupClose();
        this.popup.classList.remove(classes$3.selected);
        this.popup.parentNode.classList.remove(classes$3.hasBlockSelected);
      }
    }

    class NewsletterPopup {
      constructor(el) {
        this.popup = el;
        this.holder = this.popup.querySelector(selectors$6.newsletterPopupHolder);
        this.heading = this.popup.querySelector(selectors$6.newsletterHeading);
        this.newsletterField = this.popup.querySelector(selectors$6.newsletterField);
        this.cookie = new PopupCookie(this.popup.getAttribute(selectors$6.cookieNameAttribute), 'newsletter_is_closed');
        this.form = this.popup.querySelector(selectors$6.newsletterForm);
        this.isTargeted = new TargetReferrer(this.popup);
        this.popupActions = new PopupActions(this.holder, this.holder, false, false);
        this.resetClassTimer = 0;

        this.init();
      }

      init() {
        const cookieExists = this.cookie.read() !== false;
        const submissionSuccess = window.location.search.indexOf('?customer_posted=true') !== -1;
        const classesString = [...this.holder.classList].toString();
        const isPositionBottom = classesString.includes(classes$3.bottom);

        if (submissionSuccess) {
          this.delay = 0;
        }

        if (!cookieExists || window.Shopify.designMode) {
          this.show();

          if (this.form.classList.contains(classes$3.success)) {
            this.checkForSuccess();
          }
        }

        if (isPositionBottom) {
          this.observeCartBar();
        }
      }

      show() {
        if (!window.location.pathname.endsWith('/challenge')) {
          if (!window.Shopify.designMode) {
            new DelayShow(this.popup, this.holder, this.popupActions);
          } else {
            this.popupActions.popupOpen();
          }
        }

        this.showForm();
        this.inputField();

        this.holder.addEventListener('theme:popup:onclose', () => this.cookie.write());
      }

      checkForSuccess() {
        this.popupActions.popupOpen();
        this.cookie.write();
      }

      observeCartBar() {
        this.cartBar = document.getElementById(selectors$6.cartBar);

        if (!this.cartBar) return;

        const config = {attributes: true, childList: false, subtree: false};
        let isVisible = this.cartBar.classList.contains(classes$3.isVisible);
        document.body.classList.toggle(classes$3.cartBarVisible, isVisible);

        // Callback function to execute when mutations are observed
        const callback = (mutationList) => {
          for (const mutation of mutationList) {
            if (mutation.type === 'attributes') {
              isVisible = mutation.target.classList.contains(classes$3.isVisible);
              document.body.classList.toggle(classes$3.cartBarVisible, isVisible);
            }
          }
        };

        this.observer = new MutationObserver(callback);
        this.observer.observe(this.cartBar, config);
      }

      showForm() {
        this.heading.addEventListener('click', (event) => {
          event.preventDefault();

          this.heading.classList.add(classes$3.hidden);
          this.form.classList.remove(classes$3.hidden);
          this.newsletterField.focus();
        });

        this.heading.addEventListener('keyup', (event) => {
          if (event.code === 'Enter') {
            this.heading.dispatchEvent(new Event('click'));
          }
        });
      }

      inputField() {
        const setClass = () => {
          // Reset timer if exists and is active
          if (this.resetClassTimer) {
            clearTimeout(this.resetClassTimer);
          }

          if (this.newsletterField.value !== '') {
            this.holder.classList.add(classes$3.hasValue);
          }
        };

        const unsetClass = () => {
          // Reset timer if exists and is active
          if (this.resetClassTimer) {
            clearTimeout(this.resetClassTimer);
          }

          // Reset class
          this.resetClassTimer = setTimeout(() => {
            this.holder.classList.remove(classes$3.hasValue);
          }, 2000);
        };

        this.newsletterField.addEventListener('input', setClass);
        this.newsletterField.addEventListener('focus', setClass);
        this.newsletterField.addEventListener('focusout', unsetClass);
      }

      onBlockSelect(evt) {
        if (this.popup.contains(evt.target)) {
          this.popupActions.popupOpen();
          this.popup.classList.add(classes$3.selected);
          this.popup.parentNode.classList.add(classes$3.hasBlockSelected);
        }
      }

      onBlockDeselect(evt) {
        if (this.popup.contains(evt.target)) {
          this.popupActions.popupClose();
          this.popup.classList.remove(classes$3.selected);
          this.popup.parentNode.classList.remove(classes$3.hasBlockSelected);
        }
      }

      onUnload() {
        if (this.observer) {
          this.observer.disconnect();
        }
      }
    }

    const popupSection = {
      onLoad() {
        sections$5[this.id] = [];

        const newsletters = this.container.querySelectorAll(selectors$6.largePromo);
        newsletters.forEach((el) => {
          sections$5[this.id].push(new LargePopup(el));
        });

        const tracking = this.container.querySelectorAll(selectors$6.tracking);
        tracking.forEach((el) => {
          sections$5[this.id].push(new Tracking(el));
        });

        const newsletterPopup = this.container.querySelectorAll(selectors$6.newsletterPopup);
        newsletterPopup.forEach((el) => {
          sections$5[this.id].push(new NewsletterPopup(el));
        });

        const promoPopup = this.container.querySelectorAll(selectors$6.promoPopup);
        promoPopup.forEach((el) => {
          sections$5[this.id].push(new PromoText(el));
        });
      },

      onBlockSelect(evt) {
        sections$5[this.id].forEach((el) => {
          if (typeof el.onBlockSelect === 'function') {
            el.onBlockSelect(evt);
          }
        });
      },
      onBlockDeselect(evt) {
        sections$5[this.id].forEach((el) => {
          if (typeof el.onBlockDeselect === 'function') {
            el.onBlockDeselect(evt);
          }
        });
      },
      onSelect() {
        sections$5[this.id].forEach((el) => {
          if (typeof el.onSelect === 'function') {
            el.onSelect();
          }
        });
      },
      onDeselect() {
        sections$5[this.id].forEach((el) => {
          if (typeof el.onDeselect === 'function') {
            el.onDeselect();
          }
        });
      },
      onUnload() {
        sections$5[this.id].forEach((el) => {
          if (typeof el.onUnload === 'function') {
            el.onUnload();
          }
        });
      },
    };

    register('popups', [popupSection, newsletterCheckForResultSection]);

    const selectors$5 = {
      modal: '[data-password-modal]',
      loginErrors: '#login_form .errors',
    };

    class Password {
      constructor(section) {
        this.container = section.container;
        this.popupActions = new PopupActions(this.container.querySelector(selectors$5.modal), this.container, true, true);

        if (this.container.querySelector(selectors$5.loginErrors)) {
          this.popupActions.popupOpen();
        }
      }
    }

    const passwordSection = {
      onLoad() {
        new Password(this);
      },
    };

    register('password-template', passwordSection);

    register('list-collections', [slider, blockScroll]);

    register('columns', [blockScroll, slider]);

    register('newsletter', newsletterCheckForResultSection);

    if (!customElements.get('compare-images')) {
      customElements.define('compare-images', CompareImages);
    }

    const selectors$4 = {
      scrollToElement: '[data-scroll-to]',
      tooltip: '[data-tooltip]',
      collapsibleTrigger: '[data-collapsible-trigger]',
    };

    const attributes$3 = {
      open: 'open',
      dataScrollTo: 'data-scroll-to',
      tooltipStopMousenterValue: 'data-tooltip-stop-mouseenter',
    };

    const sections$4 = {};

    class ScrollToElement {
      constructor(section) {
        this.section = section;
        this.container = section.container;
        this.scrollToButtons = this.container.querySelectorAll(selectors$4.scrollToElement);

        if (this.scrollToButtons.length) {
          this.init();
        }
      }

      init() {
        this.scrollToButtons.forEach((element) => {
          element.addEventListener('click', () => {
            const target = this.container.querySelector(element.getAttribute(attributes$3.dataScrollTo));

            if (!target || element.tagName === 'A') return;

            this.scrollToElement(target);
          });
        });
      }

      scrollToElement(element) {
        scrollTo(element.getBoundingClientRect().top + 1);

        const collapsibleElement = element.nextElementSibling.matches('details') ? element.nextElementSibling : null;

        if (collapsibleElement) {
          const collapsibleTrigger = collapsibleElement?.querySelector(selectors$4.collapsibleTrigger);
          const isOpen = collapsibleElement.hasAttribute(attributes$3.open);

          if (!isOpen) {
            collapsibleTrigger?.dispatchEvent(new Event('click'));
          }
        }

        const tooltips = document.querySelectorAll(`${selectors$4.tooltip}:not([${attributes$3.tooltipStopMousenterValue}])`);
        if (tooltips.length) {
          tooltips.forEach((tooltip) => {
            tooltip.setAttribute(attributes$3.tooltipStopMousenterValue, '');

            setTimeout(() => {
              tooltip.removeAttribute(attributes$3.tooltipStopMousenterValue);
            }, 1000);
          });
        }
      }
    }

    const scrollToElement = {
      onLoad() {
        sections$4[this.id] = new ScrollToElement(this);
      },
    };

    const selectors$3 = {
      scrollSpy: '[data-scroll-spy]',
    };

    const classes$2 = {
      selected: 'is-selected',
    };

    const attributes$2 = {
      scrollSpy: 'data-scroll-spy',
      mobile: 'data-scroll-spy-mobile',
      desktop: 'data-scroll-spy-desktop',
      triggerPoint: 'data-scroll-trigger-point',
    };

    const sections$3 = {};

    class ScrollSpy {
      constructor(container, element) {
        this.container = container;
        this.elementToSpy = element;
        this.anchorSelector = `[${attributes$2.scrollSpy}="#${this.elementToSpy.id}"]`;
        this.anchor = this.container.querySelector(this.anchorSelector);
        this.anchorSiblings = this.container.querySelectorAll(`[${attributes$2.scrollSpy}]`);
        this.initialized = false;

        if (!this.anchor) return;

        this.triggerPoint = this.anchor.getAttribute(attributes$2.triggerPoint);

        this.scrollCallback = () => this.onScroll();
        this.toggleScrollObserver = this.toggleScrollObserver.bind(this);
        this.init();
      }

      init() {
        this.toggleScrollObserver();
        document.addEventListener('theme:resize:width', this.toggleScrollObserver);
      }

      toggleScrollObserver() {
        if (this.isEligible()) {
          if (!this.initialized) {
            document.addEventListener('theme:scroll', this.scrollCallback);
            this.initialized = true;
          }
        } else {
          document.removeEventListener('theme:scroll', this.scrollCallback);
          this.initialized = false;
        }
      }

      isEligible() {
        const isDesktopView = isDesktop();
        const isMobileView = !isDesktopView;
        return (
          (isMobileView && this.anchor.hasAttribute(attributes$2.mobile)) ||
          (isDesktopView && this.anchor.hasAttribute(attributes$2.desktop)) ||
          (!this.anchor.hasAttribute(attributes$2.desktop) && !this.anchor.hasAttribute(attributes$2.mobile))
        );
      }

      onScroll() {
        this.top = this.elementToSpy.getBoundingClientRect().top;

        // Check element's visibility in the viewport
        const windowHeight = Math.round(window.innerHeight);
        const scrollTop = Math.round(window.scrollY);
        const scrollBottom = scrollTop + windowHeight;
        const elementOffsetTopPoint = Math.round(this.top + scrollTop);
        const elementHeight = this.elementToSpy.offsetHeight;
        const elementOffsetBottomPoint = elementOffsetTopPoint + elementHeight;
        const isBottomOfElementPassed = elementOffsetBottomPoint < scrollTop;
        const isTopOfElementReached = elementOffsetTopPoint < scrollBottom;
        const isInView = isTopOfElementReached && !isBottomOfElementPassed;

        if (!isInView) return;
        if (!this.triggerPointReached()) return;

        // Update active classes
        this.anchorSiblings.forEach((anchor) => {
          if (!anchor.matches(this.anchorSelector)) {
            anchor.classList.remove(classes$2.selected);
          }
        });

        this.anchor.classList.add(classes$2.selected);
      }

      triggerPointReached() {
        let triggerPointReached = false;

        switch (this.triggerPoint) {
          case 'top':
            triggerPointReached = this.top <= 0;
            break;

          case 'middle':
            triggerPointReached = this.top <= window.innerHeight / 2;
            break;

          case 'bottom':
            triggerPointReached = this.top <= window.innerHeight;
            break;

          default:
            triggerPointReached = this.top <= 0;
        }

        return triggerPointReached;
      }

      onUnload() {
        document.removeEventListener('theme:resize:width', this.toggleScrollObserver);
        document.removeEventListener('theme:scroll', this.scrollCallback);
      }
    }

    const scrollSpy = {
      onLoad() {
        sections$3[this.id] = [];

        this.container.querySelectorAll(selectors$3.scrollSpy)?.forEach((element) => {
          const scrollSpy = this.container.querySelector(element.getAttribute(attributes$2.scrollSpy));
          sections$3[this.id].push(new ScrollSpy(this.container, scrollSpy));
        });
      },
      onUnload() {
        sections$3[this.id].forEach((section) => {
          if (typeof section.onUnload === 'function') {
            section.onUnload();
          }
        });
      },
    };

    register('sidebar', [scrollToElement, scrollSpy]);

    const selectors$2 = {
      button: '[data-hover-target]',
      image: '[data-collection-image]',
    };

    const attributes$1 = {
      target: 'data-hover-target',
    };

    const classes$1 = {
      visible: 'is-visible',
      selected: 'is-selected',
    };

    let sections$2 = {};

    class CollectionsHover {
      constructor(section) {
        this.container = section.container;
        this.buttons = this.container.querySelectorAll(selectors$2.button);

        this.init();
      }

      init() {
        if (this.buttons.length) {
          this.buttons.forEach((button) => {
            button.addEventListener('mouseenter', (e) => {
              const targetId = e.currentTarget.getAttribute(attributes$1.target);

              this.updateState(targetId);
            });
          });
        }
      }

      updateState(targetId) {
        const button = this.container.querySelector(`[${attributes$1.target}="${targetId}"]`);
        const target = this.container.querySelector(`#${targetId}:not(.${classes$1.visible})`);
        const buttonSelected = this.container.querySelector(`${selectors$2.button}.${classes$1.selected}`);
        const imageVisible = this.container.querySelector(`${selectors$2.image}.${classes$1.visible}`);

        if (target && isDesktop()) {
          imageVisible?.classList.remove(classes$1.visible);
          buttonSelected?.classList.remove(classes$1.selected);

          target.classList.add(classes$1.visible);
          button.classList.add(classes$1.selected);
        }
      }

      onBlockSelect(e) {
        this.updateState(e.target.id);
      }
    }

    const collectionsHover = {
      onLoad() {
        sections$2[this.id] = new CollectionsHover(this);
      },
      onBlockSelect(e) {
        sections$2[this.id].onBlockSelect(e);
      },
    };

    register('collections-hover', [collectionsHover, scrollSpy]);

    const selectors$1 = {
      image: '[data-featured-image]',
      imagesHolder: '[data-featured-aside]',
      contentHolder: '[data-featured-content]',
      wrapper: '[data-featured-wrapper]',
    };

    const attributes = {
      horizontalScroll: 'data-horizontal-scroll',
      horizontalScrollReversed: 'data-horizontal-scroll-reversed',
    };

    const sections$1 = {};

    class FeaturedProduct {
      constructor(section) {
        this.container = section.container;
        this.horizontalScroll = this.container.hasAttribute(attributes.horizontalScroll);
        this.horizontalScrollReversed = this.container.hasAttribute(attributes.horizontalScrollReversed);
        this.images = this.container.querySelectorAll(selectors$1.image);
        this.imagesHolder = this.container.querySelector(selectors$1.imagesHolder);
        this.contentHolder = this.container.querySelector(selectors$1.contentHolder);
        this.wrapper = this.container.querySelector(selectors$1.wrapper);
        this.requestAnimationSticky = null;
        this.lastPercent = 0;

        this.scrollEvent = () => this.scrollEvents();
        this.calculateHorizontalPositionEvent = () => this.calculateHorizontalPosition();
        this.calculateHeightEvent = () => this.calculateHeight();

        this.init();
      }

      init() {
        if (this.horizontalScroll && this.imagesHolder) {
          this.requestAnimationSticky = requestAnimationFrame(this.calculateHorizontalPositionEvent);
          document.addEventListener('theme:scroll', this.scrollEvent);
        }

        if (this.wrapper && this.contentHolder && this.images.length) {
          this.calculateHeight();

          document.addEventListener('theme:resize:width', this.calculateHeightEvent);
        }
      }

      scrollEvents() {
        if (!this.requestAnimationSticky) {
          this.requestAnimationSticky = requestAnimationFrame(this.calculateHorizontalPositionEvent);
        }
      }

      removeAnimationFrame() {
        if (this.requestAnimationSticky) {
          cancelAnimationFrame(this.requestAnimationSticky);
          this.requestAnimationSticky = null;
        }
      }

      calculateHorizontalPosition() {
        let scrollTop = window.scrollY + this.headerHeight;

        const windowBottom = scrollTop + window.innerHeight;
        const elemTop = this.imagesHolder.offsetTop;
        const elemHeight = this.imagesHolder.offsetHeight;
        const elemBottom = elemTop + elemHeight + this.headerHeight;
        const elemBottomTop = elemHeight - (window.innerHeight - this.headerHeight);
        const direction = this.horizontalScrollReversed ? 1 : -1;
        let percent = 0;

        if (scrollTop >= elemTop && windowBottom <= elemBottom) {
          percent = ((scrollTop - elemTop) / elemBottomTop) * 100;
        } else if (scrollTop < elemTop) {
          percent = 0;
        } else {
          percent = 100;
        }

        percent *= this.images.length - 1;

        this.container.style.setProperty('--translateX', `${percent * direction}%`);

        if (this.lastPercent !== percent) {
          this.requestAnimationSticky = requestAnimationFrame(this.calculateHorizontalPositionEvent);
        } else if (this.requestAnimationSticky) {
          this.removeAnimationFrame();
        }

        this.lastPercent = percent;
      }

      calculateHeight() {
        let {stickyHeaderHeight} = readHeights();
        this.container.style.removeProperty('--min-height');
        this.container.style.setProperty('--min-height', `${this.wrapper.offsetHeight + this.contentHolder.offsetHeight}px`);
        this.headerHeight = stickyHeaderHeight;
      }

      onUnload() {
        if (this.horizontalScroll && this.imagesHolder) {
          document.removeEventListener('theme:scroll', this.calculateHorizontalPositionEvent);
        }

        if (this.wrapper && this.contentHolder && this.images.length) {
          document.removeEventListener('theme:resize:width', this.calculateHeightEvent);
        }
      }
    }

    const featuredProduct = {
      onLoad() {
        sections$1[this.id] = new FeaturedProduct(this);
      },
      onUnload(e) {
        sections$1[this.id].onUnload(e);
      },
    };

    register('featured-product', [featuredProduct]);

    const selectors = {
      holder: '[data-timeline-holder]',
      rows: '[data-timeline-rows]',
      row: '[data-timeline-row]',
      rowEditor: '[data-timeline-row-editor]',
      button: '[data-timeline-button]',
      scrollElement: '[data-block-scroll]',
      headerSticky: '[data-header-sticky]',
      headerHeight: '[data-header-height]',
    };

    const classes = {
      selected: 'is-selected',
    };

    const sections = {};

    class Timeline {
      constructor(section) {
        this.container = section.container;
        this.rows = this.container.querySelectorAll(selectors.row);
        this.holder = this.container.querySelector(selectors.holder);

        if (this.rows.length < 2 || !this.holder) return;

        this.rowsWidth = 0;
        this.rowsHeight = [];
        this.holderTop = this.holder.getBoundingClientRect().top + window.scrollY;
        this.holderHeight = this.holder.offsetHeight;
        this.buttons = this.container.querySelectorAll(selectors.button);
        this.rowsHolder = this.container.querySelector(selectors.rows);
        this.requestAnimation = null;
        this.isDesktopView = isDesktop();
        this.isScrollEnabled = false;

        this.scrollEvent = (e) => this.scrollEvents(e);
        this.resizeEvent = () => this.resizeEvents();

        this.init();
      }

      init() {
        this.calculateRowsDimensions();
        this.requestAnimation = requestAnimationFrame(() => this.calculatePosition());
        if (this.isDesktopView && !this.isScrollEnabled) {
          this.isScrollEnabled = true;
          document.addEventListener('theme:scroll', this.scrollEvent);
        }
        this.rowsHolder.addEventListener('scroll', this.scrollEvent);
        document.addEventListener('theme:resize:width', this.resizeEvent);

        if (this.buttons.length) {
          this.buttons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
              e.preventDefault();
              const row = e.currentTarget.closest(selectors.row);
              if (!row) return;

              if (isDesktop()) {
                const hightestRow = Math.max(...this.rowsHeight);
                const rowHeight = this.holderHeight / this.rows.length;
                const holderTop = this.holder.getBoundingClientRect().top;
                const elementPosition = index > 0 && hightestRow < rowHeight ? rowHeight * index + holderTop : holderTop;
                const scrollPosition = elementPosition + 1;
                scrollTo(scrollPosition);
              } else {
                const padding = 16;
                const holderLeft = row.offsetLeft - padding;

                this.rowsHolder.scrollTo({
                  left: holderLeft,
                  behavior: 'smooth',
                });
              }
            });
          });
        }
      }

      resizeEvents() {
        this.holderTop = this.holder.getBoundingClientRect().top + window.scrollY;
        this.holderHeight = this.holder.offsetHeight;
        this.calculateRowsDimensions();
        this.requestAnimation = requestAnimationFrame(() => this.calculatePosition());
        const isDesktopView = isDesktop();

        if (isDesktopView && !this.isScrollEnabled) {
          this.isScrollEnabled = true;
          document.addEventListener('theme:scroll', this.scrollEvent);
        } else if (!isDesktopView && this.isScrollEnabled) {
          this.isScrollEnabled = false;
          document.removeEventListener('theme:scroll', this.scrollEvent);
        }
      }

      scrollEvents(e) {
        if (!this.requestAnimation) {
          const currentTarget = e.currentTarget;
          this.requestAnimation = requestAnimationFrame(() => this.calculatePosition(currentTarget));
        }
      }

      removeAnimationFrame() {
        if (this.requestAnimation) {
          cancelAnimationFrame(this.requestAnimation);
          this.requestAnimation = null;
        }
      }

      calculateRowsDimensions() {
        if (this.rows.length) {
          this.rowsHeight = [];
          this.rowsWidth = 0;
          let prevRowsHeight = 0;
          this.rows.forEach((row, index) => {
            this.rowsHeight.push(row.offsetHeight);
            this.rowsWidth += row.offsetWidth + parseInt(getComputedStyle(row).marginRight);

            if (window.Shopify.designMode) {
              const rowsEditor = this.container.querySelectorAll(selectors.rowEditor);
              if (rowsEditor.length) {
                prevRowsHeight += row.offsetHeight;
                rowsEditor[index]?.style.setProperty('--row-height-min', `${row.offsetHeight}px`);
                rowsEditor[index + 1]?.style.setProperty('--row-top-mobile', `${prevRowsHeight}px`);
              }
            }
          });
        }
      }

      calculatePosition(target = null) {
        this.removeAnimationFrame();
        const isDesktopView = isDesktop();
        const elementHeight = this.holderHeight / this.rows.length;
        let elementsTop = this.holderTop;
        const windowHeight = window.innerHeight;
        const windowMiddle = window.scrollY + windowHeight * 1.5;
        const outerSpace = 16; // wrapper padding using --outer CSS variable
        let mobilePercent = 0;

        if (!isDesktopView && target) {
          const targetScrollLeft = target.scrollLeft - outerSpace;
          const targetWidth = target.offsetWidth;
          mobilePercent = (targetScrollLeft / (this.rowsWidth - targetWidth)) * 100;
          this.holder.style.setProperty('--percent-mobile', `${mobilePercent}%`);
        }

        if (isDesktopView && (windowMiddle < this.holderTop || windowMiddle > this.holderTop + this.holderHeight + windowHeight)) return;

        this.rows.forEach((row, index) => {
          if (index > 0) {
            const percentRowPosition = (row.offsetLeft / this.rowsWidth) * 100;
            let selectedCheck = mobilePercent > percentRowPosition;

            if (isDesktopView) {
              selectedCheck = elementsTop + elementHeight < windowMiddle;

              if (elementsTop - elementHeight < windowMiddle) {
                row.previousElementSibling?.style.setProperty('--percent-desktop', `${((windowMiddle - elementsTop) / elementHeight) * 100}%`);
              }
            }

            row.classList.toggle(classes.selected, selectedCheck);
          }

          elementsTop += elementHeight;
        });
      }

      onUnload() {
        if (this.isScrollEnabled) {
          this.isScrollEnabled = false;
          document.removeEventListener('theme:scroll', this.scrollEvent);
        }
        this.rowsHolder.removeEventListener('scroll', this.scrollEvent);
        document.removeEventListener('theme:resize:width', this.resizeEvent);
      }

      onBlockSelect(evt) {
        const scrollElement = this.container.querySelector(selectors.scrollElement);
        if (scrollElement) {
          const target = evt.srcElement;
          const targetIndex = [...target.parentElement.children].indexOf(target);
          const row = this.rows[targetIndex];
          if (row) {
            scrollElement.scrollTo({
              top: 0,
              left: row.offsetLeft,
              behavior: 'smooth',
            });
          }
        }
      }
    }

    const timeline = {
      onLoad() {
        sections[this.id] = new Timeline(this);
      },
      onUnload(e) {
        sections[this.id].onUnload(e);
      },
      onBlockSelect(e) {
        sections[this.id].onBlockSelect(e);
      },
    };

    register('timeline', [timeline]);

    document.addEventListener('DOMContentLoaded', function () {
      // Load all registered sections on the page.
      load('*');

      // Scroll to top button
      const scrollTopButton = document.querySelector('[data-scroll-top-button]');
      if (scrollTopButton) {
        scrollTopButton.addEventListener('click', () => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
        });
        document.addEventListener('theme:scroll', () => {
          scrollTopButton.classList.toggle('is-visible', window.scrollY > window.innerHeight);
        });
      }

      if (window.self !== window.top) {
        document.querySelector('html').classList.add('iframe');
      }

      // Safari smoothscroll polyfill
      let hasNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
      if (!hasNativeSmoothScroll) {
        loadScript({url: window.theme.assets.smoothscroll});
      }
    });

    // Apply a specific class to the html element for browser support of cookies.
    if (window.navigator.cookieEnabled) {
      document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
    }

})(themeVendor.ScrollLock, themeVendor.Rellax, themeVendor.Flickity, themeVendor.FlickityFade, themeVendor.themeImages);
