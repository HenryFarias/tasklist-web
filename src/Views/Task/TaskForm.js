import React, { Component } from 'react';
import Form from '../../Components/Form';
import Row from '../../Components/Row';
import Input from '../../Components/Input';
import { messageAlert } from '../../Methods';
import Http from '../../Http';
import Alert from '../../Components/Alert';
import Container from '../../Components/Container';
import Loading from '../../Components/Loading'
import TextArea from "../../Components/TextArea";

class TaskForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'CADASTRAR TAREFA',
            task: {
                description: '',
                title: '',
                state: false
            },
            alerts: [],
            loading: true
        };

        this.save = this.save.bind(this);
        this.change = this.change.bind(this);
    }

    componentDidMount() {
        let { id } = this.props.match.params;

        if (id) {
            new Http().get('/task/' + id).send((res) => {
                this.setState({
                    title: 'EDITAR TAREFA',
                    task: res.data,
                    loading: false
                });
            })
        } else {
            this.setState({
                loading: false
            });
        }
    }

    change(field, value) {
        let { task } = this.state;
        task[field] = value;
        this.setState({
            task: task
        })
    }

    save(e) {
        e.preventDefault();
        let { id } = this.props.match.params;
        let alerts = [];

        if (this.state.task.description.length <= 0) alerts.push('Preencha o campo descrição');
        if (this.state.task.title.length <= 0) alerts.push('Preencha o campo título');

        if (alerts.length <= 0) {
            if (id) {
                new Http().put('/task/' + id, this.state.task).send(async () => {
                    await messageAlert('Tarefa editada com sucesso', 'success');
                    await this.props.history.push('/tarefa');
                })
            } else {
                new Http().post('/task', this.state.task).send(async () => {
                    await messageAlert('Tarefa inserida com sucesso', 'success');
                    await this.props.history.push('/tarefa');
                })
            }
        } else {
            this.setState({ alerts: alerts })
        }
    }

    render() {
        let { task, title } = this.state;
        let alerts = this.state.alerts.map((alert, key) => <Alert key={key} message={alert} color="alert-danger" />);

        return (
            <Container>
                {this.state.loading ?
                    <Row class={'justify-content-center'}>
                        <Loading />
                    </Row> : null}
                <Row style={{display: this.state.loading ? 'none' : '' }}>
                    <Form title={title} col="col-sm-12" icon="fa fa-tag" urlCancel="/tarefa" onSubmit={this.save}>
                        {alerts}
                        <Row>
                            <Input name={'title'} value={this.state.task.title} change={this.change} label={'Título da tarefa'} col={6} />
                        </Row>
                        <Row>
                            <TextArea
                                col={'12'}
                                name={'description'}
                                label={'Descrição da tarefa'}
                                value={this.state.task.description}
                                change={this.change} />
                        </Row>
                    </Form>
                </Row>
            </Container>
        );
    }
}

export default TaskForm;