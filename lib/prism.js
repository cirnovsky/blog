// PrismSetup.js
import { useEffect } from 'react';
import Prism from '../public/prism/prism.js';
import { useRouter } from 'next/router';

const PrismSetup = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      // Re-initialize Prism.js on route changes
      Prism.highlightAll();
    };

    // Add event listener for route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    // Initialize Prism.js on the initial render
    Prism.highlightAll();

    // Remove event listener on component unmount
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return null;
};

export default PrismSetup;