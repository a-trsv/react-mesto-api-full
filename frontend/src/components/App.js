import React from 'react'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import ImagePopup from './ImagePopup'
import ConfirmCardDelete from './ConfirmCardDelete'
import api from '../utils/api'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import ProtectedRoute from './ProtectedRoute'
import { Route, Switch, useHistory } from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import InfoToolTip from './InfoTooltip'
//Иконки для попапа
import successImg from '../images/success.jpeg'
import notSuccessImg from '../images/not-success.jpeg'
import auth from '../utils/auth'

function App() {

    const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false)
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false)
    const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false)
    const [isImagePopupOpen, setImagePopupOpen] = React.useState(false)
    {/* Заготовка для реализации попапа с подтверждением удаления карточки */ }
    const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = React.useState(false)
    const [selectedCard, setSelectedCard] = React.useState({})
    const [currentUser, setCurrentUser] = React.useState({})
    const [cards, setCards] = React.useState([])
    {/* Устанавливаем стейты для 12 спринта */ }
    const [loggedIn, setLoggedIn] = React.useState(false)
    const [isInfoToolTipOpen, setInfoToolTipOpen] = React.useState(false)
    const [email, setEmail] = React.useState('')
    const [authMessage, setAuthMessage] = React.useState({ img: '', text: '' })
    const history = useHistory()

    React.useEffect(() => {
        Promise.all([api.getUserInfo(), api.getCards()])
            .then(([userData, apiData]) => {
                setCurrentUser(userData)
                setCards(apiData)
                // console.log(apiData)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id)
        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(() => {
                setCards((state) => state.filter((c) => c !== card))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleUpdateUser(userData) {
        api.patchUserInfo(userData)
            .then((userData) => {
                setCurrentUser(userData)
                closeAllPopups()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleAddPlaceSubmit(apiData) {
        api.postCard(apiData)
            .then((newCard) => {
                setCards([newCard, ...cards])
                closeAllPopups()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleUpdateAvatar(userData) {
        api.patchUserAvatar(userData)
            .then((userData) => {
                setCurrentUser(userData)
                closeAllPopups()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleEditAvatarClick() {
        setEditAvatarPopupOpen(true)
    }

    function handleEditProfileClick() {
        setEditProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setAddPlacePopupOpen(true)
    }

    function handleCardClick(card) {
        setSelectedCard(card)
        setImagePopupOpen(true)
    }

    function handleInfoToolTipOpen() {
        setInfoToolTipOpen(true)
    }

    function handleInfoToolTipAuthMessage({ img, text }) {
        setAuthMessage({ img: img, text: text })
    }

    function handleRegister(password, email) {
        auth.register(password, email)
            .then(() => {
                handleInfoToolTipAuthMessage({ img: successImg, text: 'Вы успешно зарегестрировались!' })
                handleInfoToolTipOpen()
                setTimeout(history.push, 2500, '/sign-in')
                setTimeout(closeAllPopups, 2500)
            })
            .catch((err) => {
                handleInfoToolTipAuthMessage({ img: notSuccessImg, text: 'Что-то пошло не так! Попробуйте еще раз.' })
                handleInfoToolTipOpen()
                setTimeout(closeAllPopups, 2500)
                console.log(err)
            })
    }

    function handleLogin(password, email) {
        auth.authorization(password, email)
            .then((data) => {
                auth.checkToken(data)
                    .then((data) => {
                        setEmail(data.data.email)
                    })
                    .catch(err => console.log(err))
                setLoggedIn(true)
                history.push('/')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    React.useEffect(() => {
        const token = localStorage.getItem('jwt')
        if (token) {
            auth.checkToken(token)
                .then((data) => {
                    setLoggedIn(true)
                    setEmail(data.data.email)
                    history.push('/')
                })
                .catch(err => console.log(err))
        }
    }, [history])

    function handleSignOut() {
        setLoggedIn(false)
        localStorage.removeItem('jwt')
        setEmail('')
        history.push('/sign-in')
    }

    function closeAllPopups() {
        setEditAvatarPopupOpen(false)
        setEditProfilePopupOpen(false)
        setAddPlacePopupOpen(false)
        setImagePopupOpen(false)
        setSelectedCard({})
        setInfoToolTipOpen(false)
    }

    return (
        <div className="page__content">
            <CurrentUserContext.Provider value={currentUser}>
                <Header loggedIn={loggedIn} email={email} onSignOut={handleSignOut} />
                <Switch>
                    {/* Регистрация нового пользователя */}
                    <Route path="/sign-up">
                        <Register
                            onRegister={handleRegister}
                        />
                    </Route>
                    {/* Авторизация существующего пользователя */}
                    <Route path="/sign-in">
                        <Login
                            onLogin={handleLogin}
                        />
                    </Route>
                    {/* Отрисовываем сайт для авторизованного пользователя */}
                    <ProtectedRoute
                        path="/"
                        component={Main}
                        loggedIn={loggedIn}
                        cards={cards}
                        onCardLike={handleCardLike}
                        onCardDelete={handleCardDelete}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        onCardClick={handleCardClick}
                    />
                </Switch>
                <Footer />

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onUpdateUser={handleUpdateUser}
                    onClose={closeAllPopups}
                />

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onUpdateAvatar={handleUpdateAvatar}
                    onClose={closeAllPopups}
                />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onAddPlace={handleAddPlaceSubmit}
                    onClose={closeAllPopups}
                />

                {/* Заготовка для реализации попапа с подтверждением удаления карточки */}
                <ConfirmCardDelete
                    isOpen={isDeleteCardPopupOpen}
                    onClose={closeAllPopups}
                />

                <ImagePopup
                    card={selectedCard}
                    isOpen={isImagePopupOpen}
                    onClose={closeAllPopups}
                />
                <InfoToolTip
                    isOpen={isInfoToolTipOpen}
                    authMessage={authMessage}
                    onClose={closeAllPopups}
                />
            </CurrentUserContext.Provider>
        </div>
    )
}

export default App
