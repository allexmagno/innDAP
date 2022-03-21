import React, { Component } from 'react';
import Main from '../templates/Main';
import api from '../../services/Axios';


const headerProps = {
    icon: 'envelope',
    title: 'E-mail',
    subtitle: 'Gerenciamento de e-mails'
};

const uri = "/mail-server"

export default class MailCrud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            mail: {},
            open: false,
            modal: false,
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    };


    
    componentDidMount() {
        api.get(uri)
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
                this.setState({ mail: mail, list: list })
            })
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
    
    renderMailTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <th></th>
                    <th>Domínio</th>
                    <th>E-mail</th>
                    <th>Servidor</th>
                    <th>Porta</th>
                    <th>Protocolo</th>
                    <th>
                        <a href="/mail/add">
                            <i className="fa fa-plus text-success"></i>
                        </a>
                    </th>
                </thead>
                <tbody>
                    {this.renderMailRows()}
                </tbody>
            </table>
        )
    }

    renderMailRows(){
        let count = 0;
        return this.state.list.map(mail => (
            <tr key={String(mail.id)}>      
                <td>{++count}</td> 
                <td>{mail.domain}</td>
                <td>{mail.address}</td>
                <td>{mail.server}</td>
                <td>{mail.port}</td>
                <td>{mail.protocol}</td>
                <td>
                    <ul>
                        <li>
                            <div>
                                <a className="text-info"
                                    onClick={e => this.editMail(e, mail)}
                                >
                                <i className="fa fa-edit"></i>
                                </a>
                            </div>  
                        </li>
                        <li>
                            <div>
                                <a className="text-danger"
                                    onClick={e => this.remove(e, mail)}
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

    editMail(event, mail){
        console.log(mail);
        localStorage.setItem("mail", JSON.stringify(mail));
        window.location = "mail/add";
    }

    load(mail) {
        this.setState({ mail: mail });
    }

    remove(event, mail) {
        api.delete(`${uri}/${mail.id}`)
            .then(resp => {
                const list = this.state.list.filter(m => m !== mail);
                this.setState({ list: list });
            })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderMailTable()}
            </Main>
        )
    }
}