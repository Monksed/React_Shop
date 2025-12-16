import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useBackButtonManager } from "../contexts/BackButtonContext";
import { miniApp } from "@telegram-apps/sdk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserPage = () => {
    const { user, isLoading, loadUser } = useUser();
    const navigate = useNavigate();
    const { action, clear } = useBackButtonManager();

    const [fio, setFio] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (!isLoading && user) {
            setFio(user.fio || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
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
                phone
            });

            loadUser();
        } catch (error) {
            console.error("Ошибка при сохранении пользователя:", error);
        }
    };

    if (isLoading) return <h1>Загрузка пользователя...</h1>;

    return (
        <div style={{ padding: "24px" }}>
            <h1>Пользователь</h1>

            <div style={{ margin: "12px 0" }}>
                <label>ФИО</label>
                <input value={fio} onChange={(e) => setFio(e.target.value)} />
            </div>

            <div style={{ margin: "12px 0" }}>
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div style={{ margin: "12px 0" }}>
                <label>Телефон</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <button onClick={saveUser} style={{ marginTop: "12px" }}>
                Сохранить изменения
            </button>
        </div>
    );
};

export default UserPage;
