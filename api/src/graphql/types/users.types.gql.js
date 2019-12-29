import GraphQLJSON from 'graphql-type-json'
import { 
    GraphQLString as String, 
    GraphQLInt as Number,
    GraphQLBoolean as Boolean,
    GraphQLObjectType as Object
} from 'graphql'

const UsersType = new Object({
    name: 'UsersType',
    fields: {
        id: { type: Number },
        email: { type: String },
        first_name: { type: String, defaultValue: '' },
        last_name: { type: String, defaultValue: '' },
        is_verified: { type: Boolean, defaultValue: false },
        is_premium: { type: Boolean, defaultValue: false },
        picture: { type: String },
        is_oauth: { type: Boolean },
        music_tags: { type: GraphQLJSON }
    }
})

export default UsersType