class Api {
    constructor({address, headers}) {
        this._address = address
        // this._groupId = options.groupId
        // this._token = options.token
        this._headers = headers
    }
    getUserInfo() {
        return fetch(`${this._address}/users/me`, {
            headers: this._headers
        })
            .then(res => this._checkServerResponse(res))
    }

    patchUserInfo({ name: inputName, about: inputJob }) {
        return fetch(`${this._address}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: inputName,
                about: inputJob,
            })
        })
            .then(res => this._checkServerResponse(res))
    }

    getCards() {
        return fetch(`${this._address}/cards`, {
            headers: this._headers
        })
            .then(res => this._checkServerResponse(res))
    }

    postCard(apiData) {
        return fetch(`${this._address}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name: apiData.name,
                link: apiData.link
            })
        })
            .then(res => this._checkServerResponse(res))
    }

    deleteCard(cardId) {
        return fetch(`${this._address}/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._headers
        })
            .then(res => this._checkServerResponse(res))
    }

    changeLikeCardStatus(cardId, isLiked) {
        if (isLiked) {
            return this.deleteLike(cardId);
        } else {
            return this.setLike(cardId);
        }
    }

    setLike(cardId) {
        return fetch(`${this._address}/cards/${cardId}/likes`, {
            method: 'PUT',
            headers: this._headers
        })
            .then(res => this._checkServerResponse(res))
    }

    deleteLike(cardId) {
        return fetch(`${this._address}/cards/${cardId}/likes`, {
            method: 'DELETE',
            headers: this._headers
        })
            .then(res => this._checkServerResponse(res))
    }
    patchUserAvatar(userData) {
        return fetch(`${this._address}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: userData.avatar
            })
        })
            .then(res => this._checkServerResponse(res))
    }

    _checkServerResponse(res) {
        if (res.ok) {
            return res.json()
        }
        // Если происходит ошибка, отклоняем промис
        return Promise.reject(`${res.status}`)
    }

    updateToken() {
        this._headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    }
}

const api = new Api({
    address: 'https://api.a-trsv.nomoredomains.club',
    // groupId: 'cohort-24',
    // token: '4d34d552-bc81-44cb-b18a-2296a1ced45f'
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'

    }
})

export default api