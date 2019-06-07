import { call, take, put, takeEvery, actionChannel } from 'redux-saga/effects'
import { buffers } from 'redux-saga';

function* handleRequest(data) { 
    setTimeout(() => console.log(`delay ${data}`), 5000);
 }

function* handleScan(action) {
    const requestChan = yield actionChannel('HI', buffers.sliding(20));
    try {
        while (true) {
            const { data } = yield take(requestChan);
            yield call(handleRequest, data)
            yield put({ type: 'HI_SUCCESS'});
        };
    } catch (e) {
            console.log(e);
    }
}

function* scanSaga() {
  yield takeEvery("HI", handleScan);
}

export default scanSaga;