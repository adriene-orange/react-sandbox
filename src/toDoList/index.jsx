import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import map from 'lodash/map';
import { updateToDoListRequest } from './toDoListReducer';


const TODO = 'To do';
const COMPLETED = 'Completed';
const INPROGRESS = 'In progress'

const ToDoList = () => {
    const items = useSelector((state) => get(state, 'todo.items'));
    const dispatch = useDispatch();
    const addTaskInputRef = useRef();
    const statusSelectRef = useRef();
    const deleteButtonRef = useRef();

    const removeTaskFromList = () => dispatch(updateToDoListRequest({ updateType: 'REMOVE_TASK', taskId: deleteButtonRef.current.name }));
    const updateTaskStatus = () => dispatch(updateToDoListRequest({
        updateType: 'UPDATE_TASK',
        taskId: statusSelectRef.current.name,
        taskDetails: { status: statusSelectRef.current.value }
    }));
    const addTaskToList = (e) => {
        e.preventDefault();
        dispatch(updateToDoListRequest({ updateType: 'ADD_TASK', taskDetails: { value: addTaskInputRef.current.value } }))
    };

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
    return (
        <div style={containerStyle}>
            <label htmlFor="ADD_TASK" style={{padding: '30px'}}>
                <h2>Add a task!</h2>
                <form id="ADD_TASK"  onSubmit={addTaskToList}>
                    <input ref={addTaskInputRef} defaultValue="" type="text" placeholder="Add a task!"/>
                    &nbsp;
                    <button type="submit">Add</button>
                </form>
            </label>
            {
                items && Object.keys(items).length > 0 && (
                    <ul>
                    {
                        map(items, ({ value, status, uiStatus }, id) => {
                            if (uiStatus === 'PENDING') {
                               return (
                                    <li key={id}>
                                        <label style={listItemStyle}>
                                            <h3>Processing Task...</h3>
                                        </label>
                                    </li>
                               )

                            }
                            return (
                                <li key={id}>
                                    <label style={listItemStyle}>
                                        <h3>{value}-{status}</h3>
                                        &nbsp;
                                        <select ref={statusSelectRef} name={id} defaultValue={value} onChange={updateTaskStatus}>
                                            <option value={TODO}>{TODO}</option>
                                            <option value={COMPLETED}>{COMPLETED}</option>
                                            <option value={INPROGRESS}>{INPROGRESS}</option>
                                         </select>
                                        &nbsp;
                                        <button ref={deleteButtonRef} name={id} type="button" onClick={removeTaskFromList}>Delete</button>
                                    </label>
                                </li>
                            )
                        })
                    }
                </ul>

                )
            }
        </div>
    )
};

export default ToDoList;