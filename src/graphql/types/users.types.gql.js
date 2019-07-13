import { 
    GraphQLString as String, 
    GraphQLInt as Number,
    GraphQLObjectType as Object,
    GraphQLNonNull as NonNull
} from 'graphql'

const UsersType = new Object({
    name: 'UsersType',
    fields: {
        id: { type: new NonNull(Number) },
        email: { type: new NonNull(String) },
        password: { type: new NonNull(String) },
        username: { type: new NonNull(String) }
    }
})

export default UsersType