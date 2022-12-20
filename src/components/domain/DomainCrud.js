import React, { Component } from 'react';
import Main from '../templates/Main';
import api from '../../services/Axios';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const headerProps = {
    icon: 'building',
    title: 'Domínios',
    subtitle: 'Gerenciamento de domínios'
};

const uri = "/domain";

export default class UserCrud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            domain: {
                id: null,
                name: null,
                ldap_servers: []
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

    save(update) {
        const domain = this.state.domain;
        this.toggle();
        let method = 'post';
        let to_uri = uri;
        console.log(domain);
        if(update){
            method = 'put';
            to_uri = uri + `/${domain.id}`;
        }
        api[method](to_uri, domain)
            .then(resp => {
                const list = this.getUpdatedList(resp.data);
                this.setState( { domain: {id: null, name: null, ldap_servers: []}, list: list} )
            })
    }

    getUpdatedList(domain) {
        const list = this.state.list.filter( u => u.id !== domain.id );
        list.unshift(domain);
        return list;
    }

    updateDomainField(event) {
        const domain = { ...this.state.domain };
        domain[event.target.name] = event.target.value;
        this.setState({ domain: domain });
    }

    toggle(event, edit){

        if(!edit){
            let domain = {
                id: null,
                name: null,
                ldap_servers: []
            };
            this.setState({domain: domain});
        }

        this.setState({ 
            open: !this.state.open,
            modal: !this.state.modal,
            icon: this.state.icon === 'left' ? 'down' : 'left'
        });
        
    }

    remove(event, domain) {
        api.delete(`${uri}/${domain.id}`)
            .then(resp => {
                const list = this.state.list.filter(d => d !== domain);
                this.setState({ list: list });
            })
    }

    editDomain(e, domain){ 
        this.setState({domain: domain})
        this.toggle(e, true);

    }
    
    renderDomainTable() {
        return (
            <table className="table mt-4">
            <thead>
                <th></th>
                <th>Domínio</th>
                <th>Nome</th>
                <th>
                <Link to="#"
                    onClick={e => this.toggle(e)}
                >
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
                <td>{domain.id}</td>
                <td>{domain.name}</td>
                <td>
                    <ul>
                        <li>
                            <div>
                                <a className="text-info pointer"
                                    onClick={e => this.editDomain(e, domain)}
                                >
                                <i className="fa fa-edit"></i>
                                </a>
                            </div>
                        </li>
                        <li>
                            <div>
                                <a className="text-danger"
                                    onClick={e => this.remove(e, domain)}
                                >
                                <i className="fa fa-remove"></i>
                                </a>
                            </div> 
                        </li>
                    </ul>
                </td>
            </tr>
            ));
    }

    tableDomainForm(){
        return (
            <table className="table mt-4">
            <thead>
                <th></th>
                <th>Nome</th>
                <th>Domínio</th>
            </thead>
            <tbody>
                {this.renderDomainRowsForm()}
            </tbody>
            </table>
        )
    }

    renderDomainForm(){
        return (
        <div className="form">
        <div className="row">
            <div className="col-12 col-md-6">
                <div className="form-group">
                    <label><icon className="fa fa-building"></icon> Domínio</label>
                    <input type="text" className="form-control"
                        id="input_domain"
                        name="id"
                        value={this.state.domain.id}
                        onChange={e => this.updateDomainField(e)}
                        placeholder="FQDN"
                    />
                </div>
            </div>
            <div className="col-12 col-md-6">
                <div className="form-group">
                    <label><icon className="fa fa-info-circle"></icon> Nome</label>
                    <input type="text" className="form-control"
                        name="name"
                        value={this.state.domain.name}
                        onChange={e => this.updateDomainField(e)}
                        placeholder="Nome"
                    />
                </div>
            </div>
        </div>
        </div>
        );

    }

    addDomain(){
    }

    render_modal_domain(){
        return (
            <div>
                <Modal 
                show={this.state.modal} 
                onHide={e => {this.toggle(e)}}
                size="lg"
                backdrop="static"
                >
                    <Modal.Header>
                    <Modal.Title><icon className="fa fa-plus"></icon> Adicionar Domínio </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.renderDomainForm()}
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="btn btn-outline-success"
                        onClick={e => this.save(false)}
                    >
                        Salvar
                    </button>
                    <button  className="btn btn-outline-danger"
                    onClick={e => {this.toggle(e, true)}}>
                        Cancelar
                    </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    render() {
        return (
            <Main {...headerProps}>
                 {this.render_modal_domain()}
                {this.renderDomainTable()}
            </Main>
        )
    }
}