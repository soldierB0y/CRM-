import { useEffect, useState } from "react";

export const User = () => {
    const [users, setUsers] = useState([]);
    const [selectedID, setSelectedID] = useState(-1);
    const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
    const [newPass, setNewPass] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDelModal, setShowDelModal] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' }); // type: 'ok' | 'err'

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const res = await window.api.getUsers();
        if (res.result) setUsers(res.object);
    };

    const showMessage = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleCreate = async () => {
        if (!form.username || !form.password) return showMessage('Rellene usuario y contraseña', 'err');
        if (form.password !== form.confirmPassword) return showMessage('Las contraseñas no coinciden', 'err');
        const res = await window.api.createUser({ username: form.username, password: form.password });
        if (res.result) {
            showMessage('Usuario creado exitosamente', 'ok');
            setForm({ username: '', password: '', confirmPassword: '' });
            loadUsers();
        } else {
            showMessage(typeof res.message === 'string' ? res.message : 'Error al crear usuario', 'err');
        }
    };

    const handleDelete = async () => {
        if (selectedID < 0) return;
        const res = await window.api.deleteUser(selectedID);
        setShowDelModal(false);
        if (res) {
            showMessage('Usuario eliminado exitosamente', 'ok');
            setSelectedID(-1);
            loadUsers();
        } else {
            showMessage('Error al eliminar usuario', 'err');
        }
    };

    const handleChangePass = async () => {
        if (!newPass) return showMessage('Ingrese la nueva contraseña', 'err');
        if (newPass !== confirmNewPass) return showMessage('Las contraseñas no coinciden', 'err');
        if (selectedID < 0) return showMessage('Seleccione un usuario', 'err');
        const res = await window.api.updateUserPassword(selectedID, newPass);
        setShowModal(false);
        setNewPass('');
        setConfirmNewPass('');
        if (res) showMessage('Contraseña actualizada exitosamente', 'ok');
        else showMessage('Error al actualizar contraseña', 'err');
    };

    return (
        <div className="principalCol colAdapt">
            <h1 className="tituloContainer">Usuarios</h1>
            <section className="containerCover">
                {/* Tabla de usuarios */}
                <div className="apartContainer">
                    <h2>Usuarios del Sistema</h2>
                    <div className="searchContainer">
                        <table className="tableInfo">
                            <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>Usuario</td>
                                    <td>Fecha de Creación</td>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map((u, i) => (
                                    <tr key={i}
                                        className={selectedID === u.IDUser ? 'rowSelected' : ''}
                                        onClick={() => setSelectedID(u.IDUser)}
                                    >
                                        <td>{u.IDUser}</td>
                                        <td>{u.username}</td>
                                        <td>{u.createdAt?.toString()}</td>
                                    </tr>
                                )) : <tr><td>No hay usuarios</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="crud apartContainer">
                    <h2>Nuevo Usuario</h2>
                    <div className="crudForm">
                        <input type="text" placeholder="nombre de usuario"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
                        />
                        <input type="password" placeholder="contraseña"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                        <input type="password" placeholder="confirmar contraseña"
                            value={form.confirmPassword}
                            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                        />
                    </div>
                    <div className="buttonContainer">
                        <input type="button" value="Agregar" className="button"
                            onClick={handleCreate}
                        />
                        <input type="button" value="Cambiar Clave" className="button"
                            onClick={() => {
                                if (selectedID < 0) return showMessage('Seleccione un usuario', 'err');
                                setShowModal(true);
                            }}
                        />
                        <input type="button" value="Eliminar" className="button"
                            onClick={() => {
                                if (selectedID < 0) return showMessage('Seleccione un usuario', 'err');
                                setShowDelModal(true);
                            }}
                        />
                    </div>
                    {msg.text && (
                        <p style={{ color: msg.type === 'ok' ? '#6cff8e' : '#ff6c6c', textAlign: 'center' }}>
                            {msg.text}
                        </p>
                    )}
                </div>
            </section>

            {/* Modal cambiar contraseña */}
            <div className="modal" style={showModal ? { display: 'flex' } : { display: 'none' }}>
                <div className="modalPrincipalContainer">
                    <h2>Cambiar Contraseña</h2>
                    <div style={{ flexDirection: 'column' }}>
                        <input type="password" placeholder="nueva contraseña"
                            value={newPass}
                            onChange={e => setNewPass(e.target.value)}
                            style={{ width: '80%', height: '30px', borderRadius: '5px', border: 'none', paddingLeft: '10px', margin: '5px 0' }}
                        />
                        <input type="password" placeholder="confirmar contraseña"
                            value={confirmNewPass}
                            onChange={e => setConfirmNewPass(e.target.value)}
                            style={{ width: '80%', height: '30px', borderRadius: '5px', border: 'none', paddingLeft: '10px', margin: '5px 0' }}
                        />
                    </div>
                </div>
                <div className="modalButtonContainer">
                    <button onClick={() => { setShowModal(false); setNewPass(''); setConfirmNewPass(''); }}>Cancelar</button>
                    <button onClick={handleChangePass}>Guardar</button>
                </div>
            </div>

            {/* Modal eliminar */}
            <div className="modal" style={showDelModal ? { display: 'flex' } : { display: 'none' }}>
                <div className="modalPrincipalContainer">
                    <h2>Eliminar Usuario</h2>
                    <div style={{ flexDirection: 'column' }}>
                        <h3>¿Estás seguro que deseas eliminar este usuario?</h3>
                    </div>
                </div>
                <div className="modalButtonContainer">
                    <button onClick={() => setShowDelModal(false)}>Cancelar</button>
                    <button onClick={handleDelete}>Sí, eliminar</button>
                </div>
            </div>
        </div>
    );
};