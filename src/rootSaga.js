
import { all } from 'redux-saga/effects';
import toDoListSaga from './toDoList/toDoListSaga';

export function* rootSaga () {
    yield all([toDoListSaga()]);
}