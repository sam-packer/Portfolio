declare global {
    interface Window {
        plausible?: (eventName: string) => void;
    }
}

export {};
