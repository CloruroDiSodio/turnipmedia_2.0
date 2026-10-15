"use client";

import {Button} from "react-bootstrap";

interface AudioButtonItem {
    index: number;
    url: string;
    title: string;
}

interface AudioButtonProps {
    item: AudioButtonItem;
}

const AudioButton = ({item}: AudioButtonProps) => {
    const {index, url, title} = item;

    // The Audio element is created on click: constructing it during render
    // would crash Next.js server-side prerendering (no `Audio` in Node).
    const start = () => {
        const audio = new Audio(url)
        // play() rejects when the browser blocks playback or the file fails
        // to load; swallow it instead of leaving an unhandled rejection.
        audio.play().catch(() => {})
    }

    return (
        <Button
            variant={index%2 === 0 ? 'success' : 'danger'}
            size="lg" type="button" onClick={start} className="me-1 mt-1"
        >
            {title}
        </Button>
    )
}

export default AudioButton