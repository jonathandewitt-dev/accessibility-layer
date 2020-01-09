// This is for testing the final build:
import addAccessibilityRules from '../esm/addAccessibilityRules.min.mjs'

// import addAccessibilityRules from '../src/index.js'

addAccessibilityRules({

  /** Define reusable methods here, which can be linked
    * to events using the rules below.  Helpful utilities
    * for accessibility are available from the first
    * parameter, and the event itself is passed as the second.
    */
  methods: {
    toggleMenu: (utils, event) => {
      event.preventDefault()
      utils.toggleExpanded('.menuBtn', '.navigation')
      utils.toggleFocusTrap('.navigation')
    },
    focusNext: utils => utils.focus('next'),
    focusPrev: utils => utils.focus('previous'),
    focusMenuBtn: utils => utils.focus('.menuBtn'),
  },
  
  
  /** These rules operate much like CSS.  They can
    * be added or removed by just toggling the selector,
    * and they can be overridden by more specific selectors.
    * Attributes, event listeners, and other features related
    * to accessibility are applied to the matching elements,
    * instead of styles.
    */
  rules: {

    '.menuBtn': {
      aria: {
        expanded: false,
        owns: 'Nav',
      },
      keyboard: {
        Enter: ['toggleMenu', 'focusNext'],
        ArrowDown: ['toggleMenu', 'focusNext'],
      },
      mouse: {
        click: ['toggleMenu'],
      },
    },
    
    '.menuIcon': {
      aria: {
        hidden: true,
      },
      attr: {
        tabindex: -1,
        alt: '',
      },
    },

    '.navigation': {
      aria: {
        hidden: true,
      },
      screenReaderText: 'Use the left and right arrow keys to focus the top-level items in the menu.',
    },
    
    '.item' : {
      keyboard: {
        ArrowRight: ['focusNext'],
        ArrowLeft: ['focusPrev'],
        ArrowUp: ['toggleMenu', 'focusMenuBtn'],
        Escape: ['toggleMenu', 'focusMenuBtn'],
      },
    },
    
  },
})
