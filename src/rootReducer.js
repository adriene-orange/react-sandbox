const initialState = () => ({
    scans: [],
    successScans: [],
    pendingScans: [],
});

export default (state=initialState(), action) => {
    switch(action.type) {
        case 'SCAN_SUCCESS':
            return {
                ...state,
                successScans: [...state.successScans, action.data],
            };
        case 'SCAN_REQUEST':
            return {
                ...state,
                scans: [...state.scans, action.data],
            };
        // case 'PENDING': 
        //     return {
        //         ...state,
        //         pendingScans: [...state.pendingScans, action.data],
        //     };
        default:
            return state;
    }
};