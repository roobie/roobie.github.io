// Function(Function(Any) -> Void) -> {signal, push}
export function E(src) {
    const listeners = [];
    const pipe = {
        // Function(Any) -> Function(Void) -> Void
        signal: function registerSignalHandler(listener) {
            listeners.push(listener);
            return function unregister() {
                listeners.splice(listeners.indexOf(listener), 1);
            };
        },
        // Function(Any) -> Void
        push: function push(data) {
            const len = listeners.length;
            for (let i = 0; i < len; ++i) {
                listeners[i](data);
            }
        }
    };

    src(pipe.push);
    return pipe;
};
