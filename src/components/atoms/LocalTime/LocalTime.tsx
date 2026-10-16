"use client";

import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import "./LocalTime.scss";

const TIME_ZONE = "Europe/Rome";

const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: TIME_ZONE,
});

// A light-hearted guess at what I'm up to, so visitors know when to expect a reply.
const activityAt = (hour: number) => {
    if (hour >= 7 && hour < 9) return "probably making the first tea of the day";
    if (hour >= 9 && hour < 18) return "probably writing code";
    if (hour >= 18 && hour < 23) return "probably reading a book";
    return "probably asleep, so expect a reply after breakfast";
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

    const time = formatter.format(now);
    const hour = Number(time.slice(0, 2));

    return (
        <p className="local-time">
            <FiClock aria-hidden="true" focusable="false" />
            <span>
                It&apos;s <time dateTime={time}>{time}</time> near Milan: I&apos;m {activityAt(hour)}.
            </span>
        </p>
    );
};

export default LocalTime;
