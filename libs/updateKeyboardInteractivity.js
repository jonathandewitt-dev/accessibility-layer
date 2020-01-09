import { Events, logError } from './utilities.js'
import getUtilities from './getUtilities.js'
import { getElementState } from './domState.js'

export default element => {
  const {rules, methods} = getElementState(element)

  Object.keys(rules).forEach(selector => {
    Events.removeAll(selector)

    if (!element.matches(selector)) return
    const {keyboard, keyboardEvent} = rules[selector]
    if (!keyboard) return

    // evaluate the keyboard configuration
    const utils = getUtilities(element)
    const keyList = Object.keys(keyboard)
    const validKeyEvents = ['keydown', 'keypress', 'keyup']
    const isValidKeyEvent =
      keyboardEvent
      && validKeyEvents.includes(keyboardEvent)
    const keyEvent = isValidKeyEvent ? keyboardEvent : 'keydown'
    if (keyboardEvent ? !isValidKeyEvent : false)
      logError(`"${keyboardEvent}" is not a valid keyboard event; using "keydown" instead.`)

    Events.add(selector, keyEvent, event => {
      if (!keyList.includes(event.key)) return
      keyboard[event.key].forEach(
        methodKey => methods[methodKey](utils, event))
    })
  })
}
