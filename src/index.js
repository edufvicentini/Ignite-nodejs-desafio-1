const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.filter((user) => user.username === username)

  if (!user)
    return response.status(400).json({error: 'Username already exists!'}) 

  request.

  console.log(user);

  return next();

  /*
  
  confere se tem username

  {
	  error: 'Mensagem do erro'
  }
  or

  request.user = user;
  
  return user
  */
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const checkIfUsernameAlreadyExists = users.find((user) => user.username === username)
  
  if (checkIfUsernameAlreadyExists)
    return response.status(400).json({error: 'Username already exists!'})

  const newUser = {
    id: uuidv4(),
	  name, 
	  username, 
	  todos: []  
  }

  users.push(newUser);
  return response.status(200).send();

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  console.log( user );
  return response.send('teste')
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  /*
    { 
	    id: 'uuid', // precisa ser um uuid
	    title: 'Nome da tarefa',
	    done: false, 
	    deadline: '2021-02-27T00:00:00.000Z', 
	    created_at: '2021-02-22T00:00:00.000Z'
    } 
    { 
	    id: 'uuid', // precisa ser um uuid
	    title: 'Nome da tarefa',
	    done: false, 
	    deadline: new Date(deadline), 
	    created_at: new Date()
    }
  */

  
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;