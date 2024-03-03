import Component from '../BaseComponent.jsx';

/**
 * Article UI component.
 */

export default class Article extends Component {

    render() {

        const p = this.props;

        return (
            <div
                className="container"
                style={{
                    maxWidth: '100%',
                    paddingTop:'1em'
                }}
            >
                    {p.children}
            </div>
        );

    }

}