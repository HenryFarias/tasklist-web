import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { isAuth } from './Methods';
import * as Task from './Views/Task';
import Login from './Views/Login';
import NotFound from './Views/NotFound';

import Base from './Components/Base';

const AppRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAuth()
            ? <Base><Component {...props} /></Base>
            : <Redirect to='/login' />
    )} />
);


const LoginRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAuth()
            ? <Redirect to='/' />
            : <Component {...props} />
    )} />
);

ReactDOM.render(
    <Router>
        <Switch>
            <LoginRoute exact path="/login" component={Login} />
            <AppRoute exact path="/tarefa" component={Task.List} />
            <AppRoute exact path="/tarefa/cadastro" component={Task.Form} />
            <AppRoute exact path="/tarefa/editar/:id" component={Task.Form} />
            <AppRoute exact path="/" component={Task.List} />
            <AppRoute exact path="*" component={NotFound} />
        </Switch>
    </Router>,
    document.getElementById('root')
);
