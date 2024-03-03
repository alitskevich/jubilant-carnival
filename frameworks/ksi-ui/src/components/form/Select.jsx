import Component from 'ui/Component.es6';

export default class UiSelect extends Component {

    static TEMPLATE = (

        <select class='form-control' change=':onChange' value=':value'  style=":{'display' :(:visibile)}">

            <option value='' selected=':isSelected'></option>
            <option
                each='datum of :data' 
                value=':datum.id'
                selected=':isSelected'
            >
                :datum.caption
            </option>
        </select>
    );



    onChange(ev){

        const select = ev.currentTarget;
        const value = select.options[select.selectedIndex].value;

        this.set('value', value);

        console.log('Length', this.get('data.length'));

    }

    getIsSelected() {

        return this.get('datum.id') === this.get('value');

    }

    // getVisibile(){
    //     return this.get('data.length') > 1 ? 'block' : 'none';
    //
    // };
    
}