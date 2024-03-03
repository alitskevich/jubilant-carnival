import ui from 'jsx-ui';
import Avatar from 'material-ui/lib/avatar';

const DoseColors = {
    0: 'gray',
    1: '#6eb3b9',
    2: 'red'
}
/**
 *
 <svg width={w} height={h}>
 <g fill="">
 <circle cx={wh} cy={wh} r="10"
 style={{stroke:DoseColors[d.dozeLevel||0],strokeWidth: 2,fill:DoseColors[d.dozeLevel||0]}}/>
 </g>
 </svg>
 * @type {*[]}
 */
const HEADERS = [
    {
        id: 'examinations',
        render: (r, d, table)=><div><Avatar onClick={()=>(table.callPropsHook('nextFilter'),false)}
                                            backgroundColor={DoseColors[d.dozeLevel||0]}
                                            style={{margin: '10px'}}>{d.type}</Avatar>
            <span style={{fontSize:'14px', color:'#d0d0d0'}}>{d.name}</span>
        </div>
        ,
        headerRender: (table)=><div style={{display: 'flex'}}><div>Examinations</div></div>

    }
    ,
    {
        id: 'dot',
        width: '60px',
        render: function (r, d) {
            const w = 30, h = 30, wh = w / 2;
            return <div>

                <b className="" style={{margin: '0px',backgroundColor2:'#0e2e2e'}}>{d.totalEffectiveDoze}</b>

            </div>;
        }
        ,
        headerRender: (table)=> null
        ,
        headerRender2: function (table) {
            const w = 30, h = 30, wh = w / 2;
            return <div>

                <svg width={w} height={h}>
                    <g fill="">
                        <circle cx={wh} cy={wh} r="10" style={{stroke:'#666666',strokeWidth: 2,fill:'#cccccc'}}/>
                    </g>
                </svg>
            </div>;
        }
    }
];

export default class ExamsList extends ui.Component {

    render() {

        const dozeLevelFilter = this.state.dozeLevelFilter || 0;
        return (
            <ui.Table
                filter={(d)=>(!dozeLevelFilter||(d.dozeLevel===dozeLevelFilter))}
                dataFrom='api:examList'
                enableSelectAll={false}
                multiSelectable={true}
                displaySelectAll={true}
                selectedIds={this.props.selectedIds}
                showRowHover={false}
                nextFilter={()=>this.setState({dozeLevelFilter:(dozeLevelFilter+1)%3})}
                onCell_examinations={(data)=>{
                        this.examsClick=true;
                        this.callPropsHook('onSelection',[data],{[data.id]:1});
                    }}
                onRowSelection={(data, selectedIds)=>{
                        if (!this.examsClick){
                            data  = data.slice(0,3);
                            selectedIds = data.reduce((r, e)=>(r[e.id]=1, r),{});
                            this.callPropsHook('onSelection',data,selectedIds)

                        }
                        this.examsClick=false;
                    }}
                headers={HEADERS}
                />
        );
    }
}

