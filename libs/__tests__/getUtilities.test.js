import getUtilities from '../getUtilities.js'

// mock page content
document.body.innerHTML = /*html*/`
  <button class="toggleBtn" aria-expanded="true">Test Button</button>
  <div class="root" aria-hidden="false">
    <a class="link" href="#">Test 1</a>
    <a class="link" href="#">Test 2</a>
  </div>
`
const toggleBtn = document.querySelector('.toggleBtn')
const rootEl = document.querySelector('.root')
const linkEls = document.querySelectorAll('.link')
const {focus, toggleExpanded, getExpanded, toggleFocusTrap} = getUtilities(rootEl)

describe('Public utilities for dev-defined methods', () => {

  it('focuses as expected with the provided option', () => {
    focus(toggleBtn)
    expect(document.activeElement).toEqual(toggleBtn)

    focus('.link')
    expect(document.activeElement).toEqual(linkEls[0])

    focus('next')
    expect(document.activeElement).toEqual(linkEls[1])

    focus('previous')
    expect(document.activeElement).toEqual(linkEls[0])
  })

  it('toggles parent and child between expanded/hidden', () => {

    // make sure the getExpanded method works
    expect(getExpanded(toggleBtn)).toBe(true)
    toggleExpanded('.toggleBtn', '.root')
    expect(getExpanded(toggleBtn)).toBe(false)

    // make sure the attributes themselves reflect the toggled state
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('false')
    expect(rootEl.getAttribute('aria-hidden')).toBe('true')
  })

  it('toggles the focus trap on an item', () => {
    const getTabbableElements = () => {
      const tabbableElements = []
      const allAs = document.querySelectorAll('a:not([tabindex="-1"])')
      const button = document.querySelector('button:not([tabindex="-1"])')
      if (allAs) allAs.forEach(a => tabbableElements.push(a))
      if (button) tabbableElements.push(button)
      return tabbableElements
    }
    const expectedTabbableElements = [...linkEls]

    toggleFocusTrap(rootEl)
    expect(getTabbableElements()).toEqual(expectedTabbableElements)

    expectedTabbableElements.push(toggleBtn)

    toggleFocusTrap(rootEl)
    expect(getTabbableElements()).toEqual(expectedTabbableElements)
  })

})