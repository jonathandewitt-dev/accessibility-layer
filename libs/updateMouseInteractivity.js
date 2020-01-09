import { Events } from './utilities.js'
import getUtilities from './getUtilities.js'
import { getElementState } from './domState.js'

export default (element) => {
  const {rules, methods} = getElementState(element)

  Object.keys(rules).forEach(selector => {
    Events.removeAll(selector)

    if (!element.matches(selector)) return
    const {mouse} = rules[selector]
    if (!mouse) return

    // evaluate the mouse configuration
    const utils = getUtilities(element)
    const {click, enter, leave} = mouse

    const addMouseEvent = (methodKeys, eventStr) => {
      Events.add(selector, eventStr, event => {
        methodKeys.forEach(methodKey => methods[methodKey](utils, event))
      })
    }

    if (click) addMouseEvent(click, 'click')
    if (enter) addMouseEvent(enter, 'mouseenter')
    if (leave) addMouseEvent(leave, 'mouseleave')
  })
}
