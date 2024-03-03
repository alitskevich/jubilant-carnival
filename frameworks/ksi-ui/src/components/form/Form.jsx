import Component from 'ui/Component.es6';

const TYPES = {};

export default class UiForm extends Component {

    static registerFieldType(key, type) {

        TYPES[key] = type;
    }

    static TEMPLATE = (
        <form>
            <fieldset class=':fieldSetClass' each='field of :fields' if=':fieldVisible'>
                <span if=':field.caption'>:field.caption</span>
                <component
                    type=":fieldType"
                    fieldId=':field.id'
                    meta=':field'
                    payload=':data'
                    data=':field.data'
                    value=':fieldValue'
                    valueChanged=':onFieldValueChanged'
                />
                <small if=':fieldError'>:fieldError</small>
                <em if=':field.hint'>:field.hint</em>


            </fieldset>

            <div if=':error' class='alert alert-danger'>:(Error: (:error.message))</div>
        </form>
    );


    getFieldError() {

        const meta = this.get('field');
        const fieldId = meta.id;

        const errors = this.get('errors') || {};

        return errors[fieldId];

    };


    getFieldSetClass() {

        const meta = this.get('field');
        const fieldId = meta.id;

        const errors = this.get('errors') || {};

        const hasError = errors[fieldId];

        return `form-group ${fieldId} ${hasError ? "error" : ''}`
    };


    getFieldValue() {

        const meta = this.get('field');

        const fieldId = meta.id;
        const data = this.get('data');

        let value = this.get(`data.${fieldId}`);

        const fieldData = meta.data;

        if (fieldData) {
            const item = fieldData.find(({id}) => id === value);
            if (!item) {
                value = null;
            }
        }

        if (meta.type === 'enum') {

            //auto complete for single option
            if (fieldData.length === 1) {
                // value = fieldData[0].id;
            }
        } else if (!value && meta.defaultValue) {

            value = meta.defaultValue;
        }

        return value;
    };

    getFieldVisible() {

        const dependsOn = this.get('field.dataDependsOn');

        return true; //!dependsOn || !dependsOn.find(key=>!this.get(`data.${key}`));
    };

    getFieldType() {

        return TYPES[this.get('field.type')] || TYPES['string']
    };

    onFieldValueChanged(value, state) {
        // this.log('value', value);
        const data = {...this.get('data'), [state.fieldId]: value};

        this.set('data', data);
    }
};
