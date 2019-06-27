export default class Errors {
  constructor(errors = {}) {
    this.errors = errors;
  }

  has(name) {
    return Object.prototype.hasOwnProperty.call(this.errors, name);
  }

  first(name = '') {
    if (this.has(name) && this.errors[name].length > 0) {
      return this.errors[name][0];
    }

    return null;
  }

  get(name) {
    return this.has(name) ? this.errors[name] : [];
  }
}