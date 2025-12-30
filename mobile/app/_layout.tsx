import { Stack } from 'expo-router';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF0000',
    secondary: '#FFCC00',
  },
};

export default function RootLayout() {

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    //   <Stack>
    //     {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    //     <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
    //   </Stack>
    //   <StatusBar style="auto" />
    // </ThemeProvider>

    <PaperProvider theme={theme}>
      {/* tambahkan SafeAreaView */}
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: '#a51c31'
      }}>
        {/* hilangkan header */}
        <Stack screenOptions={{
          headerShown: false
        }}></Stack>

        {/* buat status bar */}
        <StatusBar barStyle={"light-content"} backgroundColor={"#a51c31"} />
      </SafeAreaView>
    </PaperProvider>

  );
}
