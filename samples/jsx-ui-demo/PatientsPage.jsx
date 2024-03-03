import ui from '../ui/index.es6';

const HEADERS = {
    'name': {render: (h, d)=>(<a href={'#/patient/'+d.id}>{`${d.lastName}, ${d.firstName} `}</a>)}
};

//.map(h=>Object.assign(h,HEADERS[h.id]))
export default class PatientsPage extends ui.Page {

    render() {

        return (
            <div>
                <ui.NavBar title="Patients" mode="top"/>
                <ui.Article>
                    <ui.Table
                        filter={(d)=>(!this.state.keyword||d.name.includes(this.state.keyword))}
                        dataFrom={`patients:list`}
                        dataDependsOn="patients:patientsChanged"
                        enableSelectAll={false}
                        multiSelectable={false}
                        displaySelectAll={false}
                        onRowSelection={(data)=> this.onRowSelection(data)}
                        headers={this.resource('headers.PatientList').map(h=>Object.assign(h,HEADERS[h.id]))}
                        />

                    <ui.Toolbar>

                        <ui.Button
                            ref="deleteButton"
                            label="Delete"
                            disabled={true}
                            onClick={()=>this.emitLocalAction('delete', this.selectedItems)}/>

                    </ui.Toolbar>

                    <ui.MainAction icons="add" onClick={()=>this.emitLocalAction('createvNew')}/>

                </ui.Article>
            </div>
        );
    }

    onRowSelection(data) {

        this.selectedItems = (data.length ? data : null);

        this.refs.deleteButton.setState({disabled: !this.selectedItems});
    }

    emitLocalAction(action, payload) {

        this.emit(`${this.pluginId()}:${action}`, payload);
    }

    pluginId(){
        return 'patients';
    }
}