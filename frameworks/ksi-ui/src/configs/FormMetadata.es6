import {ALLOY_TYPES, STIFFENER_TYPES, STIFFENER_SIZES, DECK_THICKNESS, STIFFENER_SPACINGS, PANEL_WIDTH, PANEL_LENGTH, CLASS_SOCIETY} from'./Enums.es6';
import {DENSITY, PROFILE_NUMBER} from'./Lookups.es6';


export default [
    {
        id:'1',
        caption:'Alloy type / Stiffener type',
        fields: [
            {
                id: 'alloy',
                caption: 'Choose alloy and Stiffener type',
                type: 'dropdown',
                data: ALLOY_TYPES,
                reqired: true
            }
            ,
             {
                 id: 'stiffenerType',
                 caption2: 'Stiffener type',
                 type: 'stiffener',
                 note:'Choose a stiffener type',
                 dataDependsOn:['alloy'],
                 data: STIFFENER_TYPES,
                 reqired: true
             }
        ]

    }
    ,
    {
        id:'2',
        caption:'Stiffener Size',
        fields: [
            {
                id: 'stiffenerSize',
                caption: 'Choose Stiffener size',
                type: 'stiffenerSize',
                dataDependsOn:['alloy','stiffenerType'],
                data: STIFFENER_SIZES,
                reqired: true
            }


        ]
    }
    ,
    {
        id: '3',
        caption: 'Deck thickness/ Stiffener spacing',
        fields: [
            {
                id: 'deckThickness',
                caption: 'Select Deck thickness, mm',
                type: 'dropdown',
                dataDependsOn: ['alloy', 'stiffenerType', 'stiffenerSize'],
                data: DECK_THICKNESS,
                reqired: true
            }
            ,
            {
                id: 'stiffenerSpacing',
                caption: 'Stiffener spacing, mm',
                type: 'dropdown',
                dataDependsOn: ['alloy', 'stiffenerType', 'stiffenerSize'],
                data: STIFFENER_SPACINGS,
                reqired: true
            }

        ]
    }
    ,
    {
        id: '4',
        caption: 'Panel dimensions/ Quantity/ Classification',


        fields: [
            {
                id: 'profileWeight',
                // caption: 'Profile Weight',
                type: 'hidden',
                defaultValueExpression: 'lookup("DENSITY", data.alloy +"-"+ data.stiffenerType +"-"+ data.stiffenerSize +"-"+ data.deckThickness)'
            }
            ,
            {
                id: 'profileNumber',
                // caption: 'Profile Number',
                type: 'hidden',
                defaultValueExpression: 'lookup("PROFILE_NUMBER", data.alloy +"-"+ data.stiffenerType +"-"+ data.stiffenerSize +"-"+ data.deckThickness)'
            }
            ,

            {
                id: 'profileWidth',
                // caption: 'Profile Width',
                type: 'hidden',
                defaultValueExpression: '"SP_"+data.stiffenerSpacing'
            }
            ,
            {
                id: 'paneldimentions',
                caption: 'Panel Dimensions',
                type: 'dimentions',
                defaultValueExpression: '9000'
            }
            ,
            // {
            //     id: 'panelLength',
            //     // caption: 'Panel length',
            //     type: 'range',
            //     min: 6000,
            //     max: 18000,
            //     step: 100
            // }
            // ,
            {
                id: 'panelWidth',
                // caption: 'Panel width',
                type: 'panelWidthRange',
                defaultValueExpression: '(+data.stiffenerSpacing)*5'
            }
            ,

            {
                id: 'quantityOfPanels',
                caption: 'Quantity of panels',
                type: 'number',
                // column: 1,
                minValue:'20',
                maxValue:'100',
                // hint:'min. 20',
                defaultValueExpression: '20'
            }
            ,
            {
                id: 'classSociety',
                caption: 'Class Society',
                type: 'dropdown',
                // column: 2,
                data: CLASS_SOCIETY,
                defaultValueExpression: ''
            }
            ,
            {
                id: 'panelWeight',
                // caption: 'Panel Weight',
                type: 'hidden',
                defaultValueExpression: 'Math.round(data.panelWidth/(data.stiffenerSpacing*(data.stiffenerSpacing > 200 ? 1 : 2))*data.profileWeight*data.paneldimentions/1000)'
            }
            ,
            {
                id: 'totalWeight',
                // caption: 'Total Weight',
                type: 'hidden',
                defaultValueExpression: 'Math.round(data.panelWidth/(data.stiffenerSpacing*(data.stiffenerSpacing > 200 ? 1 : 2))*data.profileWeight*data.paneldimentions/1000*data.quantityOfPanels)'
            }
            ,
            {
                id: 'plank',
                // caption: 'Stiffeners / plank',
                type: 'hidden',
                defaultValueExpression:'data.stiffenerSpacing > 200 ? 1 : 2'
            }
            ,
            {
                id: 'weldingProcess',
                // caption: 'Welding process',
                type: 'hidden',
                defaultValueExpression:'"FSW"'
            }
            ,
            {
                id: 'specialTransport',
                // caption: 'Special transport',
                type: 'hidden',
                defaultValueExpression:'data.panelWidth > 2400 ? "yes" : "no"'
            }

        ]
    }
    ,

    {
        id: '5',
        caption:'Confirmation',
        fields: [
            {
                id:'company',
                caption: 'Please enter your contact details so we can contact you to discuss the details of your inquiry',
                placeholder: 'Company Name',
                type: 'companyName',
                reqired: true,
                requiredMessage:'Please enter Company Name'
            }
            ,
            {
                id:'firstName',
                placeholder: 'First Name',
                type: 'firstName',
                reqired: true,
                requiredMessage:'Please enter First Name'
            }
            ,
            {
                id:'lastName',
                placeholder: 'Last Name',
                type: 'lastName',
                reqired: true,
                requiredMessage:'Please enter Last Name'
            }
            ,
            {
                id:'email',
                placeholder: 'Email Address',
                type: 'email',
                reqired: true,
                requiredMessage:'Please enter a valid email address'
            }
            ,
            {
                id:'phone',
                placeholder: 'Phone Number',
                type: 'phone',
                reqired: true,
                requiredMessage:'Please enter Phone Number',
                hint:'NOTE: (all fields are mandatory)'
            }

        ]
    }
   
];