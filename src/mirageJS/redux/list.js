import { LOADED, LOADING } from '../consts/uiStatuses';
import eventFactory from './toolKit/eventFactory';

const initialState = () => ({
  status: LOADING,
  listId: null,
  name: '',
  errorMessage: null,
  items: {},
});

const taskItemModel = ({
  value = 'Processing',
  status = 'To do',
  uiStatus = 'PENDING',
} = {}) => ({
  value,
  status,
  uiStatus,
});

const generateItems = (items = [], uiStatus = 'PENDING') => items.reduce((newItems, item) => {
  // eslint-disable-next-line no-param-reassign
  newItems[item.id] = taskItemModel({
    status: item.taskDetails.status,
    value: item.taskDetails.value,
    uiStatus,
  });
  return newItems;
}, {});

// event types  domain/action
export const LIST_REQUESTED = 'list/requested';
export const LIST_LOADED = 'list/loaded';
export const LIST_ITEM_CREATE_REQUESTED = 'listItem/createRequested';
export const LIST_ITEM_UPDATE_REQUESTED = 'listItem/updateRequested';
export const LIST_ITEM_DELETE_REQUESTED = 'listItem/deleteRequested';

export const LIST_ITEM_CREATED = 'listItem/created';
export const LIST_ITEM_UPDATED = 'listItem/updated';
export const LIST_ITEM_DELETED = 'listItem/deleted';

// using a standard event shape means not having to write a ton of boiler plate for action
// creators
export const eventCreators = eventFactory([
  LIST_REQUESTED,
  LIST_LOADED,
  LIST_ITEM_CREATE_REQUESTED,
  LIST_ITEM_UPDATE_REQUESTED,
  LIST_ITEM_DELETE_REQUESTED,
  LIST_ITEM_CREATED,
  LIST_ITEM_UPDATED,
  LIST_ITEM_DELETED,
]);

export default (state = initialState(), event = {}) => {
  switch (event.type) {
    case LIST_REQUESTED: {
      const { payload: { listId } } = event;
      // When loading a list we want to reset the state, but set the listId and status
      if (
        state.error
          || (state.status !== LOADING)
          || (state.status === LOADED && state.listId !== listId)
      ) {
        return {
          ...initialState(),
          listId,
          status: LOADING,
        };
      }
      return state;
    }
    case LIST_LOADED: {
      const { error, payload } = event;
      // This event only gets to update state if the current state is loading
      if (state.status === LOADING) {
        // if the event failed, we will still update the state to LOADED, but with an error message
        if (error) {
          return {
            ...state,
            status: LOADED,
            errorMessage: payload.message || 'Failed to fetch list',
            listItems: {},
          };
        }
        // To be extra defensive against events happening out of order
        // we only want to update our UI state if the event's listId matches
        // what we think we are loading
        // We could possibly put the state into an error state if we wanted to
        if (state.listId === payload.listId) {
          return {
            ...state,
            status: LOADED,
            name: payload.name,
            items: generateItems(payload.listItems),
          };
        }
      }
      return state;
    }
    default:
      return state;
  }
};
