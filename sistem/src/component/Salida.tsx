import React, { useEffect, useContext, useState } from 'react'
import ReactDOM from 'react-dom'
import { context } from '../hooks/AppContext'
/*import ReactPDF, {
  Document,
  Page,
  View,
  Text,
  Link,
  Font,
  StyleSheet,
  PDFViewer
} from '@react-pdf/renderer';*/
//import { Reporte } from './Reporte';
import { getFirestore, collection, orderBy, where, onSnapshot, query, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '../Firebase/conexion';
import { Entrada } from '../entidades/Entrada';
import { async } from '@firebase/util';






export const Salida = () => {

  const { onChange, state } = useContext(context);
  const { idLoca } = state;
  const [Data, setData] = useState<Entrada[]>([]);
  const [FilterData, setFilterData] = useState<Entrada[]>([]);
  const [IsVisible, setIsVisible] = useState({ id: '', isVisible: false, idTecnico: '' })
  const [ImagenTitulo, setImagenTitulo] = useState({ img: '', titulo: '' })

  const retirar = async (id: string) => {
    const db = getFirestore(app);
    const coll = collection(db, 'Entrada');
    const document = doc(coll, id);


    const respDoc = getDoc(document);

    const res = await respDoc;

    const costoReparacion = res.get('costoReparacion')
    updateDoc(document, {
      estado: 'Retirado'
    })
    setIsVisible({ isVisible: false, id: '', idTecnico: '' })

    const collTecDinero = collection(db, 'DineroTecnico');
    const documentTec = doc(collTecDinero, IsVisible.idTecnico);
    const resolve = getDoc(documentTec);
    const respTec = await resolve;
    if (respTec.exists()) {

      let money: number = respTec.get('money');
      money += Number(costoReparacion);
      updateDoc(documentTec, {
        money
      })
    } else {


      setDoc(doc(db, 'DineroTecnico', IsVisible.idTecnico!), {
        idLocal: idLoca,
        money: costoReparacion
      })

    }






  }

  useEffect(() => {
    onChange('Listo para entregar');
    const db = getFirestore(app);
    const coll = collection(db, 'Entrada');
    const itemsQuery = query(coll, orderBy('timestamp', 'desc'), where('estado', '==', 'Listo para entregar'), where('idLoca', '==', idLoca));
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
          noFact: resp.get('noFact'),
          img: resp.get('fileUri')
        }
      })

      setData(data);
      setFilterData(data);
    })

  }, [])

  return (
    <div >

      <div className="d-flex   mt-2 mb-3 align-items-center">
        <div className="col-6">
          <h5 className='text-white'>Buscar</h5>
          <input type="text" placeholder='Escribe el nombre ' onChange={(e) => setFilterData(Data.filter(resp => resp.name.includes(e.target.value)))} className='form-control' />
        </div>
       
      </div>





      <div className="table-container  ml-3 mr-3">
        <table className="table  table-dark table-hover ">
          <thead>
            <tr>
            <th className='text-mobile text-table table-desk-header' scope="col"> </th>
              <th className='text-mobile text-table table-desk-header'  scope="col">Nombre</th>
              <th className='text-mobile text-table table-desk-header' scope="col">Identificacion</th>
              <th className='text-mobile text-table table-desk-header' scope="col">Equipo</th>
              <th className='text-mobile text-table table-desk-header' scope="col">Serial</th>

              <th className='text-mobile text-table table-desk-header' scope="col">Telefono</th>
              <th className='text-mobile text-table table-desk-header' scope="col">Fecha</th>
              <th className='text-mobile text-table table-desk-header' scope="col">Reparacion</th>
              <th className='text-mobile text-table table-desk-header' scope="col">Repuesto</th>
              <th className='text-mobile text-table table-desk-header' scope="col">Total</th>
              <th className='text-mobile text-table table-desk-header' scope="col">Correo</th>
              <th className='text-mobile text-table table-desk-header' scope="col">Estado</th>

            </tr>
          </thead>
          <tbody >
            {
              FilterData.map((resp, index) => (
                <tr key={index}>

                  <th className='text-mobile table-desk-header' scope="row">

                  <a className='pointer' onClick={()=>setImagenTitulo({titulo:resp.equipo,img:resp.img})}  data-toggle="modal" data-target="#modalPhone" data-whatever="@mdo" >

                      <img width={50} className='img-thumbnail' style={{ objectFit: 'cover' }} src={resp.img} />
                  </a>


                  </th>
                  <th className='text-mobile text-table table-desk-header' scope="row">{resp.name}</th>
                  <td className='text-mobile text-table table-desk-header' >{resp.identiifcation}</td>
                  <td className='text-mobile text-table table-desk-header' >{resp.equipo}</td>
                  <td className='text-mobile text-table table-desk-header' >{resp.serial}</td>
                  <td className='text-mobile text-table table-desk-header' >{resp.phone}</td>
                  <td className='text-mobile text-table table-desk-header' >{resp.fecha?.getDate() + '-' + resp.fecha?.getMonth() + '-' + resp.fecha?.getFullYear()}</td>
                  <td className='text-mobile text-table table-desk-header' >{resp.costoReparacion}</td>
                  <td className='text-mobile text-table table-desk-header' >{resp.costoRepuesto}</td>
                  <td className='text-mobile text-table table-desk-header' >{resp.total}</td>
                  <td className='text-mobile text-table table-desk-header' >{resp.correo}</td>
                  <td className='text-mobile text-table table-desk-header' ><span className="label-status bg-success"  data-toggle="modal" data-target="#listoParaEntrega" data-whatever="@mdo" onClick={() => setIsVisible({ id: resp.id, isVisible: true, idTecnico: resp.idTecnico! })}>{resp.estado}</span></td>
                </tr>

              ))
            }
          </tbody>
        </table>

      </div>




      <div className="modal fade" id="listoParaEntrega" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Actualizar Estado</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">


              <div className="container">
                <div className="row justify-content-around">

                  <div className="col-auto">
                  <button className='btn btn-color pl-5 pr-5' onClick={() => retirar(IsVisible.id)} >Si</button>
                  </div>
                  <div className="col-auto">
                  <button className='btn btn-color pl-5 pr-5 ' data-dismiss="modal" aria-label="Close" onClick={() => setIsVisible({ id: '', isVisible: false, idTecnico: '' })} >No</button>
                  </div>
                </div>
              </div>

            </div>


          

          </div>
        </div>
      </div>


              
            <div className="modal fade" id="modalPhone" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg " role="document">
                    <div className="modal-content ">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{ImagenTitulo.titulo}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <img className='img-thumbnail' src={ImagenTitulo.img} />

                        </div>

                    </div>
                </div>
            </div>


    </div>









  )
}


