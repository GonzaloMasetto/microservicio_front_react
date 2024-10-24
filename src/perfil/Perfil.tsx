import React, { useEffect, useState } from "react";
import { getPictureUrl, saveImage } from "../image/ImageApi";
import { useSelector } from "react-redux";
import Form from "../system/components/Form";
import FormLabel from "../system/components/FormLabel";
import FormTitle from "../system/components/FormTitle";
import { IStoredState } from "../system/store/SessionStore";
import FormButtonBar from "../system/components/FormButtonBar";
import FormAcceptButton from "../system/components/FormAcceptButton";
import axios from "axios"; // Para hacer las solicitudes HTTP
import { Modal, Button, TextField, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit'; // Icono de lápiz para edición
import { useNavigate, useParams } from 'react-router-dom';
import ImageUpload from "../system/components/ImageUpload";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import DangerLabel from "../system/components/DangerLabel";
import ShowImage from "../image/ShowImage";
import { Quality } from "../image/ImageApi";


export default function Perfil() {
    const token = useSelector((state: IStoredState) => state.token);
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [openModal, setOpenModal] = useState<boolean>(false); // Para controlar si el modal está abierto
    const [editingSection, setEditingSection] = useState<string>(""); // Para saber qué estamos editando (datos personales o tags)
    const [formData, setFormData] = useState<any>({}); // Para guardar temporalmente los datos editados


    //Imagen
    const [image, setImage] = useState<string>();
    const [imageId, setImageId] = useState<string>();
    const errorHandler = useErrorHandler();

    const updateImageState = (img: string) => {
        setImage(img);
    };

    const saveImageClick = async () => {
        try {
            errorHandler.cleanRestValidations();
            if (!image) {
                return;
            }   
            const result = await saveImage({ image });
            setImageId(result.id);      
            await axios.post('http://localhost:3005/api/profiles/image',
            {
                imageId : result.id                 
            } ,{
                headers:{
                    Authorization: `bearer ${token}`
                }
            })
            
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    };

    useEffect(() => {
        // Función para cargar el perfil
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3005/api/profiles',  {
                    headers:{
                        Authorization: `bearer ${token}` // Asegúrate de que el token esté precedido por 'Bearer'
                    }
                });
                setProfile(response.data); // Guardar el perfil si se encuentra
            } catch (error) {
                console.log("Error al obtener el perfil", error);
            }
        };
        fetchProfile();
    }, [token]);

    const handleEdit = (section: string) => {
        setEditingSection(section);
        setFormData(profile); // Inicializar los datos en el formulario con los datos actuales del perfil
        setOpenModal(true); // Abrir el modal
    };

    const handleSave= async () => {
        if(editingSection === "datos" ){
            try {
                const response = await axios.post('http://localhost:3005/api/profiles', formData, {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                });
                setProfile(response.data); // Actualizar el perfil con los nuevos datos
                setOpenModal(false); // Cerrar el modal
            } catch (error) {
                console.log("Error al actualizar el perfil", error);
            }
        }
        if(editingSection === "tags"){
            try {
                const response = await axios.post('http://localhost:3005/api/profiles/preferences', formData, {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                });
                setProfile(response.data); // Actualizar el perfil con los nuevos datos
                setOpenModal(false); // Cerrar el modal
            } catch (error) {
                console.log("Error al actualizar el perfil", error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div>
            {/* Sección de la imagen */}
            <FormTitle>Image</FormTitle>
            <div>
                {/* Si existe profile.imageId, usa ShowImage, sino muestra una imagen por defecto */}
                {profile?.imageId ? (
                    <ShowImage imageId={profile.imageId} quality={Quality.Q160} />
                ) : (
                    <img src='default-profile-image.jpg' alt="Profile" width="150" />
                )}
                <IconButton onClick={() => handleEdit("image")}>
                    <EditIcon />
                </IconButton>
            </div>


            {/* Sección de datos personales */}
            <FormTitle>Profile</FormTitle>
            <Form>
                <FormLabel label="Name" text={profile?.name || "N/A"} />
                <FormLabel label="LastName" text={profile?.lastName || "N/A"} />
                <FormLabel label="Email" text={profile?.email || "N/A"} />
                <FormLabel label="Phone" text={profile?.phone || "N/A"} />
                <IconButton onClick={() => handleEdit("datos")}>
                    <EditIcon />
                </IconButton>
            </Form>

            {/* Sección de tags */}
            <FormTitle>Tags</FormTitle>
            <Form>
                <FormLabel label="Tags" text={profile?.tags?.join(", ") || "N/A"} />
                <IconButton onClick={() => handleEdit("tags")}>
                    <EditIcon />
                </IconButton>
            </Form>

            {/* Modal para editar */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div style={{ padding: '20px', backgroundColor: 'white', margin: '100px auto', width: '500px' }}>
                    <h2>Editando {editingSection}</h2>
                    {editingSection === "datos" && (
                        <div>
                            <TextField
                                label="Name"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleInputChange}
                                fullWidth
                                style={{ margin: '10px' }}
                            />
                            <TextField
                                label="LastName"
                                name="lastName"
                                value={formData.lastName || ""}
                                onChange={handleInputChange}
                                fullWidth
                                style={{ margin: '10px' }}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleInputChange}
                                fullWidth
                                style={{ margin: '10px' }}
                            />
                            <TextField
                                label="Phone"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleInputChange}
                                fullWidth
                                style={{ margin: '10px' }}
                            />
                        </div>
                    )}
                    {editingSection === "tags" && (
                        <div>
                            <TextField
                                label="Tags (separados por comas)"
                                name="tags"
                                value={formData.tags?.join(", ") || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        tags: e.target.value.split(",").map(tag => tag.trim())
                                    })
                                }
                                fullWidth
                                style={{ margin: '10px' }}
                            />
                        </div>
                    )}
                    {editingSection === "image" && (
                        //aca tengo que poner lo que uso para subir una imagen en NewAricle.tsx
                        <div>
                            {/* Usamos el componente ImageUpload y la misma lógica que en NewArticle.tsx */}
                            <ImageUpload src={getPictureUrl(image)} onChange={updateImageState} />

                            <DangerLabel message={errorHandler.errorMessage} />

                            <FormButtonBar>
                                <FormAcceptButton hidden={imageId !== undefined} label="Subir" onClick={saveImageClick} />
                            </FormButtonBar>
                        </div>
                    )}
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Guardar
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
