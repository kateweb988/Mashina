
document.addEventListener("DOMContentLoaded", () => {
  class ItcTabs {
    constructor(target, config) {
      const defaultConfig = {};
      this._config = Object.assign(defaultConfig, config);
      this._elTabs = typeof target === 'string' ? document.querySelector(target) : target;
      this._elButtons = this._elTabs.querySelectorAll('.tabs__btn');
      this._elPanes = this._elTabs.querySelectorAll('.tabs__pane');
      this._eventShow = new Event('tab.itc.change');
      this._init();
      this._events();
    }
    _init() {
      this._elTabs.setAttribute('role', 'tablist');
      this._elButtons.forEach((el, index) => {
        el.dataset.index = index;
        el.setAttribute('role', 'tab');
        this._elPanes[index].setAttribute('role', 'tabpanel');
      });
    }
    show(elLinkTarget) {
      const elPaneTarget = this._elPanes[elLinkTarget.dataset.index];
      const elLinkActive = this._elTabs.querySelector('.tabs__btn_active');
      const elPaneShow = this._elTabs.querySelector('.tabs__pane_show');
      if (elLinkTarget === elLinkActive) {
        return;
      }
      elLinkActive ? elLinkActive.classList.remove('tabs__btn_active') : null;
      elPaneShow ? elPaneShow.classList.remove('tabs__pane_show') : null;
      elLinkTarget.classList.add('tabs__btn_active');
      elPaneTarget.classList.add('tabs__pane_show');
      this._elTabs.dispatchEvent(this._eventShow);
      elLinkTarget.focus();
    }
    showByIndex(index) {
      const elLinkTarget = this._elButtons[index];
      elLinkTarget ? this.show(elLinkTarget) : null;
    };
    _events() {
      this._elTabs.addEventListener('click', (e) => {
        const target = e.target.closest('.tabs__btn');
        if (target) {
          e.preventDefault();
          this.show(target);
        }
      });
    }
  }

  // инициализация .tabs как табов
  new ItcTabs('.tabs');
});
document.addEventListener("DOMContentLoaded", () => {
  var basicScrollTop = function () {
    var btnTop = document.querySelector('.text__up');
    var btnReveal = function () {
      if (window.scrollY >= 300) {
        btnTop.classList.add('is-visible');
      } else {
        btnTop.classList.remove('is-visible');
      }
    };
    window.addEventListener('scroll', btnReveal);
  };
  basicScrollTop();
});
document.addEventListener("DOMContentLoaded", () => {
  // Scrollto
  $('.go_to').click(function () { // ловим клик по ссылке с классом go_to
    var scroll_el = $(this).attr('href'); // возьмем содержимое атрибута href, должен быть селектором, т.е. например начинаться с # или .
    if ($(scroll_el).length != 0) { // проверим существование элемента чтобы избежать ошибки
      $('html, body').animate({ scrollTop: $(scroll_el).offset().top - 0 }, 800); // анимируем скроолинг к элементу scroll_el
    }
    return false; // выключаем стандартное действие
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //
  // SmoothScroll for websites v1.4.10 (Balazs Galambosi)
  // http://www.smoothscroll.net/
  //
  // Licensed under the terms of the MIT license.
  //
  // You may use it in your theme if you credit me. 
  // It is also free to use on any individual website.
  //
  // Exception:
  // The only restriction is to not publish any  
  // extension for browsers or native application
  // without getting a written permission first.
  //

  (function () {

    // Scroll Variables (tweakable)
    var defaultOptions = {

      // Scrolling Core
      frameRate: 150, // [Hz]
      animationTime: 400, // [ms]
      stepSize: 100, // [px]

      // Pulse (less tweakable)
      // ratio of "tail" to "acceleration"
      pulseAlgorithm: true,
      pulseScale: 4,
      pulseNormalize: 1,

      // Acceleration
      accelerationDelta: 50,  // 50
      accelerationMax: 3,   // 3

      // Keyboard Settings
      keyboardSupport: true,  // option
      arrowScroll: 50,    // [px]

      // Other
      fixedBackground: true,
      excluded: ''
    };

    var options = defaultOptions;


    // Other Variables
    var isExcluded = false;
    var isFrame = false;
    var direction = { x: 0, y: 0 };
    var initDone = false;
    var root = document.documentElement;
    var activeElement;
    var observer;
    var refreshSize;
    var deltaBuffer = [];
    var deltaBufferTimer;
    var isMac = /^Mac/.test(navigator.platform);

    var key = {
      left: 37, up: 38, right: 39, down: 40, spacebar: 32,
      pageup: 33, pagedown: 34, end: 35, home: 36
    };
    var arrowKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };

    /***********************************************
     * INITIALIZE
     ***********************************************/

    /**
     * Tests if smooth scrolling is allowed. Shuts down everything if not.
     */
    function initTest() {
      if (options.keyboardSupport) {
        addEvent('keydown', keydown);
      }
    }

    /**
     * Sets up scrolls array, determines if frames are involved.
     */
    function init() {

      if (initDone || !document.body) return;

      initDone = true;

      var body = document.body;
      var html = document.documentElement;
      var windowHeight = window.innerHeight;
      var scrollHeight = body.scrollHeight;

      // check compat mode for root element
      root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
      activeElement = body;

      initTest();

      // Checks if this script is running in a frame
      if (top != self) {
        isFrame = true;
      }

      /**
       * Safari 10 fixed it, Chrome fixed it in v45:
       * This fixes a bug where the areas left and right to 
       * the content does not trigger the onmousewheel event
       * on some pages. e.g.: html, body { height: 100% }
       */
      else if (isOldSafari &&
        scrollHeight > windowHeight &&
        (body.offsetHeight <= windowHeight ||
          html.offsetHeight <= windowHeight)) {

        var fullPageElem = document.createElement('div');
        fullPageElem.style.cssText = 'position:absolute; z-index:-10000; ' +
          'top:0; left:0; right:0; height:' +
          root.scrollHeight + 'px';
        document.body.appendChild(fullPageElem);

        // DOM changed (throttled) to fix height
        var pendingRefresh;
        refreshSize = function () {
          if (pendingRefresh) return; // could also be: clearTimeout(pendingRefresh);
          pendingRefresh = setTimeout(function () {
            if (isExcluded) return; // could be running after cleanup
            fullPageElem.style.height = '0';
            fullPageElem.style.height = root.scrollHeight + 'px';
            pendingRefresh = null;
          }, 500); // act rarely to stay fast
        };

        setTimeout(refreshSize, 10);

        addEvent('resize', refreshSize);

        // TODO: attributeFilter?
        var config = {
          attributes: true,
          childList: true,
          characterData: false
          // subtree: true
        };

        observer = new MutationObserver(refreshSize);
        observer.observe(body, config);

        if (root.offsetHeight <= windowHeight) {
          var clearfix = document.createElement('div');
          clearfix.style.clear = 'both';
          body.appendChild(clearfix);
        }
      }

      // disable fixed background
      if (!options.fixedBackground && !isExcluded) {
        body.style.backgroundAttachment = 'scroll';
        html.style.backgroundAttachment = 'scroll';
      }
    }

    /**
     * Removes event listeners and other traces left on the page.
     */
    function cleanup() {
      observer && observer.disconnect();
      removeEvent(wheelEvent, wheel);
      removeEvent('mousedown', mousedown);
      removeEvent('keydown', keydown);
      removeEvent('resize', refreshSize);
      removeEvent('load', init);
    }


    /************************************************
     * SCROLLING 
     ************************************************/

    var que = [];
    var pending = false;
    var lastScroll = Date.now();

    /**
     * Pushes scroll actions to the scrolling queue.
     */
    function scrollArray(elem, left, top) {

      directionCheck(left, top);

      if (options.accelerationMax != 1) {
        var now = Date.now();
        var elapsed = now - lastScroll;
        if (elapsed < options.accelerationDelta) {
          var factor = (1 + (50 / elapsed)) / 2;
          if (factor > 1) {
            factor = Math.min(factor, options.accelerationMax);
            left *= factor;
            top *= factor;
          }
        }
        lastScroll = Date.now();
      }

      // push a scroll command
      que.push({
        x: left,
        y: top,
        lastX: (left < 0) ? 0.99 : -0.99,
        lastY: (top < 0) ? 0.99 : -0.99,
        start: Date.now()
      });

      // don't act if there's a pending queue
      if (pending) {
        return;
      }

      var scrollRoot = getScrollRoot();
      var isWindowScroll = (elem === scrollRoot || elem === document.body);

      // if we haven't already fixed the behavior, 
      // and it needs fixing for this sesh
      if (elem.$scrollBehavior == null && isScrollBehaviorSmooth(elem)) {
        elem.$scrollBehavior = elem.style.scrollBehavior;
        elem.style.scrollBehavior = 'auto';
      }

      var step = function (time) {

        var now = Date.now();
        var scrollX = 0;
        var scrollY = 0;

        for (var i = 0; i < que.length; i++) {

          var item = que[i];
          var elapsed = now - item.start;
          var finished = (elapsed >= options.animationTime);

          // scroll position: [0, 1]
          var position = (finished) ? 1 : elapsed / options.animationTime;

          // easing [optional]
          if (options.pulseAlgorithm) {
            position = pulse(position);
          }

          // only need the difference
          var x = (item.x * position - item.lastX) >> 0;
          var y = (item.y * position - item.lastY) >> 0;

          // add this to the total scrolling
          scrollX += x;
          scrollY += y;

          // update last values
          item.lastX += x;
          item.lastY += y;

          // delete and step back if it's over
          if (finished) {
            que.splice(i, 1); i--;
          }
        }

        // scroll left and top
        if (isWindowScroll) {
          window.scrollBy(scrollX, scrollY);
        }
        else {
          if (scrollX) elem.scrollLeft += scrollX;
          if (scrollY) elem.scrollTop += scrollY;
        }

        // clean up if there's nothing left to do
        if (!left && !top) {
          que = [];
        }

        if (que.length) {
          requestFrame(step, elem, (1000 / options.frameRate + 1));
        } else {
          pending = false;
          // restore default behavior at the end of scrolling sesh
          if (elem.$scrollBehavior != null) {
            elem.style.scrollBehavior = elem.$scrollBehavior;
            elem.$scrollBehavior = null;
          }
        }
      };

      // start a new queue of actions
      requestFrame(step, elem, 0);
      pending = true;
    }


    /***********************************************
     * EVENTS
     ***********************************************/

    /**
     * Mouse wheel handler.
     * @param {Object} event
     */
    function wheel(event) {

      if (!initDone) {
        init();
      }

      var target = event.target;

      // leave early if default action is prevented   
      // or it's a zooming event with CTRL 
      if (event.defaultPrevented || event.ctrlKey) {
        return true;
      }

      // leave embedded content alone (flash & pdf)
      if (isNodeName(activeElement, 'embed') ||
        (isNodeName(target, 'embed') && /\.pdf/i.test(target.src)) ||
        isNodeName(activeElement, 'object') ||
        target.shadowRoot) {
        return true;
      }

      var deltaX = -event.wheelDeltaX || event.deltaX || 0;
      var deltaY = -event.wheelDeltaY || event.deltaY || 0;

      if (isMac) {
        if (event.wheelDeltaX && isDivisible(event.wheelDeltaX, 120)) {
          deltaX = -120 * (event.wheelDeltaX / Math.abs(event.wheelDeltaX));
        }
        if (event.wheelDeltaY && isDivisible(event.wheelDeltaY, 120)) {
          deltaY = -120 * (event.wheelDeltaY / Math.abs(event.wheelDeltaY));
        }
      }

      // use wheelDelta if deltaX/Y is not available
      if (!deltaX && !deltaY) {
        deltaY = -event.wheelDelta || 0;
      }

      // line based scrolling (Firefox mostly)
      if (event.deltaMode === 1) {
        deltaX *= 40;
        deltaY *= 40;
      }

      var overflowing = overflowingAncestor(target);

      // nothing to do if there's no element that's scrollable
      if (!overflowing) {
        // except Chrome iframes seem to eat wheel events, which we need to 
        // propagate up, if the iframe has nothing overflowing to scroll
        if (isFrame && isChrome) {
          // change target to iframe element itself for the parent frame
          Object.defineProperty(event, "target", { value: window.frameElement });
          return parent.wheel(event);
        }
        return true;
      }

      // check if it's a touchpad scroll that should be ignored
      if (isTouchpad(deltaY)) {
        return true;
      }

      // scale by step size
      // delta is 120 most of the time
      // synaptics seems to send 1 sometimes
      if (Math.abs(deltaX) > 1.2) {
        deltaX *= options.stepSize / 120;
      }
      if (Math.abs(deltaY) > 1.2) {
        deltaY *= options.stepSize / 120;
      }

      scrollArray(overflowing, deltaX, deltaY);
      event.preventDefault();
      scheduleClearCache();
    }

    /**
     * Keydown event handler.
     * @param {Object} event
     */
    function keydown(event) {

      var target = event.target;
      var modifier = event.ctrlKey || event.altKey || event.metaKey ||
        (event.shiftKey && event.keyCode !== key.spacebar);

      // our own tracked active element could've been removed from the DOM
      if (!document.body.contains(activeElement)) {
        activeElement = document.activeElement;
      }

      // do nothing if user is editing text
      // or using a modifier key (except shift)
      // or in a dropdown
      // or inside interactive elements
      var inputNodeNames = /^(textarea|select|embed|object)$/i;
      var buttonTypes = /^(button|submit|radio|checkbox|file|color|image)$/i;
      if (event.defaultPrevented ||
        inputNodeNames.test(target.nodeName) ||
        isNodeName(target, 'input') && !buttonTypes.test(target.type) ||
        isNodeName(activeElement, 'video') ||
        isInsideYoutubeVideo(event) ||
        target.isContentEditable ||
        modifier) {
        return true;
      }

      // [spacebar] should trigger button press, leave it alone
      if ((isNodeName(target, 'button') ||
        isNodeName(target, 'input') && buttonTypes.test(target.type)) &&
        event.keyCode === key.spacebar) {
        return true;
      }

      // [arrwow keys] on radio buttons should be left alone
      if (isNodeName(target, 'input') && target.type == 'radio' &&
        arrowKeys[event.keyCode]) {
        return true;
      }

      var shift, x = 0, y = 0;
      var overflowing = overflowingAncestor(activeElement);

      if (!overflowing) {
        // Chrome iframes seem to eat key events, which we need to 
        // propagate up, if the iframe has nothing overflowing to scroll
        return (isFrame && isChrome) ? parent.keydown(event) : true;
      }

      var clientHeight = overflowing.clientHeight;

      if (overflowing == document.body) {
        clientHeight = window.innerHeight;
      }

      switch (event.keyCode) {
        case key.up:
          y = -options.arrowScroll;
          break;
        case key.down:
          y = options.arrowScroll;
          break;
        case key.spacebar: // (+ shift)
          shift = event.shiftKey ? 1 : -1;
          y = -shift * clientHeight * 0.9;
          break;
        case key.pageup:
          y = -clientHeight * 0.9;
          break;
        case key.pagedown:
          y = clientHeight * 0.9;
          break;
        case key.home:
          if (overflowing == document.body && document.scrollingElement)
            overflowing = document.scrollingElement;
          y = -overflowing.scrollTop;
          break;
        case key.end:
          var scroll = overflowing.scrollHeight - overflowing.scrollTop;
          var scrollRemaining = scroll - clientHeight;
          y = (scrollRemaining > 0) ? scrollRemaining + 10 : 0;
          break;
        case key.left:
          x = -options.arrowScroll;
          break;
        case key.right:
          x = options.arrowScroll;
          break;
        default:
          return true; // a key we don't care about
      }

      scrollArray(overflowing, x, y);
      event.preventDefault();
      scheduleClearCache();
    }

    /**
     * Mousedown event only for updating activeElement
     */
    function mousedown(event) {
      activeElement = event.target;
    }


    /***********************************************
     * OVERFLOW
     ***********************************************/

    var uniqueID = (function () {
      var i = 0;
      return function (el) {
        return el.uniqueID || (el.uniqueID = i++);
      };
    })();

    var cacheX = {}; // cleared out after a scrolling session
    var cacheY = {}; // cleared out after a scrolling session
    var clearCacheTimer;
    var smoothBehaviorForElement = {};

    //setInterval(function () { cache = {}; }, 10 * 1000);

    function scheduleClearCache() {
      clearTimeout(clearCacheTimer);
      clearCacheTimer = setInterval(function () {
        cacheX = cacheY = smoothBehaviorForElement = {};
      }, 1 * 1000);
    }

    function setCache(elems, overflowing, x) {
      var cache = x ? cacheX : cacheY;
      for (var i = elems.length; i--;)
        cache[uniqueID(elems[i])] = overflowing;
      return overflowing;
    }

    function getCache(el, x) {
      return (x ? cacheX : cacheY)[uniqueID(el)];
    }

    //  (body)                (root)
    //         | hidden | visible | scroll |  auto  |
    // hidden  |   no   |    no   |   YES  |   YES  |
    // visible |   no   |   YES   |   YES  |   YES  |
    // scroll  |   no   |   YES   |   YES  |   YES  |
    // auto    |   no   |   YES   |   YES  |   YES  |

    function overflowingAncestor(el) {
      var elems = [];
      var body = document.body;
      var rootScrollHeight = root.scrollHeight;
      do {
        var cached = getCache(el, false);
        if (cached) {
          return setCache(elems, cached);
        }
        elems.push(el);
        if (rootScrollHeight === el.scrollHeight) {
          var topOverflowsNotHidden = overflowNotHidden(root) && overflowNotHidden(body);
          var isOverflowCSS = topOverflowsNotHidden || overflowAutoOrScroll(root);
          if (isFrame && isContentOverflowing(root) ||
            !isFrame && isOverflowCSS) {
            return setCache(elems, getScrollRoot());
          }
        } else if (isContentOverflowing(el) && overflowAutoOrScroll(el)) {
          return setCache(elems, el);
        }
      } while ((el = el.parentElement));
    }

    function isContentOverflowing(el) {
      return (el.clientHeight + 10 < el.scrollHeight);
    }

    // typically for <body> and <html>
    function overflowNotHidden(el) {
      var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
      return (overflow !== 'hidden');
    }

    // for all other elements
    function overflowAutoOrScroll(el) {
      var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
      return (overflow === 'scroll' || overflow === 'auto');
    }

    // for all other elements
    function isScrollBehaviorSmooth(el) {
      var id = uniqueID(el);
      if (smoothBehaviorForElement[id] == null) {
        var scrollBehavior = getComputedStyle(el, '')['scroll-behavior'];
        smoothBehaviorForElement[id] = ('smooth' == scrollBehavior);
      }
      return smoothBehaviorForElement[id];
    }


    /***********************************************
     * HELPERS
     ***********************************************/

    function addEvent(type, fn, arg) {
      window.addEventListener(type, fn, arg || false);
    }

    function removeEvent(type, fn, arg) {
      window.removeEventListener(type, fn, arg || false);
    }

    function isNodeName(el, tag) {
      return el && (el.nodeName || '').toLowerCase() === tag.toLowerCase();
    }

    function directionCheck(x, y) {
      x = (x > 0) ? 1 : -1;
      y = (y > 0) ? 1 : -1;
      if (direction.x !== x || direction.y !== y) {
        direction.x = x;
        direction.y = y;
        que = [];
        lastScroll = 0;
      }
    }

    if (window.localStorage && localStorage.SS_deltaBuffer) {
      try { // #46 Safari throws in private browsing for localStorage 
        deltaBuffer = localStorage.SS_deltaBuffer.split(',');
      } catch (e) { }
    }

    function isTouchpad(deltaY) {
      if (!deltaY) return;
      if (!deltaBuffer.length) {
        deltaBuffer = [deltaY, deltaY, deltaY];
      }
      deltaY = Math.abs(deltaY);
      deltaBuffer.push(deltaY);
      deltaBuffer.shift();
      clearTimeout(deltaBufferTimer);
      deltaBufferTimer = setTimeout(function () {
        try { // #46 Safari throws in private browsing for localStorage
          localStorage.SS_deltaBuffer = deltaBuffer.join(',');
        } catch (e) { }
      }, 1000);
      var dpiScaledWheelDelta = deltaY > 120 && allDeltasDivisableBy(deltaY); // win64 
      var tp = !allDeltasDivisableBy(120) && !allDeltasDivisableBy(100) && !dpiScaledWheelDelta;
      if (deltaY < 50) return true;
      return tp;
    }

    function isDivisible(n, divisor) {
      return (Math.floor(n / divisor) == n / divisor);
    }

    function allDeltasDivisableBy(divisor) {
      return (isDivisible(deltaBuffer[0], divisor) &&
        isDivisible(deltaBuffer[1], divisor) &&
        isDivisible(deltaBuffer[2], divisor));
    }

    function isInsideYoutubeVideo(event) {
      var elem = event.target;
      var isControl = false;
      if (document.URL.indexOf('www.youtube.com/watch') != -1) {
        do {
          isControl = (elem.classList &&
            elem.classList.contains('html5-video-controls'));
          if (isControl) break;
        } while ((elem = elem.parentNode));
      }
      return isControl;
    }

    var requestFrame = (function () {
      return (window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback, element, delay) {
          window.setTimeout(callback, delay || (1000 / 60));
        });
    })();

    var MutationObserver = (window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver);

    var getScrollRoot = (function () {
      var SCROLL_ROOT = document.scrollingElement;
      return function () {
        if (!SCROLL_ROOT) {
          var dummy = document.createElement('div');
          dummy.style.cssText = 'height:10000px;width:1px;';
          document.body.appendChild(dummy);
          var bodyScrollTop = document.body.scrollTop;
          var docElScrollTop = document.documentElement.scrollTop;
          window.scrollBy(0, 3);
          if (document.body.scrollTop != bodyScrollTop)
            (SCROLL_ROOT = document.body);
          else
            (SCROLL_ROOT = document.documentElement);
          window.scrollBy(0, -3);
          document.body.removeChild(dummy);
        }
        return SCROLL_ROOT;
      };
    })();


    /***********************************************
     * PULSE (by Michael Herf)
     ***********************************************/

    /**
     * Viscous fluid with a pulse for part and decay for the rest.
     * - Applies a fixed force over an interval (a damped acceleration), and
     * - Lets the exponential bleed away the velocity over a longer interval
     * - Michael Herf, http://stereopsis.com/stopping/
     */
    function pulse_(x) {
      var val, start, expx;
      // test
      x = x * options.pulseScale;
      if (x < 1) { // acceleartion
        val = x - (1 - Math.exp(-x));
      } else {     // tail
        // the previous animation ended here:
        start = Math.exp(-1);
        // simple viscous drag
        x -= 1;
        expx = 1 - Math.exp(-x);
        val = start + (expx * (1 - start));
      }
      return val * options.pulseNormalize;
    }

    function pulse(x) {
      if (x >= 1) return 1;
      if (x <= 0) return 0;

      if (options.pulseNormalize == 1) {
        options.pulseNormalize /= pulse_(1);
      }
      return pulse_(x);
    }


    /***********************************************
     * FIRST RUN
     ***********************************************/

    var userAgent = window.navigator.userAgent;
    var isEdge = /Edge/.test(userAgent); // thank you MS
    var isChrome = /chrome/i.test(userAgent) && !isEdge;
    var isSafari = /safari/i.test(userAgent) && !isEdge;
    var isMobile = /mobile/i.test(userAgent);
    var isIEWin7 = /Windows NT 6.1/i.test(userAgent) && /rv:11/i.test(userAgent);
    var isOldSafari = isSafari && (/Version\/8/i.test(userAgent) || /Version\/9/i.test(userAgent));
    var isEnabledForBrowser = (isChrome || isSafari || isIEWin7) && !isMobile;

    var supportsPassive = false;
    try {
      window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassive = true;
        }
      }));
    } catch (e) { }

    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    if (wheelEvent && isEnabledForBrowser) {
      addEvent(wheelEvent, wheel, wheelOpt);
      addEvent('mousedown', mousedown);
      addEvent('load', init);
    }


    /***********************************************
     * PUBLIC INTERFACE
     ***********************************************/

    function SmoothScroll(optionsToSet) {
      for (var key in optionsToSet)
        if (defaultOptions.hasOwnProperty(key))
          options[key] = optionsToSet[key];
    }
    SmoothScroll.destroy = cleanup;

    if (window.SmoothScrollOptions) // async API
      SmoothScroll(window.SmoothScrollOptions);

    if (typeof define === 'function' && define.amd)
      define(function () {
        return SmoothScroll;
      });
    else if ('object' == typeof exports)
      module.exports = SmoothScroll;
    else
      window.SmoothScroll = SmoothScroll;

  })();
});
document.addEventListener("DOMContentLoaded", () => {
  $('.my').change(function () {
    if ($(this).val() != '') $(this).prev().text('Выбрано файлов: ' + $(this)[0].files.length);
    else $(this).prev().text('Выберите файлы');
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const value = document.querySelector("#value")
  const input = document.querySelector("#pi_input")
  value.textContent = input.value
  input.addEventListener("input", (event) => {
    value.textContent = event.target.value
  })
});
document.addEventListener("DOMContentLoaded", () => {
  const value = document.querySelector("#value2")
  const input = document.querySelector("#pi_input2")
  value.textContent = input.value
  input.addEventListener("input", (event) => {
    value.textContent = event.target.value
  })
});
document.addEventListener("DOMContentLoaded", () => {
  const value = document.querySelector("#value3")
  const input = document.querySelector("#pi_input3")
  value.textContent = input.value
  input.addEventListener("input", (event) => {
    value.textContent = event.target.value
  })
});
document.addEventListener("DOMContentLoaded", () => {
  const rangeInputs = document.querySelectorAll('input[type="range"]')
  const numberInput = document.querySelector('input[type="number"]')

  function handleInputChange(e) {
    let target = e.target
    if (e.target.type !== 'range') {
      target = document.getElementById('range')
    }
    const min = target.min
    const max = target.max
    const val = target.value

    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
  }

  rangeInputs.forEach(input => {
    input.addEventListener('input', handleInputChange)
  })

  numberInput.addEventListener('input', handleInputChange)

});
document.addEventListener("DOMContentLoaded", () => {
  class ItcTabs {
    constructor(target, config) {
      const defaultConfig = {};
      this._config = Object.assign(defaultConfig, config);
      this._elTabs = typeof target === 'string' ? document.querySelector(target) : target;
      this._elButtons = this._elTabs.querySelectorAll('.tabs__btn');
      this._elPanes = this._elTabs.querySelectorAll('.tabs__pane');
      this._eventShow = new Event('tab.itc.change');
      this._init();
      this._events();
    }
    _init() {
      this._elTabs.setAttribute('role', 'tablist');
      this._elButtons.forEach((el, index) => {
        el.dataset.index = index;
        el.setAttribute('role', 'tab');
        this._elPanes[index].setAttribute('role', 'tabpanel');
      });
    }
    show(elLinkTarget) {
      const elPaneTarget = this._elPanes[elLinkTarget.dataset.index];
      const elLinkActive = this._elTabs.querySelector('.tabs__btn_active');
      const elPaneShow = this._elTabs.querySelector('.tabs__pane_show');
      if (elLinkTarget === elLinkActive) {
        return;
      }
      elLinkActive ? elLinkActive.classList.remove('tabs__btn_active') : null;
      elPaneShow ? elPaneShow.classList.remove('tabs__pane_show') : null;
      elLinkTarget.classList.add('tabs__btn_active');
      elPaneTarget.classList.add('tabs__pane_show');
      this._elTabs.dispatchEvent(this._eventShow);
      elLinkTarget.focus();
    }
    showByIndex(index) {
      const elLinkTarget = this._elButtons[index];
      elLinkTarget ? this.show(elLinkTarget) : null;
    };
    _events() {
      this._elTabs.addEventListener('click', (e) => {
        const target = e.target.closest('.tabs__btn');
        if (target) {
          e.preventDefault();
          this.show(target);
        }
      });
    }
  }

  // инициализация .tabs как табов
  new ItcTabs('.tabs2');
});
document.addEventListener("DOMContentLoaded", () => {
  function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#303539', controlSlider);
    if (from > to) {
      fromSlider.value = to;
      fromInput.value = to;
    } else {
      fromSlider.value = from;
    }
  }

  function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#303539', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
      toSlider.value = to;
      toInput.value = to;
    } else {
      toInput.value = from;
    }
  }

  function controlFromSlider(fromSlider, toSlider, fromInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#303539', toSlider);
    if (from > to) {
      fromSlider.value = to;
      fromInput.value = to;
    } else {
      fromInput.value = from;
    }
  }

  function controlToSlider(fromSlider, toSlider, toInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#303539', toSlider);
    setToggleAccessible(toSlider);
    if (from <= to) {
      toSlider.value = to;
      toInput.value = to;
    } else {
      toInput.value = from;
      toSlider.value = from;
    }
  }

  function getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  }

  function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max - to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
      ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
  }

  function setToggleAccessible(currentTarget) {
    const toSlider = document.querySelector('#toSlider');
    if (Number(currentTarget.value) <= 0) {
      toSlider.style.zIndex = 2;
    } else {
      toSlider.style.zIndex = 0;
    }
  }

  const fromSlider = document.querySelector('#fromSlider');
  const toSlider = document.querySelector('#toSlider');
  const fromInput = document.querySelector('#fromInput');
  const toInput = document.querySelector('#toInput');
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#303539', toSlider);
  setToggleAccessible(toSlider);

  fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
  toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
  fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
  toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);

});
window.addEventListener("DOMContentLoaded", function () {
  [].forEach.call(document.querySelectorAll('.tel'), function (input) {
    var keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___) ___ ____",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a
        });
      i = new_value.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i)
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
        function (a) {
          return "\\d{1," + a.length + "}"
        }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
      if (event.type == "blur" && this.value.length < 5) this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

});
document.addEventListener("DOMContentLoaded", () => {
  (function ($) {
    var elActive = '';
    $.fn.selectCF = function (options) {

      // option
      var settings = $.extend({
        color: "#888888", // color
        backgroundColor: "#FFFFFF", // background
        change: function () { }, // event change
      }, options);

      return this.each(function () {

        var selectParent = $(this);
        list = [],
          html = '';

        //parameter CSS
        var width = $(selectParent).width();

        $(selectParent).hide();
        if ($(selectParent).children('option').length == 0) { return; }
        $(selectParent).children('option').each(function () {
          if ($(this).is(':selected')) { s = 1; title = $(this).text(); } else { s = 0; }
          list.push({
            value: $(this).attr('value'),
            text: $(this).text(),
            selected: s,
          })
        })

        // style
        var style = " background: " + settings.backgroundColor + "; color: " + settings.color + " ";

        html += "<ul class='selectCF'>";
        html += "<li>";
        html += "<span class='arrowCF ion-chevron-right' style='" + style + "'></span>";
        html += "<span class='titleCF' style='" + style + "; width:" + width + "px'>" + title + "</span>";
        html += "<span class='searchCF' style='" + style + "; width:" + width + "px'><input style='color:" + settings.color + "' /></span>";
        html += "<ul>";
        $.each(list, function (k, v) {
          s = (v.selected == 1) ? "selected" : "";
          html += "<li value=" + v.value + " class='" + s + "'>" + v.text + "</li>";
        })
        html += "</ul>";
        html += "</li>";
        html += "</ul>";
        $(selectParent).after(html);
        var customSelect = $(this).next('ul.selectCF'); // add Html
        var seachEl = $(this).next('ul.selectCF').children('li').children('.searchCF');
        var seachElOption = $(this).next('ul.selectCF').children('li').children('ul').children('li');
        var seachElInput = $(this).next('ul.selectCF').children('li').children('.searchCF').children('input');

        // handle active select
        $(customSelect).unbind('click').bind('click', function (e) {
          e.stopPropagation();
          if ($(this).hasClass('onCF')) {
            elActive = '';
            $(this).removeClass('onCF');
            $(this).removeClass('searchActive'); $(seachElInput).val('');
            $(seachElOption).show();
          } else {
            if (elActive != '') {
              $(elActive).removeClass('onCF');
              $(elActive).removeClass('searchActive'); $(seachElInput).val('');
              $(seachElOption).show();
            }
            elActive = $(this);
            $(this).addClass('onCF');
            $(seachEl).children('input').focus();
          }
        })

        // handle choose option
        var optionSelect = $(customSelect).children('li').children('ul').children('li');
        $(optionSelect).bind('click', function (e) {
          var value = $(this).attr('value');
          if ($(this).hasClass('selected')) {
            //
          } else {
            $(optionSelect).removeClass('selected');
            $(this).addClass('selected');
            $(customSelect).children('li').children('.titleCF').html($(this).html());
            $(selectParent).val(value);
            settings.change.call(selectParent); // call event change
          }
        })

        // handle search 
        $(seachEl).children('input').bind('keyup', function (e) {
          var value = $(this).val();
          if (value) {
            $(customSelect).addClass('searchActive');
            $(seachElOption).each(function () {
              if ($(this).text().search(new RegExp(value, "i")) < 0) {
                // not item
                $(this).fadeOut();
              } else {
                // have item
                $(this).fadeIn();
              }
            })
          } else {
            $(customSelect).removeClass('searchActive');
            $(seachElOption).fadeIn();
          }
        })

      });
    };
    $(document).click(function () {
      if (elActive != '') {
        $(elActive).removeClass('onCF');
        $(elActive).removeClass('searchActive');
      }
    })
  }(jQuery));

  $(function () {
    var event_change = $('#event-change');
    $(".select").selectCF({
      change: function () {
        var value = $(this).val();
        var text = $(this).children('option:selected').html();
        console.log(value + ' : ' + text);
        event_change.html(value + ' : ' + text);
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  var accordeonButtons = document.getElementsByClassName("accordeon__button");

  //пишем событие при клике на кнопки - вызов функции toggle
  for (var i = 0; i < accordeonButtons.length; i++) {
    var accordeonButton = accordeonButtons[i];

    accordeonButton.addEventListener("click", toggleItems, false);
  }

  //пишем функцию
  function toggleItems() {

    // переменная кнопки(актульная) с классом
    var itemClass = this.className;

    // добавляем всем кнопкам класс close
    for (var i = 0; i < accordeonButtons.length; i++) {
      accordeonButtons[i].className = "accordeon__button closed";
    }

    // закрываем все открытые панели с текстом
    var pannels = document.getElementsByClassName("accordeon__panel");
    for (var z = 0; z < pannels.length; z++) {
      pannels[z].style.maxHeight = 0;
    }

    // проверка. если кнопка имеет класс close при нажатии
    // к актуальной(нажатой) кнопке добававляем активный класс
    // а панели - которая находится рядом задаем высоту
    if (itemClass == "accordeon__button closed") {
      this.className = "accordeon__button active";
      var panel = this.nextElementSibling;
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

  }
});
document.addEventListener("DOMContentLoaded", () => {
  var accordeonButtons2 = document.getElementsByClassName("accordeon__button2");

  //пишем событие при клике на кнопки - вызов функции toggle
  for (var i = 0; i < accordeonButtons2.length; i++) {
    var accordeonButton2 = accordeonButtons2[i];

    accordeonButton2.addEventListener("click", toggleItems, false);
  }

  //пишем функцию
  function toggleItems() {

    // переменная кнопки(актульная) с классом
    var itemClass2 = this.className;

    // добавляем всем кнопкам класс close
    for (var i = 0; i < accordeonButtons2.length; i++) {
      accordeonButtons2[i].className = "accordeon__button2 closed";
    }

    // закрываем все открытые панели с текстом
    var pannels2 = document.getElementsByClassName("accordeon__panel2");
    for (var z = 0; z < pannels2.length; z++) {
      pannels2[z].style.maxHeight = 0;
    }

    // проверка. если кнопка имеет класс close при нажатии
    // к актуальной(нажатой) кнопке добававляем активный класс
    // а панели - которая находится рядом задаем высоту
    if (itemClass2 == "accordeon__button2 closed") {
      this.className = "accordeon__button2 active";
      var panel2 = this.nextElementSibling;
      panel2.style.maxHeight = panel2.scrollHeight + "px";
    }

  }

});
document.addEventListener("DOMContentLoaded", () => {
  var accordeonButtons3 = document.getElementsByClassName("accordeon__button3");

  //пишем событие при клике на кнопки - вызов функции toggle
  for (var i = 0; i < accordeonButtons3.length; i++) {
    var accordeonButton3 = accordeonButtons3[i];

    accordeonButton3.addEventListener("click", toggleItems, false);
  }

  //пишем функцию
  function toggleItems() {

    // переменная кнопки(актульная) с классом
    var itemClass3 = this.className;

    // добавляем всем кнопкам класс close
    for (var i = 0; i < accordeonButtons3.length; i++) {
      accordeonButtons3[i].className = "accordeon__button3 closed";
    }

    // закрываем все открытые панели с текстом
    var pannels3 = document.getElementsByClassName("accordeon__panel3");
    for (var z = 0; z < pannels3.length; z++) {
      pannels3[z].style.maxHeight = 0;
    }

    // проверка. если кнопка имеет класс close при нажатии
    // к актуальной(нажатой) кнопке добававляем активный класс
    // а панели - которая находится рядом задаем высоту
    if (itemClass3 == "accordeon__button3 closed") {
      this.className = "accordeon__button3 active";
      var panel3 = this.nextElementSibling;
      panel3.style.maxHeight = panel3.scrollHeight + "px";
    }

  }

});
document.addEventListener("DOMContentLoaded", () => {
  var accordeonButtons4 = document.getElementsByClassName("accordeon__button4");

  //пишем событие при клике на кнопки - вызов функции toggle
  for (var i = 0; i < accordeonButtons4.length; i++) {
    var accordeonButton4 = accordeonButtons4[i];

    accordeonButton4.addEventListener("click", toggleItems, false);
  }

  //пишем функцию
  function toggleItems() {

    // переменная кнопки(актульная) с классом
    var itemClass4 = this.className;

    // добавляем всем кнопкам класс close
    for (var i = 0; i < accordeonButtons4.length; i++) {
      accordeonButtons4[i].className = "accordeon__button4 closed";
    }

    // закрываем все открытые панели с текстом
    var pannels4 = document.getElementsByClassName("accordeon__panel4");
    for (var z = 0; z < pannels4.length; z++) {
      pannels4[z].style.maxHeight = 0;
    }

    // проверка. если кнопка имеет класс close при нажатии
    // к актуальной(нажатой) кнопке добававляем активный класс
    // а панели - которая находится рядом задаем высоту
    if (itemClass4 == "accordeon__button4 closed") {
      this.className = "accordeon__button4 active";
      var panel4 = this.nextElementSibling;
      panel4.style.maxHeight = panel4.scrollHeight + "px";
    }

  }

});
document.addEventListener("DOMContentLoaded", () => {
  var accordeonButtons5 = document.getElementsByClassName("accordeon__button5");

  //пишем событие при клике на кнопки - вызов функции toggle
  for (var i = 0; i < accordeonButtons5.length; i++) {
    var accordeonButton5 = accordeonButtons5[i];

    accordeonButton5.addEventListener("click", toggleItems, false);
  }

  //пишем функцию
  function toggleItems() {

    // переменная кнопки(актульная) с классом
    var itemClass5 = this.className;

    // добавляем всем кнопкам класс close
    for (var i = 0; i < accordeonButtons5.length; i++) {
      accordeonButtons5[i].className = "accordeon__button5 closed";
    }

    // закрываем все открытые панели с текстом
    var pannels5 = document.getElementsByClassName("accordeon__panel5");
    for (var z = 0; z < pannels5.length; z++) {
      pannels5[z].style.maxHeight = 0;
    }

    // проверка. если кнопка имеет класс close при нажатии
    // к актуальной(нажатой) кнопке добававляем активный класс
    // а панели - которая находится рядом задаем высоту
    if (itemClass5 == "accordeon__button5 closed") {
      this.className = "accordeon__button5 active";
      var panel5 = this.nextElementSibling;
      panel5.style.maxHeight = panel5.scrollHeight + "px";
    }

  }

});
document.addEventListener("DOMContentLoaded", () => {
  var accordeonButtons6 = document.getElementsByClassName("accordeon__button6");

  //пишем событие при клике на кнопки - вызов функции toggle
  for (var i = 0; i < accordeonButtons6.length; i++) {
    var accordeonButton6 = accordeonButtons6[i];

    accordeonButton6.addEventListener("click", toggleItems, false);
  }

  //пишем функцию
  function toggleItems() {

    // переменная кнопки(актульная) с классом
    var itemClass6 = this.className;

    // добавляем всем кнопкам класс close
    for (var i = 0; i < accordeonButtons6.length; i++) {
      accordeonButtons6[i].className = "accordeon__button6 closed";
    }

    // закрываем все открытые панели с текстом
    var pannels6 = document.getElementsByClassName("accordeon__panel6");
    for (var z = 0; z < pannels6.length; z++) {
      pannels6[z].style.maxHeight = 0;
    }

    // проверка. если кнопка имеет класс close при нажатии
    // к актуальной(нажатой) кнопке добававляем активный класс
    // а панели - которая находится рядом задаем высоту
    if (itemClass6 == "accordeon__button6 closed") {
      this.className = "accordeon__button6 active";
      var panel6 = this.nextElementSibling;
      panel6.style.maxHeight = panel6.scrollHeight + "px";
    }

  }

});
document.addEventListener("DOMContentLoaded", () => {
  $(function () {
    $('.slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      slidesToScroll: 1,
      asNavFor: '.slider-nav',
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 1,
          }
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
          }
        },
        {
          breakpoint: 768,
          settings: {
            dots: true,
            slidesToShow: 1,
          }
        }
      ]
    });
    $('.slider-nav').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: '.slider',
      focusOnSelect: true,
      prevArrow: '<button type="button" class="slick-prev"><img src="/img/top.svg" class="old"></button>',
      nextArrow: '<button type="button" class="slick-next"><img src="/img/top.svg" class="old"></button>',
      vertical: true,
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 4,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 4,
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 4,
          }
        }
      ]
    });
  });

});
document.addEventListener("DOMContentLoaded", () => {
  //popup1
  let popupBg = document.querySelector('.popup__bg');
  let popup = document.querySelector('.popup');
  let openPopupButtons = document.querySelectorAll('.pop__buy, .card__btn, .char__btn');
  let closePopupButton = document.querySelector('.close-popup');

  openPopupButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg.classList.add('active');
      popup.classList.add('active');
    })
  });

  closePopupButton.addEventListener('click', () => {
    popupBg.classList.remove('active');
    popup.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg) {
      popupBg.classList.remove('active');
      popup.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg.classList.remove('active');
      popup.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup2
  let popupBg2 = document.querySelector('.popup__bg2');
  let popup2 = document.querySelector('.popup2');
  let openPopupButtons2 = document.querySelectorAll('.nav__call, .footer__btn');
  let closePopupButton2 = document.querySelector('.close-popup2');

  openPopupButtons2.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg2.classList.add('active');
      popup2.classList.add('active');
    })
  });

  closePopupButton2.addEventListener('click', () => {
    popupBg2.classList.remove('active');
    popup2.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg2) {
      popupBg2.classList.remove('active');
      popup2.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg2.classList.remove('active');
      popup2.classList.remove('active');
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  //popup3
  let popupBg3 = document.querySelector('.popup__bg3');
  let popup3 = document.querySelector('.popup3');
  let openPopupButtons3 = document.querySelectorAll('.pop__btn');
  let closePopupButton3 = document.querySelector('.close-popup3');

  openPopupButtons3.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      popupBg3.classList.add('active');
      popup3.classList.add('active');
    })
  });

  closePopupButton3.addEventListener('click', () => {
    popupBg3.classList.remove('active');
    popup3.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target === popupBg3) {
      popupBg3.classList.remove('active');
      popup3.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      //ваша функция закрытия окна
      popupBg3.classList.remove('active');
      popup3.classList.remove('active');
    }
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const swiper1 = new Swiper('.swiper1', {
    slidesPerView: 1,
    pagination: {
      el: ".swiper-pagination1",
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next1',
      prevEl: '.swiper-button-prev1',
    },
  });
  const swiper2 = new Swiper('.swiper2', {
    slidesPerView: 4,
    spaceBetween: 31,
    pagination: {
      el: ".swiper-pagination2",
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next2',
      prevEl: '.swiper-button-prev2',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 20,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 3
      },
      1200: {
        spaceBetween: 31,
        slidesPerView: 4,
        pagination: {
          el: ".swiper-pagination2",
          clickable: true
        }
      }
    }
  });
  const swiper24 = new Swiper('.swiper24', {
    slidesPerView: 4,
    spaceBetween: 33,
    pagination: {
      el: ".swiper-pagination24",
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next24',
      prevEl: '.swiper-button-prev24',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 20,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 3
      },
      1200: {
        spaceBetween: 33,
        slidesPerView: 4,
        pagination: {
          el: ".swiper-pagination24",
          clickable: true
        }
      }
    }
  });
  const swiper3 = new Swiper('.swiper3', {
    slidesPerView: 2,
    spaceBetween: 21,
    navigation: {
      nextEl: '.swiper-button-next3',
      prevEl: '.swiper-button-prev3',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 0,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 20,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 3
      },
      1200: {
        spaceBetween: 21,
        slidesPerView: 2
      }
    }
  });
  const swiper4 = new Swiper('.swiper4', {
    slidesPerView: 5,
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination4",
    },
    navigation: {
      nextEl: '.swiper-button-next4',
      prevEl: '.swiper-button-prev4',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 14,
        loop: true,
        slidesPerView: 3
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 3
      },
      1200: {
        spaceBetween: 10,
        slidesPerView: 5
      }
    }
  });
  const swiper5 = new Swiper('.swiper5', {
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      el: ".swiper-pagination5",
    },
    navigation: {
      nextEl: '.swiper-button-next5',
      prevEl: '.swiper-button-prev5',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 0,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 0,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 0,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 0,
        slidesPerView: 1
      }
    }
  });
  const swiper6 = new Swiper('.swiper6', {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination6",
    },
    navigation: {
      nextEl: '.swiper-button-next6',
      prevEl: '.swiper-button-prev6',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 0,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 20,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 3
      },
      1200: {
        spaceBetween: 30,
        slidesPerView: 3
      }
    }
  });
  const swiper62 = new Swiper('.swiper62', {
    slidesPerView: 4,
    spaceBetween: 21,
    pagination: {
      el: ".swiper-pagination62",
    },
    navigation: {
      nextEl: '.swiper-button-next62',
      prevEl: '.swiper-button-prev62',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 0,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 20,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 3
      },
      1200: {
        spaceBetween: 21,
        slidesPerView: 4
      }
    }
  });
  const swiper63 = new Swiper('.swiper63', {
    slidesPerView: 8,
    spaceBetween: 21,
    pagination: {
      el: ".swiper-pagination63",
    },
    navigation: {
      nextEl: '.swiper-button-next63',
      prevEl: '.swiper-button-prev63',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 20,
        loop: true,
        slidesPerView: 2
      },
      767: {
        spaceBetween: 20,
        slidesPerView: 4
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 5
      },
      1200: {
        spaceBetween: 21,
        slidesPerView: 8
      }
    }
  });
  const swiper66 = new Swiper('.swiper66', {
    slidesPerView: 3,
    spaceBetween: 40,
    pagination: {
      el: ".swiper-pagination66",
    },
    navigation: {
      nextEl: '.swiper-button-next66',
      prevEl: '.swiper-button-prev66',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 0,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 20,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 30,
        slidesPerView: 2
      },
      1200: {
        spaceBetween: 40,
        slidesPerView: 3
      }
    }
  });
  const swiper9 = new Swiper('.swiper9', {
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      el: ".swiper-pagination9",
    },
    navigation: {
      nextEl: '.swiper-button-next9',
      prevEl: '.swiper-button-prev9',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 0,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 0,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 0,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 0,
        slidesPerView: 1
      }
    }
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $(document).ready(function () {
    $("#up").on('click', function () {
      $("#incdec input").val(parseInt($("#incdec input").val()) + 1);
    });

    $("#down").on('click', function () {
      $("#incdec input").val(parseInt($("#incdec input").val()) - 1);
    });

  });
});
document.addEventListener("DOMContentLoaded", () => {
  let menuBtn = document.querySelector('.menu-btn');
  let menu = document.querySelector('.menu');
  menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active');
    menu.classList.toggle('active');
  });
});
document.addEventListener("DOMContentLoaded", () => {
  $(document).ready(function () {
    $(".youtube-link").grtyoutube({
      autoPlay: true
    });
  });

  (function ($) {

    $.fn.grtyoutube = function (options) {

      return this.each(function () {

        // Get video ID
        var getvideoid = $(this).attr("youtubeid");

        // Default options
        var settings = $.extend({
          videoID: getvideoid,
          autoPlay: true
        }, options);

        // Convert some values
        if (settings.autoPlay === true) { settings.autoPlay = 1 } else { settings.autoPlay = 0 }

        // Initialize on click
        if (getvideoid) {
          $(this).on("click", function () {
            $("body").append('<div class="grtvideo-popup">' +
              '<div class="grtvideo-popup-content">' +
              '<span class="grtvideo-popup-close">&times;</span>' +
              '<iframe class="grtyoutube-iframe" src="https://www.youtube.com/embed/' + settings.videoID + '?rel=0&wmode=transparent&autoplay=' + settings.autoPlay + '&iv_load_policy=3" allowfullscreen frameborder="0"></iframe>' +
              '</div>' +
              '</div>');
          });
        }

        // Close the box on click or escape
        $(this).on('click', function (event) {
          event.preventDefault();
          $(".grtvideo-popup-close, .grtvideo-popup").click(function () {
            $(".grtvideo-popup").remove();
          });
        });

        $(document).keyup(function (event) {
          if (event.keyCode == 27) {
            $(".grtvideo-popup").remove();
          }
        });
      });
    };
  }(jQuery));
});
// svg
$(function () {
  jQuery('img.svg').each(function () {
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function (data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');

      // Add replaced image's ID to the new SVG
      if (typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if (typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass + ' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Check if the viewport is set, else we gonna set it if we can.
      if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
        $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
      }

      // Replace image with new SVG
      $img.replaceWith($svg);

    }, 'xml');

  });
});
