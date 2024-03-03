import DataDrivenComponent from '../DataDrivenComponent.jsx'
import Input from 'material-ui/lib/text-field';

/**
 * The Base for all input fields.
 * `Uncontrolled` component @see https://facebook.github.io/react/docs/forms.html
 */
export default class InputComponent extends DataDrivenComponent {

    constructor(props, context) {

        super(props, context);

        this.id = this.props.id || this._id;
    }

    validate(value) {

        if (this.props.required && !value){

            this.setState({error:this.error('Value required')});

        } else if (this.props.validate && !this.props.validate(value)){

            this.setState({error:this.error(this.props.validationMessage||'invalid value')});

        } else{

            return true;
        }

    }

    onValueChanged(newValue) {

        this.validate(newValue);

        this.callPropsHook('onValueChanged', newValue);
    }

    render() {

        var p = this.props;
        var st = this.state;

        return (
            <Input
                {...p}
                type={p.inputType||'text'}
                defaultValue={st.value}
                disabled={st.disabled}
                floatingLabelText={this.string(p.caption || p.id)}
                errorText={st.error?st.error.message:null}
                onChange={(ev)=>this.onValueChanged(ev.target.value)}
            />
        )
    }
}