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
        <div className="text-4xl font-bold my-5">Premium</div>
        <ul className="text-left list-none px-1">Unlocked Premium Features
          <li className="mb-2 text-gray-800"> - Premiumn Background</li>
          <li className="mb-2 text-gray-800"> - Premium Ambient</li>
          <li className="mb-2 text-gray-800"> - Voice Command</li>
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
