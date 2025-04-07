import React from 'react';
import { render, act, screen } from '@testing-library/react';
import App from './App';

// Mock the require.context for plant images
jest.mock('./plant_stages', () => {
  const requireContext = jest.fn();
  const keys = [
    './plant1.png', './plant2.png', './plant3.png', './plant4.png',
    './plant5.png', './plant6.png', './plant7.png', './plant8.png'
  ];
  requireContext.keys = jest.fn(() => keys);
  keys.forEach(key => {
    requireContext.mockImplementation(path => `mocked-path-${path}`);
  });
  return requireContext;
}, { virtual: true });

describe('Countdown App', () => {
  // Mock Date.now to control dates in tests
  let originalDate;
  
  beforeEach(() => {
    originalDate = global.Date;
    const mockDate = jest.fn(() => new Date('2025-02-05T10:00:00Z'));
    mockDate.now = jest.fn(() => new Date('2025-02-05T10:00:00Z').getTime());
    global.Date = mockDate;
    global.Date.UTC = originalDate.UTC;
    global.Date.parse = originalDate.parse;
    global.Date.prototype = originalDate.prototype;
  });

  afterEach(() => {
    global.Date = originalDate;
    jest.useRealTimers();
  });

  test('renders countdown for future date', () => {
    jest.useFakeTimers();
    
    render(<App />);
    
    expect(screen.getByText(/7 days, 14 hours, 0 minutes, 0 seconds/i)).toBeInTheDocument();
    expect(screen.getByAltText('plant_stage1')).toBeInTheDocument();
  });

  test('updates countdown every second', () => {
    jest.useFakeTimers();
    
    render(<App />);
    
    // Initial state
    expect(screen.getByText(/7 days, 14 hours, 0 minutes, 0 seconds/i)).toBeInTheDocument();
    
    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Should update the seconds
    expect(screen.getByText(/7 days, 13 hours, 59 minutes, 59 seconds/i)).toBeInTheDocument();
  });

  test('updates plant growth stage based on days remaining', () => {
    jest.useFakeTimers();
    
    // Set date to 5 days before birthday
    global.Date = jest.fn(() => new Date('2025-02-07T10:00:00Z'));
    global.Date.now = jest.fn(() => new Date('2025-02-07T10:00:00Z').getTime());
    
    render(<App />);
    
    // Should be at plant stage 2
    expect(screen.getByAltText('plant_stage2')).toBeInTheDocument();
    
    // Set date to 4 days before birthday
    global.Date = jest.fn(() => new Date('2025-02-08T10:00:00Z'));
    global.Date.now = jest.fn(() => new Date('2025-02-08T10:00:00Z').getTime());
    
    render(<App />);
    
    // Should be at plant stage 3
    expect(screen.getByAltText('plant_stage3')).toBeInTheDocument();
  });

  test('displays birthday message on birthday', () => {
    jest.useFakeTimers();
    
    // Set date to birthday
    global.Date = jest.fn(() => new Date('2025-02-12T10:00:00Z'));
    global.Date.now = jest.fn(() => new Date('2025-02-12T10:00:00Z').getTime());
    
    render(<App />);
    
    // Should display birthday message
    expect(screen.getByText('Happy Birthday my love!')).toBeInTheDocument();
    expect(screen.getByAltText('plant_stage8')).toBeInTheDocument();
  });

  test('displays empty message after birthday passes', () => {
    jest.useFakeTimers();
    
    // Set date to one day after birthday
    global.Date = jest.fn(() => new Date('2025-02-13T10:00:00Z'));
    global.Date.now = jest.fn(() => new Date('2025-02-13T10:00:00Z').getTime());
    
    render(<App />);
    
    // Should display empty message
    expect(screen.getByText(' ')).toBeInTheDocument();
    expect(screen.getByAltText('plant_stage8')).toBeInTheDocument();
  });

  test('cleans up interval on unmount', () => {
    jest.useFakeTimers();
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    
    const { unmount } = render(<App />);
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
