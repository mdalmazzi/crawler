var mongoose = require('mongoose');

const typeFonte = ["Editore", "Blog", "MOOC"];
const typeLicense = ["copyrigth", "creative commons", "pubblico dominio"];
const typeSchool = ["Primaria", "Secondaria Primo Grado", "Secondaria Secondo Grado"];
const typeContent = ["Page", "Image", "Video"];
const typeLanguage = ["Italiano", "Inglese", "Spagnolo", "Francese", "Tedesco"];
const typeMateria = ["Matematica", "Fisica"];


var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },

    tipologia: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        enum: typeFonte
    },
    licenza: {
        type: String,
        required: false,
        minlength: 1,
        trim: true,
        enum: typeLicense
    },
    scuola: {
        type: [String],
        required: false,
        minlength: 1,
        trim: true,
        enum: typeSchool

    },
    language: {
        type: [String],
        required: false,
        minlength: 1,
        trim: true,
        enum: typeLanguage

    },
    materia: {
        type: [String],
        required: false,
        minlength: 1,
        trim: true,
        enum: typeMateria
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
});

module.exports = { Todo };