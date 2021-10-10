import React from 'react'

function Login({ onLogin }) {

    const [valueEmail, setValueEmail] = React.useState('')
    const [valuePassword, setValuePassword] = React.useState('')

    function handleChangeEmail(evt) {
        setValueEmail(evt.target.value)
    }

    function handleChangePassword(evt) {
        setValuePassword(evt.target.value)
    }

    function handleSubmit(evt) {
        evt.preventDefault()
        // Передаём значения управляемых компонентов во внешний обработчик
        const email = valueEmail
        const password = valuePassword
        onLogin({email, password})

    }
    return (
        <section className="sign-section">
            <h1 className="popup__title sign-form__title">Вход</h1>
            <form className="form sign-form" onSubmit={handleSubmit}>
                <input type="email" required className="form__input sign-form__input" placeholder="Email" onChange={handleChangeEmail}
                    value={valueEmail} />
                <input type="password" required className="form__input sign-form__input" placeholder="Пароль" onChange={handleChangePassword}
                    value={valuePassword} />
                <button className="form__save-button sign-form__submit">Войти</button>
            </form>
        </section>
    )
}
export default Login