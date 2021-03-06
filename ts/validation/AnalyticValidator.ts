import * as fs from 'fs';
import * as jsonValidator from 'json-dup-key-validator';

import ErrorTracker from '../util/ErrorTracker';
import Logger from '../util/Logger';

class AnalyticValidator {

  private indent = '    ';
  private logger = new Logger(this.indent);

  public validate(analyticsList: any[], location: string, analytic: string): string[] {
    const errorTracker = new ErrorTracker(analytic, this.indent);

    const validJsonMessage = 'Analytic is valid JSON';
    try {
      const json = fs.readFileSync(location + analytic, 'utf8');

      const ana = JSON.parse(json);
      errorTracker.assertTrue(true, validJsonMessage);

      const jsonParseError = jsonValidator.validate(json, false);
      errorTracker.assertTrue(!jsonParseError, 'No duplicate object keys');

        // tslint:disable-next-line:max-line-length
      errorTracker.assertTrue(analyticsList.filter((analyticItem) => analyticItem.data.file === 'analyticConfigurations/' + analytic).length === 1, 'Analytic found in package.json list');
    } catch (err) {
      if (err.name === 'SyntaxError') {
        errorTracker.assertTrue(false, validJsonMessage);
      } else {
        errorTracker.log(err);
      }
    }
    return errorTracker.getErrors();
  }
}

export default AnalyticValidator;
