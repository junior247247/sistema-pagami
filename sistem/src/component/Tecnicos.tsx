import { addDoc, getFirestore, collection, onSnapshot, query, orderBy, getDoc, doc, where, updateDoc } from 'firebase/firestore';
import React, { useEffect, useContext, useState } from 'react'
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext'
import { useForm } from '../hooks/useForm';
import { async } from '@firebase/util';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { fileImg } from './Productos';
interface Tecnico {
  name: string,
  id: string,
  idDoc: string,
  idLocal: string;
  nameLocal?: string;
  total: number;
  img:string;
  cargo:string;
  talento:string

}
interface Local {
  name: string;
  idLocal: string;

}

export const Tecnicos = () => {

  const { onChange } = useContext(context);
  const { onChange: onChangeForm, name, id,talento,cargo } = useForm({ id: '', name: '',talento:'',cargo:''});
  const [Local, setLocal] = useState<Local[]>([])
  const [SelectLocal, setSelectLocal] = useState<Local>({ name: 'Selecciona', idLocal: '' });
  const [IsVisible, setIsVisible] = useState({ idTecnico: '', IsVisible: false });
  const [Tecnico, setTecnico] = useState<Tecnico[]>([]);
  const [FilterTecnico, setFilterTecnico] = useState<Tecnico[]>([])
  const [file, setfile] = useState<FileList>();
  const [LocalImg, setLocalImg] = useState<any>(null)

  useEffect(() => {
    onChange('Técnicos')
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




  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, 'Local');
    const Q = query(coll, orderBy('timestamp', 'desc'));

    onSnapshot(Q, (resp) => {
      const data: Local[] = resp.docs.map(res => {
        return {
          idLocal: res.id,
          name: res.get('name')
        }
      })
      setLocal(data);
    })

  }, [])





  const sacarFondo = async (id: string) => {
    const db = getFirestore(app);
    const collTecDinero = collection(db, 'DineroTecnico');
    const documentTec = doc(collTecDinero, id);
    //const resolve = await getDoc(documentTec);
    updateDoc(documentTec, {
      money: 0
    })
    setIsVisible({ IsVisible: false, idTecnico: '' })

  }





  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, 'Tecnicos');
    const Q = query(coll, orderBy('timestamp', 'desc'));
    onSnapshot(Q, (resp) => {
      resp.docs.map(res => {
        const coll = collection(db, 'Local');
        const getDocument = doc(coll, res.get('idLocal'));
        const getDocs = getDoc(getDocument);

        const collTecDinero = collection(db, 'DineroTecnico');
        const documentTec = doc(collTecDinero, res.id);

        const resolve = getDoc(documentTec);
        resolve.then(resp => {
          if (resp.exists()) {

            getDocs.then(data => {

              const tec: Tecnico = {
                name: res.get('name'),
                id: res.get('id'),
                idDoc: res.id,
                idLocal: data.id,
                nameLocal: data.get('name'),
                total: resp.get('money'),
                img:resp.get('img'),
                cargo:resp.get('cargo'),
                talento:resp.get('talento')

              }


              setTecnico(resp => {
                const index = resp.find(resp => resp.idDoc === tec.idDoc);
                if (index) {
                  return [...resp];
                } else {

                  return [...resp, tec]
                }
              })

              setFilterTecnico(resp => {
                const index = resp.find(resp => resp.idDoc === tec.idDoc);
                if (index) {
                  return [...resp];
                } else {

                  return [...resp, tec]
                }
              })

            })



          } else {

            getDocs.then(data => {

              const tec: Tecnico = {
                name: res.get('name'),
                id: res.get('id'),
                idDoc: res.id,
                idLocal: data.id,
                nameLocal: data.get('name'),
                total: 0,
                img:res.get('img'),
                cargo:resp.get('cargo'),
                talento:resp.get('talento')

              }


              setTecnico(resp => {
                const index = resp.find(resp => resp.idDoc === tec.idDoc);
                if (index) {
                  return [...resp];
                } else {

                  return [...resp, tec]
                }
              })

              setFilterTecnico(resp => {
                const index = resp.find(resp => resp.idDoc === tec.idDoc);
                if (index) {
                  return [...resp];
                } else {

                  return [...resp, tec]
                }
              })

            })



          }








        })

      })
    })

  }, [])


  const create = async() => {
    if (name == '' && id == '') return alert('Completa todos los campos');
    const db = getFirestore(app);
    const coll = collection(db, 'Tecnicos');
    if(file){
      const foto= await getFile(file)
      addDoc(coll, {
        id,
        name,
        timestamp: new Date().getTime(),
        idLocal: SelectLocal.idLocal,
        img:foto.fileUri,
        talento:talento,
        cargo:cargo
      })
    }else{
      addDoc(coll, {
        id,
        name,
        timestamp: new Date().getTime(),
        idLocal: SelectLocal.idLocal,
        img:'',
        talento:talento,
        cargo
      })
    }

  }

  //Conviene que yo declare las señales y milagros que el dios altisimo ha hecho conmigo
  return (
    <div className='mt-4 container-fluid'>

      <button type="button" className="btn btn-outline" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Nuevo</button>
 







      <div className="mt-2">
        <div className="row margin-desk">
          <div className="form-group col-lg-6 col-md-6 col-sm-12">

            <input type="text" onChange={(e) => setFilterTecnico(Tecnico.filter(resp => resp.name.includes(e.target.value)))} placeholder='Buscar Tecnico' className='form-control' />
          </div>
        </div>
      </div>
      <div className="table-container  mr-3">
        <table className="table table-dark table-hover ">
          <thead>
            <tr>
            <th className='text-mobile text-table' scope="col th-sm"></th>
              <th className='text-mobile text-table' scope="col">ID</th>
           
              <th className='text-mobile text-table' scope="col th-sm">Nombre</th>
              <th className='text-mobile text-table' scope="col th-sm">Local</th>
              <th className='text-mobile text-table' scope="col th-sm">Cargo</th>
              <th className='text-mobile text-table' scope="col th-sm">Talento</th>
              <th className='text-mobile text-table' scope="col th-sm">Reparacion $</th>
              <th className='text-mobile text-table' scope="col th-sm">Total $</th>





            </tr>
          </thead>


          <tbody >
            {
              (FilterTecnico.map((resp, index) => (

                <tr key={index} className={'pointer'} onDoubleClick={() => setIsVisible({ IsVisible: true, idTecnico: resp.idDoc })}>
                           <td className='text-mobile text-table' ><img width={50}  className ={(resp.img) && 'img-thumbnail'} src={resp.img} /></td>
                   <th className='text-mobile text-table' scope="row">{resp.id}</th>
         
                  <td className='text-mobile text-table' >{resp.name}</td>
                  <td className='text-mobile text-table' >{resp.nameLocal}</td>
                  <td className='text-mobile text-table' >{resp.cargo}</td>
                  <td className='text-mobile text-table' >{resp.talento}</td>
                  <td className='text-mobile text-table' >{resp.total > 0 ? Number(resp.total / 2).toLocaleString('es',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2}) : 0}</td>
                  <td className='text-mobile text-table' >{Number(resp.total).toLocaleString('es',{style:'decimal',minimumFractionDigits:2,maximumFractionDigits:2})}</td>



                </tr>
              )))




            }
          </tbody>
        </table>

      </div>



      {
        (IsVisible.IsVisible) &&

        <div
          className="modal-report-container"
          id="modal-report-container"
          onClick={() => {
            setIsVisible({ IsVisible: false, idTecnico: '' })
          }}
        >
          <div className="modal-stand" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex  justify-content-between pb-5">
              <h5 className='ml-3 unseleted'>Retirar Fondo</h5>
              <button onClick={() => setIsVisible({ IsVisible: false, idTecnico: '' })} className='btn '>&times;</button>
            </div>

            <button className='btn btn-color m-auto' onClick={() => sacarFondo(IsVisible.idTecnico)}>GUARDAR</button>
          </div>
        </div>
      }



      <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Nuevo tecnico</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-8">
                    <div className="form-group">
                      <label htmlFor="recipient-name" className="col-form-label">ID</label>
                      <input type="text" value={id} onChange={(e) => onChangeForm(e.target.value, 'id')} className='form-control ' placeholder='ID' />

                    </div>
                  </div>
                  <div className="col-auto mb-3 align-self-end">
                  <div className="dropdown mobile-margin">
                    <button className="btn w-100 btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {SelectLocal?.name}
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      {
                        Local.map(({ idLocal, name }, index) => (
                          <a key={index} className="dropdown-item  pointer" onClick={() => setSelectLocal({ name, idLocal })}>{name}</a>
                        ))
                      }
                    </div>
                  </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">Nombre</label>

                  <input type="text" value={name} onChange={(e) => onChangeForm(e.target.value, 'name')} className='form-control' placeholder='Nombre' />

                </div>

          



                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">Cargo</label>

                  <input type="text" value={cargo} onChange={(e) => onChangeForm(e.target.value,'cargo')} className='form-control' placeholder='Cargo' />

                </div>

                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">Talento</label>

                  <input type="text" value={talento} onChange={(e) => onChangeForm(e.target.value, 'talento')} className='form-control' placeholder='Talento' />

                </div>

                
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">Foto</label>

                  <input type="file"  onChange={(e)=>cargarImagen(e.target.files!)} className='form-control' placeholder='Foto' />

                </div>

              </form>
            </div>
            <div className="modal-footer">

              <button type="button" onClick={create} className="btn btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
