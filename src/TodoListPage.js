import React from "react";
import {Button, Card, Col, Icon, Input, Modal, Table, Tag} from "antd";
import axios from "axios";

export default class TodoListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            modalVisible: false,
            item: ""
        };
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.setModalVisibility = this.setModalVisibility.bind(this);
        this.onClickRow = this.onClickRow.bind(this);

    }

    setModalVisibility(isVisible) {
        this.setState({modalVisible: isVisible});
    }

    componentDidMount() {
        axios.get("http://localhost:8080/todo-list").then((response) => {
            this.setState({data: response.data})
        });
    }

    onChangeInput(param, e) {
        let {value} = e.target;
        this.setState({item: value});
    }

    onCreate() {
                let {item} = this.state;
        let req = {key: item, value: false};
        axios.post("http://localhost:8080/todo-list/create", req).then((response) => {
            this.setState({data: response.data, modalVisible: false});
        });
    }

        onClickRow(row) {
            let req = {key: row.todoItem, value: !row.status};
            axios.put("http://localhost:8080/todo-list/update", req).then((response) => {
                this.setState({data: response.data})
            });
        }

        render() {
            let {data} = this.state;
            let preparedData = Object.keys(data).map((key) => ({key: key, todoItem: key, status: data[key]}));

            const columns = [
                {
                    title: 'Todo Item',
                    dataIndex: 'todoItem',
                    key: 'todoItem',
                    render: text => <a href="javascript:;">{text}</a>,
                },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (text) => {
                    if (text === true) {
                        return <Icon style={{color: "green"}} type="check"/>
                    } else {
                        return <Icon style={{color: "red"}} type="minus"/>
                    }
                }
            }
        ];

        return (
            <>
                <Card bordered={false} title="Todo List">
                    <Col>
                        <Col style={{paddingRight: 50}}>
                            <Button onClick={() => this.setModalVisibility(true)}
                                    style={{float: "right"}}>Create</Button>
                        </Col>
                        <Table
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick:  ()=>this.onClickRow(record)
                                };
                            }}
                            style={{padding: 50}} columns={columns} dataSource={preparedData}/>
                    </Col>
                </Card>
                <Modal
                    title="Add Item"
                    visible={this.state.modalVisible}
                    onOk={this.onCreate}
                    onCancel={() => this.setModalVisibility(false)}
                >
                    <Input onChange={this.onChangeInput.bind(this, "item")} placeholder="Item"/>
                </Modal>
            </>
        );
    }
}
