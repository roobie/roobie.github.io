import m from 'mithril'
import {getCss} from 'csjs'

import {genDude} from './dudegen'
import ChSheetComp from './ui/ch_sheet'

if(document.readyState === 'complete') {
    init()
} else {
    document.addEventListener('DOMContentLoaded', init)
}

class RootComponent {
    view (vnode) {
        return m(ChSheetComp, {character: genDude()})
    }
}


function registerStyles () {
    [].forEach.call([
        ChSheetComp
    ], comp => applyCss(comp.styles))
}
function applyCss (stylesGetter) {
    if (typeof stylesGetter === 'function') {
        const css = getCss(stylesGetter())
        const styleElement = document.createElement('style')
        styleElement.innerText = css
        document.head.appendChild(styleElement)
    }
}

function init () {
    registerStyles()
    const element = document.body
    m.mount(element, RootComponent)
}
