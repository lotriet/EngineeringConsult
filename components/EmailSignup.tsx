import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface EmailFormData {
  email: string
  name?: string
}

export default function EmailSignup() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EmailFormData>()

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true)

    try {
      // Simulate API call - replace with your actual email service
      console.log('Email signup:', data)

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
        <div className="text-green-600 text-2xl mb-2">✓</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Thank you!
        </h3>
        <p className="text-green-700">
          We&apos;ll be in touch soon to discuss your AI project.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-green-600 hover:text-green-700 text-sm mt-2 underline"
        >
          Submit another email
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Free AI Consultation
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="input-field"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className={`input-field ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
            placeholder="your.email@company.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`btn-primary w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Submitting...' : 'Get Free Consultation'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          No spam, just valuable AI insights and consultation opportunities.
        </p>
      </form>
    </div>
  )
}