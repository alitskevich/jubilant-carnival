let state = {};
const listeners = [];

export default {

    get(key) {

        return state[key];
    },

    addListener(l) {

        listeners.push(l)
    },

    init(defState, cb) {

        const stored = window.localStorage.getItem('_state');
        if (!stored) {

            state = defState||{};

        } else {

            state = JSON.parse(stored);
        }

        cb && cb(state);
    },

    update(delta, cb) {
        if (delta) {
            const changedKeys = Object.keys(delta).filter(key=>(this.get(key) !== delta[key]));

            console.log('update', changedKeys, delta);

            if (changedKeys.length) {

                state = {...state, ...delta};

                window.localStorage.setItem('_state', JSON.stringify(state));

                setTimeout(()=> {
                    listeners.forEach(l=>l(state));
                    cb && cb()
                }, 100);

            }
        }
    },

    reset () {
        window.localStorage.removeItem('_state');
        location.reload();
    }
}