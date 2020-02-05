const express = require("express");

const server = express();

/* Para o express ler json do body da requisição*/
server.use(express.json());

const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project Not Found" });
  }

  return next();
}

function contRequests(req, res, next) {
  console.count("Quantidade de Requisições");

  return next();
}

server.use(contRequests);

/*Lista Todos os Projetos*/
server.get("/projects", (req, res) => {
  res.json(projects);
});

/*Cria Novo Projeto*/
server.post("/projects/", (req, res) => {
  const { id, title } = req.body;

  //projects.push({ id: id, title: title, tasks: [] });
  const project = {
    id: id,
    title: title,
    tasks: []
  };
  projects.push(project);

  return res.json(projects);
});

/*Cria Nova Tarefa*/
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(p => p.id == id).tasks.push(title);

  return res.json(projects);
});

/*Edita um projeto*/
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(p => p.id == id).title = title;

  return res.json(projects);
});

/*Deleta um projeto*/
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);
  projects.splice(index, 1);

  return res.json(projects);
});

server.listen(3000);
