import ui from 'jsx-ui';
import ExamsList from './components/ExamList.jsx';
import EventList from './components/EventList.jsx';
import ExamDetails from './components/ExamDetails.jsx';
import ExamCompare from './components/ExamCompare.jsx';
import InfoTable from './../ui/components/InfoTable.jsx';
import Visualization from './components/Visualization.jsx';
import Gauge from './components/Gauge.jsx';
import RiskFactors from './components/RiskFactors.jsx';
import CardCaption from './components/CardCaption.jsx';

const {Page,Card,NavBar,Article,Form,Toolbar,Button, MainAction, Grid, Tabs} = ui;

export default class PatientPage extends Page {

    constructor(props, context) {

        super(props, context);

        //this.mainTabs = this.resource('tabs.PatientInfo');

        this.state = Object.assign(this.state, {currentTab: 0});//this.mainTabs[0].id
    }

    componentWillMount() {

        super.componentWillMount();

        const docId = this.props.params.id;

        this.reloadData(`patients:info`, {id: docId});
    }

    renderEmptyData() {

        return this.renderWithData({name: 'not_found'});
    }

    getPageTitle(data) {

        return `${data.firstName} ${data.lastName}, ${data.age} `;//(W:${data.weight} H:${data.height} BMI:${data.bmi})
    }

    getExamDetail(props, st, data, exam) {

    }

    renderWithData(data) {

        const props = this.props;
        const st = this.state;
        //
        var rightGroup = null, details = null, navbar, topPanelHeight = 600;

        const exams = st.selectedExams || [];
        const exam = exams[0];

        if (exam) {

            if (exams.length == 1) {

                topPanelHeight = 300;
                rightGroup = <Tabs key={this.uniqueKey()} dataFrom="res?key=tabs.Exam" value={st.examTab}
                                   onChange={(examTab)=>this.setState({examTab})}/>;

                navbar = <NavBar title={exam.name +" - "+this.getPageTitle(data)} mode="back"
                                 action={()=>this.setState({selectedExams:null, selectedExamIds:null, examTab:null})}
                                 rightGroup={rightGroup}/>;

                details = <ExamDetails exam={exam} examTab={st.examTab}/>

            } else {
                topPanelHeight = 10;
                rightGroup = null;
                navbar = <NavBar title={`Compare ${exams.length} exams - ${this.getPageTitle(data)}`} mode="back"
                                 action={()=>this.setState({selectedExams:[exam], selectedExamIds:{[exam.id]:1}})}
                                 rightGroup={rightGroup}/>;

                details = <ExamCompare exams={exams}/>
            }

        } else {

            navbar = <NavBar title={this.getPageTitle(data)}
                             mode="back"
                             action={()=>window.location.replace('/#patients')}
                             rightGroup={rightGroup}/>;
        }

        return (

            <div style={{position:'absolute', left:'0', top:'0', bottom:'0', right:'0'}}>
                {navbar}
                <div
                    style={{backgroundColor3:'#3e3e3e', position:'relative', left:'0', top:'0', paddingRight:'20px', width:'350px',paddingTop: '5px'}}>
                    <CardCaption label="patient_information"></CardCaption>

                    <InfoTable style={{maxHeight:'350px',margin: '20px', overflowY:'auto', paddingRight: '20px'}}
                               meta="forms.PatientInfo"
                               data={data}
                        />

                    <ExamsList style={{maxHeight:'350px',margin: '20px', overflowY:'auto', paddingRight: '20px'}}
                               selectedIds={st.selectedExamIds}
                               onItem={(exam)=>this.setState({exam})}
                               onSelection={(selectedExams, selectedExamIds)=>this.setState({selectedExams, selectedExamIds})}
                        />

                </div>
                <div style={{backgroundColor3:'#0e2e2e', position:'fixed', left:'350', padding:'10px', top:'60', bottom:'0', right:'0'
                ,boxShadow: 'rgba(0, 0, 0, 0.84902) 2px 2px 20px'}}>

                    <div
                        className={this.resolveClassNames({row:1, hidden:(exams.length>1) || exam && (st.examTab=="visualization")})}>
                        <div className={'col-md-3 col-sm-12'}>
                            <CardCaption label="dose_history"></CardCaption>

                            <Gauge level={75} ranges={[10,45]} height={topPanelHeight}/>

                        </div>
                        <div className={'col-md-6 col-sm-12'}>
                            <CardCaption label="exposure_history"></CardCaption>
                            <Visualization height={topPanelHeight}/>
                        </div>
                        <div className={'col-md-3 col-sm-12'}>
                            <CardCaption label="risk_factors"></CardCaption>
                            <RiskFactors height={topPanelHeight} width={120}/>
                        </div>
                    </div>

                    {exams.length == 1 && (st.examTab !== "visualization") ?
                        <hr style={{boxShadow: 'rgba(0, 0, 0, 0.84902) 2px 2px 10px'}}/> : null}

                    {details}

                </div>

            </div>
        );
    }

}