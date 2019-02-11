const get = require('lodash.get')
const set = require('lodash.set')

const {P,S,PS,D} = require('patchinko')

const wrap = (update, fn) => (id, data) => update((state) => {
  const localState = get(state, id)
  const setState = (newState) => {
    const patchedState = P(localState, newState)
    const retVal = set(state, id, patchedState)
    return retVal
  }
  return fn(setState, data)
})

const setState = (id, update, patch) => update((state) => {
  const localState = get(state, id)
  const doSetState = (newState) => {
    const patchedState = P({}, localState, newState)
    const retVal = set(state, id, patchedState)
    return retVal
  }
  return doSetState(patch)
})

const setStateA = (id, update, patch) => update((state) => {
  const localState = get(state, id)
  const doSetState = (newState) => {
    const patchedState = P([], localState, newState)
    const retVal = set(state, id, patchedState)
    return retVal
  }
  return doSetState(patch)
})

module.exports = {
  wrap,
  setState,
  setStateA,
}
