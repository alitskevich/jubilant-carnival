import Input from './Input.jsx';
import Checkbox from 'material-ui/lib/checkbox';

/**
 *The checkbox input react component.

 * `Uncontrolled` component
 * @see https://facebook.github.io/react/docs/forms.html
 */
export default class CheckboxComponent extends Input {

    render() {

        var p = this.props;

        return (
            <Checkbox name={this.id}
                label={p.caption || this.id}
                disabled={p.disabled}
                onCheck={(ev, checked)=>this.onValueChanged(checked)}
                defaultChecked={!!p.value}/>
        )
    }
}