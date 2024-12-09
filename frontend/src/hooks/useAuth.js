import api from "../utils/api";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "./useFlashMessage";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }
  }, []);

  async function register(user) {

    
    let msgText = 'Cadastrado realizado com sucesso!';
    let msgType = 'success';


    try {
      // tenta fazer um POST para o backend com as informações que o usuário digitou
      const data = await api.post("/users/register", user).then((response) => {
        return response.data;
      });
      await authUser(data);
    } catch (err) {
      // tratar o erro
      msgText = err.response?.data?.message || 'Ocorreu um erro inesperado';
      msgType = 'error';
    }

    setFlashMessage(msgText, msgType);
  }

  async function authUser(data) {
      setAuthenticated(true);
      localStorage.setItem('token', JSON.stringify(data.token));
      navigate('/');
  }

  function logout() {
    const msgText = 'Logout realizado com sucesso!';
    const msgType = 'success';

    // removing token trails from localStorage
    setAuthenticated(false);
    localStorage.removeItem('token');
    api.defaults.headers.Authorization = undefined;

    // redirecting to home and showing flash message
    navigate('/');
    setFlashMessage(msgText, msgType);
  }

   // o hook retorna a função para ser utilizada no contexto
   return { authenticated, register, logout };
}
