import React from 'react';
import { render } from '@testing-library/react-native';
import Button from '../src/components/Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={mockOnPress} />);
    
    const button = getByText('Click Me');
    button.props.onPress();
    
    expect(mockOnPress).toHaveBeenCalled();
  });
});
