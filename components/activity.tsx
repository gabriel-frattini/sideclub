import { formatDistanceToNow } from 'date-fns'
import { useSession } from 'next-auth/react'
import { InferQueryOutput } from '@/lib/trpc'
import { Button } from './button'
import { ReducerActions } from 'trpc-reducer'
import { AppRouter } from '@/server/routers/_app'

export type ActivityProps = {
  activity: InferQueryOutput<'user.activity'>['activity'][0]
  onDiscard: (action: ReducerActions<AppRouter>) => void
}

export function Activity({ activity, onDiscard }: ActivityProps) {
  const { data: session } = useSession()
  if (!session) {
    return <></>
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
                    <p>Accept</p>
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
