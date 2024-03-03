import Component from '../BaseComponent.jsx';

/**
 * Grid UI component.
 */

export default class Grid extends Component {

    render() {
        const p = this.props;
        let all = p.children || [];

        if (!Array.isArray(all)){
            all = [all];
        }

        return (
            <div className="row">
                 {all.map((ch, idx)=>(<div key={`g${idx}`} className={p.cellClass || 'col-md-12'}>{ch}</div>))}
            </div>
        );
    }
}