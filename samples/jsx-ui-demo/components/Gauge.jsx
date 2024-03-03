import ui from 'jsx-ui';
import d3 from 'd3';

export default class Gauge extends ui.DataDrivenComponent {

    static defaultProps = {
        height: 350,
        width: 120,
        level: 0,
        data: [0.1, 0.5, 1, 2, 3, 5, 8, 9, 11, 15, 18, 24],
        ranges: [1, 5, 15]
    };

    renderWithData(data) {
        const props = this.props;
        const st = this.state;

        //const container = this.refs.container;

        const h = props.height;//||container.clientHeight;
        const w = props.width;//||container.clientWidth;

        const level = props.level;

        //data = d3.scale.log().domain([0, 100])
        const dataScale = d3.scale.log().range([0, 50]);
        data = d3.range(1, 100).map((n)=>(100 - dataScale(100 - n)));

        var yScale = d3.scale.linear().domain([0, d3.max(data)]).range([0, w - 20]);
        var xScale = d3.scale.ordinal().domain(d3.range(data.length)).rangeRoundBands([0, h], 0.05);

        var t = d3.scale.threshold().domain(props.ranges).range(['green', 'yellow', 'red']);

        var bars = data.map((y, x)=> <rect
                x={20}
                y={h-xScale(x)-xScale.rangeBand()}
                width={yScale(y)}
                height={xScale.rangeBand()*0.7}
                fill={y<level?t(y):"grey"}
                key={x}/>
        );

        return (

            <div ref="container" style2={{width:'50em',height:'50em'}}>
                <svg width={w} height={h}>
                    <g fill="white">{bars}</g>
                </svg>
            </div>

        );
    }

}

