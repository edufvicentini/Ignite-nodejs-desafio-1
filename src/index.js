const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username)

  if (!user)
    return response.status(404).json({error: 'User do not Exists!'}) 

  request.user = user;

  return next();
}

function checkIfExistsTodoByID(request, response, next) {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id)

  if (!todo)
    return response.status(404).json({error: 'Todo do not Exists!'})   

  request.todo = todo;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const checkIfUsernameAlreadyExists = users.some((user) => user.username === username)
  
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

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  
  const newTodo = { 
	    id: uuidv4(), // precisa ser um uuid
	    title,
	    done: false, 
	    deadline: new Date(deadline), 
	    created_at: new Date()
  }

  user.todos.push(newTodo);

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, checkIfExistsTodoByID, (request, response) => {
  const { title, deadline } = request.body;
  const { todo } = request;

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, checkIfExistsTodoByID, (request, response) => {
  const { todo } = request;

  todo.done = true;

  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, checkIfExistsTodoByID, (request, response) => {
  const { user, todo } = request;

  user.todos.splice(user.todos.indexOf(todo), 1);

  return response.status(204).send();
  
});

module.exports = app;