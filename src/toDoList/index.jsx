import React, { Component } from 'react';
import { filter, findIndex } from 'lodash';
import StatusSelect from './statusSelect';


class ToDoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTask: '',
            items: [],
        }
    }
    onChangeHandler = (e) => {
        const task = e.target.value;
        return this.setState({
            ...this.state,
            currentTask: task
        });
    }
    addTaskToList = (event) => {
        const { items, currentTask } = this.state;
        const id = `${currentTask}-${items.length + 1}`;
        const newToDo = {
            id,
            task: currentTask,
            status: 'To do',
        };
        return this.setState({ currentTask: '', items: [ ...items, newToDo   ] });
    }
    removeTaskFromList = (event) => {
        const taskId = event.target.name;
        const { items } = this.state;
        const filteredList = items.filter(({ id }) => id !== taskId);
        return this.setState({ items: filteredList });
    }
    updateTaskStatus = (event) => {
        const taskId = event.target.name;
        const status = event.target.value;
        const { items } = this.state;
        const taskIndex = findIndex(items, ({ id }) => id === taskId);;
        if (taskIndex >= 0) {
            const updatedTask = { ...items[taskIndex], status };
            const newItems = [
                ...items,
            ];
            newItems[taskIndex] = updatedTask;
            return this.setState({
                items: newItems
            })
        }
    }
    render() {
        const listItemStyle = {
            display: 'flex',
            flex: '0 0 auto',
            alignItems: 'center'
        };
        const containerStyle = {
            display: 'flex',
            flex:'0 0 auto',
            flexFlow: 'column wrap',
            border: '2px solid grey',
            height: '100vh',
        };
        const { items, currentTask } = this.state;
        return (
            <div style={containerStyle}>
                <label htmlFor="add-to-do" style={{padding: '30px'}}>
                    <h2>Add a task!</h2>
                    <form id="add-to-do" onSubmit={this.addTaskToList}>
                        <input value={currentTask} onChange={this.onChangeHandler} type="text" placeholder="Add a task!"/>
                        &nbsp;
                        <button type="submit">Add</button>
                    </form>
                </label>
                {
                    items && items.length > 0 && (
                        <ul>
                        {
                            items.map(({ id, task, status }) => (
                                <li key={id}>
                                    <label htmlFor={id} style={listItemStyle}>
                                        <h3>{task}-{status}</h3>
                                        &nbsp;
                                        <StatusSelect id={id} value={status} onChange={this.updateTaskStatus} />
                                        &nbsp;
                                        <button name={id} type="button" onClick={this.removeTaskFromList}>Delete</button>
                                    </label>
                                </li>
                            ))
                        }
                    </ul>

                    )
                }
            </div>
        )
    }
}

export default ToDoList;
