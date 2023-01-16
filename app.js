/*o objetivo do código é ensinar a fazer uma API rest que vai lidar com um banco
de dados criado em mongodb através do mongoose e administrado no Studio3d for Mongo
e usando o programa Postman para fazer os requests. Portanto, no terminal, dei
o comando para iniciar o npm e as bibliotecas necessárias, iniciei o Mongo e
o nodemon app.js, no Postman são testados os comandos de get, put, delete... e
no Studio3d visualizamos o banco de dados*/

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//a linha de código abaixo é a que posibilita o mongoose se conectar com a instância local do Mongo
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});
//a linha abaixo cria um Schema do banco de dados, ou seja, o conteúdo padrão do que se está criando
const articleSchema = {
  title: String,
  content: String
};
//aqui o padrão do mongoose, passando o nome no singular com a primeira maiúscula, que será transformado
//em minúsculo e plural e o nome do Schema
const Article = mongoose.model("Article", articleSchema);

/*o método abaixo visa substituir os métodos isoladamente e funcionar como
um tipo de função, onde, ao invés do código ser app.get, será .get, .post,
e por aí vai, tudo consolidado no mesmo código. É um chained method, como os
que tem no js, ex.: document.getElementById e por ai vai*/
app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  })
})
.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("deu bom");
    }else{
      res.send(err);
    }
  })
})
.delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("apagou geral");
    }else{
      res.send(err);
    }
  })
});
/*a rota abaixo vai procurar por um artigo especifico dentro do database,
para isso usa a sintaxe :onomedarota, e usa o nome do db.o método find one,
depois, title: req.params.onomedarota que é o método padrão
Depois, o if manda o arquivo, caso ele seja encontrado, enquanto
o else, manda a resposta, caso não. Reparar como o foundArticle foi usado
no singular.
Parar criar um chained method, ou seja, vários métodos para a mesma rota,
não colar o ; até a última função*/
app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    }else{
      res.send("No articles matching that title was found");
    }
  })
})

/*A função abaixo serve para o uptade e tem a seguinte lógica: para atualizar
o título e o conteúdo armazenado no DB primeiro tem o nome do DB.uptade
e o req.params.articleTitle vai procurar dentro da rota passada, nesse caso,
:articleTitle um título igual ao passado na requisição e se houver,
a próxima linha atualiza o título e o conteúdo. Já o overwrite serve
para passar para o mongoose a permissão para atualizar o conteúdo e evitar
que caso não haja o conteúdo determinado, ele seja apagado */
.put(function(req, res){
  Article.uptade(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      res.send("Succesfully uptated article");
    }
  );
})
/*O método patch vai substituir apenas uma parte do banco de dados, o título
ou o conteúdo, por exemplo, para isso a sintaxe $ faz com que o dentro do body
do requerimento seja encontrado o que foi pedido, o título ou conteúdo e só esse
seja atualizado */
.patch(function(req, res){
  Article.uptade(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Succesfully updated article")
      }else{
        res.send(err);
      }
    }
  );
})
/*Por última, a função para deletar, mas dessa vez somente o artigo selecionado
e não todo o DB, por isso a função deleteOne*/
.delete(function(req, res){
  Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Succesfully deleted the article")
        }else{
          res.send(err);
        }
      }
  );
});
/*abaixo, a linha para criar a rota do get que é um pedido de dados para a API
que vai buscá-lo em algum banco de dados, depois vai achar todos os arquivos
no banco de dados e retornar um erro ou os arquivos encontrados. Caso se queira
arquivos especificos, acrescentar () antes do function com os argumentos. Os
arquivos depois foram substituidos pelo route, acima*/

// app.get("/articles", function(req, res){
//   Article.find(function(err, foundArticles){
//     if(!err){
//       res.send(foundArticles);
//     }else{
//       res.send(err);
//     }
//
//   });
// });
/*o código abaixo vai lidar com os requerimento de post dos usuários que normalmente
são feitas por uma GUI, mas nesse caso, primeiro foi feito um console log,
depois o programa postman fez um post do title e do content, o site
foi atualizado e o conteúdo apareceu no console. Depois foi usada a sintaxe
padrão para criar e armanezar uma informação em um banco de dados e o método
save recebeu uma função para dar um retorno ao postman, uma mensagem
se der erro e outro se não */
// app.post("/articles", function(req, res){
//
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   });
//   newArticle.save(function(err){
//     if(!err){
//       res.send("deu bom");
//     }else{
//       res.send(err);
//     }
//   });
// });
/*abaixo o código para lidar com a função deletar, tendo que tomar cuidado
se se quer deletar uma ou várias partes do código*/
// app.delete("/articles", function(req, res){
//   Article.deleteMany(function(err){
//     if (!err){
//       res.send("apagou geral");
//     }else{
//       res.send(err);
//     }
//   });
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
