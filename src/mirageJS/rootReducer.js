
import { combineReducers } from 'redux';
import toDoListReducer from './toDoList/toDoListReducer';

export const rootReducer = combineReducers({
  todo: toDoListReducer,
});
