import Component from 'ui/Component.es6';

export default class Confirmation extends Component {

    static TEMPLATE = (
        <form id="submitForm" action="https://www.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8" method="POST">

            <input type="hidden" name="oid" value="00D200000008I2g"/>
            <input type="hidden" name="retURL" value="http://sapa-sbs.minsk.epam.com/panelConfigurator/thankyou.html"/>
            <input type="hidden" name="lead_source" value="Internet"/>
            <input type="hidden" name="00N20000001TVnb"
                   value="Panel Configurator Marine and Offshore"/>

            <input type="hidden" name="debug" value="1"/>
            <input type="hidden" name="debugEmail" value=""/>

            <input value=":data.company" name="company" type="hidden"/>
            <input value=":data.firstName" name="first_name" type="hidden"/>
            <input value=":data.lastName" name="last_name" type="hidden"/>
            <input value=":data.email" name="email" type="hidden"/>
            <input value=":data.phone" name="phone" type="hidden"/>
            <textarea name="description" style="display:none;white-space:pre;">:description</textarea>
        </form>
    );

    getDescription() {
        const data = this.get('data');
        return `Alloy = ${data.alloy}
Stiffener type = ${data.stiffenerType}
Stiffener size = ${data.stiffenerSize}
Deck thickness = ${data.deckThickness}
Stiffener spacing = ${data.stiffenerSpacing}
Stiffeners / plank = ${data.plank}
Welding process = ${data.weldingProcess}
Profile number = ${data.profileNumber}
Profile weight / m = ${data.profileWeight}
Profile width = ${data.profileWidth}
Panel width = ${data.panelWidth}
Special transport = ${data.specialTransport}
Panel length = ${data.paneldimentions}
Panel weight = ${data.panelWeight}
Quantity = ${data.quantityOfPanels}
Class Society = ${data.classSociety}
Total weight = ${data.totalWeight}`;
    }
}
