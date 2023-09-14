import React, { useContext, useEffect, useState } from 'react'
import { context } from '../hooks/AppContext'
import { addDoc, collection, orderBy, getFirestore, query, onSnapshot, updateDoc, doc, deleteDoc, where } from 'firebase/firestore';
import { app } from '../Firebase/conexion';
import { useForm } from '../hooks/useForm';
import { Producto } from '../entidades/Producto';
//import { PDFViewer } from '@react-18-pdf/renderer';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { FirebaseStorage } from 'firebase/storage';
export interface fileImg {
    fileUri: string;
    error: string;

}
interface Img {
    name: string
}

export const Productos = () => {
    const { onChange, state } = useContext(context);
    const { idLoca } = state;
    const [file, setfile] = useState<FileList>();
    const [producto, setProducto] = useState<Producto[]>([]);
    const [getProdById, setGetProdById] = useState<Producto>();



    const [Title, setTitle] = useState('')
    const [Description, setDescription] = useState('')
    const [PCompra, setPCompra] = useState('')
    const [PVenta, setPVenta] = useState('')
    const [Existencia, setExistencia] = useState('')

    const [LocalImg, setLocalImg] = useState<any>(null)
    
    useEffect(() => {

        onChange('Productos')


    }, [])
 





    const cargarImagen=async(file:FileList)=>{
        const archivo = file[0];
        setfile(file)
        if(archivo){
            const reader= new FileReader();
            reader.onload=(e)=>{
                setLocalImg(e.target!.result);
            }
            reader.readAsDataURL(archivo);
        }
    }

    const getFile = async (files: FileList): Promise<fileImg> => {
        const fi = files[0];

        const storage = getStorage();
        const storageRef = ref(storage, `images/${'asd'}`);
        const uploadTask = uploadBytesResumable(storageRef, fi);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log(percent);
                },
                (err) => {
                    resolve({ error: err.message, fileUri: '' })
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        resolve({ error: '', fileUri: url })
                    });
                }
            );

        })



    }

    const getById = (id: string) => {
        setGetProdById(producto.find(res => res.id == id));
        const Prodcst: Producto | undefined = producto.find(res => res.id == id);

        setTitle(Prodcst!.codigo);
        setExistencia(Prodcst!.existencia);
        setPCompra(Prodcst!.precio);
        setDescription(Prodcst!.description);
        setPVenta(Prodcst!.precio)
    }

    useEffect(() => {
        const db = getFirestore(app);
        const coll = collection(db, 'Producto');
        const items = query(coll, orderBy('timestamp', 'desc'), where('idLocal', '==', idLoca));
        onSnapshot(items, (snap) => {
            const Productos: Producto[] = snap.docs.map(data => {
                return {
                    id: data.id,
                    codigo: data.get('codigo'),
                    description: data.get('description'),
                    precio: data.get('precio'),
                    existencia: data.get('existencia'),
                    pCompra: data.get('priceCompra'),
                    img: data.get('img')
                }
            })
            setProducto(Productos);
        })
    }, [])

    const Eliminar = (id: string) => {
        const db = getFirestore(app);
        const coll = doc(db, 'Producto', id);
        deleteDoc(coll);
    }
    const updateProd =async (id: string) => {
        const db = getFirestore(app);
        const coll = doc(db, 'Producto', id);
        if(file){
            const  img= await getFile(file)
            updateDoc(coll, {
                codigo: Title,
                description: Description,
                precio: PVenta,
                existencia: Existencia,
                priceCompra: PCompra,
                img:img.fileUri
            })
        }else{
            updateDoc(coll, {
                codigo: Title,
                description: Description,
                precio: PVenta,
                existencia: Existencia,
                priceCompra: PCompra
            })
        }
  
   
    }

    const createProd = async () => {
        const db = getFirestore(app);
        const coll = collection(db, 'Producto');
        if (file) {
            const  img= await getFile(file)

            addDoc(coll, {
                codigo: Title,
                description: Description,
                precio: PVenta,
                existencia: Existencia,
                priceCompra: PCompra,
                timestamp: new Date().getTime(),
                idLocal: idLoca,
                img: img.fileUri
            })

        } else {
            addDoc(coll, {
                codigo: Title,
                description: Description,
                precio: PVenta,
                existencia: Existencia,
                priceCompra: PCompra,
                timestamp: new Date().getTime(),
                idLocal: idLoca,
                img: ''
            })

        }
        setDescription('')
        setTitle('')
        setPCompra('')
        setPVenta('')
        setLocalImg(null)

    }


    return (
        <div className='hidden'>


            <div className=' mr-4  ml-4 mt-4 border hidden '>
                <h6 className='title-prod p-2'>Registrar Productos</h6>
                <div className="row align-items-start p-2 bg-main">
                    <div className="col-lg-9">
                        <div className="row">



                            <div className="col-lg-2">
                                <p className='text-white'>Titulo</p>
                                <form action="" className='form-group'>
                                    <input value={Title} onChange={(e) => setTitle(e.target.value)} className='form-control' type="text" />
                                </form>
                            </div>

                            <div className="col-lg-4">
                                <p className='text-white'>Descripciopn</p>
                                <form action="" className='form-group'>
                                    <input value={Description} onChange={(e) => setDescription(e.target.value)} className='form-control' type="text" />
                                </form>
                            </div>
                            <div className="col-lg-2">
                                <p className='text-white'>Precio Venta</p>
                                <form action="" className='form-group'>
                                    <input value={PVenta} onChange={(e) => setPVenta(e.target.value)} className='form-control' type="number" />
                                </form>
                            </div>



                        </div>




                        <div className="row align-items-start p- bg-main">



                            <div className="col-lg-2">
                                <p className='text-white'>Precio Compra</p>
                                <form action="" className='form-group'>
                                    <input value={PCompra} onChange={(e) => setPCompra(e.target.value)} className='form-control' type="number" />
                                </form>
                            </div>

                            <div className="col-3">
                                <p className='text-white'>Existencia</p>
                                <form action="" className='form-group'>
                                    <input value={Existencia} onChange={(e) => setExistencia(e.target.value)} className='form-control' type="number" />
                                </form>
                            </div>



                            <div className="col-auto mt-5 mr-4">


                                <input   type="file" onChange={(e) => cargarImagen(e.target.files!)} accept='image/*' className='text-color' />
                            </div>


                            <div className="col mt-5">
                                <button onClick={() => createProd()} className='btn btn btn-outline-light bg-main'>Guardar</button>
                            </div>
                        </div>




                    </div>





                    <div className="col-lg-2 ">
                        <div className="row border p-2 rounded">
                            <div className="col">
                                <div className="row justify-content-between">
                                    <div className="col">
                                    <h4 className=' text-white text-center'>Imagen</h4>
                                   </div>
                                    <div className="col">

                                        {
                                            (file) &&    <button onClick={()=>{setfile(undefined);setLocalImg(null)}} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span className='text-white' aria-hidden="true">&times;</span>
                                        </button>
                                        }

                                      
                                    </div>
                                </div>
                         
                                <img className={(file) && 'img-thumbnail'} src={ LocalImg} />

                            </div>
                        </div>

                    </div>







                </div>







            </div>

            {/*
            <img src='https://firebasestorage.googleapis.com/v0/b/sistem-34148.appspot.com/o/images%2Fasd?alt=media&token=6cae97d6-b492-49da-b5b4-00301ce51c8c'/>

    */}


            <div className='ml-3 mr-3 mt-5  table-container'>





                <table className="table table-dark table-hover ">
                    <thead>
                        <tr>
                            <th className='text-mobile text-table' scope="col">Titulo</th>
                            <th className='text-mobile text-table' scope="col">Description</th>
                            <th className='text-mobile text-table' scope="col">P.Compra</th>
                            <th className='text-mobile text-table' scope="col">P.venta</th>
                            <th className='text-mobile text-table' scope="col">Existencia</th>
                            <th className='text-mobile text-table' scope="col">Editar</th>
                            <th className='text-mobile text-table' scope="col">Eliminar</th>
                            <th className='text-mobile text-table' scope="col"></th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            producto.map((resp, index) => (
                                <tr key={index}>
                                    <th className='text-mobile text-table' scope="row"><a className='code-link' >{resp.codigo}</a></th>

                             
                                    <td className='text-mobile text-table' >{resp.description.toUpperCase()}</td>
                                    <td className='text-mobile text-table' >{Number(resp.pCompra).toLocaleString('es')}</td>
                                    <td className='text-mobile text-table' >{Number(resp.precio).toLocaleString('es')}</td>
                                    <td className='text-mobile text-table' >{resp.existencia}</td>
                                    <td className='text-mobile text-table' ><a href="#" onClick={() => getById(resp.id)} className='btn btn-success' data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Editar</a></td>
                                    <td className='text-mobile text-table' ><a href="#" onClick={() => Eliminar(resp.id)} className='btn btn-danger'>Eliminar</a></td>
                                    <td className='text-mobile text-table' > <img width={50} style={{ objectFit: 'cover' }} src={resp.img} /></td>
                                </tr>

                            ))
                        }









                    </tbody>
                </table>

            </div>

            <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Editar Producto</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label className="col-form-label">Codigo</label>
                                    <input value={Title} onChange={(e) => setTitle(e.target.value)} type="text" className="form-control" id="recipient-name" />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Descripcion</label>
                                    <input value={Description} onChange={(e) => setDescription(e.target.value)} type="text" className="form-control" id="recipient-name" />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Precio</label>
                                    <input value={PCompra} onChange={(e) => setPCompra(e.target.value)} type="text" className="form-control" id="recipient-name" />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Precio de venta</label>
                                    <input value={PVenta} onChange={(e) => setPVenta(e.target.value)} type="text" className="form-control" id="recipient-name" />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Existencia</label>
                                    <input value={Existencia} onChange={(e) => setExistencia(e.target.value)} type="text" className="form-control" id="recipient-name" />
                                </div>


                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => updateProd(getProdById!.id)} data-dismiss="modal">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

{/*
            <div className="modal-container-spinner">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-border text-secondary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-border text-danger" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-border text-warning" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-border text-info" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-border text-light" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-border text-dark" role="status">
                    <span className="sr-only">Loading...</span>
                </div>

            </div>*/}




        </div>
    )
}
