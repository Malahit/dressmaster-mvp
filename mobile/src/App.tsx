import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './navigation';
import PostHog from 'posthog-react-native';

export default function App() {
  useEffect(() => {
    // TODO: заменить ключ на реальный
    PostHog.init(process.env.EXPO_PUBLIC_POSTHOG_API_KEY || 'PHC_XXXX', {
      host: process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      captureApplicationLifecycleEvents: true
    });
  }, []);

  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
