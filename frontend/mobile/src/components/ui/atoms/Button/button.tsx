import { FC } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ButtonProps } from '@atoms/Button/button.types';

export const Button: FC<ButtonProps> = ({ id, label, style, variant, ...rest }) => {
    return (
        <TouchableOpacity id={id} className="bg-secondary" {...rest}>
            <Text className="text-white">{label + '-' + variant}</Text>
        </TouchableOpacity>
    );
};
