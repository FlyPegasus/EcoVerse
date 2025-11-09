import { Leaf, TrendingUp, Award } from "lucide-react";

const About = () => {
  return (
    <div className="relative pt-24 pb-12 overflow-hidden bg-gradient-to-br from-green-800 to-green-600">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-white"></div>
        <div className="absolute top-3/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-white"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center text-white">
          <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Leaf size={16} className="mr-2" />
            <span className="text-sm font-medium">
              Join the ecological movement
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Share Your Green Story, Earn
            <span className="text-green-300">.</span> Impact
            <span className="text-green-300">.</span> Connect
            <span className="text-green-300">.</span>
          </h1>

          <p className="text-lg md:text-xl text-green-100 mb-8">
            A community where your environmental actions are rewarded and your
            sustainable stories inspire others.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-white text-green-700 hover:bg-green-100 font-medium px-6 py-3 rounded-lg transition-colors">
              Start Posting
            </button>
            <button className="w-full sm:w-auto bg-green-700 text-white border border-white hover:bg-green-800 font-medium px-6 py-3 rounded-lg transition-colors">
              Explore Content
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Leaf size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Earn Eco Coins</h3>
            <p className="text-green-100">
              Get rewarded with eco coins for every post, like, and meaningful
              interaction.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Grow Your Impact</h3>
            <p className="text-green-100">
              Watch your ecological footprint improve as you engage with
              sustainable content.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Redeem Rewards</h3>
            <p className="text-green-100">
              Exchange your eco coins for sustainable products, discounts, and
              special perks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
