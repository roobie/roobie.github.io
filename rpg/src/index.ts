import {render, html} from 'lit-html'

import {E} from '~/ev'


document.addEventListener('DOMContentLoaded', main)

interface State {
    path: string
}
let state = {path: location.hash.slice(1)}
const EState = E(push => {})
const onNewState = EState.signal
function setState (pstate: Partial<State>): void {
    EState.push({...state, ...pstate})
}

window.addEventListener(
    'hashchange',
    () => setState({path: location.hash.slice(1)}),
    false);

async function main(e: HTMLEvent): void {
    let c = 0
    for (;;) {
        console.log('loops', ++c)
        state = await renderLoop(state)
    }
}

function renderLoop(): Promise<State> {
    return new Promise((resolve) => {
        const [newState, tmpl] = dispatch(state)
        render(tmpl, document.body)
        onNewState(state => resolve(state))
    })
}

function dispatch(state: State): [State, any] {
    console.log(state)
    switch (state.path) {
        case '': return viewRoot()
        default: return []
    }
}

function viewRoot(state: State): [State, any] {
    return [state, html`
<ul>
    <li><button type="button>Hello</button></li>
</ul>
`]
}
