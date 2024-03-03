import DropDown from './DropDown.jsx';
import DropdownList  from 'react-widgets/lib/DropdownList';

const getSortAlphabeticallyComparator = (textField) => (a, b)=>{
    if (a[textField] < b[textField]) return -1;
    if (a[textField] > b[textField]) return 1;
    return 0;
};

/**
 *The input react component
 */
export default class DropDownExtended extends DropDown {

    renderInput(p, state) {
        let value = st.value;
        const options = (st.data || []).slice(0).sort(getSortAlphabeticallyComparator(p.textField));
        return <DropdownList className={this.inputClassName}
            value={value}
            valueField={p.valueField}
            textField={p.textField}
            groupBy={p.groupBy}
            data={options}
            disabled={p.disabled}
            onChange={(newValObj)=>this.onValueChanged(newValObj[p.valueField])}
            caseSensitive={false}
            filter='contains'
            />
    }


}

