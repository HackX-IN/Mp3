import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
const HomeScreen = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const extractVideoId = async () => {
    const videoIdArray = youtubeUrl.match(/\/([^/?]+)$/);

    if (videoIdArray && videoIdArray.length > 1) {
      const id = videoIdArray[1];
      try {
        const response = await axios.get(
          `https://youtube-mp36.p.rapidapi.com/dl?id=${id}`, // Replace with correct API endpoint
          {
            headers: {
              "X-RapidAPI-Key":
                "2d3f5818c1msh69e77c05e462559p147f29jsna784dc4e0ba5",
              "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
            },
          }
        );
        console.log(response.data.link);
        setLink(response.data.link);
      } catch (error) {
        console.error("Error fetching video link:", error);
      }
    } else {
      console.log("No valid video ID found.");
    }
  };
  // async function playSound() {
  //   try {
  //     const { sound } = await Audio.Sound.createAsync({ uri: link });
  //     if (sound) {
  //       if (isPlaying) {
  //         console.log("Pausing Sound");
  //         await sound.pauseAsync();
  //       } else {
  //         console.log("Loading Sound");
  //         await sound.playAsync();
  //       }
  //       setIsPlaying(!isPlaying);
  //     }
  //   } catch (error) {
  //     console.error("Error loading sound:", error);
  //   }
  // }

  // useEffect(() => {
  //   async function loadSound() {
  //     if (link) {
  //       const { sound } = await Audio.Sound.createAsync({ uri: link });
  //       setSound(sound);
  //     }
  //   }

  //   loadSound();
  // }, [link]);
  // let isDownloadInProgress = false;

  const mp3Url = link;
  const filename = mp3Url.split("/").pop();
  const fileUri = FileSystem.documentDirectory + filename;

  const downloadAndSaveMP3 = async () => {
    try {
      if (Platform.OS === "android") {
        const permissionResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );

        if (permissionResult !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Permission denied. Cannot save MP3 file.");
          return;
        }
      }

      setLoading(true);
      const downloadResult = await FileSystem.downloadAsync(mp3Url, fileUri);

      if (downloadResult.status === 200) {
        const Permissions = await MediaLibrary.requestPermissionsAsync();
        if (Permissions.granted === false) {
          return;
        } else {
          const asset = await MediaLibrary.createAssetAsync(fileUri);
          console.log(asset);
          Keyboard.dismiss();
          setLink("");
          setYoutubeUrl("");

          if (Platform.OS === "android") {
            ToastAndroid.show(
              "MP3 file downloaded and saved to media library!",
              ToastAndroid.SHORT
            );
          } else {
            Alert.alert("MP3 file downloaded and saved to media library!");
          }
          setLoading(false);
        }
      } else {
        if (Platform.OS === "android") {
          ToastAndroid.show("Failed to download MP3 file.", ToastAndroid.SHORT);
        } else {
          Alert.alert("Failed to download MP3 file.");
        }
      }
    } catch (error) {
      console.error("Error downloading or saving MP3:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "purple" }}>
      <View
        style={{
          marginTop: 6,
          padding: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 5,
          }}
        >
          Youtube Video to mp3 Converter
        </Text>
        <View className="w-[100%] py-2 px-3 rounded-2xl flex-row justify-between items-center bg-white mt-5">
          <TextInput
            placeholder="Enter the link"
            style={{
              padding: 3,
              borderRadius: 10,
              width: "80%",
            }}
            value={youtubeUrl}
            onChangeText={(text) => setYoutubeUrl(text)}
          />
          <TouchableOpacity onPress={extractVideoId}>
            <Ionicons name="search-outline" color={"black"} size={22} />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mt-5 ">
          {link && (
            <>
              <Text className="text-lg text-white font-bold text-center ">
                Mp3 is ready to download!
              </Text>
              <Pressable
                style={{
                  backgroundColor: "black",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 25,
                  marginLeft: 10,
                }}
                onPress={downloadAndSaveMP3}
              >
                {loading ? (
                  <ActivityIndicator size={22} color="white" />
                ) : (
                  <Ionicons
                    name="cloud-download-outline"
                    size={24}
                    color="white"
                  />
                )}
              </Pressable>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
