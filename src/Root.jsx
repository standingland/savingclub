import { useEffect, useState } from 'react';
import App from './App.jsx';
import { AdminApp } from './admin/AdminApp.jsx';
import { AdminGate } from './admin/AdminGate.jsx';

function getRoute() {
  return window.location.hash.startsWith('#/admin') ? 'admin' : 'app';
}

export default function Root() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route === 'admin' ? (
    <AdminGate>
      <AdminApp />
    </AdminGate>
  ) : (
    <App />
  );
}
