import Component from 'ui/Component.es6';
import {STIFFENER_TYPES} from  '../../configs/Enums.es6'

export default class StiffenerType extends Component {

    static TEMPLATE = (
        <div class="stiffener-type">
            <div class="stiffener-wr validate">
                <div class=":{stiffenerBox:true, active:(:value) == (:item.id), disabled :(:item.disabled)}"
                     each="item of :data"
                     data-value=":item.id"
                     disabled = ":item.disabled"
                     click=':updateOnClick'
                >

                    <label class=":(stiffener-label stiffener-label-(:item.id))"></label>

                    <p>:item.caption</p>
                </div>
            </div>
        </div>
    );



    getData (){

        const data = this.getState('data');

        return STIFFENER_TYPES.map (item=>({...item, disabled:!data.find(d=>d.id===item.id)}))
    };
}
