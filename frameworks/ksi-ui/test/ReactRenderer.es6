function stringifyComponentChildren(children) {
    if (!children || !children.length) return '';

    return children.filter(c=>c).map(c=>stringifyComponent(c)).join('');
}

function stringifyComponentProps(props) {

    return !props ? '' : Object.keys(props).filter(k=>k != 'children').map(k=> {

        let value = props[k];

        if (typeof value === 'function') {

            value = "[FN]"

        } else if (typeof value === 'object') {

            value = JSON.stringify(value).replace(/"/g,"'")

        }

        return `${k}="${value}"`;

    }).join(' ');
}

export function stringifyComponent(el) {

    if (typeof el === 'string') {

        return el;

    } else if (typeof el.type === 'function') {

        const inst = new el.type(el.props, {});
        console.log(inst, inst.render);

        return stringifyComponent(inst.render());

    } else {

        const type = el.type;

        const prefix = `${type} ${stringifyComponentProps(el.props)}`;

        const str = (type !== 'input' && type !== 'img') ? `<${prefix}>${el.props && el.props.children ?stringifyComponentChildren(el.props.children):''}</${type}>` : `<${prefix}/>`;

        return str;
    }

}

