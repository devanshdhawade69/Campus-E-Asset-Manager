import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Item } from '../types';

const validationSchema = Yup.object({
  deviceType: Yup.string().required('Device type is required'),
  serialNumber: Yup.string().required('Serial number is required'),
  condition: Yup.string().required('Condition is required'),
  disposalMethod: Yup.string().required('Disposal method is required'),
  additionalNotes: Yup.string(),
  location: Yup.string(),
  responsibleDept: Yup.string(),
});

export default function ItemForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<Item>({
    deviceType: '',
    serialNumber: '',
    condition: '',
    disposalMethod: '',
    additionalNotes: '',
    location: '',
    responsibleDept: '',
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/items`)
        .then(({ data }) => {
          const item = data.find((i: Item) => i._id === id);
          if (item) setInitialValues(item);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load item.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (values: Item) => {
    try {
      if (id) {
        await api.put(`/items/${id}`, values);
      } else {
        await api.post('/items', values);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save item');
    }
  };

  if (loading) return <div className="dark-page"><div className="loading-spinner"></div></div>;

  return (
    <div className="dark-page p-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '2rem' }}>
      <motion.div 
        className="glass-card glow-border max-w-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl mb-4">{id ? 'Edit E-Waste Item' : 'Add E-Waste Item'}</h2>
        
        {error && <div className="error-msg mb-4">{error}</div>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              <div className="form-group">
                <label>Device Type</label>
                <Field name="deviceType" className="form-input" placeholder="e.g., Laptop, Monitor" />
                <ErrorMessage name="deviceType" component="div" className="field-error" />
              </div>
              
              <div className="form-group">
                <label>Serial Number</label>
                <Field name="serialNumber" className="form-input" placeholder="Enter serial or asset tag" />
                <ErrorMessage name="serialNumber" component="div" className="field-error" />
              </div>
              
              <div className="form-group">
                <label>Condition</label>
                <Field as="select" name="condition" className="form-input">
                  <option value="" disabled>Select condition</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Broken">Broken</option>
                </Field>
                <ErrorMessage name="condition" component="div" className="field-error" />
              </div>
              
              <div className="form-group">
                <label>Disposal Method</label>
                <Field as="select" name="disposalMethod" className="form-input">
                  <option value="" disabled>Select method</option>
                  <option value="Recycle">Recycle</option>
                  <option value="Refurbish">Refurbish</option>
                  <option value="Donate">Donate</option>
                  <option value="Dispose">Dispose (Landfill)</option>
                </Field>
                <ErrorMessage name="disposalMethod" component="div" className="field-error" />
              </div>

              <div className="form-group">
                <label>Location (Optional)</label>
                <Field name="location" className="form-input" placeholder="e.g., Building A, Room 101" />
              </div>

              <div className="form-group">
                <label>Responsible Department (Optional)</label>
                <Field name="responsibleDept" className="form-input" placeholder="e.g., IT Support" />
              </div>

              <div className="form-group">
                <label>Additional Notes (Optional)</label>
                <Field as="textarea" name="additionalNotes" className="form-input form-textarea" placeholder="Any other details..." />
              </div>

              <div className="flex gap-2 mt-3">
                <button type="submit" disabled={isSubmitting} className="shimmer-btn" style={{ flex: 1 }}>
                  {isSubmitting ? 'Saving...' : 'Save Item'}
                </button>
                <Link to="/" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Cancel
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
}
