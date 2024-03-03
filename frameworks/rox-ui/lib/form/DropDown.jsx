import Input from './Input.jsx';
import Select from 'material-ui/lib/select-field';

/**
 *The dropdown input react component
 *
 *
 * @see http://material-ui.com/#/components/dropdown-menu
 */
export default class DropDownComponent extends Input {

    render() {

        const p = this.props;
        const st = this.state;

        let value = st.value;

        let selectedIndex = -1;

        if (st.data) {

            const menuItems = st.data.map((item, idx) => {

                if (item.id === value) {
                    selectedIndex = idx;
                }

                return {payload: item.id, text: item.name || item.label || item.id}
            });

            if (selectedIndex === -1) {
                menuItems.unshift({payload:value, text:value?`'${value}'`:''});
                selectedIndex=0;
            }

            return (
                <Select
                    id={this.id}
                    defaultValue=" "
                    selectedIndex={selectedIndex}
                    menuItems={menuItems}
                    floatingLabelText={this.string(p.caption || p.id)}
                    errorText={st.error?st.error.message:null}
                    onChange={(ev)=>this.onValueChanged(ev.target.value)}
                    >
                </Select>
            );

        } else {

            if (st.dataLoading){

                return <Input
                    type={'text'}
                    defaultValue={'loading...'}
                    disabled={true}
                    floatingLabelText={this.string(p.caption || p.id)}
                    />

            } else {
                return <Input
                    type={'text'}
                    defaultValue={st.error?st.error.message:''}
                    disabled={true}
                    errorText={st.error?st.error.message:null}
                    floatingLabelText={this.string(p.caption || p.id)}
                    />;
            }

        }



    }

}
