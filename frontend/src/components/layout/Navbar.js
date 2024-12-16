import { useState, useContext, useEffect } from "react";
import { Context } from "../../context/UserContext";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import Logo from "../../assets/img/logo.png";
import styles from "./Navbar.module.css";
import RoundedImage from "./RoundedImage";

function Navbar() {
  const {logout, authenticated} = useContext(Context);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState({});

  async function getUser(token) {
    if (!token) return;
    try {
      const response = await api.get("/users/checkuser", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar o usuário:", error);
    }
  }

  useEffect(() => {
    getUser(token);
  }, [token]); // Recarregar as informações do usuário sempre que o token mudar

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="Get a Pet" />
        <h2>Get a Pet</h2>
      </div>

      {/* Navegação */}
      <ul className={`${authenticated ? styles.authenticated : ""}`}>
        <li>
          <Link to="/">Adotar</Link>
        </li>
        {authenticated ? (
          <>
            <li>
              <Link to="/pet/mypets">Meus Pets</Link>
            </li>
            <li>
              <Link to="/pet/myadoptions">Minhas Adoções</Link>
            </li>
            <li>
              <Link to="/user/profile">Perfil</Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  logout();
                  setToken(""); // Limpar o token ao sair
                }}
                to="/login"
              >
                Sair
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Entrar</Link>
            </li>
            <li>
              <Link to="/register">Cadastrar</Link>
            </li>
          </>
        )}
      </ul>

      {/* Informações do usuário */}
      {authenticated && (
        <>
          <div className={styles.user_info}>
            <h5>
              Seja bem-vindo!
              <span>
                <h3>{user.name}</h3>
              </span>
            </h5>
          </div>
          {/* Foto de perfil */}
          {user.image && (
            <RoundedImage
              src={`${process.env.REACT_APP_API}/images/users/${user.image}`}
              alt={user.name}
              width="px75"
            />
          )}
        </>
      )}
    </nav>
  );
}

export default Navbar;
