import Steps from '../configs/FormMetadata.es6';
import Configurations from '../configs/Configurations.es6';
import Lookups from '../configs/Lookups.es6';

function evaluateExpression(expression, data) {

    return expression ? (Function('data', 'lookup', `return ${expression}`)).call(this, data, Lookups.lookup) : null;
}

export function getFieldsMeta(step, payload) {

    return Steps[step - 1].fields.map(field => {
        try {
            let data = field.data;

            const depends = field.dataDependsOn;
            if (depends) {

                const allowedIds = [];

                Configurations.forEach(conf=> {

                    const id = '' + conf[field.id];

                    if (id) {

                        for (let key of depends) {

                            if (!conf[key]) {
                                throw new Error(`Bad configuration: lack of field ${key} for ${field.id}`);
                            }

                            if (conf[key] !== '*' && !conf[key].split(';').includes(payload[key])) {
                                return;
                            }
                        }
                        allowedIds.push(...id.split(';'));

                    }
                });

                if (!allowedIds.includes('*')) {
                    data = data.filter(d=>allowedIds.includes(d.id));
                }
            }

            const expression = field.defaultValueExpression;
            if (expression){
                field.defaultValue = this::evaluateExpression(expression, payload)
            }

            return {...field, data}
        }
        catch (ex) {
            return {type: 'error', data: [ex]}
        }
    });

}
