import {ADAPTERS, OPS, SPECIAL_TAGS} from './JsxConsts.es6';
import {resolveProp} from './JsxPropsResolver.es6';

let COUNTER = 0;

export function h(type, props, ...children) {

    if (SPECIAL_TAGS.includes(type)) {
        throw new Error(`${this}: Root tag cannot be special tag`);
    }
    if (props) {
        if ('each' in props) {
            throw new Error(`${this}: Root tag cannot have 'each' directive`);
        }
        if ('if' in props) {
            throw new Error(`${this}: Root tag cannot have 'if' directive`);
        }
    }


    return this::createElement(type, props, ...children)
}

export function keye(node) {

    if (node && typeof node !== 'string') {
        if (!node[1]) {
            node[1] = {}
        }
        node[1].$key = COUNTER++;
        node.forEach((n, i)=>(i > 1 ? keye(n) : 0))
    }

    return node;

}

function createElement(type, props, ...children) {

    if (type === 'children') {

        return this.state.children;
    }

    let isComponent = (typeof type !== 'string');

    if (props) {

        if ('each' in props) {

            const [scopeId, op, dataId] = props.each.split(' ');

            const data = this::resolveProp(dataId);

            if (!data) return null;

            const $key = props.$key

            const newProps = Object.keys(props).filter(key => (key !== 'each')).reduce((r, p) => ((r[p] = props[p]), r), {});

            return [].concat(...data.map((d, index) => {

                this.state[scopeId] = d;

                const r =  createElement.call(this, type, {...newProps, $key: $key+"$"+(d.key||d.id||(COUNTER++))}, ...children);

                delete this.state[scopeId];

                return r;

            }));
        }

        if ('if' in props) {

            const [ifExpr, ifOp, ifMatch]= props.if.split(' ');

            let val = this::resolveProp(ifExpr);

            if (ifMatch !== undefined) {

                val = OPS[ifOp](val, this::resolveProp(ifMatch));
            }

            if (!val) {

                const elze = children.find(([type]) => type === 'else');

                return elze ? createElement.apply(this, elze) : null;
            }

            children = children.filter(([type]) => type !== 'else');
        }

        props = this::resolveProps(props, isComponent);
    }

    children = this::resolveChildren(children, props.$key);

    if (type === 'component') {

        type = props.type;

        isComponent = true;
    }

    children = (children.length) ? children : null;

    return SPECIAL_TAGS.includes(type)
        ? children
        : (isComponent
            ? {type, props: {...props, children}}
            : {type, props: {...props}, children}
    );

}

function resolveProps(props, isComponent) {

    return Object.keys(props).reduce((r, k) => {

        if (k === 'if' || k === 'each') return r;

        const value = props[k];

        if (value === undefined) return r;

        const adapter = ADAPTERS[k] || ADAPTERS['*'];

        this::adapter(value, k, r, isComponent);

        return r;

    }, {});
}

function resolveChildren(ch, keyPrefix) {

    let cnt=0;

    return ch.reduce((r, c) => {

        if (typeof c === 'string') {

            r.push({type: "#text", props: {text: '' + this::resolveProp(c.trim())}});

        } else {

            const sub = createElement.call(this, c[0],{...c[1], $key:keyPrefix+"."+c[1].$key},...c.slice(2));
            if (sub) {
                if (Array.isArray(sub)) {
                    r.push(...sub.filter(c=>c));
                } else {
                    r.push(sub);
                }
            }
        }
        return r;
    }, [])
}