import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useBackButtonManager } from "../contexts/BackButtonContext";
import { miniApp } from "@telegram-apps/sdk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import './UserPage.scss';

const UserPage = () => {
    const { user, isLoading, loadUser } = useUser();
    const navigate = useNavigate();
    const { action, clear } = useBackButtonManager();

    const [fio, setFio] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");

    useEffect(() => {
        if (!isLoading && user) {
            setFio(user.fio || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setAddress(user.address || "");
        }
        miniApp.setBackgroundColor("#FFFFFF");
        miniApp.setHeaderColor("#FFFFFF");
        action(() => navigate("/"));
        return () => clear();
    }, [action, clear, navigate, isLoading, user]);

    const saveUser = async () => {
        if (!user || isSaving) return;

        if (!user.id || typeof user.id !== 'string') {
            setSaveStatus("ID пользователя некорректен");
            setTimeout(() => setSaveStatus(""), 2000);
            return;
        }

        setIsSaving(true);
        setSaveStatus("");

        try {
            await axios.post(`https://localhost:5023/api/User/Update`, {
                id: user.id,
                fio,
                email,
                phone,
                address
            });

            setSaveStatus("Сохранено!");
            setTimeout(() => setSaveStatus(""), 2000);

            loadUser();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Ошибка сохранения";
            setSaveStatus(errorMessage);
            setTimeout(() => setSaveStatus(""), 2000);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="user-loading">Загрузка пользователя...</div>;

    return (
        <div className="user-page">
            <div className="user-header">
                <div className="user-avatar">
                    <FaUser className="user-avatar__icon" />
                </div>
            </div>

            <div className="user-card">
                <h2 className="user-card__title">Данные для доставки</h2>
                <p className="user-card__desc">
                    Чтобы не вводить каждый раз после заказа.<br />
                </p>

                <div className="user-form">
                    <div className="user-field">
                        <label className="user-field__label">ФИО</label>
                        <input
                            className="user-field__input"
                            value={fio}
                            onChange={(e) => setFio(e.target.value)}
                        />
                    </div>

                    <div className="user-field">
                        <label className="user-field__label">Email</label>
                        <input
                            className="user-field__input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="user-field">
                        <label className="user-field__label">Телефон</label>
                        <input
                            className="user-field__input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="user-field">
                        <label className="user-field__label">Адрес</label>
                        <input
                            className="user-field__input"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    className={`user-save-btn ${isSaving ? 'disabled' : ''}`}
                    onClick={saveUser}
                    disabled={isSaving}
                >
                    {isSaving ? "Сохранение..." : "Сохранить изменения"}
                </button>

                {saveStatus && (
                    <div className={`save-status ${saveStatus.includes("Ошибка") ? "error" : "success"}`}>
                        {saveStatus}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPage;