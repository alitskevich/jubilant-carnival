import Component from '../BaseComponent.jsx';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';


export default class ButtonComponent extends Component {

    render() {

        const p = this.props;
        const st = this.state;

        const merged = {...p, ...st};

        if (p.mode==='flat'){

            return <FlatButton {...merged}></FlatButton>
        }

        return <RaisedButton {...merged}></RaisedButton>;
    }
}