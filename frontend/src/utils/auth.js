class Auth {
    constructor(options) {
        this._address = options.address
    }

    _checkServerResponse(res) {
        if (res.ok) {
            return res.json()
        }
        // Если происходит ошибка, отклоняем промис
        return Promise.reject(`${res.status}`)
    }

    register(password, email) {
        return fetch(`${this._address}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    password: password,
                    email: email
                }
            )
        })
        .then(res => this._checkServerResponse(res))
    }

    authorization(password, email) {
        return fetch(`${this._address}/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => this._checkServerResponse(res))
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('jwt', data.token)
                    return data.token
                }
            })
    }

    checkToken(token) {
        return fetch(`${this._address}/users/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => this._checkServerResponse(res))
            .then((data) => data)
    }
}
const auth = new Auth({
    address: 'https://auth.nomoreparties.co',
})

export default auth