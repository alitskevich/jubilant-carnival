import Component from '../BaseComponent.jsx';

import {LeftNav, List, ListItem} from 'material-ui';

/**
 * @param {String} mode - might be 'flat' or 'collapsible'
 */
export default class SidebarComponent extends Component {

    /**
     * Public
     */
    toggle() {

        this.refs.nav.toggle();

    }

    _onNavigate(data) {

        this.callPropsHook('onNavigate', data);

    }

    _menuItem(meta) {

        let nestedItems;

        if (meta.nestedItems) {

            nestedItems = [this._flatList({items: meta.nestedItems})];

        }

        return (
            <ListItem
                key={meta.id || meta.text}
                primaryText={meta.text}
                nestedLevel={~~!nestedItems}
                onClick={() => !nestedItems && this._onNavigate(meta)}
                nestedItems={nestedItems}
                primaryTogglesNestedList={true}
                //initiallyOpen={false}
            />
        );

    }

    _collapsibleList(meta) {

        return <List key={meta.id || meta.text}>{this._menuItem({text: meta.text, nestedItems: meta.items})}</List>;

    }

    _flatList(meta) {

        return <List subheader={meta.text}>{meta.items}</List>;

    }

    _menuList(meta = [], type = 'flat') {

        return meta
            .reduce((r, m) => {

                (m.route === '-' || r.length === 0) ? r.push({...m, items: []}) : r[r.length - 1].items.push(this._menuItem(m));

                return r;

            }, [])
            .map(m => this[`_${type}List`](m));

    }

    render() {

        const p = this.props;

        return (
            <LeftNav {...p} ref='nav' style={{overflowY: 'auto'}}>
                {p.children}
                {this._menuList(p.meta, p.mode)}
            </LeftNav>
        );

    }

}