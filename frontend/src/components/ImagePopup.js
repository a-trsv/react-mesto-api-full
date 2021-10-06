import React from 'react'

function ImagePopup({card, isOpen, onClose}) {
    return (
        <div className={`popup ${card && isOpen ? 'popup_active' : ''}`}>
            <div className="popup__container popup__container_type_photo">
                <img className="popup__image" src={`${card.link}`} alt={`Крупным планом ${card.name}`} />
                <h2 className="popup__title popup__title_type_photo">{card.name}</h2>
                <button onClick={onClose}
                    aria-label="Закрыть окно просмотра" type="button"
                    className="popup__close-button popup__close-button_type_photo" />
            </div>
        </div>
    )
}

export default ImagePopup