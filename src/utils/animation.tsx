import type {Direction} from '@/types';
import type {TargetAndTransition} from 'framer-motion';

/**
 * 定义 framer-motion 动画变体类型
 * 包含初始状态（initial）、动画中状态（animate）、退出状态（exit）
 */
type Variants = {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    exit: TargetAndTransition;
};

/**
 * 根据传入的方向生成对应的动画变体配置
 * 常用于控制弹窗、浮层、面板等组件的入场、离场动画
 *
 * @param direction - 动画的方向（'top' | 'bottom' | 'left' | 'right'）
 * @returns 对应方向的动画变体配置对象
 */
export const getAnimationVariants = (direction: Direction): Variants => {
    switch (direction) {
        case 'top':
            // 从顶部进入或退出，向下偏移
            return {
                initial: {opacity: 0, y: 10},
                animate: {opacity: 1, y: 0},
                exit: {opacity: 0, y: 10},
            };
        case 'bottom':
            // 从底部进入或退出，向上偏移
            return {
                initial: {opacity: 0, y: -10},
                animate: {opacity: 1, y: 0},
                exit: {opacity: 0, y: -10},
            };
        case 'left':
            // 从左侧进入或退出，向右偏移
            return {
                initial: {opacity: 0, x: 10},
                animate: {opacity: 1, x: 0},
                exit: {opacity: 0, x: 10},
            };
        case 'right':
            // 从右侧进入或退出，向左偏移
            return {
                initial: {opacity: 0, x: -10},
                animate: {opacity: 1, x: 0},
                exit: {opacity: 0, x: -10},
            };
        default:
            // 默认处理（一般为顶部进入）
            return {
                initial: {opacity: 0, y: 10},
                animate: {opacity: 1, y: 0},
                exit: {opacity: 0, y: 10},
            };
    }
};

/**
 * 用于居中弹窗（CenteredModal）统一的动画变体配置
 * 弹窗从下方向上轻微浮现，透明度渐变
 *
 * @returns 居中弹窗的动画变体
 */
export const getCenterModalVariants = (): Variants => ({
    initial: {opacity: 0, y: 10},
    animate: {opacity: 1, y: 0},
    exit: {opacity: 0, y: 10},
});
