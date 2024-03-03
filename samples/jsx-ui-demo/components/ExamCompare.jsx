import ui from 'jsx-ui';
import Visualization from './Visualization.jsx';
import CardCaption from './CardCaption.jsx';

export default class ExamCompare extends ui.Component {

    render() {

        const exams = this.props.exams;

        const [exam,exam1,exam2] = exams;

        const columnClass = this.resolveClassNames({'col-sm-12': 1, [`col-sm-${exam2 ? '4' : '6'}`]: 1});

        return (
            <div className="row">

                <div className={columnClass}>
                    <CardCaption label={`${exam.name}`}></CardCaption>
                    <Visualization/>
                    <ui.InfoTable meta="forms.ExamGeneral" data={exam}/>

                </div>

                <div className={columnClass}>
                    <CardCaption label={`${exam1.name}`}></CardCaption>
                    <Visualization/>
                    <ui.InfoTable meta="forms.ExamGeneral" data={exam1}/>

                </div>

                {!exam2 ? null :
                    <div className={columnClass}>
                        <CardCaption label={`${exam2.name} Device`}></CardCaption>
                        <Visualization/>
                        <ui.InfoTable meta="forms.ExamGeneral" data={exam2}/>

                    </div>
                }

            </div>
        );
    }
}

