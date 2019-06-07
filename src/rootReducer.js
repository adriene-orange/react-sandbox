export default (state=[], action) => {
    switch(action.type) {
        case 'HI_SUCCESS':
            return [...state, 'Hi'];
        default:
            return [];
    }
};