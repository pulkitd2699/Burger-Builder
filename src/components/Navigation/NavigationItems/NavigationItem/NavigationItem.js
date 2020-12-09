import React from 'react';
import {NavLink} from 'react-router-dom';

import classes from './NavigationItem.module.css';

const navigationItem = (props) => (
    <li className={classes.NavigationItem}>
        <NavLink 
            to={props.link}
            exact={props.exact}
            //although NavLink has active as the default name for the class but because css modules are compiled during compile time and NavLink coming at runtime, the name of the class i.e 'active' is hashed during compile time
            activeClassName={classes.active}>
        {props.children}
        </NavLink>
    </li>
);

export default navigationItem;