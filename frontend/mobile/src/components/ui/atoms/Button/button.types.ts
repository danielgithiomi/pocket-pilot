import { StyleProp, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
    id: string;
    label: string;
    variant: ButtonVariant;
    style?: StyleProp<ViewStyle>;
}