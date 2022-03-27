import React, { Component } from 'react';
import Main from '../templates/Main';
import api from '../../services/Axios';


const headerProps = {
    icon: 'envelope',
    title: 'E-mail',
    subtitle: 'Gerenciamento de e-emails'
};

const uri = "/mail-server"

export default class UserCrud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            mail: {},
            open: false,
            modal: false,
            saved: false
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    };

    initialState = {
            list: [],
            mail: {},
            open: false,
            modal: false,
            saved: false
    }

    componentDidMount() {
        const mail = JSON.parse(localStorage.getItem('mail'));
        if(mail){
        this.setState({ mail: mail });
        localStorage.removeItem("mail");
        }
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }
      
    handleCloseModal () {
        this.setState({ showModal: false });
    }

    clear() {
        this.setState({ ...this.initialState });
        window.location = '/mail';
    }

    save() {
        console.log(this.state.mail)
        const mail = this.state.mail;
        let method = 'post';
        let to_uri = uri;
        if(mail.id){
            method = 'put';
            to_uri = uri + `/${mail.id}`;
        }
        api[method](to_uri, mail)
            .then(resp => {
                const list = this.getUpdatedList(resp.data);
                this.clear();
            });              
    }

    getUpdatedList(mail) {
        const list = this.state.list.filter( m => m.id !== mail.id );
        list.unshift(mail);
        return list;
    }

    updateField(event) {
        const mail = { ...this.state.mail };
        mail[event.target.name] = event.target.value;
        this.setState({ mail: mail });
    }

    toggle(event, id){
        if(id){
            const mail = this.state.list.filter( m => m.id == id).pop()
            this.setState({ mail: mail })
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
                            <label>Domínio</label>
                            <input type="text" className="form-control"
                                name="domain"
                                value={this.state.mail.domain}
                                onChange={e => this.updateField(e)}
                                placeholder="Domínio de gerenciamento"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control"
                                name="address"
                                value={this.state.mail.address}
                                onChange={e => this.updateField(e)}
                                placeholder="Endereço de e-mail"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Servidor</label>
                            <input type="text" className="form-control"
                                name="server"
                                value={this.state.mail.server}
                                onChange={e => this.updateField(e)}
                                placeholder="FQDN ou IP do servidor de e-mail"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Porta</label>
                            <input type="text" className="form-control"
                                name="port"
                                value={this.state.mail.port}
                                onChange={e => this.updateField(e)}
                                placeholder="Ex.: 465"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Protocolo</label>
                            <input type="text" className="form-control"
                                name="protocol"
                                value={this.state.mail.protocol}
                                onChange={e => this.updateField(e)}
                                placeholder="TLS ou SSL"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Senha</label>
                            <input type="password" className="form-control"
                                name="password"
                                value={this.state.mail.password}
                                onChange={e => this.updateField(e)}
                                placeholder="Senha do servidor de e-mail"
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
        );
    }


    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
            </Main>
        );
    }
}