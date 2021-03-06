import * as caporal from 'caporal';
import * as inquirer from 'inquirer';

import ConfigService from '../services/ConfigService';
import EncryptionUtil from '../util/EncryptionUtil';

const configService = new ConfigService();

class ConfigCommands {

  public static addCommands() {
    (caporal as any)
      .command('config', 'Set local defaults')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--url <url>', 'Metricly URL', /.*/, 'https://app.metricly.com')
      .action((args, options, logger) => {
        const profileConfig = configService.getConfig()[options.profile] || {};

        if (!options.username || !options.password) {
            inquirer.prompt([{
              default: profileConfig.username,
              message: 'Metricly Username',
              name: 'username',
              type: 'input'
            }, {
              default: profileConfig.password,
              message: 'Metricly Password',
              name: 'password',
              type: 'password'
            }, {
              default: profileConfig.endpoint || 'https://app.metricly.com',
              message: 'Metricly Endpoint',
              name: 'endpoint',
              type: 'input'
            }]).then((answers: inquirer.Answers) => {
              const config = configService.getConfig();
              answers.password = EncryptionUtil.encrypt(answers.password);
              config[options.profile] = answers;
              configService.saveConfig(config);
            });
        } else {
          const config = configService.getConfig();
          options.password = EncryptionUtil.encrypt(options.password);

          if (options.url == null) {
            options.url = 'https://app.metricly.com';
          }

          const answers = {
            endpoint: options.url,
            password: options.password,
            username: options.username
          };

          config[options.profile] = answers;
          configService.saveConfig(config);
        }

      });
  }

}

export default ConfigCommands;
