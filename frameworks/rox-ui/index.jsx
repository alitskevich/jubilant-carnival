require('react-tap-event-plugin')();

import React from 'react';

import Page from './lib/Page.jsx';
import SuperTable from './lib/table/SuperTable.jsx';
import Form from './lib/form/Form.jsx';
import {Link } from 'react-router'
import {fields} from  './lib/form/index.jsx';
import Component from './lib/Component.js'
import DataDrivenComponent from './lib/DataDrivenComponent.jsx';

var All = {
    Page,
    React,
    Component,
    DataDrivenComponent,
    SuperTable,
    Link,
    Form,
    IconButton: require('material-ui/lib/icon-button'),
    FontIcon: require('material-ui/lib/font-icon'),
    IconMenu: require('material-ui/lib/menus/icon-menu'),
    MenuItem: require('material-ui/lib/menus/menu-item'),
    LinkMenuItem: require('material-ui/lib/menu/link-menu-item'),
    MenuDivider: require('material-ui/lib/menus/menu-divider'),
    ActionGrade: require('material-ui/lib/svg-icons/action/grade'),
    MoreVertIcon: require('material-ui/lib/svg-icons/navigation/more-vert'),
    NavigationClose: require('material-ui/lib/svg-icons/navigation/close'),
    NavigationTop: require('material-ui/lib/svg-icons/navigation/menu'),
    NavigationBack: require('material-ui/lib/svg-icons/navigation/arrow-back'),
    Colors: require('material-ui/lib/styles/colors'),
    ColorManipulator: require('material-ui/lib/utils/color-manipulator'),
    Spacing: require('material-ui/lib/styles/spacing'),
    AppBar: require('material-ui/lib/app-bar'),
    LeftNav: require('material-ui/lib/left-nav'),
    FlatButton: require('material-ui/lib/flat-button'),
    Avatar: require('material-ui/lib/avatar'),
    LinearProgress: require('material-ui/lib/linear-progress'),
    Toolbar: require('material-ui/lib/toolbar/toolbar'),
    Paper: require('material-ui/lib/paper'),
    ...fields
};

[
    'Button',
    'List',
    'CollapsibleList',
    'PopupMenu',
    'Menu',
    'Toolbar',
    'Dialog',
    'Table',
    'LargeTable',
    'SearchComponent',
    'NavBar',
    'MainAction',
    'Sidebar',
    'Card',
    'Grid',
    'Tabs',
    'Article',
    'Title'

].forEach((s)=>{All[s]=require(`./lib/components/${s}.jsx`).default;});

export default All;