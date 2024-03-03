import {IconMenu, IconButton, DropDownMenu} from 'material-ui';
import Colors from 'material-ui/lib/styles/colors';
import MenuItem from 'material-ui/lib/menus/menu-item';
import * as Icons from 'material-ui/lib/svg-icons/';

import Component from '../BaseComponent.jsx';

/**
 * @props id, caption, iconId, iconColorId
 */

export default class Menu extends Component {

    render() {

        const p = this.props,
            {style, meta = []} = p,
            listItems = [], buttonItems = [];

        meta.map(m => (m.iconId ? buttonItems : listItems).push(m));

        //meta.map(m => m.iconId ? buttonItems.push(m) : listItems.push(m));

        return (
            <div
                style={{display: 'inline-block', ...style}}
            >
                {buttonItems.map(m => this.renderIconButton(m, p))}
                {listItems.length ? this.renderListMenu(listItems, p) : null}
            </div>
        );

    }

    renderListMenu(meta, p) {

        const {type = 'list'} = p;

        if (type.toLowerCase() === 'dropdown') {

            return (
                <DropDownMenu
                    labelStyle={{color: p.labelColorId}}
                    displayMember='caption'
                    valueMember='id'
                    menuItems={meta}
                    onChange={(ev, value) => p.menuHandler && p.menuHandler(value, meta)}
                />
            );

        }

        return (
            <IconMenu iconButtonElement={this.renderIconButton(p)}>
                {meta.map(m => this.renderItem(m, p))}
            </IconMenu>
        );

    }

    renderIconButton(m, p = {}) {

        let handler = m.handler || p.menuHandler;

        return (
            <IconButton
                key={m.id}
                tooltip={m.caption || null}
                onClick={e => {

                    e.stopPropagation();

                    handler && handler(m, p.data);

                }}
            >
                {React.createElement(Icons[m.iconId], {color: Colors[m.iconColorId] || null})}
            </IconButton>
        );

    }

    renderItem(d, p) {

        let handler = d.handler || p.menuHandler;

        return (
            <MenuItem
                key={d.id}
                primaryText={d.caption || d.id}
                onClick={() => handler && handler(d, p.data)}
            />
        );

    }

}