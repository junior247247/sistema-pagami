import React from 'react'
import { Modal, ModalBody, ModalDialog } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

export const Indicators = () => {
    return (
        <Modal show={true} dialogClassName='bg-transparent' contentClassName="bg-transparent border-0" size='lg' centered  >
            <ModalBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner style={{ height: 50, width: 50, color: '#FEAA45' }} color='white' animation="border" role="status" >
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </ModalBody>
        </Modal>
    )
}
