import ui from 'jsx-ui';

export default class extends ui.Component {

    render() {

        return (
            <ui.SuperTable
                dataFrom='api:eventList'
                headers={this.resource('headers.EventList')}
                />
        );
    }
}

