import DataDrivenComponent from '../DataDrivenComponent.jsx';
import {normalizeProps} from './Utils.es6'
import Behavior from './Behavior.es6'
const STYLES = {
    header: {
        borderBottom: '1px solid gray' //+ this.getTheme().borderColor
    }
    ,
    cell: {padding: '3px', overflowX: 'hidden',    whiteSpace: 'nowrap', textOverflow: 'ellipsis'}
};
/**
 * Custom component which allows to display very large tables with fixed top row and(or) left column.
 */
export default class extends DataDrivenComponent {

    static defaultProps = {
        headers: [{id: 'name'}],
        idName: 'id',
        rowHeight: 55,
        headerHeight: 36,
        colWidth: 100
    };

    constructor(props, context) {

        super(normalizeProps(props), context);
    }


    getStyle(key, extras) {

        const style = STYLES[key];

        return {...style, ...extras};
    }

    renderWithData(data) {

        const p = this.props;
        const st = this.state;

        const viewportSize = st.viewportSize;

        if (!viewportSize) {
            return <div ref="root" style={{position: 'fixed', top: '0', bottom: '0', left:'0', right:0, overflow:'hidden'}}>
                <div style={{height: '1000px', width: '1000px', padding: '0'}}></div>
            </div>;
        }

        const headers = p.headers;

        const dataCount = data.length;
        const columnsCount = headers.length;
        const colLast = headers[columnsCount-1];

        const size = {w: colLast.offset + colLast.width, h: dataCount * p.rowHeight};

        const col = st.startCol || 0;
        const row = st.startRow || 0;

        const columnEnd = headers.find(h=>h.offset - headers[col].offset > viewportSize.w - headers[0].offset);

        const colEnd = columnEnd ? columnEnd.index : columnsCount;
        const rowEnd = Math.min(data.length, row + Math.round(viewportSize.h / p.rowHeight));

        const cols = [headers[0]].concat(headers.slice(col + 1, colEnd));

        const vScroll = size.h > viewportSize.h;
        const hScroll = size.w > viewportSize.w;

        const rootStyle = {

            overflow: 'hidden', height: '100%', width: '100%', padding: '0',
            paddingBottom: (hScroll ? "18px" : "0"),
            paddingRight: (vScroll ? "18px" : "0")
        };


        const renderHeader = (h, i)=><th key={h.id}
                                         style={{width:`${h.width}px`, maxWidth:`${h.width}px`, minWidth:`${h.width}px`}}>
            <div style={this.getStyle('cell')}>{h.render(this)}</div>
            </th>;

        const renderRow = (d, i)=>(
            <tr key={d[p.idName]} style={{height:`${p.rowHeight}px`}} onClick={(e)=>this.onRowClick(d, e.target)}>
                {cols.map((h, i)=>(
                    <td key={h.id} style={{width:`${h.width}px`, maxWidth:`${h.width}px`, minWidth:`${h.width}px`}}>
                        <div style={this.getStyle('cell')}>{h.renderCell(d, this)}</div></td>
                ))}
            </tr>
        );

        this.log(col, row, colEnd, rowEnd, viewportSize, size);

        return (
            <div ref="root" style={rootStyle}>

                <div
                    style={{display:(vScroll ? "block": "none"), width: '18px', height: '100%',float: 'right', marginRight: '-18px'}}>
                    <div ref='rowScroll' style={{height: '100%', overflowX: 'hidden'}}
                         onScroll={(evt)=>this.scrollRows(evt.target.scrollTop,size.h)}>
                        <div style={{marginTop: `${size.h+p.rowHeight}px`, width: '1px',height: '1px'}}></div>
                    </div>
                </div>

                <div ref='container' style={{overflow: 'hidden',height: '100%'}}>
                    <table ref="table" className="dataset">
                        <thead style={this.getStyle('header')}>
                        <tr style={{height:`${p.headerHeight}px`}}>{cols.map(renderHeader)}</tr>
                        </thead>
                        {dataCount
                            ?
                            <tbody>{data.slice(row, rowEnd).map(renderRow)}</tbody>
                            :
                            <tbody><tr><td colSpan={cols.length}>Empty</td></tr></tbody>
                        }
                     </table>
                </div>

                <div style={{display:(hScroll ? "block": "none"), float: 'left', width: '100%'}}>
                    <div ref='colScroll' style={{overflowX: 'scroll'}}
                         onScroll={(evt)=>this.scrollColumns(evt.target.scrollLeft, size.w)}>
                        <div style={{marginLeft: `${size.w}px`,height: '1px',width: `1px`}}></div>
                    </div>
                </div>
            </div>
        );
    }

    scrollColumns(px, size) {

        let columnEnd = this.props.headers.find(h=>h.offset >= px);
        //this.log(px, size, columnEnd && columnEnd.offset);

        const startCol = columnEnd ? columnEnd.index : 0;
        if (startCol != this.state.startCol) {
            this.setState({startCol});
        }
    }

    scrollRows(px, size) {

        const rowHeight = this.props.rowHeight;
        const dataCount = this.state.data.length;
        const startRow = Math.round(px * dataCount / size);

        //this.log(px, size, startRow);

        if (startRow != this.state.startRow) {
            this.setState({startRow});
        }
    }

    setClientSize() {
        const root = this.refs.root;
        if (root){
            const viewportSize = {w: root.clientWidth, h: root.clientHeight || 1000};
            this.setState({viewportSize});
        }

    }

    refresh() {

        if (!this.state.viewportSize) {
            this.setClientSize();
            return;
        }

        this.adjustScrolls();
    }

    componentDidMount() {

        super.componentDidMount();

        setTimeout(()=>{
            this.refresh();

            this.behavior = new Behavior(this);
        },5);
    }

    componentWillUnmount() {

        this.behavior.detach();
    }

    componentDidUpdate(prevProps, prevState) {
        this.refresh();
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    shiftRow(delta = 1) {
        const data = this.state.data;
        if (data) {
            const prev = this.state.startRow;
            const startRow = Math.max(0, Math.min(prev + delta, data.length-1));
            if (prev !== startRow) {
                this.setState({startRow})
            }

        }
    }

    shiftCol(delta = 1) {
        const headers = this.props.headers;
        if (headers) {
            const prev = this.state.startCol;
            const startCol = Math.max(0, Math.min(prev + delta, headers.length-1));
            if (prev !== startCol) {
                this.setState({startCol})
            }
        }
    }

    adjustScrolls() {
        //this.refs.rowScroll.scrollTop = (this.state.startRow * 10);
        // this.refs.colScroll.scrollLeft = (this.state.startCol * 10);
    }

    isVisibleInDOM() {
        return true;//$(this.refs.container).is(':visible');
    }

    onRowClick(data, elt) {
        this.callPropsHook('onItem',data, elt);
    }

    renderEmptyData() {

        return this.renderWithData([]);
    }
}
