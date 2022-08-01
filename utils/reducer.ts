import { AppRouter } from '@/server/routers/_app'
import { ReducerActions, ReducerOutput } from 'trpc-reducer'

export function activityReducer(
  state: any,
  action: any,
  args: { args: { isInvite: boolean } }
): ReducerOutput<AppRouter> {
  const { type, payload } = action
  switch (type[0]) {
    case 'project.cancel-request':
      if (args && args.args.isInvite) {
        console.log('here???')
        return {
          ...state,
          invitedByUser: [],
        }
      }
      return {
        ...state,
        requestedByUser: [],
      }

    case 'project.request-to-join':
      return {
        ...state,
        requestedByUser: [
          {
            user: {
              id: payload.userId,
            },
            project: {
              ownerId: payload.ownerId,
            },
            id: payload.requestId,
          },
        ],
      }
    case 'project.vote':
      return {
        ...state,
        project: {
          ...state.project,
          votedBy: [
            ...state.project.votedBy,
            {
              user: { id: payload.userId },
              project: { id: payload.projectId },
              type: payload.type,
            },
          ],
        },
      }
    case 'project.undo-vote':
      return {
        ...state,
        project: {
          ...state.project,
          votedBy: [
            ...state.project.votedBy.filter(
              (item: any) => item.user.id !== payload.userId
            ),
          ],
        },
      }
    case 'project.invite-to-project':
      return {
        ...state,
        invitedByUser: [
          {
            user: {
              id: payload.userId,
            },
            project: {
              ownerId: payload.userId,
            },
            id: payload.id,
          },
        ],
      }

    default:
      return state
  }
}
