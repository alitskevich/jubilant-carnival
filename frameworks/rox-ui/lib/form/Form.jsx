import DataDrivenComponent from '../DataDrivenComponent.jsx';
import FormFieldset from './FormFieldset.jsx';
import Toolbar from '../components/Toolbar.jsx';
import Tabs from '../components/Tabs.jsx';
import Button from '../components/Button.jsx';
import types from './Types.jsx';

/**
 * The Input Form.
 */
export default class Form extends DataDrivenComponent {

    static defaultProps = {

        onSuccess: function(result) {

            this.emit('ui:toast', {message: `Submitted successfully`});
        }
    };

    static registerFieldType(typeId,clazz) {
        types.registerFieldType(typeId,clazz);
    }

    static resolve(typeId) {

        return types.resolve(typeId);
    }

    constructor(props, context) {

        super(props, context);

        this.fields = this.initMeta(props.meta);
    }

    initMeta(meta = []) {

        const defaults = {
            type: 'string',
            flags: '',
            disabled: this.props.disabled
        };

        if (typeof meta ==='string') {
            meta = this.resource(meta);
        }
        if (!meta) {

            this.error('Form Meta is not defined');

            meta = [{id:'0', caption:'Form Meta is not defined'}];
        }

        return meta.map((item0) => {

            let item = {...defaults, ...item0};

            const tab = this.getTab(item.tab);

            if (item.group) {

                this.getFs(tab, item.group).fields.push(item);

            } else {

                if (item.type === 'group') {

                    const group = this.getFs(tab, item.id);
                    item = group;
                    item.expandable = true;

                } else {

                    this.getFs(tab).fields.push(item);
                }
            }

            return item;
        });
    }

    checkErrors() {

        var data = this.state.data;
        var errors = [];

        this.fields.forEach(({id,flags=''}) => {

            if (flags.includes('required')) {
                let value = data[id];
                if (!value) {
                    errors.push(this.error(`[${id}] is required`));
                }
            }
        });

        const error = errors.length ? this.error('Validation error', {errors}) : null;


        return error;
    }

    submit() {

        if (this.props.disabled) {
            return;
        }

        const error = this.checkErrors();
        if (error) {
            this.setState({error});
            return;
        }

        this.setState({error: null, message: null});

        const cb = (error, result)=> {

            if (!error) {

                this.onSuccess(result);
            }

            this.setState({dataLoading: false, error, message: null});
        };

        const payload = this.state.data;

        this.setState({dataLoading: true});

        this.callPropsHook('submitTo', payload, cb);
    }

    onSuccess(result) {

        this.callPropsHook('onSuccess', result, this);
    }

    render() {

        const p = this.props;
        const st = this.state;
        const tabs = Object.keys(this.getTabs());
        const tabId = st.tabId||tabs[0];
        const tabCount = tabs.length;

        return (
            <div style={p.style}>

                {st.dataLoading ? this.renderDataLoading(p, st) : null}

                {(tabCount < 2)?null:<Tabs
                    onChange={(tabId)=>this.setState({tabId})}
                    tabs={tabs.map((id, idx) => ({id, name: this.string(id)}))}
                    />}

                {this.renderTabContent(tabId)}

                {st.message ? <div className="text-info">{st.message}</div> : null}

                {st.error ? this.renderError(p, st, st.error) : null}

                {p.actions ? this.renderActions(p.actions) : null}

            </div>
        )
    }

    renderActions(actions=[]){

        return <div>{actions.map(action=><div style={{float:'right',margin:'0.5em'}}><Button {...action} label={action.caption} onClick={()=>{action.handler(this)}}/></div>)}</div>

    }

    renderTabContent(tabId) {

        const result = [];

        const propsBase= {
            data : this.state.data || {},
            disabled : this.props.disabled || !this.state.data,
            onDataChanged : ::this.dataChanged
        };

        for (let meta of this.getTab(tabId).fieldsets.values()) {

            const elt = <FormFieldset key={meta.id+"_"+this.state.dataChanged} meta={meta} {...propsBase}/>;

            result.push(elt);
        }


        return <div key={tabId} style={{}}>{result}</div>;
    }

    getTabs() {
        return this.tabs ||(this.tabs = {});
    }

    getTab(id = 'general') {

        const tabs = this.getTabs();

        if (!this.state.tabId){
            this.state.tabId = id;
        }

        return tabs[id] || (tabs[id] = {id, fieldsets: new Map()});
    }

    getFs(tab, id = 'main') {

        let fs = tab.fieldsets.get(id);
        if (!fs) {

            tab.fieldsets.set(id, fs = {id, fields: []});
        }
        return fs;
    }
}
