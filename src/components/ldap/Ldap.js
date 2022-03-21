import React, { Component } from 'react';
import Main from '../templates/Main';
import api from '../../services/Axios';
import { Link } from 'react-router-dom'



const headerProps = {
    icon: 'database',
    title: 'LDAP',
    subtitle: 'Gerenciamento de servidor LDAP'
};


export default class UserCrud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            ldap: {},
            open: false,
            modal: false,
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    };


    componentDidMount() {
        api.get('/service')
            .then( resp => {
                const list = resp.data;
                this.setState({ list: list });
            })
        console.log(this.state.list)
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }
      
    handleCloseModal () {
        this.setState({ showModal: false });
    }

    save() {
        const ldap = this.state.ldap;
        const method = ldap.id ? 'put' : 'post';
        api[method](ldap)
            .then(resp => {
                const list = this.getUpdatedList(resp.data);
                this.setState({ mail: ldap, list: list })
            })
    }

    getUpdatedList(ldap) {
        const list = this.state.list.filter( m => m.id !== ldap.id );
        list.unshift(ldap);
        return list;
    }

    updateField(event) {
        const ldap = { ...this.state.ldap };
        ldap[event.target.name] = event.target.value;
        this.setState({ ldap: ldap });
    }

    toggle(event){
        this.setState({ 
            open: !this.state.open,
            modal: !this.state.modal,
            icon: this.state.icon == 'left' ? 'down' : 'left'
        });
        
    }
    
    renderLdapTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <th></th>
                    <th>Domínio</th>
                    <th>IP</th>
                    <th>Porta</th>
                    <th>BASE_DN</th>
                    <th>BIND_DN</th>
                    <th>
                        <Link to="/ldap/add">
                            <i className="fa fa-plus text-success"></i>
                        </Link>
                    </th>
                </thead>
                <tbody>
                    {this.renderLdapRows()}
                </tbody>
            </table>
        )
    }

    renderLdapRows(){
        let count = 0;
        return this.state.list.map(ldap => (
            <tr key={String(ldap.id)}>      
                <td>{++count}</td>
                <td>{ldap.domain}</td>
                <td>{ldap.ip}</td>
                <td>{ldap.port}</td>
                <td>{ldap.base_dn}</td>
                <td>{ldap.bind_dn}</td>
                <td>
                    <ul>
                        <li>
                            <Link to="/ldap/edit" className="text-info">
                                <i className="fa fa-edit"></i>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="text-danger">
                                <i className="fa fa-remove"></i>
                            </Link>
                            
                        </li>
                    </ul>
                </td>
            </tr>
            ));
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderLdapTable()}
            </Main>
        )
    }
}