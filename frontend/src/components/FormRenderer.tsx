'use client';
import { Form } from '@formio/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import classes from "./FormRenderer.module.css"
import { useState } from 'react';
import { getAllForm } from '../services/services';

export default function FormRenderer() {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const FormRenderer: any = Form;
  const { data, isLoading, isError } = useQuery({
    queryKey: ['form'],
    queryFn: getAllForm,
  });

  const { data: formData, isLoading: isLoadingForm, isError: isFormError } = useQuery({
    queryKey: ["form", selectedFormId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:4000/api/form/meta_data/${selectedFormId}`);
      return response.data;
    },
    enabled: !!selectedFormId
  })

  let dropdownContent;

  if (isLoading) {
    dropdownContent = <div className={classes.center}><p>Loading form...</p></div>
  }
  if (isError) {
    dropdownContent = <div className={classes.center}><p>Error loading form.</p></div>;
  }

  if (data) {
    // const formJSON = typeof data[0].form_data === 'string' ? JSON.parse(data[0].form_data) : data[0].form_data;
    dropdownContent = <>
      <label htmlFor="form-select" className={classes.dropdownLabel}>Select Form:</label>
      <select name="form-select" id="form-select" onChange={(e: any) => {
        setSelectedFormId(e.target.value)
      }} >
        <option value="" disabled >---Choose a form---</option>
        {data.map((item: any) => {
          return (
            <option value={item.id}>{`Form ${item.id}`}</option>
          )
        })}
      </select>
    </>
  }


  return (
    <div>
      <div className={classes.dropdownWrapper}>
        {dropdownContent}
      </div>
      <div className={classes.wrapper}>
        {/* <FormRenderer
          className={classes.formRenderer}
          form={formJSON}
          onSubmit={(submission: any) => console.log('Submitted:', submission)}
          src={""}
        /> */}
      </div>
    </div>
  );
}
