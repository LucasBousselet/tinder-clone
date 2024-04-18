import { NavigationContainer } from '@react-navigation/native';
import useAuth, { AuthProvider } from './hooks/useAuth';
import StackNavigator from './components/StackNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <AuthProvider>
          <StackNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}