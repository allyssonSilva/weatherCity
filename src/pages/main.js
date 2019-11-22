import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    RefreshControl,
    StatusBar,
    TextInput,
    Alert,
    Image,
    FlatList,
    Button
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'




class Main extends Component {

    constructor(props) {
        super(props)
        this.state = {
            appid: '1e10fbb311947919778cfb26fce399f0',
            arrayCity: ['3390760', '3396496', '6320490', '3388991', '3405812'],
            appidTest: 'b6907d289e10d714a6e88b30761fae22', //CODIGO API TESTE
            arrayCityTest: ['524901', '703448', '2643743'], // ARRAY TESTE
            addCity: '',
            UltimaAtualizacao: '',
            isLoading: true,
            real: 273.15,
            refreshing: true,
            addItemAPI: '',
            iconWeather: 'weather-cloudy',

        }

        this.regMsg = this.regMsg.bind(this);
    }

    async regMsg() {

        NetInfo.fetch().then(connection => {

            if (connection.isConnected == true) {

                return fetch(`http://api.openweathermap.org/data/2.5/group?id=${this.state.arrayCity}&appid=${this.state.appid}&lang=pt`)

                    /*
                      API OFICIAL
                      http://api.openweathermap.org/data/2.5/group?id=${this.state.arrayCity}&appid=${this.state.appid}&lang=pt
                      
                      API TESTE
                      https://samples.openweathermap.org/data/2.5/group?id=${this.state.arrayCityTest}&units=metric&appid=${this.state.appidTest}

                          <Text style={{ alignSelf: 'center', fontWeight:'bold' }}>{(item.weather[0].description).charAt(0).toUpperCase()+(item.weather[0].description).slice(1)}</Text>

                    */
                    

                    .then((response) => response.json())
                    .then((responseJson) => {

                        const data = new Date();
                        const dia = data.getDate();
                        const mes = data.getMonth();
                        const ano = data.getFullYear();
                        const hora = data.getHours();
                        const min = data.getMinutes();
                        const seg = data.getUTCSeconds();
                        const dtCompleta = dia + '/' + mes + '/' + ano + ' às ' + hora + ':' + min;

                        this.setState({
                            isLoading: false,
                            refreshing: false,
                            dataSource: responseJson.list,
                            UltimaAtualizacao: dtCompleta
                        }, function () {

                        });




                    })
                    .catch((error) => {
                        console.error(error);
                    });


            } else {
                ToastAndroid.show('No Networking', ToastAndroid.SHORT);
            }
        });


    }

    onRefresh() {
        this.setState({ dataSource: [] });
        this.regMsg();
    }


    AddItemsToArray=()=>{
 
      if (this.state.addCity == ''){
          Alert.alert(
              'Erro ao adicionar',
              'Preencha o campo',
              [
                  {text: 'Ok'},
                  {text: 'Cancelar', style: 'cancel'}
              ]
          
          
          );
      }else{

          return fetch(`http://api.openweathermap.org/data/2.5/find?units=metric&&APPID=${this.state.appid}&q=${this.state.addCity}`)
                  .then((response) => response.json())
                  .then((responseJson) => {

                      
                      this.setState({
                          isLoading: false,
                          refreshing: false,
                          

                      }, function () {

                      });

                      if(responseJson.list == ''){
                          Alert.alert(
                              'Cidade não existe',
                              'Verifique a escrita e tente novamente',
                              [
                                  {text: 'Cancelar', style: 'cancel'},
                                  {text: 'Ok'}

                              ]
                          )

                      }else{

                        if (this.state.arrayCity.indexOf(responseJson.list[0].id) > -1) {
                            Alert.alert(
                                'Cidade Já Existente',
                                'A cidade que você adicionou já existe na lista, adicione outra.',
                                [
                                    {text: 'Cancelar', style: 'cancel'},
                                    {text: 'Ok'}
  
                                ]
                            )
                          } else {
                            this.state.arrayCity.unshift( responseJson.list[0].id );
                            this.regMsg();
                          }
                          

                      }
                      
                  })
                  .catch((error) => {
                      console.error(error);
                  });



      }      
 
  }


    //RemoveItemToArray
    async RemoveItemsToArray(id, cidade){

       

        
        let ok = this.state.arrayCity.indexOf(id.toString());

        console.log(ok);

       //this.setState({arrayCity: this.state.arrayCity.splice(ok, 1) });
        this.state.arrayCity.splice(ok, 1);

        await this.regMsg();
        console.log(this.state.arrayCity);
        ToastAndroid.show(cidade + ' foi deletado', ToastAndroid.SHORT);
     }



    componentDidMount() {
        this.regMsg();

    };

    static navigationOptions = () => {
        return {
          title: 'Weather City',
          headerRight: () => (
              <TouchableOpacity onPress={()=> Alert.alert(
                  'Instruções de Uso',
                  'Bem-Vindo ao Weather City\n\n'+
                  'O Aplicativo trás informações de clima de cada cidade de sua preferêcia. Adicione ou delete qualquer cidade quando quiser.'+
                  '\n\n- Adicionar: Para adicionar, digite o nome da cidade e toque no botão adicionar\n\n'+
                  '- Deletar: Para deletar, segure na cidade de sua preferência e confirme a deleção.',
                  [{text: 'Entendi'}]
              )}>
                <Icon
                name = 'information-outline'
                size={30}
                color={'#fff'}
                style={{marginRight:10}}
                />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#9b59b6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignItens: 'center'
          },
        };
      };

    render() {
        return (

            <View style={{ flex: 1 }}>

                <StatusBar backgroundColor='#8e44ad' />

                <View style={{ flexDirection: 'row', margin: 10 }}>

                    <TextInput onChangeText={textInputCity => this.setState({ addCity: textInputCity })} placeholder='Adicionar Cidade' style={{ width: '70%', fontSize: 20, width: '70%', borderBottomColor: '#9b59b6', borderBottomWidth: 2 }} />


                    <TouchableOpacity onPress={this.AddItemsToArray} style={{ width: '25%', marginLeft: 15, borderColor: '#9b59b6', justifyContent: 'center', borderWidth: 2, borderRadius: 10 }}>
                        <Text style={{ alignSelf: 'center', fontSize: 17 }}>
                            Adicionar
                        </Text>
                    </TouchableOpacity>

                </View>


                <FlatList
                    data={this.state.dataSource}
                    renderItem={({ item }) =>

                    <TouchableOpacity onLongPress={() =>  Alert.alert(
                        'Deletar Cidade',
                         `Você realmente deseja apagar a cidade ${item.name}?`,
                          [  {text: 'Cancelar', style: 'cancel'},
                             {text: 'Deleta', onPress: () => this.RemoveItemsToArray(item.id, item.name)}
        
                          ]
                             ) }
                             
                             onPress={()=> ToastAndroid.show('Segure para deletar', ToastAndroid.SHORT)}>

                        
                        <View style={styles.cardItem} >

                            <Text style={{ fontSize: 15, color: 'grey' }}>Cidade</Text>

                            <View style={{ flexDirection: 'row' }}>

                                
                                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#9b59b6' }}>{item.name}, {item.sys.country}</Text>
                                
                                

                                
                                    <View style={{ flexDirection: 'column', marginLeft: 20, marginTop: -18, alignItems: 'center' }}>

                                        <Text style={{ fontSize: 15, color: 'grey' }}>Temperaturas</Text>
                                        <Text style={{ alignSelf: 'center' }}> Min. {(item.main.temp_min - this.state.real).toFixed(2)}ºC</Text>
                                        <Text style={{ alignSelf: 'center' }}> Max. {(item.main.temp_max - this.state.real).toFixed(2)}ºC</Text>
                                        

                                    </View>
                                    
                                    <View style={{flex:1,flexDirection: 'column', alignItems: 'center', justifyContent:'center' }}>
                                        <Image style={styles.iconTemp} source={{uri: 'http://openweathermap.org/img/wn/'+item.weather[0].icon+'@2x.png'}} />
                                        <Text style={styles.tempMaster}>  {(item.main.temp - this.state.real).toFixed(2)}ºC</Text>
                                    </View>


                               

                            </View>

                           

                        </View>
                        </TouchableOpacity>

                    }
                    keyExtractor={({ id }) => id}
                    style={{ backgroundColor: '#ddd', flex: 1, }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />

                    }
                />

                <View style={{ alignItems: 'center', backgroundColor: '#9b59b6' }}>
                    <Text style={styles.footer}>Atualizado em {this.state.UltimaAtualizacao}</Text>
                </View>
            </View>

        );
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd'

    },
    cardItem: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'baseline'
    },
    iconTemp:{
        height:55, 
        width:55,
        marginTop:-20
    },
    tempMaster:{ 
        fontSize:17,
        fontWeight: 'bold', 
    
    },
    footer: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 15,
        padding: 5
    },
    leftAction:{
        backgroundColor:'red',

    },
        

});

export default Main;

