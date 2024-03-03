import Component from 'ui/Component.es6';

const LIMITS={
    '200':{min:8, max:16},
    '250':{min:6, max:14},
    '300':{min:5, max:11},
    '400':{min:4, max:8}
}
export default class UiPanelWidthRange extends Component {

    static TEMPLATE = (
        <div>
            <span>:(:value) mm</span>

            <input type='button' value='-' class='qtyminus' click=":minus" field='quantity'/>

            <small>:((Even number of selected profile type: (:panelCount)pcs))</small>

            <input type='button' value='+' class='qtyplus' click=":plus" field='quantity'/>
            <div class="bordermax"></div>
            <div class="bordermin"></div>
        </div>
    );

    onChange(ev) {

        this.set('value', +ev.target.value);
    }

    getMin(){

        const stiffenerSpacing = this.get('payload.stiffenerSpacing');
        return LIMITS[stiffenerSpacing].min*(+stiffenerSpacing);
    }
    getMax(){

        const stiffenerSpacing = this.get('payload.stiffenerSpacing');
        return LIMITS[stiffenerSpacing].max*(+stiffenerSpacing);
    }

    plus(){

        const stiffenerSpacing = +this.get('payload.stiffenerSpacing');
        this.set('value', Math.min(this.getMax(), +this.get('value') + stiffenerSpacing));
    }

    minus(){

        const stiffenerSpacing = +this.get('payload.stiffenerSpacing');
        this.set('value',  Math.max(this.getMin(), +this.get('value') - stiffenerSpacing));
    }

    getPanelCount(){
        const panelWidth = this.get('payload.panelWidth') ;
        const stiffenerSpacing = this.get('payload.stiffenerSpacing');
        const count = Math.round(panelWidth/stiffenerSpacing);
        return count
    };

}