import React, { useRef, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { styles } from './styles';
import { getDistanceInKm, formatDuration } from '../../utils/geoUtils';
import FAB from '../../components/fab';

interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number;
}

interface Props {
  route: {
    params: {
      path: Coordinate[];
    };
  };
}

const PastWalkScreen: React.FC<Props> = ({ route }) => {
  const mapRef = useRef<MapView>(null);
  const [coordinates] = useState<Coordinate[]>(route.params?.path || []);
  const [topSpeed, setTopSpeed] = useState<string>('0');
  const [totalDistance, setTotalDistance] = useState<string>('0');
  const [duration, setDuration] = useState<string>('00:00:00');

  useEffect(() => {
    if (!coordinates || coordinates.length < 2) return;

    let maxSpeed = 0;
    let distance = 0;

    for (let i = 1; i < coordinates.length; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];

      if (curr.speed && curr.speed > maxSpeed) {
        maxSpeed = curr.speed;
      }

      distance += getDistanceInKm(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );
    }

    const start = coordinates[0].timestamp;
    const end = coordinates[coordinates.length - 1].timestamp;
    const durSec = Math.floor((end - start) / 1000);

    setTopSpeed(maxSpeed.toFixed(2));
    setTotalDistance(distance.toFixed(2));
    setDuration(formatDuration(durSec));
  }, [coordinates]);

  /**
   * Fits the recorded polyline into visible map view.
   */
  const fitPolyline = () => {
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: coordinates[0]?.latitude || 20.5937,
          longitude: coordinates[0]?.longitude || 78.9629,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onMapReady={fitPolyline}
      >
        {coordinates.length > 0 && (
          <>
            <Polyline coordinates={coordinates} strokeColor="purple" strokeWidth={4} />
            <Marker coordinate={coordinates[0]} pinColor="green" />
            <Marker coordinate={coordinates[coordinates.length - 1]} pinColor="red" />
          </>
        )}
      </MapView>

      {/* 📊 Walk Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>🏁 Distance</Text>
          <Text style={styles.statValue}>{totalDistance} km</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>⏱ Duration</Text>
          <Text style={styles.statValue}>{duration}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>⚡️ Top Speed</Text>
          <Text style={styles.statValue}>{topSpeed} m/s</Text>
        </View>
      </View>
      <FAB icName={"expand"} onPress={fitPolyline}/>
    </View>
  );
};

export default PastWalkScreen;
