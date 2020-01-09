import { Events } from './utilities.js'
import updateAttributes from './updateAttributes.js'
import updateKeyboardInteractivity from './updateKeyboardInteractivity.js'
import updateMouseInteractivity from './updateMouseInteractivity.js'
import updateScreenReaderText from './updateScreenReaderText.js'

// jest.mock will not work, so this object makes
// this file easier to test with spyOn instead.
export const updateFns = {
  updateAttributes,
  updateKeyboardInteractivity,
  updateMouseInteractivity,
  updateScreenReaderText,
}

export default element => {
  updateFns.updateAttributes(element)
  updateFns.updateKeyboardInteractivity(element)
  updateFns.updateMouseInteractivity(element)
  updateFns.updateScreenReaderText(element)
  Events.update()
}