import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, PermissionsAndroid, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation İzni',
          message: 'Konum İzni Vere Bilirmisiniz?',
          buttonNeutral: 'Daha Sonra Sor',
          buttonNegative: 'Iptal Et',
          buttonPositive: 'Kabul Et',
        },
      );
      console.log('granted', granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('GeoLocation Kullana Bilirsiniz');
        return true;
      } else {
        console.log('Gelocation Kullanamazsiniz');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};

export default function Favorilerim() {
  const [location, setLocation] = useState(null);

  const findCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Izin Redd Edildi ', 'Lokasyon izni gerekli bu ozellik icin');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Lokasyon Alindi:', position);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      (error) => {
        console.warn('Geolocation Hatasi:', error);
        Alert.alert('Lokasyon Hatasi', error.message);
        setLocation(null);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    findCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hoş Geldiniz!</Text>
      <MapView 
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
        onRegionChangeComplete={(region) => setLocation(region)}
      >
        {location && (
          <Marker coordinate={location} />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button
          title="Mevcut Konumumu Bul"
          onPress={findCurrentLocation}
        />
      </View>
      <Text style={styles.locationText}>Enlem: {location ? location.latitude : 'Konum alınamadı'}</Text>
      <Text style={styles.locationText}>Boylam: {location ? location.longitude : 'Konum alınamadı'}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Konumu Gönder" onPress={() => Alert.alert('Konum', `Enlem: ${location ? location.latitude : 'N/A'}, Boylam: ${location ? location.longitude : 'N/A'}`)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '50%',
  },
  buttonContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
  },
  locationText: {
    fontSize: 16,
    marginTop: 10,
  },
});

