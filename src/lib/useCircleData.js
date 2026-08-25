import { useCallback, useEffect, useState } from 'react';
import { fetchMyCircles, fetchNextDue } from './circles.js';

export function useCircleData(memberId) {
  const [circles, setCircles] = useState([]);
  const [nextDue, setNextDue] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!memberId) {
      setCircles([]);
      setNextDue(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [circlesData, dueData] = await Promise.all([fetchMyCircles(memberId), fetchNextDue(memberId)]);
    setCircles(circlesData);
    setNextDue(dueData);
    setLoading(false);
  }, [memberId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { circles, nextDue, loading, refresh };
}
