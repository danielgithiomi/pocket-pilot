import { TextProps } from 'react-native';
import { ThemeColor } from '@/constants/theme';

export type PPTextTypes = 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';

export interface PPTextProps extends TextProps {
    type?: PPTextTypes;
    themeColor?: ThemeColor;
}
