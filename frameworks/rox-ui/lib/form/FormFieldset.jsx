import React from 'react';
import Types from './Types.jsx';
import BaseComponent from '../BaseComponent.jsx';
import Checkbox from './Checkbox.jsx';
import Grid from '../components/Grid.jsx';

const compileExpr = function (body = '') {
    try {
        return new Function('$', `return ${body}`);
    } catch (ex) {
        this.log(ex);
    }
    return null;
};

const evalExpr = function (key, p, data) {

    if (!p[key]) {
        return false;
    }

    const ckey = `_${key}}`;

    let fn = p[ckey] || (p[ckey] = compileExpr.call(this, p[key]));

    return fn && fn.call(data, data);
};

const toggle = function (value, meta, data) {

    data[meta.id] =  value;

    if (!value) {
        meta.fields.forEach(({id}) => (data[id] = null));
    }

    this.callPropsHook('onDataChanged', data);
};

const renderField = function(p, data) {

    const key = p.id;
    const value = data[key];

    return React.createElement(Types.resolve(p.type), {
        ...p, key, value,
        caption: p.caption || key,
        disabled: this.props.disabled || evalExpr.call(this, 'disabled', p, data),
        validate: p.validate && compileExpr.call(this, p.validate),
        onValueChanged: (value) => {(data[key] = value); this.callPropsHook('onDataChanged', data);}
    })
};

/**
 * Form Fieldset.
 */
export default class FormFieldset extends BaseComponent {

    render() {

        const p = this.props;

        var meta = p.meta;
        var data = this.state.data || {};
        var id = meta.id;
        var value = !!data[id];

        const content = meta.fields
            .filter(p=>(!evalExpr.call(this, 'hidden', p, data)))
            .map((p) => renderField.call(this, p, data));

        return <fieldset style={{border:'none'}}>

            {(!meta.expandable) ? null :
                <Checkbox id={id} key={`toggle_${id}`} caption={meta.caption}
                          disabled={p.disabled}
                          value={value}
                          onValueChanged={()=>toggle.call(this, !value, meta, data)}/>
            }
            <Grid style={{display:((!meta.expandable||value)?'':"none")}}>{content}</Grid>
        </fieldset>;
    }
}
