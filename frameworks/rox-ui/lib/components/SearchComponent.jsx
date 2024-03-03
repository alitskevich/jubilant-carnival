import BaseComponent from '../BaseComponent.jsx';
import Input from 'material-ui/lib/text-field.js';

export default class SearchComponent extends BaseComponent {

    render() {

        const p = this.props;

        const css = this.resolveClassNames({
            'right': true,
            'pull-right': true
        });

        return (<div className={css}>
            <Input type="text"
                hintText={p.caption||'Search'}
                onChange={(ev)=>this.onValueChanged(ev.target.value)}
                />
        </div>)
    }

    onValueChanged(keyword) {
        const cleared=keyword.trim().replace(/\s+/g, ' ');
        this.callPropsHook('onSearch', cleared);
    }

}

