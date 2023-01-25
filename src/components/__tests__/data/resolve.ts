export const removeFilm = {
    data: {
        "title": "Wonderland Christmas"
    }
};

export const notErrors = {
    data: {
        errors: [] 
    }
};

export const wrongPasswordError = {
    data: {
        errors: ['Попробуйте ввести пароль ещё раз'] 
    }
};

export const removeAccount = {
    data: {
        errors: [],
        app: {
            token: 'LogoutToken',
            isGuest: true
        },
        user: {
            login: ''
        }
    }
};
