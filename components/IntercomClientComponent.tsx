'use client';
import { useEffect } from "react";

declare global {
    interface Window {
        Intercom: unknown; // Use unknown instead of any
        intercomSettings: unknown; // Use unknown instead of any
    }
}

interface IntercomClientComponentProps {
    userId?: string;
    userEmail?: string;
}

// Define a type for the Intercom function
type IntercomFunction = (command: string, settings?: unknown) => void;

const IntercomClientComponent: React.FC<IntercomClientComponentProps> = ({ userId, userEmail }) => {
    useEffect(() => {
        const settings = {
            api_base: "https://api-iam.intercom.io",
            app_id: "pdo0qly5", // Replace with your actual Intercom app ID.
            user_id: userId,
            email: userEmail,
        };

        // Assign settings (still potentially 'any' depending on specific needs, but 'unknown' is safer start)
        window.intercomSettings = settings;

        // Type guard to check if Intercom exists and is callable
        if (typeof window.Intercom === 'function') {
            const intercom = window.Intercom as IntercomFunction; // Assert type
            intercom('reattach_activator');
            intercom('update', settings);
        } else {
            // Check if the script already exists to avoid adding it multiple times
            const existingScript = document.querySelector('script[src="https://widget.intercom.io/widget/pdo0qly5"]');
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = 'https://widget.intercom.io/widget/pdo0qly5'; // Use your app ID here too
                script.async = true;
                document.body.appendChild(script);
            }
        }

        // Cleanup function to shutdown Intercom when the component unmounts or user logs out
        return () => {
            // Optional: You might want to shut down Intercom on logout or unmount
            // if (typeof window.Intercom === 'function') {
            //     const intercom = window.Intercom as IntercomFunction;
            //     intercom('shutdown');
            // }
        };
    }, [userId, userEmail]); // Rerun effect if userId or userEmail changes

    return null;
};

export default IntercomClientComponent; 