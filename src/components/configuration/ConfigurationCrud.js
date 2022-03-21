import React, { Component } from 'react';
import Main from '../templates/Main';
import api from '../../services/Axios';
import {Collapse} from 'react-bootstrap';


const headerProps = {
    icon: 'cogs',
    title: 'Configurações Gerais',
    subtitle: 'Lista de Configurações'
};


export default class ConfigurationCrud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            configs: {},
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

    updateField(event) {
        const domain = { ...this.state.domain };
        domain[event.target.name] = event.target.value;
        this.setState({ domain: domain });
    }

    toggle(event){

        this.setState({ 
            open: !this.state.open,
            modal: !this.state.modal,
            icon: this.state.icon == 'left' ? 'down' : 'left'
        });
        
    }
    

    renderConfigTable() {
        return (
            this.state.list.map(d => (
            <table className="table table-borderless mt-4">
                <thead>
                    <tr key={String(d.id)+"config"}>
                        <th>
                            <button className="btn btn-link" onClick={e => this.toggle(e)}>
                                <strong>{d.name} ({d.id})</strong>
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={String(d.id)+"row-ldap"}>
                        <td>
                            <Collapse in={this.state.open}>
                            <table>
                                <thead>
                                    <tr key={String(d.id)+"header-row-ldap"}>
                                        <th>
                                            <strong>Servidores LDAP</strong>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key="trow1">
                                        <td>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr key={String(d.id)+"header-ldap"}>
                                                        <th>IP</th>
                                                        <th>Porta</th>
                                                        <th>BASE DN</th>
                                                        <th>BIND DN</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.renderLdapRows(d.ldap_servers)}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </Collapse>
                        </td>
                    </tr>

                    <tr key={String(d.id)+"row-email"}>
                        <td>
                            <Collapse in={this.state.open}>
                            <table className="table table-striped">
                                <thead>
                                    <tr key={String(d.id)+"header-row-email"}>
                                        <th>
                                            <hr></hr>
                                            <strong>Servidor de E-mail</strong>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key="trow2">
                                        <td>
                                            <table className="table table-borderless">
                                                <thead>
                                                    <tr key={String(d.id)+"header-email"}>
                                                        <th>Endereço</th>
                                                        <th>Servidor</th>
                                                        <th>Porta</th>
                                                        <th>Protocolo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.renderEmailRows(d.mail_server)}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </Collapse>
                        </td>
                    </tr>
                </tbody>
            </table>
            ))
    )
    }

    renderLdapRows(ldap_servers){
        return ldap_servers.map(ldap => (
            <tr key={String(ldap.id)+"ldap"}>      
                <td>{ldap.ip}</td>
                <td>{ldap.port}</td>
                <td>{ldap.base_dn}</td>
                <td>{ldap.bind_dn}</td>
            </tr>
            ));
    }

    renderEmailRows(mail){
        return (
            <tr key={String(mail.id)+"email"}>
                <td>{mail.address}</td>
                <td>{mail.server}</td>
                <td>{mail.port}</td>
                <td>{mail.protocol}</td>
            </tr>
        )

    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderConfigTable()}
            </Main>
        )
    }
}