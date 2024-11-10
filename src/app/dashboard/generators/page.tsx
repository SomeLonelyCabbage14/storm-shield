import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { createGenerator } from '@/lib/supabase/api';

type FormData = {
  model: string;
  wattage: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  description: string;
  daily_rate: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
};

const GeneratorListingForm = ({ userId }: { userId: string }) => {
  const [formData, setFormData] = useState<FormData>({
    model: '',
    wattage: '',
    condition: 'new',
    description: '',
    daily_rate: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      condition: value as FormData['condition']
    }));
  };

  const validateForm = () => {
    if (!formData.model.trim()) return 'Generator model is required';
    if (!formData.wattage || isNaN(Number(formData.wattage))) return 'Valid wattage is required';
    if (!formData.condition) return 'Condition is required';
    if (!formData.daily_rate || isNaN(Number(formData.daily_rate))) return 'Valid daily rate is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.city.trim()) return 'City is required';
    if (!formData.state.trim()) return 'State is required';
    if (!formData.zip_code.trim()) return 'ZIP code is required';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await createGenerator({
        owner_id: userId,
        model: formData.model,
        wattage: parseInt(formData.wattage),
        condition: formData.condition,
        description: formData.description,
        daily_rate: parseFloat(formData.daily_rate),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        is_available: true
      });

      setIsSuccess(true);
      setFormData({
        model: '',
        wattage: '',
        condition: 'new',
        description: '',
        daily_rate: '',
        address: '',
        city: '',
        state: '',
        zip_code: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>List Your Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Generator listed successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="model">Generator Model</Label>
            <Input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., Honda EU2200i"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wattage">Wattage</Label>
            <Input
              id="wattage"
              name="wattage"
              type="number"
              value={formData.wattage}
              onChange={handleChange}
              placeholder="e.g., 2200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={formData.condition}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like-new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your generator's features and condition..."
              className="h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="daily_rate">Daily Rate ($)</Label>
            <Input
              id="daily_rate"
              name="daily_rate"
              type="number"
              step="0.01"
              value={formData.daily_rate}
              onChange={handleChange}
              placeholder="e.g., 50.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip_code">ZIP Code</Label>
            <Input
              id="zip_code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Listing Generator...' : 'List Generator'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GeneratorListingForm;