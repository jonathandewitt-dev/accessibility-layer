import { getElementState, updateElementState } from './domState.js'

export default element => {

  const elementState = getElementState(element)
  const { rules, screenReaderElement } = elementState
  const selectors = Object.keys(rules).reverse()
  const ruleSelector = selectors.find(selector =>
    element.matches(selector) && typeof rules[selector].screenReaderText === 'string')
  if (!ruleSelector) return screenReaderElement && screenReaderElement.remove()
  const {screenReaderText} = rules[ruleSelector]

  // this will initially create an element and set the style as needed
  const createScreenReaderElement = () => {
    const span = document.createElement('span')
    span.style = 'position:absolute;z-index:-9999999;opacity:0;'
    return span
  }
  
  // store the screen reader element as part of the element state
  updateElementState(element, elementState => {
    elementState.screenReaderElement = 
      elementState.screenReaderElement || createScreenReaderElement()
    return elementState
  })

  // apply text content and push to DOM
  elementState.screenReaderElement.remove()
  elementState.screenReaderElement.textContent = screenReaderText
  element.insertBefore(elementState.screenReaderElement, element.firstChild)
}
