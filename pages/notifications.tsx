import React from 'react'

import { Layout } from '@/components/layout'
import { Activity } from '@/components/activity'

import { NextPageWithAuthAndLayout } from '@/lib/types'
import { InferQueryOutput, trpc } from '@/lib/trpc'

import { trpcReducer } from '@/lib/trpc'
import { AppRouter } from '@/server/routers/_app'

const Notifications: NextPageWithAuthAndLayout = () => {
  const inviteMutation = trpc.useMutation(['project.accept-invite'], {
    onError(error) {
      console.error(error)
    },
  })

  const inviteStatusMutation = trpc.useMutation(
    ['project.update-invite-status'],
    {
      onError(error) {
        console.error(error)
      },
    }
  )

  const handleAccept = async (
    projectId: number,
    userId: string,
    inviteId: number
  ) => {
    await Promise.all([
      inviteMutation.mutateAsync({
        projectId,
        userId,
      }),

      inviteStatusMutation.mutateAsync({
        inviteId,
      }),
    ])
  }

  const { state, dispatch } = trpcReducer.useTrpcReducer<AppRouter>(
    ['user.activity'],
    {
      arg_0: ['project.cancel-request'],
    }
  )
  const data = state.data as unknown as InferQueryOutput<'user.activity'>

  if (!state.data || !data?.activity.length) {
    return (
      <div className="flex flex-col justify-center items-center mt-4">
        <p>No new notifications</p>
      </div>
    )
  }
  return (
    <div className="flow-root">
      <ul className=" divide-y divide-primary">
        {state.data &&
          data.activity.map((activity, idx) => (
            <li key={idx} className="py-10 bg-white">
              <Activity onDiscard={dispatch} activity={activity} />
            </li>
          ))}
      </ul>
    </div>
  )
}

Notifications.auth = true

Notifications.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Notifications
