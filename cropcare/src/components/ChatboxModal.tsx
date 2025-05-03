import React from 'react';
import Modal from 'react-native-modal';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import {askQuestionURL} from '../config';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

type ChatboxModalProps = {
  isChatboxModalVisible: boolean;
  toggleChatboxModal: () => void;
};

const ChatboxModal = ({
  isChatboxModalVisible,
  toggleChatboxModal,
}: ChatboxModalProps) => {
  const scrollViewRef = React.useRef<any>();
  const [inputMessage, setInputMessage] = React.useState('');
  const [messages, setMessages] = React.useState<any>([]);
  const [askQuestionLoader, setAskQuestionLoader] = React.useState(false);

  const postQuestion = async () => {
    try {
      setAskQuestionLoader(true);
      const formData = new FormData();
      formData.append('question', inputMessage);

      const response = await axios.post(askQuestionURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response) setAskQuestionLoader(false);
      return response.data;
    } catch (error) {
      console.error('Error:', JSON.stringify(error));
      throw error;
    } finally {
      setAskQuestionLoader(false);
    }
  };

  const handleMessageSubmit = async () => {
    try {
      const response = await postQuestion();
      if (response) {
        Keyboard.dismiss();
        setMessages((prevMessages: any) => [
          ...prevMessages,
          {question: inputMessage, answer: response?.result},
        ]);
        setInputMessage('');
        if (scrollViewRef.current) {
          scrollViewRef?.current?.scrollToEnd({animated: true});
        }
      }
    } catch (error) {
      console.log('🚀 ~ handleMessageSubmit ~ error:', error);
    } finally {
      setInputMessage('');
    }
  };

  return (
    <Modal
      isVisible={isChatboxModalVisible}
      onBackdropPress={toggleChatboxModal}
      onBackButtonPress={toggleChatboxModal}
      style={{margin: 0, justifyContent: 'flex-end'}}>
      <View
        style={{
          height: 400,
          padding: 20,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          backgroundColor: '#fff',
        }}>
        <View style={{alignItems: 'center', position: 'relative'}}>
          <TouchableOpacity
            onPress={toggleChatboxModal}
            style={{position: 'absolute', left: 12, top: 5}}>
            <AntDesignIcon name="arrowleft" size={20} />
          </TouchableOpacity>

          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Chat Box</Text>
        </View>

        {messages?.length > 0 ? (
          <ScrollView
            ref={scrollViewRef}
            style={{flex: 1, padding: 8, marginBottom: 10}}
            showsVerticalScrollIndicator={false}>
            {messages?.map((data: any, index: number) => {
              return (
                <View style={{marginBottom: 10}} key={index}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: '#050505',
                    }}>
                    {data?.question}
                  </Text>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>
                    {data?.answer}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 20}}>How can I help you today?</Text>
          </View>
        )}

        <View
          style={{
            padding: 3,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            borderWidth: 1,
            borderRadius: 100,
          }}>
          <TextInput
            placeholder="Type here..."
            style={{paddingLeft: 20, flex: 1}}
            value={inputMessage}
            onChangeText={newText => setInputMessage(newText)}
          />
          <TouchableOpacity
            onPress={handleMessageSubmit}
            style={{
              width: 60,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              backgroundColor: '#000',
            }}>
            {askQuestionLoader ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <AntDesignIcon name="arrowright" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChatboxModal;
