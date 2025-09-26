import { describe, test, expect } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import LoadingSpinner from '@components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  test('debe renderizar con props por defecto', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  test('debe renderizar con texto personalizado', () => {
    const textoPersonalizado = 'Procesando datos...';
    render(<LoadingSpinner text={textoPersonalizado} />);
    
    expect(screen.getByText(textoPersonalizado)).toBeInTheDocument();
  });

  test('debe aplicar clases de tamaño correctas', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinner = screen.getByRole('status', { hidden: true }).querySelector('svg');
    expect(spinner).toHaveClass('w-4', 'h-4');

    rerender(<LoadingSpinner size="md" />);
    spinner = screen.getByRole('status', { hidden: true }).querySelector('svg');
    expect(spinner).toHaveClass('w-8', 'h-8');

    rerender(<LoadingSpinner size="lg" />);
    spinner = screen.getByRole('status', { hidden: true }).querySelector('svg');
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  test('debe aplicar clases de color correctas', () => {
    const { rerender } = render(<LoadingSpinner color="blue" />);
    let spinner = screen.getByRole('status', { hidden: true }).querySelector('svg');
    expect(spinner).toHaveClass('text-blue-600');

    rerender(<LoadingSpinner color="red" />);
    spinner = screen.getByRole('status', { hidden: true }).querySelector('svg');
    expect(spinner).toHaveClass('text-red-600');

    rerender(<LoadingSpinner color="green" />);
    spinner = screen.getByRole('status', { hidden: true }).querySelector('svg');
    expect(spinner).toHaveClass('text-green-600');
  });

  test('debe renderizar en modo pantalla completa', () => {
    render(<LoadingSpinner fullScreen={true} />);
    
    const container = screen.getByRole('status', { hidden: true }).parentElement;
    expect(container).toHaveClass('fixed', 'inset-0', 'bg-white', 'bg-opacity-75', 'z-50');
  });

  test('debe renderizar en modo normal (no pantalla completa)', () => {
    render(<LoadingSpinner fullScreen={false} />);
    
    const container = screen.getByRole('status', { hidden: true }).parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'p-4');
    expect(container).not.toHaveClass('fixed', 'inset-0');
  });

  test('debe tener animación de rotación', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status', { hidden: true }).querySelector('svg');
    expect(spinner).toHaveClass('animate-spin');
  });

  test('debe renderizar elementos SVG correctos', () => {
    render(<LoadingSpinner />);
    
    const svg = screen.getByRole('status', { hidden: true }).querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('fill', 'none');
    
    // Verificar que tiene los elementos circle y path
    const circles = svg.querySelectorAll('circle');
    const paths = svg.querySelectorAll('path');
    expect(circles.length).toBeGreaterThan(0);
    expect(paths.length).toBeGreaterThan(0);
  });

  test('debe ser accesible', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  test('debe combinar múltiples props correctamente', () => {
    render(
      <LoadingSpinner 
        size="lg" 
        color="purple" 
        text="Cargando curso..." 
        fullScreen={true} 
      />
    );
    
    expect(screen.getByText('Cargando curso...')).toBeInTheDocument();
    
    const container = screen.getByRole('status', { hidden: true }).parentElement;
    expect(container).toHaveClass('fixed', 'inset-0');
    
    const spinner = screen.getByRole('status', { hidden: true }).querySelector('svg');
    expect(spinner).toHaveClass('w-12', 'h-12', 'text-purple-600', 'animate-spin');
  });

  test('debe manejar valores de props inválidos graciosamente', () => {
    // Debería usar valores por defecto para props inválidas
    render(<LoadingSpinner size="invalid" color="invalid" />);
    
    const spinner = screen.getByRole('status', { hidden: true }).querySelector('svg');
    // Debería fallar graciosamente y no romper el componente
    expect(spinner).toBeInTheDocument();
  });
});