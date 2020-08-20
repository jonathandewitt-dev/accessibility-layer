import { throwError, checkSelectorValidity, rootObj, getRoot } from './utilities.js'
import { updateElementState } from './domState.js'
import { compare } from 'specificity'
import updateAll from './updateAll.js'
import watchAttributesForChanges from './watchAttributesForChanges.js'

// exporting functions as methods on an object so it's easier to test
export const ruleUtilities = {
  setApplyRulesCallback(config) {

    // order the rules by least specific selector to most specific selector
    const selectors = Object.keys(config.rules).sort(compare)

    this.applyRulesCallback = mutations => selectors.forEach(selector => {
    
      // don't reapply the rules of this selector if no matching elements were added
      if (mutations) {
        const {addedNodes} = mutations.find(mutation => mutation.addedNodes)
        const anyMatches = [...addedNodes]
          .some(node => node instanceof HTMLElement && node.matches(selector))
        if (!anyMatches) return
      }
      
      // validate the given selector
      if (!checkSelectorValidity(selector)) return
      
      // apply the rule to all elements matching the selector
      getRoot().querySelectorAll(selector).forEach(element => {
        const { rules, methods } = config
        const rule = rules && rules[selector] || {}

        // add this element to the state internally, like a virtual DOM
        updateElementState(element, elementState => {
          elementState.rules[selector] = rule
          elementState.methods = methods
          return elementState
        })

        // update the DOM based on the state determined above
        updateAll(element)

        // keep the DOM updated when external changes are applied
        watchAttributesForChanges(element)
      })
    })
  },
  applyRulesCallback: null,
  observer: null,
}

export default config => {

  // early escape clauses in case of errors
  const configType = !!config ? config.constructor.name : String(config)
  if (!config || config.constructor !== Object)
    throwError(`Expected Object, but got ${configType}`)
  rootObj.element = config.root
  const rules = config.rules || {}
  const methods = config.methods || {}
  if (rules.constructor !== Object || methods.constructor !== Object)
    throwError('The `rules` and `methods` properties must be objects.')
  
  // main function to run initially and as a callback
  ruleUtilities.setApplyRulesCallback(config)

  // attach main function as a mutation observer to the root element
  const MutationObserver = typeof MutationObserver !== 'undefined'
    ? MutationObserver
    : class { observe() {} }
  ruleUtilities.observer = new MutationObserver(ruleUtilities.applyRulesCallback)
  ruleUtilities.observer.observe(getRoot(), {
    childList: true,
    subtree: true,
  })
  
  // initial run
  ruleUtilities.applyRulesCallback()
}
