import BaseComponent from './BaseComponent.jsx';

/**
 * Created by Dmitry_Zhivushko on 5/6/2015.
 */
export default class ErrorView extends BaseComponent {

    render() {

        const st = this.state;
        let error = st.error;

        if (!error) {
            return null;
        }

        const btnClasses = this.resolveClassNames({
            'tiny': true,
            ['mdi-navigation-expand-'+(st.expanded?'less':'more')]: true
        });

        const errors = (error.errors && error.errors.length) ? error.errors : null;

        return (
            <div style={{color:'red'}}>

                {errors ? <i className={btnClasses} onClick={()=>this.setState({expanded: !st.expanded})}></i> : null }

                <span>{(''+error.message) || 'Error'}</span>

                {errors && st.expanded ? errors.map((subMsg, index) => <p key={index}>{`${subMsg}`}</p>) : null }

            </div>
        )
    }

}