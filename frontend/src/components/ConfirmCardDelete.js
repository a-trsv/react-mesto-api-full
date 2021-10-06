import React from 'react'
import PopupWithForm from './PopupWithForm'

function ConfirmCardDelete(props) {

    // Заготовка для реализации попапа с подтверждением удаления карточки
    return (
        <PopupWithForm
            name="delete"
            title="Вы уверены?"
            onClose={props.onClose}
            saveButton="Да"
        />
    )

}

export default ConfirmCardDelete