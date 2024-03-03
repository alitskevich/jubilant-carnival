import Component from 'ui/Component.es6';

export default class UiDropdown extends Component {



    static TEMPLATE = (
        <div class='dropdown'>
            <button class='btn btn-secondary dropdown-toggle validate' type='button' id='dropdownMenu2'
                    click=':toggleAction' aria-haspopup='true' aria-expanded=':expanded'>
                :caption
            </button>
            <div class='dropdown-menu' aria-labelledby='dropdownMenu2' style=":{'display':!(:expanded)?'none':'block'}" click=":onClick">
                <button
                    class='dropdown-item'
                    type='button'
                    data-value=':datum.id'
                    each='datum of :meta.data'
                    click=":updateOnClick"
                    >
                    :datum.caption
                </button>
            </div>
        </div>
    );

    getIsDisabled() {

        return !this.get('data.length');
    }

    getCaption() {

        const value = this.get('value');
        const item = (this.get('data') || []).find(({id}) => id === value);

        return item ? item.caption || ' ' : 'Please select ';
    }

    toggleAction(){
        this.set('expanded',!this.get('expanded'))
    }

    onClick (ev){
         this.set('expanded', false);

            };



}