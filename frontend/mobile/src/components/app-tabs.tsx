import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { NativeTabs, NativeTabTrigger } from 'expo-router/unstable-native-tabs';

export default function AppTabs() {
    const scheme = useColorScheme();
    const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

    return (
        <NativeTabs
            backgroundColor={colors.background}
            indicatorColor={colors.backgroundElement}
            labelStyle={{ selected: { color: colors.text } }}>
            <NativeTabs.Trigger name="index" labelVisibilityMode="selected">
                <NativeTabTrigger.Label>Home</NativeTabTrigger.Label>
                <NativeTabTrigger.Icon src={require('@/assets/images/tabIcons/home.png')} renderingMode="template" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="explore" labelVisibilityMode="selected">
                <NativeTabTrigger.Label>Explore</NativeTabTrigger.Label>
                <NativeTabs.Trigger.Icon
                    renderingMode="template"
                    src={require('@/assets/images/tabIcons/explore.png')}
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
