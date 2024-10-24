import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import DangerLabel from "../system/components/DangerLabel";
import Form from "../system/components/Form";
import FormAcceptButton from "../system/components/FormAcceptButton";
import FormButton from "../system/components/FormButton";
import FormButtonBar from "../system/components/FormButtonBar";
import FormInput from "../system/components/FormInput";
import FormTitle from "../system/components/FormTitle";
import ImageButton from "../system/components/ImageButton";
import { useErrorHandler } from "../system/utils/ErrorHandler";
import { DefaultProps } from "../system/utils/Tools";
import { IArticle, findArticles } from "./CatalogApi";
import { IStoredState } from "../system/store/SessionStore";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "react-modal";

export default function SearchArticle(props: DefaultProps) {
    const token = useSelector((state: IStoredState) => state.token);
    const [text, setText] = useState("");
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [articleTags, setArticleTags] = useState<{ [key: string]: string[] }>({});
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para el modal
    const [newTags, setNewTags] = useState(""); // Estado para nuevos tags
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null); // Para almacenar el ID del artículo seleccionado

    const errorHandler = useErrorHandler();
    const navigate = useNavigate();

    const search = async () => {
        try {
            if (text) {
                const articleResult = await findArticles(text);
                setArticles(articleResult);
            }
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    };

    const fetchTags = async (articleId: string) => {
        try {
            const response = await axios.get(`http://localhost:3009/api/article/tag/${articleId}/tags`);
            setArticleTags(prevState => ({
                ...prevState,
                [articleId]: response.data,
            }));
        } catch (error: any) {
            errorHandler.processRestValidations(error);
        }
    };

    useEffect(() => {
        articles.forEach(article => {
            if (article._id) {
                fetchTags(article._id);
            }
        });
    }, [articles]);

    const showImage = (imageId: string | undefined) => {
        if (imageId !== undefined) {
            navigate("/showPicture/" + imageId);
        }
    };

    const editArticle = (id: string | undefined) => {
        if (id !== undefined) {
            navigate("/editArticle/" + id);
        }
    };

    const openModal = (articleId: string) => {
        setSelectedArticleId(articleId); // Guarda el ID del artículo
        setModalIsOpen(true); // Abre el modal
        setNewTags(""); // Reinicia los tags
    };

    const closeModal = () => {
        setModalIsOpen(false); // Cierra el modal
    };

    const handleSaveTags = async () => {
        if (selectedArticleId) {
            const tagsArray = newTags.split(",").map(tag => tag.trim());
            console.log(selectedArticleId)
            await axios.post(`http://localhost:3009/api/article/tag/${selectedArticleId}`,   tagsArray , {
                headers: {
                    Authorization: `bearer ${token}`
                }
            });
            closeModal(); // Cierra el modal después de guardar
        }
    };

    return (
        <div className="global_content">
            <FormTitle>Buscar Artículos</FormTitle>
            <Form>
                <FormInput
                    label="Buscar Artículos"
                    name="text"
                    onChange={e => setText(e.target.value)}
                    errorHandler={errorHandler} />
                <DangerLabel message={errorHandler.errorMessage} />
                <FormButtonBar>
                    <FormAcceptButton label="Buscar" onClick={search} />
                    <FormButton label="Cancelar" onClick={() => navigate("/")} />
                </FormButtonBar>
            </Form>

            <ArticlesList
                articles={articles}
                articleTags={articleTags}
                onEditClick={editArticle}
                onShowImage={showImage}
                onOpenModal={openModal} // Pasar la función openModal
            />

            {/* Modal para agregar tags */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Agregar Tags">
                <h2>Agregar Tags</h2>
                <FormInput
                    label="Tags (separadas por comas)"
                    name="newTags"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    errorHandler={errorHandler}
                />
                <FormButtonBar>
                    <FormAcceptButton label="Guardar" onClick={handleSaveTags} />
                    <FormButton label="Cancelar" onClick={closeModal} />
                </FormButtonBar>
            </Modal>
        </div>
    );
}

interface ArticlesListProps extends DefaultProps {
    articles?: IArticle[],
    articleTags: { [key: string]: string[] };
    onShowImage: (imageId: string | undefined) => any,
    onEditClick: (id: string | undefined) => any,
    onOpenModal: (articleId: string) => void; // Asegúrate de incluir esta propiedad
}

function ArticlesList(props: ArticlesListProps) {
    if (!props.articles) {
        return null;
    }
    return (
        <div>
            <br />
            <table id="articles" className="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Imagen</th>
                        <th>Stock</th>
                        <th>Precio</th>
                        <th>Tags</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props.articles.map((article, i) => (
                        <tr key={i}>
                            <td>{article._id}</td>
                            <td>{article.name}</td>
                            <td>{article.description}</td>
                            <td>
                                {article.image}&nbsp;
                                <ImageButton
                                    imageUrl="/assets/find.png"
                                    hidden={!article.image}
                                    onClick={() => props.onShowImage(article.image)}
                                />
                            </td>
                            <td>{article.stock}</td>
                            <td>{article.price}</td>
                            <td>
                                {article._id && props.articleTags[article._id]
                                    ? props.articleTags[article._id].join(", ")
                                    : "No tags"}
                                <ImageButton
                                    imageUrl="/assets/edit.png"
                                    onClick={() => props.onOpenModal(article._id!)} // Llama a la función para abrir el modal
                                />
                            </td>
                            <td>
                                <ImageButton
                                    imageUrl="/assets/edit.png"
                                    onClick={() => props.onEditClick(article._id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
