import Configurations from '../configs/Configurations.es6';

const ALL = {};

const META = [
    {
        id: 'DENSITY',
        keyFields: ['alloy', 'stiffenerType', 'stiffenerSize', 'deckThickness'],
        valueFields: ['profileWeight']
    },
    {
        id: 'PROFILE_NUMBER',
        keyFields: ['alloy', 'stiffenerType', 'stiffenerSize', 'deckThickness'],
        valueFields: ['profileNumber']
    }
];

const accumulate = (conf, fieldsIds) => fieldsIds.map(fieldId=>conf[fieldId]).join('-');

export default {

    init() {

        META.forEach(meta=> {

            const bundle = ALL[meta.id] = {};

            Configurations.forEach(conf=> {

                const key = accumulate(conf, meta.keyFields);
                const value = accumulate(conf, meta.valueFields);

                if (value){
                    bundle[key] = value;
                }
            });
        });
    },

    lookup(lookupId, itemId) {

        const bundle = ALL[lookupId];

        return bundle ? bundle[itemId] : null;
    }
}







