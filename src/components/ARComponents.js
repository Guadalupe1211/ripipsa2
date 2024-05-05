import axios from "axios";
import React, { useState, useEffect } from 'react';
import { ARExperience } from './Experience'; // Asegúrate de importar tu clase ARExperience y la función loadObjects
import { useParams } from 'react-router-dom';
import { NgrokUrl } from "./NgrokUrl";

const ARComponents = () => {
    
    const [arExperience, setARExperience] = useState(null);
        const [error, setError] = useState('');
        const [mtlUrl,setMtlUrl] = useState('');
        const [objUrl,setObjUrl] = useState('');
        const {id_objeto} = useParams();
       
    
        const handleObjeto = async () => {
            
            try {
                //const { data } = await axios.get('http://localhost:2023/api/load-object/1');
                const { data } = await axios.get(`https://${NgrokUrl}/api/load-object/${id_objeto}`);
                console.log(data.mtlUrl)
                setMtlUrl (data.mtlUrl)
                setObjUrl (data.objUrl)
            } catch (error) {
                setError('No se pudo conectar con el servidor');
            }
        };
        useEffect (() =>{
            handleObjeto()
        });


        const handleClickLoadModel = async () => {
            try {
                const experience = new ARExperience();
                await experience.loadModel(mtlUrl, objUrl);
                setARExperience(experience);
                experience.initScene();
                experience.setupARExperience();
            } catch (error) {
                console.error("Error al cargar el modelo:", error);
            }
        };



    return (
        <div className="container3D" style={{ width: "100%", height: "100vh" }}>
            <button onClick ={() => handleClickLoadModel()} className="botonAR">Cargar Modelo</button> 

           
            
        </div>
    );
};



export default ARComponents;