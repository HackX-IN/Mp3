const { NavigationContainer } = require("@react-navigation/native");
const {
  createNativeStackNavigator,
} = require("@react-navigation/native-stack");
import HomeScreen from "../Pages/HomeScreen";
import DetailsScreen from "../Pages/DownloadScreen";

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="Downloads"
          component={DetailsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
