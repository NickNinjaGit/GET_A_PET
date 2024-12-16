import api from "../../../utils/api";
import styles from "./PetDetails.module.css";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import useFlashMessage from "../../../hooks/useFlashMessage";

function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState({});
  const [token] = useState(localStorage.getItem("token") || "");
  const {setFlashMessage} = useFlashMessage()

  useEffect(() => {
    api
      .get(`/pets/${id}`)
      .then((response) => {
        setPet(response.data.pet);
        console.log(response.data.pet);
      })
      .catch((err) => {
        return err;
      });
  }, [id]);

  async function schedule() {
    let msgType = "success";
    try {
      const response = await api.patch(`/pets/schedule/${pet._id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      const data = response.data; // Acessa os dados retornados
      setFlashMessage(data.message, msgType);
    } catch (err) {
      msgType = "error";
      const errorMessage = err.response?.data?.message || "Erro ao agendar"; // Tratamento do erro
      setFlashMessage(errorMessage, msgType);
    }
  }
  


  return (
    <>
      {pet.name && (
        <section className={styles.petdetails_container}>
          <div className={styles.petdetails_header}>
            <h1>Conhecendo o Pet: {pet.name}</h1>
            <p>Se tiver interesse, marque uma visita para conhecê-lo</p>
          </div>
          <div className={styles.pet_images}>
            {pet.images.map((image, index) => (
              <img
                src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                alt={pet.name}
                key={index}
              ></img>
            ))}
          </div>
          <p>
            <span className="bold">Peso:</span> {pet.weight}kg
          </p>
          <p>
            <span className="bold">Idade:</span> {pet.age} anos
          </p>
          {token ? (<button onClick={() => schedule()}>Solicitar uma Visita</button>) : (
            <p> Você precisa <Link to="/register">criar uma conta</Link> para marcar uma visita</p>
          )}
        </section>
      )}
    </>
  );
}

export default PetDetails;
