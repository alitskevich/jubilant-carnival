import {Component} from "reangulact";

export default class Styling extends Component {

    static DEFAULTS = {mode: "primary"};

    static TEMPLATE = (
        <div>
            <div style="display:block"></div>
            <div style=":{display:'block'}"></div>
            <div class="fa fa-icon"></div>
            <div if=":icon" class=":(fa fa-(:icon))"></div>
        </div>
    );
}

export default {
    type: Styling,
    ngResult:`<div >
    <div style="display:block"></div>
    <div [ngStyle]="{display:'block'}"></div>
    <div class="fa fa-icon"></div>
    <div *ngIf="get('icon')" [ngClass]="'fa fa-'+get('icon')+''"></div></div>`

    ,
    reactCases: [
        {
            id: "empty",
            props: {},
            result: `<div ><div style="{'display':'block'}"></div><div style="{'display':'block'}"></div><div className="fa fa-icon"></div></div>`,
        },
        ((p)=>({
            id: "all props",
            props: p,
            result: `<div ><div style="{'display':'block'}"></div><div style="{'display':'block'}"></div><div className="fa fa-icon"></div><div className="fa fa-icon"></div></div>`,
        }))({icon:"icon"})
    ]
}
