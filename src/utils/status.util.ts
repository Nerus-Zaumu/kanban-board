export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN PROGRESS',
  COMPLETED = 'COMPLETED',
}

export async function checkStatus(status: Status) {
  if (!Object.values(Status).includes(status)) {
    return {
      success: false,
      message: 'Status must either be TODO, IN PROGRESS or COMPLETED',
    };
  }
}
