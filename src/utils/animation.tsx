import type {Direction} from '../types';
import type {TargetAndTransition} from 'framer-motion';

type Variants = {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    exit: TargetAndTransition;
};

export const getAnimationVariants = (direction: Direction): Variants => {
    switch (direction) {
        case 'top':
            return {
                initial: {opacity: 0, y: 10},
                animate: {opacity: 1, y: 0},
                exit: {opacity: 0, y: 10},
            };
        case 'bottom':
            return {
                initial: {opacity: 0, y: -10},
                animate: {opacity: 1, y: 0},
                exit: {opacity: 0, y: -10},
            };
        case 'left':
            return {
                initial: {opacity: 0, x: 10},
                animate: {opacity: 1, x: 0},
                exit: {opacity: 0, x: 10},
            };
        case 'right':
            return {
                initial: {opacity: 0, x: -10},
                animate: {opacity: 1, x: 0},
                exit: {opacity: 0, x: -10},
            };
        default:
            return {
                initial: {opacity: 0, y: 10},
                animate: {opacity: 1, y: 0},
                exit: {opacity: 0, y: 10},
            };
    }
};

export const getCenterModalVariants = (): Variants => ({
    initial: {opacity: 0, y: 10},
    animate: {opacity: 1, y: 0},
    exit: {opacity: 0, y: 10},
});
