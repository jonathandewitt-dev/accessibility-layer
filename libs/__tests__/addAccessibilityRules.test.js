import addAccessibilityRules, { ruleUtilities } from '../addAccessibilityRules.js'
import MutationObserver from 'mutation-observer'

document.body.innerHTML = /*html*/`
  <header class="header">
    <button class="menuBtn">
      <img class="menuIcon" src="https://tinyurl.com/ku53p9g" /> MENU
    </button>
    <nav class="navigation" id="Nav">
      <a class="item" href="#">Child Item</a>
      <a class="item" href="#">Child Item</a>
      <a class="item" href="#">Child Item</a>
      <a class="item" href="#">Child Item</a>
    </nav>
  </header>
`

describe('Add Accessibility Rules', () => {

  beforeAll(() => {
    global.MutationObserver = MutationObserver

    addAccessibilityRules({

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
  })

  it('adds observer to the root element', () => {
    expect(ruleUtilities.observer).toBeTruthy()
  })
  
})