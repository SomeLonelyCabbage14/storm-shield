'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGenerator } from '@/lib/supabase/api';

const generatorSchema = z.object({
  model: z.string().min(1, 'Generator model is required'),
  wattage: z.string().min(1, 'Wattage is required').transform(Number),
  condition: z.enum(['new', 'like-new', 'good', 'fair']),
  description: z.string().optional(),
  daily_rate: z.string()
    .min(1, 'Daily rate is required')
    .transform(Number)
    .refine((n) => n > 0, 'Daily rate must be greater than 0'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(5, 'ZIP code must be at least 5 characters'),
});

type FormData = z.infer<typeof generatorSchema>;

interface GeneratorListingFormProps {
  userId: string;
}

const GeneratorListingForm = ({ userId }: GeneratorListingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(generatorSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createGenerator({
        owner_id: userId,
        ...data,
        description: data.description || null,  // Convert undefined to null
        is_available: true,
      });
      
      reset();
    } catch (error) {
      console.error('Failed to create generator listing:', error);
      throw new Error('Failed to create listing');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">List Your Generator</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Generator Model
          </label>
          <input
            id="model"
            {...register('model')}
            placeholder="e.g., Honda EU2200i"
            className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          {errors.model && (
            <p className="text-sm text-red-600">{errors.model.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="wattage" className="block text-sm font-medium text-gray-700">
            Wattage
          </label>
          <input
            id="wattage"
            type="number"
            {...register('wattage')}
            placeholder="e.g., 2200"
            className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          {errors.wattage && (
            <p className="text-sm text-red-600">{errors.wattage.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            Condition
          </label>
          <select
            id="condition"
            {...register('condition')}
            className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
          {errors.condition && (
            <p className="text-sm text-red-600">{errors.condition.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Describe your generator's features and condition..."
            rows={4}
            className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="daily_rate" className="block text-sm font-medium text-gray-700">
            Daily Rate ($)
          </label>
          <input
            id="daily_rate"
            type="number"
            step="0.01"
            {...register('daily_rate')}
            placeholder="e.g., 50.00"
            className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          {errors.daily_rate && (
            <p className="text-sm text-red-600">{errors.daily_rate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            id="address"
            {...register('address')}
            placeholder="Street address"
            className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              id="city"
              {...register('city')}
              className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              id="state"
              {...register('state')}
              className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            {errors.state && (
              <p className="text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">
            ZIP Code
          </label>
          <input
            id="zip_code"
            {...register('zip_code')}
            className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          {errors.zip_code && (
            <p className="text-sm text-red-600">{errors.zip_code.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Listing Generator...' : 'List Generator'}
        </button>
      </form>
    </div>
  );
};

export default GeneratorListingForm;