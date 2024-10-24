import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { IStoredState } from "../system/store/SessionStore";

interface ArticleTag {
    _id: string;
    articleId: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ArticleResponse {
    name: string; // Asegúrate de que esta propiedad coincida con la estructura de la respuesta de tu API
}

export default function Sugerencia() {
    const [articleNames, setArticleNames] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const token = useSelector((state: IStoredState) => state.token);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get<ArticleTag[]>('http://localhost:3009/api/article/tag', {
                    headers: {
                        Authorization: `bearer ${token}`,
                    },
                });

                const articles: ArticleTag[] = response.data; // Especifica el tipo de los artículos
                const articleIds = articles.map((article: ArticleTag) => article.articleId); // Ahora TypeScript sabe el tipo

                const articlePromises = articleIds.map((articleId: string) =>
                    axios.get<ArticleResponse>(`http://localhost:3002/v1/articles/${articleId}`)
                );

                const articlesDetails = await Promise.all(articlePromises);
                const names = articlesDetails.map(articleResponse => articleResponse.data.name);
                
                setArticleNames(names);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [token]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h2>Sugerencias de Artículos</h2>
            <ul>
                {articleNames.length > 0 ? (
                    articleNames.map((name, index) => (
                        <li key={index}>{name}</li>
                    ))
                ) : (
                    <li>No hay artículos sugeridos.</li>
                )}
            </ul>
        </div>
    );
}
