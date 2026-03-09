
import { useEffect, useState } from 'react'

const DEFAULT_SUBJECT = 'Aviso de cobro ” {apartamento}'
const DEFAULT_BODY = `Estimado/a {nombre},

Se ha generado su factura de renta del apartamento "{apartamento}" por un monto de {monto} con fecha de vencimiento {fecha}.

Por favor realice su pago a tiempo.

Saludos cordiales.`

export const Configuracion = () => {
    const [users, setUsers] = useState([])
    const [selectedID, setSelectedID] = useState(-1)

    // new user form
    const [newUsername, setNewUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPassword2, setNewPassword2] = useState('')

    // change password form
    const [chgPassword, setChgPassword] = useState('')
    const [chgPassword2, setChgPassword2] = useState('')

    // email config
    const [smtpHost, setSmtpHost] = useState('')
    const [smtpPort, setSmtpPort] = useState('587')
    const [smtpUser, setSmtpUser] = useState('')
    const [smtpPass, setSmtpPass] = useState('')
    const [smtpFrom, setSmtpFrom] = useState('')
    const [emailSubject, setEmailSubject] = useState(DEFAULT_SUBJECT)
    const [emailBody, setEmailBody] = useState(DEFAULT_BODY)
    const [testing, setTesting] = useState(false)

    // notifications
    const [notif, setNotif] = useState({ msg: '', type: '' })

    const notify = (msg, type = 'ok') => {
        setNotif({ msg, type })
        setTimeout(() => setNotif({ msg: '', type: '' }), 4000)
    }

    const loadUsers = async () => {
        const res = await window.api.getUsers()
        if (res.result === true) setUsers(res.object)
    }

    const loadSettings = async () => {
        const res = await window.api.getSettings()
        if (res.result === true) {
            const c = res.object
            if (c.smtp_host) setSmtpHost(c.smtp_host)
            if (c.smtp_port) setSmtpPort(c.smtp_port)
            if (c.smtp_user) setSmtpUser(c.smtp_user)
            if (c.smtp_pass) setSmtpPass(c.smtp_pass)
            if (c.smtp_from) setSmtpFrom(c.smtp_from)
            if (c.email_subject) setEmailSubject(c.email_subject)
            if (c.email_body) setEmailBody(c.email_body)
        }
    }

    useEffect(() => { loadUsers(); loadSettings() }, [])

    const handleCreate = async () => {
        if (!newUsername.trim()) return notify('El nombre de usuario no puede estar vacÃ­o.', 'err')
        if (newPassword.length < 4) return notify('La contraseÃ±a debe tener al menos 4 caracteres.', 'err')
        if (newPassword !== newPassword2) return notify('Las contraseÃ±as no coinciden.', 'err')
        const res = await window.api.createUser({ username: newUsername.trim(), password: newPassword })
        if (res.result === true) {
            setNewUsername(''); setNewPassword(''); setNewPassword2('')
            notify('Usuario creado exitosamente.')
            loadUsers()
        } else {
            notify(res.message || 'No se pudo crear el usuario.', 'err')
        }
    }

    const handleDelete = async () => {
        if (selectedID < 0) return notify('Selecciona un usuario primero.', 'err')
        const res = await window.api.deleteUser(selectedID)
        if (res === true) {
            setSelectedID(-1)
            notify('Usuario eliminado.')
            loadUsers()
        } else {
            notify('No se pudo eliminar el usuario.', 'err')
        }
    }

    const handleChangePassword = async () => {
        if (selectedID < 0) return notify('Selecciona un usuario primero.', 'err')
        if (chgPassword.length < 4) return notify('La nueva contraseÃ±a debe tener al menos 4 caracteres.', 'err')
        if (chgPassword !== chgPassword2) return notify('Las contraseÃ±as no coinciden.', 'err')
        const res = await window.api.updateUserPassword(selectedID, chgPassword)
        if (res === true) {
            setChgPassword(''); setChgPassword2('')
            notify('ContraseÃ±a actualizada.')
        } else {
            notify('No se pudo actualizar la contraseÃ±a.', 'err')
        }
    }

    const handleSaveEmail = async () => {
        const res = await window.api.saveSettings({
            smtp_host: smtpHost.trim(),
            smtp_port: smtpPort.trim(),
            smtp_user: smtpUser.trim(),
            smtp_pass: smtpPass,
            smtp_from: smtpFrom.trim(),
            email_subject: emailSubject,
            email_body: emailBody,
        })
        if (res.result === true) notify('ConfiguraciÃ³n de correo guardada.')
        else notify('Error al guardar.', 'err')
    }

    const handleTestEmail = async () => {
        setTesting(true)
        const res = await window.api.testEmail()
        setTesting(false)
        if (res.result === true) notify('ConexiÃ³n SMTP verificada correctamente.')
        else notify(res.message || 'No se pudo conectar al servidor SMTP.', 'err')
    }

    return (
        <div className="principalCol colAdapt">
            <h1 className="tituloContainer">ConfiguraciÃ³n</h1>

            {/* â”€â”€ NotificaciÃ³n global â”€â”€ */}
            {notif.msg && (
                <div className="cfg-notif" style={{ borderColor: notif.type === 'err' ? '#eb5757' : '#6fcf97', color: notif.type === 'err' ? '#eb5757' : '#6fcf97' }}>
                    {notif.msg}
                </div>
            )}

            {/* â”€â”€ Usuarios â”€â”€ */}
            <div className="containerCover">
                <div className="apartContainer" style={{ flex: 2 }}>
                    <h2>Usuarios del sistema</h2>
                    <div className="searchContainer" style={{ marginTop: 12 }}>
                        <table className="tableInfo">
                            <thead>
                                <tr className="mainRow">
                                    <td>ID</td>
                                    <td>Usuario</td>
                                    <td>Creado</td>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map((u, i) => (
                                    <tr key={i}
                                        className={selectedID === u.IDUser ? 'rowSelected' : ''}
                                        onClick={() => { setSelectedID(u.IDUser); setChgPassword(''); setChgPassword2('') }}
                                    >
                                        <td>{u.IDUser}</td>
                                        <td>{u.username}</td>
                                        <td>{new Date(u.createdAt).toLocaleDateString('es-MX')}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3}>Sin usuarios registrados</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {selectedID >= 0 && (
                        <div className="cfg-section">
                            <h3>Usuario seleccionado â€” ID {selectedID}</h3>
                            <div className="cfg-row">
                                <input type="password" placeholder="Nueva contraseÃ±a" value={chgPassword} onChange={e => setChgPassword(e.target.value)} />
                                <input type="password" placeholder="Confirmar contraseÃ±a" value={chgPassword2} onChange={e => setChgPassword2(e.target.value)} />
                                <div className="buttonContainer" style={{ margin: 0 }}>
                                    <input type="button" value="Cambiar contraseÃ±a" onClick={handleChangePassword} />
                                    <input type="button" value="Eliminar usuario" onClick={handleDelete} style={{ background: '#eb5757', color: '#fff', border: 'none' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="apartContainer" style={{ flex: 1, minWidth: 280 }}>
                    <h2>Nuevo usuario</h2>
                    <div className="cfg-section">
                        <div className="cfg-col">
                            <input type="text" placeholder="Nombre de usuario" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                            <input type="password" placeholder="ContraseÃ±a" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            <input type="password" placeholder="Confirmar contraseÃ±a" value={newPassword2} onChange={e => setNewPassword2(e.target.value)} />
                            <div className="buttonContainer" style={{ margin: 0 }}>
                                <input type="button" value="Crear usuario" onClick={handleCreate} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* â”€â”€ ConfiguraciÃ³n de correo â”€â”€ */}
            <div className="containerCover" style={{ marginTop: 0 }}>
                <div className="apartContainer" style={{ flex: 1 }}>
                    <h2>Servidor de correo (SMTP)</h2>
                    <div className="cfg-section">
                        <div className="cfg-col">
                            <div className="cfg-row">
                                <div className="cfg-col" style={{ flex: 2 }}>
                                    <label className="cfg-label">Servidor SMTP</label>
                                    <input type="text" placeholder="smtp.gmail.com" value={smtpHost} onChange={e => setSmtpHost(e.target.value)} />
                                </div>
                                <div className="cfg-col" style={{ flex: 1 }}>
                                    <label className="cfg-label">Puerto</label>
                                    <input type="number" placeholder="587" value={smtpPort} onChange={e => setSmtpPort(e.target.value)} />
                                </div>
                            </div>
                            <label className="cfg-label">Usuario (correo remitente)</label>
                            <input type="email" placeholder="tucorreo@gmail.com" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} />
                            <label className="cfg-label">ContraseÃ±a / App password</label>
                            <input type="password" placeholder="password" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} />
                            <label className="cfg-label">Nombre del remitente</label>
                            <input type="text" placeholder="Mi CRM" value={smtpFrom} onChange={e => setSmtpFrom(e.target.value)} />
                            <div className="buttonContainer" style={{ margin: 0 }}>
                                <input type="button" value="Guardar configuracion" onClick={handleSaveEmail} />
                                <input type="button" value={testing ? 'Probando' : 'Probar conexion'} onClick={handleTestEmail} disabled={testing} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="apartContainer" style={{ flex: 1 }}>
                    <h2>Mensaje de cobro</h2>
                    <p className="cfg-hint">
                        Variables: <code>{'{nombre}'}</code> <code>{'{apartamento}'}</code> <code>{'{monto}'}</code> <code>{'{fecha}'}</code>
                    </p>
                    <div className="cfg-section">
                        <div className="cfg-col">
                            <label className="cfg-label">Asunto</label>
                            <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
                            <label className="cfg-label">Cuerpo del mensaje</label>
                            <textarea
                                rows={10}
                                value={emailBody}
                                onChange={e => setEmailBody(e.target.value)}
                                style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: 13 }}
                            />
                            <div className="buttonContainer" style={{ margin: 0 }}>
                                <input type="button" value="Guardar mensaje" onClick={handleSaveEmail} />
                                <input type="button" value="Restablecer por defecto" onClick={() => { setEmailSubject(DEFAULT_SUBJECT); setEmailBody(DEFAULT_BODY) }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
