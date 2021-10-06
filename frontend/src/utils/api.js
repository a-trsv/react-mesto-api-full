class Api {
    constructor(options) {
        this._address = options.address
        this._groupId = options.groupId
        this._token = options.token
    }
    getUserInfo() {
        return fetch(`${this._address}/${this._groupId}/users/me`, {
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => this._checkServerResponse(res))
    }

    patchUserInfo({ name: inputName, about: inputJob }) {
        return fetch(`${this._address}/${this._groupId}/users/me`, {
            method: 'PATCH',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: inputName,
                about: inputJob,
            })
        })
            .then(res => this._checkServerResponse(res))
    }

    getCards() {
        return fetch(`${this._address}/${this._groupId}/cards`, {
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => this._checkServerResponse(res))
    }

    postCard(apiData) {
        return fetch(`${this._address}/${this._groupId}/cards`, {
            method: 'POST',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: apiData.name,
                link: apiData.link
            })
        })
            .then(res => this._checkServerResponse(res))
    }

    deleteCard(cardId) {
        return fetch(`${this._address}/${this._groupId}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                authorization: this._token,
            }
        })
            .then(res => this._checkServerResponse(res))
    }

    changeLikeCardStatus(cardId, isLiked) {
        if (!isLiked) {
            return this.deleteLike(cardId);
        } else {
            return this.setLike(cardId);
        }
    }

    setLike(cardId) {
        return fetch(`${this._address}/${this._groupId}/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: {
                authorization: this._token,
            }
        })
            .then(res => this._checkServerResponse(res))
    }

    deleteLike(cardId) {
        return fetch(`${this._address}/${this._groupId}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: {
                authorization: this._token,
            }
        })
            .then(res => this._checkServerResponse(res))
    }
    patchUserAvatar(userData) {
        return fetch(`${this._address}/${this._groupId}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            },
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
}

const api = new Api({
    address: 'https://mesto.nomoreparties.co/v1',
    groupId: 'cohort-24',
    token: '4d34d552-bc81-44cb-b18a-2296a1ced45f'
})

export default api