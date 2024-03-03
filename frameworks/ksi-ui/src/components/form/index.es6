import Form from './Form.jsx';
import Input from './Input.jsx';
import Number from './Number.jsx';
import Hidden from './Hidden.jsx';
import Dropdown from './Dropdown.jsx';
import Select from './Select.jsx';
import Range from './Range.jsx';
import StiffenerType from './StiffenerType.jsx';
import StiffenerSize from './StiffenerSize.jsx';
import Breadcrumbs from './Breadcrumbs.jsx';
import Dimentions from './Dimentions.jsx';
import PanelWidthRange from './PanelWidthRange.jsx';
import ErrorMsg from './ErrorMsg.jsx';
import Confirmation from './../Submitted.jsx';


Form.registerFieldType('string', Input);
Form.registerFieldType('number', Number);
Form.registerFieldType('range', Range);
Form.registerFieldType('dropdown', Dropdown);
Form.registerFieldType('enum', Select);
Form.registerFieldType('hidden', Hidden);
Form.registerFieldType('stiffener', StiffenerType);
Form.registerFieldType('stiffenerSize', StiffenerSize);
Form.registerFieldType('panelWidthRange', PanelWidthRange);
Form.registerFieldType('error', ErrorMsg);
Form.registerFieldType('dimentions', Dimentions);
Form.registerFieldType('confirmation', Confirmation);
Form.registerFieldType('breadcrumbs', Breadcrumbs);

export default Form;