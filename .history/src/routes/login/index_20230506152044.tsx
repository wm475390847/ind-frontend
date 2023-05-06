import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './index.module.less';
import backgroundImage from 'src/assets/img/background.jpeg';

interface LoginFormType {
    username: string;
    password: string;
}

const LoginPage = () => {
    const [loginForm, setLoginForm] = useState<LoginFormType>({
        username: '',
        password: '',
    });
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // TODO: 发送登录请求并校验用户名和密码是否正确
    const isLoginSuccess = true; // 登录成功标志

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoginSuccess) {
            // TODO将登录逻辑放在这里
            navigate("/");
        } else {
            setErrorMsg('用户名或密码错误');
        }
    };

    return (
        <div className={styles.loginPage} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className={styles.container}>
                <form onSubmit={handleFormSubmit} className={styles.loginForm}>
                    <h2 className={styles.title}>登录</h2>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">账号</label>
                        <input
                            type="text"
                            name="username"
                            value={loginForm.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">密码</label>
                        <input
                            type="password"
                            name="password"
                            value={loginForm.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {errorMsg && <p className={styles.error}>{errorMsg}</p>}
                    <button type="submit" className={styles.btn}>
                        登录
                    </button>
                </form>
            </div>
        </div >
    );
};

export default LoginPage;
