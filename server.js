const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { sigla } = require("./util");
const server = express();
require("dotenv/config");

// configurar o servidor para apresentar arquivos como JS, CSS
server.use(express.json());
server.use(cors());
server.use(express.static("public"));
// Habilitar Body do formulario
server.use(express.urlencoded({ extended: true }));

const nunjucks = require("nunjucks");
nunjucks.configure("./", {
  express: server,
  noCache: true
});

server.get("/", async (req, res) => {
  const api = await axios.get(
    "https://thevirustracker.com/free-api?global=stats"
  );

  // if (!api.data.results[0].total_cases == null) {
  const res_api = api.data.results[0]; // não esquecer ... ele retorna um vetor ... os dados estão no indice 0
  const dados = Object.assign({ title: "Dados mundiais do " }, res_api);
  // console.log(dados);
  return res.render("index.html", { dados }); // passando dados api para o index via nunjunks
  // } else {
  //   const dados = new Object();
  //   dados.title = "";
  //   dados.total_cases = "--";
  //   dados.total_recovered = "--";
  //   dados.total_unresolved = "--";
  //   dados.total_deaths = "--";
  //   dados.total_new_cases_today = "--";
  //   dados.total_new_deaths_today = "--";
  //   dados.total_active_cases = "--";
  //   dados.total_serious_cases = "--";
  //   return res.render("index.html", { dados });
  // }
});

server.post("/", async (req, res) => {
  const { paises } = req.body;
  const api = await axios.get(
    `https://thevirustracker.com/free-api?countryTotal=${paises}`
  );

  // if (!api.data.countrydata == null) {
  const pais = sigla(paises);
  // console.log(api.data.countrydata[0]);
  const res_api = api.data.countrydata[0];
  const dados = Object.assign({ title: `${pais} (${paises}) ` }, res_api);
  return res.render("index.html", { dados });
  // } else {
  //   return res.status(404).render("notfound.html");
  // }
});

server.listen(process.env.PORT || 3000);
