import { FC } from 'react';
import { Text } from 'react-native';
import { PPTextProps } from '@atoms/Text/PPText.types';

export const PPText: FC<PPTextProps> = ({ type, style, ...rest }) => {
    return <Text style={style} {...rest} />;
};
