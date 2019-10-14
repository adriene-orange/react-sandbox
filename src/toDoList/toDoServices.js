
export const addToDoService = (delay=3000, value=true) =>
    new Promise(resolve => setTimeout(resolve, delay, value));