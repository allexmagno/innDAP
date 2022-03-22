import React, { Component } from 'react';
import Main from '../templates/Main';
import api from '../../services/Axios';
import Select from 'react-select';
import Calendar from 'react-calendar';


const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Auto registro'
};

const uri = "/person"

export default class UserCrud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            user: {
                name: "",
                surname: "",
                given_name: "",
                email: "",
                cpf: "",
                passport: "",
                password: "",
                domain: "",
                affiliations: []
            },
            count: 0,
            open: false,
            modal: false,
            saved: false,
            affiliation: {
                affiliation: 0,
                organization: "",
                type: {},
                subtype: {},
                role: "",
                entrance: "",
                exit: ""
            },
            affiliationSubType: [],
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
        
        this.selectTypeRef = null;
        this.selectSubTypeRef = null;
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleTypeAffiliations = this.handleTypeAffiliations.bind(this);
        this.handleSubTypeAffiliations = this.handleSubTypeAffiliations.bind(this);

    };

    initialState = {
            list: [],
            user: {},
            open: false,
            modal: false,
            saved: false
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user){
        this.setState({ user: user });
        localStorage.removeItem("user");
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
        window.location = '/users';
    }

    save() {
        if(this.state.affiliation){
            this.addAffiliation();
        }
        const user = this.state.user;
        const affiliations = this.state.list;
        for(let aff of affiliations){
            const affiliation = {
                    affiliation: aff.affiliation,
                    organization: aff.organization,
                    type: aff.type.value,
                    subtype: aff.subtype.value,
                    role: aff.role,
                    entrance: aff.entrance,
                    exit: aff.exit
            }
            user.affiliations.push(affiliation);
        }

        let method = 'post';
        let to_uri = uri;
        // if(user.uid){
        //     method = 'put';
        //     to_uri = uri + `/${user.uid}`;
        // }

        api[method](to_uri, user)
            .then(resp => {
                this.syncUser(resp.data.ldap_sync)
                //const list = this.getUpdatedList(resp.data);
                //this.clear();
            });              
    }

    syncUser(sync) {
        api.put(`innova-ldap/${sync.id}?resolve=valid`)
            .then(resp => {
                this.clear();
            })
    }

    getUpdatedList(user) {
        const list = this.state.list.filter( u => u.uid !== user.id );
        list.unshift(user);
        return list;
    }

    updateUserField(event) {
        const user = { ...this.state.user };
        user[event.target.name] = event.target.value;
        this.setState({ user: user });
    }

    updateAffiliationField(event) {
        const affiliation = { ...this.state.affiliation };
        affiliation[event.target.name] = event.target.value;
        this.setState({ affiliation: affiliation });
    }

    toggle(event, id){
        if(id){
            const user = this.state.list.filter( u => u.uid == id).pop()
            this.setState({ user: user })
        }

        this.setState({ 
            open: !this.state.open,
            modal: !this.state.modal,
            icon: this.state.icon == 'left' ? 'down' : 'left'
        });
        
    }

    handleTypeAffiliations(selected){
        if(this.selectSubTypeRef){
            this.selectSubTypeRef.setValue("");
        }
        let aff = this.state.affiliation;
        aff.type = selected;
        aff.subtype = null;
        this.setState({ affiliation: aff, affiliationSubType: selected.subtype });
    }

    handleSubTypeAffiliations(selected){
        let aff = this.state.affiliation;
        aff.subtype = selected;
        this.setState({ affiliation: aff });
    }

    listAffiliations(){
        return this.state.list.map(aff => (
            <li className="list-group-item" key={String(aff.affiliation)}>
                <strong>Afiliação {aff.affiliation}:</strong> {aff.organization} <br/>
                <strong>Tipo:</strong> {aff.type.label} <br/>
                <strong>Subtipo:</strong> {aff.subtype.label} <br/>
                <strong>Cargo:</strong> {aff.role} <br/>
                <strong>Instituição:</strong> {aff.organization}<br/>
                <strong>Início:</strong> {aff.entrance} <br/>
                <strong>Saída:</strong> {aff.exit} <br/>
                <button className="btn btn-outline-warning" onClick={e => this.editAffiliation(e, aff)}> 
                    Editar
                </button>
                <button className="btn btn-outline-danger ml-2" onClick={e => this.removeAffiliation(e, aff)}> 
                    Excluir
                </button>
            </li> 
        ));
    }

    editAffiliation(event, aff){
        const a = window.confirm("Ao continuar os dados em edição serão perdidos");
        if(a){
            const list = this.state.list.filter( a => aff.affiliation !== a.affiliation );
            this.setState({ affiliation: aff, list: list })
            this.selectTypeRef.setValue(aff.type);
            this.selectSubTypeRef.setValue(aff.subtype)
        }
    }

    removeAffiliation(event, aff){
        const a = window.confirm(`Deseja realmente excluir a afiliação ${aff.affiliation}: ${aff.organization}?`);
        if(a){
            const list = this.state.list.filter( a => aff.affiliation !== a.affiliation );
            for(let i in list){
                list[i].affiliation = parseInt(i) + 1;
            }
            this.setState({ list: list })
        }
    }

    renderForm() {
        return(
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Usuário</label>
                            <input type="text" className="form-control"
                                name="uid"
                                value={this.state.user.uid}
                                onChange={e => this.updateUserField(e)}
                                readOnly={true}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Domínio</label>
                            <input type="text" className="form-control"
                                name="domain"
                                value={this.state.user.domain}
                                onChange={e => this.updateUserField(e)}
                                placeholder="Digite o Nome"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.user.name}
                                onChange={e => this.updateUserField(e)}
                                placeholder="Digite o Nome"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome do meio</label>
                            <input type="text" className="form-control"
                                name="given_name"
                                value={this.state.user.given_name}
                                onChange={e => this.updateUserField(e)}
                                placeholder="Digite o Nome"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Sobrenome</label>
                            <input type="text" className="form-control"
                                name="surname"
                                value={this.state.user.surname}
                                onChange={e => this.updateUserField(e)}
                                placeholder="Digite o Sobrenome"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={this.state.user.email}
                                onChange={e => this.updateUserField(e)}
                                placeholder="Digite o endereço de e-mail"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>CPF</label>
                            <input type="text" className="form-control"
                                name="cpf"
                                value={this.state.user.cpf}
                                onChange={e => this.updateUserField(e)}
                                placeholder="Digite o CPF"
                            />
                        </div>
                    </div>


                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Passaporte</label>
                            <input type="text" className="form-control"
                                name="passport"
                                value={this.state.user.passport}
                                onChange={e => this.updateUserField(e)}
                                placeholder="Digite o Passaporte"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Senha</label>
                            <input type="password" className="form-control"
                                name="password"
                                value={this.state.user.password}
                                onChange={e => this.updateUserField(e)}
                                placeholder="Digite a Senha"
                            />
                        </div>
                    </div>
                </div>


                <hr></hr>
                <h3>Adicionar Afiliações</h3>

                <div className="row">
                    <div className="col-12 col-md-8">

                    <div className="row">
                            <div className="col-12 col-md-3">
                                <div className="form-group">
                                    <input type="hidden" className="form-control"
                                        name="affiliation"
                                        value={this.state.affiliation.affiliation}
                                        onChange={e => this.updateAffiliationField(e)}
                                        disabled
                                    />
                                </div>
                            </div>
                    </div>


                        <div className="row">
                            <div className="col-12 col-md-8">
                                <div className="form-group">
                                    <label>Instituição</label>
                                    <input type="text" className="form-control"
                                        name="organization"
                                        value={this.state.affiliation.organization}
                                        onChange={e => this.updateAffiliationField(e)}
                                        placeholder={"instituição@PARQUE"}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-4">
                                <div className="form-group">
                                    <label>Tipo</label>
                                    {this.selectType()}
                                </div>   
                            </div>                                
                            <div className="col-12 col-md-4">
                                <div className="form-group">
                                    <label>Subtipo</label>
                                    {this.selectSubType()}
                                </div>
                            </div>
                        </div>


                        <div className="row">
                            <div className="col-12 col-md-8">
                                <div className="form-group">
                                    <label>Função</label>
                                    <input type="text" className="form-control"
                                        name="role"
                                        value={this.state.affiliation.role}
                                        onChange={e => this.updateAffiliationField(e)}
                                        placeholder="Digite o Cargo"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-4">
                                <div className="form-group">
                                    <label>Data de Início</label>
                                    <input type="date" className="form-control"
                                        name="entrance"
                                        value={this.state.affiliation.entrance}
                                        onChange={e => this.updateAffiliationField(e)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="form-group">
                                    <label>Data de Saída</label>
                                    <input type="date" className="form-control"
                                        name="exit"
                                        value={this.state.affiliation.exit}
                                        onChange={e => this.updateAffiliationField(e)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-8 d-flex justify-content-end">
                                <button className="btn btn-outline-success"
                                    onClick={e => this.addAffiliation(e)}
                                >
                                    Afiliação <i className="fa fa-plus text-success"></i>
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="col-12 col-md-3">
                        <ul className="list-group">
                            {this.listAffiliations()}
                        </ul>
                    </div>
                </div>


                <div className="justify-content-end">
                            <button className="btn btn-outline-primary"
                                onClick={e => this.save(e)}
                            >
                                Salvar
                            </button>
                            <button className="btn btn-outline-secondary ml-2"
                                onClick={e => this.clear(e)}
                            >
                                Cancelar
                            </button>
                </div>
            </div>
        );
    }


    selectType(){
        return(
            <Select 
            ref={r => {
                this.selectTypeRef = r;
            }}
            onChange={this.handleTypeAffiliations}
            options={this.state.affiliationsType}
            placeholder= 'Selecione o tipo de vínculo'
            />
        );
    }

    selectSubType(){
        return(
            <Select 
            ref={r => {
                this.selectSubTypeRef = r;
            }}
            onChange={this.handleSubTypeAffiliations}
            options={this.state.affiliationSubType}
            noOptionsMessage={() => "Selecione um Tipo"}  
            placeholder= 'Selecione o subtipo de vínculo'
            />
        );
    }

    async addAffiliation(event){
        const aff = { ...this.state.affiliation };
        let check = true;

        if(!aff.organization) check = false;
        if(!aff.type) check = false;
        if(!aff.subtype) check = false;
        if(!aff.entrance) check = false;

        if(check){
            let l = this.state.list;

            if(aff.affiliation === 0){
                aff.affiliation = l.length + 1;
            }

            l.push(aff);

            const affiliation = {
                affiliation: 0,
                organization: "",
                type: "",
                subtype: "",
                role: "",
                entrance: "",
                exit: ""
            }
            this.selectTypeRef.setValue("");
            this.selectSubTypeRef.setValue("");
            const sorted = l.sort((a, b) => {
                return a.affiliation < b.affiliation ? -1 : a.affiliation > b.affiliation ? 1 : 0;
            })
            this.setState({ list: sorted, affiliation: affiliation })
        }
    }
    
    affiliation(){
        let row = document.getElementById("affiliation");
        let aff = document.getElementById("affiliationForm")
        let newAff = aff.cloneNode(true);
        row.appendChild(newAff);
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
            </Main>
        );
    }
}