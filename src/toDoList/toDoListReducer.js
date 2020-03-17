const initialState = {
    items: {},
    error: null,
};

const taskItemModel = ({
    value = 'Processing',
    status = 'To do',
    uiStatus = 'PENDING',
} = {}) => ({
    value,
    status,
    uiStatus,
});

export const updateToDoListRequest = ({ updateType, taskDetails, taskId }) => ({
    type: 'UPDATE_TO_DO_LIST_REQUEST',
    updateType,
    taskId,
    taskDetails,
});

export const generateUpdateAction = ({ type, taskId, taskDetails=undefined }) => ({
    type,
    taskId,
    taskDetails,
});

export const failureAction = ({
    updateType,
    taskId,
    taskDetails,
    error,
}) => ({
    type: 'FAILURE',
    updateType,
    taskId,
    taskDetails,
    error,
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case 'LOAD_TODO_LIST_SUCCESS': {
            const { todos } = action;
            if (todos.length > 0) {
                const items = {};
                todos.forEach((todo) => {
                    items[todo.id] = taskItemModel(todo.taskDetails);
                });
                return {
                    ...state,
                    items,
                }
            }
        }
        case 'SET_TASK_TO_PENDING':
        case 'UPDATE_TASK':
        case 'ADD_TASK': {
            const { taskId, taskDetails } = action;
            const { items } = state;
            const newTask = items[taskId] ? taskItemModel({
                ...items[taskId],
                ...taskDetails,
            }) : taskItemModel(taskDetails);
            console.log(newTask);
            return {
                ...state,
                items: {...state.items, [taskId]: newTask },
            };
        }
        case 'REMOVE_TASK': {
            const { taskId } = action;
            const { items } = state;
            const updatedItems = { ...items };
            delete updatedItems[taskId];
            return {
                ...state,
                items: updatedItems,
            };
        }
        default: return state;
    }
};
