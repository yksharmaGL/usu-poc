'use client';
import { Form } from '@formio/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import classes from "./FormRenderer.module.css"

export default function FormRenderer() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['form'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/api/form");
      // const res = await axios.get("https://raw.githubusercontent.com/formio/formio-app-todo/master/src/project.json");
      return res.data;
    },
  });

  if (isLoading) return <div className={classes.center}><p>Loading form...</p></div>;
  if (isError || !data.components) return <div className={classes.center}><p>Error loading form.</p></div>;

  return (
    <div className={classes.wrapper}>
      <Form
        className={classes.formRenderer}
        form={data}
        onSubmit={(submission) => console.log('Submitted:', submission)}
        src={""}
      />
    </div>
  );
}
