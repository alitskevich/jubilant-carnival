import {Plugin, event} from 'applugins';
import HospitalsPage from './HospitalsPage.jsx';
import {FILTER_ADAPTER} from './HospitalsUtils.es6';

/**
 * The client-side Plugin that provides UI to manage Hospitals.
 */
export default class HospitalsPlugin extends Plugin {

    onUi_registerPages() {

        return {id: 'hospitals', component: HospitalsPage};
    }

    async onHospitals_list() {

        const filter =  FILTER_ADAPTER(event("storage://get/hospitalFilter").action());

        return event(`api://hospitalList`).withData(filter).promise();
    }
}