'use client';
import { useEffect } from "react";

declare global {
    interface Window {
        Intercom: any; // Adjust 'any' to a more specific type if available
        intercomSettings: any; // Adjust 'any' to a more specific type if available
    }
}

interface IntercomClientComponentProps {
    userId?: string;
    userEmail?: string;
}

const IntercomClientComponent: React.FC<IntercomClientComponentProps> = ({ userId, userEmail }) => {
    useEffect(() => {
        const settings = {
            api_base: "https://api-iam.intercom.io",
            app_id: "pdo0qly5", // Replace with your actual Intercom app ID.
            user_id: userId,
            email: userEmail,
        };

        window.intercomSettings = settings;

        if (window.Intercom) {
            window.Intercom('reattach_activator');
            window.Intercom('update', settings);
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
            // if (window.Intercom) {
            //     window.Intercom('shutdown');
            // }
        };
    }, [userId, userEmail]); // Rerun effect if userId or userEmail changes

    return null;
};

export default IntercomClientComponent; 