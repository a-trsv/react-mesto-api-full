import api from './api'

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

    register(email, password) {
        // console.log({email, password})
        return fetch(`${this._address}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    email, password
                }
            )
        })
            .then(res => this._checkServerResponse(res))
    }

    authorization({ email, password }) {
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
                    api.updateToken()
                    return data.token
                }
            })
    }

    checkToken(token) {
        // console.log(token)
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
    address: 'https://api.a-trsv.nomoredomains.club',
})

export default auth