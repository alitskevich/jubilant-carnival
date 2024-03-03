import Component from 'ui/Component.es6';


export default class Picture extends Component {

    static DEFAULTS = {

        stiffenerPath: {
            'roundBulb': "m 24.665623,-32.512121 c 0.07185,-0.07861 0.143707,-0.157213 0.21556,-0.314427 0.574826,-0.786066 0.934092,-1.807952 0.934092,-2.908445 0,-2.515412 -1.796331,-4.559185 -4.095635,-4.716398 0,0 -0.07185,0 -0.07185,0 -0.21556,0 -1.940037,0 -2.083744,0 l -20.11890658,0 0,0.07861 0,0 0,60.841532 7.11347068,0 0,-42.683401 c 0.071853,-0.393033 0.3592662,-1.021886 1.5089177,-1.650739 1.796331,-0.943279 14.3706482,-6.99599 14.3706482,-6.99599 0,0 1.149651,-0.550246 1.940037,-1.414919 0.143707,-0.07861 0.21556,-0.157214 0.287413,-0.23582 z",
            'squareBulb': "M -0.50390625 -40.417969 L -0.50390625 -17.728516 L -0.50390625 -17.511719 L -0.50390625 20.347656 L 7.109375 20.347656 L 7.109375 -17.511719 L 25.851562 -17.511719 L 25.851562 -40.417969 L -0.50390625 -40.417969 z ",
            'tBar': "M -14.763672 -40.458984 L -14.769531 -33.083984 L -0.38867188 -33.048828 L -0.38867188 20.267578 L 7.1640625 20.267578 L 7.1640625 -33.029297 L 21.1875 -32.994141 L 21.193359 -40.371094 L -14.763672 -40.458984 z ",
            'flatBar': "m -0.60833293,-40.38125 7.11944433,0 0,60.779861 -7.11944433,0 0,-60.779861 z"
        }
    };

    static TEMPLATE = (
        <div>
              <svg  width='200px' height='260px' viewBox="0 0 200 260">

                <g transform = ":translate((:panel.offset),0)" each="panel of :panels">
                    <rect y="6" class="st0" fill="#C3C3C3" width=":panel.width" height="254"/>
                    <g transform = ":translate((:panel.stiffenerOffset),0)">
                        <polygon class="st1" fill="#A7A7A7" points="24,253 16.6,251.8 16.6,0 24,0 "/>
                        <path transform = ":translate((:panel.stiffenerOffset2),260) scale(0.25)" stroke='gray' fill="gray" d=':stiffenerPath'/>
                    </g>
                </g>
                <g class="stiffenerType">
                    <circle  r="40" cx="100" cy="130" stroke="#44abbb" fill="white" stroke-width="2"/>
                    <path transform = "translate(97,130) scale(0.6)" stroke='gray' fill="gray" d=':stiffenerPath'/>
                    <line x1='75' y1='144' x2='122' y2='144' stroke='gray' stroke-width='4'></line>
                </g>
            </svg>
        </div>

    );


    getPath(){
        return `M23.7,253.9C23.7,253.9,23.8,253.8,23.7,253.9c0.2-0.3,0.3-0.5,0.3-0.8c0-0.6-0.5-1.2-1.2-1.2h0
        c-0.1,0-0.5,0-0.6,0h-5.7v0l0,0v8.1h2v-3.5c0-0.1,0.1-0.3,0.4-0.4c0.5-0.2,4.1-1.8,4.1-1.8S23.4,254.2,23.7,253.9
        C23.7,253.9,23.7,253.9,23.7,253.9z`;
    }


    getPanels(){
        const panelWidth = this.get('payload.panelWidth') || 1500;
        const stiffenerSpacing = this.get('payload.stiffenerSpacing') || 250;
        const count = Math.round(panelWidth/stiffenerSpacing);
        const width = 200/count;
        const array = new Array(count);
        array.fill(0);
        return array.map((e, i)=>({index:i, offset:i*width, width, stiffenerOffset:width/2-18, stiffenerOffset2:width/2+5}));

    }

    getStiffenerPath() {
        return this.get(`stiffenerPath.${this.get(`payload.stiffenerType`)}`)
    }


// <rect x="14.2" y="254.3" transform="matrix(6.347906e-011 -1 1 6.347906e-011 -237.6475 274.1859)" class="st2" fill="#6D737F" width="8.2" height="3.3"/>
// <path class="st2" d=":path"/>
//
}


