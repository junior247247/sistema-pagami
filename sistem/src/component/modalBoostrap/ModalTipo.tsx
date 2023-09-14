import React,{useEffect} from 'react'

export const ModalTipo = () => {

    

    useEffect(() => {
        // Obtener una referencia al modal por su ID
        const modal = document.getElementById("a");
        
        // Activar el modal
        if (modal) {
            modal.style.display='none'
        }
      }, [])



    return (


        <div className="modal fade" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Tipo reparacion</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <div className="container-fluid">
                        <div className="col-lg">
                                    <img className='img-thumbnail' src='https://firebasestorage.googleapis.com/v0/b/sistem-34148.appspot.com/o/images%2Fasd?alt=media&token=6cae97d6-b492-49da-b5b4-00301ce51c8c' />

                                </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <p><strong>Description:</strong>{'asda'}</p>
                                    <p><strong>Observacion: </strong>{'ads'}</p>
                                </div>
                             
                            </div>
                        </div>


                    </div>
                   
                </div>
            </div>
        </div>


    )
}
