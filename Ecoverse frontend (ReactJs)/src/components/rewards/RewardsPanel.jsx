import { Award, Gift } from "lucide-react";

const RewardsPanel = ({ onClose }) => {
  return (
    <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20">
      <div className="p-4 bg-green-50 dark:bg-green-900">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
            ECO Coins
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            &times;
          </button>
        </div>
        <div className="flex items-center mt-2">
          <Award className="h-6 w-6 text-yellow-500 mr-2" />
          <span className="text-xl font-bold">230</span>
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-medium mb-2 flex items-center">
          <Gift className="h-4 w-4 mr-1" />
          <span>Redeem Rewards</span>
          {/* make this a button that opens a modal with the rewards */}
        </h4>
      </div>
    </div>
  );
};

export default RewardsPanel;
