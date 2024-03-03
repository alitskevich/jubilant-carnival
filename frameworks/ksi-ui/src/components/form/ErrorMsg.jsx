import Component from 'ui/Component.es6';

export default class UiErrorMsg extends Component {

    static TEMPLATE = (
        <div class='alert alert-error'>:data.0.message</div>
    );
}