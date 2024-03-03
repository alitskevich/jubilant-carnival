import Input from './Input.jsx';

/**
 * The file input react component.
 */
export default class FileInput extends Input {

    onValueChanged(files) {

        let file = files[0];

        if (file) {

            var reader = new FileReader();

            reader.onload = (ev)=> {
                this.props.onValueChanged(ev.target.result, file);
            };

            reader.readAsBinaryString(file);
        }

    }

    renderInput(p, state) {

        return (
            <input id={this.id} type="file" accept={p.accept} name="fileContent" style={{width:'100%'}}
                   onChange={(ev)=>this.onValueChanged(ev0.target.files)}/>
        )
    }
}

