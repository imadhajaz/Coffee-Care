import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//screens
import CropCare from './screens/CropCare';
import GenerateDescription from './screens/GenerateDescription';

export type RootStackProps = {
  CropCare: undefined;
  GenerateDescription: {imageUri: string; description: string; disease: string};
};

const Stack = createNativeStackNavigator<RootStackProps>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CropCare"
        screenOptions={{
          headerShadowVisible: false,
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="CropCare"
          component={CropCare}
          options={{
            title: 'CropCare',
          }}
        />
        <Stack.Screen
          name="GenerateDescription"
          component={GenerateDescription}
          options={{
            title: 'Generate Description',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
