import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './navigation';
import PostHog from 'posthog-react-native';
import Constants from 'expo-constants';

export default function App() {
  useEffect(() => {
    const extra: any = Constants.expoConfig?.extra || {};
    PostHog.init(extra.POSTHOG_API_KEY || 'PHC_XXXX', {
      host: extra.POSTHOG_HOST || 'https://app.posthog.com',
      captureApplicationLifecycleEvents: true
    });
  }, []);

  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
