import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import Checkbox from "expo-checkbox";
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
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as SQLite from "expo-sqlite";
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

export default function UpdateTrip({ route, navigation }) {
  const [isChecked, setChecked] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  let data = {};
  const item = route.params;

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  };

  const onChangedate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let newDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    setText(newDate);
  };
  console.log(text);
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (item.RequireRisksAssessment == "1") {
      setChecked(true);
      setText(item.DayofTheTrip);
    }
  }, []);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() =>
            Alert.alert(
              "Delete",
              "Do you want to delete this trip?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Ok",
                  onPress: () => {
                    db.transaction((tx) => {
                      tx.executeSql("DELETE FROM  Trip2 where ID=?", [item.ID]);
                    });
                    navigation.navigate("Home");
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

  const onSubmitUpdate = (value) => {
    if (value.nameTrip == null) {
      Alert.alert(
        "Requied!!",
        "NameTrip is empty! Please enter. ",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
      return;
    }
    if (value.destination == null) {
      Alert.alert(
        "Requied!!",
        "Destination is empty! Please enter. ",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
      return;
    }
    if (text == "") {
      Alert.alert(
        "Requied!!",
        "Day of the trip is empty! Please enter. ",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
      return;
    }
    if (isChecked)
      data = { ...value, requireRisksAssessment: true, dayofTheTrip: text };
    else data = { ...value, requireRisksAssessment: false, dayofTheTrip: text };

    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Trip2 set NameTrip=? , Destination=? , DayofTheTrip=? , Description=? , RequireRisksAssessment=? where ID=?",
        [
          data.nameTrip,
          data.destination,
          data.dayofTheTrip,
          data.description,
          data.requireRisksAssessment,
          item.ID,
        ],
        (tx, results) => {
          console.log("Results", results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              "Success",
              " updated successfully",
              [
                {
                  text: "Ok",
                  onPress: () => navigation.navigate("Home"),
                },
              ],
              { cancelable: false }
            );
          } else alert("Updation Failed");
        }
      );
    });

    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Name</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              defaultValue={item.NameTrip.toString()}
              autoCapitalize="sentences"
            />
          )}
          name="nameTrip"
        />

        <Text style={styles.label}>Destination</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              defaultValue={item.Destination.toString()}
            />
          )}
          name="destination"
        />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.label}>Day of the trip</Text>
          <View
            style={{ marginTop: 10, height: 40, width: 100, borderRadius: 4 }}
          >
            <Button
              style={{ width: 50 }}
              color="#f4511e"
              title="DatePicker"
              onPress={() => showMode("date")}
            />
          </View>
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChangedate}
          ></DateTimePicker>
        )}
        <TextInput
          defaultValue={item.DayofTheTrip.toString()}
          style={styles.input}
          value={text}
          maxLength={20}
        />

        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                backgroundColor: "white",
                borderColor: "none",
                height: 40,
                padding: 5,
                borderRadius: 4,
                height: 100,
                textAlignVertical: "top",
              }}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              defaultValue={item.Description?.toString()}
            />
          )}
          name="description"
        />

        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#4630EB" : undefined}
            name="checked"
          />
          <Text style={styles.paragraph}>Require Risks Assessment </Text>
        </View>

        <TouchableHighlight style={{ flex: 1, alignItems: "center" }}>
          <View style={styles.button}>
            <View style={{ marginRight: 20 }}></View>
            <Button
              //style={{ backgroundColor: "red" }}
              color="#f4511e"
              title="Button"
              onPress={handleSubmit(onSubmitUpdate)}
            />
          </View>
        </TouchableHighlight>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#181818",
    margin: 20,
    marginLeft: 0,
  },
  text_err: {
    color: "red",
    marginLeft: 5,
  },
  button: {
    marginTop: 20,
    color: "#181818",
    height: 40,
    width: 150,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // paddingTop: Constants.statusBarHeight,
    padding: 20,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#F2F2F2",
  },
  input: {
    backgroundColor: "white",
    borderColor: "none",
    height: 40,
    padding: 5,
    borderRadius: 4,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    border: "4px solid",
    margin: 8,
  },
});
