'use client';
import { useState } from 'react';

const Form: any = dynamic(
    () => import('@formio/react').then(mod => mod.Form),
    {
        ssr: false,
        loading: () => (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading Form Builder...</span>
                </div>
            </div>
        )
    }
);

import { useMutation, useQuery } from '@tanstack/react-query';
import classes from "./FormRenderer.module.css"
import { addFormData, getAllForm, getFormById } from '../../services/form-services/formServices';
import dynamic from 'next/dynamic';

export default function FormRenderer() {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['form'],
    queryFn: async ({ signal }) => {
      const data = await getAllForm({ signal });
      setSelectedFormId(data?.[0]?.id);

      return data;
    },
    staleTime: 0,
    gcTime: 0,
  });

  const { data: formData, isLoading: isLoadingForm, isError: isFormError } = useQuery({
    queryKey: ["form", selectedFormId],
    queryFn: ({ signal }) => getFormById({ signal, selectedFormId }),
    enabled: !!selectedFormId
  })

  const { mutate,
    isPending: isPendingEditEvent,
    isError: isErrorEditEvent,
    error: errorEditEvent
  } =
    useMutation({
      mutationKey: ["form"],
      mutationFn: addFormData
    })

  console.log("formData", formData);

  let dropdownContent;

  if (isLoading) {
    dropdownContent = <div className={classes.center}><p>Loading form...</p></div>
  }
  if (isError) {
    dropdownContent = <div className={classes.center}><p>Error loading form.</p></div>;
  }

  if (data) {
    dropdownContent = <>
      <label htmlFor="form-select" className={classes.dropdownLabel}>Select Form:</label>
      <select name="form-select" id="form-select" onChange={(e: any) => {
        setSelectedFormId(e.target.value)
      }} >
        <option value="" disabled >---Choose a form---</option>
        {data.map((item: any) => {
          return (
            <option key={item.id} value={item.id}>{`Form ${item.id}`}</option>
          )
        })}
      </select>
    </>
  }

  let formContent;

  if (isLoadingForm) {
    formContent = <div className={classes.center}><p>Loading form...</p></div>
  }
  if (isFormError) {
    formContent = <div className={classes.center}><p>Error loading form content.</p></div>;
  }

  const onSubmitClickHandler = (formData: any) => {
    if (formData?.data) {
      const form = {
        metadata_id: selectedFormId,
        form_data: formData.data
      }
      mutate({ data: form })
    }
  }

  if (formData) {
    const formJSON = typeof formData.form_data === 'string' ? JSON.parse(formData.form_data) : formData.form_data;
    formContent = <Form
      form={formJSON}
      onSubmit={(submission: any) => {
        onSubmitClickHandler(submission);
      }}
      src={""}
    />
  }

  return (
    <div>
      <div className={classes.dropdownWrapper}>
        {dropdownContent}
      </div>
      <div className={classes.wrapper}>
        {formContent}
      </div>
    </div>
  );
}
