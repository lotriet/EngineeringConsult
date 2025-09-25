export default function ValueProposition() {
  const benefits = [
    {
      icon: "⚡",
      title: "Years of Expertise",
      description: "Deep experience building production AI applications across industries, from startups to enterprise."
    },
    {
      icon: "🎯",
      title: "Proven Results",
      description: "Track record of delivering AI solutions that drive real business outcomes and ROI."
    },
    {
      icon: "🔧",
      title: "End-to-End Solutions",
      description: "From strategy to deployment - we handle the complete AI development lifecycle."
    },
    {
      icon: "⚡",
      title: "Fast Time-to-Market",
      description: "Accelerate your AI initiatives with our battle-tested frameworks and methodologies."
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our AI Engineering Expertise?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We don&apos;t just build AI applications - we craft intelligent solutions that transform your business operations and unlock new opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Experience highlights */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 lg:p-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Battle-Tested AI Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">5+</div>
                <div className="text-gray-700">Years Building AI</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">100+</div>
                <div className="text-gray-700">AI Projects Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                <div className="text-gray-700">Support & Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology expertise */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Technologies We Master
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'TensorFlow', 'PyTorch', 'OpenAI API', 'Hugging Face',
              'LangChain', 'Vector Databases', 'MLOps', 'Cloud AI Services'
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}