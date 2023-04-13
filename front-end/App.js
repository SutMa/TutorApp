import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HOME_ROUTES, AUTH_ROUTES } from './Routes';

import Ionicons from '@expo/vector-icons/Ionicons';
import Login from './UserAuth/Login';
import CreateAcc from './UserAuth/CreateAcc';
import Home from './View/Home';
import Profile from './View/Profile';
import Calendar from './View/Calendar';

const Stack = createStackNavigator();

function Root() {
  const Tab = createBottomTabNavigator();

  return(
    <Tab.Navigator
          screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const routeName = route.name;
            // NOTE: default to home
            let iconName;

            switch(routeName) {
              case HOME_ROUTES.HOME:
                iconName = 'md-home';
                break;
              case HOME_ROUTES.CALENDAR:
                iconName = 'md-calendar';
                break;
              case HOME_ROUTES.PROFILE:
                iconName = 'md-settings';
                break;
              default:
                console.error('invalid home route');
            }

            return <Ionicons name={iconName} size={size} focused={focused} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}>
      <Tab.Screen name={HOME_ROUTES.HOME} component={Home} options={{ unmountOnBlur: true}} />
      <Tab.Screen name={HOME_ROUTES.CALENDAR} component={Calendar} options={{ unmountOnBlur: true}} />
      <Tab.Screen name={HOME_ROUTES.PROFILE} component={Profile} options={{ unmountOnBlur: true}} />      
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen name={AUTH_ROUTES.LOGIN} component={Login} options={{ headerShown: false }}/>
          <Stack.Screen name={AUTH_ROUTES.CREATE_ACCOUNT} component={CreateAcc} options={{ headerShown: false }}/>
          <Stack.Screen name={AUTH_ROUTES.ROOT} component={Root} options={{ headerShown: false }}/>
        </Stack.Group>
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
