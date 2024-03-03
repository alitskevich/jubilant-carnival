import Input from './Input.jsx';
import Dataset from '../../old/utils/Dataset.jsx';

const createDictionary = datasets => []
    .concat([
        {name: 'bandCode', value: 'bandCode', score: 95, meta: "operations"}
    ]);


const langTools = ace.require("ace/ext/language_tools");

langTools.addCompleter({

    getCompletions(editor, session, pos, prefix, callback) {

        if (editor._dictionary) {

            callback(null, editor._dictionary);

        } else {
            //callback(null, editor._dictionary = createDictionary(datasets));
        }
    }
});

/**
 *The formula input react component
 */
export default class AceInput extends Input {

    componentDidMount() {

        super.componentDidMount();

        this.initEditor(this.refs.editor);
    }


    renderInput(p, state) {

        return (
            <div id={this.id} ref="editor" className="form-control"
                 style={{position: 'relative', height: '250px'}}></div>
        )
    }

    initEditor(domNode) {


        var editor = this.editor = window.ace.edit(domNode);

        editor.setTheme("ace/theme/" + this.props.theme);

        editor.getSession().setMode("ace/mode/" + this.props.mode);

        editor.$blockScrolling = Infinity;

        editor.setOptions(this.props.editorOptions);

        editor.commands.on("afterExec", function (e) {

            if (e.command.name == "insertstring" && /^[a-z]$/.test(e.args)) {

                editor.execCommand("startAutocomplete");
            }
        });

        editor.productId = this.props.productId;

        editor.getSession().on('change', (e) => {

            if (this.locked) {
                return;
            }

            this.locked = true;

            return setTimeout(()=> {
                this.locked = false;
                this.isOnChange = true;
                this.onValueChanged(editor.getValue());
                return this.isOnChange = false;
            }, 1000);
        });

        this.editor.setValue(this.state.value);

    }
}

AceInput.defaultProps = {

    mode: 'javascript',
    theme: 'chrome',
    editorOptions: {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        showPrintMargin: false,
        fontSize:14
    }
};

