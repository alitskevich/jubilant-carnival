import Component from 'ui/Component.es6';

export default class SvgPreview extends Component {

    getScale() {
        return 1;
    }

    getStiffeners() {

        const data = this.get('data') || {}, scale = this.get('scale');

        const {stiffenerType, stiffenerSpacing = '400', panelWidth = '1100'} = data;

        //Calculate number of profiles based on panel width
        const numberOfProfiles = (panelWidth / stiffenerSpacing) | 0;

        const percentsPerEach = 100 / numberOfProfiles;

        return Array.apply(null, Array(2)).map((e, i) => {

            return {
                x: i * 150 + 120
            }

        });

    }

    getStiffenerPath() {
        return this.get(`stiffenerPath.${this.get(`data.stiffenerType`)}`)
    }

    getDeckThickness() {

        const scale = this.get('scale'),
            deckThickness = this.get('data.deckThickness') || 2;

        return deckThickness * scale;

    }


    static DEFAULTS = {

        stiffenerPath: {
            'roundBulb': "m 24.665623,-32.512121 c 0.07185,-0.07861 0.143707,-0.157213 0.21556,-0.314427 0.574826,-0.786066 0.934092,-1.807952 0.934092,-2.908445 0,-2.515412 -1.796331,-4.559185 -4.095635,-4.716398 0,0 -0.07185,0 -0.07185,0 -0.21556,0 -1.940037,0 -2.083744,0 l -20.11890658,0 0,0.07861 0,0 0,60.841532 7.11347068,0 0,-42.683401 c 0.071853,-0.393033 0.3592662,-1.021886 1.5089177,-1.650739 1.796331,-0.943279 14.3706482,-6.99599 14.3706482,-6.99599 0,0 1.149651,-0.550246 1.940037,-1.414919 0.143707,-0.07861 0.21556,-0.157214 0.287413,-0.23582 z",
            'squareBulb': "M -0.50390625 -40.417969 L -0.50390625 -17.728516 L -0.50390625 -17.511719 L -0.50390625 20.347656 L 7.109375 20.347656 L 7.109375 -17.511719 L 25.851562 -17.511719 L 25.851562 -40.417969 L -0.50390625 -40.417969 z ",
            'tBar': "M -14.763672 -40.458984 L -14.769531 -33.083984 L -0.38867188 -33.048828 L -0.38867188 20.267578 L 7.1640625 20.267578 L 7.1640625 -33.029297 L 21.1875 -32.994141 L 21.193359 -40.371094 L -14.763672 -40.458984 z ",
            'flatBar': "m -0.60833293,-40.38125 7.11944433,0 0,60.779861 -7.11944433,0 0,-60.779861 z"

        }


    };

    static TEMPLATE = (

        <svg width='100%' height='25%' viewBox="0 0 400 120">
            <g each='s of :stiffeners'  transform=":translate((:s.x),50)">
                <path stroke='gray' fill="gray" d=':stiffenerPath'/>
            </g>
            <g if=":data.deckThickness">
                <circle r="40" cx="345" cy="70" stroke="#44abbb" fill="white" stroke-width="1.5" />
                <text x="353" y="74" font-size="6" fill="black">:(:data.deckThickness) mm</text>
                <text x="325" y="47" font-size="6" fill="#C3C3C3">Deck Thickness</text>

                <g transform = "translate(303,27) scale(0.4)" >
                    <path fill="gray" d="M80.8,154V72H12c-4.2,11.2-6.5,23.3-6.5,36c0,16.5,3.9,32.2,10.9,46H80.8z"/>
                    "/>
                </g>
                <line class="lt2" x1="345" y1="56" x2="345" y2="88" stroke="black" fill="black" marker-start="url(#DimPoint1)" marker-end="url(#DimPoint2)"/>
                <line x1="336" y1="56" x2="343" y2="56" stroke="#44abbb" stroke-width="0.7" stroke-linecap="round" stroke-dasharray="1, 1.5"/>
                <line x1="336" y1="88" x2="343" y2="88" stroke="#44abbb" stroke-width="0.7" stroke-linecap="round" stroke-dasharray="1, 1.5"/>
             </g>


            <g if=":data.stiffenerSpacing">
                <line x1="123" y1="70" x2="123" y2="105" stroke="#44abbb" stroke-width="0.7" stroke-linecap="round" stroke-dasharray="1, 1.5"/>
                <line x1="273" y1="70" x2="273" y2="105" stroke="#44abbb" stroke-width="0.7" stroke-linecap="round" stroke-dasharray="1, 1.5"/>
                <line class="lt2" x1="123" y1="103" x2="273" y2="103" stroke="black" fill="black" marker-start="url(#DimPoint1)" marker-end="url(#DimPoint2)"/>
                <circle r="15" cx="200" cy="102" stroke="#44abbb" fill="white" stroke-width="1.5" />
                <text x="178" y="82" font-size="6" fill="#C3C3C3">Stiffener Spacing</text>
                <text x="189" y="104" font-size="6" fill="black">:(:data.stiffenerSpacing) mm</text>
            </g>

            <line x1='50' y1='70' x2='199' y2='70' stroke='gray' stroke-width=':deckThickness'></line>
            <line x1='201' y1='70' x2='330' y2='70' stroke='gray' stroke-width=':deckThickness'></line>

            <marker id="DimPoint1" viewBox="-2 -12 29 24" markerWidth="40" markerHeight="30" orient="auto">
                <path class="lt2_025" fill="black" stroke="black" d="M0,0 L20,-4 16,0 20,4 z M0,-10 L0,10 M0,0 L27,0"/>
            </marker>
            <marker id="DimPoint2" viewBox="-27 -12 29 24" markerWidth="40" markerHeight="30" orient="auto">
                <path class="lt2_025"  fill="black" stroke="black" d="M0,0 L-20,-4 -16,0 -20,4 z M0,-10 L0,10 M0,0 L-27,0"/>
            </marker>

        </svg>

    );



}

// <text x='0' y='15' font-size="8" fill="red" transform="rotate(30 20,40)" if=":data.alloy">:Alloy: (:data.alloy)</text>
// <text x='350' y='10' font-size="10" fill="red"  if=":data.quantityOfPanels">:x(:data.quantityOfPanels)</text>
// <g if=":data.deckThickness">
// <line class="lt2" x1="380" y1="68" x2="380" y2="50" stroke="red" fill="red" marker-start="url(#DimPoint1)" />
// <line class="lt2" x1="380" y1="72" x2="380" y2="90" stroke="red" fill="red" marker-start="url(#DimPoint1)" />
//     <text x="372" y="47" font-size="8" fill="red">:(:data.deckThickness) mm</text>
// </g>
// <g if=":data.stiffenerSize">
//     <circle r="15" cx="151" cy="55" stroke="red" fill="none" stroke-width="0.4" />
//     <text x="135" y="35" font-size="8" fill="red">:(:data.stiffenerSize) mm</text>
// </g>
// <g if=":data.panelWidth">
//     <line x1="0" y1="70" x2="0" y2="110" stroke="red" stroke-width="0.2"/>
//     <line x1="400" y1="70" x2="400" y2="110" stroke="red" stroke-width="0.2"/>
//     <line class="lt2" x1="0" y1="107" x2="400" y2="107" stroke="red" fill="red" marker-start="url(#DimPoint1)" marker-end="url(#DimPoint2)"/>
//     <text x="185" y="105" font-size="8" fill="red">:(:data.panelWidth) mm</text>
// </g>