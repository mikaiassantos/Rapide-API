const express = require("express");
const mongoose = require('mongoose');

const app = express();
app.use(express.json())
const port = 3000;


// Criando o modelo de receita
const Recipe = mongoose.model('Recipe', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    ingredients: [{
        name: String,
        icon: String
    }],
    instructions: {
        type: String,
        required: true
    },
    prepTime: String,
    category: String
}));

// Endpoint GET para obter todas as receitas
app.get("/", async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.send(recipes);
    } catch (error) {
        console.error('Erro ao obter receitas:', error);
        res.status(500).send('Erro interno do servidor');
    }
});


app.delete("/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).send("Receita não encontrada");
        }

        await recipe.deleteOne();
        res.status(200).send("Receita excluída com sucesso");
    } catch (error) {
        console.error('Erro ao excluir receita:', error);
        res.status(500).send("Erro interno do servidor");
    }
});


app.put("/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).send("Receita não encontrada");
        }

        // Atualiza os campos da receita com os dados do corpo da requisição
        recipe.title = req.body.title;
        recipe.image = req.body.image;
        recipe.ingredients = req.body.ingredients;
        recipe.instructions = req.body.instructions;

        // Salva a receita atualizada no banco de dados
        await recipe.save();

        // Retorna a receita atualizada como resposta
        res.status(200).send(recipe);
    } catch (error) {
        console.error('Erro ao atualizar receita:', error);
        res.status(500).send("Erro interno do servidor");
    }
});


app.post("/", async (req, res) => {
    try {
        console.log(req.body); // Adicione esta linha para imprimir o corpo da requisição no console
        const recipeData = req.body;
        const recipe = new Recipe(recipeData);
        await recipe.save();
        res.status(201).send(recipe);
    } catch (error) {
        res.status(400).send(error);
    }
});


app.listen(port, () => {
    console.log('App running');
    // Corrigindo a string de conexão com o MongoDB
    mongoose.connect('mongodb+srv://mikaiassantos:4OJ703OseXCQyfRb@rapidrecep-api.smpfolm.mongodb.net/?retryWrites=true&w=majority&appName=rapidrecep-api');

});
