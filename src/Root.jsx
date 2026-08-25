import { useEffect, useState } from 'react';
import App from './App.jsx';
import { AdminApp } from './admin/AdminApp.jsx';
import { AdminGate } from './admin/AdminGate.jsx';
import { JoinCircle } from './pages/JoinCircle.jsx';

function getRoute() {
  const hash = window.location.hash;
  if (hash.startsWith('#/admin')) return { name: 'admin' };
  const joinMatch = hash.match(/^#\/join\/([A-Za-z0-9]+)/);
  if (joinMatch) return { name: 'join', code: joinMatch[1] };
  return { name: 'app' };
}

export default function Root() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (route.name === 'admin') {
    return (
      <AdminGate>
        <AdminApp />
      </AdminGate>
    );
  }
  if (route.name === 'join') {
    return <JoinCircle code={route.code} />;
  }
  return <App />;
}
