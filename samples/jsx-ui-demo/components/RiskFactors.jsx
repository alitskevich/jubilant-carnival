import ui from 'jsx-ui';
import d3 from 'd3';

export default class RiskFactors extends ui.DataDrivenComponent {

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
        const wh = w / 2;

        const level = props.level;

        //data = d3.scale.log().domain([0, 100])
        const dataScale = d3.scale.log().range([0, 50]);
        data = d3.range(1, 100).map((n)=>(100 - dataScale(100 - n)));

        var yScale = d3.scale.linear().domain([0, d3.max(data)]).range([0, w]);
        var xScale = d3.scale.ordinal().domain(d3.range(data.length)).rangeRoundBands([0, h], 0.05);

        var t = d3.scale.threshold().domain(props.ranges).range(['green', 'yellow', 'red']);

        return (

            <div ref="container" style={{display:'flex', alignItems:'center'}}>
                <svg width={w} height={h} style={{marginLeft:'auto'}}>
                    <g fill="">
                        <line x1={wh} y1="40" x2={wh} y2={h-40}
                              style={this.style("stroke:#666666;stroke-dasharray: 10 5;")}/>
                        <line x1={wh} y1={h/2+40} x2={wh} y2={h-40}
                              style={this.style("stroke:#f00;strokeWidth:10;stroke-dasharray: 2 1;")}/>
                        <circle cx={wh} cy="40" r="20"
                                style={this.style("stroke:#666666;stroke-width: 3;fill:#cccccc")}/>
                        <circle cx={wh} cy={h-40} r="20"
                                style={this.style("stroke:#666666;stroke-width: 3;fill:#cccccc")}/>
                    </g>

                    <g fill="">

                    </g>
                </svg>
            </div>

        );
    }

}

