"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import "./CopyButton.scss";

type Status = "idle" | "copied" | "failed";

const MESSAGES: Record<Status, string> = {
    idle: "",
    copied: "Copied to the clipboard!",
    failed: "Couldn't copy, please select it instead.",
};

// Copies `text` to the clipboard. The result is announced through a polite
// live region, which stays mounted so screen readers pick up each change.
const CopyButton = ({ text, label }: { text: string; label: string }) => {
    const [status, setStatus] = useState<Status>("idle");

    useEffect(() => {
        if (status === "idle") return;
        const timeout = setTimeout(() => setStatus("idle"), 2500);
        return () => clearTimeout(timeout);
    }, [status]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setStatus("copied");
        } catch {
            setStatus("failed");
        }
    };

    const Icon = status === "copied" ? FiCheck : FiCopy;

    return (
        <span className="copy-button">
            <button type="button" className="copy-button__button" onClick={copy}>
                <Icon aria-hidden="true" focusable="false" />
                {label}
            </button>
            <span className="copy-button__status" role="status">
                {MESSAGES[status]}
            </span>
        </span>
    );
};

export default CopyButton;
