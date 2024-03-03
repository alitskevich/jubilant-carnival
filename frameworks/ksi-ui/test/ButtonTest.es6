import {Button} from '../src/ui';

const sourceSample =`
<button class=':(btn btn-(:mode))' disabled=':disabled' click=':click'>
    <i if=':icon' class=':(fa fa-(:icon))'></i>
    <block if=':caption'>:caption</block>
    <children/>
</button>
`

export default {
    type: Button,
    ngResult:`
    <button [ngClass]="'btn btn-'+get('mode')+''" [disabled]="get('disabled')" (click)="getClicker('click')($event)">
        <i *ngIf="get('icon')" [ngClass]="'fa fa-'+get('icon')+''"></i>
        <template [ngIf]="get('caption')">{{get('caption')}}</template>
        <ng-content></ng-content>
    </button>`
    ,
    reactCases: [
        {
            id: 'empty',
            props: {},
            result: `<button className="btn btn-primary" onClick="[FN]"></button>`,
        },
        ((p)=>({
            id: 'all props',
            props: p,
            result: `<button className="btn btn-${p.mode}" onClick="[FN]"><i className="fa fa-${p.icon}"></i>${p.caption}</button>`,
        }))({click:(a)=>a, caption:'caption', icon:"icon", mode:'special'})
    ]
}
