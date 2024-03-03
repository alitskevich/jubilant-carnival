import Component from 'ui/Component.es6';

export default class StepsWizard extends Component {

    static TEMPLATE = (
        <table class="nav-inline" style="width:100%">
            <tr>
                <td each="item of :items">
                    <div class=":{'nav-link':true, 'active': (:value) == (:item.id), 'prev': (:value) > (:item.id)}">
                        <div class="tabsteps">
                            <div class="steps"><span>:item.id</span></div>
                            <small>:item.caption</small>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    );
}