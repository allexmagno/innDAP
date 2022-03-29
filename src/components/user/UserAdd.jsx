import React, { Component } from 'react';
import Main from '../templates/Main';
import api from '../../services/Axios';
import Select from 'react-select';
import { Button, Modal } from 'react-bootstrap';


const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários'
};

const uri = "/person"

export default class UserCrud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            list_ok: [],
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
            aff_change: null,
            count: 0,
            open: false,
            modal: false,
            modal_affiliation: false,
            saved: false,
            edit_click: false,
            affiliation: {
                affiliation: null,
                organization: "",
                type: {},
                subtype: {},
                role: "",
                entrance: "",
                exit: null
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
            affiliation: null,
            organization: "",
            type: {},
            subtype: {},
            role: "",
            entrance: "",
            exit: null
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
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        localStorage.removeItem("user");
        if(user){
            let list = [];
            for(let i in user.affiliations){
                const aff = user.affiliations[i];
                let affiliation = {
                    id: aff.id,
                    affiliation: aff.affiliation,
                    organization: aff.organization,
                    type: {},
                    subtype: {},
                    role: aff.role,
                    entrance: aff.entrance,
                    exit: aff.exit
                };

                for(let t of this.state.affiliationsType){
                    if(aff.type.toUpperCase() === t.value.toUpperCase()){
                        affiliation.type = t;
                        for(let s of t.subtype){
                            if(aff.subtype.toUpperCase() == s.value.toUpperCase()){
                                affiliation.subtype = s;
                            }
                        }
                    }
                }
                list.push(affiliation)
            }
            user.affiliations = []
            let senha = document.getElementById("input-password");
            senha.readOnly = true;
            this.setState({ user: user, list: list })
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
        // if(this.state.affiliation){
        //     this.addAffiliation();
        // }


        const user = this.state.user;
        const affiliations = this.state.list;

        let method = 'post';
        let to_uri = uri;
        if(user.uid){
            method = 'put';
            to_uri = uri + `/${user.uid}`;
        }

        for(let aff of affiliations){
            let uid = null;
            let aff_id = null;

            if(method == 'put'){
                uid = user.uid;
                aff_id = aff.id;
            }
            const affiliation = {
                id: aff_id,
                affiliation: aff.affiliation,
                organization: aff.organization,
                type: aff.type.value,
                subtype: aff.subtype.value,
                role: aff.role,
                entrance: aff.entrance,
                exit: aff.exit,
                uid_innova_person: uid
            }
            user.affiliations.push(affiliation);
        }

        api[method](to_uri, user)
            .then(resp => {
                if(method === 'post'){
                    this.syncUser(resp.data.ldap_sync)
                }else{
                //const list = this.getUpdatedList(resp.data);
                    this.clear();
                }
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
        if(event.target.name === "affiliation"){
            if(event.target.value <= 0){
                event.target.value = null;
            }
        }
        const affiliation = { ...this.state.affiliation };
        affiliation[event.target.name] = event.target.value;
        this.setState({ affiliation: affiliation });
    }

    toggle(event, aff, edit_cancel){

        if(edit_cancel && this.state.edit_click){
            this.state.list.push(this.state.affiliation)
            let l = this.state.list;
            const sorted = l.sort((a, b) => {
                return a.affiliation < b.affiliation ? -1 : a.affiliation > b.affiliation ? 1 : 0;
            })
            this.setState({ list : sorted, edit_click: false });
        }

        if(aff == "add_affiliation"){
            this.setState({ 
                aff_change: aff,
                open: !this.state.open,
                modal_affiliation: !this.state.modal_affiliation,
                icon: this.state.icon == 'left' ? 'down' : 'left'
            });
        }
        else{
            this.setState({ 
                aff_change: aff,
                open: !this.state.open,
                modal: !this.state.modal,
                icon: this.state.icon == 'left' ? 'down' : 'left'
            });
        }
        
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
                <div className="col-12 col-md-4 border rounded" key={String(aff.affiliation)}>
                    <strong>Afiliação {aff.affiliation}:</strong> {aff.organization} <br/>
                    <strong>Tipo:</strong> {aff.type.label} <br/>
                    <strong>Subtipo:</strong> {aff.subtype.label} <br/>
                    <strong>Cargo:</strong> {aff.role} <br/>
                    <strong>Instituição:</strong> {aff.organization}<br/>
                    <strong>Início:</strong> {aff.entrance} <br/>
                    <strong>Saída:</strong> {aff.exit} <br/>
                    <button className="btn btn-outline-warning" onClick={e => {this.editAffiliation(e, aff)}}> 
                        Editar
                    </button>
                    <button className="btn btn-outline-danger ml-2" onClick={e => this.removeAffiliation(e, aff)}> 
                        Excluir
                    </button>
                </div>
        ));
    }

    editAffiliation(event, aff){
        
        this.setState({ edit_click: true});
        this.toggle(event, "add_affiliation");
        const list = this.state.list.filter( a => aff.affiliation !== a.affiliation );
        this.state.affiliation = aff
        this.setState({ list: list })
        this.selectTypeRef.setValue(aff.type);
        this.selectSubTypeRef.setValue(aff.subtype)
        
    }

    removeAffiliation(event, aff){
        const a = window.confirm(`Deseja realmente excluir a afiliação ${aff.affiliation}: ${aff.organization}?`);
        if(a){
            const list = this.state.list.filter( a => aff.affiliation !== a.affiliation );
            for(let i in list){
                list[i].affiliation = parseInt(i) + 1;
            }
            this.state.list = list;
            this.setState({ list: list })
        }
    }

    table_affiliation(){

        return (
            <div className="form">
            <div className="row">
                <div id="number" className="col-12 col-md-2">
                    <div className="form-group">
                        <label> <icon className="fa fa-address-card-o"></icon> Afiliação</label>
                        <input type="number" min="1" className="form-control"
                            id="input_affiliation"
                            name="affiliation"
                            value={this.state.affiliation.affiliation}
                            onChange={e => this.updateAffiliationField(e)}
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label><icon className="fa fa-institution"></icon> Instituição</label>
                        <input type="text" className="form-control"
                            id="input_organization"
                            name="organization"
                            value={this.state.affiliation.organization}
                            onChange={e => this.updateAffiliationField(e)}
                            placeholder={"instituição@PARQUE"}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label><icon className="fa fa-briefcase"></icon> Função</label>
                        <input type="text" className="form-control"
                            name="role"
                            value={this.state.affiliation.role}
                            onChange={e => this.updateAffiliationField(e)}
                            placeholder="Cargo"
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label><icon className="fa fa-tag"></icon> Tipo</label>
                        {this.selectType()}
                    </div>   
                </div>                                
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label><icon className="fa fa-tags"></icon> Subtipo</label>
                        {this.selectSubType()}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-3">
                    <div className="form-group">
                        <label><icon className="fa fa-calendar-check-o"></icon> Data de Início</label>
                        <input type="date" className="form-control"
                            id="input_entrance"
                            name="entrance"
                            value={this.state.affiliation.entrance}
                            onChange={e => this.updateAffiliationField(e)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="form-group">
                        <label><icon className="fa fa-calendar-times-o"></icon> Data de Saída</label>
                        <input type="date" className="form-control"
                            name="exit"
                            value={this.state.affiliation.exit}
                            onChange={e => this.updateAffiliationField(e)}
                        />
                    </div>
                </div>
        </div>
        </div>
        );

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
                                placeholder="Domínio de gerenciamento"
                                required
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
                                placeholder="Primeiro nome"
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
                                placeholder="Nome do meio"
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
                                placeholder="Sobrenome"
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
                                placeholder="Endereço de e-mail"
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
                                placeholder="xxx.xxx.xxx-xx"
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
                                placeholder="Série Passaporte"
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
                                placeholder="Senha"
                                id="input-password"
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-8">      
                        <div className="row">
                            <div className="col-8 d-flex justify-content">
                                <button className="btn btn-outline-success"
                                    onClick={e => this.toggle(e, "add_affiliation")}
                                >
                                    Afiliação <i className="fa fa-plus text-success"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="row">
                    {this.listAffiliations()}
                </div>
                

                <hr></hr>
                <div className="row">
                    <br/>
                    <div className="col-12 d-flex justify-content-end" >
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
            id="input_type"
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
            id="input_subtype"
            />
        );
    }

    check_affiliation(aff){

        let required = [];

        if(!aff.affiliation){
            required.push(document.getElementById("input_affiliation"));
        }
        if(!aff.organization){
            required.push(document.getElementById("input_organization"));
        }
        if(!aff.type){
             required.push(document.getElementById("input_type"));
        }
        if(!aff.subtype){
            required.push(document.getElementById("input_subtype"));
        }
        if(!aff.entrance){
            required.push(document.getElementById("input_entrance"));
        }
        const liAff = this.state.list.filter( a => a.affiliation == aff.affiliation);
        if(liAff.length > 0){
            required.push(document.getElementById("input_affiliation"));
        }

        return required;

    }

    async addAffiliation(event){
        const aff = { ...this.state.affiliation };
        let required = this.check_affiliation(aff);

        if(required.length == 0){
            for(let inp of this.state.list_ok){
                inp.style.border = "";
            }

            this.toggle(event, "add_affiliation");
            
            let l = this.state.list;


            l.push(aff);

            const affiliation = {
                affiliation: null,
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

            this.setState({ list: sorted, affiliation: affiliation, list_ok: [] })

        }else{
            for(let inp of required){
                inp.style.border = "1px solid red";
            }
            this.setState({ list_ok: required});
        }
    }
    
    affiliation(){
        let row = document.getElementById("affiliation");
        let aff = document.getElementById("affiliationForm")
        let newAff = aff.cloneNode(true);
        row.appendChild(newAff);
    }

    render_modal(){
        return (
            <div>
                <Modal 
                show={this.state.modal} 
                onHide={e => {this.toggle(e)}}
                size="lg"
                >
                    <Modal.Header closeButton>
                    <Modal.Title> Editar Afiliação? </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text text-danger">Ao continuar suas alterações não salvas serão perdidas!</p>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={e => {this.toggle(e)}}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={e => {this.editAffiliation(e, this.state.aff_change)}}>
                        Continuar
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    render_modal_affiliation(){
        return (
            <div>
                <Modal 
                show={this.state.modal_affiliation} 
                onHide={e => {this.toggle(e, "add_affiliation")}}
                size="lg"
                backdrop="static"
                >
                    <Modal.Header>
                    <Modal.Title><icon className="fa fa-address-book-o"></icon> Afiliação </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.table_affiliation()}
                    </Modal.Body>
                    <Modal.Footer>
                    <button  className="btn btn-outline-danger"
                    onClick={e => {this.toggle(e, "add_affiliation", true)}}>
                        Cancelar
                    </button>
                    <button className="btn btn-outline-success"
                        onClick={e => this.addAffiliation(e)}
                    >
                        Salvar
                    </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.render_modal_affiliation()}
                {this.render_modal()}
                {this.renderForm()}
            </Main>
        );
    }

}