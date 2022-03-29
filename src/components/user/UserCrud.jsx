import React, { Component } from 'react';
import Main from '../templates/Main';
import api from '../../services/Axios';
import {Button, Modal, Table } from 'react-bootstrap';
import './UserCrud.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom'


const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Gerenciamento de usuários'
};

export default class UserCrud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            person: {
                affiliations: []
            },
            open: false,
            modal: false,
            modal_error: false,
            icon: 'left',
            affiliationsType: [
                {value: "STAFF", label: "Equipe do Parque", subtype: [
                    {value: "POSITION", label: "Funções de Liderança"},
                    {value: "EMPLOYEE", label: "Funcionário"},
                    {value: "SCHOLARSHIP", label: "Bolsista"},
                    {value: "OTHER", label: "Outros"}
                    ]
                },
                {value: "MEMBER", label: "Membros", subtype: [
                    {value: "COMPANY", label: "Empresa Residente"},
                    {value: "COMPANY_AFFILIATES", label: "Empresa Associada"},
                    {value: "STARTUP", label: "Startup Residente"},
                    {value: "STARTUP_AFFILIATED", label: "Startup Associada"},
                    {value: "ENTREPRENEUR", label: "Empreendedores/Empresas sem CNPJ"}
                ]},
                {value: "PARTNER", label: "Parceiros", subtype: [
                    {value: "EDU", label: "Entidades Acadêmicas"},
                    {value: "GOV", label: "Entidades Governamentais"},
                    {value: "COM", label: "Entidades Comerciais"},
                    {value: "ORG", label: "Entidades Sem Fins Lucrativos"},
                    {value: "STAKEHOLDERS", label: "Entidades Intraorganizacionais"}
                ]},
            ]

        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    };

    //state = { ...initialState };


    componentDidMount() {
        this.mount();
    }

    mount(){
        api.get('/person')
            .then( resp => {
                const personList = resp.data;
                const sorted = personList.sort((a, b) => {
                    return a.uid < b.uid ? -1 : a.uid > b.uid ? 1 : 0;
                })
    
                this.setState({ list: sorted });
            })
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }
      
    handleCloseModal () {
        this.setState({ showModal: false });
    }

    clear() {
        this.setState({ ...this.initialState.user });
    }

    save() {
        const user = this.state.user;
        const method = user.id ? 'put' : 'post';
        api[method](user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data);
                this.setState( { user: this.initialState.user, list: list} )
            })
    }

    editPerson(event, person){
        localStorage.setItem("user", JSON.stringify(person));
        window.location = "user/add";
    }

    getUpdatedList(user) {
        const list = this.state.list.filter( u => u.id !== user.id );
        list.unshift(user);
        return list;
    }

    updateField(event) {
        const user = { ...this.state.user };
        user[event.target.name] = event.target.value;
        this.setState( {user} );
    }

    toggle(event, uid, error){

        if(!error){
            if(uid){
                const person = this.state.list.filter( p => p.uid == uid).pop()
                this.setState({ person: person})
            }

            this.setState({ 
                open: !this.state.open,
                modal: !this.state.modal,
                icon: this.state.icon == 'left' ? 'down' : 'left'
            });
        }else{
            this.setState({ 
                open: !this.state.open,
                modal_error: !this.state.modal_error,
                icon: this.state.icon == 'left' ? 'down' : 'left'
            });
        }
        
    }

    renderForm() {
        return(
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="digite o e-mail"
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn primary"
                            onClick={e => this.save(e)}
                        >
                            Salvar
                        </button>
                        

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}    
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    renderPersonTable() {
        return (
            <table className="table mt-4 table-striped table-responsive">
                <thead>
                    <th>Usuário</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>CPF</th>
                    <th>Passaporte</th>
                    <th>Afiliação</th>
                    <th>
                        <Link to="/user/add">
                            <i className="fa fa-plus text-success"></i>
                        </Link>
                    </th>
                </thead>
                <tbody>
                    {this.renderPersonRows()}
                </tbody>
            </table>
        )
    }

    renderPersonRows(){
        return this.state.list.map(person => (
            
            <tr key={String(person.uid)} >       
                <td>{person.uid}</td>
                <td>{person.name} {person.give_name} {person.surname}</td>
                <td>{person.email}</td>
                <td>{person.cpf}</td>
                <td>{person.passport}</td>
                <td>
                    <button className="btn btn-info btn-lg mr-2">
                        <i className="fa fa-address-book-o" onClick={e => {this.toggle(e, person.uid)}}></i>
                    </button>
                    {person.affiliations ? person.affiliations.length : null }
                </td>
                <td>
                    <ul>
                    {this.checkLdapStatus(person)}
                        <li>
                            <a href="#" onClick={e => this.editPerson(e, person)} className="text-info">
                                Editar <i className="fa fa-edit"></i>
                            </a>
                        </li>
                        {/* <li>
                            <Link to="/" className="text-danger">
                                <i className="fa fa-remove"></i>
                            </Link>
                        </li>          */}
                    </ul>
                </td>
            </tr>
        ));
    }

    checkLdapStatus(person) {
        const sync =  person.ldap_sync;

        if(!sync){
            return;
        }

        switch(sync.status){

            case "pending":
                return (
                    <ul className="list-group">
                        <li>
                            <a href="#" className="text-success" onClick={e => {this.resolve(e, sync.id, "valid")}}>
                                    Aprovar <i className="fa fa-check-square-o"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-danger btn-toolbar" onClick={e => {this.resolve(e, sync.id, "rejected")}}>
                                    Rejeitar <i className="fa fa-remove"></i>
                            </a>
                        </li>
                    </ul>
                );
            
            case "rejected":
                return (
                    <li>
                        Rejeitado <i className="fa fa-ban text-danger"></i>
                    </li>
                );
            
            case "failed":
                return (
                    <li className="text-danger">
                        Falhou <i className="fa fa-exclamation-triangle"></i>
                    </li>
                );

            case "update":
                return (
                    <li>
                        <a href="#" className="text-primary" onClick={e => this.sync_entity(e, 1, person.uid)}>
                                Sincronizar <i className="fa fa-refresh"></i>
                        </a>
                    </li>
                );

            case "valid":
                    return (
                        <li>
                            <a href="#" className="text-primary" onClick={e => this.save_entity(e, 1, person.uid)}>
                                    Salvar LDAP <i className="fa fa-sitemap"></i>
                            </a>
                        </li>
                    );
    
                
            case "sync":
                return (
                    <li className="text-success">
                        Sinc <i className="fa fa-check-circle"></i>
                    </li>
                );
        }

    }

    renderAffiliationTable() {
        return (
            <Table responsive striped centered size="lg">
                <thead>
                    <th></th>
                    <th><icon className="fa fa-institution"></icon>Inst.</th>
                    <th><icon className="fa fa-tag"></icon>Tipo</th>
                    <th><icon className="fa fa-tags"></icon>Subtipo</th>
                    <th><icon className="fa fa-briefcase"></icon>Cargo</th>
                    <th><icon className="fa fa-calendar-check-o"></icon>Entrada</th>
                    <th><icon className="fa fa-calendar-times-o"></icon>Saída</th>
                </thead>
                <tbody>
                    {this.renderAffiliationRows()}
                </tbody>
            </Table>
        )
    }

    renderType(affiliation){
        for(let type of this.state.affiliationsType){
            if(type.value.toUpperCase() == affiliation.type.toUpperCase()){
                return type.label;
            }
        }
    }
    renderSubType(affiliation){
        for(let type of this.state.affiliationsType){
            if(type.value.toUpperCase() == affiliation.type.toUpperCase())
            for(let subtype of type.subtype){
                if(subtype.value.toUpperCase() == affiliation.subtype.toUpperCase()){
                    return subtype.label;
                }
            }
        }
    }

    renderAffiliationRows() {
        return (this.state.person.affiliations.map(aff => (
                <tr key={String(aff.id)}>
                    <td>{aff.affiliation}</td>
                    <td>{aff.organization}</td>
                    <td className="Affiliation">{this.renderType(aff)}</td>
                    <td>{this.renderSubType(aff)}</td>
                    <td>{aff.role}</td>
                    <td>{aff.entrance}</td>
                    <td>{aff.exit}</td>
                </tr>
        )))
    }

    sync(event, id_domain){

        event.target.disabled = true;
        event.target.className = "btn btn-danger d-flex justify-content-end";
        event.target.value = "Sincronizando..."

        event.preventDefault();

        api.put(`/service/${id_domain}?service=sync`)
            .then( resp => {
                //window.alert("Base sincronizada com sucesso!");
                event.target.disabled = false;
                event.target.className = "btn btn-info d-flex justify-content-end";
                const personList = resp.data;
                this.setState({ list: personList });

            }).catch((error) =>{
                //window.alert("Erro ao sincronizar a base!");
                this.toggle(event, "", true);
                event.target.disabled = false;
                event.target.className = "btn btn-info d-flex justify-content-end";
            });
    }

    sync_entity(event, id_domain, uid_entity){
        event.preventDefault();
        api.put(`/service/${id_domain}?service=sync-entity&uid=${uid_entity}`)
            .then( resp => {
                window.alert("Usuário salvo na base LDAP com sucesso!");
                this.mount();
            }).catch((error) =>{
                window.alert("Erro ao sincronizar a base!");
            });
    }

    save_entity(event, id_domain, uid_entity){
        event.preventDefault();
        api.put(`/service/${id_domain}?service=save&uid=${uid_entity}`)
            .then( resp => {
                window.alert("Usuário salvo na base LDAP com sucesso!");
                this.mount();
            }).catch((error) =>{
                window.alert("Erro ao sincronizar a base!");
            });
    }

    resolve(event, id_sync, resolve){
        event.preventDefault();
        api.put(`/innova-ldap/${id_sync}?resolve=${resolve}`)
            .then( resp => {
                this.mount();
            })
    }

    load(person){
        this.setState({person: person});
    }

    remove(user){
        api.delete()
    }

    render_modal(){
        return (
            <div>
                <Modal 
                show={this.state.modal} 
                onHide={e => {this.toggle(e)}}
                size="lg"
                >
                    <Modal.Header>
                    <Modal.Title>Afiliações de { this.state.person.uid }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.renderAffiliationTable()}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={e => {this.toggle(e)}}>
                        Fechar
                    </Button>
                    {/* <Button variant="primary" onClick={e => {this.toggle(e)}}>
                        Save Changes
                    </Button> */}
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    render_modal_error(){
        return (
            <div>
                <Modal 
                show={this.state.modal_error} 
                onHide={e => {this.toggle(e,"", true)}}
                size="lg"
                >
                    <Modal.Header>
                    <Modal.Title className="text text-danger"> <icon className="fa fa-exclamation-circle text-danger"></icon> Erro ao sincronizar usuários</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Possíveis passos para resolver o problema:</h5>
                        <div className="container">
                            <ul className="list-group">
                                <li>Verifique as configurações</li>
                                <li>Verifique a conexão entre o sistema e Serviço de Diretórios</li>
                                <li>Verifique as configurações de firewall</li>
                            </ul>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={e => {this.toggle(e, "", true)}}>
                        Fechar
                    </Button>
                    {/* <Button variant="primary" onClick={e => {this.toggle(e)}}>
                        Save Changes
                    </Button> */}
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
    
    render() {
        return (

            <Main {...headerProps}>
                {this.render_modal()}
                {this.render_modal_error()}
            <Navbar bg="light" variant="light">
            <div className="container">
                <Navbar.Brand href="#home"></Navbar.Brand>
                <Nav className="me-auto">
                    <input type="button" className="btn btn-info d-flex justify-content-end" id="sync" href="#" onClick={e => this.sync(e, 1)} value="Sincronizar"></input>
                </Nav>
            </div>
          </Navbar>
                {this.renderPersonTable()}
            </Main>
        )
    }
}