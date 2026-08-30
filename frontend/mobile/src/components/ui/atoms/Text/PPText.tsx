import { FC } from 'react';
import { Fonts } from '@/constants/theme';
import { PPTextProps } from './PPText.types';
import { Text, StyleSheet, Platform } from 'react-native';

export const PPText: FC<PPTextProps> = ({ type, style, ...rest }) => {
    const { default: defaultText, title, code, link, linkPrimary, subtitle, smallBold, small } = PPStyles;

    return (
        <Text
            style={[
                type === 'link' && link,
                type === 'code' && code,
                type === 'title' && title,
                type === 'small' && small,
                type === 'subtitle' && subtitle,
                type === 'default' && defaultText,
                type === 'smallBold' && smallBold,
                type === 'linkPrimary' && linkPrimary,
                style
            ]}
            {...rest}
        />
    );
};

const PPStyles = StyleSheet.create({
    small: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 500
    },
    smallBold: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 700
    },
    default: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 500
    },
    title: {
        fontSize: 48,
        fontWeight: 600,
        lineHeight: 52
    },
    subtitle: {
        fontSize: 32,
        lineHeight: 44,
        fontWeight: 600
    },
    link: {
        lineHeight: 30,
        fontSize: 14
    },
    linkPrimary: {
        lineHeight: 30,
        fontSize: 14,
        color: '#3c87f7'
    },
    code: {
        fontFamily: Fonts.mono,
        fontWeight: Platform.select({ android: 700 }) ?? 500,
        fontSize: 12
    }
});
