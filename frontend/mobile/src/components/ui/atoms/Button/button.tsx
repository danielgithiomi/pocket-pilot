import { FC } from 'react';
import { ButtonProps } from '@atoms/Button/button.types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const Button: FC<ButtonProps> = ({ id, label, style, variant, ...rest }) => {
    const { baseStyle } = ButtonStyles;

    return (
        <TouchableOpacity id={id} style={baseStyle} {...rest}>
            <Text>{label + '-' + variant}</Text>
        </TouchableOpacity>
    );
};

const ButtonStyles = StyleSheet.create({
    baseStyle: {
        width: 'auto',
        color: 'white',
        backgroundColor: 'blue'
    }
});
