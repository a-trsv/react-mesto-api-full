import React from 'react'
import PopupWithForm from './PopupWithForm'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function EditProfilePopup({onUpdateUser, isOpen, onClose}) {

    const [name, setName] = React.useState('')
    const [description, setDescription] = React.useState('')
    // Подписка на контекст
    const currentUser = React.useContext(CurrentUserContext)

    // После загрузки текущего пользователя из API
    // его данные будут использованы в управляемых компонентах.
    React.useEffect(() => {
        setName(currentUser.name)
        setDescription(currentUser.about)
    }, [currentUser, isOpen])

    function handleSubmit(evt) {
        // Запрещаем браузеру переходить по адресу формы
        evt.preventDefault()

        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({
            name,
            about: description
        })
    }

    function handleChangeName(evt) {
        setName(evt.target.value)
    }

    function handleChangeJob(evt) {
        setDescription(evt.target.value)
    }

    return (
        <PopupWithForm
            name="edit"
            title="Редактировать профиль"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            saveButton="Сохранить"
        >
            <input
                type="text" id="inputName" name="inputName"
                placeholder="Введите Ваше имя"
                className="form__input form__input_type_name"
                minLength={2} maxLength={40} required
                onChange={handleChangeName}
                value={name || ''} 
            />
            <span className="form__error" id="inputName-error" />
            <input type="text" id="inputJob" name="inputJob"
                placeholder="Чем занимаетесь?"
                className="form__input form__input_type_job"
                minLength={2} maxLength={200} required
                onChange={handleChangeJob}
                value={description || ''} />
            <span className="form__error" id="inputJob-error" />
        </PopupWithForm>
    )
}

export default EditProfilePopup
