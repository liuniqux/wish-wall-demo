import {useState, useEffect} from 'react';

/**
 * 管理墙面长度和地面长度。
 * @param imageCount 当前图片数量
 */
export const useWallAndGround = (imageCount: number) => {
    // 墙面长度，随图片数量变化自动调整
    const [wallLength, setWallLength] = useState(10);

    // 地面长度，略长于墙面长度
    const [groundLength, setGroundLength] = useState(20);


    // 根据图片数量动态调整墙面和地面长度
    useEffect(() => {
        const length = imageCount * 3;
        setWallLength(length + 10);
        setGroundLength(length + 20);
    }, [imageCount]);

    return {
        wallLength,
        groundLength
    };
};
