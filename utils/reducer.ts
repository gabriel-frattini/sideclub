import { AppRouter } from '@/server/routers/_app'
import { ReducerActions, ReducerOutput } from 'trpc-reducer'

export function activityReducer(
  state: any,
  action: any
): ReducerOutput<AppRouter> {
  const { type, payload } = action
  console.log('action', action)
  switch (type[0]) {
    case 'project.cancel-join-request':
      if (action.join) {
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
