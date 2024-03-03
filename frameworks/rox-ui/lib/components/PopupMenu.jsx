import Component from '../BaseComponent.jsx'

let ButtonMenuItem = (props) => {
    var p = props.data;
    return (
        <a className="action-button" title={p.name || this.string(p.label || p.id)}
           onClick={props.onClick}>
            <i className={p.icon}></i>
        </a>
    );

};

let PopupMenuItem = (props) => {
    var p = props.data;
    return (
        <li className={`popup-menu-item ${p.disabled ? 'disabled' : ''}`}
            onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!p.disabled) {
                        this.props.onItemClick(e);
                    }
                }}>
            {p.name || this.string(p.label || p.id)}
        </li>
    );
};


let _normalizeItems = (items)=> {
    return typeof items === 'string' ? this.res(items) : items
};

let C = 0;

export default class PopupMenu extends Component {

    constructor(p, c) {
        super(p, c, {
            id: `c${C++}`
            ,
            visible: false
            ,
            items: _normalizeItems(p.items)
        });
    }


    componentDidMount() {
        $(this.refs.dropdownButton).dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on click
            alignment: 'right', // Aligns dropdown to left or right edge (works with constrain_width)
            gutter: 10, // Spacing from edge
            belowOrigin: true // Displays dropdown below the button
        });
    }

    onItemClick(item) {

        var {params} = this.props;

        if (this.props.onItemClick) {

            this.props.onItemClick(item, params);
            return;

        }

        var h = item.handler;

        if (!h) {
            alert('Not implemented yet:' + item.id);
            return;
        }

        if (typeof h === 'string') {

            this.emit({
                uri: Object.Uri.parse(h).setParams(params)
                ,
                payload: item
                ,
                callback: (err)=> {
                    if (err) {
                        window.alert(`Action failed: ${err.message}`)
                    } else {
                        this.emit('ui:toast',{message:`Action ${item.name} is done`});
                    }
                }
            });

        } else {

            h(item, params);
        }

    }

    render() {

        const {id} = this.state;

        let menuIcon = null;

        let menuButton = null;
        var buttonItems = [];
        var popupItems = [];

        var disableItems = this.props.disable || [];

        (this.state.items || []).map((itemDescr) => {
            let item = Object.assign({}, itemDescr);

            if (disableItems.indexOf(item.id) !== -1) {
                return null;
            }
            if (item.showCheck && !item.showCheck(this.props.params)) {
                return null;
            }
            if (item.disableCheck) {
                item.disabled = item.disableCheck(this.props.params);
            }

            if (item.id === 'icon') {
                menuIcon = item.name;
                return;
            }
            if (item.showAsButton) {
                buttonItems.push(item);
            } else {
                popupItems.push(item);
            }
        });

        if (popupItems.length === 1 && popupItems[0].icon) {
            buttonItems.push(popupItems[0]);
            popupItems.pop();
        }

        if (!menuIcon) {
            menuButton = <a className="action-button" ref="dropdownButton"
                            data-activates={`dropdown${id}`} data-beloworigin="true">
                <i className="material-icons">&#xE5D4;</i>
            </a>
        } else {
            menuButton =
                <a className="action-button" ref="dropdownButton" data-activates={`dropdown${id}`}
                   data-beloworigin="true">
                    <i className={`${menuIcon}`}></i>
                </a>
        }

        return (
            <div className='right pull-right'>
                {buttonItems.map((item) => {
                    return <ButtonMenuItem key={this.uniqueKey()} data={item} onClick={()=> {
                        this.onItemClick(item)
                    }}/>
                })}
                {popupItems.length > 0 ?
                    menuButton
                    : null}
                {popupItems.length > 0 ?
                    <ul id={`dropdown${id}`} className="dropdown-content" style={{zIndex:"1000"}}>
                        {popupItems.map((item) => {
                            return <PopupMenuItem key={this.uniqueKey()} data={item} onItemClick={()=> {
                            this.onItemClick(item)
                        }}/>;
                        })}
                    </ul>
                    : null}
            </div>
        )
    }
};

