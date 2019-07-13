import jsonwebtoken from 'jsonwebtoken'

import { User } from '../../models'

async function isLoggedIn(token) {
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trimLeft()
    }

	const user = await jsonwebtoken.verify(token, 'ilovescotchyscotch', async (err, verifiedToken) => {
		if (verifiedToken && verifiedToken.id) {
            const user = await User.findByPk(verifiedToken.id)
            
            if (user) return user.dataValues

            return null
        }

        return null
    })
    
    return user
}

export default isLoggedIn