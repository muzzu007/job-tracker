import "../stylesheet/DeleteModal.css";
import { FaExclamationTriangle, FaTimes, FaTrash  } from "react-icons/fa";

function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    company
}) {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">

            <div className="modal">

                <h2 className="modal-title">
                <FaExclamationTriangle className="warning-icon" />
                Delete Application?
                </h2>

                <p>
                    Are you sure you want to delete
                    <strong> {company}</strong>?
                </p>

                <p className="warning">
                    This action cannot be undone.
                </p>

                <div className="modal-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                       <FaTimes/> Cancel
                    </button>

                    <button
                        className="confirm-delete-btn"
                        onClick={onConfirm}
                    >
                        <FaTrash />
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
}

export default DeleteModal;