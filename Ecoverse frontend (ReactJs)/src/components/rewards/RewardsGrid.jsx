import { useState } from "react";
import RewardCard from "./RewardCard";
import { Leaf, Filter } from "lucide-react";
import { useSelector } from "react-redux";

const RewardsGrid = ({ rewards }) => {
  const [categoryFilter, setCategoryFilter] = useState(null);
  const filteredRewards = categoryFilter
    ? rewards.filter((reward) => reward.category === categoryFilter)
    : rewards;
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const { user, userProfile } = useSelector((store) => store.auth);
  const toggleFilterMenu = () => {
    setFilterMenuOpen(!filterMenuOpen);
  };
  const handleFilterChange = (category) => {
    setCategoryFilter(category);
    setFilterMenuOpen(false);
  };

  const categories = [
    { id: "certificate", label: "Certificates" },
    { id: "discount", label: "Discounts" },
    { id: "premium", label: "Premium" },
    { id: "product", label: "Products" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Rewards Marketplace
          </h2>
          <p className="text-gray-600">
            Exchange your eco coins for sustainable rewards
          </p>
        </div>

        <div className="flex items-center mt-4 md:mt-0">
          <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full mr-4">
            <Leaf size={18} className="mr-2" />
            <span className="font-medium">Your Balance: {user.ecoPoints}</span>
          </div>

          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={toggleFilterMenu}
            >
              <Filter size={16} />
              <span>
                {categoryFilter
                  ? categories.find((c) => c.id === categoryFilter)?.label
                  : "All Rewards"}
              </span>
            </button>

            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      categoryFilter === null
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => handleFilterChange(null)}
                  >
                    All Rewards
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`block px-4 py-2 text-sm text-left w-full ${
                        categoryFilter === category.id
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => handleFilterChange(category.id)}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredRewards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No rewards found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardsGrid;
