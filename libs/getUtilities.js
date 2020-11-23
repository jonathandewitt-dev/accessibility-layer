import { checkSelectorValidity, getTabbableElements, getRoot, logError } from './utilities.js'

// focus utility with common options
const focus = option => {

  // handle an element if it was passed
  if (option instanceof HTMLElement) return option.focus()

  // make sure the option is a string if not an element
  if (option.constructor !== String) return logError('the `focus()` method expects either an element or a string.')

  // get all tabbable elements for reference
  const tabbableElements = getTabbableElements()
  const currentIndex = tabbableElements
    .findIndex(e => e === document.activeElement)
  const finalIndex = tabbableElements.length - 1

  // handle keywords
  switch(option) {
    case 'next':
      const nextIndex =
        currentIndex < finalIndex ? currentIndex + 1 : 0
      tabbableElements[nextIndex].focus()
      break
    case 'previous':
      const prevIndex =
        currentIndex > 0 ? currentIndex - 1 : finalIndex
      tabbableElements[prevIndex].focus()
      break
    case 'off':
      document.activeElement.blur()
      break
  }
  if (['next', 'previous', 'off'].includes(option)) return

  // handle selectors
  if (checkSelectorValidity(option))
    getRoot().querySelector(option).focus()
}

// expand utility using aria-expanded and aria-hidden
const toggleExpanded = (parentSelector, childSelector, override) => {
  const root = getRoot()
  const parentItem = root.querySelector(parentSelector)
  const childItem = root.querySelector(childSelector)
  const expandValue =
        override !== undefined ?
        override :
        !!parentItem && parentItem.getAttribute('aria-expanded') === 'true'
  if (parentItem) parentItem.setAttribute('aria-expanded', !expandValue)
  else console.error('Error expanding the element: No parent item matched the selector.')
  if (childItem) childItem.setAttribute('aria-hidden', expandValue)
  else console.error('Error expanding the element: No child item matched the selector.')
}

// utility for the user to get the expanded state of a popup item
const getExpanded = item => {
  const element =
    typeof item === 'string' ?
    checkSelectorValidity(item) &&
    root.querySelector(item) :
    item
  return element.getAttribute('aria-expanded') === 'true'
}

// use this for tracking focus traps, add/restore focusability
const focusTrap = {
  externalElements: new Map(),
  parentElement: null,
  isTrapped: false,
}

// focus trap utility
const toggleFocusTrap = (item, override) => {
  focusTrap.parentElement =
    typeof item === 'string' ?
    checkSelectorValidity(item) &&
    getRoot().querySelector(item) :
    item
  
  // filter out all the tabbable elements within the givin scope
  const tabbableElements = getTabbableElements()
  const externalElements =
    !!focusTrap.parentElement
    ? tabbableElements.filter(el => !focusTrap.parentElement.contains(el)) 
    : console.error('Error applying focus trap: No element matched the selector.') || []
  
  // restore previously saved tabindexes to their original values
  const exEls = focusTrap.externalElements
  exEls.forEach((tabindex, el) => {
    if (tabindex !== null) el.setAttribute('tabindex', tabindex)
    else el.removeAttribute('tabindex')
    exEls.delete(el)
  })
  
  // boolean for whether to trap focus or not
  const trapFocus =
    override !== undefined ?
    override :
    !focusTrap.isTrapped
  
  // set all elements outside the given scope to tabindex -1
  // (store current tabindexes so they can be restored later)
  if (trapFocus) externalElements.forEach(el => {
    focusTrap.externalElements.set(el, el.getAttribute('tabindex'))
    el.setAttribute('tabindex', '-1')
  })
  focusTrap.isTrapped = trapFocus
}

// return all utility methods using the passed element as the default
export default element => ({
  focus,
  toggleExpanded,
  getExpanded: (item = element) => getExpanded(item),
  toggleFocusTrap: (item = element) => toggleFocusTrap(item),
})
