import React, { Component } from 'react';
import Container from '../../Components/Container';
import Row from '../../Components/Row';
import CardSimple from '../../Components/CardSimple';
import Http from '../../Http';
import { Link } from 'react-router-dom';
import Loading from '../../Components/Loading'
import Col from "../../Components/Col";
import Input from "../../Components/Input";
import {formatDatePTBR, messageAlert} from "../../Methods";
import moment from "moment/moment";

class TaskList extends Component {
    constructor() {
        super();
        this.state = {
            tasks: [],
            taskFilter: [],
            search: "",
            loading: true
        };

        this.mount = this.mount.bind(this);
        this.search = this.search.bind(this);
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        new Http().get('/task').send((res) => {
            this.setState({
                tasks: res.data,
                taskFilter: res.data,
                loading: false
            });
        });
    }

    remove(task) {
        if (task) {
            new Http().delete('/task/' + task.id).send(async () => {
                let tasks = this.state.tasks;
                this.setState({
                    tasks: tasks.filter(e => e !== task),
                    taskFilter: tasks.filter(e => e !== task),
                });
                await messageAlert('Tarefa excluída com sucesso', 'success');
            });
        }
    }

    changeState(task) {
        if (task) {
            let state = {
                state : !task.state
            };
            new Http().patch('/task/' + task.id, state).send(async () => {
                let tasks = this.state.tasks;
                tasks.forEach(e => {
                    if (e.id === task.id) {
                        e.state = state.state;
                        e.completedAt = state.state ? moment().format('YYYY-MM-DD') : "";
                    }
                });
                this.setState({
                    tasks: tasks,
                });
                await messageAlert('Status modificado com sucesso', 'success');
            });
        }
    }

    search(field, value) {
        let valueOld = value;
        value = value.trim().toLowerCase();

        let tasks = this.state.taskFilter.filter((task) => {
            let state = task.state ? 'Solucionada' : 'Pendente';

            let hasDescription = task.description.toLowerCase().includes(value);
            let hasTitle = task.description.toLowerCase().includes(value);
            let hasCompletedAt = formatDatePTBR(task.completedAt).toLowerCase().includes(value);
            let hasState = state.toLowerCase().includes(value);

            return hasDescription || hasTitle || hasCompletedAt || hasState;
        });

        this.setState({
            tasks: tasks,
            search: valueOld
        })
    }

    mount() {
        if (this.state.tasks.length > 0) {
            return this.state.tasks.map((task, key) => {
                return <tr key={key}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{formatDatePTBR(task.completedAt)}</td>
                    <td><span className={`badge ${task.state ? 'badge-success' : 'badge-danger'}`}>{task.state ? 'Solucionada' : 'Pendente'}</span></td>
                    <td>
                        <div className="table-data-feature">
                            <button className="item" onClick={() => { this.changeState(task) }} data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit">
                                <i className="zmdi zmdi-refresh"></i>
                            </button>
                            <Link to={'/tarefa/editar/' + task.id} className="item" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit">
                                <i className="zmdi zmdi-edit"></i>
                            </Link>
                            <button className="item" onClick={() => { this.remove(task) }} data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit">
                                <i className="zmdi zmdi-delete"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            });
        }

        return false;
    }

    render() {
        const content = <Row class={"ml-2"}>
            <Col col={12}>
                <Input label={"Pesquisa"} value={this.state.search} change={this.search} />
            </Col>
        </Row>;

        return (
            <Container>
                {this.state.loading ?
                    <Row class={'justify-content-center'}>
                        <Loading />
                    </Row> : null}
                <Row style={{display: this.state.loading ? 'none' : '' }}>
                    <CardSimple content={content} title={'LISTA DE TAREFAS'} col="col-md-12" icon={'fa fa-tags'} urlNew={'/tarefa/cadastro'}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <td>Título</td>
                                    <td>Descrição</td>
                                    <td>Finalizada em:</td>
                                    <td>Status</td>
                                    <td />
                                </tr>
                            </thead>
                            <tbody>
                                {this.mount()}
                            </tbody>
                        </table>
                    </CardSimple>
                </Row>
            </Container>
        );
    }
}

export default TaskList;