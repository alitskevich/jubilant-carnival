import Input from './Input.jsx';
import DropDownMenu from 'material-ui/lib/drop-down-menu';

//import Select from 'react-select';

const DELIMITER = ';';
const OPTION_ALL = {value: 'ykyynilvmlfbpaeiyjcfsowzeeueruse', label: 'Select all'};

/**
 *The dropdown input react component
 *
 *
 * @see http://material-ui.com/#/components/dropdown-menu
 */
export default class DropDownMulti extends Input {


    constructor(props, context) {

        super(props, context);

    }

    onValueChanged(newSelection) {
        let v;
        if (newSelection.indexOf(OPTION_ALL.value)!=-1) {
            //then select all...
            v = '';
            this.getOptions(this.state.data).map((opt)=> {
                if (v.length) {
                    v = v.concat(DELIMITER);
                }
                v = v.concat(opt.value);
            });
        } else {
            v = newSelection
        }
        this.onValueChanged(v);
    }

    renderInput(p, st) {

        const opts = (st.data || []).map((item) => ({value: item.id + '', label: item.name || item.label || item.id}));
        if (this.props.selectAllAllowed) {
            opts.unshift(OPTION_ALL);
        }
        return <Select
            id={this.id}
            value={st.value ? st.value.split(DELIMITER) : []}
            delimiter={DELIMITER}
            multi={true}
            options={opts}
            disabled={p.disabled}
            onChange={this.onValueChanged.bind(this)}
            />
    }
}
