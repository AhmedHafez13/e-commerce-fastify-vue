import { EMAIL_REGEX } from './app.regex';

export default class AppValidations {
  static required(value: any): boolean {
    return !(value === undefined || value === null || value.toString().trim() === '');
  }

  static lengthEqual(value: string | number, length: number): boolean {
    return value ? String(value).length === length : true;
  }

  static minLength(value: string, minLength: number): boolean {
    return value ? value.trim().length >= minLength : true;
  }

  static maxLength(value: string, maxLength: number): boolean {
    return value ? String(value).trim().length <= maxLength : true;
  }

  static lengthBetween(value: string, min: number, max: number) {
    return value ? value.trim().length >= min && value.trim().length <= max : true;
  }

  /**
   * @returns { Boolean } true if the value is falsy or the value matches
   * the given regex
   */
  static regexTest(value: string, regex: RegExp): boolean {
    if (regex && regex.lastIndex) {
      regex.lastIndex = 0;
    }
    return value ? regex.test(String(value)) : true;
  }

  static equals(value: any, compare: any): boolean {
    return value ? value === compare : true;
  }

  /**
   * @param exclusive if true, the given min value is excluded from the comparison.
   * false by default
   * @returns { Boolean } true if the value is falsy, is not a valid number,
   * or is greater than the given min value
   */
  static minValue(value: string, min: number, exclusive = false): boolean {
    if (value && !Number.isNaN(Number(value))) {
      return exclusive ? Number(value) > min : Number(value) >= min;
    }
    return true;
  }

  /**
   * @param exclusive if true, the given max value is excluded from the comparison.
   * false by default
   * @returns { Boolean } true if the value is falsy, is not a valid number,
   * or is less than the given max value
   */
  static maxValue(value: string, max: number, exclusive = false): boolean {
    if (value && !Number.isNaN(Number(value))) {
      return exclusive ? Number(value) < max : Number(value) <= max;
    }
    return true;
  }

  /**
   * @param beginning string or array of string of required beginnings
   * @returns { Boolean } true if the value begins with any of the given beginning values
   */
  static beginsWith(value: string, beginning: string | string[]): boolean {
    if (!value) return true;
    if (beginning instanceof Array) {
      return beginning.some((string) => value.startsWith(string));
    }
    return value.startsWith(beginning);
  }

  /**
   * @param domain the domain of the email (e.g., .edu.eg)
   * @returns { Boolean } true if the value is falsy or is a valid email
   */
  static isEmail(value: string): boolean {
    if (!value) return true;
    return this.regexTest(value, EMAIL_REGEX);
  }
}
