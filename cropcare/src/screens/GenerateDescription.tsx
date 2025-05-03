import {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import IoniconsIcon from 'react-native-vector-icons/Ionicons';

import ChatboxModal from '../components/ChatboxModal';
import {baseURl} from '../config';

import {RootStackProps} from '../App';

type GenerateDescriptionProps = NativeStackScreenProps<
  RootStackProps,
  'GenerateDescription'
>;

const GenerateDescription = ({route}: GenerateDescriptionProps) => {
  const [diseaseName, setDiseaseName] = useState('');
  console.log('🚀 ~ GenerateDescription ~ setDiseaseName:', diseaseName);
  const imageUri = route.params?.imageUri;
  const fullImageURL = `${baseURl}${imageUri}`;
  const description = route.params?.description;
  const disease = route.params?.disease;

  useEffect(() => {
    const match = disease.match(/Disease Detected:{'([^']+)'}$/);
    if (match) {
      const extractedDisease = match[1]; // Extracted disease name
      setDiseaseName(extractedDisease);
    }
  }, [disease]);

  const [isShowDescription, setIsShowDescription] = useState(false);
  const [isChatboxModalVisible, setIsChatboxModalVisible] = useState(false);

  const toggleChatboxModal = () => {
    setIsChatboxModalVisible(!isChatboxModalVisible);
  };

  const renderDescription = () => {
    setIsShowDescription(true);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        position: 'relative',
      }}>
      <Image
        style={{
          width: 330,
          height: 200,
          objectFit: 'contain',
        }}
        source={{uri: fullImageURL}}
      />
      <Text
        style={{
          marginBottom: 4,
          fontWeight: 'bold',
          color: '#050505',
        }}>
        {diseaseName
          ? `Disease Detected:${diseaseName}`
          : 'No Disease Detected'}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, alignItems: 'center'}}>
          {isShowDescription ? (
            <Text
              style={{
                width: 330,
                marginVertical: 20,
                lineHeight: 25,
                fontSize: 18,
              }}>
              {description}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          alignItems: 'stretch',
          columnGap: 10,
        }}>
        <TouchableOpacity
          onPress={renderDescription}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            backgroundColor: '#000',
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>
            Generate Description
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleChatboxModal}
          style={{
            backgroundColor: '#000',
            width: 60,
            height: 60,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IoniconsIcon name="chatbox-ellipses" size={40} color="#fff" />
        </TouchableOpacity>
      </View>

      <ChatboxModal
        isChatboxModalVisible={isChatboxModalVisible}
        toggleChatboxModal={toggleChatboxModal}
      />
    </View>
  );
};

export default GenerateDescription;
