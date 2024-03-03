import Component from 'ui/Component.es6';

export default class UiInput extends Component {

    static TEMPLATE = (
        <div>

            <input
                class=':form-control'
                placeholder=':meta.placeholder'
                value=':value'
                change=':onChange'
            />
            
        </div>
    );

    onChange(ev) {

        this.set('value', ev.target.value);
    }

}
