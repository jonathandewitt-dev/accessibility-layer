const domState = new Map()

export const getElementState = element => {
  if (!domState.get(element)) {
    domState.set(element, {
      inlineAttributes: Array.from(element.attributes),
      attributeObserver: null,
      screenReaderElement: null,
      methods: {},
      rules: {},
    })
  }
  return domState.get(element)
}

export const updateElementState = (element, callback) => {
  const elementState = getElementState(element)
  domState.set(element, callback(elementState))
}

export default domState
