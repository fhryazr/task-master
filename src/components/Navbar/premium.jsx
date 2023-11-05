/* eslint-disable react/prop-types */
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const SubscriptionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded-lg shadow-md w-full max-w-md text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800">Premium</h2>
        <p className="text-sm text-gray-600 mt-2">Your Now Is Premium</p>
        <div className="text-4xl font-bold my-5">
          $29<span className="text-xl text-gray-600">/month</span>
        </div>
        <ul className="text-left list-none p-0">
          <li className="mb-2 text-gray-800">Individual configuration</li>
          <li className="mb-2 text-gray-800">No setup, or hidden fees</li>
          <li className="mb-2 text-gray-800">Team size: 1 developer</li>
          <li className="mb-2 text-gray-800">Premium support: 6 months</li>
          <li className="mb-2 text-gray-800">Free updates: 6 months</li>
        </ul>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-none border-none text-2xl cursor-pointer text-black"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

const Premium = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button onClick={handleOpenModal} style={{ color: "white" }}>
        Premium
      </button>
      <SubscriptionModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};
export default Premium;
