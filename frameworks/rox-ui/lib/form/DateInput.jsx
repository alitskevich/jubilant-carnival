import Input from './Input.jsx';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

/**
 * The date input react component.
 */
export default class DateInput extends Input {

    renderInput(p, state) {
        return <DateTimePicker
            defaultValue={Date.parseStr(p.value)}
            time={false}
            className={this.inputClassName}
            format={"yyyy-MM-dd"}
            disabled={p.disabled}
            onChange={(date, str)=>this.onValueChanged(str)}
            />
    }
}

