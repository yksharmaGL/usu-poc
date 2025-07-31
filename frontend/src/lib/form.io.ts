// Only import and initialize Form.io on the client side
let Formio: any = null;
let FormBuilder: any = null;

if (typeof window !== 'undefined') {
  // Dynamic import only on client side
  import('@formio/js').then((formioModule) => {
    Formio = formioModule.Formio;
  });
  
  import('@formio/react').then((reactModule) => {
    FormBuilder = reactModule.FormBuilder;
  });
}

export { Formio, FormBuilder };
