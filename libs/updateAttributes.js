import { getElementState } from './domState.js'
import { logError } from './utilities.js'

export default element => {

  const {inlineAttributes, rules} = getElementState(element)

  // utility for setting attributes
  const setAttr = (name, value) => {
    const isSame = element.getAttribute(name) === String(value)
    const isInline = !!inlineAttributes.find(a => a.name === name)
    const blackList = [
      'class',
      'id',
      'style',
    ]

    // disallow rules to assign black-listed attributes
    if (blackList.includes(name) || name.startsWith('on'))
      return logError(`Cannot assign black-listed attribute: "${name}"`)

    // update the actual attribute in the DOM
    if (!isInline && !isSame) element.setAttribute(name, value)
  }

  // apply the attributes as dictated by the rules
  Object.keys(rules).forEach(selector => {
    if (!element.matches(selector)) return
    const {aria, attr} = rules[selector]

    // add aria attributes
    if (aria) Object.keys(aria).forEach(
      attrName => setAttr(`aria-${attrName}`, aria[attrName]))
    
    // add all other attributes
    if (attr) Object.keys(attr).forEach(
      attrName => setAttr(attrName, attr[attrName]))
  })

}
