export default class SomethingWentWrongError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SomethingWentWrongError'
  }
}
