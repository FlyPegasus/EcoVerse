import { Leaf, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const ecoCoins = 100; // Example eco coins, replace with actual state management

const RewardCard = ({ reward }) => {
  const hasEnoughCoins = ecoCoins >= reward.cost;
  const handleRedeem = () => {
    if (hasEnoughCoins) {
      // Show success toast/modal (simplistic implementation)
      alert(`Successfully redeemed: ${reward.title}`);
      //   toast.success(`Successfully redeemed: ${reward.title}`);
      // Deduct coins
      //   addEcoCoins(-reward.cost);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img
          src={reward.image}
          alt={reward.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900">{reward.title}</h3>
          <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
            <Leaf size={14} className="mr-1" />
            <span className="font-medium">{reward.cost}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{reward.description}</p>

        {!hasEnoughCoins && (
          <div className="flex items-center text-amber-600 text-sm mb-4">
            <AlertCircle size={16} className="mr-1" />
            <span>You need {reward.cost - ecoCoins} more eco coins</span>
          </div>
        )}

        <button
          onClick={handleRedeem}
          disabled={!hasEnoughCoins}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            hasEnoughCoins
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {hasEnoughCoins ? "Redeem Reward" : "Not Enough Coins"}
        </button>
      </div>
    </div>
  );
};

export default RewardCard;
