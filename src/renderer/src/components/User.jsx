import { useEffect, useState } from "react";

export const User = () => {
    const [users, setUsers] = useState([]);
    const [selectedID, setSelectedID] = useState(-1);
    const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
    const [newPass, setNewPass] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPassModal, setShowPassModal] = useState(false);
    const [showDelModal, setShowDelModal] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' }); // type: 'ok' | 'err'
    const [modalMsg, setModalMsg] = useState('');

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
        if (!form.username || !form.password) return setModalMsg('Rellene usuario y contraseña');
        if (form.password !== form.confirmPassword) return setModalMsg('Las contraseñas no coinciden');
        const res = await window.api.createUser({ username: form.username, password: form.password });
        if (res.result) {
            setForm({ username: '', password: '', confirmPassword: '' });
            setModalMsg('');
            setShowCreateModal(false);
            showMessage('Usuario creado exitosamente', 'ok');
            loadUsers();
        } else {
            setModalMsg(typeof res.message === 'string' ? res.message : 'Error al crear usuario');
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
        if (!newPass) return setModalMsg('Ingrese la nueva contraseña');
        if (newPass !== confirmNewPass) return setModalMsg('Las contraseñas no coinciden');
        const res = await window.api.updateUserPassword(selectedID, newPass);
        if (res) {
            setShowPassModal(false);
            setNewPass('');
            setConfirmNewPass('');
            setModalMsg('');
            showMessage('Contraseña actualizada exitosamente', 'ok');
        } else {
            setModalMsg('Error al actualizar contraseña');
        }
    };

    return (
        <div className="principalCol colAdapt">
            <h1 className="tituloContainer">Usuarios</h1>
            <section className="containerCover">
                <div className="apartContainer">
                    <h2>Usuarios del Sistema</h2>
                    <div className="searchContainer">
                        <span className="searchButtons">
                            <button className="openCrudBtn" onClick={() => { setModalMsg(''); setShowCreateModal(true); }}>
                                + Nuevo Usuario
                            </button>
                            <button className="openCrudBtn" onClick={() => {
                                if (selectedID < 0) return showMessage('Seleccione un usuario', 'err');
                                setModalMsg(''); setNewPass(''); setConfirmNewPass('');
                                setShowPassModal(true);
                            }}>Cambiar Clave</button>
                            <button className="openCrudBtn" onClick={() => {
                                if (selectedID < 0) return showMessage('Seleccione un usuario', 'err');
                                setShowDelModal(true);
                            }}>Eliminar</button>
                        </span>
                        {msg.text && (
                            <p className="visible" style={{ color: msg.type === 'ok' ? '#e6e6e6' : '#b3b3b3' }}>
                                {msg.text}
                            </p>
                        )}
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
                                )) : <tr><td colSpan={3}>No hay usuarios</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── Modal Nuevo Usuario ── */}
            {showCreateModal && (
                <div className="crudOverlay">
                    <div className="crudModalBox">
                        <button className="crudModalClose" onClick={() => { setShowCreateModal(false); setModalMsg(''); }}>✕</button>
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
                        {modalMsg && <p className="visible">{modalMsg}</p>}
                        <div className="buttonContainer">
                            <input type="button" value="Agregar" onClick={handleCreate} />
                            <input type="button" value="Cancelar" onClick={() => { setShowCreateModal(false); setModalMsg(''); }} />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal Cambiar Contraseña ── */}
            {showPassModal && (
                <div className="crudOverlay">
                    <div className="crudModalBox">
                        <button className="crudModalClose" onClick={() => { setShowPassModal(false); setModalMsg(''); }}>✕</button>
                        <h2>Cambiar Contraseña</h2>
                        <div className="crudForm">
                            <input type="password" placeholder="nueva contraseña"
                                value={newPass}
                                onChange={e => setNewPass(e.target.value)}
                            />
                            <input type="password" placeholder="confirmar contraseña"
                                value={confirmNewPass}
                                onChange={e => setConfirmNewPass(e.target.value)}
                            />
                        </div>
                        {modalMsg && <p className="visible">{modalMsg}</p>}
                        <div className="buttonContainer">
                            <input type="button" value="Guardar" onClick={handleChangePass} />
                            <input type="button" value="Cancelar" onClick={() => { setShowPassModal(false); setModalMsg(''); }} />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal Eliminar ── */}
            {showDelModal && (
                <div className="crudOverlay">
                    <div className="crudModalBox">
                        <button className="crudModalClose" onClick={() => setShowDelModal(false)}>✕</button>
                        <h2>Eliminar Usuario</h2>
                        <p style={{ textAlign: 'center' }}>¿Estás seguro que deseas eliminar este usuario?</p>
                        <div className="buttonContainer">
                            <input type="button" value="Sí, eliminar" onClick={handleDelete} />
                            <input type="button" value="Cancelar" onClick={() => setShowDelModal(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};