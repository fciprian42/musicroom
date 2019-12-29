const intialStateUser = {
    first_name: '',
    last_name: '',
    email: '',
    is_premium: false,
    is_verified: false,
    picture: null,
    is_oauth: null,
    music_tags: [],
    isAuthenticated: false,
    id: ''
}
  
const intialStatePlaylist = {
    playlists: [],
    nbr: 0,
}
  
const intialStateRoom = {
    rooms: [],
    nbr: 0,
}
  
const intialStateNotife = {
    message: '',
}
  
const initialClassement = {
    songs: [],
}

export default class reducer {
    static user (state = intialStateUser, action) {
        switch (action.type) {
            case 'login':
                return {
                    first_name: action.data.first_name || null,
                    last_name: action.data.last_name || null,
                    email: action.data.email,
                    is_premium: action.data.is_premium,
                    is_verified: action.data.is_verified,
                    picture: action.data.picture || null,
                    is_oauth: action.data.is_oauth || undefined,
                    music_tags: action.data.music_tags,
                    isAuthenticated: true,
                    id: action.data.id,
                }
            case 'logout':
                return intialStateUser
            default:
                return state
        }
    }
}