import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                return JSON.parse(item);
            }
            return initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            setStoredValue(value);
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue] as const;
}
