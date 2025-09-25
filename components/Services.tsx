import { useState } from 'react'
import EmailSignup from './EmailSignup'

export default function Services() {
  const [showContactForm, setShowContactForm] = useState(false)

  const services = [
    {
      title: "AI Strategy & Consulting",
      description: "Define your AI roadmap with expert guidance on technology selection, implementation strategy, and ROI optimization.",
      features: [
        "AI readiness assessment",
        "Technology roadmapping",
        "Business case development",
        "Risk assessment & mitigation"
      ]
    },
    {
      title: "Custom AI Development",
      description: "Build production-ready AI applications tailored to your specific business needs and requirements.",
      features: [
        "Machine learning models",
        "Natural language processing",
        "Computer vision solutions",
        "Recommendation systems"
      ]
    },
    {
      title: "AI Integration & Deployment",
      description: "Seamlessly integrate AI capabilities into your existing systems with robust, scalable architecture.",
      features: [
        "API development & integration",
        "Cloud deployment & scaling",
        "Performance optimization",
        "Security & compliance"
      ]
    },
    {
      title: "MLOps & Maintenance",
      description: "Ensure your AI systems perform reliably with comprehensive monitoring, updates, and optimization.",
      features: [
        "Model monitoring & retraining",
        "Performance analytics",
        "Automated testing & validation",
        "24/7 support & maintenance"
      ]
    }
  ]

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive AI Engineering Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From initial strategy to ongoing maintenance, we provide end-to-end AI solutions that drive measurable business results.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <span className="text-primary-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Process overview */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Our Proven AI Development Process
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Discovery", desc: "Understand your business needs and AI opportunities" },
              { step: "2", title: "Design", desc: "Architect the optimal AI solution for your requirements" },
              { step: "3", title: "Develop", desc: "Build and train AI models using best practices" },
              { step: "4", title: "Deploy", desc: "Launch and monitor your AI solution in production" }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {phase.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{phase.title}</h4>
                <p className="text-sm text-gray-600">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Business with AI?
          </h3>
          <p className="text-gray-600 mb-8">
            Let&apos;s discuss how our AI expertise can solve your specific challenges.
          </p>

          {!showContactForm ? (
            <button
              onClick={() => setShowContactForm(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Your AI Project
            </button>
          ) : (
            <div className="max-w-md mx-auto">
              <EmailSignup />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}