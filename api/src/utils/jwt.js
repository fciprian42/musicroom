import jsonwebtoken from 'jsonwebtoken'

import knex from '../graphql/knex'

async function isLoggedIn(token) {
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trimLeft()
    }

	const user = await jsonwebtoken.verify(token, 'ilovescotchyscotch', async (err, verifiedToken) => {
		if (verifiedToken && verifiedToken.id) {
            const user = await knex('users').where('id', verifiedToken.id)
            
            if (user) return user[0]

            return null
        }

        return null
    })
    
    return user
}

export default isLoggedIn