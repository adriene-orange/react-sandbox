import React, { useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import map from 'lodash/map';
import { updateToDoListRequest } from './toDoListReducer';
import {
  fetchAllTodosService,
} from './toDoServices';

const TODO = 'To do';
const COMPLETED = 'Completed';
const INPROGRESS = 'In progress';

const ToDoList = () => {
  const items = useSelector((state) => get(state, 'todo.items'));
  const dispatch = useDispatch();
  const addTaskInputRef = useRef();

  useEffect(() => {
    const getAllTodos = async () => {
      try {
        dispatch({
          type: 'LOAD_TODO_LIST',
        });
        const { todos } = await fetchAllTodosService();
        dispatch({
          type: 'LOAD_TODO_LIST_SUCCESS',
          todos,
        });
      } catch (error) {
        dispatch({
          type: 'LOAD_TODO_LIST_FAILURE',
          error,
        });
      }
    };
    getAllTodos();
  }, []);

  const removeTaskFromList = useCallback((taskId) => dispatch(updateToDoListRequest({ updateType: 'REMOVE_TASK', taskId })));
  const updateTaskStatus = useCallback((taskId, status) => dispatch(updateToDoListRequest({
    updateType: 'UPDATE_TASK',
    taskId,
    taskDetails: { status },
  })));
  const addTaskToList = (e) => {
    e.preventDefault();
    dispatch(updateToDoListRequest({ updateType: 'ADD_TASK', taskDetails: { value: addTaskInputRef.current.value } }));
    addTaskInputRef.current.value = '';
  };

  const listItemStyle = {
    display: 'flex',
    flex: '0 0 auto',
    alignItems: 'center',
  };
  const containerStyle = {
    display: 'flex',
    flex: '0 0 auto',
    flexFlow: 'column wrap',
    border: '2px solid grey',
    height: '100vh',
  };
  return (
    <div style={containerStyle}>
      <label htmlFor="ADD_TASK" style={{ padding: '30px' }}>
        <h2>Add a task!</h2>
        <form id="ADD_TASK" onSubmit={addTaskToList}>
          <input ref={addTaskInputRef} defaultValue="" type="text" placeholder="Add a task!" />
                    &nbsp;
          <button type="submit">Add</button>
        </form>
      </label>
      {
                items && Object.keys(items).length > 0 && (
                <ul>
                  {
                        map(items, ({ value, status, uiStatus, errorMessage }, id) => {
                          if (errorMessage) {
                            return (
                              <li key={id}>
                                <span style={listItemStyle}>
                                  <h3>{errorMessage}</h3>
                                </span>
                              </li>
                            );
                          }
                          if (uiStatus === 'PENDING') {
                            return (
                              <li key={id}>
                                <span style={listItemStyle}>
                                  <h3>Processing Task...</h3>
                                </span>
                              </li>
                            );
                          }
                          return (
                            <li data-testid="todo-cards" key={id}>
                              <label style={listItemStyle} htmlFor={id}>
                                <h3>{value}</h3>
                                        &nbsp;
                                <select id={id} defaultValue={status} name={id} onChange={(e) => updateTaskStatus(id, e.target.value)}>
                                  <option value={TODO}>{TODO}</option>
                                  <option value={COMPLETED}>{COMPLETED}</option>
                                  <option value={INPROGRESS}>{INPROGRESS}</option>
                                </select>
                                        &nbsp;
                                <button name={id} type="button" onClick={() => removeTaskFromList(id)}>Delete</button>
                              </label>
                            </li>
                          );
                        })
                    }
                </ul>

                )
            }
    </div>
  );
};

export default ToDoList;
