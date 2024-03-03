import Component from 'ui/Component.es6';

const ALL={}

export default{

    init(...args) {

        Component.addPipe('text', (t)=>this.get(t) );

        this.addBundle(...args);
    },

    addBundle(...args) {

        Object.assign(ALL, ...args);
    },

    get(t) {

        return ALL[t] || t;
    }
}

