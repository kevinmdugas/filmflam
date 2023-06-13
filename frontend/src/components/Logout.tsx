// import { useState } from 'react';
//
// export const Logout = () => {
//     const [showAlert, setShowAlert] = useState(true);
//
//     const handleLogout = () => {
//         console.log('Execute function');
//         setShowAlert(false);
//     };
//
//     const handleCancel = () => {
//         console.log('Cancel');
//         setShowAlert(false);
//     };
//
//     return (
//         <div>
//             <button onClick={() => setShowAlert(true)}>Show Alert</button>
//             {showAlert && (
//                 <div className="modal" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
//                     <div className="modal-dialog" role="document">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Log Out</h5>
//                             </div>
//                             <div className="modal-body">
//                                 <p>Are you sure you want to log out?</p>
//                             </div>
//                             <div className="modal-footer">
//                                 <button type="button" className="btn btn-primary" onClick={handleLogout}>
//                                     Yes
//                                 </button>
//                                 <button type="button" className="btn btn-secondary" onClick={handleCancel}>
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {showAlert && <div className="modal-backdrop fade show" />}
//         </div>
//     );
// };
