import updateAttributes from '../updateAttributes.js'
import { updateElementState } from '../domState.js'

document.body.innerHTML = /*html*/`
  <div class="test" tabindex="0"></div>
`
const testEl = document.querySelector('.test')

describe('Update element attributes', () => {

  it('updates the attributes according to the element state', () => {
    updateElementState(testEl, state => {
      state.rules = {
        '.test': {
          aria: {
            hidden: false,
          },
          attr: {
            alt: 'alt',

            // none of these should succeed
            tabindex: -1, // inline
            id: 'id', // forbidden
            class: 'class', // forbidden
            style: 'display: none;', // forbidden
            onclick: event => event.preventDefault(), // forbidden
          },
        },
      }
      return state
    })

    updateAttributes(testEl)

    const expectedAttributes = {
      'class': 'test',
      'aria-hidden': 'false',
      'alt': 'alt',
      'tabindex': '0',
    }

    const actualAttributes =
      [...testEl.attributes].reduce((acc, cur) => {
        acc[cur.name] = cur.value
        return acc
      }, {})

    expect(actualAttributes).toEqual(expectedAttributes)
  })
})