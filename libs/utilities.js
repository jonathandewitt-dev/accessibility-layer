// error logging
const errorPrefix = 'Problem evaluating accessibility'
export const logError = err => {
  if (typeof jest === 'undefined') console.error(`${errorPrefix}: ${err}`)
}
export const throwError = err => { throw new Error(`${errorPrefix}: ${err}`) }

// validate selectors without breaking
export const checkSelectorValidity = selector => {
  const isString = typeof selector === 'string'
  let isValidSelector = true
  try { getRoot().querySelector(selector) }
  catch(err) { isValidSelector = false }
  const isStringAndValid = isString && isValidSelector
  if (!isStringAndValid) logError(`${selector} is not a valid selector.`)
  return isStringAndValid
}

// get all elements that can be accessed naturally with `tab`
export const getTabbableElements = () => {
  const tabbableSelector = `
    a:not([disabled]):not([tabindex="-1"]),
    button:not([disabled]):not([tabindex="-1"]),
    input:not([disabled]):not([tabindex="-1"]),
    [tabindex]:not([disabled]):not([tabindex="-1"])
  `
  return [...getRoot().querySelectorAll(tabbableSelector)]
    .filter(el => !el.closest('[aria-hidden="true"]') || !!el.offsetParent)
}

export const Events = {
  
  _listeners: {
    addQueue: [],
    removeQueue: [],
    current: new Map(),
  },

  add(selector, event, listener) {
    this._listeners.addQueue.push({selector, event, listener})
  },

  removeAll(selector) {
    this._listeners.removeQueue.push(selector)
  },

  update() {
    const listeners = this._listeners
    listeners.addQueue.forEach(({selector, event, listener}) => {
      const currentListeners = listeners.current.get(selector) || []
      const inCurrent = currentListeners.find(a =>
        a.event === event && String(a.listener) === String(listener))
      if (inCurrent) return

      const els = [...document.querySelectorAll(selector)]
      els.forEach(el => {
        el.addEventListener(event, listener)
        currentListeners.push({event, listener})
        listeners.current.set(selector, currentListeners)
      })
    })
    listeners.removeQueue.forEach(selector => {
      const currentListeners = listeners.current.get(selector)
      if (!currentListeners) return
      let newListeners = []
      
      currentListeners.forEach(({event, listener}) => {
        const currentAddQueue = listeners.addQueue.filter(a => a.selector === selector)
        const inAddQueue = currentAddQueue.find(a =>
          a.event === event && String(a.listener) === String(listener))
        if (inAddQueue) return newListeners.push({event, listener})

        const els = [...document.querySelectorAll(selector)]
        els.forEach(el => el.removeEventListener(event, listener))
      })
      listeners.current.set(selector, newListeners)
    })
    
    listeners.removeQueue = []
    listeners.addQueue = []
  },
}

// get the root element
export const rootObj = { element: null }
export const getRoot = () => rootObj.element || typeof document !== 'undefined' && document.body
  || throwError('Could not find the root element.')

export const swapAndPop = (arr, idx) => {
  const lastIdx = arr.length - 1
  const last = arr[lastIdx]
  const current = arr[idx]
  arr[lastIdx] = current
  arr[idx] = last
  return arr.pop()
}