import {default as App, Plugin} from 'applugins';

const changedCbWrapperFactory = function (changedKey, cb) {
    return (err, result)=> {

        if (err) {

            cb(err);

        } else {

            cb(null, result);

            App.instance().emit(changedKey)
        }
    }
};

const listCbWrapperFactory = function (cb, adapter) {
    return (err, result)=> {

        cb(err, !err && result && result.map(e=>adapter({...e})).filter(e=>e));
    }
};

const isDocMatched = function (params) {
    for (let key of Object.keys(params)) if (params[key] !== undefined) {
        if (this[key] != params[key]) {
            return false;
        }
    }

    return true;
};

export default class APIPluginCli extends Plugin {

    async init() {

        super.init();

        await this.fetchResources('/meta?sheet=stubs');

        const countries = [] || await this.remote({path: 'country'});

        //this.event('resource://add', {countries});
        //this.app.addResources({countries});

        this.countries = (countries || []).reduce((r, c)=>(r[c.id] = c.name, r), {});

    }


    //////////////////////
    // CRUD
    /////////////////////

    onApi_doc({id}) {

        const patients = this.onPatientList({});

        return patients.find(e=>(e.id == id));

        //this.remote( {path: `${_ref}`}, cb);
    }

    onApi_create({kind, payload}, cb) {

        this.remote({path: kind, payload}, changedCbWrapperFactory.call(this, cb, `wapi:${kind}Changed`));
    }

    onApi_update({kind, _ref, payload}, cb) {

        this.remote({path: _ref, payload, method: "put"}, changedCbWrapperFactory.call(this, cb, `wapi:${kind}Changed`));
    }

    onApi_delete({kind, _ref}, cb) {

        this.remote({path: _ref, method: "del"}, changedCbWrapperFactory.call(this, cb, `wapi:${kind}Changed`));
    }

    //////////////////////
    // Hospital
    /////////////////////

    onApi_hospitalList(params, cb) {

        this.remote(`/api/hospital`, listCbWrapperFactory(cb, (doc)=> {

            //if (!isDocMatched.call(doc, params)) return null;

            return {...doc, countryName: (this.countries[doc.countryId] || 'x')};

        }));
    }

    onApi_hospital({id}) {

        return this.remote(`/api/hospital/${id}`);
    }

    onApi_createHospital(payload, cb) {

        this.remote({path: `hospital`, payload}, changedCbWrapperFactory('hospitals', cb));
    }

    async onApi_updateHospital(delta, cb) {

        const doc = await this.onHospital(delta);

        const payload = {...doc, ...delta};

        this.remote({path: `hospital`, payload}, changedCbWrapperFactory('hospitals', cb));
    }

    async onApi_activateHospital({id}, cb) {


        const doc = await this.onHospital({id});

        const payload = {...doc, isActive: !doc.isActive};

        this.remote({path: `hospital`, payload}, changedCbWrapperFactory('hospitals', cb));
    }

    //////////////////////
    // Patient
    /////////////////////

    onApi_patientList() {

        return this.resource('stub.patients');
        //this.remote( {path: `${kind}?_return_fields=${(fields||[]).join(',')}`}, listCbWrapperFactory(cb));
    }

    onApi_examList(params) {

        return this.resource('stub.exams');
    }

    onApi_eventList(params) {

        return this.resource('stub.events');
    }
}