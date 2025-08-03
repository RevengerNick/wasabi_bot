// frontend/src/__tests__/components.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProductListItem from '../components/ProductListItem';
import QuantityControl from '../components/QuantityControl';
import Header from '../components/Header';

// Helper для рендеринга с роутером
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('UI Components', () => {
  const mockProduct = { id: 1, name: 'Тестовый Ролл', description: 'Очень вкусное', price: 999, image_url: 'test.jpg' };

  it('ProductListItem should render data correctly', () => {
    renderWithRouter(<ProductListItem product={mockProduct} />);
    expect(screen.getByText('Тестовый Ролл')).toBeInTheDocument();
    expect(screen.getByText('Очень вкусное')).toBeInTheDocument();
  });

  it('QuantityControl should switch from price to counter on click', async () => {
    const user = userEvent.setup();
    renderWithRouter(<QuantityControl product={mockProduct} />);
    
    const priceButton = screen.getByRole('button', { name: /999/i });
    await user.click(priceButton);

    expect(screen.queryByRole('button', { name: /999/i })).not.toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
  
  it('Header should render title', () => {
    renderWithRouter(<Header title="Тестовый заголовок" />);
    expect(screen.getByText("Тестовый заголовок")).toBeInTheDocument();
  });
});