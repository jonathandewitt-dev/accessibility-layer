# Thunder-Access

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

This package separates accessibility features from your scripts and templates. Basically, it comes down to a separation of concerns, for better readability and maintainability.

HTML content is machine-readable, whereas CSS styles visually present that content in a human-readable way. By the same token, accessibility features exist to present that content to the blind. In this way, you might even say these features are like styles for the blind. At this point, it's common knowledge among developers that embedding styles in HTML is a bad practice. So, why do we still do it for accessibility? Not only is it distracting to read, but it quickly becomes repetitive and difficult to maintain. We need a solution that provides an extra layer to presentation, an "accessibility layer," if you will. That's where this package comes in.

For more information and documentation, [visit the GitHub Wiki page](https://github.com/Thunder-Solutions/Thunder-Access/wiki).

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [License](#license)

## Install

```
npm i @thundersolutions/access
```

If npm is not used in your project, you can add this as a UMD module instead with the `unpkg` URL.
```html
<script src="https://unpkg.com/@thundersolutions/access/umd/addAccessibilityRules.min.js"></script>
```

## Usage

Although a lot of features are provided, there is only one exported function in the package.  It is both a named and a default export, so both of the following imports are valid, and they both import the same function.
```js
import { addAccessibilityRules } from '@thundersolutions/access'

import myFnName from '@thundersolutions/access'
```

Or, if you are not able to use native module imports:
```html
<script src="https://unpkg.com/@thundersolutions/access/umd/addAccessibilityRules.min.js"></script>
<script>
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring
  const { addAccessibilityRules } = AccessibilityLayer
</script>
```

The function accepts a configuration object as its only argument, in which you can add three properties: `rules`, `methods`, and `root`.

 * The `rules` property contains an object using CSS selectors as keys, and as values, objects are used to configure the accessibility for all elements matching that selector.  Read more about that in the [rules](https://github.com/Thunder-Solutions/Thunder-Access/wiki/2.-Rules) documentation.

 * The `methods` property contains your own custom methods which can be connected to rules.  This separation allows them to be reused by many different rules.  Learn how to use them in the [methods](https://github.com/Thunder-Solutions/Thunder-Access/wiki/3.-Methods) documentation.

 * The `root` property allows us to scope the rules to a root element, which is `document.body` by default.  Read more about this in the [root](https://github.com/Thunder-Solutions/Thunder-Access/wiki/4.-Root) documentation.

So instead of adding attributes and functionality the old fashioned way:
```html
<button
  class="menuBtn"
  aria-owns="Content"
  aria-haspopup="true"
  aria-expanded="false"
>
  <img
    class="menuIcon"
    href="bars.png"
    alt=""
    tabindex="-1"
    aria-hidden="true"
  /> Menu
</button>
<script>
  const menuBtn = document.querySelector('.menuBtn')
  const menu = document.querySelector('#Menu')
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true'
    menuBtn.setAttribute('aria-expanded', !expanded)
    menu.setAttribute('aria-hidden', expanded)
  })
</script>
```

... You can write it this way instead, by using this package:
```html
<button class="menuBtn">
  <img class="menuIcon" href="bars.png"> Menu
</button>
```
```js
addAccessibilityRules({

  methods: {
    toggleMenu: utils => utils.toggleExpanded('.menuBtn', '#Menu')
  },

  rules: {

    '.menuBtn': {
      aria: {
        owns: 'Menu',
        haspopup: true,
        expanded: false
      },
      mouse: {
        click: ['toggleMenu']
      }
    },

    '.menuIcon': {
      aria: {
        hidden: true
      },
      attr: {
        alt: '',
        tabindex: -1
      }
    }

  }
})
```

For more detailed usage, please [read the documentation](https://github.com/Thunder-Solutions/Thunder-Access/wiki/1.-Overview).

## Maintainers

[@jonathandewitt-dev](https://github.com/jonathandewitt-dev)

## License

MIT © 2020 Jonathan DeWitt
