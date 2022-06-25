'use strict';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$1 = {
  props: {
    digit: {
      type: [Number, String],
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    // 透传props
    digits: [Number, String],
    fontSize: [Number, String],
    color: String,
    bgColor: String,
    duration: Number,
    reverse: Boolean
  },
  computed: {
    animationIterationCount: function animationIterationCount() {
      if (this.reverse) {
        return this.duration / 0.1 * (this.index + 1);
      }

      return ("".concat(this.digits).length - this.index) * this.duration / 0.1;
    },
    digitItemStyle: function digitItemStyle() {
      return {
        backgroundColor: this.bgColor,
        color: this.color,
        fontSize: "".concat(this.fontSize, "px")
      };
    },
    scrollListStyle: function scrollListStyle() {
      return {
        animationIterationCount: this.animationIterationCount
      };
    },
    realDigitStyle: function realDigitStyle() {
      return _objectSpread2(_objectSpread2({}, this.digitStyle), {}, {
        animationIterationCount: this.animationIterationCount
      });
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "digit-item", style: _vm.digitItemStyle }, [
    _c("div", { staticClass: "scroll-area" }, [
      _c("div", { staticClass: "scroll-list", style: _vm.scrollListStyle }, [
        _c("div", { staticClass: "item" }, [_vm._v("0")]),
        _vm._v(" "),
        _c("div", { staticClass: "item" }, [_vm._v("1")]),
        _vm._v(" "),
        _c("div", { staticClass: "item" }, [_vm._v("2")]),
        _vm._v(" "),
        _c("div", { staticClass: "item" }, [_vm._v("3")]),
        _vm._v(" "),
        _c("div", { staticClass: "item" }, [_vm._v("4")]),
        _vm._v(" "),
        _c("div", { staticClass: "item" }, [_vm._v("5")]),
        _vm._v(" "),
        _c("div", { staticClass: "item" }, [_vm._v("6")]),
        _vm._v(" "),
        _c("div", { staticClass: "item" }, [_vm._v("7")]),
        _vm._v(" "),
        _c("div", { staticClass: "item" }, [_vm._v("8")]),
        _vm._v(" "),
        _c("div", { staticClass: "item" }, [_vm._v("9")]),
      ]),
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "real-digit", style: _vm.realDigitStyle }, [
      _vm._v("\n    " + _vm._s(_vm.digit) + "\n  "),
    ]),
  ])
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-70853b00_0", { source: "\n@keyframes scrollDigit-data-v-70853b00 {\n0% { transform: translateY(0); visibility: visible;\n}\n10% { transform: translateY(-10%); visibility: visible;\n}\n20% { transform: translateY(-20%); visibility: visible;\n}\n30% { transform: translateY(-30%); visibility: visible;\n}\n40% { transform: translateY(-40%); visibility: visible;\n}\n50% { transform: translateY(-50%); visibility: visible;\n}\n60% { transform: translateY(-60%); visibility: visible;\n}\n70% { transform: translateY(-70%); visibility: visible;\n}\n80% { transform: translateY(-80%); visibility: visible;\n}\n90% { transform: translateY(-90%); visibility: visible;\n}\n100% { transform: translateY(-100%); visibility: visible;\n}\n}\n@keyframes realDigit-data-v-70853b00 {\n0% { visibility: hidden;\n}\n99% { visibility: hidden;\n}\n100% { visibility: visible;\n}\n}\n.digit-item[data-v-70853b00] {\n  display: inline-block;\n  position: relative;\n  text-align: center;\n}\n.scroll-area[data-v-70853b00] {\n  position: absolute;\n  overflow: hidden;\n  height: 100%;\n}\n.scroll-list[data-v-70853b00] {\n  animation: scrollDigit-data-v-70853b00 .1s ease-out alternate;\n  visibility: hidden;\n}\n.real-digit[data-v-70853b00] {\n  text-align: center;\n  animation: realDigit-data-v-70853b00 .1s ease-out;\n}\n", map: {"version":3,"sources":["E:\\Code\\vue-scroll-digit\\src\\vue-scroll-digit\\Digit.vue"],"names":[],"mappings":";AAuEA;AACA,KAAA,wBAAA,EAAA,mBAAA;AAAA;AACA,MAAA,2BAAA,EAAA,mBAAA;AAAA;AACA,MAAA,2BAAA,EAAA,mBAAA;AAAA;AACA,MAAA,2BAAA,EAAA,mBAAA;AAAA;AACA,MAAA,2BAAA,EAAA,mBAAA;AAAA;AACA,MAAA,2BAAA,EAAA,mBAAA;AAAA;AACA,MAAA,2BAAA,EAAA,mBAAA;AAAA;AACA,MAAA,2BAAA,EAAA,mBAAA;AAAA;AACA,MAAA,2BAAA,EAAA,mBAAA;AAAA;AACA,MAAA,2BAAA,EAAA,mBAAA;AAAA;AACA,OAAA,4BAAA,EAAA,mBAAA;AAAA;AACA;AAEA;AACA,KAAA,kBAAA;AAAA;AACA,MAAA,kBAAA;AAAA;AACA,OAAA,mBAAA;AAAA;AACA;AAEA;EACA,qBAAA;EACA,kBAAA;EACA,kBAAA;AACA;AACA;EACA,kBAAA;EACA,gBAAA;EACA,YAAA;AACA;AACA;EACA,6DAAA;EACA,kBAAA;AACA;AACA;EACA,kBAAA;EACA,iDAAA;AACA","file":"Digit.vue","sourcesContent":["<template>\n  <div class=\"digit-item\" :style=\"digitItemStyle\">\n    <div class=\"scroll-area\">\n      <div class=\"scroll-list\" :style=\"scrollListStyle\">\n        <div class=\"item\">0</div>\n        <div class=\"item\">1</div>\n        <div class=\"item\">2</div>\n        <div class=\"item\">3</div>\n        <div class=\"item\">4</div>\n        <div class=\"item\">5</div>\n        <div class=\"item\">6</div>\n        <div class=\"item\">7</div>\n        <div class=\"item\">8</div>\n        <div class=\"item\">9</div>\n      </div>\n    </div>\n    <div class=\"real-digit\" :style=\"realDigitStyle\">\n      {{ digit }}\n    </div>\n  </div>\n</template>\n\n<script>\nexport default {\n  props: {\n    digit: {\n      type: [Number, String],\n      required: true\n    },\n    index: {\n      type: Number,\n      required: true\n    },\n    // 透传props\n    digits: [Number, String],\n    fontSize: [Number, String],\n    color: String,\n    bgColor: String,\n    duration: Number,\n    reverse: Boolean\n  },\n  computed: {\n    animationIterationCount() {\n      if (this.reverse) {\n        return this.duration / 0.1 * (this.index + 1)\n      }\n      return (`${this.digits}`.length - this.index) * this.duration / 0.1\n    },\n    digitItemStyle() {\n      return {\n        backgroundColor: this.bgColor,\n        color: this.color,\n        fontSize: `${this.fontSize}px`,\n      }\n    },\n    scrollListStyle() {\n      return {\n        animationIterationCount: this.animationIterationCount,\n      }\n    },\n    realDigitStyle() {\n      return {\n        ...this.digitStyle,\n        animationIterationCount: this.animationIterationCount\n      }\n    }\n  }\n}\n</script>\n\n<style scoped>\n@keyframes scrollDigit {\n  0% { transform: translateY(0); visibility: visible; }\n  10% { transform: translateY(-10%); visibility: visible; }\n  20% { transform: translateY(-20%); visibility: visible; }\n  30% { transform: translateY(-30%); visibility: visible; }\n  40% { transform: translateY(-40%); visibility: visible; }\n  50% { transform: translateY(-50%); visibility: visible; }\n  60% { transform: translateY(-60%); visibility: visible; }\n  70% { transform: translateY(-70%); visibility: visible; }\n  80% { transform: translateY(-80%); visibility: visible; }\n  90% { transform: translateY(-90%); visibility: visible; }\n  100% { transform: translateY(-100%); visibility: visible; }\n}\n\n@keyframes realDigit {\n  0% { visibility: hidden; }\n  99% { visibility: hidden; }\n  100% { visibility: visible; }\n}\n\n.digit-item {\n  display: inline-block;\n  position: relative;\n  text-align: center;\n}\n.scroll-area {\n  position: absolute;\n  overflow: hidden;\n  height: 100%;\n}\n.scroll-list {\n  animation: scrollDigit .1s ease-out alternate;\n  visibility: hidden;\n}\n.real-digit {\n  text-align: center;\n  animation: realDigit .1s ease-out;\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = "data-v-70853b00";
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    createInjector,
    undefined,
    undefined
  );

//
var script = {
  components: {
    Digit: __vue_component__$1
  },
  props: {
    digits: {
      type: [Number, String],
      required: true
    },
    fontSize: {
      type: Number,
      default: 26
    },
    // 最先翻滚的字符，滚动时常
    duration: {
      type: Number,
      default: 0.2
    },
    color: String,
    bgColor: String,
    reverse: Boolean // 默认从右往左滚动，reverse为true则从左往右滚动

  },
  computed: {
    digitArray: function digitArray() {
      return "".concat(this.digits).split('');
    }
  }
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "scroll-digit" },
    _vm._l(_vm.digitArray, function (item, index) {
      return _c(
        "div",
        { key: _vm.digits + "_" + index },
        [
          _c(
            "Digit",
            _vm._b(
              { attrs: { digit: item, index: index } },
              "Digit",
              _vm.$props,
              false
            )
          ),
        ],
        1
      )
    }),
    0
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-7ed00dc0_0", { source: "\n.scroll-digit[data-v-7ed00dc0] {\n  display: inline-block;\n}\n.scroll-digit > div[data-v-7ed00dc0] {\n  display: inline-block;\n}\n", map: {"version":3,"sources":["E:\\Code\\vue-scroll-digit\\src\\vue-scroll-digit\\Index.vue"],"names":[],"mappings":";AA0CA;EACA,qBAAA;AACA;AACA;EACA,qBAAA;AACA","file":"Index.vue","sourcesContent":["<template>\n  <div class=\"scroll-digit\">\n    <div v-for=\"(item, index) in digitArray\" :key=\"`${digits}_${index}`\">\n      <Digit :digit=\"item\" :index=\"index\" v-bind=\"$props\" />\n    </div>\n  </div>\n</template>\n\n<script>\nimport Digit from './Digit.vue'\n\nexport default {\n  components: {\n    Digit\n  },\n  props: {\n    digits: {\n      type: [Number, String],\n      required: true\n    },\n    fontSize: {\n      type: Number,\n      default: 26\n    },\n    // 最先翻滚的字符，滚动时常\n    duration: {\n      type: Number,\n      default: 0.2\n    },\n    color: String,\n    bgColor: String,\n    reverse: Boolean // 默认从右往左滚动，reverse为true则从左往右滚动\n  },\n  computed: {\n    digitArray() {\n      return `${this.digits}`.split('')\n    }\n  },\n}\n</script>\n\n<style scoped >\n.scroll-digit {\n  display: inline-block;\n}\n.scroll-digit > div {\n  display: inline-block;\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-7ed00dc0";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

module.exports = __vue_component__;
