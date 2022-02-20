import React from "react";
import {Button} from "react-bootstrap";

const AudioButton = ({item}) => {
    const {index, url, title} = item;

    let audio = new Audio(url)

    const start = () => {
        audio.play()
    }

    return (
        <Button
            variant={index%2 === 0 ? 'success' : 'danger'}
            size="lg" onClick={start} className="me-1 mt-1"
        >
            {title}
        </Button>
    )
}

export default AudioButton
