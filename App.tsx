import React, { useState } from "react";
import { NativeBaseProvider, Box, Button, Center, Text, Input, Avatar, Badge, Container, Heading, Modal, ZStack } from "native-base";
import { Alert, Image, StyleSheet, View, Linking, ScrollView } from "react-native";
import axios from "axios";
import moment from "moment";

export default function App() {

  const URL = "https://api.github.com/users/";

  const [text, setText] = useState("...");
  const [nome, setNome] = useState("-");
  const [imgAvatar, setImgAvatar] = useState("https://reactnative.dev/img/tiny_logo.png");
  const [qtdSeguidores, setQtdSeguidores] = useState(0);
  const [dataCriado, setDataCriado] = useState("-");
  const [urlPerfil, setUrlPerfil] = useState("-");
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const enviarMensagem = () => {
    if(text.length > 0){
    Alert.alert(`Mensagem enviada: ${text}`)
    }
  }

  const obterDetalhesUserGit = async () => {
    try {

      const nomeId = text;

      const response: any = await axios.get(`${URL}${nomeId}`);
      const data: any = response.data;
      
      setNome(data.name);
      setImgAvatar(data.avatar_url);
      setQtdSeguidores(data.following);
      setDataCriado(moment(data.created_at).format("DD/MM/YYYY HH:mm:ss"));
      setUrlPerfil(data.html_url);

      const responseEvents: any = await axios.get(`${URL}${nomeId}/events`);
      const dataEvents: any = responseEvents.data;

      setEventos(dataEvents);

      console.log("Dados obtidos com sucesso!");
      console.log("Eventos obtidos!")
      
    } catch (error) {
      console.log(error);
    }
  }

  const styles = StyleSheet.create({
    container: {
      marginTop: 40,
      padding: 20,
      display: "flex",
      width: "80%",
      backgroundColor: "#e5e5e5",
      alignItems: "center",
      borderRadius: 10
    },
    container2: {
      marginTop: 10,
      minHeight: 200,
      maxHeight: 200,
      padding: 20,
      display: "flex",
      width: "100%",
      backgroundColor: "#8b8b8b1f",
      borderRadius: 10
    },
    tinyLogo: {
      width: 50,
      height: 50,
    },
    logo: {
      width: 66,
      height: 58,
    },
    eventosSobre: {
      display: "flex",
      textAlign: 'left',
      width: "80%",
      marginTop: 20
    }
  });

  return (
    <NativeBaseProvider>
      <Center>

        <Container marginTop={5}>
          <Heading textAlign='center'>
            GitHub perfil - dados
            <Text color="blue.500"> React Native</Text>
          </Heading>
        </Container>

          <Input 
          mx="3" 
          maxLength={20}
          marginBottom={4} 
          marginTop={4}
          onChangeText={text => setText(text)} 
          placeholder="Id do GitHub..." 
          w="80%" />
          <Button shadow={2} onPress={() => {
            obterDetalhesUserGit();
          }}>
            Pesquisar
          </Button>

          <View style={styles.container}>
            <Avatar 
            bg="green.500"
            style={styles.tinyLogo}
            source={{uri: imgAvatar}}
            />
            <Text>
              Seguidores: {qtdSeguidores}
            </Text>
            <Text>
              Nome: {nome}
            </Text>
            <Text>
              Data de criação: {dataCriado}
            </Text>
            <Button
            size='sm'
            marginTop={2}
            onPress={() => {
              Linking.openURL(urlPerfil);
            }}
            >
              Abrir link do perfil
            </Button>
          </View>

          <Button width='80%' backgroundColor="green.500" marginTop={5} onPress={() => setShowModal(true)}>Ver eventos</Button>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
              _dark: {
              bg: "coolGray.800"
              },
              bg: "warmGray.50"
              }}>
            <Modal.Content maxWidth="350" maxH="400">
              <Modal.CloseButton />
              <Modal.Header>Eventos: {eventos.length}</Modal.Header>
              <Modal.Body>
                <ScrollView style={styles.container2}>
                  {
                    eventos.map((evento: any, index) => (
                      <Container 
                      minW='100%'
                      marginBottom={5}
                      bgColor={"#5252521f"}
                      p={2}
                      key={index}>
                      <Box>
                        {`Tipo do evento: ${evento.type}`}
                      </Box>
                      <Box>
                        {`Repositório: ${evento.repo.name}`}
                      </Box>
                      <Box>
                        {`Criado em: ${moment(evento.created_at).format("DD/MM/YYYY HH:mm:ss")}`}
                      </Box>
                      </Container>
                    ))
                  }
                </ScrollView>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button variant="ghost" backgroundColor="red.100" colorScheme="blueGray" onPress={() => {
                  setShowModal(false);
                }}>
                    Fechar
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
      </Center>
    </NativeBaseProvider>
  );
}

const style = StyleSheet.create({
headerText: {
  backgroundColor: '#eaeaea',
}
});