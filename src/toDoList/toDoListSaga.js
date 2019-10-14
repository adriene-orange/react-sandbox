import { put, takeEvery, delay } from 'redux-saga/effects';
import uuidV4 from 'uuid/v4'
import { generateUpdateAction } from './toDoListReducer';

function* updateToDoList({ updateType, taskDetails, taskId }) {
    try {
        if (!taskDetails && updateType !== 'REMOVE_TASK') {
            throw new Error('Invalid payload')
        }
        let id = taskId;
        if (!id) {
            id = uuidV4();
        }
        yield put(generateUpdateAction({
            type: 'SET_TASK_TO_PENDING',
            taskId: id,
            taskDetails: {
                uiStatus: 'PENDING',
            }
        }));
        // wait 30 seconds
        yield delay(3000);
        yield put(generateUpdateAction({
            type: updateType,
            taskDetails: {
                ...taskDetails,
                uiStatus: 'LOADED',
            },
            taskId: id,
        }));

    } catch (e) {
        console.log(e);
    }
}

export default function* () {
    yield takeEvery('UPDATE_TO_DO_LIST_REQUEST', updateToDoList);
}
