import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from "./styles";
import FAB from '../../components/fab';
import { formatDuration } from '../../utils/geoUtils';
import { Storage } from "../../services/storage"

function HistoryList({ navigation = { navigate: (_nm: string, _params: any) => { } } }) {
  const [walks, setWalks] = useState([]);

  // Async function to get walk history
  const getWalkHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('walk_history');
      if (data !== null) {
        const history = JSON.parse(data);
        setWalks(history);
        return history;
      } else {
        setWalks([]);
        return [];
      }
    } catch (error) {
      console.error('⚠️ Error reading walk history:', error);
      setWalks([]);
      return [];
    }
  };

  // useEffect to run on mount
  useEffect(() => {
    const fetchHistory = async () => {
      await getWalkHistory();
    };

    fetchHistory();
  }, []);

  const deleteWalk = async (id: number) => {
    Storage.instance.deleteWalkData(id, (updatedVal) => {

      setWalks(updatedVal);
    })
  };


  return (
    <View style={styles.container}>
      <FAB icName={"reload-sharp"} onPress={getWalkHistory} />
      {(!walks || !walks.length) ? <View style={styles.emptyState}>
        <Icon name="walk" size={40} color="gray" />
        <Text style={styles.emptyText}>No walks found</Text>
        <Text style={styles.emptySubText}>Start recording a walk to see it here.</Text>
      </View> :
        <View style={styles.walksList}>
          {walks.map((walk: { path: any, id: number, timestamp: number }) => {
            const start = walk.path[0].timestamp;
            const end = walk.path[walk.path.length - 1].timestamp;
            const durSec = Math.floor((end - start) / 1000);
            return <TouchableOpacity activeOpacity={0.8} style={styles.walkItem} onPress={() => {
              navigation.navigate("PastWalk", { path: walk.path })
            }} key={walk.id}>
              <View>
                <Text style={styles.walkText}>🗓️   {new Date(walk.timestamp).toLocaleString()}</Text>
                <Text style={styles.walkText}>📍   Duration: {formatDuration(durSec)}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteWalk(walk.id)} key={walk.id}>
                <Icon name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          })}
        </View>}
    </View>
  );
}

export default HistoryList;
