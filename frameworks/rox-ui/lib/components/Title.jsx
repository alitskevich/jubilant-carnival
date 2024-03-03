import Component from '../BaseComponent.jsx';

export default class Title extends Component {

    render() {

        const p = this.props;

        const {size = '1', text} = p;

        return React.createElement(`h${size}`, this.props, text);

    }
}