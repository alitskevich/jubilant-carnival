import ui from 'ui';
import {event} from 'applugins';
import Avatar from '../../node_modules/material-ui/lib/avatar';
import FontIcon from '../../node_modules/material-ui/lib/font-icon';
import IconMenu from '../../node_modules/material-ui/lib/menus/icon-menu';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import IconButton from '../../node_modules/material-ui/lib/icon-button';

const HEADERS = {

    name: {
        width: 250,
        renderCell: (d, table)=>(<div>
                <Avatar
                    icon={<FontIcon className={"material-icons"}>{d.clientCertificateRequired ? "security" : "turned_in_not"}</FontIcon>}
                    onClick={(ev)=>(table.callPropsHook('toggleIsActive', d), ev.stopPropagation())}
                    backgroundColor={(d.isActive ? '#6eb3b9' : 'gray')}
                    style={{margin: '2px'}}/>

                <a>{d.name}</a>
            </div>)}
    ,
    createdOn:{

        renderCell: (d)=>((d.createdOn||'').split("T")[0])
    }
    ,
    clientCertificateRequired:{

        renderCell: (d)=>(d.clientCertificateRequired?'yes':'no')
    }
    ,
    actions:{
        width:30
        ,
        renderCell: (d)=>(<IconMenu iconButtonElement={<IconButton iconClassName={"material-icons"}>more_vert</IconButton>}>
            {event('resource://get/actions.HospitalList').action().map(action=><MenuItem primaryText={action.name}/>)}
        </IconMenu>)
    }
};

//

export default function HospitalsListHeaders(){

    return event('resource://get/headers.HospitalList').action().map(h=>Object.assign(h,HEADERS[h.id]))
}