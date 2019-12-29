import knex from './graphql/knex'

const routes = (app) => {
    app.get('/', (req, res) => {
        res.render('')
    })

    app.get('/activate', async (req, res) => {
        const { token } = req.query

        if (token && token.length > 0) {
            const user = await knex('users').where('token', token)

            if (user[0] && !user[0].is_verified) {

                await knex('users')
                    .where('id', user[0].id)
                    .update({
                        token: null,
                        is_verified: true
                    })

                return res.render('views/activate.template.html')
            }

            return res.render('views/activate-error.template.html')
        }

        return res.render('views/activate-error.template.html')
    })
}

export default routes