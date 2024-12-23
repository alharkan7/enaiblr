interface Window {
  loadPyodide: any;
}

declare module 'pyodide' {
  interface PyodideInterface {
    loadPyodide: (config?: {
      indexURL?: string;
      fullStdLib?: boolean;
      stdin?: () => string;
      stdout?: (text: string) => void;
      stderr?: (text: string) => void;
    }) => Promise<any>;
  }
  
  const loadPyodide: PyodideInterface['loadPyodide'];
  export { loadPyodide };
}
