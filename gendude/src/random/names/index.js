import {pickOne} from '../utilities'
import * as any from './any.js'
import * as ger from './ger.js'
import * as brit from './brit.js'
import * as ame from './ame.js'
import * as jap from './jap.js'
import * as rus from './rus.js'
import * as extra from './extra.js'
import Foswig from 'foswig'

const all = [
  any,
  ame,
  brit,
  ger,
  rus,
  jap,
  // extra,
].reduce((out, next) => {
  out.rawMale += '\n' + next.rawMale
  out.rawFemale += '\n' + next.rawFemale
  return out
}, {
  rawMale: '',
  rawFemale: '',
})

function generateChain (corpus, options = {}) {
  const chain = new Foswig(options.length || 3)
  chain.addWordsToChain(corpus)
  return chain
}

const corpus = (lines) => {
  const arrs = lines.split('\n').map(line => {
    const words = line.split(' ')
    return words.map(word => {
      return word
        .replace(/\(/g, '')
        .replace(/\)/g, '')
    })
  })
  return Array.prototype.concat.apply([], arrs)
}
// const chain = generateChain(corpus, {length: pickOne([2, 3, 4])})
const chainMale = generateChain(corpus(all['rawMale']), {length: 3})
const chainFemale = generateChain(corpus(all['rawFemale']), {length: 3})

export const getRandomName = function getRandomName (gender) {
  const chain = gender === 'M' ? chainMale : chainFemale
  const name = chain.generateWord(3, 10, true)
  const surname = chain.generateWord(3, 10, true)
  return `${name} ${surname}`
}