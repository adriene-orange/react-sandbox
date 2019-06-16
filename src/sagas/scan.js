import { call, take, put, takeEvery, actionChannel, delay } from 'redux-saga/effects'
import { buffers } from 'redux-saga';

function* handleScan(action) {
    const buffer = buffers.expanding();
    const requestChan = yield actionChannel('SCAN', buffer);
    try {
        while (true) {
            yield put({ type: 'SCAN_REQUEST', data: action.data });
            const { data } = yield take(requestChan);
            yield delay(5000);
            yield put({ type: 'SCAN_SUCCESS', data });
        };
    } catch (e) {
        console.log(e);
    }
}

function* scanSaga() {
  yield takeEvery("SCAN", handleScan);
}

export default scanSaga;