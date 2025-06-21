import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./styles";
import { getDistanceInKm, formatDuration, requestLocationPermission } from "../../utils/geoUtils";
import FAB from "../../components/fab";
import { Storage } from "../../services/storage";

export default function Dashboard() {
  const mapRef = useRef(null);

  const [watchId, setWatchId] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [topSpeed, setTopSpeed] = useState(0);

  const startRecording = async () => {
    const granted = await requestLocationPermission();
    if (!granted) return;

    setStartTime(Date.now());
    setTopSpeed(0);

    const id = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords;
        const timestamp = Date.now();
        const newCoord = { latitude, longitude, timestamp, speed };

        setCoordinates((prev) => [...prev, newCoord]);

        if (speed != null && !isNaN(speed)) {
          setTopSpeed((prev) => Math.max(prev, speed));
        }

        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(newRegion, 1000);
      },
      (error) => console.warn("Location Error:", error),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 5000,
      }
    );

    setWatchId(id);
  };

  const stopRecording = async () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);

      Storage.instance.saveWalkData(coordinates, () => {

        setCoordinates([]);
        setStartTime(null);
        setTopSpeed(0);
      })

    }
  };

  const recenter = async () => {
    const granted = await requestLocationPermission();
    if (!granted) return;

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords;
        const timestamp = Date.now();
        const newCoord = { latitude, longitude, timestamp, speed };

        setCoordinates((prev) => [...prev, newCoord]);

        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(newRegion, 1000);
      },
      (error) => console.warn("Failed to recenter:", error),
      { enableHighAccuracy: true }
    );
  };

  const lastCoord = coordinates.at(-1);
  const durationSec = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const distanceKm = coordinates.reduce((acc, curr, i, arr) => {
    if (i === 0) return 0;
    const prev = arr[i - 1];
    return acc + getDistanceInKm(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
  }, 0);

  const currentSpeed = lastCoord?.speed || 0;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 20.5937,
          longitude: 78.9629,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        onMapReady={recenter}
      >
        {coordinates.length > 0 && (
          <>
            <Polyline coordinates={coordinates} strokeColor="purple" strokeWidth={4} />
            {lastCoord && (
              <Marker
                coordinate={{
                  latitude: lastCoord.latitude,
                  longitude: lastCoord.longitude,
                }}
                pinColor="purple"
              />
            )}
          </>
        )}
      </MapView>

      {watchId && (
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>⏱ Duration: {formatDuration(durationSec)}</Text>
          <Text style={styles.infoText}>📏 Distance: {distanceKm.toFixed(2)} km</Text>
          <Text style={styles.infoText}>🚀 Top Speed: {topSpeed.toFixed(2)} km/h</Text>
          <Text style={styles.infoText}>🐢 Current: {currentSpeed.toFixed(2)} km/h</Text>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.recordBtn}
          onPress={watchId ? stopRecording : startRecording}
        >
          <Icon name={watchId ? "stop" : "play"} color="white" size={20} />
          <Text style={styles.recordText}>
            {watchId ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>

      </View>
        <FAB icName="locate-sharp" onPress={recenter}/>
    </View>
  );
}
