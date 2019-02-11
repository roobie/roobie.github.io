const csjs = require('csjs')

const style = csjs`
html,body {margin:0;padding:0;}

html {font-size:20px;}
`

module.exports = {
  addStyle: function () {
    const styleEl = document.createElement('style')
    styleEl.innerHTML = csjs.getCss(style)
    document.head.appendChild(styleEl)
  },
}
