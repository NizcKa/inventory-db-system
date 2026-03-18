// modal popup ofr confirming deletion
import React from 'react';

const DeleteModal = ({ show, onClose, onConfirm }) => {
    if (!show) return null; // only render if visible

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Delete</h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body">
                        <p>Are you sure you want to delete?</p>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="btn btn-danger" onClick={onConfirm}>
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;