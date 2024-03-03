import BaseComponent from '../BaseComponent.jsx';

import AppBar from 'material-ui/lib/app-bar';

import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import NavigationTop from 'material-ui/lib/svg-icons/navigation/menu';
import NavigationBack from 'material-ui/lib/svg-icons/navigation/arrow-back';

import IconButton from 'material-ui/lib/icon-button';

import Colors from 'material-ui/lib/styles/colors';

/**
 * UI component.
 */

export default class NavBar extends BaseComponent {

    render() {

        const st = this.state;
        const p = this.props;

        const iconElementLeft = this.resolveIcon();

        return (
            <AppBar
                title={p.title}
                showMenuIconButton={iconElementLeft != null}
                iconElementLeft={iconElementLeft}
                iconElementRight={p.rightGroup}
                zDepth={0}
            />
        );

    }

    resolveIcon(){
        const p = this.props;
        const nav = p.mode;
        if (nav==='top') {
            return <IconButton style={{float:'left'}} onClick={p.action || (()=>this.emit('ui://navTop'))}><NavigationTop/></IconButton>
        }
        if (nav==='back') {
            return <IconButton style={{float:'left'}} onClick={p.action || (()=>this.emit('ui://navBack'))}><NavigationBack/></IconButton>
        }
        if (nav==='close') {
            return <IconButton style={{float:'left'}} onClick={p.action || (()=>this.emit('ui://navClose'))}><NavigationClose/></IconButton>
        }
        return p.iconElementLeft || null
    }
}