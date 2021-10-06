import React from 'react'

function PopupWithForm(props) {
    return (
        <div className={`popup ${props.isOpen && 'popup_active'}`}>
            <div className="popup__container">
                <h2 className="popup__title">{props.title}</h2>
                <form
                    name={props.name}
                    className={`form form_type_${props.name}`}
                    onSubmit={props.onSubmit}
                >
                    {props.children}
                    <button type="submit" className="form__save-button">{props.saveButton}</button>
                </form>
                <button onClick={props.onClose} aria-label="Отменить изменения" type="button"
                    className={`popup__close-button popup__close-button_type_${props.name}`} />
            </div>
        </div>
    )
}

export default PopupWithForm
