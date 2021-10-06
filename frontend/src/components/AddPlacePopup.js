import React from 'react'
import PopupWithForm from './PopupWithForm'

function AddPlacePopup({onAddPlace, isOpen, onClose}) {

    const [name, setName] = React.useState('')
    const [link, setLink] = React.useState('')


    function handleSubmit(evt) {
        // Запрещаем браузеру переходить по адресу формы
        evt.preventDefault()

        // Передаём значения управляемых компонентов во внешний обработчик
        onAddPlace({
            name,
            link
        })
    }

    function handlChangePlace(evt) {
        setName(evt.target.value)
    }

    function handleChangeLink(evt) {
        setLink(evt.target.value)
    }

    return (
        <PopupWithForm
            name="add"
            title="Новое место"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            saveButton="Сохранить"
        >
            <input type="text" id="inputAddTitle" name="inputAddTitle"
                placeholder="Название" className="form__input form__input_type_addTitle"
                minLength={2} maxLength={30} required
                onChange={handlChangePlace} value={name} />
            <span className="form__error" id="inputAddTitle-error" />
            <input type="url" id="inputURL" name="inputURL"
                placeholder="Ссылка на картинку" className="form__input form__input_type_addURL" required
                onChange={handleChangeLink} value={link} />
            <span className="form__error" id="inputURL-error" />

        </PopupWithForm>
    )
}

export default AddPlacePopup