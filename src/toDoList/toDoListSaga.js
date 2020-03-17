import { put, takeEvery, call } from 'redux-saga/effects';
import uuidV4 from 'uuid/v4';
import { generateUpdateAction, failureAction } from './toDoListReducer';
import {
    addToDoService,
    updateToDoService,
    deleteToDoService,
} from './toDoServices';

function* updateToDoList({ updateType, taskDetails, taskId }) {
    try {
        if (!taskDetails && updateType !== 'REMOVE_TASK') {
            throw new Error('Invalid payload')
        }
        let id = taskId || uuidV4();
        yield put(generateUpdateAction({
            type: 'SET_TASK_TO_PENDING',
            taskId: id,
            taskDetails: {
                uiStatus: 'PENDING',
            }
        }));
        // Delete Task
        if (updateType === 'REMOVE_TASK') {
            yield call(deleteToDoService, { id });
        }
        // Update Task
        else if (taskId) {
            yield call(updateToDoService, { todo: { id, taskDetails } });
        }
        // Create task
        else {
            yield call(addToDoService, { todo: { id, taskDetails } });
        }
        yield put(generateUpdateAction({
            type: updateType,
            taskDetails: {
                ...taskDetails,
                uiStatus: 'LOADED',
            },
            taskId: id,
        }));

    } catch (error) {
        yield put(failureAction({
            taskId: id,
            updateType,
            taskDetails: {
                uiStatus: 'ERROR',
            },
            error,
        }));
    }
}



export default function* () {
    yield takeEvery('UPDATE_TO_DO_LIST_REQUEST', updateToDoList);
}
