const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function isValidId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid respository ID" })
  }

  return next();
}

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = repositories

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
}); 

app.put("/repositories/:id", isValidId, (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repositoryIndex 
    = repositories.findIndex(repository => repository.id === id);

  const repoInfo 
    = repositories.find(repository => repository.id === id);  

  if (repositoryIndex < 0) {
    return response.status (400).json({ error: "Repository not found"});
  };

  const repository = {
    id, url, title, techs, likes: repoInfo.likes
  }

  repositories[repositoryIndex] = repository;

  return response.status(201).json(repository);
});

app.delete("/repositories/:id", isValidId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex 
    = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status (400).json({ error: "Repository not found"});
  };

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex 
    = repositories.findIndex(repository => repository.id === id);

  const repository 
    = repositories.find(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status (400).json({ error: "Repository not found"});
  };
  
  const repo = {
    id: repository.id, 
    url: repository.id, 
    title: repository.title,
    repository: repository.id, 
    techs: repository.techs,
    likes: repository.likes + 1 
  }

  repositories[repositoryIndex] = repo;

  return response.json(repo);
});

module.exports = app;
