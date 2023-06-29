const { selectAllUsers } = require("../models/users.model")

exports.getAllUsers = (request, response) => {
    
    selectAllUsers().then((users) => {
        response.status(200).send({users})
    })
}
