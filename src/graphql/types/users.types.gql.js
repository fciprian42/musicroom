import { 
    GraphQLString as String, 
    GraphQLInt as Number,
    GraphQLBoolean as Boolean,
    GraphQLObjectType as Object,
    GraphQLNonNull as NonNull
} from 'graphql'

const UsersType = new Object({
    name: 'UsersType',
    fields: {
        id: { type: new NonNull(Number) },
        email: { type: new NonNull(String) },
        username: { type: new NonNull(String) },
        biography: { type: String },
        first_name: { type: String },
        last_name: { type: String },
        is_verified: { type: Boolean },
        is_premium: { type: Boolean }
    }
})

export default UsersType