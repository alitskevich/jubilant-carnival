//import AceInput from './AceInput.jsx';
import Checkbox from './Checkbox.jsx';
//import DateInput from './DateInput.jsx';//TODO use material-ui component
import DropDown from './DropDown.jsx';
//import NumberInput from './NumberInput.jsx';//TODO use material-ui component
//import FileSelector from './FileSelector.jsx';
import Input from './Input.jsx';
import TextArea from './TextArea.jsx';

let fields = {
    DropDown,
    TextArea,
    //RichEditor,
    //DateInput,
    Input,
    //AceInput,
    //FileSelector,
    Checkbox
    //NumberInput
};

let types = {
    'enum': 'DropDown',
    'text': 'TextArea',
    'html': 'RichEditor',
    'date': 'Input',//'date': 'DateInput',
    'number': 'Input',//'number': 'NumberInput'
    'int': 'Input',//'int': 'NumberInput'
    'string': 'Input',
    'code': 'AceInput',
    'file': 'FileSelector',
    'bool': 'Checkbox',
    'boolean': 'Checkbox'
};

export {fields};

export default {

    registerFieldType(typeId,clazz) {
        types[typeId] = typeId;
        fields[typeId] = clazz;
    }
    ,
    resolve(typeId) {

        return fields[types[typeId] || types['string']];
    }
    ,
    fields
};