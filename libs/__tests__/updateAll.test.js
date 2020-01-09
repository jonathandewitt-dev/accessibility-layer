import updateAll, { updateFns } from '../updateAll.js'
import { Events } from '../utilities.js'

document.body.innerHTML = /*html*/`
  <button class="btn"></button>
`
const btnEl = document.querySelector('.btn')

describe('Update All', () => {

  it('runs every update function for one element', async () => {
    const updateAttributes = spyOn(updateFns, 'updateAttributes')
    const updateKeyboardInteractivity = spyOn(updateFns, 'updateKeyboardInteractivity')
    const updateMouseInteractivity = spyOn(updateFns, 'updateMouseInteractivity')
    const updateScreenReaderText = spyOn(updateFns, 'updateScreenReaderText')
    const updateEvents = spyOn(Events, 'update')
    updateAll(btnEl)
    expect(updateAttributes).toHaveBeenCalledWith(btnEl)
    expect(updateKeyboardInteractivity).toHaveBeenCalledWith(btnEl)
    expect(updateMouseInteractivity).toHaveBeenCalledWith(btnEl)
    expect(updateScreenReaderText).toHaveBeenCalledWith(btnEl)
    expect(updateEvents).toHaveBeenCalled()
  })

})