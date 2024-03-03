import DataDrivenComponent from '../DataDrivenComponent.jsx';
import {Tabs,Tab} from 'material-ui/lib/tabs';

export default class TabsComponent extends DataDrivenComponent {

    renderWithData(data) {

        const p = this.props;
        const st = this.state;

        return <Tabs value={st.value} onChange={p.onChange}>{
            data.map(t=>(<Tab key={t.id} label={t.name|| t.label || this.string(`${t.id}`)} value={t.id}>{t.content||null}</Tab>))
        }</Tabs>;
    }
}