import Component from '../BaseComponent.jsx';

import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';
import Colors from 'material-ui/lib/styles/colors';

/**
 * UI component main action look.
 */

export default class MainAction extends Component {

    render() {
        const p = this.props;
        const style = {
            position: 'absolute',
            bottom: '7em',
            right: '3em'
        };

        return (
            <FloatingActionButton style={style} backgroundColor={Colors.red800} onClick={p.onClick}>
                <FontIcon className="material-icons">{p.icon||'add'}</FontIcon>
            </FloatingActionButton>
        );
    }
}