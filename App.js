import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import { Logs } from "expo";
import { Fontisto } from "@expo/vector-icons";

Logs.enableExpoCliLogging();

const API_KEY = "29f1ec913064172d18dabb3a2baaea26";
const windowWidth = Dimensions.get("window").width;
const Icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};
export default function App() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [days, setDays] = useState([]);
  const [city, setCity] = useState("Loading...");
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 6 });
      const location = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      setCity(location[0].region);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
      );
      const json = await response.json();
      setDays(json.daily);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityText}>{city}</Text>
      </View>
      <ScrollView
        style={styles.temp}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {days.length === 0 ? (
          <View style={{ flex: 1 }}>
            <ActivityIndicator
              size="small"
              color="white"
              style={styles.infoLoading}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View style={styles.info} key={index}>
              <Text style={{ color: "white", fontSize: 32 }}>
                {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.temp}>
                    {parseFloat(day.temp.day).toFixed(0)}
                  </Text>
                  <Text style={{ color: "white", fontSize: 30, marginTop: 30 }}>
                    ° ⁣C
                  </Text>
                </View>

                <Fontisto
                  name={Icons[day.weather[0].main]}
                  size={100}
                  color="white"
                />
              </View>

              <Text style={{ color: "white", fontSize: 35, marginBottom: 3 }}>
                {day.weather[0].main}
              </Text>
              <Text style={{ color: "white", fontSize: 20 }}>
                {day.weather[0].description}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#006CBA",
  },
  city: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  cityText: {
    fontSize: 40,
    marginTop: 30,
    color: "white",
  },
  infoLoading: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth,
  },
  info: {
    width: windowWidth,
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    color: "white",
    fontSize: 100,
    marginVertical: 20,
  },
});
