
import { combineReducers } from 'redux';
// import toDoListReducer from './toDoList/toDoListReducer';
import list from './redux/list';

export default combineReducers({
  todo: list,
});
