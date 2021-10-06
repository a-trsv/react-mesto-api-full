import React from 'react'

function InfoToolTip({ isOpen, onClose, authMessage }) {
    return (
        <div className={`popup popup_type_infoTooltip ${isOpen ? 'popup_active' : ''}`}>
            <div className="popup__container">
                <img
                    className="popup__image_type_info"
                    src={authMessage.img}
                    alt={authMessage.text}
                />
                <h2 className="popup__title popup__title_type_info">
                    {authMessage.text}
                </h2>

                <button onClick={onClose}
                    aria-label="Закрыть окно просмотра" type="button"
                    className="popup__close-button" />
            </div>
        </div>
    )
}

export default InfoToolTip