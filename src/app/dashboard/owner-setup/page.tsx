'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface SetupForm {
  // Basic Info
  generatorDetails: {
    model: string
    wattage: number
    condition: 'new' | 'like-new' | 'good' | 'fair'
    description: string
  }
  // Location
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    serviceRadius: number
    longitude: number | null
    latitude: number | null
  }
  // Simple pricing
  pricing: {
    dailyRate: number
  }
  // Simple availability
  isAvailable: boolean
}

export default function OwnerSetup() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<SetupForm>({
    generatorDetails: {
      model: '',
      wattage: 0,
      condition: 'good',
      description: ''
    },
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      serviceRadius: 15,
      longitude: null,
      latitude: null
    },
    pricing: {
      dailyRate: 0
    },
    isAvailable: true
  })

  const steps = [
    'Generator Details',
    'Location',
    'Review'
  ]

  // Keep your existing handleNext and handleBack functions

  const calculateSuggestedPricing = (wattage: number, condition: string) => {
    const baseRate = wattage < 7500 ? 40 : 
                    wattage < 12000 ? 70 :
                    wattage < 15000 ? 100 : 150
    
    const conditionMultiplier = 
      condition === 'new' ? 1.2 :
      condition === 'like-new' ? 1.1 :
      condition === 'good' ? 1.0 : 0.9

    return Math.round(baseRate * conditionMultiplier)
  }

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Generator Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Generator Model
              </label>
              <input
                type="text"
                value={form.generatorDetails.model}
                onChange={(e) => setForm({
                  ...form,
                  generatorDetails: {
                    ...form.generatorDetails,
                    model: e.target.value
                  }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., Honda EU2200i"
              />
            </div>

            {/* Keep your existing wattage, condition, and description inputs */}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Location</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                value={form.location.address}
                onChange={(e) => setForm({
                  ...form,
                  location: {
                    ...form.location,
                    address: e.target.value
                  }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="123 Main St"
              />
            </div>

            {/* Keep your existing city, state, ZIP inputs */}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Radius (miles)
              </label>
              <input
                type="number"
                value={form.location.serviceRadius}
                onChange={(e) => setForm({
                  ...form,
                  location: {
                    ...form.location,
                    serviceRadius: parseInt(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Daily Rate (Suggested: ${calculateSuggestedPricing(form.generatorDetails.wattage, form.generatorDetails.condition)})
              </label>
              <input
                type="number"
                value={form.pricing.dailyRate || ''}
                onChange={(e) => setForm({
                  ...form,
                  pricing: {
                    dailyRate: parseFloat(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="100"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review Your Listing</h2>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Generator Details</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  {/* Keep your existing review fields but remove complex ones */}
                </dl>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                currentStep > index + 1 ? 'bg-blue-600 text-white' :
                currentStep === index + 1 ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">{step}</span>
              {index < steps.length - 1 && (
                <div className="w-12 h-1 mx-4 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={(e) => e.preventDefault()}>
        {renderStep()}
        
        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                // Add your form submission logic here
                setLoading(true);
                // Handle form submission
              }}
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Listing'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}