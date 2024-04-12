import { NavigationContainer } from '@react-navigation/native';
import useAuth, { AuthProvider } from './hooks/useAuth';
import StackNavigator from './components/StackNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}