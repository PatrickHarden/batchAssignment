/** use for PUT calls with useSWRMutation hook
 * NOTE: trigger accepts an object that determines 
 * request body as well as request type (PUT will be default)
 * example: const { trigger } = useSWRMutation(`/api/v1/assessments/${user_id}/assign`, createModifyingRequest);
 * trigger({
        body: [
          {
            id: editStudentDialog?.data.assessmentId,
            studentId: editStudentDialog?.data.studentId,
            action: 'cancel'
          }
        ],
        requestType: 'POST'
      })
 */
type HTTPModifyingMethod = 'PUT' | 'POST' | 'DELETE';

export function createModifyingRequest(method: HTTPModifyingMethod = 'PUT') {
  return (url: string, { arg }: { arg: object }) => {
    return fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arg)
    });
  };
}
