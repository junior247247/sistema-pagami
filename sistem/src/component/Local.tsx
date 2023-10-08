import { Firestore, getFirestore, collection, onSnapshot, orderBy, query, addDoc, where, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react'
import { app } from '../Firebase/conexion';
import { context } from '../hooks/AppContext'
import { useForm } from '../hooks/useForm';
import { async } from '@firebase/util';
import { Indicators } from './indicator/Indicators';



interface Local {
  id: string;
  name: string;
  idLocal: string;
}

export const Local = () => {

  const { onChange, state: { idLoca }, login } = useContext(context);
  const [Local, setLocal] = useState<Local[]>([]);
  const { name, email, pass, passConfirm, clear, onChange: onChangeForm } = useForm({ name: '', email: '', pass: '', passConfirm: '' });
  const [IsLoading, setIsLoading] = useState(false)
  const [Name, setName] = useState('')
  const [Email, setEmail] = useState('')

  useEffect(() => {
    onChange('Local');

  }, [])



  const create = async () => {
    if (name == '' && pass == '' && passConfirm == '' && email == '') return alert('Debes ingresar el nombre');
    if (pass != passConfirm) return alert('Las contraseñas no coinciden');
    setIsLoading(true)
    const db = getFirestore(app);
    const coll = collection(db, 'Local');


    const auth = getAuth(app);

    const resp = await createUserWithEmailAndPassword(auth, email, pass);
    setDoc(doc(db,'Users',resp.user.uid),{
      name,
      email,
      timestamp: new Date().getTime(),
      idLocal: resp.user.uid
    })
    addDoc(coll, {
      name,
      email,
      timestamp: new Date().getTime(),
      idLocal: resp.user.uid
    })
    setIsLoading(false)
    clear()

  }


  useEffect(() => {
    const db = getFirestore(app);
    const coll = collection(db, 'Local');
    const Q = query(coll, orderBy('timestamp', 'desc'));


    onSnapshot(Q, (resp) => {
      const data: Local[] = resp.docs.map(res => {
        return {
          id: res.id,
          name: res.get('name'),
          idLocal: res.get('idLocal')
        }
      })
      setLocal(data);
    })

  }, [])

  const disActive = () => {
    const btn = document.querySelectorAll('.local');
    btn.forEach(btn => {
      btn.classList.remove('bg-main-2')
      btn.classList.remove('border')
      // btn.classList.add('bg-main')
    })
  }





  const click = () => {
    const tr = document.querySelectorAll('.local')
    tr.forEach(el => {
      el.addEventListener('click', (e) => {

        disActive()
        el.classList.add('bg-main-2')

      })

    })


  }

  useEffect(() => {
    click()


  }, [])



  return (
    <div className='container-fluid'>
      <div className="container  mt-3 ml-0 ">


    


        <div className="row mt-3">
          <div className="col-1">
            <div className="form-group row ">
              <button  className='btn btn-outline-light' data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Nuevo</button>
            </div>
          </div>
        </div>
      </div>



      <div className="table-container col-12 mt-3  mr-3">
        <table className="table  table-dark table-hover ">
          <thead>
            <tr>

              <th scope="col th-sm">Nombre</th>
            </tr>
          </thead>
          <tbody >
            {
              (Local.map((resp, index) => (

                <tr id={index.toString()} onClick={(e) => {
                  e.stopPropagation()
                  const a = document.getElementById(index.toString())
                  disActive()
                a!.classList.add('bg-main-2')
                  a?.classList.add('border')
                  login(resp.idLocal)
             

                }} key={index} className={(resp.idLocal == idLoca) ? 'pointer bg-primary ':''} >
                  <td scope="row" className={''}>{resp.name}</td>
                </tr>
              )))
            }
          </tbody>
        </table>

      </div>


      <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Nuevo local</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label className="col-form-label">Nombre</label>
                                    <input placeholder='Escriba el nombre' value={name} onChange={(e) => onChangeForm(e.target.value, 'name')} type="text" className='form-control' />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Email</label>
                                    <input placeholder='Escriba un correo' value={email} onChange={(e) => onChangeForm(e.target.value, 'email')} type="text" className='form-control ' />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Contraseña</label>
                                    <input placeholder='Escriba una contraseña' value={pass} onChange={(e) => onChangeForm(e.target.value, 'pass')} type='password' className='form-control ' />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label">Confirmar contraseña</label>
                                    <input placeholder='Confirme la contraseña' value={passConfirm} onChange={(e) => onChangeForm(e.target.value, 'passConfirm')} type='password' className='form-control ' />

                                </div>
                           


                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={()=>create()} className="btn btn-primary"   data-dismiss={ (name && email  && pass && passConfirm ) && "modal"} aria-label="Close">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>


            {
              (IsLoading) && <Indicators/>
            }

    </div>
  )
}
