import Component from 'ui/Component.es6';
import Picture from './Picture.jsx';

export default class Dimensions extends Component {



    static TEMPLATE = (
        <div>
           <Picture payload=":payload"/>
            <div class="range">
                <span>:(:value) mm</span>
                <input type='button' value='+' class='qtyplus' click=":plus" field='quantity'/>


                <input type='button' value='-' class='qtyminus' click=":minus" field='quantity'/>

            </div>
            <small class="rangemax">max: 18000</small>
            <small class="rangemin">min: 6000</small>
            <div class="bordermax"></div>
            <div class="bordermin"></div>
        </div>
        

    );
   

    onChange(ev) {
        this.set('value', +ev.target.value);
    }

    plus(){
        this.set('value',  Math.min(18000, +this.get('value')+1000));
    }

    minus(){
        this.set('value', Math.max(6000, +this.get('value')-1000));
    }




}


