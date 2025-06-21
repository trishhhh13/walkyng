import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ICON_MAP: any = {
  "Dashboard": "home",
  "HistoryScreen": "timer"
}

const TabBar = ({ route={ name: "Default" }, focused=false }) => {
  let iconName = ICON_MAP[route.name];

  if (!focused) iconName += '-outline';
  return (
    <View>
      <Icon name={iconName} color={"purple"} size={24}/>
    </View>
  )
}

export default TabBar
