import React, { Component } from 'react';
import Main from '../templates/Main';
import api from '../../services/Axios';
import {Button, Modal} from 'react-bootstrap';
import './UserCrud.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom'



const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários'
};

const initialState = {
    user : {
        name: '',
        email: ''
    },
    list: []
}

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
            icon: 'left'
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    };

    //state = { ...initialState };


    componentDidMount() {
        api.get('/person')
            .then( resp => {
                const personList = resp.data;
                this.setState({ list: personList });
            })
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }
      
    handleCloseModal () {
        this.setState({ showModal: false });
    }

    clear() {
        this.setState({ user: initialState.user });
    }

    save() {
        const user = this.state.user;
        const method = user.id ? 'put' : 'post';
        api[method](user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data);
                this.setState( { user: initialState.user, list: list} )
            })
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

    toggle(event, uid){
        if(uid){
            const person = this.state.list.filter( p => p.uid == uid).pop()
            this.setState({ person: person})
        }

        this.setState({ 
            open: !this.state.open,
            modal: !this.state.modal,
            icon: this.state.icon == 'left' ? 'down' : 'left'
        });
        
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
            <table className="table mt-4">
                <thead>
                    <th>Usuário</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>CPF</th>
                    <th>Passaporte</th>
                    <th>Afiliação</th>
                    <th>
                        <Link to="/mail/add">
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
            
            <tr key={String(person.uid)}>       
                <td>{person.uid}</td>
                <td>{person.name} {person.give_name} {person.surname}</td>
                <td>{person.email}</td>
                <td>{person.cpf}</td>
                <td>{person.passport}</td>
                <td>
                    <button className="btn primary">
                        <i className="fa fa-address-book-o" onClick={e => {this.toggle(e, person.uid)}}></i>
                    </button>

                    <Modal 
                    show={this.state.modal} 
                    onHide={e => {this.toggle(e)}}
                    size="lg"
                    >
                        <Modal.Header closeButton>
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
                </td>
                <td>
                    <ul>
                    {this.checkLdapStatus(person.ldap_sync)}
                        <li>
                            <Link to="/ldap/edit" className="text-info">
                                Editar <i className="fa fa-edit"></i>
                            </Link>
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

    checkLdapStatus(sync){
        if(!sync){
            return;
        }
        if(sync.status == "pending"){
            return (
                <ul className="list-group">
                    <li>
                        <Link to="/" className="text-success">
                                Aprovar <i className="fa fa-check-square-o"></i>
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="text-danger">
                                Rejeitar <i className="fa fa-remove"></i>
                        </Link>
                    </li>
                </ul>
            );
        }else if(sync.status == "update"){
            return (
                <li>
                    <Link to="/" className="text-primary">
                            Atualizar <i className="fa fa-refresh"></i>
                    </Link>
                </li>
            );
        }

    }

    renderAffiliationTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <th></th>
                    <th>Instituição</th>
                    <th>Tipo</th>
                    <th>Subtipo</th>
                    <th>Função</th>
                    <th>Entrada</th>
                    <th>Saída</th>
                    <th>
                        <Link to="/mail/add">
                            <i className="fa fa-plus text-success"></i>
                        </Link>
                    </th>
                </thead>
                <tbody>
                    {this.renderAffiliationRows()}
                </tbody>
            </table>
        )
    }

    renderAffiliationRows() {
        return (this.state.person.affiliations.map(aff => (
                <tr key={String(aff.id)}>
                    <td>{aff.affiliation}</td>
                    <td>{aff.organization}</td>
                    <td>{aff.type}</td>
                    <td>{aff.subtype}</td>
                    <td>{aff.role}</td>
                    <td>{aff.entrance}</td>
                    <td>{aff.exit}</td>
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
        )))
    }

    sync(event){
        event.preventDefault();
        api.put('/service/1?service=sync')
            .then( resp => {
                const personList = resp.data;
                this.setState({ list: personList });
            })
    }

    load(person){
        this.setState({person: person});
    }

    remove(user){
        api.delete()
    }

    render() {
        return (

            <Main {...headerProps}>
            <Navbar bg="light" variant="light">
            <div className="container">
                <Navbar.Brand href="#home"></Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link className="btn btn-info d-flex justify-content-end" href="#" onClick={e => this.sync(e)}>Sincronizar</Nav.Link>
                </Nav>
            </div>
          </Navbar>
                {this.renderPersonTable()}
            </Main>
        )
    }
}