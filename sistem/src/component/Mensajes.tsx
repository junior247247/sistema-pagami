import React, { useContext, useEffect, useState } from 'react'
import { context } from '../hooks/AppContext'
import { collection, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { app } from '../Firebase/conexion';
import { RowChat } from './RowChat';

import { Modal, ModalBody, ModalDialog } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { Indicators } from './indicator/Indicators';

interface Chat {
  localId: string;
  userId: string;
  idChat: string;
}

export const Mensajes = () => {
  const { onChange, setChat, state, setUserChat } = useContext(context)
  const [Chats, setChats] = useState<Chat[]>([])

  const showChat = (idChat: string, idUser: string) => {
    setChat(idChat)
    setUserChat(idUser)
    const window = document.getElementById('chat-windows')
    window!.style.display = 'flex'
  }
  useEffect(() => {
    onChange('Mensajes')
  }, [])

  useEffect(() => {
     const db=getFirestore(app)
     const coll=collection(db,'chats') 
     console.log(localStorage.getItem('idLogin'))    

     //aLjhulxq0KP1Gm2ymF375g6ORgo2
     const Q=query(coll,where('localId','==',localStorage.getItem('idLogin')),orderBy('timestamp','desc'))
     onSnapshot(Q,(resp)=>{
       const data:Chat[]=resp.docs.map(res=>{
         return{
           idChat:res.get('idChat'),
           userId:res.get('userId'),
           localId:res.get('localId')
         }
     
       })
       console.log(data)
       setChats(data)
     })
   }, [])



  return (
    <div>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-4">
            <div className="form-group ">
              <p className='text-white'>Buscar</p>
              <input type="text" placeholder='Escribe el nombre de el cliente' className='form-control' />
            </div>
          </div>
        </div>
      </div>


      <div className='ml-3 mr-3 mt-3  table-container'>








        <table className="table table-dark table-hover ">
          <thead>
            <tr>
              <th className='text-mobile text-table' scope="col">Nombre</th>
              <th className='text-mobile text-table' scope="col">Direccion</th>
              <th className='text-mobile text-table' scope="col">Mensaje</th>

            </tr>
          </thead>
          <tbody >

            {
              Chats.map((item, index) => (
                <RowChat onClick={() => { showChat(item.idChat, item.userId); }} key={index} idChat={item.idChat} idUser1={item.userId} idUser2={item.localId} />
              ))
            }





          </tbody>
        </table>


      </div>
      

    </div>
  )
}
