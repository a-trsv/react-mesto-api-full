import React from 'react'
import PopupWithForm from './PopupWithForm'

function EditAvatarPopup(props) {

    const userAvatarRef = React.useRef()

    function handleSubmit(evt) {
        evt.preventDefault()
        props.onUpdateAvatar({
            avatar: userAvatarRef.current.value
        })
        // console.log(userAvatarRef.current.value)
    }

    return (
        <PopupWithForm
            name="avatar"
            title="Обновить аватар"
            isOpen={props.isOpen}
            onClose={props.onClose}
            saveButton="Сохранить"
            onSubmit={handleSubmit}
        >
            <input ref={userAvatarRef} type="url" id="inputAvatar"
                name="inputAvatar" placeholder="Ссылка на картинку"
                className="form__input form__input_type_addAvatar"
                required />
            <span className="form__error" id="inputAvatar-error" />
        </PopupWithForm>
    )
}

export default EditAvatarPopup