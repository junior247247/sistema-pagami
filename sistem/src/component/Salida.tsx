import React, { useEffect, useContext, useState } from 'react'
import ReactDOM from 'react-dom'
import { context } from '../hooks/AppContext'

import { getFirestore, collection, orderBy, where, onSnapshot, query, doc, updateDoc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { app } from '../Firebase/conexion';
import { Entrada } from '../entidades/Entrada';
import { async } from '@firebase/util';
import { Indicators } from './indicator/Indicators';



interface Resenas{
  equipo:string;
  estado:string;
  total:string;
  fecha:string
}


export const Salida = () => {

  const { onChange, state } = useContext(context);
  const { idLoca } = state;
  const [Data, setData] = useState<Entrada[]>([]);
  const [FilterData, setFilterData] = useState<Entrada[]>([]);
  const [IsVisible, setIsVisible] = useState({ id: '', isVisible: false, idTecnico: '', estado: '',equipo:'' })
  const [ImagenTitulo, setImagenTitulo] = useState({ img: '', titulo: '' })
  const [Resena, setResena] = useState<string>('')
  const [IsLoading, setIsLoading] = useState(false)



  const noReparado = async (id: string) => {


    try {
      if(!Resena)return
      setIsLoading(true)
      const db = getFirestore(app);
      const coll = collection(db, 'Entrada');
      const document = doc(coll, id);
      const respDoc = getDoc(document);
      const res = await respDoc;
      const costoReparacion = res.get('costoReparacion')
      updateDoc(document, {
        estado: 'Retirado',
        subestado: 'no reparado',
      })
      const resena = collection(db, 'Resena');
      const year=new Date().getFullYear()
      const day=new Date().getDay()
      const month=new Date().getMonth()
      addDoc(resena, {
        idTecnico: IsVisible.idTecnico,
        resena: Resena,
        total: (IsVisible.estado != 'reparado') ? 0 : Number(costoReparacion),
        estado:'no reparado',
        timestamp:new Date().getTime(),
        equipo:IsVisible.equipo,
        fecha:day.toString()+'-' + month.toString()+'-'+ year.toString()


      })

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
      setIsVisible({ isVisible: false, id: '', idTecnico: '', estado: '',equipo:'' })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }



  const Reparado = async (id: string) => {
    try {
      
      if(!Resena)return
      setIsLoading(true)
      const db = getFirestore(app);
      const coll = collection(db, 'Entrada');
      const document = doc(coll, id);
      const respDoc = getDoc(document);

      const res = await respDoc;



      const costoReparacion = res.get('costoReparacion')
      const collTecDinero = collection(db, 'DineroTecnico');
      console.log(IsVisible.idTecnico)
      const documentTec = doc(collTecDinero, IsVisible.idTecnico);
      const resolve = getDoc(documentTec);
      const respTec = await resolve;
  

     const documentRes = collection(db, 'Resena');
      addDoc(documentRes, {
        idTecnico: IsVisible.idTecnico,
        resena: Resena,
        estado: 'reparado',
        total:  Number(costoReparacion),
        timestamp:new Date().getTime(),
        equipo:IsVisible.equipo,
        fecha:new Date()


      })

      updateDoc(document, {
        estado: 'Retirado',
        subestado: 'reparado'
      })
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
      setIsVisible({ isVisible: false, id: '', idTecnico: '', estado: '',equipo:'' })
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)

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
          img: resp.get('fileUri'),
          subestado: resp.get('subestado'),
          idTecnico:resp.get('idTecnico')

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
              <th className='text-mobile text-table table-desk-header' scope="col">Nombre</th>
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

                    <a className='pointer' onClick={() => setImagenTitulo({ titulo: resp.equipo, img: resp.img })} data-toggle="modal" data-target="#modalPhone" data-whatever="@mdo" >

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
                  <td className='text-mobile text-table table-desk-header' ><span className=" btn btn-warning" data-toggle="modal" data-target="#listoParaEntrega" data-whatever="@mdo" onClick={() => setIsVisible({ id: resp.id, isVisible: true, idTecnico: resp.idTecnico!, estado: resp.estado,equipo:resp.equipo })}>{resp.estado}</span></td>
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
            
              <form className="form-group needs-validation was-validated" noValidate>
                <label htmlFor="">Reseña</label>
                <textarea placeholder='Escribe la reseña de el equipo' required onChange={(e) => setResena(e.target.value)} style={{ maxHeight: 300 }} className='form-control' />
              </form>
              <div className="container">
                <div className="row justify-content-around">
                  <div className="col-auto">
                    <button className='btn btn-success pl-5 pr-5' data-dismiss="modal" aria-label="Close" onClick={() => Reparado(IsVisible.id)} >Reparado</button>
                  </div>
                  <div className="col-auto">
                    <button className='btn btn-danger pl-5 pr-5 ' data-dismiss="modal" aria-label="Close" onClick={() => noReparado(IsVisible.id)} >No Reparado</button>
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


      {
        (IsLoading) &&<Indicators/>
      }


    </div>









  )
}


