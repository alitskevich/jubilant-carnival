import Input from './Input.jsx';

/**
 *The text input react component
 * `Uncontrolled` component @see https://facebook.github.io/react/docs/forms.html
 */
export default class TextArea extends Input {

    renderInput(p, state) {

        return (<textarea id={this.id}
                         className="materialize-textarea"
                         defaultValue={p.value}
                         disabled={p.disabled}
                         onChange={(ev)=>this.onValueChanged(ev.target.value)}/>)
    }
}

