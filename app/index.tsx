import { View, Text, Pressable } from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset"


async function writeImage() {
  const uri = Asset.fromModule(require("@/assets/images/matt-gross-9aCkSl6YcXg-unsplash.jpg")).uri;
  const path = FileSystem.documentDirectory + "image.png";

  const start = performance.now()
  console.log("write image", start);
  try {
    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      path,
      {},
      (data) => console.log("write image progress", data)
    );
    await downloadResumable.downloadAsync();
    console.log("done writing image");
  } catch (e) {
    console.log("error writing image", e);
  }
  const writeImageTime = performance.now() - start;

  return writeImageTime;
}

async function readImage(position?: number, length?: number) {
  const path = FileSystem.documentDirectory + "image.png";

  const start = performance.now()
  const b64String = await FileSystem.readAsStringAsync(path, {
    encoding: FileSystem.EncodingType.Base64,
    position,
    length
  });
  const readImageTime = performance.now() - start;

  return readImageTime;
}

export default function App() {
  return <View style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
    <Pressable onPressIn={() => {
      writeImage().then(d => console.log("write image time", d)).catch(e => console.log("error writing image", e))
    }}
      style={{ padding: 16, backgroundColor: "coral" }}
    >
      <Text>write image perf</Text>
    </Pressable>

    <Pressable onPressIn={() => {
      for (let i = 0; i < 20; ++i) {
        readImage(undefined, undefined).then(d => console.log("read image time", i, d)).catch(e => console.log("error reading image", i, e))
      }
    }}
      style={{ padding: 16, backgroundColor: "teal" }}
    >
      <Text>read full image perf</Text>
    </Pressable>

    <Pressable onPressIn={() => {
      for (let i = 0; i < 20; ++i) {
        readImage(0, 1024 * 256).then(d => console.log("read image time", i, d)).catch(e => console.log("error reading image", i, e))
      }
    }}
      style={{ padding: 16, backgroundColor: "teal" }}
    >
      <Text>read image 256kb perf</Text>
    </Pressable>

    <Pressable onPressIn={() => {
      // for (let i = 0; i < 20; ++i) {
      Promise.allSettled([
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
        readImage(0, 1024 * 256),
      ]).then(d => console.log("data", d.map(res => res.status === "fulfilled" ? res.value : res.reason))).catch(e => console.log("error", e));
      // }
    }}
      style={{ padding: 16, backgroundColor: "teal" }}
    >
      <Text>read image 256kb perf Promise.allSettled</Text>
    </Pressable>
  </View>;
}


