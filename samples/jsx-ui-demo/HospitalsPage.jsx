import ui from '../ui';
import HospitalsListHeaders from './HospitalsListHeaders.jsx';

/**
 * Hospitals List Page
 */
export default class HospitalsPage extends ui.Page {

    static defaultProps = {

        dataFrom: "storage://get/hospitalFilter"
    };

    renderWithData(data) {

        const rightGroup = <ui.Tabs
            data={this.resource("tabs.Hospitals")}
            value={data.isActive}
            onChange={(isActive)=>this.updateFilter({isActive})}
            />;

        return (
            <div>

                <ui.NavBar title="Hospitals" mode="top" rightGroup={rightGroup}/>

                <ui.FixedAside sideWidth={300}>

                    <ui.Form
                        meta="forms.HospitalsFilter"
                        data={data}
                        onDataChanged={::this.updateFilter}
                    />

                    <ui.SuperTable
                        dataFrom="hospitals://list"
                        dataDependsOn="api://changed/hospitals; storage://changed/hospitalFilter"
                        onItem={::this.editItem}
                        toggleIsActive={(data, cb)=>this.emit("api:activateHospital", data, cb)}
                        headers={HospitalsListHeaders()}
                    />

                </ui.FixedAside>

                <ui.MainAction icons="add" onClick={::this.createNew}/>

            </div>
        );
    }

    createNew(data = {}) {

        return this.promit("ui://dialogForm", {
            caption: `Create a new hospital`,
            meta: 'forms.Hospital',
            data,
            submitTo: (data, cb)=>this.emit(`api://createHospital`, data, cb)
        });
    }

    updateFilter(payload) {

        return this.promit("storage://hospitalFilter", {payload});
    }

    editItem({id, name}) {

        return this.promit("ui://dialogForm", {
            caption: `Edit ${name}`,
            meta: 'forms.Hospital',
            dataFrom: `api://hospital/${id}`,
            submitTo: (data, cb)=>this.emit(`api://updateHospital`, data, cb)
        });
    }
}
