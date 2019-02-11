
const Foswig = require('foswig')

// Create the markov chain and specify the Order of the markov chain.
// The order (an integer > 0) indicates how many previous letters are
// taken into account when selecting the next. A smaller order will
// result in more randomized less recognizeable output. Conversely a
// higher order will result in words which resemble more closely those
// in the original dictionary.
const chain = new Foswig(2)

// add words into the markov chain one at a time
// chain.addWordToChain("random")
const dictionary = require('./corpi/names').cirefalicMaleFirst()
chain.addWordsToChain(dictionary)

module.exports = {
  chain,
}
