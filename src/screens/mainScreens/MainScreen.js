import { View, Text, BackHandler, Alert } from "react-native";
import React, { useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../homeScreens/HomeScreen";
import EntertaimentScreen from "../entertainmentScreens/EntertaimentScreen";
import NotificationScreen from "../notificationScreens/NotificationScreen";
import ProfileScreen from "../profileScreens/ProfileScreen";

import colors from "../../colors/color";
import CustomButton from "../../components/button/CustomButton";
import { StatusBar } from "expo-status-bar";
import MenuScreen from "../MenuScreen";

export var userId;

const MainScreen = ({ navigation, route }) => {
  userId = route.params.idUser;

  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            size = focused ? 28 : 24;
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home-sharp" : "home-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person-circle" : "person-circle-outline";
              size += 2;
            } else if (route.name === "Notification") {
              iconName = focused
                ? "notifications-sharp"
                : "notifications-outline";
            } else if (route.name === "Feedback") {
              iconName = focused ? "play-circle-sharp" : "play-circle-outline";
            } else if (route.name === "Menu") {
              iconName = "menu";
              size+=2;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarLabel: ({ focused, color, size }) => {
            color = focused ? colors.white : colors.color4;
            return (
              <Text
                style={{
                  fontSize: 12,
                  color: color,
                  fontFamily: "AndikaNewBasic",
                }}
              >
                {route.name}
              </Text>
            );
          },
          tabBarActiveTintColor: colors.color3,
          tabBarInactiveTintColor: colors.white,
          tabBarStyle: { backgroundColor: colors.color4 },
        })}
      >
        <Tab.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              stackNavigation={navigation}
              userId={userId}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Feedback" component={EntertaimentScreen} />
        {/* <Tab.Screen name="Notification" component={NotificationScreen} /> */}
        <Tab.Screen name="Profile">
            {(props)=> <ProfileScreen {...props} stackNavigation={navigation} userId={userId} />}
        </Tab.Screen>
        <Tab.Screen name="Menu">
          {(props) => <MenuScreen {...props} stackNavigation={navigation} userId={userId}/>}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainScreen;
