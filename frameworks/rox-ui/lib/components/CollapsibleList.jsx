import HavingDataComponent from './List.jsx'

/**
 * The List.
 */
export default class CollapsibleList extends HavingDataComponent {

    constructor(props, context) {

        super({className:'collapsible with-header', ...props}, context);

        this.expandedItem = null;
        this.expandedItemId = props.expandedItemId;
        this.expandedItemStateFields = null;
        this.expandedItemState = null;
    }

    componentWillUpdate() {
        if (this.expandedItem && this.expandedItemStateFields) {
            this.expandedItemState = {};
            for (let field of this.expandedItemStateFields) {
                this.expandedItemState[field] = this.expandedItem.state[field];
            }
            // expanded item is unmounted and obsolete
            this.expandedItem = null;
        }
    }

    componentDidUpdate() {

        $(this.refs.list).collapsible({expandable: true});

        if (this.expandedItemId) {
            this.expandedItem = this.refs[this.expandedItemId];
        }
    }

    onItemExpand(item, stateFields) {
        if (this.expandedItem) {
            this.expandedItem.setState({expanded: false});
        }
        this.expandedItem = item;
        this.expandedItemId = item.props.id;
        this.expandedItemStateFields = stateFields;
    }

    onItemCollapse() {
        this.expandedItem = null;
        this.expandedItemId = null;
        this.expandedItemStateFields = {};
    }

    renderItem(d, p) {
        let expanded = d.id === this.expandedItemId;
        return React.createElement(p.itemClass, {
            id: d.id,
            key: d.id,
            ref: d.id,
            data: d,
            params: p.params,
            listRef: this,
            expanded: expanded,
            exState: expanded ? this.expandedItemState : {},
            onItemExpand: this.onItemExpand.bind(this),
            onItemCollapse: this.onItemCollapse.bind(this)
        });
    }


}