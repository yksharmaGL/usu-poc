'use client';

import { Form, FormProps } from '@formio/react';

const theme = process.env.NEXT_PUBLIC_FORMIO_THEME || 'default';

export default function ThemedFormRenderer(props: FormProps) {
  return (
    <div className={`formio-theme-${theme}`}>
      <Form {...props} />
    </div>
  );
}
