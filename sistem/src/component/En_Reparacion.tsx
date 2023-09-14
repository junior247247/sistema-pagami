import { collection, getFirestore, onSnapshot, query, orderBy, where, doc, getDoc, updateDoc, addDoc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Entrada } from '../entidades/Entrada';
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext'
import { ParseToDate } from '../hooks/ParseDate';
import { useForm } from '../hooks/useForm';
import { ModalTipo } from './modalBoostrap/ModalTipo';
//import { ReporteEntrada } from './ReporteEntrada';

export const En_Reparacion = () => {

    const { onChange, state } = useContext(context);
    const { idLoca } = state;
    const [Data, setData] = useState<Entrada[]>([]);
    const [IsVisible, setIsVisible] = useState({ isVisible: false, id: '', idTecnico: '' });
    const [IsVisibleReport, setIsVisiblReporte] = useState({ isVisible: false, id: '' });
 

    const [FilterData, setFilterData] = useState<Entrada[]>([]);
    const [visibleDescrip, setVisibleDescript] = useState(false)
    const [dataSelected, setDataSelected] = useState({ observacion: '', description: '' })
    const [DescCosto, setDescCosto] = useState({ total: '', cReparacion: '', cRepuesto: '' })

    const [ImagenTitulo, setImagenTitulo] = useState({ img: '', titulo: '' })

    const [Description, setDescription] = useState('')
    const [CostoReparacion, setCostoReparacion] = useState('')
    const [CostoRepuesto, setCostoRepuesto] = useState('')

    const listo = (id: string) => {
        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);
        updateDoc(document, {
            estado: 'Listo para entregar'
        })
        setIsVisible({ isVisible: false, id: '', idTecnico: '' })

    }

    const getDataSelect = async (id: string) => {
     //   setIsVisible({ isVisible: false, id: '', idTecnico: '' })
        setVisibleDescript(true);
        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);
        const get = await getDoc(document);
        setDataSelected({ observacion: get.get('observacion'), description: get.get('description') });
    }


    const getDataGener = async (id: string, idTecnico: string) => {
        setIsVisible({ isVisible: true, id: id, idTecnico: idTecnico })

        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);
        const get = await getDoc(document);
        setDescCosto({ cRepuesto: get.get('costoRepuesto'), cReparacion: get.get('costoReparacion'), total: get.get('total') });
    }

    const ObtenerCostosYDescription = async (id: string) => {
     

        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);
        const resp = await getDoc(document);
        setDescription(resp.get('description'))
         setCostoReparacion(resp.get('costoReparacion'))
         setCostoRepuesto(resp.get('costoRepuesto'))   
       
    }



    const addCajaDiaria = (total: number) => {
        const db = getFirestore(app);
        const coll = collection(db, 'CajaDiaria');

        addDoc(coll, {
            total: total,
            idLocal: idLoca,
            cierre: 'SIN CIERRE',
            tipo: 'VENTA',
            timestamp: new Date().getTime()
        })


    }


    const agregarCaja = async (total: number) => {
        const db = getFirestore(app);
        const coll = collection(db, 'Caja');
        const document = doc(coll, idLoca);
        const get = getDoc(document);
        const resp = await get;
        if (resp.exists()) {

            let money: number = resp.get('money');
            money += Number(total);
            updateDoc(document, {
                money
            })
        } else {


            setDoc(doc(db, 'Caja', idLoca), {
                idLocal: idLoca,
                money: total
            })
            /*  addDoc(coll, {
                  idLocal: idLoca,
                  money: total
              })*/
        }
    }



    const updateData = (id: string) => {


        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);

        updateDoc(document, {
            costoReparacion: CostoReparacion,
            costoRepuesto: CostoRepuesto,
            total: Number(CostoReparacion) + Number(CostoRepuesto),
            description:Description,

        })

        

    }

    const retirar = async (id: string, idTecnico?: string) => {
        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const document = doc(coll, id);
        const resp = await getDoc(document);
        const total = Number(resp.get('total'));
        const costoReparacion = resp.get("costoReparacion");
        agregarCaja(total);
        addCajaDiaria(total);
        updateDoc(document, {
            estado: 'Retirado'
        })





        const collTecDinero = collection(db, 'DineroTecnico');
        const documentTec = doc(collTecDinero, idTecnico);
        const resolve = getDoc(documentTec);
        const respTec = await resolve;
        if (respTec.exists()) {

            let money: number = respTec.get('money');
            money += Number(costoReparacion);
            updateDoc(documentTec, {
                money
            })
        } else {


            setDoc(doc(db, 'DineroTecnico', idTecnico!), {
                idLocal: idLoca,
                money: costoReparacion
            })

        }





        setIsVisible({ isVisible: false, id: '', idTecnico: '' })

    }


    useEffect(() => {
        onChange('En reparacion')
        const db = getFirestore(app);
        const coll = collection(db, 'Entrada');
        const itemsQuery = query(coll, orderBy('timestamp', 'desc'), where('estado', '==', 'En Reparacion'), where('idLoca', '==', idLoca));
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
                    costoRepuesto: resp.get('costoRepuesto'),
                    fecha: new Date(resp.get('timestamp')),
                    total: resp.get('total'),
                    equipo: resp.get('equipo'),
                    serial: resp.get('serial'),
                    estado: resp.get('estado'),
                    idTecnico: resp.get('idTecnico'),
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

            <div className="d-flex  mt-3 mb-3 align-items-center">
           
                <div className="col-auto">
                <h5 className='text-white'>Buscar</h5>

                    <input type="text" onChange={(e) => setFilterData(Data.filter(resp => resp.name.includes(e.target.value)))} placeholder='Buscar por nombre' className='form-control' />
                </div>





            </div>

            <div className="table-container ml-3 mr-3">
                <table className="table  table-dark table-hover ">
                    <thead>
                        <tr>
                            <th className='text-mobile text-table  table-desk-header' scope="col"></th>
                            <th className='text-mobile table-desk-header' scope="col">No Fact</th>
                            <th className='text-mobile table-desk-header' scope="col">Nombre</th>
                            <th className='text-mobile table-desk-header' scope="col">DNI</th>
                            <th className='text-mobile table-desk-header' scope="col">Equipo</th>
                            <th className='text-mobile table-desk-header' scope="col">Serial</th>
                            <th className='text-mobile table-desk-header' scope="col">Telefono</th>
                            <th className='text-mobile table-desk-header' scope="col">Fecha</th>
                            <th className='text-mobile table-desk-header' scope="col">C.Reparacion</th>
                            <th className='text-mobile table-desk-header' scope="col">C.Repuesto</th>
                            <th className='text-mobile table-desk-header' scope="col">C.Total</th>
                            <th className='text-mobile table-desk-header' scope="col">Correo</th>
                            <th className='text-mobile table-desk-header' scope="col">Retirar</th>

                        </tr>
                    </thead>
                    <tbody >
                        {
                            FilterData.map((resp, index) => (
                                <tr key={index} className={'pointer'} onDoubleClick={() => setIsVisiblReporte({ isVisible: true, id: resp.id })}>

                                    <th className='text-mobile table-desk-header' scope="row">

                                        <a onClick={() => setImagenTitulo({ titulo: resp.phone, img: resp.img })} data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" >

                                            <img width={50} className='img-thumbnail' style={{ objectFit: 'cover' }} src={resp.img} />
                                        </a>


                                    </th>
                                    <th className='text-mobile table-desk-header' scope="row">{resp.noFact}</th>
                                    <th className='text-mobile table-desk-header' scope="row">{resp.name.toUpperCase()}</th>
                                    <td className='text-mobile table-desk-header'>{resp.identiifcation}</td>
                                    <td className='text-mobile table-desk-header'>{resp.equipo}</td>
                                    <td className='text-mobile table-desk-header'>{resp.serial}</td>
                                    <td className='text-mobile table-desk-header'>{resp.phone}</td>
                                    <td className='text-mobile table-desk-header'>{ParseToDate(resp.fecha)}</td>
                                    <td className='text-mobile table-desk-header'>{Number(resp.costoReparacion).toLocaleString('es',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                                    <td className='text-mobile table-desk-header'>{Number(resp.costoRepuesto).toLocaleString('es',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                                    <td className='text-mobile table-desk-header'>{Number(resp.total).toLocaleString('es',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                                    <td className='text-mobile table-desk-header'>{resp.correo}</td>

                                    <td><a onClick={()=>getDataGener(resp.id,resp.idTecnico!)} className='btn btn-color' data-toggle="modal" data-target="#modalEstado" data-whatever="@mdo" >Estado</a></td>
                                </tr>

                            ))
                        }
                    </tbody>
                </table>

            </div>














        







            <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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






            <div className="modal fade" id="modalEstado" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Actualizar estado</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row justify-content-between">
                                    <div className="col-12">
                                        <p>Costo Reparacion:{Number(DescCosto.cReparacion).toLocaleString('es',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                                    </div>
                                    <div className="col-12">
                                        <p>Costo Repuesto:{Number(DescCosto.cRepuesto).toLocaleString('es',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                                    </div>
                                    <div className="col-12">
                                        <p>Total:{Number(DescCosto.total).toLocaleString('es',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                                    </div>
                                </div>

                                <div className="modal-footer ">
                                    <div className="container">


                                        <div className="row justify-content-between">
                                            <a data-dismiss="modal" aria-label="Close" onClick={()=>retirar(IsVisible.id, IsVisible.idTecnico)} className="btn text-white btn-primary col-auto">Retirado</a>
                                            <a className="btn text-white btn-primary col-auto">Reporte</a>
                                            <a onClick={()=>ObtenerCostosYDescription(IsVisible.id)} data-toggle="modal" data-target="#modalActualizarPrecio" data-whatever="@mdo" className="btn text-white btn-primary col-auto">Actualizar Precio</a>
                                            <a  onClick={()=>getDataSelect(IsVisible.id)} data-toggle="modal" data-target="#modalTipo" data-whatever="@mdo"  className="btn text-white btn-primary col-auto">Tipo</a>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>





            <div className="modal fade" id="modalActualizarPrecio" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Actualizar</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="form-group">
                                <label className="col-form-label">Description</label>
                                <input value={Description} onChange={(e)=>setDescription(e.target.value)} type="text" placeholder='Escriba la description' className="form-control" id="recipient-name" />
                            </div>
                            <div className="containner">
                                <div className="row">

                                    <div className="col">
                                        <div className="form-group">
                                            <label className="col-form-label">Costo reparacion</label>
                                            <input value={CostoReparacion}  onChange={(e)=>setCostoReparacion(e.target.value)}  placeholder='Costo reparacion' type="text" className="form-control" id="recipient-name" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="col-form-label">Costo repuesto</label>
                                            <input value={CostoRepuesto}  onChange={(e)=>setCostoRepuesto(e.target.value)}  placeholder='Costo repuesto' type="text" className="form-control" id="recipient-name" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div className="modal-footer">
                            <a data-dismiss="modal" aria-label="Close" onClick={()=>updateData(IsVisible.id)} className='btn text-white btn-primary'>Guardar</a>
                        </div>

                    </div>
                </div>
            </div>




            <div className="modal fade" id="modalTipo" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Tipo reparacion</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <h4>{dataSelected.description}</h4>
                                    </div>
                                    <div className="col-12">
                                        <h4>{dataSelected.observacion}</h4>
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
