import Component from 'ui/Component.es6';
import {STIFFENER_SIZES} from  '../../configs/Enums.es6'

export default class StiffenerSize extends Component {

    static TEMPLATE = (
        <div class="stiffener-size">
            <div class="stiffener-size-wr validate">
                <div class=":{stiffenerSizeBox:true, active:(:value) == (:item.id), disabled :(:item.disabled)}"
                     each="item of :data"
                     data-value=":item.id"
                     click=':updateOnClick'
                >
                    <label class=":(stiffener-size-label (:payload.stiffenerType) (:payload.stiffenerType)-(:item.id))"></label>

                    <p>:item.caption</p>

                </div>
            </div>
        </div>
    );

    // getData (){
    //
    //     const data = this.getState('data');
    //
    //     return STIFFENER_SIZES.map (item=>({...item, disabled:!data.find(d=>d.id===item.id)}))
    // };

}


//