import { collection, doc, getDoc, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState,useContext } from 'react'
import { app } from '../Firebase/conexion';
import { AppContext, context } from '../hooks/AppContext';


interface Props {
    idChat: string;
    idUser1: string;
    idUser2: string;
    onClick: () => void;
}
export const RowChat = ({ idChat, idUser1, idUser2, onClick }: Props) => {
    const [Name, setName] = useState('')
    const [Adress, setAdress] = useState('')
    const [lastMessage, setlastMessage] = useState('')

const {UserNameChat} = useContext(context)


    useEffect(() => {
        const db = getFirestore(app)
        const coll = collection(db, 'messages')

        const snap = query(coll, where('idChat', '==', idChat), limit(1),orderBy('timestamp','desc'))
        onSnapshot(snap, (resp) => {
            const messgan=resp.docs[0].get('message')
            setlastMessage(messgan)
        })

    }, [])

    useEffect(() => {
        const db = getFirestore(app)
        const coll = collection(db, 'UsersStore')
       
        const document = doc(coll, idUser1)
        getDoc(document).then(resp => {
            setName(resp.get('name'))
            UserNameChat(resp.get('name'))
            setAdress(resp.get('adress'))
        })
    }, [])

    return (
        <tr onClick={onClick} className='pointer'>
            <td className='text-mobile text-table' scope="row">{Name}</td>

            <td className='text-mobile text-table' scope="row">{Adress}</td>
            <td className='text-mobile text-table' scope="row">{(lastMessage.length>=20)? lastMessage.substring(0,20)+'...':lastMessage} </td>

        </tr>
    )
}
