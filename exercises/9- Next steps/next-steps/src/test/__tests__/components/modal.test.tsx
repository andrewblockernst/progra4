import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils/test-utils'

// Mock simple del modal
function SimpleModal({ isOpen, onClose, children }: any) {
  if (!isOpen) return null
  
  return (
    <div role="dialog" data-testid="modal">
      <button onClick={onClose}>Close</button>
      <div>{children}</div>
    </div>
  )
}

describe('Modal Component', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when closed', () => {
    render(
      <SimpleModal isOpen={false} onClose={mockOnClose}>
        <p>Modal content</p>
      </SimpleModal>
    )
    
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('should render when open', () => {
    render(
      <SimpleModal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </SimpleModal>
    )
    
    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('should call onClose when close button clicked', () => {
    render(
      <SimpleModal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </SimpleModal>
    )
    
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledOnce()
  })
})