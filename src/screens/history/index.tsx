import React from 'react';
import { View } from "react-native"
import HistoryList from "../historyList"
import PreviousRide from "../previousWalk"

import { styles } from "./styles";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function History() {

  return (
    <Stack.Navigator screenOptions={{
      headerTintColor: "#fff",
      headerBackground: () => <View style={styles.stackContainer}/>
    }}>
      <Stack.Screen name="History" component={HistoryList}/>
      <Stack.Screen name="PastWalk" component={PreviousRide} options={{ title: "Past Walk" }}/>
    </Stack.Navigator>
  );
}


export default History;
