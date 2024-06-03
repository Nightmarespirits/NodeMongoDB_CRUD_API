const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')

//MIDLEWARE
const getBook = async (req, res, next) => {
    let book
    const {id} = req.params

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json(
            {
                message: "El ID no es valido."
            }
        )
    }

    try {
        book = await Book.findById(id)
        if(!book){
            return res.status(404).json(
                {message: "El libro no fue encontrado"}
            )
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

    res.book = book
    next()
}

//Obtener todos los libros [GET]
router.get('/', async (req, res) =>{
    try {
        const books = await Book.find() 
        console.log('GET ALL: ' + books)
        if(books.length === 0){
            res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


//Crear un nuevo Libro [POST]
router.post('/', async (req, res) => {
    //destructuramos el contenido de la solicitud http lo que inserto el cliente
    const { title, author, genere, publication_Date } = req?.body

    if(!title || !author || !genere || !publication_Date){
        return res.status(400).json({message: 'Los campos author genero y fecha son obligatorios.'})
    }

    const book = new Book(
        {
            title: title,
            author: author, 
            genere: genere, 
            publication_Date: publication_Date
        }
    )

    try {
        const newBook = await book.save()
        console.log(newBook)

        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }

})

//Get unico
router.get('/:id', getBook, async ( req , res ) =>{
    res.json(res.book)
})

//Actualizar
router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author    
        book.genere = req.body.genere || book.genere
        book.publication_Date = req.body.publication_Date || book.publication_Date

        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.patch('/:id', getBook, async (req, res) => {
    if(!req.body.title && !req.body.author && !req.body.genere && !req.body.publication_Date){
        res.status(400).json({message:"Al menos uno de estos campos deben ser enviados titulo autor genero o fecha de publicacion"})
    }
    try {
        const book = res.book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author    
        book.genere = req.body.genere || book.genere
        book.publication_Date = req.body.publication_Date || book.publication_Date

        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Borrar
router.delete('/:id', getBook, async(req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        })
        res.json({message: `el libro ${book.title} fue eliminado`})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
module.exports = router