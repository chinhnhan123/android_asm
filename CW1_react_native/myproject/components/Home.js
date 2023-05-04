import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableHighlight,
  FlatList,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { ListItem } from "@rneui/themed";
function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

const Home = ({ navigation }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      // The screen is focused
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Trip2", [], (tx, results) => {
          let data = results.rows.length;
          let users = [];
          for (let i = 0; i < data; i++) {
            users.push(results.rows.item(i));
          }
          setItems(users);
        });
      });
    });
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() =>
            Alert.alert(
              "Delete",
              "Do you want to delete all trip?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Ok",
                  onPress: () => {
                    db.transaction((tx) => {
                      tx.executeSql("DELETE FROM Trip2");
                    });
                    setItems([]);
                  },
                },
              ],
              { cancelable: false }
            )
          }
          title="Delete"
        />
      ),
    });
  }, [navigation]);

  const onClick = () => {
    navigation.navigate("AddTrip");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <ListItem
              bottomDivider
              onPress={() => {
                navigation.navigate("UpdateTrip", item);
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                {" "}
                {item.ID}
              </Text>
              <View style={{ width: 100 }}>
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                  {item.NameTrip}
                </Text>
                <Text>{item.Destination}</Text>
              </View>
              <ListItem.Content>
                <ListItem.Title>{item.DayofTheTrip}</ListItem.Title>
                <ListItem.Subtitle>
                  Risks Assessment:{" "}
                  {item.RequireRisksAssessment == 1 ? "Yes" : "No"}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
        />
      </View>
      <View style={{ position: "absolute", right: 30, bottom: 50 }}>
        <Button onPress={onClick} title="Add" style={{ width: 50 }}></Button>
      </View>
    </SafeAreaView>
  );
};

export default Home;
