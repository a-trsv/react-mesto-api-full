import React from 'react'
import Card from './Card'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Main(props) {

    const currentUser = React.useContext(CurrentUserContext)

    return (
        <main>
            <section className="profile">
                <div className="profile__container">
                    <div className="profile__photo-section">
                        <img className="profile__avatar" alt="Аватар" src={currentUser.avatar} onClick={props.onEditAvatar} />
                        <button
                            className="profile__icon"
                            type="button"
                            aria-label="Загрузка своего фото"
                        >
                        </button>
                    </div>
                    <div className="profile__info">
                        <div className="profile__zone">
                            <h1 className="profile__title">{currentUser.name}</h1>
                            <button
                                aria-label="Измените данные"
                                type="button"
                                className="profile__edit-button"
                                onClick={props.onEditProfile} >
                            </button>
                        </div>
                        <p className="profile__caption">{currentUser.about}</p>
                    </div>
                </div>
                <button
                    aria-label="Добавьте свою карточку!"
                    type="button"
                    className="profile__add-button"
                    onClick={props.onAddPlace} >
                </button>
            </section>
            <section className="elements">
                {props.cards.map(card =>
                    (<Card
                        key={card._id}
                        card={card}
                        onCardClick={props.onCardClick}
                        onCardLike={props.onCardLike}
                        onCardDelete={props.onCardDelete}
                    />)
                )}
            </section>
        </main>
    )
}

export default Main