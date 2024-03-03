import Component from 'ui/Component.es6';
import * as Enums from '../configs/Enums.es6';
import Picture from './form/Picture.jsx';

export default class Preview extends Component {



    static TEMPLATE = (

        <div id="modal" class="modal" style="display:block">
            <div class="modal-header">
                <span>Inquiry Summary</span>
            </div>
            <div class="modal-body">
                <small if=":specialTransport">NOTE: This configuration requires Special Transport</small>
                <table class="table table-reflow" cellspacing="0">
                    <tbody>
                    <tr>
                        <td>Alloy:</td>
                        <td>Stiffener Type:</td>
                        <td>Stiffener Size:</td>
                        <td>Deck Thickness:</td>
                        <td>Stiffener Spacing:</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>:alloyCaption</th>
                        <th>:StiffenerTypeCaption</th>
                        <th>:StiffenerSizeCaption</th>
                        <th>:(:data.deckThickness) mm</th>
                        <th>:(:data.stiffenerSpacing) mm</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>Panel Width:</td>
                        <td>Panel Length:</td>
                        <td>Panel Weight:</td>
                        <td>Quantity of Panels:</td>
                        <td>Total Weight:</td>
                        <td if=":data.classSociety">Class Society:</td>
                    </tr>
                    <tr>
                        <th>:((:data.panelWidth) mm ((:panelCount) profiles))</th>
                        <th>:(:data.paneldimentions) mm</th>
                        <th>:(:data.panelWeight) kg</th>
                        <th>:(:data.quantityOfPanels) pcs</th>
                        <th>:(:data.totalWeight) kg</th>
                        <th if=":data.classSociety">:data.classSociety</th>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="picture">
           <Picture  payload=":data"/>
            </div>

            <button if=":activeStep isnt 5" class='btn btn-primary btn-block next' click=':onSuccess'>Continue</button>
            <button class=':(btn btn-primary btn-block prev (:currentStep))' click=':onCancel'>Back</button>

        </div>

    );
    getAlloyCaption (){
        const id = this.get('data.alloy');
        return Enums.ALLOY_TYPES.find(item=>(item.id==id)).caption
    };

    getStiffenerTypeCaption (){
        const id = this.get('data.stiffenerType');
        return Enums.STIFFENER_TYPES.find(item=>(item.id==id)).caption
    };

    getStiffenerSizeCaption (){
        const id = this.get('data.stiffenerSize');
        return Enums.STIFFENER_SIZES.find(item=>(item.id==id)).caption
    };

    getPanelCount(){
        const panelWidth = this.get('data.panelWidth') ;
        const stiffenerSpacing = this.get('data.stiffenerSpacing');
        const count = Math.round(panelWidth/stiffenerSpacing);
        return count
    };

    getSpecialTransport(){
     return this.get('data.panelWidth') > 2400;
    };

    getCurrentStep(){
        return +this.get('activeStep') === 5 ? 'center' : '';
    };
   }

