import updateMouseInteractivity from '../updateMouseInteractivity.js'
import { updateElementState, getElementState } from '../domState.js'
import { Events } from '../utilities.js'

document.body.innerHTML = /*html*/`
  <button class="btn"></button>
`
const btnEl = document.querySelector('.btn')

describe('Update screen reader only text', () => {

  it('runs the provided callbacks when mouse is clicked', () => {
    updateElementState(btnEl, state => {
      state.methods = {
        test: jest.fn(),
        test2: jest.fn(),
      }
      state.rules = {
        '.btn': {
          mouse: {
            click: ['test', 'test2'],
          },
        },
      }
      return state
    })
    updateMouseInteractivity(btnEl)
    Events.update()

    // simulate clicking on button
    btnEl.dispatchEvent(new MouseEvent('click'))

    const {methods} = getElementState(btnEl)
    expect(methods.test).toHaveBeenCalled()
    expect(methods.test2).toHaveBeenCalled()
  })
})