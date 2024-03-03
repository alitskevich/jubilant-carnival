const URL = "https://www.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8";

const HIDDEN_VALUES = {
    oid: '00D200000008I2g',
    retURL: 'http://www.thankyoupage.com',
    lead_source: 'Internet',
    '00N20000001TVnb': 'Panel Configurator Marine and Offshore',
    debug: '1',
    debugEmail: ''
};

const CONTACT_FIELDS = ["company","first_name","last_name","email" ,"phone"];

function getDescription(data) {

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

function getPayloadEncoded(payload) {

    const values = {...HIDDEN_VALUES, description: getDescription(payload)};

    CONTACT_FIELDS.forEach(key=>(values[key]=payload[key]));

    return Object.keys(values).map(key=>(`${key}=${encodeURIComponent(values[key])}`)).join('&');
}

export default function submit(payload, cb) {
    var request = new XMLHttpRequest();
    request.onreadystatechange=function() {
        if (request.readyState == 4) {
            const err = request.status == 200 ? null : new Error('Remote error')
            cb(err, request);
        }
    }
    
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    request.send(getPayloadEncoded(payload));
}