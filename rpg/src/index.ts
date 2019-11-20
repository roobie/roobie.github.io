import {render, html} from 'lit-html'

import {E} from '~/ev'


document.addEventListener('DOMContentLoaded', main)

interface State {
    path: string
}

function main(): void {
    let state = {
        path: location.hash.slice(1),
    }
    const EState = E(push => {})
    const onNewState = EState.signal
    function setState (pstate: Partial<State>): void {
        EState.push({...state, ...pstate})
    }
    window.addEventListener(
        'hashchange',
        () => setState({path: location.hash.slice(1)}),
        false);

    renderLoop(state, setState)
    onNewState(newState => {
        state = newState
        renderLoop(newState, setState)
    })
}


function renderLoop(state: State, setState: (Partial<State>): void): State {
    const tmpl = dispatch(state, setState)
    render(tmpl, document.body)
}

function dispatch(state: State, setState: (Partial<State>): void): any {
    switch (state.path) {
        case '': return viewRoot(state, setState)
        default: return html`<h1>Not found</h1>`
    }
}

function viewRoot(state: State, setState: (Partial<State>): void): any {
    return html`
<ul>
    <li>
        <button type="button"
            @click=${() => setState({c: (state.c || 0)+1})}
        >
            Hello ${state.c}
        </button>
    </li>
<pre>${JSON.stringify(state)}</pre>
</ul>
`
}
