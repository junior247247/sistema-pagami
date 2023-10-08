import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalDialog,ModalHeader } from 'react-bootstrap';

import ReactPDF, {
    Document,
    Page,
    View,
    Text,
    Link,
    Font,
    StyleSheet,
    PDFViewer,
    Image,
    Polyline
} from '@react-pdf/renderer';
import { Caracteristicas } from '../entidades/Entrada';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { app } from '../Firebase/conexion';
import { ParseToDate } from '../hooks/ParseDate';

interface Props {
    id: string
    onClose:()=>void;
}

const Init: Caracteristicas = {

    encendido: false,
    audio: false,
    pantalla: false,
    microfono: false,
    senal: false,
    wifi: false,
    camara1: false,
    camara2: false,
    carga: false,
    auricular: false,
    altavoz: false,
    sensores: false,
    bateria: false,
    flash: false,
    botones: false,
    software: false,
    recalentamiento: false,
    malware: false,
    piezas: false,
    reportado: false,
    costoReparacion: 0,
    costoRepuesto: 0,
    total: 0,
    equipo: '',
    serial: '',
    cliente: '',
    noFact: '',
    fecha: new Date(12021564),
    description: '',
    observacion: '',
    subestado: ''


}

export const ReporteEntrada = ({ id,onClose }: Props) => {

    const [obj, setobj] = useState<Caracteristicas>(Init)
    // console.log(obj.fecha)

    const getData = async () => {

        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);
        const resp = await getDoc(document);


        
            const Crs:Caracteristicas={
              encendido:resp.get('encendido'),
              audio:resp.get('audio'),
              pantalla:resp.get('pantalla'),
              microfono:resp.get('microfono'),
              senal:resp.get('senal'),
              wifi:resp.get('wifi'),
              camara1:resp.get('camara1'),
              camara2:resp.get('camara2'),
              carga:resp.get('carga'),
              auricular:resp.get('auricular'),
              altavoz:resp.get('altavoz'),
              sensores:resp.get('sensores'),
              bateria:resp.get('bateria'),
              flash:resp.get('flash'),
              botones:resp.get('botones'),
              software:resp.get('software'),
              recalentamiento:resp.get('recalentamiento'),
              malware:resp.get('malware'),
              piezas:resp.get('piezas'),
              reportado:resp.get('reportado'),
              costoReparacion:resp.get('costoReparacion'),
              costoRepuesto:resp.get('costoRepuesto'),
              total:resp.get('total'),
              equipo:resp.get('equipo'),
              serial:resp.get('serial'),
              cliente:resp.get('name'),
              fecha:new Date(resp.get('timestamp')),
              noFact:resp.get('noFact'),
              description:resp.get('description'),
              observacion:resp.get('observacion'),
              subestado:''
            
              
            }
            setobj(Crs);

    }



    useEffect(() => {


        getData();



    }, [])


    return (

        <Modal show size='lg'>
            <ModalHeader>
                <Text>Reporte</Text>
                <button onClick={onClose} className='btn'>&times;</button>

            </ModalHeader>
            <ModalBody>
                <PDFViewer style={{ width: '100%', height: '100Vh' }}>


                    <Document>
                        <Page size='A4'>
                            <View style={style.header}>
                                <Image style={style.img} source={require('../img/logo-factura.png')} />
                                <View>


                                    <Text style={style.title}>FACTURA</Text>
                                    <Text style={style.subTitle}>{ParseToDate(obj.fecha!)}</Text>
                                    <Text style={style.subTitle}>NO:{obj.noFact}</Text>
                                </View>


                            </View>
                            <View>





                                <Text style={style.text}>Boyaca Local 111,CL. 51 #51-40</Text>
                                <Text style={style.text}>Medellin ,Antioquia Colombia</Text>
                                <Text style={style.text}>Contacto: +57 3105102274</Text>

                            </View>
                            <Text style={{textAlign:'center',fontSize:8}} >FACTTURA PARA CONSUMIDOR FINAL</Text>

                            <View style={style.line} />
                            <Text style={{ ...style.text, marginTop: 5 }}>CLIENTE:{obj.cliente}</Text>
                            <Text style={{ ...style.fontSize, marginTop: 5, marginHorizontal: 5 }}>EQUIPO:{obj.equipo}</Text>
                            <Text style={{ ...style.fontSize, marginHorizontal: 5 }}>SERIAL:{obj.serial}</Text>

                            <View style={style.dano}>
                                 <View>
                                 <Text style={{ ...style.fontSize, }}>DAÑOS DE EL EQUIPO</Text>
                                <Text style={{ ...style.fontSize }}>OBSERVACION</Text>
                                <Text style={{ fontSize: 3, textAlign: 'center' }}>{obj.observacion}</Text>
                                <Text style={{ ...style.fontSize }}>DESCRIPTION</Text>
                                <Text style={{ fontSize: 3, marginHorizontal: 3, textAlign: 'center' }}>{obj.description}</Text>
                                </View>
                           
                                <View style={style.dFlex}>


                                    <View style={{ ...style.viewCheck, backgroundColor: 'black' }} />
                                    <Text style={style.fontSize}>Funciona</Text>


                                </View>


                                <View style={style.dFlex}>


                                    <View style={style.viewCheck} />
                                    <Text style={style.fontSize}>No funciona</Text>


                                </View>



                            </View>

                            <View style={style.line} />

                            <View style={style.containerDescrip}>


                                <View style={{flex:1}}>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.encendido) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Encendido</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.senal) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Señal</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.carga) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Carga</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.bateria) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Bateria</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.recalentamiento) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Calentamiento</Text>
                                    </View>

                                </View>



                                <View style={{flex:1}}>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.pantalla) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Pantalla</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.wifi) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Wifi</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.auricular) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Auricular</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.flash) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Flash</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.malware) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Malware</Text>
                                    </View>

                                </View>



                                <View style={{flex:1}}>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.audio) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Audio</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.camara1) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Camara 1</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.altavoz) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Altavoz</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.botones) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Botones</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.piezas) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Piezas</Text>
                                    </View>

                                </View>


                                <View style={{flex:1}}>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.microfono) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Microfono</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.camara2) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Camara 2</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.sensores) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Sensores</Text>
                                    </View>
                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.software) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Software</Text>
                                    </View>

                                    <View style={style.dFlex}>
                                        <View style={{ ...style.viewCheck, backgroundColor: (obj!.reportado) ? 'black' : '' }} />
                                        <Text style={style.fontSize}>Reportado</Text>
                                    </View>

                                </View>



                            </View>






                            <View style={{ ...style.line }} />

                            <View style={{marginLeft:5}}>
                            <View >
                                <Text style={style.textDesct}>Costo Repuesto:{(obj.costoRepuesto) ? obj.costoRepuesto : 0}</Text>

                                <Text style={style.textDesct}>Costo Reparacion:{(obj.costoReparacion) ? obj.costoReparacion : 0}</Text>
                                <Text style={style.textDesct}>Total:{obj.total}</Text>

                            </View>
                            <View>


                               




                                <Text style={{ ...style.textDesct, textAlign: 'left', marginTop: 3 }}>Garantia</Text>
                                <View style={{}}>
                                <Text style={{ fontSize: 3, marginHorizontal: 0,width:100, textAlign: 'left' }}>
                                    Recomendamos a los clientes verificar las reparaciones realizadas a sus
                                    equipos en el local una vez entregados los equipos reparados no tienen
                                    garantía solo cubrimos daños menores como soldaduras o ajuste de
                                    conectores o similares otro tipo de daños no tienen cobertura.
                                </Text>
                                </View>
                          
                            </View>
                            </View>
                       


                            

                        </Page>
                    </Document>
                </PDFViewer>
            </ModalBody>


        </Modal>





    )
}



const style = StyleSheet.create({
    dano: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 5

    },
    fontSize: {
        fontSize: 3
    },
    dFlex: {
        flexDirection: 'row',
        alignItems: 'center',

    },

    containerDescrip: {
        marginHorizontal: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    viewCheck: {
        width: 5,
        height: 5,
        border: .5,
        marginHorizontal: 2,
        marginVertical: 2

    },
    contianerTotal: {
        alignItems: 'flex-end',
        marginTop: 5

    },
    prod: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        marginVertical: 2
    },
    textDesct: {
        fontSize: 4,
        

    },
    description: {

        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
        borderBottomWidth: .5,
        borderTopWidth: .5,
        marginBottom: 5,
        paddingTop: 2,
        paddingBottom: 2,
        marginTop: 3,
        borderStyle: 'dashed',

        justifyContent: 'space-between'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        alignItems: 'center'
    },
    img: {
        width: 30,
        height: 10,


    },
    mt: {

    },
    title: {
        fontSize: 4
    },
    subTitle: {
        fontSize: 2,
        marginTop: 1
    },
    text: {
        fontSize: 5,
        textAlign: 'left',
        marginLeft: 5
    },
    line: {

        borderTopWidth: .5,
        height: 1,
    
        borderStyle: 'solid',
        borderTopColor: 'black',
        marginHorizontal: 5,
        marginTop: 5
    }
})
