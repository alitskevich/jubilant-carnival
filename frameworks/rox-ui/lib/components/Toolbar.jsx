import Component from '../BaseComponent.jsx';

import {Toolbar,  ToolbarGroup,ToolbarSeparator,ToolbarTitle} from 'material-ui/lib/toolbar';

import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import NavigationTop from 'material-ui/lib/svg-icons/navigation/menu';
import NavigationBack from 'material-ui/lib/svg-icons/navigation/arrow-back';

import IconButton from 'material-ui/lib/icon-button';

import Colors from 'material-ui/lib/styles/colors';


/**
 * UI component.
 */
export default class ToolbarComponent extends Component {

    render() {

        const p = this.props;
        return (
        <Toolbar style={{padding:'0.5em'}}>
            <ToolbarGroup key={0} float="left">{p.leftGroup}</ToolbarGroup>
            <ToolbarGroup key={1} float="right">{p.rightGroup || p.children}</ToolbarGroup>
        </Toolbar>
        );
    }

}