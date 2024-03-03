import DataDrivenComponent from '../DataDrivenComponent.jsx';
import Checkbox from '../form/Checkbox.jsx'

/**
 * Specific component which allows to display very large tables with fixed top row and(or) left column.
 */
export default class LargeTable extends DataDrivenComponent {

    static defaultProps = {

        headers: [{id: 'name'}],
        idName: 'id',
        visibleRows: 20,
        visibleCols: 5,
        minEndRows: 8,
        startCol: 0,
        startRow: 0
    };

    constructor(props, context) {

        super(props, context);

        const p = this.props;

        this.selectedIds = {};

        this.columnsCount = p.headers.length;


    }

    renderWithData(data) {

        const p = this.props;
        const st = this.state;

        this.maxStartCol = Math.max(this.columnsCount - p.visibleCols - 1, 0);
        this.maxStartRow = Math.max(data.length - p.minEndRows, 0);

        this.vScrollVisible = !p.displayAllRows && data.length > p.minEndRows;
        this.hScrollVisible = this.columnsCount > p.visibleCols;

        return (
            <div
                className={"large-table-wrap" + (this.hScrollVisible ? " hScrollVisible": "") + (this.vScrollVisible ? " vScrollVisible": "")}>
                {
                    this.vScrollVisible ?
                        <div className='vert-scroll'>
                            <div className='scroll'
                                 ref='rowScroll'
                                 value={st.startRow}
                                 min='0'
                                 max={this.maxStartRow} step='1'
                                 type='range'
                                 onScroll={(evt)=>{this.setState({startRow: Math.min(~~(parseInt(evt.target.scrollTop) / 10), this.maxStartRow)})}}>
                                <div style={{marginTop: this.maxStartRow * 10 + 1, width: '1px',height: '100%'}}></div>
                            </div>
                        </div>
                        : null
                }
                <div ref='container' className="inner-wrap">
                    <table ref="table" className="dataset">
                        <thead>{this.renderHeader(p, st)}</thead>
                        <tbody>{this.renderBody(p, st, data)}</tbody>
                    </table>
                </div>
                {
                    this.hScrollVisible ?
                        <div className='hor-scroll'>
                            <div className='scroll'
                                 ref='colScroll'
                                 value={st.startCol}
                                 min='0'
                                 max={this.maxStartCol} step='1'
                                 type='range'
                                 onScroll={(evt)=>this.setStartCol(~~(parseInt(evt.target.scrollLeft) / 10))}>
                                <div style={{marginLeft: (this.maxStartCol) * 10 + 1,height: '1px',width: '100%'}}></div>
                            </div>
                        </div>
                        : null
                }
            </div>
        );
    }

    setStartCol(startCol) {
        (this.state.startCol !== startCol) && this.setState({startCol})
    }

    renderBody(p, st, data) {
        let bodyRows = [];
        let visibleRows = st.visibleRows;
        let startRow = st.startRow;
        const rowsCount = st.displayAllRows ? data.length : Math.min(data.length, startRow + visibleRows);

        for (var i = startRow; i < rowsCount; i++) {
            bodyRows.push(this.renderRow(data[i]));
        }
        return bodyRows;
    }

    /**
     * Renders single table row (body OR header)
     */
    renderHeader(p, st) {

        const headers = p.headers;

        let cells = [];
        //add 1st frozen col
        //cells.push(<th key="_sel" style={{width:'2em'}}>&nbsp;</th>);

        cells.push(<th key="_1" style={{minWidth:'10em', padding:'7px'}}>{st.caption}</th>);

        //add other columns
        //initial counter should be +1 because 1st cell has been already added
        const lastCellIndex = Math.min(st.startCol + st.visibleCols, headers.length);
        for (var i = st.startCol; i < lastCellIndex; i++) {
            const header = headers[i];
            cells.push(<th key={header.id} style={{minWidth:'5em', padding:'7px'}}>{header.id}</th>);
        }

        return (<tr key="_hr">{cells}</tr>)
    }

    /**
     * Renders single table row (body OR header)
     */
    renderRow(rowData) {

        const p = this.props;
        const st = this.state;
        const headers = p.headers;

        const rowId = rowData[p.idName];

        let cells = [];
        //add 1st frozen col
        //cells.push(<td key={this.uniqueKey()}><Checkbox caption=" " onValueChanged={()=>this.onToggleSelected(rowId)}
        //                                                value={this.selectedIds[rowId]}/></td>);

        cells.push(<td key={this.uniqueKey()} onClick={()=>this.onRowClick(rowId, rowData)}>{this.renderFirstCellValue(rowData)}</td>);

        //add other columns
        const lastCellIndex = Math.min(st.startCol + st.visibleCols, headers.length);
        for (var i = st.startCol; i < lastCellIndex; i++) {
            const key = this.state.headers[i].id;
            cells.push(<td key={key}>{this.renderCellValue(rowData, key, i)}</td>);
        }

        return (<tr key={rowId || this.uniqueKey()} className={'hoverable'}>{cells}</tr>)

    }

    renderFirstCellValue(rowData) {
        return <div style={{ padding:'7px'}}>{this.callPropsHook('renderFirstCellValue', rowData) || rowData['name']} </div>;
    }

    renderCellValue(rowData, key) {
        return <div style={{ padding:'7px', maxWidth:100, textOverflow:'ellipsis', overflowX:'hidden', whiteSpace: 'nowrap'}}
                    title={rowData[key]}
            >{rowData[key]} </div>;
    }

    componentDidMount() {
        super.componentDidMount();
        this.adjustScrolls();

        //listen keyboard
        this._handleKeyPress = this.handleKeyPress.bind(this);
        this._handleWheel = this.handleWheel.bind(this);

        this._handleMouseEnter = (evt)=> {
            this.mouseOnTable = true
        };
        this._handleMouseLeave = (evt)=> {
            this.mouseOnTable = false
        };

        window.addEventListener('keydown', this._handleKeyPress);
        window.addEventListener('wheel', this._handleWheel);
        const thisNode = this.findDOMNode(this);

        thisNode.addEventListener('mouseenter', this._handleMouseEnter);
        thisNode.addEventListener('mouseleave', this._handleMouseLeave);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this._handleKeyPress);
        window.removeEventListener('wheel', this._handleWheel);
        const thisNode = this.findDOMNode(this);
        thisNode.removeEventListener('mouseenter', this._handleMouseEnter);
        thisNode.removeEventListener('mouseleave', this._handleMouseLeave);
    }

    componentDidUpdate(prevProps, prevState) {
        this.adjustScrolls();
    }

    adjustScrolls() {

        if (this.refs.table) {
            const tableNode = this.refs.table;
            const verticalScroll = this.refs.rowScroll;
            const horScroll = this.refs.colScroll;

            if (verticalScroll) {
                verticalScroll.scrollTop =(this.state.startRow * 10);
            }

            if (horScroll) {
                horScroll.scrollLeft  = (this.state.startCol * 10);
            }
        }
    }

    handleWheel(evt) {
        if (this.isVisibleInDOM() && this.mouseOnTable) {
            if (evt.deltaX > 0) {
                this.shiftLeft();
                evt.preventDefault();
            }
            if (evt.deltaX < 0) {
                this.shiftRight();
                evt.preventDefault();
            }
            if (this.vScrollVisible && evt.deltaY < 0) {
                this.shiftUp();
                evt.preventDefault();
            }
            if (this.vScrollVisible && evt.deltaY > 0) {
                this.shiftDown();
                evt.preventDefault();
            }
            //DO NOT PREVENT DEFAULT 'wheel' EVENT IF WAS NOT HANDLED BY THIS COMPONENT
        }
    }

    handleKeyPress(evt) {
        if (this.isVisibleInDOM()) {
            if (evt.keyCode === 37) {
                //left arrow
                this.shiftLeft();
                evt.preventDefault();
            } else if (evt.keyCode === 39) {
                //right arrow
                this.shiftRight();
                evt.preventDefault();
            } else if (evt.keyCode === 38) {
                //up arrow
                this.shiftUp();
                evt.preventDefault();
            } else if (evt.keyCode === 40) {
                //down arrow
                this.shiftDown();
                evt.preventDefault();
            }
        }

    }

    shiftLeft() {
        if (this.refs.colScroll && this.state.startCol > 0) {
            this.setState({startCol: parseInt(this.refs.colScroll.value) - 1});
        }
    }

    shiftRight() {
        if (this.refs.colScroll
            && this.state.startCol < this.refs.colScroll.max) {
            this.setState({startCol: parseInt(this.refs.colScroll.value) + 1});
        }
    }

    shiftUp() {
        if (this.refs.rowScroll && this.state.startRow > 0) {
            this.setState({startRow: parseInt(this.refs.rowScroll.value) - 1});
        }
    }

    shiftDown() {
        if (this.refs.rowScroll
            && this.state.startRow < this.refs.rowScroll.max) {
            this.setState({startRow: parseInt(this.refs.rowScroll.value) + 1});
        }
    }

    isVisibleInDOM() {
        return true;//$(this.refs.container).is(':visible');
    }

    onRowClick(id, data) {
        this.callPropsHook('onItem', id, data);
    }

    onSelectedItems() {
        const ids = Object.keys(this.selectedIds).filter((id)=>this.selectedIds[id]);
        this.callPropsHook('onSelectedItems', ids);
    }

    onToggleSelected(id) {

        this.selectedIds[id] = !this.selectedIds[id];
        this.log(id, this.selectedIds[id]);
    }

    renderEmptyData() {

        return this.renderWithData([{}]);
    }
}