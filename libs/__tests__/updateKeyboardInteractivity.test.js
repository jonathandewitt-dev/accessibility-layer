import updateKeyboardInteractivity from '../updateKeyboardInteractivity.js'
import { updateElementState, getElementState } from '../domState.js'
import { Events } from '../utilities.js'

document.body.innerHTML = /*html*/`
  <button class="btn"></button>
`
const btnEl = document.querySelector('.btn')

describe('Update screen reader only text', () => {

  it('runs the provided callbacks when key is pressed', () => {
    updateElementState(btnEl, state => {
      state.methods = {
        test: jest.fn(),
        test2: jest.fn(),
      }
      state.rules = {
        '.btn': {
          keyboard: {
            Enter: ['test', 'test2'],
          },
        },
      }
      return state
    })
    updateKeyboardInteractivity(btnEl)
    Events.update()

    // simulate hitting enter on button
    btnEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))

    const {methods} = getElementState(btnEl)
    expect(methods.test).toHaveBeenCalled()
    expect(methods.test2).toHaveBeenCalled()
  })
})