module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const send = async (req, res) => {
        let enviados = await app.db('enviados').select('email')
            .where({formId:req.params.formId})
            .then((result) => result)
            .catch(err =>{console.log("Email não presente nos enviados")})
        enviados.forEach(element => {
            var templateParams = {
                name: 'James',
                notes: 'Check this out!'
            };
        });
        console.log(enviados[0].email)
    }

    return { send }
}