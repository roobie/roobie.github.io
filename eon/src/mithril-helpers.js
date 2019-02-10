const m = require('mithril')
const tags = require('html-tags')

const boundFuncs = {}
for (let i = 0; i < tags.length; ++i) {
  boundFuncs[tags[i]] = m.bind(m, tags[i])
}
module.exports = {
  tags: boundFuncs,
}
