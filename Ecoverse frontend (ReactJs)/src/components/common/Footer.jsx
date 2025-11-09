import { Leaf, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-green-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf size={24} />
              <span className="text-xl font-bold">EcoVerse</span>
            </div>
            <p className="text-green-100 mb-6">
              Sharing stories and making a positive impact on our planet, one
              post at a time.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-green-100 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-green-100 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-green-100 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-green-100 hover:text-white transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  // onClick={navigate("/")}
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Popular Posts
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Rewards
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Eco Initiatives
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Partners
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-200">
          <p>
            &copy; {new Date().getFullYear()} EcoSocial. All rights reserved.
          </p>
          <p className="mt-2 text-sm">
            Making the world greener, one post at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
