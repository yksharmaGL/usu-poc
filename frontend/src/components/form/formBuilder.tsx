'use client';

import { useEffect, useState } from 'react';
import { FormBuilder } from '@formio/react';
import axios from 'axios';
import 'formiojs/dist/formio.full.min.css';
import { registerCustomRatingComponent } from '@/src/lib/formio-init';

export default function Builder() {
    const FormBuilderComponent: any = FormBuilder
    const [registered, setRegistered] = useState(false);
    const [formSchema, setFormSchema] = useState<any>({ components: [] });

    useEffect(() => {
        registerCustomRatingComponent();
        setRegistered(true);
    }, [])

    const saveForm = async () => {
        if (!formSchema || !formSchema.components) {
            alert('Form schema is not ready.');
            return;
        }

        await axios.post('http://localhost:4000/api/form/meta_data', formSchema);
        alert('Form saved to backend');
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Form Builder</h2>

            <div className="border rounded-lg p-4 bg-white" style={{ minHeight: '600px' }}>
                {registered && <FormBuilderComponent
                    form={formSchema}
                    onChange={(schema: any) => setFormSchema(schema)}
                />}
            </div>

            <button
                onClick={saveForm}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
                Create Form template
            </button>
        </div>
    );
}
