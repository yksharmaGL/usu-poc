'use client';
import { Form } from "@formio/react";
import { useTheme } from "../context/ThemeContext";

export default function ThemedFormRenderer(props) {
  const theme = useTheme();
  return (
    <div className={`formio-theme-${theme}`}>
      <Form {...props} />
    </div>
  );
}
