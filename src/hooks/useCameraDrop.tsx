import { useState } from 'react';

export const useCameraDrop = () => {
    const [cameraDropEnabled, setCameraDropEnabled] = useState(false);

    const enableDrop = () => setCameraDropEnabled(true);
    const disableDrop = () => setCameraDropEnabled(false);

    return {
        cameraDropEnabled,
        enableDrop,
        disableDrop,
    };
};
