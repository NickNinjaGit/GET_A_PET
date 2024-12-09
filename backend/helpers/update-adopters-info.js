const Pet = require('../models/Pet');
const getUserByToken = require('./get-user-by-token');

// Atualizar os pets que têm este usuário como `adopter`
const updateAdoptersInfo = async (token, id) => {
    // Find user by Token
    const user = await getUserByToken(token)
    await Pet.updateMany(
        { "adopter._id": id }, // Encontrar pets onde o adopter corresponde ao usuário
        {
            $set: {
                "adopter.name": user.name,
                "adopter.email": user.email,
                "adopter.phone": user.phone,    
                "adopter.image": user.image,
            },
        }
    );
}

module.exports = updateAdoptersInfo
