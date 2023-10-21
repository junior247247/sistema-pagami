import React, { useContext, useEffect, useState } from 'react'
import { context } from '../hooks/AppContext'
import { addDoc, collection, orderBy, getFirestore, query, onSnapshot, updateDoc, doc, deleteDoc, where } from 'firebase/firestore';
import { app } from '../Firebase/conexion';
import { useForm } from '../hooks/useForm';
import { Producto } from '../entidades/Producto';
//import { PDFViewer } from '@react-18-pdf/renderer';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { FirebaseStorage } from 'firebase/storage';
import { Indicators } from './indicator/Indicators';
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

    const [IsLoading, setIsLoading] = useState(false)

    const [Title, setTitle] = useState('')
    const [Description, setDescription] = useState('')
    const [PCompra, setPCompra] = useState('')
    const [StockDisponible, setStockDisponible] = useState<string>('')
    const [PVenta, setPVenta] = useState('')
    const [Existencia, setExistencia] = useState('')

    const [Cant, setCant] = useState('')
    const [ProductId, setProductId] = useState('')
    const [LocalImg, setLocalImg] = useState<any>(null)

    useEffect(() => {

        onChange('Productos')


    }, [])






    const cargarImagen = async (file: FileList) => {
        const archivo = file[0];
        setfile(file)
        if (archivo) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLocalImg(e.target!.result);
            }
            reader.readAsDataURL(archivo);
        }
    }

    const getFile = async (files: FileList): Promise<fileImg> => {
        const fi = files[0];

        const storage = getStorage();
        const storageRef = ref(storage, `images/${new Date().getTime().toString()}`);
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
        setIsLoading(true)
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
                    img: data.get('img'),
                    estado:data.get('estado')
                }
            })
            setProducto(Productos);
        })
        setIsLoading(false)
    }, [])

    const Eliminar = (id: string) => {
        const db = getFirestore(app);
        const coll = doc(db, 'Producto', id);
        deleteDoc(coll);
    }



    const updateProd = async (id: string) => {
        const db = getFirestore(app);
        const coll = doc(db, 'Producto', id);
        if (file) {
            const img = await getFile(file)
            updateDoc(coll, {
                codigo: Title,
                description: Description,
                precio: PVenta,
                existencia: Existencia,
                priceCompra: PCompra,
                img: img.fileUri
            })
        } else {
            updateDoc(coll, {
                codigo: Title,
                description: Description,
                precio: PVenta,
                existencia: Existencia,
                priceCompra: PCompra
            })
        }

        setDescription('')
        setTitle('')
        setPCompra('')
        setPVenta('')
        setExistencia('')


    }



    const publicarProducto = (id: string) => {
        if(!StockDisponible) return
        const db = getFirestore(app);
        const coll = doc(db, 'Producto', id);
        updateDoc(coll, {
            estado: 'publicado',
         
        })

        const productoPublicado = collection(db, 'productoPublicado');
        addDoc(productoPublicado, {
            productId: id,
            existencia: StockDisponible
        })



    }

    const createProd = async () => {
        if (!Description || !Existencia || !PCompra || !PVenta) return
        setIsLoading(true)
        const db = getFirestore(app);
        const coll = collection(db, 'Producto');

        if (getProdById?.id != null) {
            updateProd(getProdById.id)
        } else {
            if (file) {
                const img = await getFile(file)

                addDoc(coll, {
                    codigo: Title,
                    description: Description,
                    precio: PVenta,
                    existencia: Existencia,
                    priceCompra: PCompra,
                    timestamp: new Date().getTime(),
                    idLocal: idLoca,
                    img: img.fileUri,
                    estado: 'no-publicado'
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
                    img: '',
                    estado: 'no-publicado'
                })

            }
            setDescription('')
            setTitle('')
            setPCompra('')
            setPVenta('')
            setExistencia('')
            setLocalImg(null)
            setIsLoading(false)

        }



    }


    return (
        <div className='hidden m-2'>


            <div className=' mr-4  ml-4 mt-4  hidden '>

                <span className='btn btn-primary' data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Nuevo</span>







            </div>



            <div className='ml-3 mr-3 mt-5  table-container'>





                <table className="table table-dark table-hover ">
                    <thead>
                        <tr>
                        <th className='text-mobile text-table' scope="col"></th>

                            <th className='text-mobile text-table' scope="col">Titulo</th>
                            
                            <th className='text-mobile text-table' scope="col">Description</th>
                            <th className='text-mobile text-table' scope="col">Estado</th>
                            <th className='text-mobile text-table' scope="col">P.Compra</th>
                            <th className='text-mobile text-table' scope="col">P.venta</th>
                            <th className='text-mobile text-table' scope="col">Existencia</th>
                            <th className='text-mobile text-table' scope="col">Publicar</th>
                            <th className='text-mobile text-table' scope="col">Editar</th>
                            <th className='text-mobile text-table' scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            producto.map((resp, index) => (
                                <tr key={index}>
                                <td className='text-mobile text-table' > <img className='img-thumbnail'  width={80} style={{ objectFit: 'cover' }} src={resp.img} /></td>

                                    <th className='text-mobile text-table' scope="row"><a className='code-link' >{resp.codigo}</a></th>


                                    <td className='text-mobile text-table' >{resp.description.toUpperCase()}</td>
                                    
                                    <td className='text-mobile text-table' >{resp.estado}</td>
                                    <td className='text-mobile text-table' >{Number(resp.pCompra).toLocaleString('es',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                                    <td className='text-mobile text-table' >{Number(resp.precio).toLocaleString('es',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                                    <td className='text-mobile text-table' >{resp.existencia}</td>

                                    <td className='text-mobile text-table' ><a href="#" onClick={() => setProductId(resp.id)} data-toggle="modal" data-target="#modalDeleItem" data-whatever="@mdo" className='btn btn-success'>Publicar</a></td>

                                    <td className='text-mobile text-table' ><a href="#" onClick={() => getById(resp.id)} className='btn btn-success' data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Editar</a></td>
                                    <td className='text-mobile text-table' ><a href="#" onClick={() => Eliminar(resp.id)} className='btn btn-danger'>Eliminar</a></td>


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
                            <h5 className="modal-title" id="exampleModalLabel">Producto</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form className='g-3 needs-validation was-validated' noValidate>

                                <div className="form-group">
                                    <div className="col-lg-4 ">
                                        <div className="row border p-2 rounded">
                                            <div className="col-lg-12">
                                                <div className="row justify-content-between">
                                                    <div className="col-6">
                                                        <h6 className=' text-muted text-center'>Imagen</h6>
                                                    </div>
                                                    <div className="col-6">

                                                        {
                                                            (file) && <button onClick={() => { setfile(undefined); setLocalImg(null) }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                <span className='text-black' aria-hidden="true">&times;</span>
                                                            </button>
                                                        }


                                                    </div>
                                                </div>

                                                <img className={(file) && 'img-thumbnail'} src={LocalImg} />

                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="form-group">


                                    <div className="col-lg-2">

                                        <div className="col-auto mt-5 mr-4">


                                            <input type="file" onChange={(e) => cargarImagen(e.target.files!)} accept='image/*' className='text-color' />
                                        </div>

                                    </div>


                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Titulo</label>
                                    <input value={Title} onChange={(e) => setTitle(e.target.value)} required type="text" className="form-control" id="recipient-name" />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Descripcion</label>
                                    <input value={Description} onChange={(e) => setDescription(e.target.value)} required type="text" className="form-control" id="recipient-name" />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Precio</label>
                                    <input value={PCompra} onChange={(e) => setPCompra(e.target.value)} required type="number" className="form-control" id="recipient-name" />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Precio de venta</label>
                                    <input value={PVenta} onChange={(e) => setPVenta(e.target.value)} required type="number" className="form-control" id="recipient-name" />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Existencia</label>
                                    <input value={Existencia} onChange={(e) => setExistencia(e.target.value)} required type="text" className="form-control" id="recipient-name" />
                                </div>


                            </form>
                        </div>
                        <div className="modal-footer">

                            <button type="submit" className="btn btn-color" onClick={() => createProd()} data-dismiss={(Description && PCompra && PVenta && Existencia) && 'modal'}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>


            {
                (IsLoading) && <Indicators />
            }

            <div className="modal fade" id="modalDeleItem" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Publicar producto</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <form action="" className='needs-validation was-validated' noValidate>
                                            <input type="text" placeholder='Stock disponible a publicar' required className='form-control' />
                                        </form>
                                    </div>
                                </div>
                                <div className="row justify-content-around">
                                    <div className="col-4">
                                        <a data-dismiss={ (StockDisponible) &&  "modal"} aria-label={  (StockDisponible) &&  "Close"} onClick={()=>publicarProducto(ProductId)} className="btn btn-warning text-white">Publicar</a>
                                    </div>
                                    <div className="col-4">
                                        <a className="btn btn-warning text-white" data-dismiss="modal" aria-label="Close">Cancelar</a>
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
