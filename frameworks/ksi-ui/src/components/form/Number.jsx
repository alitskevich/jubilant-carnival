import Component from 'ui/Component.es6';

export default class UiNumber extends Component {

    static TEMPLATE = (
        <div>
            <input  type='button' value='-' class=':(qtyminus (:minValue))' click=":minus" field='quantity'/>
            <input
                class=':form-control'
                placeholder=':meta.placeholder'
                value=':value'
                change=':onChange'
            />
            <input  type='button' value='+' class='qtyplus'  click=":plus" field='quantity'/>
            <em>min: 20 pcs</em>

        </div>
    );

    onChange(ev) {

        this.set('value', +ev.target.value);
    }

     plus(){
        this.set('value', Math.min(100, +this.get('value')+1));
    }

     minus(){
        this.set('value', Math.max(20, +this.get('value')-1));
    }
    
    getMinValue(){
        return this.get('value') <= 20 ? 'minimal' : ''
    };
}
