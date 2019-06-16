import { call, take, put, takeEvery, actionChannel, delay } from 'redux-saga/effects'
import { buffers } from 'redux-saga';

function* resolveScan (data) {
    yield put({ type: 'SCAN_SUCCESS', data });
 }

function* handleScan(action) {
    yield put({ type: 'SCAN_REQUEST', data: action.data });
    const buffer = buffers.expanding();
    const requestChan = yield actionChannel('SCAN', buffer);
    try {
        while (true) {
            const { data } = yield take(requestChan);
            yield delay(5000);
            console.log({ type: 'SCAN_SUCCESS', data })
            yield put({ type: 'SCAN_SUCCESS', data });
            if (!buffer.isEmpty()) {
                yield put({ type: 'PENDING', data });
            } else {
                console.log('BUFFER IS EMPTY')
            }
        };
        
    } catch (e) {
            console.log(e);
    }
}

function* scanSaga() {
  yield takeEvery("SCAN", handleScan);
}

export default scanSaga;