import React from 'react'

function Login({ onLogin }) {

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    function handleChangeEmail(evt) {
        setEmail(evt.target.value)
    }

    function handleChangePassword(evt) {
        setPassword(evt.target.value)
    }

    function handleSubmit(evt) {
        evt.preventDefault()
        // Передаём значения управляемых компонентов во внешний обработчик
        onLogin(password, email)

    }
    return (
        <section className="sign-section">
            <h1 className="popup__title sign-form__title">Вход</h1>
            <form className="form sign-form" onSubmit={handleSubmit}>
                <input type="email" required className="form__input sign-form__input" placeholder="Email" onChange={handleChangeEmail}
                    value={email} />
                <input type="password" required className="form__input sign-form__input" placeholder="Пароль" onChange={handleChangePassword}
                    value={password} />
                <button className="form__save-button sign-form__submit">Войти</button>
            </form>
        </section>
    )
}
export default Login