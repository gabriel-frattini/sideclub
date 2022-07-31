import { Button } from '@/components/button'
import { classNames } from '@/lib/classnames'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as React from 'react'
import { SpinnerIcon } from './icons'

type ActionButtonProps = {
  onAction: () => void
  onCancel: () => void
  didPerformAction: boolean
  didPerformActionChildren: React.ReactNode
  isLoading?: boolean
  onActionChildren: React.ReactNode
  disabled?: boolean
}

export function ActionButton({
  onAction,
  onCancel,
  didPerformAction,
  isLoading,
  onActionChildren,
  didPerformActionChildren,
  disabled,
}: ActionButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()

  function handleClick() {
    if (!session) {
      router.push('/sign-in')
    }
    didPerformAction ? onCancel() : onAction()
  }

  return (
    <Button onClick={handleClick} disabled={disabled || isLoading}>
      {isLoading ? (
        <SpinnerIcon className="w-8 h-4 animate-spin" />
      ) : didPerformAction ? (
        didPerformActionChildren
      ) : (
        onActionChildren
      )}
    </Button>
  )
}
