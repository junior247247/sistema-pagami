import { getFirestore, collection, onSnapshot, query, orderBy, where, doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Caracteristicas, Entrada } from '../entidades/Entrada';
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext'
//import { ReporteEntrada } from './ReporteEntrada';

interface IsView {
  id: string;
  isVisible: boolean
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
  fecha: new Date(212311231),
  description: "",
  observacion: ''


}

export const Historial = () => {
  const { onChange, state: { idLoca } } = useContext(context);
  const [Data, setData] = useState<Entrada[]>([]);
  const [CaracteristicasState, setCaracteristicas] = useState<Caracteristicas>(Init);

  const [Isvisible, setIsvisible] = useState<IsView>({ id: '', isVisible: false })


  const getData = async (id: string) => {

    document.getElementById('id-rep')!.style.display = 'flex';
    const db = getFirestore(app);
    const coll = collection(db, 'Entrada');
    const documents = doc(coll, id);
    const resp = await getDoc(documents);




    const Crs: Caracteristicas = {
      encendido: resp.get('encendido'),
      audio: resp.get('audio'),
      pantalla: resp.get('pantalla'),
      microfono: resp.get('microfono'),
      senal: resp.get('senal'),
      wifi: resp.get('wifi'),
      camara1: resp.get('camara1'),
      camara2: resp.get('camara2'),
      carga: resp.get('carga'),
      auricular: resp.get('auricular'),
      altavoz: resp.get('altavoz'),
      sensores: resp.get('sensores'),
      bateria: resp.get('bateria'),
      flash: resp.get('flash'),
      botones: resp.get('botones'),
      software: resp.get('software'),
      recalentamiento: resp.get('recalentamiento'),
      malware: resp.get('malware'),
      piezas: resp.get('piezas'),
      reportado: resp.get('reportado'),
      costoReparacion: resp.get('costoReparacion'),
      costoRepuesto: resp.get('costoRepuesto'),
      total: resp.get('total'),
      equipo: resp.get('equipo'),
      serial: resp.get('serial'),
      cliente: resp.get('name'),
      fecha: new Date(resp.get('timestamp')),
      observacion: resp.get('observacion'),
      description: resp.get('description')

    }

    setCaracteristicas(Crs);

  }

  useEffect(() => {
    onChange('Historial')
    const db = getFirestore(app);
    const coll = collection(db, 'Entrada');
    const itemsQuery = query(coll, orderBy('timestamp', 'desc'), where('estado', '==', 'Retirado'), where('idLoca', '==', idLoca));
    onSnapshot(itemsQuery, (snap) => {
      const data: Entrada[] = snap.docs.map(resp => {
        return {
          id: resp.id,
          name: resp.get('name'),
          phone: resp.get('telefono'),
          correo: resp.get('correo'),
          identiifcation: resp.get('identification'),
          observacion: resp.get('observacion'),
          costoReparacion: resp.get('costoReparacion'),
          costoRepuesto: resp.get('csotoRepuesto'),
          fecha: new Date(resp.get('timestamp')),
          total: resp.get('total'),
          equipo: resp.get('equipo'),
          serial: resp.get('serial'),
          estado: resp.get('estado'),
          noFact: resp.get("noFact className='text-mobile' "),
          img: resp.get('fileUri')
        }
      })

      setData(data);
    })


  }, [])

  return (
    <div>

      <div className="container-fluid  align-items-center mt-3 mb-3">
      
        <div className="row  ">

          <div className="col-sm-6 col-md-4">
            <p className='text-white pt-3'>Nombre</p>
            <input type="text" className='form-control' placeholder='Nombre' id="" />
          </div>


          <div className="col-sm-6 col-md-4">
            <p className='text-white pt-3'>Desde</p>
            <input type="date" className='form-control' name="" id="" />
          </div>

          <div className="col-sm-6 col-md-4">
            <p className='text-white pt-3'>Hasta</p>
            <input type="date" className='form-control' name="" id="" />
          </div>


        </div>



      </div>

      <div className="table-container ml-3 mr-3">
        <table className="table  table-dark table-hover ">
          <thead>
            <tr>
            <th className='text-mobile text-table  table-desk-header' scope="col"></th>
              <th className='text-mobile text-table  table-desk-header' scope="col">Nombre</th>
              <th className='text-mobile text-table  table-desk-header' scope="col">Identificacion</th>
              <th className='text-mobile text-table  table-desk-header' scope="col" colSpan={0} >Equipo</th>
              <th className='text-mobile text-table  table-desk-header' scope="col" >Serial</th>

              <th className='text-mobile text-table  table-desk-header' scope="col">Telefono</th>
              <th className='text-mobile text-table  table-desk-header' scope="col">Fecha</th>
              <th className='text-mobile text-table  table-desk-header' scope="col">Reparacion</th>
              <th className='text-mobile text-table  table-desk-header' scope="col">Repuesto</th>
              <th className='text-mobile text-table  table-desk-header' scope="col">Total</th>
              <th className='text-mobile text-table table-desk-header' scope="col">Correo</th>
              <th className='text-mobile text-table table-desk-header' scope="col">Reporte</th>

            </tr>
          </thead>
          <tbody >
            {
              Data.map((resp, index) => (
                <tr key={index}>
                       <th className='text-mobile text-table table-desk-header' scope="row">

                       <img width={50}  className ={(resp.img) && 'img-thumbnail'} src={resp.img} />
                       </th>
                
                  <th className='text-mobile text-table table-desk-header' scope="row">{(resp.name) ? resp.name.toUpperCase() : ''}</th>
                  <td className='text-mobile text-table table-desk-header'>{resp.identiifcation}</td>
                  <td className='text-mobile text-table table-desk-header'  >{resp.equipo}</td>
                  <td className='text-mobile text-table table-desk-header' >{resp.serial}</td>
                  <td className='text-mobile text-table table-desk-header'>{resp.phone}</td>
                  <td className='text-mobile text-table table-desk-header'>{resp.fecha?.getDate() + '-' + resp.fecha?.getMonth() + '-' + resp.fecha?.getFullYear()}</td>
                  <td className='text-mobile text-table table-desk-header'>{resp.costoReparacion}</td>
                  <td className='text-mobile text-table table-desk-header'>{resp.costoRepuesto}</td>
                  <td className='text-mobile text-table table-desk-header'>{resp.total}</td>
                  <td className='text-mobile text-table table-desk-header'>{resp.correo}</td>
                  <td><a className='btn btn-success' data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" onClick={() => setIsvisible({ id: resp.id, isVisible: true })} >Imprimir</a></td>
                </tr>

              ))
            }
          </tbody>
        </table>

      </div>





      <div className="modal fade " id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div className="modal-dialog modal-lg" role="document">

          <div className="modal-content ">

            <div className="modal-header">
              <h5 className="modal-title" id="exampleModal">Reporte</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">

              <div className="container-fluid">
                <div className="row  justify-content-center align-items-end">

                  <div
                    className='col-8 rounded align-self-center'
                    style={{ backgroundColor: 'white', height: 500 }}
                  >


                



                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>



    </div>
  )
}
