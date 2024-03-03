import DataDrivenComponent from '../DataDrivenComponent.jsx';
import Menu from './Menu.jsx';
import {Table,TableBody,TableFooter,TableHeader,TableHeaderColumn,TableRow,TableRowColumn} from 'material-ui/lib/table';

export default class TableComponent extends DataDrivenComponent {

    static defaultProps = {
            headers:[{id:'name'}]
    };

    renderWithData(data) {

        const p = this.props;
        const st = this.state;

        this.displayData = data;

        const colSpan = p.headers.length + ~~!!(p.rowMenu || p.tableMenu);

        const caption = !p.caption ? null : <TableRow key={0}>
            <TableHeaderColumn colSpan={colSpan} tooltip={p.superHeaderTooltip} style={p.superHeaderStyle}>
                {p.caption}
            </TableHeaderColumn>
        </TableRow>;

        const footer = !p.footer ? null : <TableFooter>
            <TableRow>
                <TableRowColumn colSpan={colSpan} style={{textAlign: 'center'}}>
                    {p.footer}
                </TableRowColumn>
            </TableRow>
        </TableFooter>;

        const selectedIds = p.selectedIds || {};
        const idName = p.idName || 'id';

        return (
            <Table
                style={{overflow: 'auto'}}
                {...p}
                onRowSelection={(ids)=>this.onRowSelection(ids)}
                onCellClick={(rowNumber, columnId)=>this.onCellClick(rowNumber, columnId)}
            >
                <TableHeader {...p}>
                    {caption}
                    <TableRow key={0}>{this.renderHeaders(p)}</TableRow>
                </TableHeader>
                <TableBody
                    style={{overflow: 'visible'}}
                    deselectOnClickaway={false}
                    {...p}
                >
                {
                    data.map(d => this.renderRow(d))
                }
                </TableBody>
                {footer}
            </Table>
        );
    }

    renderRow(d) {

        let p = this.props;

        const selectedIds = p.selectedIds || {};
        const idName = p.idName || 'id';

        return (
            <TableRow
                key={this.uniqueKey()}
                selected={!!selectedIds[d[idName]]}
            >
            {
                p.headers.map(h => <TableRowColumn style={{width: h.width}}>{this.renderCell(h, d)}</TableRowColumn>)
            }
            {(p.rowMenu || p.tableMenu) ? <TableRowColumn style={{width: '96px', overflow: 'visible'}}>{this.renderRowMenu(p.rowMenu, d)}</TableRowColumn> : null}
            </TableRow>
        );

    }

    renderCell(h ,d){

        if (h.render){
            return h.render(h, d, this)
        }

        const type = h.type;

        const value = d[h.id];

        if (type == 'int'){

        }

        return value;
    }

    renderRowMenu(meta, d) {

        return meta ? <Menu iconId='NavigationMoreVert' meta={meta} data={d} menuHandler={this.props.menuHandler}/> : null;

    }

    renderHeaders(p){

        const body = (h)=>(h.headerRender?(h.headerRender(this)):(h.caption||this.string(h.id)));

        let headers = p.headers.map(h => <TableHeaderColumn key={this.uniqueKey()} tooltip={h.id} style={{width:h.width}}>{body(h)}</TableHeaderColumn>);

        return (p.rowMenu || p.tableMenu) ? [...headers, <TableHeaderColumn key={this.uniqueKey()} style={{width: '96px'}}>{this.renderRowMenu(p.tableMenu)}</TableHeaderColumn>] : headers;

    }

    renderDataLoading(props, state) {

        return this.renderInRow(super.renderDataLoading(props, state));
    }

    renderEmptyData(props, state) {

        return this.renderInRow(super.renderEmptyData(props, state))
    }

    renderError(props, state, error) {

        return this.renderInRow(super.renderError(props, state, error))
    }

    renderInRow(content) {

        const p = this.props;
        const caption = !p.caption ? null : <TableRow key={0}>
            <TableHeaderColumn colSpan={p.headers.length} tooltip={p.superHeaderTooltip} style={p.superHeaderStyle}>
                {p.caption}
            </TableHeaderColumn>
        </TableRow>;

        return <Table
                height={p.height}
                fixedHeader={p.fixedHeader}
                selectable={false}
                >
                <TableHeader enableSelectAll={p.enableSelectAll}>
                    {caption}
                    <TableRow>
                        {this.renderHeaders(p)}
                    </TableRow>
                    <TableRow><TableHeaderColumn colSpan={this.props.headers.length}>{content}</TableHeaderColumn></TableRow>
                </TableHeader>
                <TableBody></TableBody>
            </Table>
    }


    onRowSelection(ids){

            const data = this.displayData;

            const selected = (ids==='all')?data:ids.map(idx=>data[idx]);

            const idName = this.props.idName || 'id';

            const selectedIds = selected.reduce((r, e)=>(r[e[idName]]=1, r),{});

            this.callPropsHook('onRowSelection',selected, selectedIds);
    }

    onCellClick(rowNumber, columnId){

        if (!columnId) return;

        const row = this.state.data[rowNumber];

        this.callPropsHook('onItem',row);

        this.props.headers[columnId-1] && this.callPropsHook(`onCell_${this.props.headers[columnId-1].id}`,row);

        return false;

    }
}