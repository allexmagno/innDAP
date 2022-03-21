import React from 'react';
import { Link } from 'react-router-dom'

export default props =>
    <aside className="nav-items">
        <Link to={`${props.route}`} className="nav-item">
            <i className={`fa fa-${props.icon}`}></i> {props.name}
        </Link>
    </aside>