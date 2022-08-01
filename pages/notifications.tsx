import React from 'react'

import { Layout } from '@/components/layout'

import { NextPageWithAuthAndLayout } from '@/lib/types'

import { trpcReducer } from '@/lib/trpc'
import { formatDistanceToNow } from 'date-fns'
import { useSession } from 'next-auth/react'
import { InferQueryOutput } from '@/lib/trpc'
import { Button } from '../components/button'

import { TDispatch } from 'trpc-reducer'
import { AppRouter } from '@/server/routers/_app'

const Notifications: NextPageWithAuthAndLayout = () => {
  const { state, dispatch } = trpcReducer.useTrpcReducer(['user.activity'], {
    arg_0: ['project.cancel-request'],
    arg_1: ['project.accept-invite'],
    arg_2: ['project.update-invite-status'],
  })

  if (!state.data || !state.data?.activity.length) {
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
          state.data.activity.map((activity, idx) => (
            <li key={idx} className="py-10 bg-white">
              <Activity dispatch={dispatch} activity={activity} />
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

export type ActivityProps = {
  activity: InferQueryOutput<'user.activity'>['activity'][0]
  dispatch: (action: TDispatch<AppRouter>, ...args: any) => void
}

export function Activity({ activity, dispatch }: ActivityProps) {
  const { data: session } = useSession()
  if (!session) {
    return <></>
  }

  const handleAcceptInvite = async ({
    projectId,
    userId,
    inviteId,
  }: {
    projectId: number
    userId: string
    inviteId: number
  }) => {
    await Promise.all([
      dispatch({
        payload: {
          projectId,
          userId,
        },
        type: ['project.accept-invite'],
      }),

      dispatch({
        payload: {
          inviteId,
        },
        type: ['project.update-invite-status'],
      }),
    ])
  }

  return (
    <div className="flex flex-col justify-center items-center mt-4">
      <div>
        <div className="flex mb-6 gap-6">
          <p>{activity.project.title}</p>

          {activity.project.owner.id === session.user.id ? (
            <>
              {activity.type === 'JOIN' ? (
                <div>
                  <p>
                    {activity.user.name} wants to join {activity.project.title}
                  </p>{' '}
                  <div>
                    <button
                      onClick={() =>
                        handleAcceptInvite({
                          inviteId: activity.id,
                          projectId: activity.project.id,
                          userId: session.user.id,
                        })
                      }
                    >
                      Accept
                    </button>
                    <p>Reject</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p>
                    {activity.status === 'PENDING' ? (
                      <div className="flex gap-4">
                        <p>
                          Invite was sent to{' '}
                          <strong>{activity.user.name}</strong>{' '}
                          <time dateTime={activity.createdAt.toISOString()}>
                            {formatDistanceToNow(activity.createdAt)} ago
                          </time>{' '}
                        </p>

                        <Button>Remove</Button>
                      </div>
                    ) : (
                      <p>
                        {activity.user.name} has{' '}
                        {activity.status === 'ACCEPT' ? 'acceted' : 'rejected'}{' '}
                        your invite to {activity.project.title}
                      </p>
                    )}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                {activity.status === 'PENDING' ? (
                  <div className="flex gap-4">
                    <p>
                      Requested to join{' '}
                      <strong className="mr-2">{activity.project.title}</strong>{' '}
                      <time dateTime={activity.createdAt.toISOString()}>
                        {formatDistanceToNow(activity.createdAt)} ago
                      </time>{' '}
                    </p>

                    <Button>Remove</Button>
                  </div>
                ) : (
                  <p>
                    {activity.user.name}{' '}
                    {activity.status === 'ACCEPT' ? 'accepted' : 'rejected'}{' '}
                    your request to join {activity.project.title}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
