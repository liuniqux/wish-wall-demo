import {useState, useEffect} from 'react';

export const useWallAndCamera = (imageCount: number) => {
    const [wallLength, setWallLength] = useState(10);
    const [groundLength, setGroundLength] = useState(20);
    const [cameraDropEnabled, setCameraDropEnabled] = useState(false);

    useEffect(() => {
        setWallLength(imageCount * 3 + 10);
        setGroundLength(imageCount * 3 + 20);
    }, [imageCount]);

    return {
        wallLength,
        groundLength,
        cameraDropEnabled,
        setCameraDropEnabled,
    };
};
