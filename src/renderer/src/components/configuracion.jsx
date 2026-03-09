
import { useEffect, useState } from 'react'

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

    // notifications
    const [notif, setNotif] = useState({ msg: '', type: '' })   // type: 'ok' | 'err'

    const notify = (msg, type = 'ok') => {
        setNotif({ msg, type })
        setTimeout(() => setNotif({ msg: '', type: '' }), 3000)
    }

    const loadUsers = async () => {
        const res = await window.api.getUsers()
        if (res.result === true) setUsers(res.object)
    }

    useEffect(() => { loadUsers() }, [])

    const handleCreate = async () => {
        if (!newUsername.trim()) return notify('El nombre de usuario no puede estar vacío.', 'err')
        if (newPassword.length < 4) return notify('La contraseña debe tener al menos 4 caracteres.', 'err')
        if (newPassword !== newPassword2) return notify('Las contraseñas no coinciden.', 'err')
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
        if (chgPassword.length < 4) return notify('La nueva contraseña debe tener al menos 4 caracteres.', 'err')
        if (chgPassword !== chgPassword2) return notify('Las contraseñas no coinciden.', 'err')
        const res = await window.api.updateUserPassword(selectedID, chgPassword)
        if (res === true) {
            setChgPassword(''); setChgPassword2('')
            notify('Contraseña actualizada.')
        } else {
            notify('No se pudo actualizar la contraseña.', 'err')
        }
    }

    return (
        <div className="principalCol colAdapt">
            <h1 className="tituloContainer">Configuración</h1>

            {/* ── Notificación global ── */}
            {notif.msg && (
                <div className="cfg-notif" style={{ borderColor: notif.type === 'err' ? '#eb5757' : '#6fcf97', color: notif.type === 'err' ? '#eb5757' : '#6fcf97' }}>
                    {notif.msg}
                </div>
            )}

            <div className="containerCover">

                {/* ── Lista de usuarios ── */}
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

                    {/* Acciones sobre usuario seleccionado */}
                    {selectedID >= 0 && (
                        <div className="cfg-section">
                            <h3>Usuario seleccionado — ID {selectedID}</h3>
                            <div className="cfg-row">
                                <input
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    value={chgPassword}
                                    onChange={e => setChgPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirmar contraseña"
                                    value={chgPassword2}
                                    onChange={e => setChgPassword2(e.target.value)}
                                />
                                <div className="buttonContainer" style={{ margin: 0 }}>
                                    <input type="button" value="Cambiar contraseña" onClick={handleChangePassword} />
                                    <input type="button" value="Eliminar usuario" onClick={handleDelete}
                                        style={{ background: '#eb5757', color: '#fff', border: 'none' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Crear usuario ── */}
                <div className="apartContainer" style={{ flex: 1, minWidth: 280 }}>
                    <h2>Nuevo usuario</h2>
                    <div className="cfg-section">
                        <div className="cfg-col">
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                value={newUsername}
                                onChange={e => setNewUsername(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                value={newPassword2}
                                onChange={e => setNewPassword2(e.target.value)}
                            />
                            <div className="buttonContainer" style={{ margin: 0 }}>
                                <input type="button" value="Crear usuario" onClick={handleCreate} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}