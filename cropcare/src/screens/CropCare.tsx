import {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {processImageURL} from '../config';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import ChatboxModal from '../components/ChatboxModal';

import {RootStackProps} from '../App';
import axios from 'axios';

type CropCareProps = NativeStackScreenProps<RootStackProps, 'CropCare'>;

const SelectImage = ({navigation}: CropCareProps) => {
  const [loading, setLoading] = useState(false);
  const [isChatboxModalVisible, setIsChatboxModalVisible] = useState(false);

  const handleCaptureFromCamera = async () => {
    const result = await launchCamera({mediaType: 'photo', saveToPhotos: true});

    handleImagePick(result);
  };

  const handleChooseFromGalery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });
    handleImagePick(result);
  };

  const uploadImage = async (image: any) => {
    setLoading(true); // Show loader
    try {
      const formData = new FormData();
      formData.append('image_file', {
        uri: image?.uri,
        type: image?.type,
        name: image?.fileName,
      });

      const response = await axios.post(processImageURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data; // Return response data
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error to be handled by the caller if needed
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleImagePick = async (imagePickerResponse: ImagePickerResponse) => {
    if (!imagePickerResponse.didCancel && !imagePickerResponse.errorCode) {
      if (
        imagePickerResponse.assets != undefined &&
        imagePickerResponse.assets.length > 0
      ) {
        try {
          const responseData = await uploadImage(imagePickerResponse.assets[0]);
          if (responseData) {
            console.log("🚀 ~ handleImagePick ~ responseData:", responseData)
            setLoading(false); // Hide loader
            navigation.navigate('GenerateDescription', {
              imageUri: responseData?.image_path,
              description: responseData?.Description,
              disease:responseData?.disease,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const toggleChatboxModal = () => {
    setIsChatboxModalVisible(!isChatboxModalVisible);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        position: 'relative',
      }}>
      <Text
        style={{
          marginVertical: 40,
          fontSize: 20,
          fontWeight: 'bold',
        }}>
        Select Image
      </Text>

      <View style={{rowGap: 20}}>
        <TouchableOpacity
          onPress={handleCaptureFromCamera}
          style={{
            width: 300,
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: 'row',
            columnGap: 10,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          <FeatherIcon name="camera" size={20} />
          <Text style={{fontWeight: 'bold'}}>Capture From Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleChooseFromGalery}
          style={{
            width: 300,
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: 'row',
            columnGap: 10,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          <FontAwesomeIcon name="photo" size={20} />
          <Text style={{fontWeight: 'bold'}}>From Gallery</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={toggleChatboxModal}
        style={{
          backgroundColor: '#000',
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <IoniconsIcon name="chatbox-ellipses" size={40} color="#fff" />
      </TouchableOpacity>

      <ChatboxModal
        isChatboxModalVisible={isChatboxModalVisible}
        toggleChatboxModal={toggleChatboxModal}
      />

      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#000000',
            opacity: 0.7,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              borderRadius: 8,
              padding: 8,
              backgroundColor: '#ffffff',
            }}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={{textAlign: 'center', fontSize: 22, color: '#000000'}}>
              Hold on tight! we are processing the image
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default SelectImage;
