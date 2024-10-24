import React from "react";
import "../styles.css";
import { DefaultProps } from "../system/utils/Tools";
import { Quality } from "./ImageApi";

export interface ShowImageProps extends DefaultProps {
    imageId?: string;
    quality?: Quality;
}

export default function ShowImage(props: ShowImageProps) {
    const getImageUrl = () => {
        if (props.imageId === undefined) {
            return "/assets/profile.png"
        }

        let result = "http://localhost:3001/v1/image/" + props.imageId + "/jpeg"
        if (props.quality != null) {
            result += "?Size=" + props.quality
        }
        return result
    }

    if (!props.imageId) {
        return null
    }
    return (
        <div >
            <img alt="" src={getImageUrl()} />
            <div className="text-block">
                <strong>{props.quality ? props.quality : "Original"}</strong>
            </div>
            <br />
        </div>
    );
}
