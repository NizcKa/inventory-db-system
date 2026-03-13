// modal for delete prompt
import React from "react";

const ConfirmModal = ({ onConfirm, message }) => {
  return (
    <div className="modal fade" id="confirmDeleteModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Action</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-target="#confirmDeleteModal" data-bs-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={onConfirm}>Confirm Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;