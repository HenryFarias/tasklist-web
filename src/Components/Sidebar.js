import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Sidebar extends Component {

    render() {
        return (
            <aside className="menu-sidebar d-none d-lg-block">
                <div className="logo">
                    <h3>TASKLIST</h3>
                </div>
                <div className="menu-sidebar__content js-scrollbar1">
                    <nav className="navbar-sidebar">
                        <ul className="list-unstyled navbar__list">
                            <li><Link to="/tarefa"><i className="fas fa-tachometer-alt"></i>TAREFAS</Link></li>
                        </ul>
                    </nav>
                </div>
            </aside>
        );
    }
}

export default Sidebar;