const Pet = require("../models/Pet")

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId
const updatAdoptersInfo = require('../helpers/update-adopters-info')

module.exports = class PetController {

    // POST METHOD functions
    static async create(req, res) {
        const {name, age, weight, color} = req.body

        // images upload 
        const images = req.files


        const availabe = true

        // validations
        if(!name) {
            res.status(422).json({message: "O nome é obrigatório!"})
            return
        }
        if(!age) {
            res.status(422).json({message: "A idade é obrigatória!"})
            return
        }
        if(!weight) {
            res.status(422).json({message: "O peso é obrigatório!"})
            return
        }
        if(!color) {
            res.status(422).json({message: "A cor é obrigatória!"})
            return
        }
        if(images.length === 0) {
            res.status(422).json({message: "A imagem é obrigatória!"})
            return
        }

        // get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // create a pet 
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            availabe,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            }
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
            const newPet = await pet.save() 
            res.status(201).json({message: `Pet cadastrado com sucesso!`, newPet})
        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    // GET METHOD functions
    static async getAll(req, res) {
        const pets = await Pet.find().sort({createdAt: -1})

        res.status(200).json({pets: pets})
    }

    static async getAllUserPets(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id}).sort({createdAt: -1})

        res.status(200).json({message: `Pets de ${user.name}: `, pets: pets})
    }

    static async getAllUserAdoptions(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id}).sort({createdAt: -1})

        await updatAdoptersInfo(token, user._id)

        res.status(200).json({message: `Adoções de ${user.name}: `, pets: pets})
        
    }

    static async getPetById(req, res) {
        const id = req.params.id

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido!'})
            return
        }

        const pet = await Pet.findById(id)
        if (!pet) {
            res.status(404).json({message: 'Pet não encontrado!'})
            return
        }
        res.status(200).json({pet})
    }

    // DELETE METHOD functions
    static async removePet(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)
        const id = req.params.id

        // check if id is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido!'})
            return
        }

        const pet = await Pet.findById(id)

        // check if pet exists
        if(!pet) {
            res.status(404).json({message: 'Pet nao encontrado!'})
            return
        }

        // check pet owner id matches with user token id
        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(401).json({message: 'Este pet pertence a outro usuário!'})
            return
        }

        // deleting pet
        await Pet.findByIdAndDelete(id)
        res.status(200).json({message: 'Pet removido com sucesso!'})
       
    }

    // PATCH METHOD functions
    static async editPet(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)
        const id = req.params.id

        // check if id is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido!'})
            return
        }

        // check if pet exists
        const pet = await Pet.findById(id)

        if(!pet) {
            res.status(404).json({message: 'Pet nao encontrado!'})
            return
        }

        // check pet owner id matches with user token id
        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(401).json({message: 'Este pet pertence a outro usuário!'})
            return
        }

        // edit pet
        const {name, age, weight, color, availabe} = req.body
        const images = req.files


        // validations
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório'})
            return;
        }

        if(!age) {
            res.status(422).json({message: 'A idade é obrigatória'})
            return;
        }

        if(!weight) {
            res.status(422).json({message: 'O peso é obrigatório'})
            return;
        }

        if(!color) {
            res.status(422).json({message: 'A cor é obrigatória'})
            return;
        }
        if(images.length === 0) {
            res.status(422).json({message: "A imagem é obrigatória!"})
            return
        } 

        const updatedPet = {
            name,
            age,
            weight,
            color,
            images: [],
        }

        images.map((image) => {
            updatedPet.images.push(image.filename)
        })

        await Pet.findByIdAndUpdate(id, updatedPet)

        res.status(200).json({message: 'Pet atualizado com sucesso!'})
    }

    static async scheduleAdoption(req, res) {
        const id = req.params.id
        const token = getToken(req)
        // check if pet exists
        const pet = await Pet.findById(id)

        if(!pet) {
            res.status(404).json({message: 'Pet nao encontrado!'})
            return
        }
        // check if user registered the pet
        const user = await getUserByToken(token)
        if(pet.user._id.equals(user._id)) {
            res.status(422).json({message: 'Você não pode agendar uma visita com seu próprio Pet!'})
            return
        }

        // check if user has already scheduled a visit
        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)) {
                res.status(422).json({message: ' Vocé ja agendou uma visita para esse Pet!'})
                return
            }
        }

        // add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image,
        }
        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json(
        {message: `Visita agendada com sucesso!, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`
        })
        
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id
        const token = getToken(req)
        // check if pet exists
        const pet = await Pet.findById(id)

        if(!pet) {
            res.status(404).json({message: 'Pet nao encontrado!'})
            return
        }

        // check if pets is owned by user
        const user = await getUserByToken(token)
        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(401).json({message: 'Este pet pertence a outro usuário!'})
            return
        }

        // conclude visit setting available to false
        pet.availabe = false
        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({message: 'Visita concluida com sucesso!'})
    }

}