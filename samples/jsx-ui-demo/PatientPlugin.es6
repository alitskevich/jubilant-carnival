import {Plugin} from 'applugins';
import PatientsPage from './PatientsPage.jsx';
import PatientPage from './PatientPage.jsx';
import ExamList from './components/ExamList.jsx';

/**
 * Networks plugin.
 */
export default class PatientPlugin extends Plugin {

    onUi_registerPage() {

        return [
            {
                id: 'patients',
                component: PatientsPage
            }
            ,
            {
                id: 'patient',
                path: `patient/:id`,
                component: PatientPage
            }
        ];
    }

    onUi_registerFormFieldType() {
        return [
            {
                id: 'netmask',
                component: ExamList
            }

        ];
    }

    onPatient_info(params) {

        return this.promit(`api:doc`, params);
    }

    onPatient_list(params) {

        return this.promit(`api:patientList`, {fields: ['comment'], ...params});
    }

    onPatient_remove(ids) {

        return this.promit(`wapi:delete?kind=${WAPI_KIND}`, {_ref: ids[0]._ref});
    }

    onPatient_update({payload:{_ref, name, comment}}) {

        return this.promit(`wapi:update`, {kind: WAPI_KIND, _ref, payload: {name, comment}})
    }

    onPatient_insert({payload:{ name, comment}}) {

        return this.promit(`wapi:create`, {kind: WAPI_KIND, payload: {name, comment}})
    }

}