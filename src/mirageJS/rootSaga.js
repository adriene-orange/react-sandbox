
import { all } from 'redux-saga/effects';
import toDoListSaga from './toDoList/toDoListSaga';

export default function* () {
  yield all([toDoListSaga()]);
}
