import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils/test-utils'

// Mock simple del dialog
function SimpleDialog({ isOpen, onClose, children }: any) {
  if (!isOpen) return null
  
  return (
    <div role="dialog" data-testid="dialog">
      <button onClick={onClose}>Close</button>
      <div>{children}</div>
    </div>
  )
}

describe('Dialog Component', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when closed', () => {
    render(
      <SimpleDialog isOpen={false} onClose={mockOnClose}>
        <p>Dialog content</p>
      </SimpleDialog>
    )
    
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
  })

  it('should render when open', () => {
    render(
      <SimpleDialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </SimpleDialog>
    )
    
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByText('Dialog content')).toBeInTheDocument()
  })

  it('should call onClose when close button clicked', () => {
    render(
      <SimpleDialog isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </SimpleDialog>
    )
    
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledOnce()
  })
})