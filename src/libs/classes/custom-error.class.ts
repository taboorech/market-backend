class CustomError extends Error {
  public statusNumber: number;

  constructor(statusNumber: number, message: string) {
    super();
    this.message = message;
    this.statusNumber = statusNumber;
  }
};

export { CustomError };