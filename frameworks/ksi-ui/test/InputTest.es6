import {Input} from '../src/ui';

export default {
    type: Input,
    ngResult:`<input class="form-control" [attr.placeholder]="get('placeholder')" [attr.value]="get('value')" (change)="get('change')($event)"/>`
    ,
    reactCases: [
        {
            id: 'empty',
            props: {},
            result: `<input className="form-control" onChange="[FN]"/>`,
        },
        ((p)=>({
            id: 'all props',
            props: p,
            result: `<input className="form-control" placeholder="${p.placeholder}" value="${p.initialValue}" onChange="[FN]"/>`,
        }))({placeholder:'placeholder', initialValue:'initial'})
    ]
}