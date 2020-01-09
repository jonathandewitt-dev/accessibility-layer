import watchAttributesForChanges, { observerUtils } from '../watchAttributesForChanges.js'
import updateAll from '../updateAll.js'
import MutationObserver from 'mutation-observer'
import { updateElementState, getElementState } from '../domState.js'

document.body.innerHTML = /*html*/`
  <button class="btn"></button>
`
const btnEl = document.querySelector('.btn')

describe('Watch attributes for changes', () => {

  beforeAll(() => {
    // TODO: fix mutation observer for jsdom so it can be tested.
    // As it is, it does not respond to dom changes.
    global.MutationObserver = MutationObserver
  })

  it('reacts to an attribute change and updates the rules', () => {
    updateElementState(btnEl, state => {
      state.rules = {
        '.btn': {
          attr: {
            tabindex: -1,
          },
        },
      }
      return state
    })
    updateAll(btnEl)
    watchAttributesForChanges(btnEl)

    expect(btnEl.getAttribute('tabindex')).toBe('-1')

    btnEl.classList.remove('btn')

    // manually mocking and running since mutation observer doesn't work.
    // Ideally, the above classList.remove() would automatically trigger the scripts below.
    const mutations = [{
      target: { attributes: [{class: ''}] },
      attributeName: 'class',
    }]
    const observer = { observe: () => {}, disconnect: () => {} }
    observerUtils.attrChangeCallback(mutations, observer)

    const elementState = getElementState(btnEl)

    expect(btnEl.getAttribute('tabindex')).toBe(null)
    expect(JSON.stringify(elementState.inlineAttributes)).toBe('[{}]')
    expect(elementState.attributeObserver).toBeTruthy()
  })

})