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
        if (!user) return;

        try {
            await axios.post(`https://localhost:5023/api/User/Update`, {
                id: user.id,
                fio,
                email,
                phone,
                address
            });

            loadUser();
        } catch (error) {
            console.error("Ошибка при сохранении пользователя:", error);
        }
    };

    if (isLoading) return <div className="user-loading">Загрузка пользователя...</div>;

    return (
        <div className="user-page">
            {/* Аватар и имя */}
            <div className="user-header">
                <div className="user-avatar">
                    <FaUser className="user-avatar__icon" />
                </div>
            </div>

            {/* Карточка с формой */}
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

                <button className="user-save-btn" onClick={saveUser}>
                    Сохранить изменения
                </button>
            </div>
        </div>
    );
};

export default UserPage;