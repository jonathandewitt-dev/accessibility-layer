import { updateElementState, getElementState } from './domState.js'
import { swapAndPop } from './utilities.js'
import updateAll from './updateAll.js'

// exporting functions as methods on an object so it's easier to test
export const observerUtils = {
  updateAttrsInState(element, attrMutations) {
    attrMutations.forEach(mutation => {
      const modifiedAttr = mutation ? mutation.target.attributes[mutation.attributeName] : {}
      updateElementState(element, elementState => {
        const existingIdx = elementState.inlineAttributes.findIndex(a => a.name === modifiedAttr.name)
        const idx = existingIdx !== -1 ? existingIdx : elementState.inlineAttributes.length
        if (modifiedAttr) elementState.inlineAttributes[idx] = modifiedAttr
        else swapAndPop(elementState.inlineAttributes, idx)
        return elementState
      })
    })
  },
  
  removeNonInlineAttrs(element) {
    const elementState = getElementState(element)
    const {inlineAttributes} = elementState
    Array.from(element.attributes).forEach(({name}) => {
      const isInline = !!inlineAttributes.find(a => a.name === name)
      if (isInline) return
      element.removeAttribute(name)
    })
  },
  
  updateChildElAttrs(element) {
    element.querySelectorAll('*').forEach(el => {
      const {attributeObserver} = getElementState(el)
      if (attributeObserver) attributeObserver.disconnect()
      this.removeNonInlineAttrs(el)
      updateAll(el)
      if (attributeObserver)
        setTimeout(() => attributeObserver.observe(el, { attributes: true }), 0)
    })
  },
  
  setAttrChangeCallback(element) {
    this.attrChangeCallback = (mutations, observer) => {
  
      // temporarily stop observing so attribute manipulations can occur safely
      observer.disconnect()
    
      // update this element and all its children
      const attrMutations = mutations.filter(
        ({target, attributeName}) => target.attributes[attributeName])
      this.updateAttrsInState(element, attrMutations)
      this.removeNonInlineAttrs(element)
      updateAll(element)
      this.updateChildElAttrs(element)
      
      // make sure it does not start observing again until after all other scripts in the event loop finish
      setTimeout(() => {
        observer.observe(element, { attributes: true })
      }, 0)
    }
  },

  attrChangeCallback: null,
}

export default element => {

  // initialize the mutation observer
  observerUtils.setAttrChangeCallback(element)
  const observer = new MutationObserver(observerUtils.attrChangeCallback)
  observer.observe(element, { attributes: true })

  // attach the observer to the element state
  updateElementState(element, elementState => {
    elementState.attributeObserver = observer
    return elementState
  })
}

