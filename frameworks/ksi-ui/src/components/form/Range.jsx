import Component from 'ui/Component.es6';


export default class UiRange extends Component {

    static TEMPLATE = (
        <div>
            <span>:value</span>

            <input
                type=':meta.type'
                class='form-control'
                min=':min'
                max=':max'
                step=':payload.stiffenerSpacing'
                value=':value'
                change=':onChange'
            />

        </div>
    );
}