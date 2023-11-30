import React from 'react';
import Panel from './components/Panel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Panel />
    </QueryClientProvider>
  )
};

export default App;
