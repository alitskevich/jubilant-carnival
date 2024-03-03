/**
 * Created by Ihar_Abukhouski on 10/16/2015.
 */
import Component from '../BaseComponent.jsx';
import {Card, CardTitle, CardText} from 'material-ui/lib/card';

export default class CardComponent extends Component {

    render() {
        const p = this.props;

        return (
            <Card {...p}>
                {
                    this.renderTitle(p)
                }
                <CardText expandable={p.expandable}>
                    {p.children}
                </CardText>
            </Card>
        );
    }

    renderTitle(p) {

        if (!p.caption) return null;

        return (
            <CardTitle
                title={p.caption}
                showExpandableButton={p.expandable}
            />
        );

    }

}