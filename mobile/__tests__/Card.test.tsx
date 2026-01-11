import React from 'react';
import { render } from '@testing-library/react-native';
import Card from '../src/components/Card';
import { Text } from 'react-native';

describe('Card Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>Test Content</Text>
      </Card>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });
});
