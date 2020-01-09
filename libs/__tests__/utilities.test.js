import { checkSelectorValidity, getTabbableElements, Events, rootObj, getRoot, swapAndPop } from '../utilities.js'

// mock a template with both tabbable and nontabbable elements
document.body.innerHTML = /*html*/`
  <a class="tabbable">normal anchor</a>
  <a disabled>disabled anchor</a>
  <a tabindex="-1">untabbable anchor</a>

  <button class="tabbable">normal button</button>
  <button disabled>disabled button</button>
  <button tabindex="-1">untabbable button</button>

  <input class="tabbable">
  <input disabled>
  <input tabindex="-1">

  <div class="tabbable" tabindex="0">tabbable div</div>
  <div>normal div</div>
`

describe('Private utilities used within the source code only', () => {

  it('checks to make sure the given selector is valid', () => {
    const validSelectors = [
      '.item',
      '#Item',
      '[class="item"]',
      '.parent > .child',
      '.parent .child',
      'div',
    ]
    const invalidSelectors = [
      document.querySelector('a'),
      null,
      undefined,
      '&item',
      '%item',
      '123',
    ]
    validSelectors.forEach(validSelector => {
      const validity = checkSelectorValidity(validSelector)
      expect(validity).toBe(true)
    })
    invalidSelectors.forEach(invalidSelector => {
      const validity = checkSelectorValidity(invalidSelector)
      expect(validity).toBe(false)
    })
  })

  it('returns only the tabbable elements on the page', () => {
    const tabbableElements = [...document.querySelectorAll('.tabbable')]
    const tabbableElementsFromFunc = getTabbableElements()
    expect(tabbableElementsFromFunc).toEqual(tabbableElements)
  })

  it('adds event objects to the "add queue"', () => {
    Events.add('a', 'click', () => {})
    Events.add('button', 'focus', () => {})
    const expectedAddQueue = [
      {selector: 'a', event: 'click', listener: () => {}},
      {selector: 'button', event: 'focus', listener: () => {}},
    ]
    expect(JSON.stringify(Events._listeners.addQueue))
      .toBe(JSON.stringify(expectedAddQueue))
  })

  it('adds selectors to the "remove queue"', () => {
    Events.removeAll('a')
    Events.removeAll('button')
    const expectedRemoveQueue = ['a', 'button']
    expect(JSON.stringify(Events._listeners.removeQueue))
      .toBe(JSON.stringify(expectedRemoveQueue))
  })

  it('processes everything in both queues', () => {
    const expectedCurrent = new Map()
    const checkExpected = () => {
      expect(JSON.stringify(Events._listeners.current))
        .toBe(JSON.stringify(expectedCurrent))
      expect(Events._listeners.addQueue).toEqual([])
      expect(Events._listeners.removeQueue).toEqual([])
    }

    expectedCurrent.set('a', [
      {event: 'click', listener: () => {}}
    ])
    expectedCurrent.set('a', [
      {event: 'focus', listener: () => {}}
    ])
    expectedCurrent.set('button', [
      {event: 'focus', listener: () => {}}
    ])

    // check after adding
    Events.add('a', 'click', () => {})
    Events.add('a', 'focus', () => {})
    Events.add('button', 'focus', () => {})
    Events.update()
    checkExpected()
    
    expectedCurrent.set('a', [])

    // check after removing
    Events.removeAll('a')
    Events.update()
    checkExpected()

    // make sure adding and removing cancels each other out
    Events.add('button', 'focus', () => {})
    Events.removeAll('button')
    Events.update()
    checkExpected()
  })

  it('returns the root object', () => {
    expect(getRoot()).toBe(document.body)
    const a = document.querySelector('a')
    rootObj.element = a
    expect(getRoot()).toBe(a)
  })

  it('removes one item from an array without creating a hole', () => {
    const arr = [1, 2, 3]
    swapAndPop(arr, 1)
    expect(arr).toEqual([1, 3])
  })

})
