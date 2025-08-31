import React from "react";
import Navbar from "../components/Navbar";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-orange-200 text-white py-24 px-6 text-center relative overflow-hidden">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
        <span className="text-orange-500">About</span> <span className="text-black">Rajapaksha Foods</span>
        </h1>

        <p className="text-lg md:text-2xl max-w-2xl mx-auto drop-shadow-md text-black">
        Bringing Authentic Sri Lankan Spices and Food Products to Your Table.
        </p>

        <div className="absolute -top-20 -left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply opacity-30 animate-pulse"></div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 md:px-20 text-center">
        <h2 className="text-4xl font-bold text-orange-500 mb-6">Our Mission</h2>
        <p className="text-black max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
          At Rajapaksha Foods, our mission is to provide high-quality, authentic Sri
          Lankan spices and food products that bring the taste of Sri Lanka to every
          home. We believe in sustainability, local sourcing, and supporting farmers
          to ensure freshness, flavor, and a positive impact on the community.
        </p>
      </section>

      {/* Vision Section */}
      <section className="bg-white py-20 px-6 md:px-20 text-center">
        <h2 className="text-4xl font-bold text-orange-500 mb-6">Our Vision</h2>
        <p className="text-black max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
          To be the most trusted Sri Lankan food brand worldwide, delivering
          excellence, authenticity, and the true taste of Sri Lanka to every
          kitchen.
        </p>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-6 md:px-20 bg-amber-50">
        <h2 className="text-4xl font-bold text-orange-500 text-center mb-12">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 transform transition duration-300">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">Quality</h3>
            <p className="text-black leading-relaxed">
              Every product is carefully selected and sourced to ensure premium
              quality and authenticity.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 transform transition duration-300">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">Integrity</h3>
            <p className="text-black leading-relaxed">
              We operate with transparency, honesty, and fairness in everything we
              do.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 transform transition duration-300">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">Sustainability</h3>
            <p className="text-black leading-relaxed">
              Supporting local farmers and eco-friendly practices to protect our
              environment and community.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <h2 className="text-4xl font-bold text-orange-500 text-center mb-12">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Team Member */}
          <div className="bg-orange-50 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transform transition duration-300">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
              <img
                src="https://via.placeholder.com/150"
                alt="CEO"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-black">Naduli Weerasinghe</h3>
            <p className="text-orange-500">Founder & CEO</p>
          </div>

          <div className="bg-orange-50 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transform transition duration-300">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
              <img
                src="https://via.placeholder.com/150"
                alt="Marketing Head"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-black">Sewmini Tharushika</h3>
            <p className="text-orange-500">Head of Marketing</p>
          </div>

          <div className="bg-orange-50 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transform transition duration-300">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
              <img
                src="https://via.placeholder.com/150"
                alt="Operations Head"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-black">Kamal Perera</h3>
            <p className="text-orange-500">Head of Operations</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-20 bg-orange-300 text-white text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Join Us on Our Journey
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          Explore the authentic taste of Sri Lanka and bring it to your kitchen.
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-4 bg-white text-orange-500 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}
