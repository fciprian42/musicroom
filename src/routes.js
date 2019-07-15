import knex from './graphql/knex'

const routes = (app) => {
    app.get('/activate', async (req, res) => {
        const { token } = req.query

        if (token && token.length > 0) {
            const user = await knex('users').where('token', token)

            if (user && !user.is_verified) {
                knex('users')
                    .where('id', user.id)
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

    app.get('/', (req, res) => {
        res.render('')
    })
}

export default routes