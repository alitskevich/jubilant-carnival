import Component from 'ui/Component.es6';
import * as Enums from '../../configs/Enums.es6';


export default class Breadcrumbs extends Component {

    static TEMPLATE = (
        <p>
            <small if=":data.alloy">:alloyCaption</small>
            <small if=":data.stiffenerType">: / (:StiffenerTypeCaption)</small>
            <small if=":data.stiffenerSize">: / (:StiffenerSizeCaption)</small>
            <small if=":data.deckThickness">: / Deck Thickness (:data.deckThickness) mm</small>
            <small if=":data.stiffenerSpacing">: / Stiffener Spacing: (:data.stiffenerSpacing)</small>
            <small if=":data.paneldimentions">: / Panel Length: (:data.paneldimentions) mm</small>
            <small if=":data.panelWidth">: / Panel Width: (:data.panelWidth) mm</small>
            <small if=":data.quantityOfPanels">: / (:data.quantityOfPanels) pcs</small>
            <small if=":data.classSociety">: / (:data.classSociety)</small>

        </p>

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

}



