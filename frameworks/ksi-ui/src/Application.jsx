import Component from 'ui/Component.es6';
import StepsWizard from './components/StepsWizard.jsx';
import Form from './components/form.js';
import Steps from './configs/FormMetadata.es6';
import Storage from './utils/Storage.es6';
import SubmitAction from './utils/SubmitAction.es6';
import SvgPreview from './components/SvgPreview.jsx';
import Preview from './components/Preview.jsx';
import Breadcrumbs from './components/form/Breadcrumbs.jsx';
import Submitted from './components/Submitted.jsx';
import Confirmation from './components/Confirmation.jsx';
import {getFieldsMeta} from './utils/Configurator.es6';

/**
 * The top-level UI component.
 *
 */
export default class Application extends Component {

    static DEFAULTS = {
        title: 'app_title'
    };
    static TEMPLATE = (


        <div class="container">
            <div if=":submitted">
                <Submitted/>
            <else>

                <nav class='navbar'>
                    <span>:title|text</span>
                    <Breadcrumbs data=":payload"/>
                    <button if=":activeStep isnt 1" class="btn btn-secondary" click=":resetForm">Reset</button>
                </nav>

                <StepsWizard items=":steps" value=":activeStep"/>

                <Form activeStep=":activeStep" fields=":formFields" data=":payload" errors=":errors"
                      dataChanged=":onFormData"/>

                <SvgPreview if=":activeStep is 3" data=":payload"/>

                <Preview activeStep=":activeStep" if=":showPreview" data=":payload" onSuccess=":onPreviewSuccess" onCancel=":onPreviewCancel"/>

                <div if=":remoteError" class="alert alert-danger">:remoteError</div>

                <a if=":activeStep is 5" class="inquiry" click=":preview" >Inquiry Summary</a>

                <button class='btn btn-primary btn-block prev' click=':prevStep' if=":activeStep isnt 1">Previous
                </button>

                <button class=':(btn btn-primary btn-block next (:centerButton) )' click=':nextStep'
                        if=":activeStep isnt 5">Next
                </button>

                <button if=":activeStep is 5" class='btn btn-primary btn-block next' click=":submit">Send Inquiry
                </button>

                <Confirmation if=":activeStep is 5" data=":payload" onSuccess=":onSuccess"/>
            </else>
            </div>
        </div>
    );


    done() {

        this.element.parentNode.removeChild(this.element);
    }

    getFormFields() {

        return getFieldsMeta(this.get('activeStep'), this.get('payload'));
    }

    getSteps() {

        return Steps;
    }

    getIsFirstStep() {

        return this.get('activeStep') == 1;

    }

    getCenterButton() {

        return this.getIsFirstStep() ? 'center' : '';
    }

    resetForm() {

        const reset = confirm(' Are you sure you want to reset all parameters?');
        if (reset) {
            this.updateAndStore({activeStep: '1', payload: {}, errors: {}});
        }
    }

    onFormData(payload) {
        const fields = getFieldsMeta(this.get('activeStep'), payload);
        fields.forEach((field)=> {

            const fieldData = field.data;

            if (fieldData) {
                const value = payload[field.id];

                const item = fieldData.find(({id}) => id === value);
                if (!item) {
                    payload[field.id] = null;
                }
            }
        });

        this.updateAndStore({payload, errors: {}});
    }

    setStep(activeStep) {

        this.updateAndStore({activeStep});
    }

    onPreviewSuccess() {

        this.set('showPreview', false);

        this.setStep('5');
    }

    onPreviewCancel() {

        this.set('showPreview', false);
    }

    validate() {
        const activeStep = '' + (+this.get('activeStep') + 1);

        const payload = this.get('payload');

        const fields = this.getFormFields();
        let hasErrors = false;

        const errors = fields.reduce((acc, field)=> {
            const value = payload[field.id];
            if (field.reqired && !value) {
                acc[field.id] = field.requiredMessage || "Please select";
                hasErrors = true;
                return acc
            }
            if (field.type == 'number' && value !=  +value) {
                acc[field.id] = "Not a number";
                hasErrors = true;
            }
            if (field.minValue  && (+value) < field.minValue ) {
                acc[field.id] = "Min order is " +field.minValue;
                hasErrors = true;
            }
            if (field.maxValue  && (+value) > field.maxValue ) {
                acc[field.id] = "Max order is " +field.maxValue;
                hasErrors = true;
            }
            if (field.type  == 'email' && !value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/)){

                acc[field.id] = "Please enter a valid email address" ;
                hasErrors = true;
            }
            
            return acc

        }, {});

        if (hasErrors) {
            this.set("errors", errors);
        }

        return !hasErrors;
    }

    nextStep() {
        const currentStep = +this.get('activeStep');

        const activeStep = '' + ( currentStep + 1);

        const payload = this.get('payload');

        if (this.validate()) {

            const delta = getFieldsMeta(activeStep === '5' ? '4' : activeStep, payload).reduce((acc, field)=> {
                const value = field.defaultValue;
                const needToUpdate = payload[field.id] === undefined || field.type === 'hidden';
                if (needToUpdate && value !== undefined) {
                    acc[field.id] = value;
                }


                return acc
            }, {});

            Object.assign(payload, delta);

            if (activeStep === '5') {
                this.set('showPreview', true);

                this.updateAndStore({payload});

            } else {

                this.updateAndStore({activeStep, payload});
            }
        }
    }

    preview(){
        this.set('showPreview', true);
    };

    submit() {

        this.set('remoteError', null);

        if (this.validate()) {
            const form = document.getElementById('submitForm');
            form.submit();
        }
    }

    submit2() {

        this.set('remoteError', null);

        if (this.validate()) {
            const payload = this.get('payload');

            SubmitAction(payload, (err)=> {
                if (err) {
                    this.set('remoteError', err);
                } else {
                    this.set('submitted', true);
                }
            });
        }
    }

    prevStep() {

        const activeStep = '' + (+this.get('activeStep') - 1);
        let payload = this.get('payload');

        if (activeStep !== '4') {
            const fields = this.getFormFields();

            const delta = fields.reduce((acc, field)=> {
                acc[field.id] = field.value;
                return acc
            }, {});

            Object.assign(payload, delta);
        }

        this.updateAndStore({activeStep, payload});
    }

    updateAndStore(delta) {

        this.update(delta);
        Storage.update(delta);
    }
};



