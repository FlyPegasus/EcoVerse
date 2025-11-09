import RewardsGrid from "../components/rewards/RewardsGrid";

const mockRewards = [
  {
    id: "1",
    title: "Eco Hero Certificate",
    description:
      "Digital certificate recognizing your contribution to environmental sustainability.",
    image: "https://images.pexels.com/photos/6457480/pexels-photo-6457480.jpeg",
    cost: 100,
    category: "certificate",
  },
  {
    id: "2",
    title: "15% Off Eco-Friendly Products",
    description:
      "Discount coupon for sustainable products from our partner stores.",
    image: "https://images.pexels.com/photos/6417921/pexels-photo-6417921.jpeg",
    cost: 200,
    category: "discount",
  },
  {
    id: "3",
    title: "Premium Membership (1 Month)",
    description:
      "Ad-free experience, exclusive content, and advanced analytics.",
    image: "https://images.pexels.com/photos/5971330/pexels-photo-5971330.jpeg",
    cost: 500,
    category: "premium",
  },
  {
    id: "4",
    title: "Plant a Tree in Your Name",
    description:
      "We'll plant a real tree and send you its GPS coordinates and updates.",
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
    cost: 300,
    category: "product",
  },
  {
    id: "5",
    title: "Reusable Eco Kit",
    description:
      "Complete kit with bamboo utensils, stainless steel straw, and cotton produce bags.",
    image: "https://images.pexels.com/photos/4046788/pexels-photo-4046788.jpeg",
    cost: 450,
    category: "product",
  },
  {
    id: "6",
    title: "Verified Climate Action Badge",
    description:
      "Exclusive profile badge showcasing your commitment to climate action.",
    image:
      "https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg",
    cost: 250,
    category: "certificate",
  },
];

const RewardsRedeem = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Redeem Your Eco Coins
          </h1>
          <p className="text-gray-600 text-lg">
            Turn your environmental contributions into meaningful rewards. From
            certificates to premium features, your eco coins can make a
            difference.
          </p>
        </div>
      </div>

      <RewardsGrid rewards={mockRewards} />
    </div>
  );
};

export default RewardsRedeem;
