import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumb, { type BreadcrumbItem } from '../Breadcrumb';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Breadcrumb', () => {
  const mockItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/es' },
    { name: 'Classes', url: '/es/clases' },
    { name: 'Dancehall', url: '/es/clases/dancehall-barcelona', isActive: true },
  ];

  it('renders all breadcrumb items', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Classes')).toBeInTheDocument();
    expect(screen.getByText('Dancehall')).toBeInTheDocument();
  });

  it('renders navigation with aria-label', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toBeInTheDocument();
  });

  it('marks the active item with aria-current', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);

    const currentPage = screen.getByText('Dancehall').closest('[aria-current="page"]');
    expect(currentPage).toBeInTheDocument();
  });

  it('renders links for non-active items', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const classesLink = screen.getByRole('link', { name: 'Classes' });

    expect(homeLink).toHaveAttribute('href', '/es');
    expect(classesLink).toHaveAttribute('href', '/es/clases');
  });

  it('renders separators between items', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);

    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(2);
  });

  it('applies custom className', () => {
    renderWithRouter(<Breadcrumb items={mockItems} className="custom-class" />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-class');
  });

  it('handles single item breadcrumb', () => {
    const singleItem: BreadcrumbItem[] = [{ name: 'Home', url: '/es', isActive: true }];
    renderWithRouter(<Breadcrumb items={singleItem} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('/')).not.toBeInTheDocument();
  });

  it('includes schema.org microdata attributes', () => {
    renderWithRouter(<Breadcrumb items={mockItems} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('itemscope');
    expect(nav).toHaveAttribute('itemtype', 'https://schema.org/BreadcrumbList');
  });

  it('treats last item as active by default', () => {
    const itemsWithoutActive: BreadcrumbItem[] = [
      { name: 'Home', url: '/es' },
      { name: 'About', url: '/es/about' },
    ];
    renderWithRouter(<Breadcrumb items={itemsWithoutActive} />);

    // Last item should be marked as current page
    const aboutItem = screen.getByText('About').closest('[aria-current="page"]');
    expect(aboutItem).toBeInTheDocument();
  });
});
