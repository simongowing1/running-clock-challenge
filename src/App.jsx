import React, { useState, useEffect, useRef, Fragment } from 'react';

export default function App() {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [runningClock, setRunningClock] = useState('00:00');
    const intervalRef = useRef(null)

    useEffect(() => {
        if (isRunning && !isPaused) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 0) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, isPaused]);

    useEffect(() => {
        if (timeLeft === null) return;
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        setRunningClock(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, [timeLeft]);

    const handleStart = () => {
        const total = parseInt(minutes) * 60 + parseInt(seconds)
        setTimeLeft(total);
        setIsPaused(false);
        setIsRunning(true);
    }

    const handleReset = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsPaused(false);
        setTimeLeft(null);
        setMinutes(0);
        setSeconds(0);
        setRunningClock('00:00')
    }

    return (
        <Fragment>
            <label>
                <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
                Minutes
            </label>
            <label>
                <input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} />
                Seconds
            </label>

            <button onClick={handleStart}>START</button>
            <button onClick={() => setIsPaused((prev) => !prev)}>PAUSE / RESUME</button>
            <button onClick={handleReset}>RESET</button>

            <h1 data-testid="running-clock">{runningClock}</h1>
        </Fragment>
    );
}
