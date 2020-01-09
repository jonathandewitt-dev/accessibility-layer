import updateScreenReaderText from '../updateScreenReaderText.js'
import { updateElementState } from '../domState.js'

document.body.innerHTML = /*html*/`
  <div class="test"></div>
`
const testEl = document.querySelector('.test')

describe('Update screen reader only text', () => {

  it('prepends hidden element and adds text as dictated in the rules', () => {
    updateElementState(testEl, state => {
      state.rules = {
        '.test': {
          screenReaderText: 'This is a test',
        },
      }
      return state
    })
    updateScreenReaderText(testEl)
  
    const screenReaderElement = testEl.querySelector('span')
  
    expect(screenReaderElement).toBeTruthy()
    expect(screenReaderElement.textContent).toBe('This is a test')
    expect(screenReaderElement.getAttribute('style')).toBe('position: absolute; z-index: -9999999; opacity: 0;')
  })
})