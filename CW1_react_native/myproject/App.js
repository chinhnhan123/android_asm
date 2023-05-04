import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import AddTrip from "./components/AddTrip";
import UpdateTrip from "./components/UpdateTrip";
import Home from "./components/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Trip 2",
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerRight: () => (
              <Button
                onPress={() => alert("This is a button!")}
                title="Delete"
                StyleSheet={{ backgroundColor: "#fff" }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="AddTrip"
          component={AddTrip}
          options={{
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="UpdateTrip"
          component={UpdateTrip}
          options={{
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerRight: () => (
              <Button
                onPress={() => alert("This is a button!")}
                title="Delete"
                StyleSheet={{ backgroundColor: "#fff" }}
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

App.navigationOptions = (navigation) => {
  return {
    title: "Trip 2",
  };
};
