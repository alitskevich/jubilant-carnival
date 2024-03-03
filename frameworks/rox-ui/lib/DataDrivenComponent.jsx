import BaseComponent from './BaseComponent.jsx';
import ErrorView from './ErrorView.jsx'
import LoadingIndicator from './LoadingIndicator.jsx'

/**
 * The base for all data-driven components.
 */
export default class DataDrivenComponent extends BaseComponent {

    render() {

        const p = this.props;
        const st = this.state;
        let data = st.data;

        if (st.error) {

            return this.renderError(st.error);

        } else if (st.dataLoading) {

            return this.renderDataLoading();

        } else if (!data || data.length === 0) {

            return this.renderEmptyData();

        } else {

            if (p.filter) {
                data = data.filter(p.filter);
            }

            if (p.sort) {
                data = data.sort(p.sort);
            }

            return this.renderWithData(data);
        }
    }

    renderWithData(data) {

        return this.callPropsHook('template', data, this.state, this.props);
    }

    renderError(error) {

        return <ErrorView error={error}/>;
    }

    renderDataLoading() {

        return this.props.loadingView || <LoadingIndicator type={this.props.loadingIndicatorType}/>;
    }

    renderEmptyData() {

        return this.props.emptyView || <div>{this.props.emptyDataMessage || `No data`}</div>;
    }

    componentWillMount() {

        (this.props.dataDependsOn||'').split(';').map(e=>e.trim()).filter(e=>e).forEach(
                (key)=> this.addEventListener(key, (params, cb)=> {
                    this.reloadData();
                    cb();
                })
        );

        if (!this.props.dataPreventInitialLoad){
            this.reloadData();
        }

        super.componentWillMount();

    }

    setData(data, extraState) {

        if (!this.done) {

            this.setState({data, ...extraState, dataChanged: (this.state.dataChanged || 0) + 1});

            this.dataChanged(data)
        }
    }

    dataChanged(data) {

        this.callPropsHook('onDataChanged', data);
    }

    reloadData(key = this.props.dataFrom, payload = this.props.dataFromPayload || {}) {

        if (key) {
            const dataLoading = this.uniqueKey();

            this.setState({data: null, error: null, dataLoading});

            this.event(key).withData(payload).action((error, data) => {
                this.log('data loaded', error, data, dataLoading, this.state.dataLoading);

                // !!! only the last sent emit is able to be applied.
                //if (dataLoading===this.state.dataLoading) {
                    this.log('data loaded', error, data);

                    this.setData(data, {error, dataLoading: false});
                //}

            });
        }
    }

}