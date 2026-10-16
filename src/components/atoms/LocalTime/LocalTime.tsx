"use client";

import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import "./LocalTime.scss";

const TIME_ZONE = "Europe/Rome";

const formatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: TIME_ZONE,
});

// A light-hearted guess at what I'm up to, so visitors know when to expect a reply.
const activityAt = (day: string, hour: number) => {
    const weekend = day === "Sat" || day === "Sun";
    const asleep = hour >= 23 || hour < 7;

    // Late on Friday the next reply is after the weekend, not after breakfast.
    if (asleep) {
        return weekend || (day === "Fri" && hour >= 23)
            ? "probably asleep, so expect a reply on Monday"
            : "probably asleep, so expect a reply after breakfast";
    }
    if (weekend) return "probably enjoying the weekend, so expect a reply on Monday";
    if (hour < 9) return "probably making the first tea of the day";
    if (hour === 13) return "probably having lunch";
    if (hour < 18) return "probably writing code";
    return "probably reading a book";
};

// The visitor's clock is only known in the browser, so nothing is rendered on
// the server (avoids a hydration mismatch) and the line appears after mount.
const LocalTime = () => {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const interval = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(interval);
    }, []);

    if (!now) return null;

    const parts = Object.fromEntries(formatter.formatToParts(now).map(({ type, value }) => [type, value]));
    const time = `${parts.hour}:${parts.minute}`;

    return (
        <p className="local-time">
            <FiClock aria-hidden="true" focusable="false" />
            <span>
                It&apos;s <time dateTime={time}>{time}</time> near Milan: I&apos;m {activityAt(parts.weekday, Number(parts.hour))}.
            </span>
        </p>
    );
};

export default LocalTime;
