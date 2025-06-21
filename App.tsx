import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapDashboard from "./src/screens/mapDashboard"
import History from "./src/screens/history"
import TabBar from './src/components/tabBar';
import { Storage } from "./src/services/storage";

const Tab = createBottomTabNavigator();

function App() {

  useEffect(() => {
    Storage.startInstance();
  }, [])

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: (props) => <TabBar route={route} {...props} />,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: "#111", paddingTop: 10, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderRadius: 1, borderColor: "#111" },
          tabBarActiveTintColor: "purple",
          swipeEnabled: true,
        })}
      >
        <Tab.Screen name="Dashboard" component={MapDashboard} />
        <Tab.Screen name="HistoryScreen" component={History} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
