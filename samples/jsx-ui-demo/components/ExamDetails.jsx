import ui from 'jsx-ui';
import EventList from './EventList.jsx';
import InfoTable from './../../ui/components/InfoTable.jsx';
import Visualization from './Visualization.jsx';

const {Card,Article,Form,Toolbar,Button, MainAction, Grid, Tabs} = ui;

import CardCaption from './CardCaption.jsx';

export default class ExamDetails extends ui.Component {

    render() {

        const p = this.props;

        const exam = p.exam;

        const tab = p.examTab;

        if (tab == 'events') {
            return <div className={'col-md-12 col-sm-12'}>
                <CardCaption label={`${exam.name} Details`}></CardCaption><EventList />
            </div>
        }

        if (tab == 'visualization') {
            return <div className={''}>
                <div className="">
                    <div className={'col-md-3 col-sm-12'}>
                        <CardCaption label={`Info`}></CardCaption>
                    </div>
                    <div className={'col-md-9 col-sm-12'}>
                        <CardCaption label={`Visualization`}></CardCaption>
                    </div>
                </div>
                <div className="">

                    <div className={'col-md-3 col-sm-12'}>
                        <InfoTable meta="forms.ExamVisualization" data={exam}/>
                    </div>

                    <div className={'col-md-7 col-sm-12'}>
                        {exam.type === 'XA'
                            ?
                                <div style={{display:'flex', alignItems: 'center'}}>
                                    <Visualization cylinder={"/png/cylindrical.png"} height={550}/>
                                </div>
                            :
                            (exam.type === 'MG'
                                ?
                                <img ref="bigpicture" src="/png/mg/mg1.png" style={{width:'100%'}}/>
                                :
                                <img ref="bigpicture" src="/png/capture-20151208-102621.png" style={{width:'100%'}}/>
                            )
                        }
                    </div>

                    <div className={'col-md-2 col-sm-12'}>
                        {exam.type === 'XA'
                            ?
                            null
                            :
                            (exam.type === 'MG'
                                ?
                                <div>
                                    <img src="/png/mg/mg1.png" onClick={(e)=>(this.refs.bigpicture.src=e.target.src)}
                                         style={{width:'100%', margin:'10px',boxShadow: 'rgba(0, 0, 0, 0.84902) 2px 2px 20px'}}/>
                                    <img src="/png/mg/mg2.png" onClick={(e)=>(this.refs.bigpicture.src=e.target.src)}
                                         style={{width:'100%', margin:'10px',boxShadow: 'rgba(0, 0, 0, 0.84902) 2px 2px 20px'}}/>
                                    <img src="/png/mg/mg3.png" onClick={(e)=>(this.refs.bigpicture.src=e.target.src)}
                                         style={{width:'100%', margin:'10px',boxShadow: 'rgba(0, 0, 0, 0.84902) 2px 2px 20px'}}/>
                                    <img src="/png/mg/mg4.png" onClick={(e)=>(this.refs.bigpicture.src=e.target.src)}
                                         style={{width:'100%', margin:'10px',boxShadow: 'rgba(0, 0, 0, 0.84902) 2px 2px 20px'}}/>
                                </div>
                                :
                                <div>
                                    <img src="/png/capture-20151208-102621.png" onClick={(e)=>(this.refs.bigpicture.src=e.target.src)}
                                         style={{width:'100%', margin:'10px',boxShadow: 'rgba(0, 0, 0, 0.84902) 2px 2px 20px'}}/>
                                    <img src="/png/pelvis_fullsize_distr.png" onClick={(e)=>(this.refs.bigpicture.src=e.target.src)}
                                         style={{width:'100%', margin:'10px',boxShadow: 'rgba(0, 0, 0, 0.84902) 2px 2px 20px'}}/>
                                </div>
                            )

                        }
                   </div>
                </div>
            </div>
        }

        return (
            <div className="row">

                <div className={'col-md-4 col-sm-12'}>
                    <CardCaption label={`General`}></CardCaption>
                    <InfoTable meta="forms.ExamGeneral" data={exam}/>
                </div>

                <div className={'col-md-4 col-sm-12'}>
                    <CardCaption label={`Dose`}></CardCaption>
                    <InfoTable meta="forms.ExamDose" data={exam}/>
                </div>

                <div className={'col-md-4 col-sm-12'}>
                    <CardCaption label={`Device`}></CardCaption>
                    <InfoTable meta="forms.ExamDevice" data={exam}/>
                </div>

            </div>
        );
    }
}

