import { useState } from 'react'
import EmailSignup from './EmailSignup'

export default function Hero() {
  const [showSignup, setShowSignup] = useState(false)

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Expert{' '}
            <span className="text-gradient">
              AI Engineering
            </span>{' '}
            Consulting
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your business with cutting-edge AI solutions. Our team brings{' '}
            <strong>years of proven expertise</strong> in building production-ready AI applications
            that deliver real business value.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => setShowSignup(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              Get Started Today
            </button>
            <a
              href="#services"
              className="btn-secondary text-lg px-8 py-4"
            >
              Learn More
            </a>
          </div>

          {/* Quick email signup */}
          {!showSignup && (
            <div className="max-w-md mx-auto">
              <p className="text-sm text-gray-500 mb-3">
                Ready to discuss your AI project?
              </p>
              <button
                onClick={() => setShowSignup(true)}
                className="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                Enter your email for a free consultation
              </button>
            </div>
          )}

          {/* Email signup form */}
          {showSignup && (
            <div className="max-w-md mx-auto mt-8">
              <EmailSignup />
            </div>
          )}

          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Trusted by innovative companies</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-gray-400 font-semibold">Startups</div>
              <div className="text-gray-400 font-semibold">Enterprise</div>
              <div className="text-gray-400 font-semibold">Scale-ups</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}