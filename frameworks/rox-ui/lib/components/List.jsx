import DataDrivenComponent from '../DataDrivenComponent.jsx'
import MList  from 'material-ui/lib/lists/list'
import MListItem from 'material-ui/lib/lists/list-item'

/**
 * The List.
 */
export default class List extends DataDrivenComponent {

    renderWithData(data) {

        const p = this.props;

        return p.itemClass
            ?
            (
                <div>
                    {p.caption}
                    <ul ref="list" className={this.resolveClassNames(p.className,' collection')}>
                        {p.header}
                        {this.renderItems(data, p)}
                    </ul>
                </div>
            )
            :
            React.createElement(MList, p, this.renderItems(data, p));
    }

    renderItems(data, p) {

        return data.map((d) => (d ? this.renderItem(d, p) : <span>no datum</span>));
    }

    renderItem(d, p) {

        return (
            p.itemClass
                ?
                React.createElement(p.itemClass, {id: d.id, key: d.id, data: d, params: p.params, listRef: this})
                :
                <MListItem
                    primaryText = {d.caption || d.name || d.id}
                    onClick = {()=>this.onItemClick(d)}
                    data = {d}
                    />

        )
    }

    onItemClick(datum) {
        this.callPropsHook('onItemClick', datum, this.props.params);
    }

}

//<ListItem
//    key={d.id}
//    data={d}
//    className={p.itemStyle}
//    params={p.params}
//    itemClick={this.onItemClick.bind(this, d)}
//    menuItems={p.menuItems}
//    onMenuItemSelected={p.processRulesMenu}
//    menuParams={p.menuParams || p.params}
//    />

//const ListItem = (p)=>(
//    <li className={`collection-item ${p.className} row`}>
//        <a onClick={p.itemClick}><b>{p.data.name}</b></a>
//        {p.menuItems ?
//            <PopupMenu items={p.menuItems} onItemClick={p.onMenuItemSelected}
//                       params={Object.assign({}, p.menuParams, p.data)}/> : null}
//    </li>
//);