import Component from 'ui/Component.es6';

export default class Hidden extends Component {

    static TEMPLATE = (
        <input
            style="display:none"
            class=':form-control'
            value=':value'
            change=':onChange'
        />
    );

    init() {

            this.log('init', this.get('value'));
            this.hook('valueChanged', this.get('value'), this.state);


    }

    didUpdatedProps(props, old){
        const val = props['value'];
        if (!isNaN(val) && old.value!=val){
            this.log('didUpdatedProps', val);
            this.hook('valueChanged', val, this.state)
        }
    }    
}

