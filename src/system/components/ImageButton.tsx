import React from "react";
import './image_button.css';

interface ImageButtonProps {
    imageUrl: string,
    hidden?: boolean,
    onClick: () => any
}

export default function ImageButton(props: ImageButtonProps) {
    if (props.hidden === true) {
        return null;
    }
    return (
        <button className="imageButton" onClick={props.onClick} >
            <img alt="" src={props.imageUrl} />
        </button>
    )
}
