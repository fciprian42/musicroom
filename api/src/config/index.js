const config = {
    mail: {
        user: '',
        password: ''
    },
    oauth: {
        facebook: {
            clientID: '328004361271096',
            clientSecret: 'fb59745fa8c98ce2908cdfe4c4fd27da',
            callbackURL: `http://localhost:${process.env.PORT || 4000}/auth/facebook/callback`
        },
        google: {
            clientID: '953503554559-o0rikvmbmvn3dsqil04jh78uk3h3b8j4.apps.googleusercontent.com',
            clientSecret: '4BGGwkRIuTnHIuHF5Rxq34g-',
            callbackURL: `http://localhost:${process.env.PORT || 4000}/auth/google/callback`
        },
        deezer: {
            clientID: '361184',
            clientSecret: '2ac75dce6d22d3de25daae562bab6013',
            callbackURL: `http://localhost:${process.env.PORT || 4000}/auth/deezer/callback`
        }
    }
}

export default config