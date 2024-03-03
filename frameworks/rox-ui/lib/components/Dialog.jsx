import Component from '../BaseComponent.jsx';
import Dialog from 'material-ui/lib/dialog';

const STATE_ZERO = {content: null};

export default class DialogComponent extends Component {

    hide() {

        this.setState(STATE_ZERO);

        this.refs.dialog.dismiss();
    }

    show(state) {

        const newState = ({...STATE_ZERO, ...state});

        this.setState(newState);

        this.refs.dialog.show();
    }

    render() {

        const st = this.state;

        return <Dialog ref="dialog"
                       key={this.uniqueKey()}
                       title={st.caption}
                       modal={true}
                       actions={st.actions}
                       autoDetectWindowHeight={false}
                       autoScrollBodyContent={true}>
            {st.content}
        </Dialog>;
    }

}