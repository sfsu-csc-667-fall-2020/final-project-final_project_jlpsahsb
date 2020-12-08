import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
export default function Showmodel({ data }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <button className='btn btn-link p-0' onClick={handleShow}>
        Read more
</button>


      <Modal show={show} size="lg" centered  onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {data.itemName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
          <img src={data.picture} className='modelImg' alt={data.itemName} />
          </div>
<div className='w-75 mx-auto'>
<div className='mt-5'>
            {data.description}
          </div>
        <h3 className='font-weight-bold text-success'>
          $ {data.price}
        </h3>
</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
            </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

