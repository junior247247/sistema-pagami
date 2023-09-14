
import React,{useContext} from 'react'
import { context } from '../hooks/AppContext'

export const Header = () => {
    const {state,signOut}=useContext(context);
  
   
    const showLateral=()=>{
      document.getElementById('lateral')!.style.width='300px';
      document.getElementById('lateral')!.style.display='block';
      document.getElementById('transp')!.style.display='block';
    
    }


  return (
    <header className="d-flex  border-bottom align-items-center justify-content-between">
      <div className="menu" onClick={showLateral}>
          <div className="menu-line "/>
          <div className="menu-line "/>
          <div className="menu-line "/>
      </div>
        <h1 className='text-white font-size-header'>{state.state}</h1>

       
       <img onClick={signOut} className='pointer' width={30} src={require('../img/cierre.png')}  />
     
      


        
       
      
    </header>
   
   )
    
  
}
