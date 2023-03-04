import { useCallback, useState } from 'react';

export function useLocalStorage(key, defaultValue) {
    const [_value, _setValue] = useState(() => {
        const item = localStorage.getItem(key);

        return item !== undefined ? item : defaultValue;
    });

    const setValue = useCallback(
        (value) => {
            localStorage.setItem(key, value);
            _setValue(value);
        },
        [key]
    );

    return [_value, setValue];
}
