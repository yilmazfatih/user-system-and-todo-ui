import React from 'react';
import {Table, Button, Tag, Card, Col, Modal, Input} from "antd";
import axios from "axios";
import 'antd/dist/antd.css'

export default class UserPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            modalVisible: false,
            formValues: {}
        };
        this.onClickDelete = this.onClickDelete.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.setModalVisibility = this.setModalVisibility.bind(this);
    }

    onClickDelete(id) {
        axios.delete("http://localhost:8080/user/delete?id=" + id).then((response) => {
            this.getUsers();
        });
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        axios.get("http://localhost:8080/user/list").then((response) => {
            this.setState({data: response.data})
        });
    }

    onChangeInput(param, e) {
        let {value} = e.target;
        if (param === "languages") {
            value = [value];
        }
        this.setState((state) => {
            return state.formValues[param] = value;
        });
    }

    onCreate() {
        let {formValues} = this.state;
        axios.post("http://localhost:8080/user/create", formValues).then((response) => {
            this.getUsers();
            this.setModalVisibility(false);
        });
    }

    setModalVisibility(isVisible) {
        this.setState({modalVisible: isVisible});
    }

    render() {
        let {data} = this.state;
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: text => <a href="javascript:;">{text}</a>,
            },
            {
                title: 'Surname',
                dataIndex: 'surname',
                key: 'surname',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Languages',
                key: 'languages',
                dataIndex: 'languages',
                render: tags => {
                    if (tags && tags.length > 0) {
                        return (
                            <span>
            {tags.map(tag => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                    color = 'volcano';
                }
                return (
                    <Tag color={color} key={tag}>
                        {tag.toUpperCase()}
                    </Tag>
                );
            })}
          </span>
                        );
                    } else {
                        return null;
                    }

                },
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Button onClick={this.onClickDelete.bind(this, record.id)} type="danger">Delete</Button>
                ),
            },
        ];

        return (
            <>
                <Card bordered={false} title="User Table">
                    <Col>
                        <Col style={{paddingRight: 50}}>
                            <Button onClick={() => this.setModalVisibility(true)}
                                    style={{float: "right"}}>Create</Button>
                        </Col>
                        <Table style={{padding: 50}} columns={columns} dataSource={data}/>
                    </Col>
                </Card>
                <Modal
                    title="Add User"
                    visible={this.state.modalVisible}
                    onOk={this.onCreate}
                    onCancel={() => this.setModalVisibility(false)}
                >
                    <Input onChange={this.onChangeInput.bind(this, "id")} placeholder="Id"/>
                    <Input onChange={this.onChangeInput.bind(this, "name")} style={{marginTop: 10}} placeholder="name"/>
                    <Input onChange={this.onChangeInput.bind(this, "surname")} style={{marginTop: 10}}
                           placeholder="Surname"/>
                    <Input onChange={this.onChangeInput.bind(this, "email")} style={{marginTop: 10}}
                           placeholder="Email"/>
                    <Input onChange={this.onChangeInput.bind(this, "languages")} style={{marginTop: 10}}
                           placeholder="Languages"/>
                </Modal>
            </>
        );
    }
}