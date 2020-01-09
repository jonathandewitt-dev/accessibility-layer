import { getElementState, updateElementState } from '../domState.js'

// mock page content
document.body.innerHTML = /*html*/`
  <div class="root">
    <div class="test">Test 1</div>
    <div class="test">Test 2</div>
  </div>
`

// mock mutation observer
class MutationObserver {
  constructor(fn) {
    this.fn = fn
  }
}

describe('DOM State', () => {
  const rootEl = document.querySelector('.root')
  const testEls = document.querySelectorAll('.test')

  it('creates a blank state if none is found', () => {
    const expectedState = {
      inlineAttributes: Array.from(rootEl.attributes),
      attributeObserver: null,
      screenReaderElement: null,
      methods: {},
      rules: {},
    }
    const elementState = getElementState(rootEl)
    expect(elementState).toEqual(expectedState)
  })

  it('updates the state', () => {
    rootEl.setAttribute('id', 'root')

    const expectedState = {
      inlineAttributes: Array.from(rootEl.attributes),
      attributeObserver: new MutationObserver(() => {}),
      screenReaderElement: testEls[0],
      methods: {
        test: () => {},
      },
      rules: {
        '.test': {
          attr: {
            tabindex: 0,
          }
        },
      },
    }

    updateElementState(rootEl, elementState => {
      elementState.inlineAttributes = Array.from(rootEl.attributes)
      elementState.attributeObserver = new MutationObserver(() => {})
      elementState.screenReaderElement = testEls[0]
      elementState.methods.test = () => {}
      elementState.rules['.test'] = {
        attr: {
          tabindex: 0,
        },
      }
      return elementState
    })

    const updatedState = getElementState(rootEl)
    expect(JSON.stringify(updatedState))
      .toBe(JSON.stringify(expectedState))
  })
})