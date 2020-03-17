
import request from 'superagent';


export const addToDoService = ({ todo }) => request
.post('/api/todos')
.send({ todo })
.set('Accept', 'application/json')
.then(res => {
    return res.body;
});

export const updateToDoService = ({ todo }) => request
.put(`/api/todos/${todo.id}`)
.send({ todo })
.set('Accept', 'application/json')
.then(res => { 
    return res.body;
});

export const deleteToDoService = ({ id }) => request
.del(`/api/todos/${id}`)
.set('Accept', 'application/json')
.then(res => { 
    return res.body;
});

export const fetchAllTodosService = () => request
.get('/api/todos/')
.set('Accept', 'application/json')
.then(res => { 
    return res.body;
});
