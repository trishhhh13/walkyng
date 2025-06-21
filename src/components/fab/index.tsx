import React from 'react'
import { TouchableOpacity } from 'react-native'
import { styles } from "./styles";
import Icon from "react-native-vector-icons/Ionicons";

const FAB = ({ onPress=() => {}, icName="home"}) => {
  return (
    <TouchableOpacity
      style={styles.fab}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Icon name={icName} color="white" size={18} />
    </TouchableOpacity>
  )
}

export default FAB
