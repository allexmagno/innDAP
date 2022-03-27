import React from 'react';
import { Routes, Route, Redirect } from 'react-router-dom';

import Home from '../components/home/Home';
import Success from '../components/success/Success';
import UserCrud from '../components/user/UserCrud';
import UserAdd from '../components/user/UserAdd';
import UserRegistry from '../components/user/UserRegistry';
import DomainCrud from '../components/domain/DomainCrud';
import MailCrud from '../components/mail/Mail';
import MailAdd from '../components/mail/MailAdd';
import ConfigurationCrud from '../components/configuration/ConfigurationCrud'
import Ldap from '../components/ldap/Ldap';
import { Provider } from 'react-redux';
import store from '../store';

export default props =>
    <Provider store={store}>
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/success" element={<Success />} />
            <Route path="/domains" element={<DomainCrud />} />
            <Route path="/config" element={<ConfigurationCrud />} />
            <Route path="/mail" element={<MailCrud />} />
            <Route path="/mail/add" element={<MailAdd />} />
            <Route path="/ldap" element={<Ldap />} />
            <Route path="/ldap/add" element={<MailAdd />} />
            <Route path="/users" element={<UserCrud />} />
            <Route path="/user/add" element={<UserAdd />} />
            <Route path="/user/self-registry" element={<UserRegistry />} />
            <Route path="*" element={<Home />} />
        </Routes>
    </Provider>