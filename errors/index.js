
exports.handleCustomerErrors = ((err, request, response, next) => {
    if(err.msg) {
        response.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

exports.handlePsqlErrors = ((err, request, response, next) => {
    console.log(err.code)
    if(err.code === "22P02"){
        response.status(400).send({msg: "Bad request"})
    }else if(err.code === "23503"){
        response.status(404).send({msg: "Not Found"})
    } else if(err.code === "23502") {
        response.status(404).send({msg: "Missing required fields"})
    }
})

