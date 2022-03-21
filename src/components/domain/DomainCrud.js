import React, { Component } from 'react';
import Main from '../templates/Main';
import api from '../../services/Axios';
import { Link } from 'react-router-dom'


const headerProps = {
    icon: 'building',
    title: 'Domínios',
    subtitle: 'Gerenciamento de domínios'
};


export default class UserCrud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            domain: {
                affiliations: []
            },
            open: false,
            modal: false,
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    };


    componentDidMount() {
        api.get('/domain')
            .then( resp => {
                const list = resp.data;
                this.setState({ list: list });
            })
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }
      
    handleCloseModal () {
        this.setState({ showModal: false });
    }

    save() {
        const domain = this.state.domain;
        const method = domain.id ? 'put' : 'post';
        api[method](domain)
            .then(resp => {
                const list = this.getUpdatedList(resp.data);
                this.setState( { domain: domain, list: list} )
            })
    }

    getUpdatedList(domain) {
        const list = this.state.list.filter( u => u.id !== domain.id );
        list.unshift(domain);
        return list;
    }

    updateField(event) {
        const domain = { ...this.state.domain };
        domain[event.target.name] = event.target.value;
        this.setState({ domain: domain });
    }

    toggle(event, id){
        if(id){
            const domain = this.state.list.filter( d => d.id == id).pop()
            this.setState({ domain: domain })
        }

        this.setState({ 
            open: !this.state.open,
            modal: !this.state.modal,
            icon: this.state.icon == 'left' ? 'down' : 'left'
        });
        
    }
    

    renderDomainTable() {
        return (
            <table className="table mt-4">
            <thead>
                <th></th>
                <th>Nome</th>
                <th>Domínio</th>
                <th>
                        <Link to="/mail/add">
                            <i className="fa fa-plus text-success"></i>
                        </Link>
                </th>
            </thead>
            <tbody>
                {this.renderDomainRows()}
            </tbody>
        </table>
    )
}

    renderDomainRows(){
        let count = 0;
        return this.state.list.map(domain => (
            <tr key={String(domain.id)}>      
                <td>{++count}</td> 
                <td>{domain.name}</td>
                <td>{domain.id}</td>
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
                {this.renderDomainTable()}
            </Main>
        )
    }
}