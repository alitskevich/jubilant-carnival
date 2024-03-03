import ReactQuill from 'react-quill';
import Input from './Input.jsx';

export default class RichEditor extends Input {

    renderInput(p, state) {
        return <ReactQuill
            theme="snow"
            value={state.value}
            disabled={p.disabled}
            onChange={(s)=>this.onValueChanged(s)}
            />
    }
}

