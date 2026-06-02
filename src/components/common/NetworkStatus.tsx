import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

export default function NetworkStatus() {
  const { t } = useTranslation();
  const [online, setOnline] = useState(navigator.onLine);
  const [showMessage, setShowMessage] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  const handleOnline = useCallback(() => {
    setOnline(true);
    if (wasOffline) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
    setWasOffline(false);
  }, [wasOffline]);

  const handleOffline = useCallback(() => {
    setOnline(false);
    setWasOffline(true);
    setShowMessage(true);
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  if (online && !showMessage) return null;

  return (
    <div className={`network-status ${online ? 'network-online' : 'network-offline'}`}>
      <span>{online ? t('network.online') : t('network.offline')}</span>
    </div>
  );
}
