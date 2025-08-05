let isRegistered = false;

export default async function registerCustomComponents(): Promise<void> {
  // Prevent multiple registrations
  if (isRegistered || typeof window === 'undefined') {
    return;
  }

  try {
    // Dynamic import to avoid SSR issues
    const [
      { Formio },
      customComponents,
      customSelectTmpl,
      dataTableTmpl,
      signatureTmpl,
      rating,
      textEditor
    ] = await Promise.all([
      import('@formio/js'),
      import('../components'),
      import('@src/templates/bootstrap/customSelect'),
      import('@src/templates/bootstrap/data-table'),
      import('@src/templates/bootstrap/signature'),
      import('@src/templates/bootstrap/rating'),
      import('@src/templates/bootstrap/text-editor')
    ]);

    Formio.use({
      components: customComponents.default,
      templates: {
        bootstrap: {
          customSelect: customSelectTmpl.default,
          dataTable: dataTableTmpl.default,
          signature: signatureTmpl.default,
          rating: rating.default,
          textEditor: textEditor.default
        }
      },
    });

    isRegistered = true;
    console.log('Custom components registered successfully');
  } catch (error) {
    console.error('Failed to register custom components:', error);
  }
}
