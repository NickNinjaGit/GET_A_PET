import api from "../../../utils/api";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import styles from "./EditPet.module.css";

import PetForm from "../../form/PetForm";

/* hooks */
import useFlashMessage from "../../../hooks/useFlashMessage";

function EditPet() {
  const [pet, setPet] = useState({});
  const [token] = useState(localStorage.getItem("token") || "");
  let { id } = useParams();
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setPet(response.data.pet);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, id]);

  async function updatePet(pet, id) {
    let msgType = "success";
    const formData = new FormData();
  
    Object.keys(pet).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append("images", pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });
  
  
    const data = await api
      .patch(`pets/${pet._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Resposta do backend:", response.data);
        return response.data;
      })
      .catch((err) => {
        console.log("Erro no backend:", err.response.data);
        msgType = "error";
        return err.response.data;
      });
      
      if(msgType === "success"){
        navigate("/pet/mypets");
      }
    setFlashMessage(data.message, msgType);
    
  }
 // wait render pet data to populate form
  return (
    <section>
      <div className={styles.editpet_header}>
        <h1>Editando informações de: {pet.name}</h1>
        <p>Atualize os dados do seu pet</p>
      </div>
     
      {pet.name && (
        <PetForm
        handleSubmit={updatePet}
        petData={pet}
        btnText="Atualizar"
        />
      )}
      
    </section>
  );
}

export default EditPet;
