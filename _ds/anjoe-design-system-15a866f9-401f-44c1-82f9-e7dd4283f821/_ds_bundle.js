/* @ds-bundle: {"format":3,"namespace":"ANJOEDesignSystem_15a866","components":[{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"Rating","sourcePath":"components/commerce/Rating.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"QuantityStepper","sourcePath":"components/forms/QuantityStepper.jsx"},{"name":"Accordion","sourcePath":"components/surfaces/Accordion.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"}],"sourceHashes":{"components/commerce/ProductCard.jsx":"90387db0dd32","components/commerce/Rating.jsx":"dae94fd6de62","components/core/Badge.jsx":"818c67c23323","components/core/Button.jsx":"af30671cb243","components/core/IconButton.jsx":"0c786b2afc7f","components/core/Tag.jsx":"a54f8a2af713","components/forms/Input.jsx":"f2f72916debc","components/forms/QuantityStepper.jsx":"0d93c0c50f32","components/surfaces/Accordion.jsx":"c85adff6b75d","components/surfaces/Card.jsx":"b393ffa73b6c","ui_kits/storefront/CartDrawer.jsx":"2d14c62cf927","ui_kits/storefront/Footer.jsx":"52d159f6d938","ui_kits/storefront/Header.jsx":"303f4aa8ebaa","ui_kits/storefront/Home.jsx":"6d5b00fddd8c","ui_kits/storefront/ProductDetail.jsx":"ea3bf7a95a59","ui_kits/storefront/products.js":"67d8b0a67f79"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ANJOEDesignSystem_15a866 = window.ANJOEDesignSystem_15a866 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/commerce/Rating.jsx
try { (() => {
/**
 * Rating — star rating with optional review count. Read-only display.
 */
function Rating({
  value = 5,
  count,
  size = 15,
  showValue = false,
  style = {}
}) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = Math.max(0, Math.min(1, value - (i - 1)));
    stars.push(/*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-block'
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "star",
      style: {
        width: size,
        height: size,
        color: 'var(--border-strong)',
        position: 'absolute',
        inset: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        inset: 0,
        width: `${fill * 100}%`,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "star",
      style: {
        width: size,
        height: size,
        color: 'var(--warning)',
        fill: 'var(--warning)'
      }
    }))));
  }
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 2
    }
  }, stars), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--ink-700)'
    }
  }, value.toFixed(1)), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-400)'
    }
  }, "(", count, ")"));
}
Object.assign(__ds_scope, { Rating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/Rating.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — small status/marketing label. Used for "New", "Best Seller",
 * "Sale", "Sold Out" on product cards and detail pages.
 */
function Badge({
  children,
  tone = 'neutral',
  // 'neutral' | 'blue' | 'blush' | 'success' | 'sale' | 'navy'
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      background: 'var(--paper-2)',
      color: 'var(--ink-500)'
    },
    blue: {
      background: 'var(--blue-100)',
      color: 'var(--blue-500)'
    },
    blush: {
      background: 'var(--blush-100)',
      color: 'var(--blush-500)'
    },
    success: {
      background: 'var(--success-bg)',
      color: 'var(--success)'
    },
    sale: {
      background: 'var(--error-bg)',
      color: 'var(--sale)'
    },
    navy: {
      background: 'var(--color-primary)',
      color: 'var(--text-on-dark)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-ui)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding: '5px 10px',
      borderRadius: 'var(--radius-sm)',
      lineHeight: 1,
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ANJOE Button — the primary call to action.
 * Navy solid by default; quiet, letter-spaced uppercase label in Jost.
 */
function Button({
  children,
  variant = 'primary',
  // 'primary' | 'secondary' | 'ghost' | 'link'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  block = false,
  disabled = false,
  type = 'button',
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '9px 16px',
      fontSize: 12,
      letterSpacing: '0.1em'
    },
    md: {
      padding: '13px 26px',
      fontSize: 13,
      letterSpacing: '0.1em'
    },
    lg: {
      padding: '17px 38px',
      fontSize: 14,
      letterSpacing: '0.12em'
    }
  };
  const base = {
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    fontFamily: 'var(--font-ui)',
    fontWeight: 500,
    textTransform: 'uppercase',
    lineHeight: 1,
    border: '1.5px solid transparent',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), opacity var(--dur-fast)',
    opacity: disabled ? 0.45 : 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'var(--color-primary)',
      color: 'var(--text-on-dark)',
      borderColor: 'var(--color-primary)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-primary)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)',
      borderColor: 'transparent'
    },
    link: {
      background: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'transparent',
      padding: 0,
      textTransform: 'none',
      letterSpacing: 0,
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? {
    primary: {
      background: 'var(--color-primary-hover)',
      borderColor: 'var(--color-primary-hover)'
    },
    secondary: {
      background: 'var(--color-primary)',
      color: 'var(--text-on-dark)'
    },
    ghost: {
      background: 'var(--blue-50)'
    },
    link: {
      opacity: 0.7
    }
  }[variant] : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle,
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon-only button — square, subtle. For header actions (search, cart, account)
 * and card overlays (wishlist, quick-add).
 */
function IconButton({
  children,
  // an icon node (Lucide <i> or svg)
  variant = 'ghost',
  // 'ghost' | 'solid' | 'outline'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  ariaLabel,
  disabled = false,
  style = {},
  ...rest
}) {
  const dims = {
    sm: 32,
    md: 40,
    lg: 48
  };
  const [hover, setHover] = React.useState(false);
  const d = dims[size];
  const variants = {
    ghost: {
      background: hover ? 'var(--blue-50)' : 'transparent',
      color: 'var(--ink-700)',
      border: '1.5px solid transparent'
    },
    solid: {
      background: hover ? 'var(--color-primary-hover)' : 'var(--color-primary)',
      color: 'var(--text-on-dark)',
      border: '1.5px solid transparent'
    },
    outline: {
      background: hover ? 'var(--blue-50)' : 'transparent',
      color: 'var(--ink-700)',
      border: '1.5px solid var(--border-subtle)'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": ariaLabel,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: d,
      height: d,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur-fast) var(--ease-standard)',
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag — pill-shaped filter / attribute chip. Used for ingredient & benefit
 * filters ("Hypoallergenic", "Plant-based") and selectable options.
 */
function Tag({
  children,
  selected = false,
  removable = false,
  onRemove,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      fontWeight: 400,
      letterSpacing: '0.01em',
      padding: '7px 14px',
      borderRadius: 'var(--radius-pill)',
      cursor: rest.onClick ? 'pointer' : 'default',
      border: '1.5px solid',
      borderColor: selected ? 'var(--color-primary)' : 'var(--border-subtle)',
      background: selected ? 'var(--color-primary)' : hover ? 'var(--blue-50)' : 'transparent',
      color: selected ? 'var(--text-on-dark)' : 'var(--ink-700)',
      transition: 'all var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), children, removable && /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    onClick: e => {
      e.stopPropagation();
      onRemove && onRemove(e);
    },
    style: {
      width: 13,
      height: 13,
      cursor: 'pointer',
      opacity: 0.7
    }
  }));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — single-line text field. Label sits above in tracked Jost caps.
 * Used in forms, newsletter signup, checkout.
 */
function Input({
  label,
  hint,
  error,
  iconLeft = null,
  type = 'text',
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? 'in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const borderColor = error ? 'var(--error)' : focus ? 'var(--blue-500)' : 'var(--border-subtle)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-500)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--white)',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      padding: '0 14px',
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-400)',
      display: 'flex'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      color: 'var(--ink-900)',
      padding: '13px 0'
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? 'var(--error)' : 'var(--ink-400)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/QuantityStepper.jsx
try { (() => {
/**
 * QuantityStepper — − / value / + control for cart & product quantity.
 */
function QuantityStepper({
  value = 1,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  // 'sm' | 'md'
  style = {}
}) {
  const h = size === 'sm' ? 34 : 44;
  const set = v => {
    const n = Math.max(min, Math.min(max, v));
    onChange && onChange(n);
  };
  const btn = {
    width: h,
    height: h,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: 'var(--ink-700)',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-ui)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      border: '1.5px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--white)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "Decrease",
    style: {
      ...btn,
      opacity: value <= min ? 0.35 : 1
    },
    onClick: () => set(value - 1)
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "minus",
    style: {
      width: 15,
      height: 15
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: size === 'sm' ? 28 : 36,
      textAlign: 'center',
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--ink-900)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Increase",
    style: {
      ...btn,
      opacity: value >= max ? 0.35 : 1
    },
    onClick: () => set(value + 1)
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 15,
      height: 15
    }
  })));
}
Object.assign(__ds_scope, { QuantityStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/QuantityStepper.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Accordion.jsx
try { (() => {
/**
 * Accordion — disclosure list for product details, ingredients, FAQ.
 * Hairline dividers, serif-free; chevron rotates on open.
 */
function Accordion({
  items = [],
  defaultOpen = -1,
  style = {}
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      borderTop: '1px solid var(--border-subtle)',
      ...style
    }
  }, items.map((it, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '18px 2px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-ui)',
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: '0.02em',
        color: 'var(--ink-900)',
        textAlign: 'left'
      }
    }, it.title, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "chevron-down",
      style: {
        width: 18,
        height: 18,
        flex: 'none',
        color: 'var(--ink-400)',
        transform: isOpen ? 'rotate(180deg)' : 'none',
        transition: 'transform var(--dur-normal) var(--ease-standard)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        maxHeight: isOpen ? 500 : 0,
        overflow: 'hidden',
        transition: 'max-height var(--dur-slow) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 2px 20px',
        fontSize: 15,
        lineHeight: 1.7,
        color: 'var(--ink-500)'
      }
    }, it.content)));
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the base surface. White, hairline border, soft cool shadow on hover
 * when interactive. Wraps product tiles, content blocks, panels.
 */
function Card({
  children,
  interactive = false,
  padding = 'md',
  // 'none' | 'sm' | 'md' | 'lg'
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const pads = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-6)',
    lg: 'var(--space-8)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: pads[padding],
      boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'box-shadow var(--dur-normal) var(--ease-out), transform var(--dur-normal) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      overflow: 'hidden',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProductCard — the storefront's core tile. Image, optional badge + wishlist,
 * product name (serif), rating, price with optional sale strikethrough, and a
 * quiet add-to-cart that appears on hover.
 */
function ProductCard({
  image,
  name,
  price,
  // string already formatted, e.g. "RM 258.00"
  compareAt,
  // optional original price -> shows strikethrough + sale
  badge,
  // { tone, label } or null
  rating,
  // number 0-5 or null
  reviewCount,
  currency = 'RM',
  onAdd,
  onWishlist,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const onSale = compareAt != null;
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    interactive: true,
    padding: "none",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '1 / 1',
      background: 'var(--blue-50)',
      overflow: 'hidden'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: hover ? 'scale(1.04)' : 'none',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink-300)',
      fontFamily: 'var(--font-wordmark)',
      letterSpacing: '0.2em',
      fontSize: 13
    }
  }, "ANJOE"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12,
      display: 'flex',
      gap: 6
    }
  }, onSale && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "sale"
  }, "Sale"), badge && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: badge.tone || 'navy'
  }, badge.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      right: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    ariaLabel: "Add to wishlist",
    size: "sm",
    style: {
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(4px)'
    },
    onClick: e => {
      e.stopPropagation();
      onWishlist && onWishlist(e);
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "heart",
    style: {
      width: 16,
      height: 16
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1
    }
  }, rating != null && /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: rating,
    count: reviewCount,
    size: 13
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 21,
      lineHeight: 1.2,
      color: 'var(--ink-900)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      marginTop: 'auto',
      paddingTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 17,
      fontWeight: 500,
      color: onSale ? 'var(--sale)' : 'var(--ink-900)'
    }
  }, price), onSale && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 14,
      color: 'var(--ink-400)',
      textDecoration: 'line-through'
    }
  }, compareAt)), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: hover ? 60 : 0,
      overflow: 'hidden',
      opacity: hover ? 1 : 0,
      transition: 'max-height var(--dur-normal) var(--ease-out), opacity var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    block: true,
    style: {
      marginTop: 10
    },
    onClick: e => {
      e.stopPropagation();
      onAdd && onAdd(e);
    }
  }, "Add to cart"))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/CartDrawer.jsx
try { (() => {
// Slide-in cart drawer.
function CartDrawer({
  open,
  items,
  products,
  onClose,
  onQty,
  onRemove
}) {
  const {
    Button,
    QuantityStepper,
    IconButton
  } = window.ANJOEDesignSystem_15a866;
  const lines = Object.entries(items).map(([id, qty]) => ({
    p: products.find(p => p.id === id),
    qty
  })).filter(l => l.p);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const freeShip = 250;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(30,41,53,0.4)',
      zIndex: 60,
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity var(--dur-normal)',
      backdropFilter: open ? 'blur(2px)' : 'none'
    }
  }), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: 'min(440px, 92vw)',
      zIndex: 70,
      background: 'var(--paper)',
      boxShadow: 'var(--shadow-lg)',
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform var(--dur-slow) var(--ease-out)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px 24px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      fontWeight: 500,
      color: 'var(--ink-900)'
    }
  }, "Your bag ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 14,
      color: 'var(--ink-400)'
    }
  }, "(", lines.reduce((s, l) => s + l.qty, 0), ")")), /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 20,
      height: 20
    }
  }))), lines.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 24px',
      background: 'var(--blue-50)',
      fontSize: 13,
      color: 'var(--ink-500)',
      textAlign: 'center',
      borderBottom: '1px solid var(--border-cool)'
    }
  }, subtotal >= freeShip ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--success)'
    }
  }, "\u2713 You\u2019ve unlocked complimentary shipping") : /*#__PURE__*/React.createElement(React.Fragment, null, "RM ", (freeShip - subtotal).toFixed(2), " away from ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink-700)'
    }
  }, "free shipping"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '8px 24px'
    }
  }, lines.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '80px 0',
      color: 'var(--ink-400)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "shopping-bag",
    style: {
      width: 34,
      height: 34,
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14
    }
  }, "Your bag is empty.")) : lines.map(({
    p,
    qty
  }) => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: 'flex',
      gap: 16,
      padding: '20px 0',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 78,
      height: 78,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--blue-50)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: p.name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      fontWeight: 500,
      color: 'var(--ink-900)',
      lineHeight: 1.2
    }
  }, p.name), /*#__PURE__*/React.createElement("button", {
    onClick: () => onRemove(p.id),
    "aria-label": "Remove",
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--ink-400)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trash-2",
    style: {
      width: 16,
      height: 16
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-400)',
      marginTop: 2
    }
  }, p.cat), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(QuantityStepper, {
    value: qty,
    onChange: n => onQty(p.id, n),
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--ink-900)'
    }
  }, window.fmtRM(p.price * qty))))))), lines.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px 26px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--ink-500)'
    }
  }, "Subtotal"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--ink-900)'
    }
  }, window.fmtRM(subtotal))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true
  }, "Checkout"), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 12,
      color: 'var(--ink-400)',
      marginTop: 14,
      marginBottom: 0
    }
  }, "Taxes & shipping calculated at checkout."))));
}
window.CartDrawer = CartDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/CartDrawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Footer.jsx
try { (() => {
// Storefront footer — newsletter + link columns.
function Footer() {
  const {
    Button,
    Input
  } = window.ANJOEDesignSystem_15a866;
  const cols = {
    Shop: ['Serums', 'Oils & Essences', 'Moisturisers', 'Gua Sha Tools', 'Gift Sets'],
    About: ['Our Story', 'Ingredients', 'Sustainability', 'Journal'],
    Care: ['Contact', 'Shipping', 'Returns', 'FAQ']
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--anjoe-navy)',
      color: 'var(--text-on-dark)',
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '72px var(--container-pad) 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(3, 1fr)',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-wordmark)',
      fontWeight: 600,
      fontSize: 26,
      letterSpacing: '0.2em',
      paddingLeft: '0.2em'
    }
  }, "ANJOE"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 14,
      lineHeight: 1.7,
      color: 'rgba(242,246,248,0.7)',
      maxWidth: 300
    }
  }, "Plant-based, dermatologically tested skincare and beauty tools \u2014 gentle enough for the most sensitive skin."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      display: 'flex',
      gap: 12
    }
  }, ['instagram', 'twitter', 'send'].map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: 'rgba(242,246,248,0.7)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": s,
    style: {
      width: 18,
      height: 18
    }
  }))))), Object.entries(cols).map(([title, items]) => /*#__PURE__*/React.createElement("div", {
    key: title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'rgba(242,246,248,0.55)',
      marginBottom: 18
    }
  }, title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: 'rgba(242,246,248,0.85)',
      textDecoration: 'none',
      fontSize: 14
    }
  }, i))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      paddingTop: 28,
      borderTop: '1px solid rgba(242,246,248,0.15)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'rgba(242,246,248,0.55)',
      letterSpacing: '0.04em'
    }
  }, "\xA9 2026 MadeByAnjoe \xB7 Raw Beaut\xE9. All rights reserved."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'rgba(242,246,248,0.55)',
      letterSpacing: '0.04em'
    }
  }, "Prices shown in Malaysian Ringgit (RM)."))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Header.jsx
try { (() => {
// Sticky storefront header — wordmark, nav, search/account/cart.
function Header({
  cartCount = 0,
  onCart,
  onHome,
  onSearch
}) {
  const {
    IconButton
  } = window.ANJOEDesignSystem_15a866;
  const links = ['Shop All', 'Serums', 'Oils', 'Tools', 'The Ritual'];
  const [scrolled, setScrolled] = React.useState(false);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'rgba(251,250,248,0.86)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--anjoe-navy)',
      color: 'var(--text-on-dark)',
      textAlign: 'center',
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      padding: '8px 16px'
    }
  }, "Complimentary shipping on orders over RM 250"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      height: 'var(--header-h)',
      padding: '0 var(--container-pad)',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 26
    }
  }, links.slice(0, 3).map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => {
      e.preventDefault();
      onHome && onHome();
    },
    style: navLink
  }, l))), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onHome && onHome();
    },
    style: {
      fontFamily: 'var(--font-wordmark)',
      fontWeight: 600,
      fontSize: 27,
      letterSpacing: '0.2em',
      color: 'var(--anjoe-navy)',
      textDecoration: 'none',
      textAlign: 'center',
      paddingLeft: '0.2em'
    }
  }, "ANJOE"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      marginRight: 14
    }
  }, links.slice(3).map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => e.preventDefault(),
    style: navLink
  }, l))), /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "Search",
    onClick: onSearch
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "search",
    style: {
      width: 19,
      height: 19
    }
  })), /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "Account"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "user",
    style: {
      width: 19,
      height: 19
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "Cart",
    onClick: onCart
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "shopping-bag",
    style: {
      width: 19,
      height: 19
    }
  })), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      right: 2,
      minWidth: 17,
      height: 17,
      padding: '0 4px',
      background: 'var(--anjoe-blush-300, #EFB8CB)',
      color: 'var(--anjoe-navy)',
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-ui)'
    }
  }, cartCount)))));
}
const navLink = {
  fontFamily: 'var(--font-ui)',
  fontSize: 13,
  fontWeight: 400,
  letterSpacing: '0.04em',
  color: 'var(--ink-700)',
  textDecoration: 'none',
  whiteSpace: 'nowrap'
};
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Home.jsx
try { (() => {
// Home — hero wash, value strip, best-seller grid, ritual band.
function Home({
  products,
  onOpen,
  onAdd
}) {
  const {
    Button,
    ProductCard,
    Badge
  } = window.ANJOEDesignSystem_15a866;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'radial-gradient(120% 130% at 28% 18%, var(--blue-200), var(--white) 52%, var(--blush-100))',
      padding: '110px var(--container-pad) 120px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-wordmark)',
      fontSize: 13,
      letterSpacing: '0.28em',
      color: 'var(--blue-500)',
      marginBottom: 22
    }
  }, "RAW BEAUT\xC9 \xB7 PLANT-BASED"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 72,
      lineHeight: 1.02,
      letterSpacing: '-0.01em',
      color: 'var(--ink-900)',
      margin: 0
    }
  }, "Skincare gentle", /*#__PURE__*/React.createElement("br", null), "enough to trust,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      color: 'var(--blue-500)'
    }
  }, "powerful"), " enough to work."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 18,
      lineHeight: 1.7,
      color: 'var(--ink-500)',
      maxWidth: 460,
      marginTop: 26
    }
  }, "Handcrafted, allergy-safe formulas made with clean, plant-based ingredients \u2014 for resilient, radiant skin."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => onOpen(products[0])
  }, "Shop best sellers"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg"
  }, "The ritual"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4/5',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: products[2].img,
    alt: products[2].name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--anjoe-navy)',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '26px var(--container-pad)',
      display: 'flex',
      justifyContent: 'space-around',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, [['leaf', '100% Plant-Based'], ['shield-check', 'Dermatologically Tested'], ['sparkles', 'Hypoallergenic'], ['truck', 'Worldwide Shipping']].map(([ic, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": ic,
    style: {
      width: 18,
      height: 18,
      color: 'var(--anjoe-blue)'
    }
  }), t)))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '96px var(--container-pad)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-wordmark)',
      fontSize: 12,
      letterSpacing: '0.26em',
      color: 'var(--blue-500)',
      marginBottom: 14
    }
  }, "THE EDIT"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 48,
      color: 'var(--ink-900)',
      margin: 0
    }
  }, "Best sellers")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 28
    }
  }, products.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    image: p.img,
    name: p.name,
    price: fmt(p.price),
    compareAt: p.compareAt ? fmt(p.compareAt) : undefined,
    rating: p.rating,
    reviewCount: p.reviews,
    badge: p.badge,
    onClick: () => onOpen(p),
    onAdd: () => onAdd(p)
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--blush-50)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '96px var(--container-pad)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '5/4',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: products[4].img,
    alt: "The ritual",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-wordmark)',
      fontSize: 12,
      letterSpacing: '0.26em',
      color: 'var(--blush-500)',
      marginBottom: 16
    }
  }, "THE WHALE RITUAL"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 44,
      lineHeight: 1.08,
      color: 'var(--ink-900)',
      margin: 0
    }
  }, "A daily moment of care, sculpted by hand."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--ink-500)',
      marginTop: 22,
      maxWidth: 440
    }
  }, "Warm a few drops of treatment oil between your palms, then glide the signature gua sha upward and outward. Two minutes to lift, de-puff and glow."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onClick: () => onOpen(products[4])
  }, "Discover the tool"))))));
}
function fmt(n) {
  return 'RM ' + n.toFixed(2);
}
window.Home = Home;
window.fmtRM = fmt;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ProductDetail.jsx
try { (() => {
// Product detail — gallery, buy box, ingredient/usage accordion.
function ProductDetail({
  product,
  onAdd,
  onBack
}) {
  const {
    Button,
    Badge,
    Rating,
    QuantityStepper,
    Accordion,
    Tag
  } = window.ANJOEDesignSystem_15a866;
  const [qty, setQty] = React.useState(1);
  const p = product;
  const onSale = p.compareAt != null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '40px var(--container-pad) 96px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      color: 'var(--ink-500)',
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: '8px 0 28px',
      letterSpacing: '0.04em'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-left",
    style: {
      width: 15,
      height: 15
    }
  }), " Back to shop"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '1/1',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      background: 'var(--blue-50)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: p.name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 14
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 76,
      height: 76,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--blue-50)',
      border: i === 0 ? '1.5px solid var(--anjoe-navy)' : '1px solid var(--border-subtle)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: i === 0 ? 1 : 0.6
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 16
    }
  }, p.badge && /*#__PURE__*/React.createElement(Badge, {
    tone: p.badge.tone
  }, p.badge.label), onSale && /*#__PURE__*/React.createElement(Badge, {
    tone: "sale"
  }, "Sale")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--ink-400)',
      marginBottom: 12
    }
  }, p.cat), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 46,
      lineHeight: 1.08,
      color: 'var(--ink-900)',
      margin: 0
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Rating, {
    value: p.rating,
    count: p.reviews,
    showValue: true,
    size: 16
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--ink-500)',
      marginTop: 20
    }
  }, p.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 22,
      flexWrap: 'wrap'
    }
  }, p.benefits.map(b => /*#__PURE__*/React.createElement(Tag, {
    key: b
  }, b))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12,
      margin: '30px 0 24px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 30,
      fontWeight: 500,
      color: onSale ? 'var(--sale)' : 'var(--ink-900)'
    }
  }, window.fmtRM(p.price)), onSale && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 19,
      color: 'var(--ink-400)',
      textDecoration: 'line-through'
    }
  }, window.fmtRM(p.compareAt))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(QuantityStepper, {
    value: qty,
    onChange: setQty
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: () => onAdd(p, qty),
    style: {
      flex: 1
    }
  }, "Add to cart \xB7 ", window.fmtRM(p.price * qty))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(Accordion, {
    defaultOpen: 0,
    items: [{
      title: 'Key ingredients',
      content: p.benefits.join(', ') + '. Cold-pressed, plant-derived actives — no parabens, sulfates or synthetic fragrance.'
    }, {
      title: 'How to use',
      content: 'Apply to clean skin morning and night. Warm between palms and press gently into the face and neck.'
    }, {
      title: 'Shipping & returns',
      content: 'Complimentary shipping over RM 250. Worldwide delivery in 5–10 days. 30-day returns on unopened items.'
    }]
  })))));
}
window.ProductDetail = ProductDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ProductDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/products.js
try { (() => {
// ANJOE catalogue — real product names, RM prices, brand CDN imagery.
window.ANJOE_PRODUCTS = [{
  id: 'serum',
  name: 'Skin Activating Antioxidant Serum',
  tagline: '30ML · Barrier-strengthening antioxidant serum',
  price: 258,
  compareAt: null,
  rating: 4.8,
  reviews: 126,
  badge: {
    tone: 'navy',
    label: 'Best Seller'
  },
  img: 'https://img.appolous.com/product/online/98/13039-skin-activating-antioxidant-serum.webp',
  cat: 'Serums',
  benefits: ['Antioxidant rich', 'Barrier repair', 'Lightweight'],
  desc: 'A featherlight serum that strengthens the skin barrier, locks in moisture and shields against environmental stress for a radiant, resilient complexion.'
}, {
  id: 'essence',
  name: 'Skin Activating Essence Water',
  tagline: '250ML · Hydrating prep essence',
  price: 198,
  compareAt: null,
  rating: 4.7,
  reviews: 88,
  badge: null,
  img: 'https://img.appolous.com/product/online/98/13040-skin-activating-essence-water-250ml.webp',
  cat: 'Essence',
  benefits: ['Deep hydration', 'Plant-based', 'Preps skin'],
  desc: 'A weightless essence water that floods skin with moisture and preps the complexion to absorb the rest of your routine.'
}, {
  id: 'mugwort',
  name: 'Mugwort Plant Treatment Oil',
  tagline: '150ML · 100% plant-based face & body oil',
  price: 189.9,
  compareAt: null,
  rating: 4.9,
  reviews: 204,
  badge: {
    tone: 'blue',
    label: 'KKM Certified'
  },
  img: 'https://img.appolous.com/product/online/98/14278-mugwort-plant-treatment-oil-150ml.webp',
  cat: 'Oils',
  benefits: ['Hypoallergenic', 'Antioxidant rich', 'Non-greasy'],
  desc: 'Made with 100% plant-based extract and dermatologically tested. Gentle on sensitive, eczema and acne-prone skin — calms, nourishes and restores from the very first use.'
}, {
  id: 'glass',
  name: 'Confirm Glass Skin',
  tagline: '50ML · Dewy finishing moisturiser',
  price: 100,
  compareAt: 123,
  rating: 4.6,
  reviews: 54,
  badge: null,
  img: 'https://img.appolous.com/product/online/98/14299-confirm-glass-skin.webp',
  cat: 'Moisturisers',
  benefits: ['Glass-skin glow', 'Lightweight', 'All-day hydration'],
  desc: 'A dewy gel-cream that seals in hydration for the coveted glass-skin finish without any greasy residue.'
}, {
  id: 'guasha',
  name: 'Sculpting Gua Sha Tool',
  tagline: 'The signature whale — lifts & de-puffs',
  price: 88,
  compareAt: null,
  rating: 4.9,
  reviews: 312,
  badge: {
    tone: 'blush',
    label: 'Iconic'
  },
  img: 'https://img.appolous.com/product/online/98/14299-confirm-glass-skin.webp',
  cat: 'Tools',
  benefits: ['Lifts & sculpts', 'Boosts circulation', 'De-puffs'],
  desc: 'The ANJOE whale, in hand. A daily facial massage ritual that lifts, sculpts and releases tension while boosting circulation for a naturally radiant glow.'
}, {
  id: 'cream',
  name: 'Skin Activating Cream',
  tagline: '50ML · Rich barrier cream',
  price: 228,
  compareAt: null,
  rating: 4.7,
  reviews: 73,
  badge: null,
  img: 'https://img.appolous.com/product/online/98/14278-mugwort-plant-treatment-oil-150ml.webp',
  cat: 'Moisturisers',
  benefits: ['Deeply nourishing', 'Barrier repair', 'Plant-based'],
  desc: 'A rich yet breathable cream that nourishes and rebuilds the skin barrier overnight for soft, supple, resilient skin.'
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/products.js", error: String((e && e.message) || e) }); }

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Rating = __ds_scope.Rating;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.QuantityStepper = __ds_scope.QuantityStepper;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Card = __ds_scope.Card;

})();
